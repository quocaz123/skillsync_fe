export const SKILL_SUGGESTIONS = ['UX', 'Product', 'English', 'Public Speaking', 'Frontend'];

export const LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];

export const emptyLesson = () => ({
    id: `lesson-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    isPreview: false,
});

export const emptyQuizQuestion = () => ({
    id: `qq-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    prompt: '',
    options: ['', '', '', ''],
    correctIndex: 0,
});

export const emptyModule = (pathType) => ({
    id: `mod-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    title: '',
    description: '',
    objective: '',
    estimatedDuration: '',
    hasQuiz: false,
    quizRequired: false,
    enableSupport: pathType === 'MENTOR',
    quizTitle: '',
    quizQuestions: [],
    lessons: [emptyLesson()],
});

export function createEmptyPathForm(pathType) {
    return {
        title: '',
        shortDescription: '',
        description: '',
        skill: '',
        level: '',
        estimatedDuration: '',
        thumbnail: '',
        priceType: 'FREE',
        totalCreditsCost: '',
        modules: [emptyModule(pathType)],
    };
}

/** @param {object} initial - partial path từ API/parent (chỉ lấy field form, bỏ id/status/...) */
export function mergeInitialPath(pathType, initial) {
    const base = createEmptyPathForm(pathType);
    if (!initial || typeof initial !== 'object') return base;
    const {
        title,
        shortDescription,
        description,
        skill,
        level,
        estimatedDuration,
        thumbnail,
        priceType,
        totalCreditsCost,
        modules: initialModules,
    } = initial;

    return {
        ...base,
        title: title ?? base.title,
        shortDescription: shortDescription ?? base.shortDescription,
        description: description ?? base.description,
        skill: skill ?? base.skill,
        level: level ?? base.level,
        estimatedDuration: estimatedDuration ?? base.estimatedDuration,
        thumbnail: thumbnail ?? base.thumbnail,
        priceType: priceType === 'PAID' || priceType === 'FREE' ? priceType : base.priceType,
        totalCreditsCost:
            totalCreditsCost !== undefined && totalCreditsCost !== null
                ? String(totalCreditsCost)
                : base.totalCreditsCost,
        modules:
            Array.isArray(initialModules) && initialModules.length > 0
                ? initialModules.map((m) => ({
                      ...emptyModule(pathType),
                      ...m,
                      enableSupport: pathType === 'MENTOR' ? (m.enableSupport ?? false) : false,
                      quizQuestions: Array.isArray(m.quizQuestions)
                          ? m.quizQuestions.map((q) => ({
                                ...emptyQuizQuestion(),
                                ...q,
                                options: Array.isArray(q.options) && q.options.length >= 4
                                    ? q.options.slice(0, 4)
                                    : [...(q.options || []), '', '', '', ''].slice(0, 4),
                            }))
                          : [],
                      lessons:
                          Array.isArray(m.lessons) && m.lessons.length > 0
                              ? m.lessons.map((l) => ({ ...emptyLesson(), ...l, id: l.id || emptyLesson().id }))
                              : [emptyLesson()],
                  }))
                : base.modules,
    };
}

/**
 * @param {object} form - form state
 * @param {'draft'|'full'} mode - draft: title+skill+level; full: tất cả rule spec
 */
export function validatePathForm(form, mode = 'full') {
    const errors = [];
    const title = (form.title || '').trim();
    const skill = (form.skill || '').trim();
    const level = (form.level || '').trim();

    if (!title) errors.push('Tiêu đề là bắt buộc');
    if (!skill) errors.push('Kỹ năng (skill) là bắt buộc');
    if (!level) errors.push('Cấp độ (level) là bắt buộc');

    if (mode === 'draft') return errors;

    const modules = form.modules || [];
    if (modules.length < 1) errors.push('Cần ít nhất 1 module');

    modules.forEach((mod, mi) => {
        const lessons = mod.lessons || [];
        if (lessons.length < 1) errors.push(`Module ${mi + 1}: cần ít nhất 1 bài học`);
        lessons.forEach((les, li) => {
            if (!(les.videoUrl || '').trim()) {
                errors.push(`Module ${mi + 1}, bài ${li + 1}: URL video là bắt buộc`);
            }
        });
    });

    if (form.priceType === 'PAID') {
        const c = Number(form.totalCreditsCost);
        if (!Number.isFinite(c) || c <= 0) errors.push('Gói trả phí cần nhập số credits hợp lệ');
    }

    return errors;
}

export function countLessons(modules) {
    if (!Array.isArray(modules)) return 0;
    return modules.reduce((n, m) => n + (m.lessons?.length || 0), 0);
}
