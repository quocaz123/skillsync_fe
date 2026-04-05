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
        type: 'mentor',
        thumbnailFrom: '#6366f1',
        thumbnailTo: '#8b5cf6',
        status: 'ONGOING',        // ONGOING | COMPLETED (FE Lộ trình của tôi chỉ hiển thị hai nhãn)
        ctaType: 'book_session',  // continue_video | book_session | view_session | unlock_module
        upcomingSession: null,
        enrolledDate: '01/01/2026',
        completedDate: null,
        totalHours: 12,
        mentorSessionsDone: 4,
        skill: 'Frontend Development',
        mentor: {
            name: 'Minh Anh',
            role: 'Senior Frontend Engineer @ Shopee',
            avatarText: 'MA',
            avatarGrad: 'from-violet-500 to-indigo-500',
            verified: true,
            rating: 4.9,
            students: 128
        },
        duration: '10 tuần',
        level: 'Intermediate',
        totalCredits: 120,
        progress: 20,
        modulesDone: 1,
        modulesTotal: 5,
        currentModuleTitle: 'React Core Concepts',
        currentLesson: 'Component Lifecycle & useEffect',
        description: 'Lộ trình 10 tuần học React thực chiến — xây dựng 3 dự án thật, không chỉ đọc docs. Kết thúc có portfolio xịn để đi phỏng vấn.',
        modules: [
            { id: 'm1', title: 'JavaScript Foundations', status: 'completed', completedDate: '15/01', criteria: '3/3' },
            { id: 'm2', title: 'React Core Concepts', status: 'ongoing', progress: 17, criteria: '0/4', sessionsNeeded: 4, sessionsBooked: 2 },
            { id: 'm3', title: 'Hooks & Side Effects', status: 'locked', sessionsNeeded: 3, sessionsBooked: 0 },
            { id: 'm4', title: 'React Router & State Management', status: 'locked', sessionsNeeded: 3, sessionsBooked: 0 },
            { id: 'm5', title: 'Capstone Project', status: 'locked', sessionsNeeded: 4, sessionsBooked: 0 }
        ]
    },
    {
        id: 'p2',
        title: 'UX Design: Từ Tư Duy đến Portfolio',
        emoji: '🎨',
        type: 'mentor',
        thumbnailFrom: '#ec4899',
        thumbnailTo: '#f43f5e',
        status: 'ONGOING',
        ctaType: 'view_session',
        upcomingSession: { time: 'T4, 09/04 · 9:00 SA', mentor: 'Thùy Linh' },
        enrolledDate: '15/02/2026',
        completedDate: null,
        totalHours: 8,
        mentorSessionsDone: 3,
        skill: 'UI/UX Design',
        mentor: {
            name: 'Thùy Linh',
            role: 'Product Designer @ Grab',
            avatarText: 'TL',
            avatarGrad: 'from-pink-500 to-rose-500',
            verified: true,
            rating: 5.0,
            students: 86
        },
        duration: '12 tuần',
        level: 'Beginner',
        totalCredits: 144,
        progress: 35,
        modulesDone: 2,
        modulesTotal: 5,
        currentModuleTitle: 'Information Architecture',
        currentLesson: 'Sơ đồ luồng & User Journey Map',
        description: '12 tuần học UX thực chiến — empathy, research, wireframe, prototype, usability test.',
        modules: [
            { id: 'm1', title: 'Design Thinking & Empathy', status: 'completed', completedDate: '22/02', criteria: '3/3' },
            { id: 'm2', title: 'User Research & Personas', status: 'completed', completedDate: '08/03', criteria: '3/3' },
            { id: 'm3', title: 'Information Architecture', status: 'ongoing', progress: 40, criteria: '1/4', sessionsNeeded: 2, sessionsBooked: 1 },
            { id: 'm4', title: 'Wireframing & Prototyping', status: 'locked', sessionsNeeded: 3, sessionsBooked: 0 },
            { id: 'm5', title: 'Usability Testing & Portfolio', status: 'locked', sessionsNeeded: 2, sessionsBooked: 0 }
        ]
    },
    {
        id: 'p3',
        title: 'Kỹ năng giao tiếp & Thuyết trình',
        emoji: '🎤',
        type: 'system',
        thumbnailFrom: '#6366f1',
        thumbnailTo: '#06b6d4',
        status: 'ONGOING',
        ctaType: 'continue_video',
        upcomingSession: null,
        enrolledDate: '10/01/2026',
        completedDate: null,
        totalHours: 4,
        mentorSessionsDone: 0,
        skill: 'Soft Skills',
        mentor: null,
        duration: '4 tuần',
        level: 'Beginner',
        totalCredits: 0,
        progress: 55,
        modulesDone: 1,
        modulesTotal: 3,
        currentModuleTitle: 'Kỹ năng thuyết trình',
        currentLesson: 'Cách kiểm soát ngôn ngữ cơ thể',
        description: 'Lộ trình hệ thống giúp bạn tự tin trình bày ý tưởng và thuyết phục trong mọi cuộc họp.',
        modules: [
            { id: 'm1', title: 'Kỹ năng nghe chủ động', status: 'completed', completedDate: '18/01', criteria: '3/3' },
            { id: 'm2', title: 'Kỹ năng thuyết trình', status: 'ongoing', progress: 55, criteria: '2/4', sessionsNeeded: 0, sessionsBooked: 0 },
            { id: 'm3', title: 'Viết email & báo cáo chuyên nghiệp', status: 'locked', sessionsNeeded: 0, sessionsBooked: 0 }
        ]
    },
    {
        id: 'p4',
        title: 'Python & Machine Learning Fundamentals',
        emoji: '🐍',
        type: 'mentor',
        thumbnailFrom: '#10b981',
        thumbnailTo: '#06b6d4',
        status: 'COMPLETED',
        ctaType: null,
        upcomingSession: null,
        enrolledDate: '01/10/2025',
        completedDate: '25/12/2025',
        totalHours: 32,
        mentorSessionsDone: 14,
        skill: 'Data Science',
        mentor: {
            name: 'Quốc Bảo',
            role: 'ML Engineer @ VNG',
            avatarText: 'QB',
            avatarGrad: 'from-teal-500 to-emerald-500',
            verified: true,
            rating: 4.8,
            students: 210
        },
        duration: '8 tuần',
        level: 'Intermediate',
        totalCredits: 96,
        progress: 100,
        modulesDone: 4,
        modulesTotal: 4,
        currentModuleTitle: null,
        currentLesson: null,
        description: 'Từ Python cơ bản đến xây dựng mô hình ML thực tế — bao gồm pandas, scikit-learn và mini project.',
        modules: []
    }
];

