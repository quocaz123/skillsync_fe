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
        avatarUrl: ts.teacherAvatar || null, // ảnh từ R2 (URL công khai)
        skill: ts.skillName,
        subSkills: [ts.skillCategory, ts.level],
        level: ts.level,
        rating: ts.averageRating ? Number(ts.averageRating.toFixed(1)) : 0,
        totalReviews: ts.totalReviews || 0,
        totalSessions: ts.totalSessions || 0,
        responseTime: '<1h',
        price: ts.creditsPerHour,
        match: 95,
        slots: ts.openSlotsCount || 0,
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
        certs: (ts.evidences || []).filter(e => e.evidenceType === 'CERTIFICATE' || e.evidenceType === 'TEACHING_CERTIFICATE'),
        evidences: (ts.evidences || []).map(e => ({
            ...e, // keep original fields for certs and portfolio filtering
            id: e.id,
            type: e.evidenceType === 'VIDEO_INTRO' ? 'video' :
                  e.evidenceType === 'LINKEDIN' ? 'linkedin' :
                  e.evidenceType === 'CERTIFICATE' ? 'cert' :
                  e.evidenceType === 'TEACHING_CERTIFICATE' ? 'event' :
                  e.evidenceType === 'WORK_PROOF' ? 'link' : 'badge',
            label: e.title,
            verified: e.isVerified
        })),
        portfolio: (ts.evidences || []).filter(e => e.evidenceType === 'PORTFOLIO' || e.evidenceType === 'LINKEDIN' || e.evidenceType === 'GITHUB' || e.evidenceType === 'BEHANCE' || e.evidenceType === 'WORK_PROOF' || e.evidenceType === 'VIDEO_INTRO'),
        reviews: (ts.reviews || []).map(r => ({
            id: r.id,
            name: r.reviewerName,
            initials: (r.reviewerName || 'T').substring(0, 1).toUpperCase(),
            color: colors[(r.reviewerName?.length || 0) % colors.length],
            avatar: r.reviewerAvatar,
            rating: r.rating,
            comment: r.comment,
            date: r.createdAt
        })),
        availableSlots: [],
    };
};
