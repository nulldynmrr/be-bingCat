const prisma = require("../lib/prisma");

class AdminService {
  async getDashboardStats() {
    const totalMahasiswa = await prisma.profile.count({
      where: { role: "user" },
    });
    const totalSoal = await prisma.question.count();

    const profiles = await prisma.profile.aggregate({
      _avg: { xp: true },
      where: { role: "user" },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeToday = await prisma.profile.count({
      where: { last_activity_at: { gte: today }, role: "user" },
    });

    const recentActivity = await prisma.profile.findMany({
      where: { role: "user" },
      orderBy: { last_activity_at: "desc" },
      take: 5,
      select: { full_name: true, xp: true, last_activity_at: true },
    });

    return {
      overview: {
        total_mahasiswa: totalMahasiswa,
        total_soal: totalSoal,
        rata_rata_xp: Math.round(profiles._avg.xp || 0),
        siswa_aktif_hari_ini: activeToday,
      },
      recent_activity: recentActivity,
    };
  }

  async getQuestions(searchQuery, typeFilter) {
    let whereClause = {};

    if (searchQuery) {
      whereClause.question_text = {
        contains: searchQuery,
        mode: "insensitive",
      };
    }
    if (
      typeFilter &&
      ["listening", "reading", "structure"].includes(typeFilter)
    ) {
      whereClause.type = typeFilter;
    }

    return await prisma.question.findMany({
      where: whereClause,
      orderBy: { created_at: "desc" },
    });
  }

  async addQuestion(data) {
    if (!["listening", "reading", "structure"].includes(data.type)) {
      throw new Error("Tipe soal harus: listening, reading, atau structure");
    }

    return await prisma.question.create({
      data: {
        chapter_id: parseInt(data.chapter_id),
        type: data.type,
        context_type: data.context_type || "none",
        context: data.context || {},
        question_text: data.question_text,
        options: data.options,
        correct_answer: data.correct_answer,
        explanation: data.explanation || "",
      },
    });
  }

  async uploadQuestions(questionsArray) {
    const createdQuestions = await prisma.question.createMany({
      data: questionsArray,
      skipDuplicates: true,
    });
    return createdQuestions.count;
  }
}

module.exports = new AdminService();
