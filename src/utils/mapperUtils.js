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
        subSkills: [ts.skillCategory, ts.level], // Tạm dùng map category và level
        level: ts.level,
        rating: 5.0, // Mock rating
        totalReviews: 0,
        totalSessions: 0,
        responseTime: '<1h',
        price: ts.creditsPerHour,
        match: 95,
        slots: 0, // Sẽ fill sau từ API /slots/open hoặc pass 0
        trustScore: 90,
        isTopRated: false,
        bio: ts.teacherBio || ts.experienceDesc, // Ưu tiên Bio user, fallback bằng experience
        bioFull: ts.teacherBio || ts.experienceDesc,
        teachingStyle: ts.experienceDesc,
        outcomes: ts.outcomeDesc ? ts.outcomeDesc.split('\n').filter(Boolean) : ['Đạt được mục tiêu mong muốn'],
        certs: [], // Mock list cho evidence type cert
        evidences: [{ type: 'veteran', label: 'Verified Teacher', verified: true }],
        portfolio: [],
        reviews: [],
        availableSlots: [], // Sẽ load khi click
    };
};