export const EXPLORE_PATHS_MOCK = [
    {
        id: 'e1',
        title: 'React từ Zero đến Production',
        type: 'mentor', // 'mentor' | 'system'
        skill: 'Frontend Development',
        tags: ['Mentor-guided', 'Intermediate'],
        thumbnailFrom: '#6366f1',
        thumbnailTo: '#8b5cf6',
        emoji: '⚛️',
        mentor: {
            name: 'Minh Anh',
            role: 'Senior Frontend Engineer @ Shopee',
            avatarText: 'MA',
            avatarGrad: 'from-violet-500 to-indigo-500',
            verified: true,
            rating: 4.9,
            learners: 128,
        },
        duration: '10 tuần',
        level: 'Intermediate',
        totalCredits: 120,
        moduleCount: 5,
        lessonCount: 17,
        rating: 4.9,
        learnerCount: 128,
        featured: true,
        newest: false,
        category: 'Công nghệ',
        description: 'Lộ trình 10 tuần học React thực chiến — xây dựng 3 dự án thật, không chỉ đọc docs. Kết thúc có portfolio xịn để đi phỏng vấn.',
    },
    {
        id: 'e2',
        title: 'UX Design: Từ Tư Duy đến Portfolio',
        type: 'mentor',
        skill: 'UI/UX Design',
        tags: ['Mentor-guided', 'Beginner'],
        thumbnailFrom: '#ec4899',
        thumbnailTo: '#f43f5e',
        emoji: '🎨',
        mentor: {
            name: 'Thùy Linh',
            role: 'Product Designer @ Grab',
            avatarText: 'TL',
            avatarGrad: 'from-pink-500 to-rose-500',
            verified: true,
            rating: 5.0,
            learners: 86,
        },
        duration: '12 tuần',
        level: 'Beginner',
        totalCredits: 144,
        moduleCount: 5,
        lessonCount: 12,
        rating: 5.0,
        learnerCount: 86,
        featured: true,
        newest: true,
        category: 'Thiết kế',
        description: '12 tuần học UX thực chiến — empathy, research, wireframe, prototype, usability test. Ra trường với 3 case study portfolio-ready.',
    },
    {
        id: 'e3',
        title: 'Python & Machine Learning Fundamentals',
        type: 'mentor',
        skill: 'Data Science',
        tags: ['Mentor-guided', 'Intermediate'],
        thumbnailFrom: '#10b981',
        thumbnailTo: '#06b6d4',
        emoji: '🐍',
        mentor: {
            name: 'Quốc Bảo',
            role: 'ML Engineer @ VNG',
            avatarText: 'QB',
            avatarGrad: 'from-teal-500 to-emerald-500',
            verified: true,
            rating: 4.8,
            learners: 210,
        },
        duration: '8 tuần',
        level: 'Intermediate',
        totalCredits: 96,
        moduleCount: 4,
        lessonCount: 14,
        rating: 4.8,
        learnerCount: 210,
        featured: false,
        newest: true,
        category: 'Công nghệ',
        description: 'Từ Python cơ bản đến xây dựng mô hình ML thực tế — bao gồm pandas, scikit-learn và mini project dự đoán giá nhà.',
    },
    {
        id: 'e4',
        title: 'Lộ trình Backend Node.js',
        type: 'system',
        skill: 'Backend Development',
        tags: ['Self-paced', 'Advanced'],
        thumbnailFrom: '#f59e0b',
        thumbnailTo: '#f97316',
        emoji: '🖥️',
        mentor: null,
        duration: '6 tuần',
        level: 'Advanced',
        totalCredits: 0,
        moduleCount: 6,
        lessonCount: 20,
        rating: 4.6,
        learnerCount: 340,
        featured: false,
        newest: false,
        category: 'Công nghệ',
        description: 'Hệ thống lộ trình chuẩn mực từ SkillSync — tự học Node.js, Express, REST API và triển khai thực tế lên cloud.',
    },
    {
        id: 'e5',
        title: 'Kỹ năng giao tiếp & Thuyết trình',
        type: 'system',
        skill: 'Soft Skills',
        tags: ['Self-paced', 'Beginner'],
        thumbnailFrom: '#6366f1',
        thumbnailTo: '#06b6d4',
        emoji: '🎤',
        mentor: null,
        duration: '4 tuần',
        level: 'Beginner',
        totalCredits: 0,
        moduleCount: 3,
        lessonCount: 9,
        rating: 4.5,
        learnerCount: 512,
        featured: true,
        newest: false,
        category: 'Kỹ năng mềm',
        description: 'Lộ trình hệ thống giúp bạn tự tin trình bày ý tưởng, viết email chuyên nghiệp và thuyết phục trong mọi cuộc họp.',
    },
    {
        id: 'e6',
        title: 'iOS Development với Swift',
        type: 'mentor',
        skill: 'Mobile Development',
        tags: ['Mentor-guided', 'Intermediate'],
        thumbnailFrom: '#0ea5e9',
        thumbnailTo: '#6366f1',
        emoji: '📱',
        mentor: {
            name: 'Đức Huy',
            role: 'iOS Engineer @ Zalo',
            avatarText: 'DH',
            avatarGrad: 'from-sky-500 to-indigo-500',
            verified: false,
            rating: 4.7,
            learners: 65,
        },
        duration: '10 tuần',
        level: 'Intermediate',
        totalCredits: 150,
        moduleCount: 5,
        lessonCount: 16,
        rating: 4.7,
        learnerCount: 65,
        featured: false,
        newest: true,
        category: 'Công nghệ',
        description: 'Xây dựng ứng dụng iOS thực chiến với Swift và UIKit — từ Hello World đến publish App Store.',
    },
];

