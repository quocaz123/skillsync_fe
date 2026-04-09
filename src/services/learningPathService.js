import axiosClient from '../configuration/axiosClient';
import API_ENDPOINTS from '../configuration/apiEndpoints';
import { buildPathDetailMock } from '../utils/mockData';
import { useStore } from '../store';

function pick(obj, ...keys) {
    for (const k of keys) {
        if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
    }
    return undefined;
}

function normalizeModule(m, idx) {
    const r = m || {};
    const order = pick(r, 'order', 'sequence', 'index') ?? idx + 1;
    const videoLessonCount = pick(r, 'videoLessonCount', 'video_lesson_count', 'lessonCount') ?? 0;
    const totalVideoMinutes = pick(r, 'totalVideoMinutes', 'total_video_minutes', 'videoMinutes') ?? 0;
    return {
        order: Number(order),
        title: pick(r, 'title', 'name') ?? `Module ${order}`,
        description: pick(r, 'description', 'summary') ?? '',
        videoLessonCount: Number(videoLessonCount),
        totalVideoMinutes: Number(totalVideoMinutes),
        hasQuiz: Boolean(pick(r, 'hasQuiz', 'has_quiz', 'quiz')),
        mentorSupport: Boolean(pick(r, 'mentorSupport', 'mentor_support', 'hasMentorSupport')),
        practiceSessionLabel: pick(r, 'practiceSessionLabel', 'practice_session_label') ?? null,
        lessonTitlesPreview: pick(r, 'lessonTitlesPreview', 'lesson_titles_preview', 'lessonPreviews') ?? [],
    };
}

function normalizeMentor(m) {
    if (!m) return null;
    return {
        name: pick(m, 'name', 'fullName', 'full_name'),
        role: pick(m, 'role', 'headline'),
        avatarText: pick(m, 'avatarText', 'avatar_text', 'initials'),
        avatarGrad: pick(m, 'avatarGrad', 'avatar_grad'),
        verified: Boolean(pick(m, 'verified', 'isVerified')),
        rating: Number(pick(m, 'rating', 'averageRating') ?? 0),
        bio: pick(m, 'bio', 'biography', 'about') ?? null,
        teachingSkillName: pick(m, 'teachingSkillName', 'teaching_skill_name', 'skillName'),
        teachingSkillLevel: pick(m, 'teachingSkillLevel', 'teaching_skill_level', 'skillLevel'),
        creditsPerHour: pick(m, 'creditsPerHour', 'credits_per_hour', 'hourlyCredits') ?? null,
    };
}

/** Chuẩn hoá payload GET /api/learning-paths/{id} (camelCase hoặc snake_case) */
export function normalizePathDetail(raw) {
    if (!raw) return null;
    const r = raw;
    const modulesRaw = pick(r, 'modules', 'curriculum', 'courseModules') ?? [];
    const pathType = pick(r, 'pathType', 'path_type', 'type') ?? 'system';

    return {
        id: String(pick(r, 'id', 'pathId', 'learningPathId')),
        title: pick(r, 'title', 'name') ?? '',
        shortDescription: pick(r, 'shortDescription', 'short_description', 'subtitle') ?? '',
        description: pick(r, 'description', 'fullDescription', 'overview') ?? '',
        skill: pick(r, 'skill', 'skillName', 'category') ?? '',
        level: pick(r, 'level', 'difficulty') ?? 'Beginner',
        duration: pick(r, 'duration', 'estimatedDuration', 'estimated_duration') ?? '',
        totalModules: Number(pick(r, 'totalModules', 'total_modules', 'moduleCount') ?? 0),
        totalLessons: Number(pick(r, 'totalLessons', 'total_lessons', 'lessonCount') ?? 0),
        totalCredits: Number(pick(r, 'totalCredits', 'total_credits', 'creditCost', 'priceCredits') ?? 0),
        pathType: pathType === 'MENTOR' ? 'mentor' : pathType === 'SYSTEM' ? 'system' : pathType,
        thumbnailFrom: pick(r, 'thumbnailFrom', 'thumbnail_from', 'bannerFrom'),
        thumbnailTo: pick(r, 'thumbnailTo', 'thumbnail_to', 'bannerTo'),
        emoji: pick(r, 'emoji', 'iconEmoji'),
        learnerCount: Number(pick(r, 'learnerCount', 'learner_count', 'enrollmentCount') ?? 0),
        rating: Number(pick(r, 'rating', 'averageRating') ?? 0),
        previewAvailable: Boolean(pick(r, 'previewAvailable', 'preview_available', 'hasPreview')),
        previewUrl: pick(r, 'previewUrl', 'preview_url') ?? null,
        learningOutcomes: pick(r, 'learningOutcomes', 'learning_outcomes', 'outcomes', 'objectives') ?? [],
        whoShouldJoin: pick(r, 'whoShouldJoin', 'who_should_join', 'targetAudience', 'audience') ?? '',
        prerequisites: pick(r, 'prerequisites', 'prerequisite', 'entryRequirements') ?? null,
        mentor: normalizeMentor(pick(r, 'mentor', 'mentorUser', 'mentor_profile')),
        modules: Array.isArray(modulesRaw) ? modulesRaw.map(normalizeModule) : [],
        enrolled: Boolean(pick(r, 'enrolled', 'isEnrolled', 'hasEnrollment')),
        enrollmentId: pick(r, 'enrollmentId', 'enrollment_id') ?? null,
    };
}

function mergeLocalEnrollment(detail) {
    if (!detail?.id) return detail;
    const ids = useStore.getState().enrolledPathIds || [];
    if (detail.enrolled) return detail;
    if (ids.includes(detail.id)) return { ...detail, enrolled: true, enrollmentId: detail.enrollmentId || `local_${detail.id}` };
    return detail;
}

/**
 * GET /api/learning-paths/{id}
 * Fallback mock khi API lỗi / chưa triển khai.
 */
export async function fetchLearningPathById(pathId) {
    try {
        const data = await axiosClient.get(API_ENDPOINTS.LEARNING_PATHS.BY_ID(pathId));
        const normalized = normalizePathDetail(data);
        if (normalized && normalized.id) return mergeLocalEnrollment(normalized);
    } catch {
        /* mock */
    }
    const mock = buildPathDetailMock(pathId);
    if (!mock) {
        const err = new Error('Không tìm thấy lộ trình');
        err.code = 'NOT_FOUND';
        throw err;
    }
    return mergeLocalEnrollment(mock);
}

/**
 * POST /api/learning-paths/{id}/enroll
 * Trả về object: { creditsBalance?, enrollmentId?, enrolled? } tùy backend.
 */
export async function enrollLearningPath(pathId) {
    try {
        const data = await axiosClient.post(API_ENDPOINTS.LEARNING_PATHS.ENROLL(pathId), {});
        return {
            creditsBalance: pick(data, 'creditsBalance', 'credits_balance', 'balance'),
            enrollmentId: pick(data, 'enrollmentId', 'enrollment_id', 'id'),
            enrolled: Boolean(pick(data, 'enrolled', 'success') ?? true),
            raw: data,
        };
    } catch (e) {
        /* Demo: enroll thành công khi offline — trừ credit phía client trong UI */
        const mock = buildPathDetailMock(pathId);
        if (!mock) throw e;
        const cost = mock.totalCredits || 0;
        return {
            creditsBalance: null,
            enrollmentId: `enroll_${pathId}_${Date.now()}`,
            enrolled: true,
            offline: true,
            deductedCredits: cost,
            raw: null,
        };
    }
}
