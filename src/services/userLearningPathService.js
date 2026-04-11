import axiosClient from '../configuration/axiosClient';
import API_ENDPOINTS from '../configuration/apiEndpoints';
import { buildUserLearningPathMock } from '../utils/mockData';

function pick(obj, ...keys) {
    for (const k of keys) {
        if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
    }
    return undefined;
}

function normalizeLesson(raw, idx) {
    const r = raw || {};
    return {
        id: String(pick(r, 'id', 'lessonId') ?? `l-${idx}`),
        title: pick(r, 'title', 'name') ?? `Bài ${idx + 1}`,
        durationMinutes: Number(pick(r, 'durationMinutes', 'duration_minutes', 'duration') ?? 0),
        status: pick(r, 'status', 'lessonStatus') ?? 'NOT_STARTED',
    };
}

function normalizeModule(raw, idx) {
    const r = raw || {};
    const lessonsRaw = pick(r, 'lessons', 'lessonList') ?? [];
    const quizRaw = pick(r, 'quiz', 'quizProgress') ?? {};
    const srRaw = pick(r, 'supportRequest', 'support_request');

    return {
        id: String(pick(r, 'id', 'moduleId') ?? `m-${idx}`),
        order: Number(pick(r, 'order', 'sequence') ?? idx + 1),
        title: pick(r, 'title', 'name') ?? `Module ${idx + 1}`,
        shortDescription: pick(r, 'shortDescription', 'short_description', 'summary') ?? '',
        goal: pick(r, 'goal', 'objective', 'moduleGoal') ?? '',
        status: pick(r, 'status', 'moduleStatus') ?? 'LOCKED',
        lessonsCompleted: Number(pick(r, 'lessonsCompleted', 'lessons_completed') ?? 0),
        lessonsTotal: Number(pick(r, 'lessonsTotal', 'lessons_total', 'totalLessons') ?? 0),
        mentorSupport: Boolean(pick(r, 'mentorSupport', 'mentor_support')),
        quiz: {
            enabled: Boolean(pick(quizRaw, 'enabled', 'hasQuiz')),
            status: pick(quizRaw, 'status', 'quizStatus') ?? 'NOT_ATTEMPTED',
        },
        supportRequest: srRaw
            ? {
                  status: pick(srRaw, 'status') ?? 'NONE',
                  id: pick(srRaw, 'id', 'requestId') ?? null,
              }
            : null,
        lessons: Array.isArray(lessonsRaw) ? lessonsRaw.map(normalizeLesson) : [],
    };
}

/** Chuẩn hoá GET /api/user-learning-paths/{id} */
export function normalizeUserLearningPath(raw) {
    if (!raw) return null;
    const r = raw;
    const modulesRaw = pick(r, 'modules', 'moduleList') ?? [];
    const mentor = pick(r, 'mentor', 'mentorUser');
    const lastLesson = pick(r, 'lastInProgressLesson', 'last_in_progress_lesson');
    const primary = pick(r, 'primaryCta', 'primary_cta');

    return {
        pathId: String(pick(r, 'pathId', 'path_id', 'id')),
        pathTitle: pick(r, 'pathTitle', 'path_title', 'title'),
        pathType: pick(r, 'pathType', 'path_type') ?? 'system',
        emoji: pick(r, 'emoji'),
        thumbnailFrom: pick(r, 'thumbnailFrom', 'thumbnail_from'),
        thumbnailTo: pick(r, 'thumbnailTo', 'thumbnail_to'),
        progressPercent: Number(pick(r, 'progressPercent', 'progress_percent', 'progress') ?? 0),
        completedModulesCount: Number(pick(r, 'completedModulesCount', 'completed_modules_count') ?? 0),
        totalModulesCount: Number(pick(r, 'totalModulesCount', 'total_modules_count') ?? 0),
        currentModuleId: pick(r, 'currentModuleId', 'current_module_id') ?? null,
        lastInProgressLesson: lastLesson
            ? {
                  lessonId: pick(lastLesson, 'lessonId', 'lesson_id'),
                  moduleId: pick(lastLesson, 'moduleId', 'module_id'),
                  title: pick(lastLesson, 'title'),
              }
            : null,
        mentor: mentor
            ? {
                  name: pick(mentor, 'name'),
                  role: pick(mentor, 'role'),
                  avatarText: pick(mentor, 'avatarText', 'avatar_text', 'initials'),
                  avatarGrad: pick(mentor, 'avatarGrad', 'avatar_grad'),
              }
            : null,
        modules: Array.isArray(modulesRaw) ? modulesRaw.map(normalizeModule) : [],
        primaryCta: primary
            ? {
                  type: pick(primary, 'type'),
                  label: pick(primary, 'label'),
                  moduleId: pick(primary, 'moduleId', 'module_id'),
                  lessonId: pick(primary, 'lessonId', 'lesson_id'),
                  quizModuleId: pick(primary, 'quizModuleId', 'quiz_module_id'),
              }
            : null,
        learnerNote: pick(r, 'learnerNote', 'learner_note') ?? null,
        nextRecommendedHint: pick(r, 'nextRecommendedHint', 'next_recommended_hint') ?? null,
        missionHint: pick(r, 'missionHint', 'mission_hint') ?? null,
    };
}

export async function fetchUserLearningPath(pathId) {
    try {
        const data = await axiosClient.get(API_ENDPOINTS.USER_LEARNING_PATHS.BY_ID(pathId));
        return normalizeUserLearningPath(data);
    } catch {
        const mock = buildUserLearningPathMock(pathId);
        if (!mock) {
            const err = new Error('Không tìm thấy dữ liệu học tập cho lộ trình này');
            err.code = 'NOT_FOUND';
            throw err;
        }
        return normalizeUserLearningPath(mock);
    }
}
