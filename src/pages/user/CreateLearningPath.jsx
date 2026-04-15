import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    X,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    Sparkles,
    Layers,
    Zap,
    Target,
    Play,
    CheckCircle2,
    AlertCircle,
    Plus,
    Trash2,
    Users,
    Search,
    Map,
    ArrowLeft,
} from 'lucide-react';
import { useStore } from '../../store';
import { buildMentorPreviewFromUser } from './learning-path/learningPathMocks';
import {
    SKILL_SUGGESTIONS,
    LEVEL_OPTIONS,
    mergeInitialPath,
    validatePathForm,
    emptyModule,
    emptyLesson,
    countLessons,
} from './learning-path-management/pathFormUtils';

const STEPS = [
    { id: 1, label: 'Thông tin cơ bản' },
    { id: 2, label: 'Chương trình' },
    { id: 3, label: 'Xem lại' },
];

/** 
 * Reuse the same components from the modal for consistency
 * but optimized for full-page layout
 */

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
    const headerBg = 'linear-gradient(135deg, #5A63F6 0%, #8b5cf6 55%, #a855f7 100%)';

    useEffect(() => {
        setImgFailed(false);
    }, [thumb]);

    useEffect(() => {
        setMentorAvatarFailed(false);
    }, [mentor?.avatarUrl]);

    return (
        <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden group">
            <div
                className="h-40 flex items-center justify-center relative bg-slate-900"
                style={{ background: showImage ? '#1e1b4b' : headerBg }}
            >
                {showImage ? (
                    <img
                        src={thumb}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                        referrerPolicy="no-referrer"
                        onError={() => setImgFailed(true)}
                    />
                ) : (
                    <div className="relative">
                        <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
                        <BookOpen className="w-14 h-14 text-white/90 relative z-[1]" strokeWidth={1.5} />
                    </div>
                )}

                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    {isMentor ? (
                        <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-violet-700 text-[10px] font-black shadow-sm border border-white flex items-center gap-1.5">
                            <Users size={12} /> Mentor-guided
                        </span>
                    ) : (
                        <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-sky-700 text-[10px] font-black shadow-sm border border-white flex items-center gap-1.5">
                            <Play size={12} /> Tự học
                        </span>
                    )}
                    <span className="px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm text-white text-[10px] font-black border border-white/20 flex items-center gap-1.5">
                         <Target size={12} /> {LEVEL_OPTIONS.find(l => l === form.level) || 'Beginner'}
                    </span>
                </div>
            </div>

            <div className="p-5 space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#5A63F6] uppercase tracking-[0.2em]">
                    <Sparkles size={12} fill="currentColor" /> {form.skill || 'Kỹ năng'}
                </div>

                <h3 className="font-black text-slate-900 text-base line-clamp-2 leading-tight group-hover:text-[#5A63F6] transition-colors">
                    {form.title || 'Tiêu đề lộ trình học của bạn'}
                </h3>

                <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed h-9">
                    {form.shortDescription || 'Mô tả ngắn gọn về những gì học viên sẽ đạt được sau khi tham gia lộ trình này...'}
                </p>

                {isMentor && (
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 transition-all group-hover:bg-indigo-50/50 group-hover:border-indigo-100">
                        <div
                            className={`w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br ${mentor.avatarGrad} text-white text-[12px] font-black flex items-center justify-center shrink-0 shadow-sm`}
                        >
                            {mentor.avatarUrl && !mentorAvatarFailed ? (
                                <img
                                    src={mentor.avatarUrl}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={() => setMentorAvatarFailed(true)}
                                />
                            ) : (
                                mentor.avatarText
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="font-black text-slate-900 text-[12px] truncate">{mentor.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold truncate">Mentor chuyên gia</p>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-black border-t border-slate-50 pt-4">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5">
                            {form.modules?.length ?? 0} module
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="flex items-center gap-1.5">
                            {lessonCount} bài học
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-center bg-slate-50/80 -mx-5 -mb-5 p-4 border-t border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phí tham gia</span>
                    {paid && credits > 0 ? (
                        <div className="flex items-center gap-1.5">
                            <span className="font-black text-[#5A63F6] text-sm">{credits}</span>
                            <span className="text-[10px] font-extrabold text-[#5A63F6]/70 uppercase tracking-tighter">Credits</span>
                        </div>
                    ) : (
                        <span className="font-black text-emerald-600 text-xs uppercase tracking-widest">Miễn phí</span>
                    )}
                </div>
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
        <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-left-4 duration-500 text-slate-900">
            <div className="grid gap-6">
                <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2.5 ml-1">
                        Tiêu đề lộ trình <span className="text-rose-500">*</span>
                    </label>
                    <input
                        className="w-full rounded-2xl border-2 border-slate-100 px-5 py-4 text-base font-bold focus:ring-[6px] focus:ring-[#5A63F6]/5 focus:border-[#5A63F6] outline-none transition-all placeholder:text-slate-200 bg-white"
                        value={form.title}
                        onChange={(e) => update({ title: e.target.value })}
                        placeholder="VD: Lập trình Java từ con số 0 đến tự tin đi làm"
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2.5 ml-1">Mô tả tóm tắt</label>
                    <input
                        className="w-full rounded-2xl border-2 border-slate-100 px-5 py-3.5 text-sm font-medium focus:ring-[6px] focus:ring-[#5A63F6]/5 focus:border-[#5A63F6] outline-none transition-all placeholder:text-slate-200 bg-white"
                        value={form.shortDescription}
                        onChange={(e) => update({ shortDescription: e.target.value })}
                        placeholder="Câu dẫn ngắn gọn khoảng 20-30 từ để thu hút người học..."
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2.5 ml-1">Nội dung chi tiết</label>
                    <textarea
                        rows={6}
                        className="w-full rounded-2xl border-2 border-slate-100 px-5 py-4 text-sm font-medium focus:ring-[6px] focus:ring-[#5A63F6]/5 focus:border-[#5A63F6] outline-none transition-all resize-none placeholder:text-slate-200 min-h-[160px] bg-white leading-relaxed"
                        value={form.description}
                        onChange={(e) => update({ description: e.target.value })}
                        placeholder="Giải thích kỹ hơn về lộ trình: ai nên học, kết quả đầu ra là gì, các công nghệ sẽ sử dụng..."
                    />
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
                <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2.5 ml-1">
                        Kỹ năng chính <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                            <Search size={18} />
                        </div>
                        <input
                            list="skill-suggestions-clp"
                            className="w-full rounded-2xl border-2 border-slate-100 pl-14 pr-5 py-4 text-sm font-bold focus:ring-[6px] focus:ring-[#5A63F6]/5 focus:border-[#5A63F6] outline-none transition-all bg-white"
                            value={form.skill}
                            onChange={(e) => update({ skill: e.target.value })}
                            placeholder="VD: Java, React, Python..."
                        />
                    </div>
                    <datalist id="skill-suggestions-clp">
                        {SKILL_SUGGESTIONS.map((s) => (
                            <option key={s} value={s} />
                        ))}
                    </datalist>
                </div>
                <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2.5 ml-1">
                        Trình độ mục tiêu <span className="text-rose-500">*</span>
                    </label>
                    <select
                        className="w-full rounded-2xl border-2 border-slate-100 px-5 py-4 text-sm font-bold focus:ring-[6px] focus:ring-[#5A63F6]/5 focus:border-[#5A63F6] outline-none transition-all bg-white cursor-pointer appearance-none"
                        value={form.level}
                        onChange={(e) => update({ level: e.target.value })}
                    >
                        <option value="">— Chọn cấp độ phù hợp —</option>
                        {LEVEL_OPTIONS.map((l) => (
                            <option key={l} value={l}>
                                {l}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
                <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2.5 ml-1">
                        Học trong bao lâu?
                    </label>
                    <input
                        className="w-full rounded-2xl border-2 border-slate-100 px-5 py-4 text-sm font-bold focus:ring-[6px] focus:ring-[#5A63F6]/5 focus:border-[#5A63F6] outline-none transition-all bg-white"
                        value={form.estimatedDuration}
                        onChange={(e) => update({ estimatedDuration: e.target.value })}
                        placeholder="VD: 8 tuần, 3 tháng..."
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2.5 ml-1">Thumbnail (Hình đại diện URL)</label>
                    <input
                        className="w-full rounded-2xl border-2 border-slate-100 px-5 py-4 text-sm font-bold focus:ring-[6px] focus:ring-[#5A63F6]/5 focus:border-[#5A63F6] outline-none transition-all bg-white"
                        value={form.thumbnail}
                        onChange={(e) => update({ thumbnail: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                    />
                </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-slate-50 border-2 border-slate-100 space-y-6">
                <div className="grid sm:grid-cols-2 gap-10">
                    <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">Thiết lập học phí</label>
                        <div className="flex gap-10 items-center">
                            <label className="inline-flex items-center gap-3.5 text-sm font-black text-slate-700 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="radio"
                                        name="priceType_p"
                                        className="sr-only"
                                        checked={form.priceType === 'FREE'}
                                        onChange={() => update({ priceType: 'FREE', totalCreditsCost: '' })}
                                    />
                                    <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                                        form.priceType === 'FREE' ? 'border-[#5A63F6] bg-[#5A63F6] shadow-lg shadow-indigo-200' : 'border-slate-300 bg-white group-hover:border-slate-400'
                                    }`}>
                                        {form.priceType === 'FREE' && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                </div>
                                Miễn phí
                            </label>
                            <label className="inline-flex items-center gap-3.5 text-sm font-black text-slate-700 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="radio"
                                        name="priceType_p"
                                        className="sr-only"
                                        checked={form.priceType === 'PAID'}
                                        onChange={() => update({ priceType: 'PAID' })}
                                    />
                                    <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                                        form.priceType === 'PAID' ? 'border-[#5A63F6] bg-[#5A63F6] shadow-lg shadow-indigo-200' : 'border-slate-300 bg-white group-hover:border-slate-400'
                                    }`}>
                                        {form.priceType === 'PAID' && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                </div>
                                Thu phí (Credits)
                            </label>
                        </div>
                    </div>
                    <div>
                        <label
                            className={`block text-[11px] font-black uppercase tracking-[0.2em] mb-3 transition-colors ${
                                form.priceType === 'PAID' ? 'text-slate-500' : 'text-slate-300'
                            }`}
                        >
                            Số tiền (Credits)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min={0}
                                disabled={form.priceType !== 'PAID'}
                                className="w-full rounded-2xl border-2 border-slate-100 px-5 py-4 text-sm font-black focus:ring-[6px] focus:ring-[#5A63F6]/5 focus:border-[#5A63F6] outline-none transition-all disabled:bg-slate-100 disabled:text-slate-300 bg-white"
                                value={form.totalCreditsCost}
                                onChange={(e) => update({ totalCreditsCost: e.target.value })}
                                placeholder="VD: 500"
                            />
                            {form.priceType === 'PAID' && (
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">Credits</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isMentor ? (
                <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-indigo-50/50 border-2 border-indigo-100 border-dashed">
                    <div
                        className={`w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br ${mentor.avatarGrad} text-white text-xl font-black flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100 border-2 border-white`}
                    >
                        {mentor.avatarUrl && !mentorImgFail ? (
                            <img
                                src={mentor.avatarUrl}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={() => setMentorImgFail(true)}
                            />
                        ) : (
                            mentor.avatarText
                        )}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Xác nhận Mentor</p>
                        <p className="font-black text-slate-900 text-xl leading-tight">{mentor.name}</p>
                        <p className="text-sm text-slate-500 font-bold">Lộ trình sẽ được gắn nhãn Mentor-Guided khi ra mắt</p>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-4 p-6 rounded-[2rem] bg-sky-50 border-2 border-sky-100 border-dashed">
                    <div className="w-16 h-16 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 shrink-0 border-2 border-white">
                        <Sparkles size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-1">Admin Mode</p>
                        <p className="font-black text-sky-900 text-xl">Lộ trình hệ thống SkillSync</p>
                        <p className="text-sm text-sky-600 font-bold">Lộ trình chính thống được phê duyệt bởi Ban điều hành</p>
                    </div>
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

    const addLesson = (mi) => {
        const mod = modules[mi];
        const lessons = [...mod.lessons, emptyLesson()];
        patchModule(mi, { lessons });
    };

    const removeLesson = (mi, li) => {
        const mod = modules[mi];
        if (mod.lessons.length <= 1) return;
        const lessons = mod.lessons.filter((_, i) => i !== li);
        patchModule(mi, { lessons });
    };

    return (
        <div className="space-y-10 pb-10 animate-in fade-in slide-in-from-right-4 duration-500 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                    <h3 className="text-xl font-black text-slate-900">Xây dựng chương trình</h3>
                    <p className="text-sm text-slate-500 font-bold">Chia lộ trình thành các phần kiến thức logic</p>
                </div>
                <button
                    type="button"
                    onClick={addModule}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-indigo-50 text-[#5A63F6] text-xs font-black hover:bg-indigo-100 transition-all border-2 border-indigo-100 active:scale-95"
                >
                    <Plus size={18} strokeWidth={3} /> THÊM MODULE
                </button>
            </div>

            {modules.map((mod, mi) => (
                <div
                    key={mod.id}
                    className="relative rounded-[2.5rem] border-2 border-slate-100 bg-white p-6 sm:p-10 transition-all hover:border-[#5A63F6]/20 shadow-sm"
                >
                    {/* Module Header */}
                    <div className="flex items-start justify-between gap-6 mb-8">
                        <div className="flex-1">
                             <div className="flex items-center gap-4 mb-4">
                                <span className="flex items-center justify-center w-11 h-11 rounded-[1.25rem] bg-slate-900 text-white text-sm font-black shadow-xl shadow-slate-200 shrink-0">
                                    {mi + 1}
                                </span>
                                <input
                                    className="flex-1 bg-transparent border-none p-0 text-2xl font-black text-slate-900 placeholder:text-slate-100 focus:ring-0 outline-none"
                                    placeholder="Đặt tên cho Module này..."
                                    value={mod.title}
                                    onChange={(e) => patchModule(mi, { title: e.target.value })}
                                />
                             </div>
                             <textarea
                                className="w-full bg-slate-50/50 rounded-[1.5rem] border-2 border-transparent px-6 py-4 text-sm text-slate-600 placeholder:text-slate-200 focus:border-[#5A63F6]/10 focus:ring-4 focus:ring-[#5A63F6]/5 outline-none transition-all resize-none min-h-[80px]"
                                placeholder="Tóm tắt những kiến thức cốt lõi học viên sẽ được tiếp cận trong module này..."
                                value={mod.description}
                                onChange={(e) => patchModule(mi, { description: e.target.value })}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => removeModule(mi)}
                            className="p-4 rounded-2xl text-slate-200 hover:text-rose-500 hover:bg-rose-50/50 transition-all shrink-0 border-2 border-transparent hover:border-rose-100"
                            disabled={modules.length <= 1}
                        >
                            <Trash2 size={28} />
                        </button>
                    </div>

                    {/* Module config */}
                    <div className="grid sm:grid-cols-2 gap-8 mb-10">
                        <div>
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3 ml-1">Mục tiêu cụ thể</label>
                            <input
                                className="w-full rounded-2xl border-2 border-slate-100 px-6 py-4 text-sm font-bold focus:border-[#5A63F6]/30 focus:ring-[6px] focus:ring-[#5A63F6]/5 outline-none transition-all placeholder:text-slate-200 bg-white"
                                placeholder="Học viên sẽ tự tay làm được gì?"
                                value={mod.objective}
                                onChange={(e) => patchModule(mi, { objective: e.target.value })}
                            />
                        </div>
                        <div className="flex items-end gap-4">
                            <label className="flex-1 flex items-center justify-between p-4 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50/20 cursor-pointer hover:border-[#5A63F6]/20 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-xl border-2 transition-all flex items-center justify-center ${mod.hasQuiz ? 'bg-[#5A63F6] border-[#5A63F6] shadow-lg shadow-indigo-100' : 'bg-white border-slate-200 group-hover:border-slate-300'}`}>
                                        {mod.hasQuiz && <CheckCircle2 size={14} className="text-white" />}
                                    </div>
                                    <span className={`text-[12px] font-black ${mod.hasQuiz ? 'text-slate-900' : 'text-slate-400'}`}>Kèm Quiz đánh giá</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={mod.hasQuiz}
                                    onChange={(e) => patchModule(mi, { hasQuiz: e.target.checked })}
                                />
                            </label>
                            {mod.hasQuiz && (
                                <label className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white border-2 border-slate-100 cursor-pointer group shadow-sm">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded-lg border-2 border-slate-200 text-[#5A63F6] focus:ring-[#5A63F6]"
                                        checked={mod.isQuizMandatory}
                                        onChange={(e) => patchModule(mi, { isQuizMandatory: e.target.checked })}
                                    />
                                    <span className="text-[11px] font-black text-slate-400 group-hover:text-slate-600 uppercase tracking-widest leading-none">Bắt buộc</span>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Lessons list */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                                <Layers size={18} className="text-[#5A63F6]" /> Danh sách bài học
                            </h4>
                            <button
                                type="button"
                                onClick={() => addLesson(mi)}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-50 text-emerald-600 text-[11px] font-black hover:bg-emerald-100 transition-all border-2 border-emerald-100 active:scale-95 shadow-sm"
                            >
                                <Plus size={16} strokeWidth={3} /> THÊM BÀI MỚI
                            </button>
                        </div>
                        
                        <div className="grid gap-5">
                            {mod.lessons.map((les, li) => (
                                <div key={les.id} className="group/les relative pl-12">
                                    {/* Connection line */}
                                    <div className="absolute left-[24px] top-0 bottom-0 w-[3px] bg-slate-50 group-last:bottom-1/2 rounded-full" />
                                    <div className="absolute left-[15px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-[4px] border-white bg-slate-100 group-hover/les:border-[#5A63F6] group-hover/les:bg-white group-hover/les:scale-125 transition-all shadow-md z-10" />

                                    <div className="rounded-[2rem] border-2 border-slate-50 bg-white p-6 sm:p-8 transition-all hover:border-[#5A63F6]/10 hover:shadow-2xl hover:shadow-indigo-500/5">
                                        <div className="flex gap-8">
                                            <div className="flex-1 space-y-6">
                                                <div className="flex gap-6 items-center">
                                                    <input
                                                        className="flex-1 bg-transparent border-none p-0 text-lg font-black text-slate-900 placeholder:text-slate-100 focus:ring-0 outline-none"
                                                        placeholder="Tên bài giảng này là gì?..."
                                                        value={les.title}
                                                        onChange={(e) => {
                                                            const lessons = mod.lessons.map((l, j) =>
                                                                j === li ? { ...l, title: e.target.value } : l
                                                            );
                                                            patchModule(mi, { lessons });
                                                        }}
                                                    />
                                                    <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-5 py-2.5 shrink-0 border-2 border-transparent hover:border-slate-100 transition-all">
                                                        <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Thời lượng</span>
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                className="w-12 bg-transparent border-none p-0 text-sm font-black text-[#5A63F6] placeholder:text-slate-100 focus:ring-0 outline-none text-right"
                                                                placeholder="0"
                                                                value={les.duration}
                                                                onChange={(e) => {
                                                                    const lessons = mod.lessons.map((l, j) =>
                                                                        j === li ? { ...l, duration: e.target.value } : l
                                                                    );
                                                                    patchModule(mi, { lessons });
                                                                }}
                                                            />
                                                            <span className="text-[11px] font-black text-slate-400 uppercase">phút</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid sm:grid-cols-[1fr_auto] gap-6">
                                                    <div className="relative group/input">
                                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-[#5A63F6] transition-all">
                                                            <Play size={20} fill="currentColor" />
                                                        </div>
                                                        <input
                                                            className="w-full rounded-[1.5rem] border-2 border-slate-50 pl-16 pr-6 py-4 text-sm font-bold focus:border-[#5A63F6]/20 focus:ring-[6px] focus:ring-[#5A63F6]/5 outline-none transition-all placeholder:text-slate-200 bg-slate-50/20"
                                                            placeholder="Dán link bài giảng (Hỗ trợ YouTube, Vimeo, Drive...)"
                                                            value={les.videoUrl}
                                                            onChange={(e) => {
                                                                const lessons = mod.lessons.map((l, j) =>
                                                                    j === li ? { ...l, videoUrl: e.target.value } : l
                                                                );
                                                                patchModule(mi, { lessons });
                                                            }}
                                                        />
                                                    </div>
                                                    <label className="flex items-center gap-4 cursor-pointer select-none px-6 rounded-[1.5rem] bg-white border-2 border-slate-50 hover:border-emerald-100 hover:bg-emerald-50/20 transition-all shadow-sm">
                                                        <input
                                                            type="checkbox"
                                                            className="w-5 h-5 rounded-lg border-2 border-slate-200 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                                                            checked={les.isPreview}
                                                            onChange={(e) => {
                                                                const lessons = mod.lessons.map((l, j) =>
                                                                    j === li ? { ...l, isPreview: e.target.checked } : l
                                                                );
                                                                patchModule(mi, { lessons });
                                                            }}
                                                        />
                                                        <span className={`text-[12px] font-black uppercase tracking-[0.2em] ${les.isPreview ? 'text-emerald-600' : 'text-slate-300'}`}>Học thử</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeLesson(mi, li)}
                                                className="p-3 rounded-2xl text-slate-200 hover:text-rose-500 hover:bg-rose-50/50 transition-all shrink-0 self-start border-2 border-transparent hover:border-rose-100"
                                                disabled={mod.lessons.length <= 1}
                                            >
                                                <Trash2 size={24} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addModule}
                className="w-full py-20 rounded-[3.5rem] border-4 border-dashed border-slate-50 text-slate-300 hover:border-[#5A63F6]/20 hover:text-[#5A63F6] hover:bg-indigo-50/30 transition-all flex flex-col items-center gap-5 group shadow-sm bg-white"
            >
                <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center group-hover:bg-[#5A63F6] group-hover:text-white transition-all group-hover:scale-110 shadow-lg shadow-slate-100">
                    <Plus size={44} strokeWidth={2.5} />
                </div>
                <div className="text-center">
                    <span className="block font-black text-xl uppercase tracking-[0.4em] mb-2">Thêm module mới</span>
                    <span className="text-sm font-bold text-slate-400">Thiết lập thêm một cột mốc kiến thức cho học viên</span>
                </div>
            </button>
        </div>
    );
}

function StepReview({ form, pathType, mentor }) {
    const isMentor = pathType === 'MENTOR';
    const modules = form.modules || [];
    
    return (
        <div className="space-y-10 pb-10 animate-in fade-in zoom-in-95 duration-500 text-slate-900">
            <div className="border-b border-slate-100 pb-5">
                <h3 className="text-xl font-black text-slate-900">Tổng quan lộ trình</h3>
                <p className="text-sm text-slate-500 font-bold">Kiểm duyệt lần cuối các thiết lập quan trọng</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
                <div className="space-y-8">
                    <section className="bg-white rounded-[2.5rem] border-2 border-slate-50 p-8 space-y-6 shadow-xl shadow-slate-100/50">
                        <div className="flex items-center gap-4 text-[#5A63F6]">
                             <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border-2 border-indigo-100 shadow-sm">
                                <Search size={22} strokeWidth={3} />
                             </div>
                             <div>
                                <h4 className="font-black text-sm uppercase tracking-[0.2em] text-slate-900">Thông tin niêm yết</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Dữ liệu gốc từ hệ thống</p>
                             </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-5">
                            <div className="p-5 rounded-[1.5rem] bg-slate-50 border-2 border-slate-100/50">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Hình thức học</p>
                                <p className="text-sm font-black text-slate-700">{pathType === 'MENTOR' ? 'MENTOR-GUIDED' : 'SYSTEM-AUTONOMOUS'}</p>
                            </div>
                            <div className="p-5 rounded-[1.5rem] bg-slate-50 border-2 border-slate-100/50">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Trình độ khóa</p>
                                <p className="text-sm font-black text-slate-700">{form.level || 'Beginner'}</p>
                            </div>
                            <div className="p-5 rounded-[1.5rem] bg-slate-50 border-2 border-slate-100/50">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Chủ đề đào tạo</p>
                                <p className="text-sm font-black text-slate-700">{form.skill || '—'}</p>
                            </div>
                            <div className="p-5 rounded-[1.5rem] bg-slate-50 border-2 border-slate-100/50">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Chi phí gói</p>
                                <p className="text-sm font-black text-[#5A63F6]">
                                    {form.priceType === 'PAID' ? `${form.totalCreditsCost || 0} CR` : 'MIỄN PHÍ'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="space-y-2 px-1">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Tiêu đề chính thức</p>
                            <p className="text-lg font-black text-slate-900 leading-tight">{form.title || 'Chưa đặt tiêu đề'}</p>
                        </div>
                    </section>

                    {isMentor && (
                        <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl shadow-indigo-200 overflow-hidden relative group">
                            <div className="absolute -right-10 -top-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-[60px] group-hover:scale-125 transition-transform duration-1000" />
                            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] opacity-40 mb-6">Đại diện cố vấn</h4>
                            <div className="flex items-center gap-6 relative z-10">
                                <div className={`w-20 h-20 rounded-[1.75rem] bg-gradient-to-br ${mentor.avatarGrad} border-2 border-white/20 shadow-2xl flex items-center justify-center font-black text-2xl text-white`}>
                                    {mentor.avatarText}
                                </div>
                                <div>
                                    <p className="text-xl font-black leading-tight mb-1">{mentor.name}</p>
                                    <p className="text-xs font-bold opacity-60 leading-relaxed">Mentor cam kết hỗ trợ trực tuyến và giải đáp các thắc mắc chuyên sâu tại mỗi module có kích hoạt tính năng hỗ trợ.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-[#1e1b4b] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-900/10 flex flex-col h-full border-2 border-white/5">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 border border-white/10 shadow-lg">
                            <Layers size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                             <h4 className="font-black text-sm uppercase tracking-[0.2em] text-white">Chương trình học</h4>
                             <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mt-0.5">{modules.length} modules · {countLessons(modules)} bài giảng</p>
                        </div>
                    </div>

                    <div className="space-y-5 flex-1 overflow-y-auto pr-4 custom-scrollbar-light">
                        {modules.map((m, mi) => (
                            <div key={m.id} className="relative pl-8 py-2 group/rev">
                                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/5 rounded-full" />
                                <div className="absolute left-[-4px] top-4 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] group-hover/rev:scale-125 transition-all duration-300" />
                                
                                <p className="text-sm font-black mb-1.5 text-white/90 leading-tight">{mi + 1}. {m.title || 'Chưa đặt tiêu đề module'}</p>
                                <div className="flex flex-wrap gap-2.5">
                                    <span className="text-[9px] font-black px-2 py-1 rounded-lg bg-white/5 text-slate-400 tracking-widest uppercase">
                                        {m.lessons?.length || 0} bài
                                    </span>
                                    {m.hasQuiz && (
                                        <span className="text-[9px] font-black px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 tracking-widest uppercase border border-amber-500/20">
                                            QUIZ
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/5 flex items-center gap-5">
                        <div className="flex -space-x-3 shrink-0">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-[3px] border-[#1e1b4b] bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 shadow-xl shadow-black/20">
                                    {i}
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 italic leading-relaxed">Bộ phận học thuật sẽ cấp chứng nhận ngay sau khi hoàn thành toàn bộ lộ trình này.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CreateLearningPath() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [errorBanner, setErrorBanner] = useState('');
    
    // Determine path type based on URL or store
    const { user } = useStore();
    const isAdmin = user?.role === 'admin';
    const pathType = isAdmin ? 'SYSTEM' : 'MENTOR';
    
    const [form, setForm] = useState(() => mergeInitialPath(pathType, null));

    const mentor = useMemo(() => buildMentorPreviewFromUser(user), [user]);
    const update = (patch) => setForm((f) => ({ ...f, ...patch }));
    const validationErrors = useMemo(() => validatePathForm(form, 'full'), [form]);

    const handleBackToManagement = () => {
        if (isAdmin) navigate('/admin/paths');
        else navigate('/mentor/learning-paths');
    };

    const handleSave = (status) => {
        const errors = status === 'DRAFT' ? validatePathForm(form, 'draft') : validationErrors;
        if (errors.length) {
            setErrorBanner(errors[0]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const payload = {
            ...form,
            pathType,
            status,
            updatedAt: new Date().toISOString(),
        };

        // Here we would call the actual API
        console.log('Publishing/Saving Path:', payload);
        
        // Mock success notice and redirection
        handleBackToManagement();
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Nav Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-50 px-6 sm:px-12 py-5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={handleBackToManagement}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100 group"
                    >
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Thiết kế lộ trình mới</h2>
                            <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-[#5A63F6] text-[9px] font-black uppercase tracking-widest border border-indigo-100 ml-2">Beta 2.0</span>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-sky-500' : 'bg-violet-500'} animate-pulse`} />
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAdmin ? 'Chế độ quản trị viên' : 'Chế độ giảng viên'} · SkillSync Premium Education</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => handleSave('DRAFT')}
                        className="px-6 py-3 rounded-2xl text-slate-400 text-sm font-black hover:bg-slate-50 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"
                    >
                        Lưu bản nháp
                    </button>
                    <div className="h-8 w-px bg-slate-100 mx-2" />
                    <button
                        type="button"
                        onClick={handleBackToManagement}
                        className="p-3 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                        <X size={26} />
                    </button>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-6 sm:px-12 py-12">
                {/* Stepper Component */}
                <div className="mb-16 flex items-center gap-12 sm:gap-16 overflow-x-auto no-scrollbar pb-4 max-w-4xl">
                    {STEPS.map((s, index) => (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => setStep(s.id)}
                            className="flex items-center gap-5 group shrink-0"
                        >
                            <div className={`w-14 h-14 rounded-[1.75rem] flex items-center justify-center text-lg font-black transition-all duration-500 ${
                                step === s.id
                                    ? 'bg-[#5A63F6] text-white shadow-2xl shadow-indigo-100 scale-110'
                                    : step > s.id
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-50'
                                    : 'bg-white text-slate-200 border-2 border-slate-50'
                            }`}>
                                {step > s.id ? <CheckCircle2 size={24} strokeWidth={3} /> : s.id}
                            </div>
                            <div className="text-left hidden md:block">
                                <p className={`text-[10px] font-black uppercase tracking-[0.3em] leading-none mb-2 ${step >= s.id ? 'text-[#5A63F6]' : 'text-slate-200'}`}>
                                    Bước {index + 1}
                                </p>
                                <p className={`text-base font-black ${step === s.id ? 'text-slate-900' : 'text-slate-300'}`}>
                                    {s.label}
                                </p>
                            </div>
                            {index < STEPS.length - 1 && (
                                <div className="hidden lg:block w-20 h-0.5 bg-slate-50 ml-6 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Alert Banner */}
                {errorBanner && (
                    <div className="mb-10 max-w-5xl animate-in slide-in-from-top-6 duration-500">
                        <div className="flex items-center gap-4 rounded-[2rem] bg-rose-50 border-2 border-rose-100 text-rose-700 px-8 py-5 shadow-xl shadow-rose-100/50">
                            <div className="w-12 h-12 rounded-2xl bg-white/50 flex items-center justify-center text-rose-500 shrink-0">
                                <AlertCircle size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black uppercase tracking-widest mb-0.5 opacity-60">Thao tác không hợp lệ</p>
                                <p className="text-sm font-black">{errorBanner}</p>
                            </div>
                            <button 
                                onClick={() => setErrorBanner('')} 
                                className="w-10 h-10 rounded-xl hover:bg-rose-100 flex items-center justify-center transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16">
                    {/* Content Section */}
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

                        {/* Pagination Buttons */}
                        <div className="mt-16 pt-10 border-t-2 border-slate-50 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => setStep(s => Math.max(1, s - 1))}
                                disabled={step === 1}
                                className="group flex items-center gap-3 px-8 py-4 rounded-[1.5rem] border-2 border-slate-100 text-slate-500 text-sm font-black hover:bg-slate-50 hover:text-slate-900 disabled:opacity-20 disabled:pointer-events-none transition-all"
                            >
                                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> QUAY LẠI
                            </button>
                            
                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setErrorBanner('');
                                        setStep(s => Math.min(3, s + 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="group flex items-center gap-3 px-12 py-4 rounded-[1.5rem] bg-indigo-900 text-white text-sm font-black hover:bg-black shadow-2xl shadow-indigo-100 transition-all hover:scale-105 active:scale-95"
                                >
                                    TIẾP THEO <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => handleSave(isAdmin ? 'PUBLISHED' : 'PENDING_APPROVAL')}
                                    className="group flex items-center gap-4 px-14 py-5 rounded-[1.5rem] bg-indigo-900 text-white text-base font-black hover:bg-[#5A63F6] shadow-2xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
                                >
                                    <Sparkles size={24} /> {isAdmin ? 'XUẤT BẢN NGAY' : 'GỬI PHÊ DUYỆT'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sidebar section */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-32 space-y-8">
                            <div className="flex items-center justify-between px-2">
                                <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">Thẻ xem trước</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-[#5A63F6] uppercase tracking-widest">Active</span>
                                    <span className="flex h-2 w-2 rounded-full bg-[#5A63F6] animate-pulse" />
                                </div>
                            </div>
                            
                            <LivePreviewCard form={form} pathType={pathType} mentor={mentor} />
                            
                            <div className="relative p-8 rounded-[2.5rem] bg-indigo-50/30 border-2 border-indigo-100/50 border-dashed overflow-hidden">
                                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/40 rounded-full blur-2xl" />
                                <h5 className="text-[11px] font-black text-indigo-700 uppercase tracking-widest mb-4 flex items-center gap-2.5">
                                    <Zap size={18} fill="currentColor" /> Hướng dẫn nhanh
                                </h5>
                                <p className="text-[12px] font-bold text-indigo-900/60 leading-relaxed mb-4">
                                    Một lộ trình tiêu chuẩn nên có ít nhất 2 modules và 6 bài giảng để mang lại trải nghiệm học tập tốt nhất.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-[10px] font-black text-indigo-900/40 uppercase tracking-widest">
                                        <CheckCircle2 size={14} className="text-indigo-400" /> Tiêu đề ngắn gọn
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black text-indigo-900/40 uppercase tracking-widest">
                                        <CheckCircle2 size={14} className="text-indigo-400" /> Ảnh bìa rõ nét
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black text-indigo-900/40 uppercase tracking-widest">
                                        <CheckCircle2 size={14} className="text-indigo-400" /> Link bài giảng đúng
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