/** Phân bổ số bài vào từng module */
function distributeLessonCounts(totalLessons, moduleCount) {
    const base = Math.floor(totalLessons / moduleCount);
    const rem = totalLessons % moduleCount;
    return Array.from({ length: moduleCount }, (_, i) => base + (i < rem ? 1 : 0));
}

/**
 * Mock chi tiết lộ trình (khi API chưa có / offline) — dùng cho FE preview & fallback.
 */
export function buildPathDetailMock(pathId) {
    const base = EXPLORE_PATHS_MOCK.find((p) => p.id === pathId);
    if (!base) return null;

    const isMentor = base.type === 'mentor';
    const counts = distributeLessonCounts(base.lessonCount, base.moduleCount);

    const modules = counts.map((videoLessonCount, idx) => {
        const order = idx + 1;
        const totalVideoMinutes = videoLessonCount * 14 + (idx % 3) * 5;
        const hasQuiz = idx % 2 === 0;
        const mentorSupport = isMentor && idx >= 2;
        let practiceSessionLabel = null;
        if (isMentor && idx === base.moduleCount - 1) practiceSessionLabel = '1 buổi thực hành cùng mentor';
        if (!isMentor && idx === 1) practiceSessionLabel = 'Bài lab tự thực hành';

        const lessonTitlesPreview = Array.from({ length: Math.min(4, videoLessonCount) }, (_, j) => {
            const labels = ['Giới thiệu & mục tiêu', 'Nội dung cốt lõi', 'Thực hành nhanh', 'Tổng kết mini'];
            return `${labels[j] || `Phần ${j + 1}`} — ${base.title.split(':')[0].trim()}`;
        });

        return {
            order,
            title: `Module ${order}: ${base.skill} — Giai đoạn ${order}`,
            description:
                idx === 0
                    ? `Làm quen nền tảng và mục tiêu module. ${base.description.slice(0, 80)}…`
                    : `Đi sâu kỹ năng thực chiến, bài tập và checklist hoàn thành cho giai đoạn ${order}.`,
            videoLessonCount,
            totalVideoMinutes,
            hasQuiz,
            mentorSupport,
            practiceSessionLabel,
            lessonTitlesPreview,
        };
    });

    const mentorExtended =
        isMentor && base.mentor
            ? {
                  ...base.mentor,
                  bio:
                      'Mentor có nhiều năm kinh nghiệm làm việc thực tế, hỗ trợ học viên qua session 1-1 và nhận xét bài tập.',
                  teachingSkillName: base.skill,
                  teachingSkillLevel: base.level,
                  creditsPerHour: 12 + Math.round(base.totalCredits / 40),
              }
            : null;

    return {
        id: base.id,
        title: base.title,
        shortDescription: base.description.length > 160 ? `${base.description.slice(0, 157)}…` : base.description,
        description: base.description,
        skill: base.skill,
        level: base.level,
        duration: base.duration,
        totalModules: base.moduleCount,
        totalLessons: base.lessonCount,
        totalCredits: base.totalCredits,
        pathType: base.type,
        thumbnailFrom: base.thumbnailFrom,
        thumbnailTo: base.thumbnailTo,
        emoji: base.emoji,
        learnerCount: base.learnerCount,
        rating: base.rating,
        previewAvailable: true,
        previewUrl: null,
        learningOutcomes: [
            'Nắm được lộ trình và sản phẩm đầu ra rõ ràng sau khi hoàn thành.',
            'Áp dụng được kiến thức qua bài tập và project nhỏ trong từng module.',
            'Tự tin trình bày portfolio / kết quả học tập phù hợp với mục tiêu nghề nghiệp.',
        ],
        whoShouldJoin: `Phù hợp cho người muốn phát triển kỹ năng ${base.skill} ở mức ${base.level === 'Beginner' ? 'mới bắt đầu' : 'nâng cao hơn'}, học có lộ trình và có thể kết hợp ${isMentor ? 'mentor' : 'tự học linh hoạt'}.`,
        prerequisites:
            base.level === 'Beginner'
                ? null
                : 'Nên có nền tảng tương đương cấp độ ngay dưới hoặc kinh nghiệm làm việc liên quan.',
        mentor: mentorExtended,
        modules,
        enrolled: false,
        enrollmentId: null,
    };
}

