/** Mock dữ liệu — dễ thay bằng API sau */
export const MOCK_SKILLS = [
    'UX Design',
    'Product Management',
    'English Communication',
    'Public Speaking',
    'Frontend Development',
];

export const MOCK_MENTOR = {
    name: 'Thùy Linh',
    title: 'Product Designer @ Grab',
    avatarText: 'TL',
    avatarGrad: 'from-pink-500 to-rose-500',
};

/** Lấy chữ cái đầu từ tên (tối đa 2 ký tự) cho avatar */
function initialsFromName(name) {
    if (!name || typeof name !== 'string') return 'M';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

/**
 * Preview mentor đồng bộ với hồ sơ user đăng nhập (GET /users/me / store).
 * Fallback MOCK nếu chưa có user.
 */
export function buildMentorPreviewFromUser(user) {
    if (!user) {
        return { ...MOCK_MENTOR };
    }
    const name = (user.fullName || user.name || '').trim() || 'Mentor';
    const bioLine =
        typeof user.bio === 'string' && user.bio.trim()
            ? user.bio.trim().split(/\n/)[0].slice(0, 100)
            : null;
    const title = bioLine || 'Mentor tại SkillSync';

    return {
        name,
        title,
        avatarText: initialsFromName(name),
        avatarGrad: 'from-violet-500 to-indigo-500',
        avatarUrl: user.avatarUrl || null,
    };
}

export const LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];
