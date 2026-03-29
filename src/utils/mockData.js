export const TEACHING_SESSIONS_MOCK = [
    { initials: 'TH', name: 'Thanh Hà', topic: 'React', time: 'T2 10/3 · 14:00', badge: '📅 Đã đặt', badgeCls: 'bg-sky-100 text-sky-600' },
    { initials: 'DK', name: 'Duy Khang', topic: 'React', time: 'T4 12/3 · 9:00', badge: '⏳ Chờ duyệt', badgeCls: 'bg-amber-100 text-amber-600' },
];

export const LEARNING_SESSIONS_MOCK = [
    { initials: 'MA', name: 'Minh Anh', topic: 'React Development', time: 'T2 10/3 · 9:00 SA', badge: '🔵 Sắp tới', badgeCls: 'bg-blue-50 text-blue-600' },
    { initials: 'TL', name: 'Thùy Linh', topic: 'UI/UX Design', time: 'T4 12/3 · 9:00 SA', badge: '🔵 Sắp tới', badgeCls: 'bg-blue-50 text-blue-600' },
];

export const AI_TEACHERS_MOCK = [
    { initials: 'MA', name: 'Minh Anh', subject: 'React Development', rating: '4.8', stars: 5, rate: 15, match: 98, highlight: true, avatarGrad: 'from-violet-500 to-fuchsia-500' },
    { initials: 'TL', name: 'Thùy Linh', subject: 'UI/UX Design', rating: '4.7', stars: 4, rate: 12, match: null, highlight: false, avatarGrad: 'from-purple-500 to-pink-500' },
    { initials: 'QB', name: 'Quốc Bảo', subject: 'Python & ML', rating: '4.9', stars: 5, rate: 18, match: null, highlight: false, avatarGrad: 'from-teal-500 to-emerald-500' },
];

export const MY_PATHS_MOCK = [
    {
        id: 'p1',
        title: 'React từ Zero đến Production',
        emoji: '⚛️',
        mentor: {
            name: 'Minh Anh',
            role: 'Senior Frontend Engineer @ Shopee',
            avatarText: 'MA',
            verified: true,
            rating: 4.9,
            students: 128
        },
        duration: '10 tuần',
        level: 'Intermediate',
        totalCredits: 120,
        progress: 20,
        description: 'Lộ trình 10 tuần học React thực chiến — xây dựng 3 dự án thật, không chỉ đọc docs. Kết thúc có portfolio xịn để đi phỏng vấn.',
        currentModule: 2,
        modules: [
            { id: 'm1', title: 'JavaScript Foundations', status: 'completed', completedDate: '15/01', criteria: '3/3' },
            { id: 'm2', title: 'React Core Concepts', status: 'ongoing', progress: 17, criteria: '0/4', sessionsNeeded: 4, sessionsBooked: 2 },
            { id: 'm3', title: 'Hooks & Side Effects', status: 'locked', sessionsNeeded: 3, sessionsBooked: 0 },
            { id: 'm4', title: 'React Router & State Management', status: 'locked', sessionsNeeded: 3, sessionsBooked: 0 },
            { id: 'm5', title: 'Capstone Project', status: 'locked', sessionsNeeded: 4, sessionsBooked: 0 }
        ]
    }
];

export const EXPLORE_PATHS_MOCK = [
    {
        id: 'e1',
        title: 'React từ Zero đến Production',
        enrolled: true,
        logoBg: 'bg-indigo-100',
        logoText: 'text-indigo-600',
        emoji: '⚛️',
        mentor: {
            name: 'Minh Anh',
            role: 'Senior Frontend Engineer @ Shopee',
            avatarText: 'MA',
            verified: true,
            rating: 4.9,
            students: 128,
            graduates: 8,
            costPerSession: 15,
            totalSessions: 17
        },
        duration: '10 tuần',
        level: 'Intermediate',
        totalCredits: 120,
        students: 34,
        category: 'Công nghệ',
        description: 'Lộ trình 10 tuần học React thực chiến — xây dựng 3 dự án thật, không chỉ đọc docs. Kết thúc có portfolio xịn để đi phỏng vấn.',
        modules: [
            { id: 'm1', title: 'JavaScript Foundations', desc: '3 buổi • Mini project: To-do app thuần JS' },
            { id: 'm2', title: 'React Core Concepts', desc: '4 buổi • Xây dựng UI component library nhỏ' },
            { id: 'm3', title: 'Hooks & Side Effects', desc: '3 buổi • Custom hook: useLocalStorage, useFetch' },
            { id: 'm4', title: 'React Router & State Management', desc: '3 buổi • SPA với authentication flow hoàn chỉnh' },
            { id: 'm5', title: 'Capstone Project', desc: '4 buổi • Production-ready app trong portfolio' }
        ]
    },
    {
        id: 'e2',
        title: 'UX Design: Từ Tư Duy đến Portfolio',
        enrolled: false,
        logoBg: 'bg-pink-100',
        logoText: 'text-pink-600',
        emoji: '🎨',
        mentor: {
            name: 'Thùy Linh',
            role: 'Product Designer @ Grab',
            avatarText: 'TL',
            verified: true,
            rating: 5.0,
            students: 86,
            graduates: 12,
            costPerSession: 12,
            totalSessions: 12
        },
        duration: '12 tuần',
        level: 'Beginner',
        totalCredits: 144,
        students: 22,
        category: 'Thiết kế',
        description: '12 tuần học UX thực chiến — empathy, research, wireframe, prototype, usability test. Ra trường với 3 case study portfolio-ready.',
        modules: [
            { id: 'm1', title: 'Design Thinking & Empathy', desc: '2 buổi • Thấu hiểu người dùng qua phỏng vấn' },
            { id: 'm2', title: 'User Research & Personas', desc: '3 buổi • Phân tích dữ liệu, tạo chân dung Users' },
            { id: 'm3', title: 'Information Architecture', desc: '2 buổi • Sơ đồ luồng, User Journey' },
            { id: 'm4', title: 'Wireframing & Prototyping', desc: '3 buổi • Figma cơ bản đến nâng cao' },
            { id: 'm5', title: 'Usability Testing & Portfolio', desc: '2 buổi • Đánh giá thiết kế và làm Case Study' }
        ]
    }
];