// ─── User learning workspace (GET /api/user-learning-paths/{id}) — mock fallback ───

function mapMyStatusToWorkspace(st) {
    if (st === 'completed') return 'COMPLETED';
    if (st === 'ongoing') return 'ONGOING';
    return 'LOCKED';
}

function lessonStatusesForModule(modStatus, nLessons, seed) {
    const out = [];
    if (modStatus === 'LOCKED') {
        for (let i = 0; i < nLessons; i++) out.push('NOT_STARTED');
        return out;
    }
    if (modStatus === 'COMPLETED') {
        for (let i = 0; i < nLessons; i++) out.push('COMPLETED');
        return out;
    }
    // ONGOING: một phần đã xong, một bài đang học
    const done = Math.min(Math.max(1, seed % Math.max(1, nLessons - 1)), nLessons - 1);
    for (let i = 0; i < nLessons; i++) {
        if (i < done) out.push('COMPLETED');
        else if (i === done) out.push('IN_PROGRESS');
        else out.push('NOT_STARTED');
    }
    return out;
}

/**
 * Khi backend/mock không gửi chi tiết từng module (vd. path đã hoàn thành),
 * vẫn tổng hợp đủ module + bài để FE hiển thị curriculum (xem lại sau khi học xong).
 */
function syntheticModulesWhenEmpty(pathId, title, my, ex) {
    const nMod = Math.max(1, my?.modulesTotal ?? ex?.moduleCount ?? 4);
    const allDone = my?.status === 'COMPLETED' || (my?.progress ?? 0) >= 100;

    const presetTitles = {
        p4: ['Python & môi trường', 'Pandas & NumPy', 'Scikit-learn & ML', 'Mini project & triển khai'],
        e3: ['Python & môi trường', 'Pandas & NumPy', 'Scikit-learn & ML', 'Mini project & triển khai'],
    };
    const preset = presetTitles[pathId];

    return Array.from({ length: nMod }, (_, i) => ({
        id: `m${i + 1}`,
        title: preset?.[i] ?? `Module ${i + 1}: ${title.length > 32 ? `${title.slice(0, 32)}…` : title}`,
        status: allDone ? 'completed' : i === 0 ? 'completed' : i === 1 ? 'ongoing' : 'locked',
    }));
}

