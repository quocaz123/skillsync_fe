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
    Target,
    Play,
    Star,
    CheckCircle2,
    AlertCircle,
    Plus,
    Trash2,
    Users,
    Search,
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
    countLessons,
} from './pathFormUtils';

const STEPS = [
    { id: 1, label: 'Thông tin' },
    { id: 2, label: 'Chương trình', icon: <Layers size={16} /> },
    { id: 3, label: 'Hoàn tất', icon: <Search size={16} /> },
];

/**
 * [SUB-COMPONENT] LIVE PREVIEW
 * V2: Compact Card style, balanced typography
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
    
    useEffect(() => { setImgFailed(false); }, [thumb]);
    useEffect(() => { setMentorAvatarFailed(false); }, [mentor?.avatarUrl]);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden group transition-all duration-500 hover:shadow-2xl">
            {/* Header / Thumbnail Area */}
            <div className="h-40 flex items-center justify-center relative bg-slate-900">
                {showImage ? (
                    <img
                        src={thumb}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        onError={() => setImgFailed(true)}
                    />
                ) : (
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 absolute inset-0 flex items-center justify-center opacity-90">
                        <BookOpen className="w-12 h-12 text-white/50" />
                    </div>
                )}
                
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-white text-[10px] font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                         <Target size={12} className="text-indigo-500" /> {form.level || 'Beginner'}
                    </span>
                    {isMentor ? (
                        <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold shadow-sm flex items-center gap-1.5 uppercase tracking-wider">
                            <Users size={12} /> Mentor Path
                        </span>
                    ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-sm flex items-center gap-1.5 uppercase tracking-wider">
                            <Sparkles size={12} /> System Path
                        </span>
                    )}
                </div>
            </div>

            <div className="p-5 space-y-4">
                <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-indigo-500" /> {form.skill || 'Skill Area'}
                    </div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
                        {form.title || 'Tiêu đề lộ trình học'}
                    </h3>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 h-8">
                    {form.shortDescription || 'Mô tả ngắn về lộ trình sẽ hiển thị ở đây...'}
                </p>

                {isMentor && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${mentor.avatarGrad} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                            {mentor.avatarUrl && !mentorAvatarFailed ? (
                                <img src={mentor.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" onError={() => setMentorAvatarFailed(true)} />
                            ) : mentor.avatarText}
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-xs truncate">{mentor.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium truncate uppercase tracking-tighter">Verified Instructor</p>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5"><Layers size={13} /> {form.modules?.length ?? 0} Modules</span>
                        <span className="flex items-center gap-1.5"><Play size={13} /> {lessonCount} Lessons</span>
                    </div>
                </div>

                <div className="flex justify-between items-center bg-slate-50 -mx-5 -mb-5 p-4 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pricing</span>
                    <div className="flex items-center gap-1.5">
                        {paid ? (
                            <>
                                <span className="font-bold text-slate-900 text-sm">{credits}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Credits</span>
                            </>
                        ) : (
                            <span className="font-bold text-emerald-600 text-[10px] uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">FREE</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * [MAIN COMPONENT] CREATE PATH MODAL v2
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
    const user = useStore?.(s => s.user);
    const mentorPreview = useMemo(() => buildMentorPreviewFromUser(user), [user]);
    const isMentor = pathType === 'MENTOR';

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

    if (!open) return null;

    const updateForm = (delta) => setForm(p => ({ ...p, ...delta }));
    const validationErrors = validatePathForm(form, 'full');

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-6xl h-full max-h-[90vh] flex flex-col bg-white rounded-[2rem] shadow-2xl overflow-hidden ring-1 ring-white/20">
                {/* Fixed Header */}
                <header className="px-8 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            {mode === 'edit' ? 'Chỉnh sửa lộ trình' : 'Tạo lộ trình học mới'}
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 font-medium">
                            {isMentor ? 'Role: Mentor' : 'Role: Admin'} • <Zap size={10} className="fill-amber-400 text-amber-500" /> Premium Content
                        </div>
                    </div>

                    {/* Compact Stepper */}
                    <div className="hidden sm:flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        {STEPS.map((s, idx) => {
                            const active = s.id === step;
                            const done = step > s.id;
                            return (
                                <div key={s.id} className="flex items-center">
                                    <button
                                        onClick={() => done && setStep(s.id)}
                                        disabled={!done && !active}
                                        className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                            active ? 'bg-white text-indigo-600 shadow-sm' : done ? 'text-indigo-400' : 'text-slate-300'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] transition-colors ${
                                            active ? 'border-indigo-600' : done ? 'border-indigo-400 bg-indigo-400 text-white' : 'border-slate-200'
                                        }`}>
                                            {done ? <CheckCircle2 size={12} strokeWidth={3} /> : s.id}
                                        </div>
                                        {s.label}
                                    </button>
                                    {idx < STEPS.length - 1 && <div className="w-4 h-[1px] bg-slate-200 mx-1" />}
                                </div>
                            );
                        })}
                    </div>

                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-400">
                        <X size={24} />
                    </button>
                </header>

                {/* Main Body (Scrollable) */}
                <main className="flex-1 flex overflow-hidden">
                    {/* Left: Form Area */}
                    <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar-light bg-slate-50/30">
                        {errorBanner && (
                            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-600 text-sm font-bold animate-in slide-in-from-top-4">
                                <AlertCircle size={18} /> {errorBanner}
                                <button onClick={() => setErrorBanner('')} className="ml-auto opacity-50 hover:opacity-100"><X size={16} /></button>
                            </div>
                        )}

                        <div className="max-w-3xl mx-auto">
                            {step === 1 && <StepBasicInfo form={form} update={updateForm} pathType={pathType} />}
                            {step === 2 && <StepCurriculum form={form} update={updateForm} pathType={pathType} />}
                            {step === 3 && <StepReview form={form} mentor={mentorPreview} />}
                        </div>
                    </div>

                    {/* Right: Live Preview Panel */}
                    <div className="hidden lg:block w-[380px] bg-white border-l border-slate-100 p-8 overflow-y-auto shrink-0 relative">
                         <div className="sticky top-0 text-center space-y-6">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Preview theo thời gian thực</div>
                            <LivePreviewCard pathType={pathType} form={form} mentor={mentorPreview} />
                            
                            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-left">
                                <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-2 mb-2">
                                    <Sparkles size={14} className="text-indigo-500" /> Tip thiết kế
                                </h4>
                                <p className="text-[11px] text-indigo-600 leading-relaxed font-medium">
                                    Hãy sử dụng hình ảnh chất lượng cao và tiêu đề ngắn gọn (dưới 60 ký tự) để thu hút học viên tốt nhất.
                                </p>
                            </div>
                         </div>
                    </div>
                </main>

                {/* Fixed Footer */}
                <footer className="px-8 py-6 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest px-4"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const draftErr = validatePathForm(form, 'draft');
                                if (draftErr.length) { setErrorBanner(draftErr[0]); return; }
                                onSaveDraft?.({ ...form, status: 'DRAFT' });
                                onClose();
                            }}
                            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[11px] font-bold hover:bg-slate-50 transition-all uppercase tracking-wider"
                        >
                            Lưu nháp
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(p => p - 1)}
                                className="p-3 rounded-xl border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        )}

                        {step < 3 ? (
                            <button
                                onClick={() => {
                                    if (step === 1 && validatePathForm(form, 'draft').length > 0) {
                                        setErrorBanner(validatePathForm(form, 'draft')[0]);
                                        return;
                                    }
                                    setStep(p => p + 1);
                                    setErrorBanner('');
                                }}
                                className="px-10 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg active:scale-95 flex items-center gap-2 group"
                            >
                                Tiếp tục <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    if (validationErrors.length) { setErrorBanner(validationErrors[0]); return; }
                                    const payload = { ...form, updatedAt: new Date().toISOString() };
                                    isMentor ? onSubmitApproval?.(payload) : onPublish?.(payload);
                                }}
                                className="px-12 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 flex items-center gap-2 group"
                            >
                                <Sparkles size={18} /> {isMentor ? 'Gửi duyệt' : 'Xuất bản ngay'}
                            </button>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
}

/**
 * STEP 1: BASIC INFO (REDESIGNED)
 */
function StepBasicInfo({ form, update, pathType }) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5">Tiêu đề lộ trình <span className="text-rose-500">*</span></label>
                    <input
                        className="w-full rounded-xl border border-slate-200 px-5 py-3.5 text-base font-semibold focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-300"
                        value={form.title}
                        onChange={(e) => update({ title: e.target.value })}
                        placeholder="VD: Java Fullstack - Zero to Hero"
                    />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5">Kỹ năng đào tạo</label>
                        <div className="relative group">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                list="skills"
                                className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3 text-sm font-semibold focus:border-indigo-600 outline-none"
                                value={form.skill}
                                onChange={(e) => update({ skill: e.target.value })}
                                placeholder="Search skills..."
                            />
                            <datalist id="skills">{SKILL_SUGGESTIONS.map(s => <option key={s} value={s} />)}</datalist>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5">Trình độ</label>
                        <select
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold focus:border-indigo-600 outline-none cursor-pointer"
                            value={form.level}
                            onChange={(e) => update({ level: e.target.value })}
                        >
                            {LEVEL_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5">Mô tả chi tiết</label>
                    <textarea
                        rows={5}
                        className="w-full rounded-xl border border-slate-200 px-5 py-4 text-sm font-medium focus:border-indigo-600 outline-none resize-none placeholder:text-slate-300 leading-relaxed"
                        value={form.description}
                        onChange={(e) => update({ description: e.target.value })}
                        placeholder="Nội dung lộ trình nhắm tới ai? Đầu ra mục tiêu là gì?..."
                    />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5">Thumbnail URL</label>
                  <input
                      className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300"
                      value={form.thumbnail}
                      onChange={(e) => update({ thumbnail: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                  />
                </div>
            </div>

            <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 grid sm:grid-cols-2 gap-8 items-center">
                <div>
                    <label className="block text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] mb-4">Pricing Model</label>
                    <div className="flex gap-6">
                        {['FREE', 'PAID'].map(t => (
                            <label key={t} className="flex items-center gap-2.5 cursor-pointer group">
                                <input type="radio" className="sr-only" checked={form.priceType === t} onChange={() => update({ priceType: t, totalCreditsCost: t === 'FREE' ? '' : form.totalCreditsCost })} />
                                <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                                    form.priceType === t ? 'border-indigo-600 bg-indigo-600 shadow-sm' : 'border-slate-300 bg-white group-hover:border-slate-400'
                                }`}>
                                    {form.priceType === t && <div className="w-1.5 h-1.5 rounded-full bg-white animate-in zoom-in" />}
                                </div>
                                <span className={`text-sm font-bold ${form.priceType === t ? 'text-slate-900' : 'text-slate-500'}`}>{t === 'FREE' ? 'Miễn phí' : 'Trả phí'}</span>
                            </label>
                        ))}
                    </div>
                </div>
                {form.priceType === 'PAID' && (
                    <div className="animate-in fade-in slide-in-from-left-4">
                        <label className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Giá Credits</label>
                        <div className="relative">
                            <input
                                type="number"
                                className="w-full rounded-xl border border-indigo-200 px-10 py-2.5 text-base font-black text-indigo-700 focus:border-indigo-600 outline-none shadow-inner"
                                value={form.totalCreditsCost}
                                onChange={(e) => update({ totalCreditsCost: e.target.value })}
                            />
                            <Star className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={16} fill="currentColor" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * STEP 2: CURRICULUM (REDESIGNED)
 */
function StepCurriculum({ form, update, pathType }) {
    const isMentor = pathType === 'MENTOR';
    const modules = form.modules || [];

    const addModule = () => update({ modules: [...modules, emptyModule(pathType)] });
    const removeModule = (idx) => update({ modules: modules.filter((_, i) => i !== idx) });
    const updateModule = (idx, delta) => update({
        modules: modules.map((m, i) => (i === idx ? { ...m, ...delta } : m))
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Chi tiết chương trình</h3>
                    <p className="text-xs text-slate-400 font-medium tracking-tight mt-0.5">Xây dựng cấu trúc bài học theo từng Module khoa học</p>
                </div>
                <button
                    type="button"
                    onClick={addModule}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 transition-colors"
                >
                    <Plus size={16} /> Thêm Module
                </button>
            </div>

            <div className="space-y-6">
                {modules.map((mod, mi) => (
                    <div key={mod.id} className="group rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all hover:border-indigo-200">
                        <header className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-black text-slate-400 text-xs shadow-sm">
                                    {mi + 1}
                                </span>
                                <input
                                    className="bg-transparent border-none text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:ring-0 flex-1 px-1"
                                    value={mod.title}
                                    onChange={(e) => updateModule(mi, { title: e.target.value })}
                                    placeholder="Tên Module (VD: Intro to Hooks)"
                                />
                            </div>
                            <button onClick={() => removeModule(mi)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </header>

                        <div className="p-6 space-y-6">
                            <div className="grid sm:grid-cols-2 gap-4">
                               <div className="flex items-center gap-4 py-2">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                     <input type="checkbox" className="w-4 h-4 rounded text-indigo-600" checked={mod.hasQuiz} onChange={e => updateModule(mi, { hasQuiz: e.target.checked })} />
                                     <span className="text-xs font-bold text-slate-700">Chứa Quiz cuối module</span>
                                  </label>
                                  {mod.hasQuiz && (
                                     <label className="flex items-center gap-2 cursor-pointer pl-4 border-l border-slate-100">
                                        <input type="checkbox" className="w-4 h-4 rounded text-rose-500" checked={mod.isQuizMandatory} onChange={e => updateModule(mi, { isQuizMandatory: e.target.checked })} />
                                        <span className="text-[11px] font-bold text-rose-500">Bắt buộc pass</span>
                                     </label>
                                  )}
                               </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Danh sách bài học</label>
                                {mod.lessons?.map((les, li) => (
                                    <div key={les.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/30 group/les transition-all">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center">
                                            <Play size={14} className="text-slate-300" />
                                        </div>
                                        <div className="flex-1 grid grid-cols-2 gap-4 h-9">
                                           <input className="text-sm font-bold text-slate-800 bg-transparent border-none focus:ring-0 placeholder:text-slate-300" 
                                                  value={les.title} onChange={e => {
                                                     const next = mod.lessons.map((l, i) => i === li ? { ...l, title: e.target.value } : l);
                                                     updateModule(mi, { lessons: next });
                                                  }} placeholder="Tiêu đề bài học..." />
                                           <input className="text-xs font-medium text-indigo-600 bg-transparent border-none focus:ring-0 placeholder:text-slate-300"
                                                  value={les.videoUrl} onChange={e => {
                                                     const next = mod.lessons.map((l, i) => i === li ? { ...l, videoUrl: e.target.value } : l);
                                                     updateModule(mi, { lessons: next });
                                                  }} placeholder="URL Video (Youtube/Vimeo)..." />
                                        </div>
                                        <button onClick={()=>{
                                            const next = mod.lessons.filter((_, i) => i !== li);
                                            updateModule(mi, { lessons: next });
                                        }} className="p-1 opacity-0 group-hover/les:opacity-100 transition-opacity text-slate-300 hover:text-rose-500">
                                           <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => {
                                        updateModule(mi, { lessons: [...(mod.lessons || []), emptyLesson()] });
                                    }}
                                    className="w-full py-2 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all flex items-center justify-center gap-2 text-xs font-bold"
                                >
                                    <Plus size={14} /> Thêm bài học
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * STEP 3: REVIEW (MINIMAL)
 */
function StepReview({ form, mentor }) {
    return (
        <div className="space-y-10 animate-in zoom-in-95 duration-500 pb-10">
            <div className="text-center py-6">
                <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-2xl shadow-indigo-200 mb-6 rotate-3">
                   <Sparkles size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Mọi thứ đã sẵn sàng?</h3>
                <p className="text-sm text-slate-500 font-medium mt-2">Vui lòng kiểm tra lại thông tin cuối cùng trước khi gửi yêu cầu.</p>
            </div>

            <div className="grid gap-4 max-w-lg mx-auto">
                 <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-5">
                     <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm">TITLE</div>
                     <div className="flex-1 min-w-0 font-bold text-slate-800 text-sm truncate">{form.title}</div>
                 </div>
                 <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-5">
                     <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 font-black text-sm">SKILL</div>
                     <div className="flex-1 min-w-0 font-bold text-slate-800 text-sm truncate">{form.skill} — {form.level}</div>
                 </div>
                 <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-5">
                     <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-sm">PRICE</div>
                     <div className="flex-1 min-w-0 font-bold text-slate-800 text-sm truncate">
                        {form.priceType === 'FREE' ? 'Miễn phí cho cộng đồng' : `${form.totalCreditsCost} Credits`}
                     </div>
                 </div>
            </div>
            
            <div className="p-8 rounded-[2rem] bg-amber-50 border border-amber-100 text-amber-900 text-sm font-medium leading-relaxed max-w-2xl mx-auto">
               <strong className="block mb-2 flex items-center gap-2"><AlertCircle size={18} /> Lưu ý quan trọng:</strong>
               Khi đã gửi duyệt, bạn sẽ không thể chỉnh sửa nội dung này cho đến khi Admin đưa ra phản hồi. Hãy chắc chắn rằng các bài học và URL video đã hoàn tất và xem được.
            </div>
        </div>
    );
}
