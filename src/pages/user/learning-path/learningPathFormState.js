export function genId(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createEmptyLesson() {
    return {
        id: genId('lesson'),
        title: '',
        description: '',
        videoUrl: '',
        duration: '',
        isPreview: false,
    };
}

export function createEmptyModule() {
    return {
        id: genId('module'),
        title: '',
        description: '',
        objective: '',
        estimatedDuration: '',
        hasQuiz: false,
        quizRequired: false,
        enableSupport: false,
        lessons: [createEmptyLesson()],
    };
}

export function createInitialFormState(pathType, overrides = {}) {
    return {
        pathType,
        title: '',
        shortDescription: '',
        description: '',
        skill: '',
        level: '',
        estimatedDuration: '',
        thumbnail: '',
        priceType: 'FREE',
        totalCreditsCost: 0,
        modules: [createEmptyModule()],
        ...overrides,
    };
}

/** Validation theo từng bước + full */
export function validateStep(step, data, pathType) {
    const errors = {};

    if (step === 1) {
        if (!String(data.title || '').trim()) errors.title = 'Tiêu đề là bắt buộc';
        if (!String(data.skill || '').trim()) errors.skill = 'Kỹ năng là bắt buộc';
        if (!String(data.level || '').trim()) errors.level = 'Trình độ là bắt buộc';
        if (data.priceType === 'PAID') {
            const c = Number(data.totalCreditsCost);
            if (!c || c <= 0) errors.totalCreditsCost = 'Nhập tổng chi phí credits (lớn hơn 0)';
        }
    }

    if (step === 2) {
        if (!data.modules?.length) errors.modules = 'Cần ít nhất 1 module';
        data.modules?.forEach((m, mi) => {
            if (!String(m.title || '').trim()) errors[`module-${m.id}-title`] = 'Tên module là bắt buộc';
            if (!m.lessons?.length) errors[`module-${m.id}-lessons`] = 'Mỗi module cần ít nhất 1 bài học';
            m.lessons?.forEach((l) => {
                if (!String(l.title || '').trim()) errors[`lesson-${l.id}-title`] = 'Tên bài học là bắt buộc';
                if (!String(l.videoUrl || '').trim()) errors[`lesson-${l.id}-videoUrl`] = 'URL video là bắt buộc';
            });
        });
    }

    return errors;
}

export function validateAll(data) {
    const e1 = validateStep(1, data);
    const e2 = validateStep(2, data);
    return { ...e1, ...e2 };
}
