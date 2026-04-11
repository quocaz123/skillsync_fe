import { mergeInitialPath } from './pathFormUtils';

const now = () => new Date().toISOString();

/** Seed mentor paths — đủ trạng thái demo */
export function seedMentorPaths() {
    const base = (id, title, status, extra = {}) => ({
        id,
        pathType: 'MENTOR',
        title,
        shortDescription: 'Mô tả ngắn cho ' + title,
        description: 'Mô tả chi tiết.',
        skill: 'UX',
        level: 'Beginner',
        estimatedDuration: '3 tuần',
        thumbnail: '',
        priceType: 'FREE',
        totalCreditsCost: '',
        status,
        moduleCount: 2,
        lessonCount: 4,
        learners: 12,
        createdAt: extra.createdAt || now(),
        updatedAt: now(),
        modules: mergeInitialPath('MENTOR', {
            title,
            skill: 'UX',
            level: 'Beginner',
            modules: [
                {
                    title: 'Module 1',
                    description: '',
                    objective: '',
                    estimatedDuration: '',
                    hasQuiz: true,
                    quizRequired: false,
                    enableSupport: true,
                    lessons: [
                        {
                            title: 'Bài 1',
                            description: '',
                            videoUrl: 'https://example.com/video1',
                            duration: '10 phút',
                            isPreview: true,
                        },
                    ],
                },
            ],
        }).modules,
        ...extra,
    });

    return [
        base('mp-1', 'UX cho người mới bắt đầu', 'DRAFT', { createdAt: '2026-03-01T08:00:00.000Z' }),
        base('mp-2', 'Wireframe nhanh với Figma', 'PENDING_APPROVAL', {
            learners: 0,
            createdAt: '2026-02-15T10:00:00.000Z',
        }),
        base('mp-3', 'Design system cơ bản', 'APPROVED', { learners: 48, createdAt: '2026-01-20T12:00:00.000Z' }),
        base('mp-4', 'Prototype tương tác', 'REJECTED', {
            rejectionReason: 'Nội dung module 2 chưa đủ bài học có video URL hợp lệ.',
            learners: 0,
            createdAt: '2026-03-05T09:00:00.000Z',
        }),
    ];
}

export function seedAdminSystemPaths() {
    const mk = (id, title, status) => ({
        id,
        pathType: 'SYSTEM',
        title,
        shortDescription: 'Khóa hệ thống SkillSync — ' + title,
        description: 'Mô tả đầy đủ.',
        skill: 'Frontend',
        level: 'Intermediate',
        estimatedDuration: '6 tuần',
        thumbnail: '',
        priceType: status === 'PUBLISHED' ? 'PAID' : 'FREE',
        totalCreditsCost: status === 'PUBLISHED' ? 120 : '',
        status,
        moduleCount: 3,
        lessonCount: 9,
        learners: status === 'PUBLISHED' ? 320 : 0,
        updatedAt: now(),
        createdAt: now(),
        creatorLabel: 'SkillSync',
        modules: mergeInitialPath('SYSTEM', {
            title,
            skill: 'Frontend',
            level: 'Intermediate',
            modules: [
                {
                    title: 'Module A',
                    description: '',
                    objective: '',
                    estimatedDuration: '',
                    hasQuiz: false,
                    quizRequired: false,
                    lessons: [
                        {
                            title: 'Intro',
                            description: '',
                            videoUrl: 'https://example.com/v',
                            duration: '8 phút',
                            isPreview: true,
                        },
                    ],
                },
            ],
        }).modules,
    });

    return [mk('sp-1', 'JavaScript nền tảng', 'DRAFT'), mk('sp-2', 'React cho người đi làm', 'PUBLISHED')];
}
