import React, { useEffect, useMemo, useState } from 'react';
import {
    X,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    Sparkles,
    Layers,
    Zap,
    ImageOff,
} from 'lucide-react';
import { useStore } from '../../../store';
import { buildMentorPreviewFromUser } from '../learning-path/learningPathMocks';
import {
    SKILL_SUGGESTIONS,
    LEVEL_OPTIONS,
    mergeInitialPath,
    validatePathForm,
    emptyModule,
    emptyLesson,
    emptyQuizQuestion,
    countLessons,
} from './pathFormUtils';

const STEPS = [
    { id: 1, label: 'Thông tin cơ bản' },
    { id: 2, label: 'Chương trình' },
    { id: 3, label: 'Xem lại' },
];

function LivePreviewCard({ pathType, form, mentor }) {
    const [imgFailed, setImgFailed] = useState(false);
    const [mentorAvatarFailed, setMentorAvatarFailed] = useState(false);
    const thumb = typeof form.thumbnail === 'string' ? form.thumbnail.trim() : '';
    const looksLikeImageUrl = /^https?:\/\//i.test(thumb);
    const showImage = looksLikeImageUrl && !imgFailed;
    const isMentor = pathType === 'MENTOR';
    const lessonCount = countLessons(form.modules);
    const paid = form.priceType === 'PAID';
    const credits = Number(form.totalCreditsCost) || 0;
    const headerBg = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #a855f7 100%)';

    useEffect(() => {
        setImgFailed(false);
    }, [thumb]);

    useEffect(() => {
        setMentorAvatarFailed(false);
    }, [mentor?.avatarUrl]);

    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-lg overflow-hidden">
            <div
                className="h-24 flex items-center justify-center relative"
                style={{ background: showImage ? '#1e1b4b' : headerBg }}
            >
                {showImage ? (
                    <img
                        src={thumb}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={() => setImgFailed(true)}
                    />
                ) : (
                    <BookOpen className="w-10 h-10 text-white/90 relative z-[1]" strokeWidth={1.25} />
                )}
                {looksLikeImageUrl && imgFailed && (
                    <span className="absolute bottom-1 left-1 right-1 text-[9px] text-center text-white/90 z-[2] flex items-center justify-center gap-0.5">
                        <ImageOff size={10} /> Không tải ảnh
                    </span>
                )}
                <div className="absolute top-2 left-2">
                    {isMentor ? (
                        <span className="px-2 py-0.5 rounded-full bg-white/90 text-violet-700 text-[10px] font-bold">
                            Mentor-guided
                        </span>
                    ) : (
                        <span className="px-2 py-0.5 rounded-full bg-white/90 text-sky-700 text-[10px] font-bold flex items-center gap-0.5">
                            <Sparkles size={10} /> Tự học
                        </span>
                    )}
                </div>
            </div>
            <div className="p-3 space-y-2 text-sm">
                <h3 className="font-extrabold text-slate-900 line-clamp-2 leading-snug">
                    {form.title || 'Tiêu đề lộ trình'}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">{form.shortDescription || 'Mô tả ngắn'}</p>
                {isMentor && (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-violet-50/80 border border-violet-100">
                        <div
                            className={`w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br ${mentor.avatarGrad} text-white text-[10px] font-extrabold flex items-center justify-center shrink-0`}
                        >
                            {mentor.avatarUrl && !mentorAvatarFailed ? (
                                <img
                                    src={mentor.avatarUrl}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                    onError={() => setMentorAvatarFailed(true)}
                                />
                            ) : (
                                mentor.avatarText
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-xs truncate">{mentor.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{mentor.title}</p>
                        </div>
                    </div>
                )}
                {!isMentor && (
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-sky-50 border border-sky-100 text-sky-800 text-xs font-bold">
                        <Sparkles size={14} className="shrink-0" />
                        Lộ trình hệ thống SkillSync
                    </div>
                )}
                <div className="flex flex-wrap gap-2 text-[10px] text-slate-600 font-semibold">
                    <span>{form.modules?.length ?? 0} module</span>
                    <span>·</span>
                    <span>{lessonCount} bài</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-100 text-[10px]">
                    <span className="font-bold text-slate-400 uppercase">Chi phí</span>
                    {paid && credits > 0 ? (
                        <span className="font-black text-amber-600 flex items-center gap-0.5">
                            <Zap size={12} className="fill-current" /> {credits} credits
                        </span>
                    ) : (
                        <span className="font-bold text-emerald-600">Miễn phí</span>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {function} props.onClose
 * @param {'MENTOR'|'SYSTEM'} props.pathType
 * @param {object} [props.initialData]
 * @param {'create'|'edit'} [props.mode]
 * @param {function} props.onSaveDraft — (payload) => void
 * @param {function} [props.onSubmitApproval] — mentor: gửi duyệt
 * @param {function} [props.onPublish] — admin: xuất bản
 */
export default function CreatePathModal({
    open,
    onClose,
    pathType,
    initialData = null,
    mode = 'create',
    onSaveDraft,
    onSubmitApproval,
    onPublish,
}) {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState(() => mergeInitialPath(pathType, initialData));
    const [errorBanner, setErrorBanner] = useState('');

    useEffect(() => {
        if (open) {
            setStep(1);
            setForm(mergeInitialPath(pathType, initialData));
            setErrorBanner('');
        }
    }, [open, pathType, initialData]);

    const user = useStore((s) => s.user);
    const mentor = useMemo(() => buildMentorPreviewFromUser(user), [user]);
    const isMentor = pathType === 'MENTOR';

    const update = (patch) => setForm((f) => ({ ...f, ...patch }));

    const validationErrors = useMemo(() => validatePathForm(form, 'full'), [form]);

    const metaId = initialData?.id;

    const handleDraft = () => {
        const draftErr = validatePathForm(form, 'draft');
        if (draftErr.length) {
            setErrorBanner(draftErr[0]);
            return;
        }
        const payload = {
            ...form,
            id: metaId,
            pathType,
            status: 'DRAFT',
            updatedAt: new Date().toISOString(),
        };
        onSaveDraft?.(payload);
        onClose?.();
    };

    const handleMentorSubmit = () => {
        if (validationErrors.length) {
            setErrorBanner(validationErrors[0]);
            return;
        }
        const payload = {
            ...form,
            id: metaId,
            pathType,
            status: 'PENDING_APPROVAL',
            updatedAt: new Date().toISOString(),
        };
        onSubmitApproval?.(payload);
        onClose?.();
    };

    const handleAdminPublish = () => {
        if (validationErrors.length) {
            setErrorBanner(validationErrors[0]);
            return;
        }
        const payload = {
            ...form,
            id: metaId,
            pathType,
            status: 'PUBLISHED',
            updatedAt: new Date().toISOString(),
        };
        onPublish?.(payload);
        onClose?.();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-sm">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden border border-slate-200"
                role="dialog"
                aria-modal="true"
            >
                <header className="flex items-start justify-between gap-3 px-4 sm:px-6 py-4 border-b border-slate-100 shrink-0">
                    <div>
                        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                            {mode === 'edit' ? 'Chỉnh sửa lộ trình' : 'Tạo lộ trình'}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {pathType === 'MENTOR' ? 'Loại: Mentor (MENTOR)' : 'Loại: Hệ thống (SYSTEM)'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                        aria-label="Đóng"
                    >
                        <X size={22} />
                    </button>
                </header>

                {/* Stepper */}
                <div className="px-4 sm:px-6 py-3 bg-slate-50/80 border-b border-slate-100">
                    <div className="flex flex-wrap gap-2">
                        {STEPS.map((s) => (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => setStep(s.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                                    step === s.id
                                        ? 'bg-indigo-600 text-white shadow'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                                }`}
                            >
                                {s.id}. {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {errorBanner && (
                    <div className="mx-4 sm:mx-6 mt-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm px-3 py-2">
                        {errorBanner}
                    </div>
                )}

                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
                        <div className="min-w-0">
                            {step === 1 && (
                                <StepBasicInfo
                                    form={form}
                                    update={update}
                                    pathType={pathType}
                                    mentor={mentor}
                                />
                            )}
                            {step === 2 && (
                                <StepCurriculum form={form} update={update} pathType={pathType} />
                            )}
                            {step === 3 && (
                                <StepReview form={form} pathType={pathType} mentor={mentor} />
                            )}
                        </div>
                        {(step === 1 || step === 2) && (
                            <div className="lg:sticky lg:top-0 h-fit space-y-2">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Xem trước trực tiếp
                                </p>
                                <LivePreviewCard pathType={pathType} form={form} mentor={mentor} />
                            </div>
                        )}
                    </div>
                </div>

                <footer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/90 shrink-0">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setStep((s) => Math.max(1, s - 1))}
                            disabled={step === 1}
                            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-white disabled:opacity-40"
                        >
                            <ChevronLeft size={18} /> Trước
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setErrorBanner('');
                                setStep((s) => Math.min(3, s + 1));
                            }}
                            disabled={step === 3}
                            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40"
                        >
                            Tiếp <ChevronRight size={18} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                        <button
                            type="button"
                            onClick={handleDraft}
                            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-800 text-sm font-bold hover:bg-white"
                        >
                            Lưu nháp
                        </button>
                        {isMentor ? (
                            <button
                                type="button"
                                onClick={handleMentorSubmit}
                                className="px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 shadow-md"
                            >
                                Gửi duyệt
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleAdminPublish}
                                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 shadow-md"
                            >
                                Xuất bản
                            </button>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
}

function StepBasicInfo({ form, update, pathType, mentor }) {
    const isMentor = pathType === 'MENTOR';
    const [mentorImgFail, setMentorImgFail] = useState(false);
    useEffect(() => {
        setMentorImgFail(false);
    }, [mentor?.avatarUrl]);
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Tiêu đề <span className="text-rose-500">*</span>
                </label>
                <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none"
                    value={form.title}
                    onChange={(e) => update({ title: e.target.value })}
                    placeholder="Ví dụ: UX Design từ zero đến portfolio"
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Mô tả ngắn</label>
                <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/30 outline-none"
                    value={form.shortDescription}
                    onChange={(e) => update({ shortDescription: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Mô tả đầy đủ</label>
                <textarea
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/30 outline-none resize-y min-h-[100px]"
                    value={form.description}
                    onChange={(e) => update({ description: e.target.value })}
                />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                        Skill <span className="text-rose-500">*</span>
                    </label>
                    <input
                        list="skill-suggestions-cpm"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/30 outline-none"
                        value={form.skill}
                        onChange={(e) => update({ skill: e.target.value })}
                        placeholder="Chọn hoặc nhập"
                    />
                    <datalist id="skill-suggestions-cpm">
                        {SKILL_SUGGESTIONS.map((s) => (
                            <option key={s} value={s} />
                        ))}
                    </datalist>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                        Level <span className="text-rose-500">*</span>
                    </label>
                    <select
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/30 outline-none bg-white"
                        value={form.level}
                        onChange={(e) => update({ level: e.target.value })}
                    >
                        <option value="">— Chọn —</option>
                        {LEVEL_OPTIONS.map((l) => (
                            <option key={l} value={l}>
                                {l}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Thời lượng ước tính
                </label>
                <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/30 outline-none"
                    value={form.estimatedDuration}
                    onChange={(e) => update({ estimatedDuration: e.target.value })}
                    placeholder="VD: 4 tuần"
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Thumbnail URL</label>
                <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/30 outline-none"
                    value={form.thumbnail}
                    onChange={(e) => update({ thumbnail: e.target.value })}
                    placeholder="https://..."
                />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Giá</label>
                    <div className="flex gap-3">
                        <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="radio"
                                name="priceType"
                                checked={form.priceType === 'FREE'}
                                onChange={() => update({ priceType: 'FREE' })}
                            />
                            Miễn phí
                        </label>
                        <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="radio"
                                name="priceType"
                                checked={form.priceType === 'PAID'}
                                onChange={() => update({ priceType: 'PAID' })}
                            />
                            Trả credits
                        </label>
                    </div>
                </div>
                <div>
                    <label
                        className={`block text-xs font-bold uppercase tracking-wide mb-1 ${
                            form.priceType === 'PAID' ? 'text-slate-500' : 'text-slate-300'
                        }`}
                    >
                        Tổng credits
                    </label>
                    <input
                        type="number"
                        min={0}
                        disabled={form.priceType !== 'PAID'}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/30 outline-none disabled:bg-slate-100 disabled:text-slate-400"
                        value={form.totalCreditsCost}
                        onChange={(e) => update({ totalCreditsCost: e.target.value })}
                    />
                </div>
            </div>

            {isMentor && (
                <div className="rounded-2xl border border-violet-200 bg-violet-50/50 p-4">
                    <p className="text-xs font-bold text-violet-800 uppercase tracking-wide mb-2">Mentor</p>
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br ${mentor.avatarGrad} text-white font-extrabold flex items-center justify-center shrink-0`}
                        >
                            {mentor.avatarUrl && !mentorImgFail ? (
                                <img
                                    src={mentor.avatarUrl}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                    onError={() => setMentorImgFail(true)}
                                />
                            ) : (
                                mentor.avatarText
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">{mentor.name}</p>
                            <p className="text-sm text-slate-600">{mentor.title}</p>
                        </div>
                    </div>
                </div>
            )}
            {!isMentor && (
                <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4 flex items-center gap-2">
                    <Sparkles className="text-sky-600 shrink-0" size={20} />
                    <span className="font-bold text-sky-900">Lộ trình hệ thống SkillSync</span>
                </div>
            )}
        </div>
    );
}

function StepCurriculum({ form, update, pathType }) {
    const isMentor = pathType === 'MENTOR';
    const modules = form.modules || [];

    const setModules = (next) => update({ modules: next });

    const addModule = () => {
        setModules([...modules, emptyModule(pathType)]);
    };

    const removeModule = (idx) => {
        if (modules.length <= 1) return;
        setModules(modules.filter((_, i) => i !== idx));
    };

    const patchModule = (idx, patch) => {
        const next = modules.map((m, i) => (i === idx ? { ...m, ...patch } : m));
        setModules(next);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-extrabold text-slate-900">Module & bài học</h3>
                <button
                    type="button"
                    onClick={addModule}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-800"
                >
                    + Thêm module
                </button>
            </div>

            {modules.map((mod, mi) => (
                <div
                    key={mod.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">Module {mi + 1}</span>
                        <button
                            type="button"
                            onClick={() => removeModule(mi)}
                            className="text-xs text-rose-600 font-bold hover:underline"
                            disabled={modules.length <= 1}
                        >
                            Xóa module
                        </button>
                    </div>
                    <input
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
                        placeholder="Tiêu đề module"
                        value={mod.title}
                        onChange={(e) => patchModule(mi, { title: e.target.value })}
                    />
                    <textarea
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white resize-y min-h-[60px]"
                        placeholder="Mô tả"
                        value={mod.description}
                        onChange={(e) => patchModule(mi, { description: e.target.value })}
                    />
                    <input
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
                        placeholder="Mục tiêu (objective)"
                        value={mod.objective}
                        onChange={(e) => patchModule(mi, { objective: e.target.value })}
                    />
                    <div className="flex flex-wrap gap-4 text-sm">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={mod.hasQuiz}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    if (checked) {
                                        const existing = mod.quizQuestions || [];
                                        patchModule(mi, {
                                            hasQuiz: true,
                                            quizQuestions:
                                                existing.length > 0 ? existing : [emptyQuizQuestion()],
                                        });
                                    } else {
                                        patchModule(mi, { hasQuiz: false, quizRequired: false });
                                    }
                                }}
                            />
                            Có quiz
                        </label>
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                disabled={!mod.hasQuiz}
                                checked={mod.quizRequired}
                                onChange={(e) => patchModule(mi, { quizRequired: e.target.checked })}
                            />
                            Bắt buộc làm quiz
                        </label>
                        {isMentor && (
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={mod.enableSupport}
                                    onChange={(e) => patchModule(mi, { enableSupport: e.target.checked })}
                                />
                                Bật hỗ trợ mentor
                            </label>
                        )}
                    </div>

                    {mod.hasQuiz && (
                        <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-3 space-y-3">
                            <p className="text-xs font-extrabold text-violet-900 uppercase tracking-wide">
                                Soạn quiz (cuối module)
                            </p>
                            <input
                                className="w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm"
                                placeholder="Tiêu đề bài quiz (vd: Kiểm tra nhanh)"
                                value={mod.quizTitle || ''}
                                onChange={(e) => patchModule(mi, { quizTitle: e.target.value })}
                            />
                            {(mod.quizQuestions || []).map((q, qi) => (
                                <div
                                    key={q.id}
                                    className="rounded-lg border border-violet-100 bg-white p-3 space-y-2 shadow-sm"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-slate-600">
                                            Câu {qi + 1}
                                        </span>
                                        {(mod.quizQuestions || []).length > 1 && (
                                            <button
                                                type="button"
                                                className="text-[11px] text-rose-600 font-bold hover:underline"
                                                onClick={() => {
                                                    const quizQuestions = (mod.quizQuestions || []).filter(
                                                        (_, j) => j !== qi
                                                    );
                                                    patchModule(mi, { quizQuestions });
                                                }}
                                            >
                                                Xóa câu
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                                        placeholder="Nội dung câu hỏi"
                                        value={q.prompt || ''}
                                        onChange={(e) => {
                                            const quizQuestions = (mod.quizQuestions || []).map((x, j) =>
                                                j === qi ? { ...x, prompt: e.target.value } : x
                                            );
                                            patchModule(mi, { quizQuestions });
                                        }}
                                    />
                                    <p className="text-[10px] font-bold text-slate-500">Đáp án (chọn đúng)</p>
                                    {[0, 1, 2, 3].map((oi) => (
                                        <div key={oi} className="flex gap-2 items-center">
                                            <input
                                                type="radio"
                                                name={`quiz-correct-${mod.id}-${q.id}`}
                                                checked={Number(q.correctIndex) === oi}
                                                onChange={() => {
                                                    const quizQuestions = (mod.quizQuestions || []).map(
                                                        (x, j) =>
                                                            j === qi ? { ...x, correctIndex: oi } : x
                                                    );
                                                    patchModule(mi, { quizQuestions });
                                                }}
                                                className="shrink-0"
                                            />
                                            <input
                                                className="flex-1 min-w-0 rounded-lg border border-slate-100 px-2 py-1 text-sm"
                                                placeholder={`Phương án ${String.fromCharCode(65 + oi)}`}
                                                value={(q.options && q.options[oi]) || ''}
                                                onChange={(e) => {
                                                    const opts = [...(q.options || ['', '', '', ''])];
                                                    opts[oi] = e.target.value;
                                                    const quizQuestions = (mod.quizQuestions || []).map(
                                                        (x, j) => (j === qi ? { ...x, options: opts } : x)
                                                    );
                                                    patchModule(mi, { quizQuestions });
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    const quizQuestions = [
                                        ...(mod.quizQuestions || []),
                                        emptyQuizQuestion(),
                                    ];
                                    patchModule(mi, { quizQuestions });
                                }}
                                className="text-xs font-bold text-violet-700 hover:text-violet-900"
                            >
                                + Thêm câu hỏi
                            </button>
                        </div>
                    )}

                    <div className="border-t border-slate-200 pt-3 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-600">Bài học</span>
                            <button
                                type="button"
                                className="text-xs font-bold text-indigo-600"
                                onClick={() => {
                                    const lessons = [...(mod.lessons || []), emptyLesson()];
                                    patchModule(mi, { lessons });
                                }}
                            >
                                + Thêm bài
                            </button>
                        </div>
                        {(mod.lessons || []).map((les, li) => (
                            <div key={les.id} className="rounded-xl bg-white border border-slate-200 p-3 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] font-bold text-slate-400">Bài {li + 1}</span>
                                    {(mod.lessons || []).length > 1 && (
                                        <button
                                            type="button"
                                            className="text-[11px] text-rose-600 font-bold"
                                            onClick={() => {
                                                const lessons = mod.lessons.filter((_, j) => j !== li);
                                                patchModule(mi, { lessons });
                                            }}
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </div>
                                <input
                                    className="w-full rounded-lg border border-slate-100 px-2 py-1.5 text-sm"
                                    placeholder="Tiêu đề bài"
                                    value={les.title}
                                    onChange={(e) => {
                                        const lessons = mod.lessons.map((l, j) =>
                                            j === li ? { ...l, title: e.target.value } : l
                                        );
                                        patchModule(mi, { lessons });
                                    }}
                                />
                                <textarea
                                    className="w-full rounded-lg border border-slate-100 px-2 py-1.5 text-sm min-h-[50px]"
                                    placeholder="Mô tả bài"
                                    value={les.description}
                                    onChange={(e) => {
                                        const lessons = mod.lessons.map((l, j) =>
                                            j === li ? { ...l, description: e.target.value } : l
                                        );
                                        patchModule(mi, { lessons });
                                    }}
                                />
                                <input
                                    className="w-full rounded-lg border border-amber-100 bg-amber-50/50 px-2 py-1.5 text-sm"
                                    placeholder="URL video *"
                                    value={les.videoUrl}
                                    onChange={(e) => {
                                        const lessons = mod.lessons.map((l, j) =>
                                            j === li ? { ...l, videoUrl: e.target.value } : l
                                        );
                                        patchModule(mi, { lessons });
                                    }}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        className="rounded-lg border border-slate-100 px-2 py-1.5 text-sm"
                                        placeholder="Thời lượng"
                                        value={les.duration}
                                        onChange={(e) => {
                                            const lessons = mod.lessons.map((l, j) =>
                                                j === li ? { ...l, duration: e.target.value } : l
                                            );
                                            patchModule(mi, { lessons });
                                        }}
                                    />
                                    <label className="inline-flex items-center gap-2 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={les.isPreview}
                                            onChange={(e) => {
                                                const lessons = mod.lessons.map((l, j) =>
                                                    j === li ? { ...l, isPreview: e.target.checked } : l
                                                );
                                                patchModule(mi, { lessons });
                                            }}
                                        />
                                        Preview miễn phí
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function StepReview({ form, pathType, mentor }) {
    const isMentor = pathType === 'MENTOR';
    const modules = form.modules || [];
    return (
        <div className="space-y-6 text-sm">
            <section className="rounded-2xl border border-slate-200 p-4 space-y-2">
                <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
                    <Layers size={18} /> Thông tin lộ trình
                </h3>
                <p>
                    <span className="text-slate-500">Loại:</span>{' '}
                    <span className="font-bold">{pathType === 'MENTOR' ? 'MENTOR' : 'SYSTEM'}</span>
                </p>
                <p>
                    <span className="text-slate-500">Người tạo:</span>{' '}
                    <span className="font-bold">{isMentor ? mentor.name : 'SkillSync (Hệ thống)'}</span>
                </p>
                <p>
                    <span className="text-slate-500">Tiêu đề:</span> {form.title || '—'}
                </p>
                <p>
                    <span className="text-slate-500">Skill / Level:</span> {form.skill || '—'} ·{' '}
                    {form.level || '—'}
                </p>
                <p>
                    <span className="text-slate-500">Giá:</span>{' '}
                    {form.priceType === 'PAID'
                        ? `${form.totalCreditsCost || 0} credits`
                        : 'Miễn phí'}
                </p>
            </section>
            {isMentor && (
                <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-4">
                    <h3 className="font-extrabold text-violet-900 mb-2">Hỗ trợ mentor</h3>
                    <ul className="text-xs space-y-1 text-slate-700">
                        {modules.map((m, i) => (
                            <li key={m.id}>
                                Module {i + 1}: {m.enableSupport ? 'Bật' : 'Tắt'}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            <section className="rounded-2xl border border-slate-200 p-4 space-y-3">
                <h3 className="font-extrabold text-slate-900">Module & bài học</h3>
                {modules.map((m, mi) => (
                    <div key={m.id} className="border-l-2 border-indigo-300 pl-3">
                        <p className="font-bold text-slate-800">
                            {mi + 1}. {m.title || 'Chưa đặt tên'}
                        </p>
                        <ul className="mt-1 text-xs text-slate-600 space-y-0.5">
                            {(m.lessons || []).map((l, li) => (
                                <li key={l.id}>
                                    Bài {li + 1}: {l.title || '—'} — video: {l.videoUrl ? '✓' : '✗'}
                                </li>
                            ))}
                        </ul>
                        {m.hasQuiz && (
                            <p className="mt-2 text-xs text-violet-800 font-semibold">
                                Quiz: {m.quizTitle?.trim() || 'Chưa đặt tiêu đề'} —{' '}
                                {(m.quizQuestions || []).length} câu
                                {m.quizRequired ? ' · bắt buộc' : ''}
                            </p>
                        )}
                    </div>
                ))}
            </section>
        </div>
    );
}

export { mergeInitialPath };
