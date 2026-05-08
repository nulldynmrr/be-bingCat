const prisma = require("../lib/prisma");
const Groq = require("groq-sdk"); // Panggil di atas file
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

class UserService {
  async getDashboard(userId) {
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
      select: {
        full_name: true,
        level: true,
        xp: true,
        gems: true,
        streak_count: true,
        last_activity_at: true,
      },
    });

    if (!profile) throw new Error("Profil tidak ditemukan");

    const progress = await prisma.userProgress.findMany({
      where: { user_id: userId },
      select: { chapter_id: true, status: true, progress_percent: true },
    });

    const today = new Date();
    const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
    const streakChecklist = ["M", "T", "W", "T", "F", "S", "S"].map(
      (day, index) => {
        const isCompleted =
          index <= currentDayIndex &&
          currentDayIndex - index < profile.streak_count;
        return { day, completed: isCompleted };
      },
    );

    return {
      profile,
      map_progress: progress,
      streak: { count: profile.streak_count, checklist: streakChecklist },
    };
  }

  async getChapterMetadata(chapterId) {
    const questions = await prisma.question.findMany({
      where: { chapter_id: chapterId },
      select: { type: true, context_type: true },
    });

    if (questions.length === 0)
      throw new Error("Bab ini belum memiliki soal di database");

    const totalQuestions = questions.length;
    const hasGrammar = questions.some((q) => q.type === "grammar");
    const hasReading = questions.some((q) => q.type === "reading");

    let targets = ["Merespons pertanyaan dengan tepat"];
    if (hasGrammar) targets.push("Menganalisis struktur grammar kalimat");
    if (hasReading) targets.push("Memahami konteks dari teks bacaan panjang");

    return {
      chapter_id: chapterId,
      total_questions: totalQuestions,
      time_estimate: `${totalQuestions * 2} Menit`,
      targets: targets,

      rewards_potential: {
        xp: totalQuestions * 10,
        gems: Math.max(1, Math.floor(totalQuestions / 3)),
      },
    };
  }

  async getLeaderboard() {
    const allUsers = await prisma.profile.findMany({
      orderBy: { xp: "desc" },
      take: 20,
      select: { id: true, full_name: true, xp: true, level: true },
    });

    return allUsers.map((user, index) => {
      const rank = index + 1;
      let league = "Liga Mahasiswa";
      if (rank <= 3) league = "Liga Ruby";
      else if (rank <= 10) league = "Liga Emas";
      else if (rank <= 20) league = "Liga Perak";

      return { rank, league, ...user };
    });
  }

  async getProfile(userId) {
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
      select: {
        id: true,
        full_name: true,
        university: true,
        major: true,
        created_at: true,
        xp: true,
        streak_count: true,
        level: true,
      },
    });

    const friends = await prisma.profile.findMany({
      where: { university: profile.university, id: { not: userId } },
      orderBy: { xp: "desc" },
      take: 5,
      select: { id: true, full_name: true, xp: true, level: true },
    });

    const completedChapters = await prisma.userProgress.count({
      where: { user_id: userId, status: "completed" },
    });

    const achievements = [
      {
        title: "Pemanasan",
        description: "Selesaikan 1 bab pertama.",
        progress_percent: Math.min((completedChapters / 1) * 100, 100),
      },
      {
        title: "Mahasiswa Rajin",
        description: "Selesaikan 5 bab pembelajaran.",
        progress_percent: Math.min((completedChapters / 5) * 100, 100),
      },
    ];

    return { ...profile, achievements, friends };
  }

  async updateProfile(userId, data) {
    return await prisma.profile.update({
      where: { id: userId },
      data: {
        full_name: data.full_name,
        university: data.university,
        major: data.major,
      },
      select: { full_name: true, university: true, major: true },
    });
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await prisma.profile.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User tidak ditemukan");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Password lama salah");

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.profile.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return true;
  }

  async updateProgress(userId, chapterId, progressPercent, isCompleted) {
    const progress = await prisma.userProgress.upsert({
      where: {
        user_id_chapter_id: { user_id: userId, chapter_id: chapterId },
      },
      update: {
        progress_percent: progressPercent,
        status: isCompleted ? "completed" : "locked",
      },
      create: {
        user_id: userId,
        chapter_id: chapterId,
        progress_percent: progressPercent,
        status: isCompleted ? "completed" : "locked",
      },
    });

    if (isCompleted) {
      await prisma.profile.update({
        where: { id: userId },
        data: {
          xp: { increment: 50 },
          gems: { increment: 5 },
        },
      });
    }

    return progress;
  }

  async getQuestions(chapterId) {
    const questions = await prisma.question.findMany({
      where: { chapter_id: chapterId },

      select: {
        id: true,
        type: true,
        context_type: true,
        context: true,
        question_text: true,
        options: true,
      },
    });

    if (questions.length === 0)
      throw new Error("Soal belum tersedia untuk chapter ini.");
    return questions;
  }

  async searchFriends(userId, keyword) {
    if (!keyword) return [];

    return await prisma.profile.findMany({
      where: {
        id: { not: userId },
        full_name: { contains: keyword, mode: "insensitive" },
      },
      select: { id: true, full_name: true, xp: true, level: true },
      take: 10,
    });
  }

  async saveOnboarding(userId, level) {
    return await prisma.profile.update({
      where: { id: userId },
      data: { onboarding_level: level },
      select: { full_name: true, onboarding_level: true },
    });
  }

  async askAITutor(userId, question) {
    const user = await prisma.profile.findUnique({
      where: { id: userId },
      select: { full_name: true, level: true },
    });

    const prompt = `Kamu adalah 'binCat', tutor bahasa Inggris yang ramah dan suportif untuk mahasiswa Telkom University. 
    Kamu sedang berbicara dengan ${user.full_name} (Level ${user.level}). 
    Jawab pertanyaan ini dengan ringkas, jelas, gunakan bahasa Indonesia yang dicampur sedikit bahasa Inggris santai, dan berikan contoh kalimatnya: 
    Pertanyaan: "${question}"`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 250,
    });

    return {
      answer:
        chatCompletion.choices[0]?.message?.content ||
        "Meow! binCat sedang bingung, coba tanya lagi ya!",
    };
  }

  async checkAnswer(questionId, userAnswer) {
    const question = await prisma.question.findUnique({
      where: { id: parseInt(questionId) },
      select: { correct_answer: true, explanation: true },
    });

    if (!question) throw new Error("Soal tidak ditemukan");

    const isCorrect = question.correct_answer === userAnswer;

    return {
      is_correct: isCorrect,
      correct_answer: question.correct_answer,
      hint:
        question.explanation || "Tidak ada penjelasan tambahan untuk soal ini.",
    };
  }
}

module.exports = new UserService();