/**
 * Mock workspace học path — render đúng theo shape API (FE không tự suy luận completion).
 */
export function buildUserLearningPathMock(pathId) {
    const my = MY_PATHS_MOCK.find((p) => p.id === pathId);
    const ex = EXPLORE_PATHS_MOCK.find((p) => p.id === pathId);
    if (!my && !ex) return null;

    const title = my?.title ?? ex.title;
    const pathType = my?.type ?? ex.type;
    const emoji = my?.emoji ?? ex.emoji;
    const thumbnailFrom = my?.thumbnailFrom ?? ex.thumbnailFrom;
    const thumbnailTo = my?.thumbnailTo ?? ex.thumbnailTo;
    const moduleCount = my?.modulesTotal ?? ex.moduleCount;
    const totalLessons = ex?.lessonCount ?? 16;
    const counts = distributeLessonCounts(totalLessons, moduleCount);

    const mentor =
        pathType === 'mentor'
            ? my?.mentor ?? ex?.mentor ?? null
            : null;

    let progressPercent = my?.progress ?? 22;
    let modulesSrc = my?.modules;

    if (!modulesSrc?.length) {
        if (my) {
            modulesSrc = syntheticModulesWhenEmpty(pathId, title, my, ex);
            if (my.status === 'COMPLETED' || (my.progress ?? 0) >= 100) {
                progressPercent = my.progress ?? 100;
            }
        } else if (ex) {
            modulesSrc = Array.from({ length: moduleCount }, (_, i) => ({
                id: `m${i + 1}`,
                title: `Module ${i + 1}`,
                status: i === 0 ? 'completed' : i === 1 ? 'ongoing' : 'locked',
            }));
            progressPercent = 25;
        }
    }

    const modules = modulesSrc.map((raw, idx) => {
        const ws = mapMyStatusToWorkspace(raw.status);
        const n = counts[idx] ?? 4;
        const stArr = lessonStatusesForModule(ws, n, idx + pathId.length);
        const lessons = stArr.map((ls, j) => ({
            id: `${raw.id}-l${j + 1}`,
            title:
                ws === 'LOCKED'
                    ? `Bài ${j + 1} (sẽ mở khi đủ điều kiện)`
                    : `Bài ${j + 1}: ${title.split(' ').slice(0, 2).join(' ')} — phần ${j + 1}`,
            durationMinutes: 8 + ((idx + j) % 7) * 2,
            status: ls,
        }));
        const lessonsCompleted = lessons.filter((l) => l.status === 'COMPLETED').length;
        const mentorSupport = pathType === 'mentor' && idx >= 1;

        const hasQuiz = idx % 2 === 0;
        let quizStatus = 'NOT_ATTEMPTED';
        if (!hasQuiz) quizStatus = 'NOT_ATTEMPTED';
        else if (ws === 'LOCKED') quizStatus = 'NOT_ATTEMPTED';
        else if (ws === 'COMPLETED') quizStatus = 'PASSED';
        else if (ws === 'ONGOING') {
            if (lessonsCompleted < n) quizStatus = 'NOT_ATTEMPTED';
            else quizStatus = 'NOT_ATTEMPTED';
        }

        const supportStatus =
            mentorSupport && ws !== 'LOCKED'
                ? idx === 2 && pathType === 'mentor'
                    ? 'SENT'
                    : 'NONE'
                : null;

        return {
            id: raw.id,
            order: idx + 1,
            title: raw.title,
            shortDescription: `Hoàn thành các bài học video và checklist trong module ${idx + 1}.`,
            goal: `Nắm vững phần cốt lõi của ${raw.title} và làm được bài tập cuối module.`,
            status: ws,
            lessonsCompleted,
            lessonsTotal: n,
            mentorSupport,
            quiz: {
                enabled: hasQuiz,
                status: hasQuiz ? quizStatus : 'NOT_ATTEMPTED',
            },
            supportRequest: mentorSupport
                ? { status: supportStatus || 'NONE', id: supportStatus !== 'NONE' ? `sr-${raw.id}` : null }
                : null,
            lessons,
        };
    });

    const ongoing = modules.find((m) => m.status === 'ONGOING');
    const currentModuleId = ongoing?.id ?? null;
    const inProgLesson = ongoing?.lessons.find((l) => l.status === 'IN_PROGRESS');
    const nextNotStarted = ongoing?.lessons.find((l) => l.status === 'NOT_STARTED');
    const lastInProgressLesson = ongoing
        ? inProgLesson
            ? { lessonId: inProgLesson.id, moduleId: ongoing.id, title: inProgLesson.title }
            : nextNotStarted
              ? { lessonId: nextNotStarted.id, moduleId: ongoing.id, title: nextNotStarted.title }
              : null
        : null;

    const completedMods = modules.filter((m) => m.status === 'COMPLETED').length;

    let primaryCta = {
        type: 'CONTINUE_LESSON',
        label: 'Tiếp tục bài học',
        moduleId: ongoing?.id,
        lessonId: inProgLesson?.id ?? nextNotStarted?.id,
    };
    if (ongoing) {
        const allLessonsDone = ongoing.lessons.every((l) => l.status === 'COMPLETED');
        const q = ongoing.quiz;
        if (allLessonsDone && q.enabled && q.status === 'NOT_ATTEMPTED') {
            primaryCta = { type: 'TAKE_QUIZ', label: 'Làm quiz', moduleId: ongoing.id, quizModuleId: ongoing.id };
        }
    }
    const nextLocked = modules.find((m) => m.status === 'LOCKED');
    if (ongoing && ongoing.quiz.enabled && ongoing.quiz.status === 'PASSED' && nextLocked) {
        primaryCta = { type: 'OPEN_NEXT_MODULE', label: 'Mở module tiếp theo', moduleId: nextLocked.id };
    }

    const allModulesCompleted = modules.length > 0 && modules.every((m) => m.status === 'COMPLETED');
    if (allModulesCompleted && !ongoing) {
        const m0 = modules[0];
        const l0 = m0?.lessons?.[0];
        primaryCta = {
            type: 'REVIEW_PATH',
            label: 'Xem lại khóa học',
            moduleId: m0?.id,
            lessonId: l0?.id,
        };
    }

    return {
        pathId: pathId,
        pathTitle: title,
        pathType,
        emoji,
        thumbnailFrom,
        thumbnailTo,
        progressPercent,
        completedModulesCount: completedMods,
        totalModulesCount: modules.length,
        currentModuleId,
        lastInProgressLesson,
        mentor,
        modules,
        primaryCta,
        learnerNote:
            pathType === 'mentor' && title.includes('Python')
                ? 'Ghi chú: có thể xem lại mọi bài và quiz đã làm bên dưới.'
                : 'Ghi chú của bạn: ôn lại phần quan trọng trước khi làm quiz.',
        nextRecommendedHint: ongoing
            ? `Hoàn thành module "${ongoing.title}" để mở khóa phần tiếp theo.`
            : allModulesCompleted
              ? 'Bạn đã hoàn thành path — curriculum vẫn mở để ôn tập.'
              : 'Bạn đã hoàn thành tất cả module.',
        missionHint: '+50 credits khi hoàn thành quiz đầu tiên trong tuần.',
    };
}

