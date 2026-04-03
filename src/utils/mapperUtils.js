export const mapSkillToMentor = (ts) => {
    // Generate an avatar badge from name if no image
    const name = ts.teacherName || 'Unknown';
    const parts = name.split(' ');
    const initials = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : name.substring(0, 2).toUpperCase();
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500', 'bg-teal-500'];
    const color = colors[name.length % colors.length];

    return {
        id: ts.id, // ID của TeachingSkill
        teacherId: ts.teacherId,
        name: name,
        avatar: initials,
        avatarBg: color,
        avatarUrl: ts.teacherAvatar || null, // ảnh thật từ S3
        skill: ts.skillName,
        subSkills: [ts.skillCategory, ts.level],
        level: ts.level,
        rating: 5.0,
        totalReviews: 0,
        totalSessions: 0,
        responseTime: '<1h',
        price: ts.creditsPerHour,
        match: 95,
        slots: 0,
        trustScore: 90,
        isTopRated: false,
        // "Về tôi" — ưu tiên Bio của user, nếu chưa có thì dùng experienceDesc
        bio: ts.teacherBio || ts.experienceDesc,
        bioFull: ts.teacherBio || ts.experienceDesc,
        // "Phong cách dạy" — field riêng biệt, fallback nếu chưa điền
        teachingStyle: ts.teachingStyle || null,
        // "Tôi sẽ dạy bạn" — mỗi dòng mới là 1 outcome, dùng \n để tách
        outcomes: ts.outcomeDesc
            ? ts.outcomeDesc.split('\n').map(s => s.trim()).filter(Boolean)
            : [],
        certs: [],
        evidences: [{ type: 'veteran', label: 'Verified Teacher', verified: true }],
        portfolio: [],
        reviews: [],
        availableSlots: [],
    };
};
