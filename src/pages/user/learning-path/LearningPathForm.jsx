import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Save, Rocket, Check } from 'lucide-react';
import LearningPathBasicInfoSection from './LearningPathBasicInfoSection';
import LearningPathCurriculumSection from './LearningPathCurriculumSection';
import LearningPathReviewSection from './LearningPathReviewSection';
import LearningPathPreviewCard from './LearningPathPreviewCard';
import { createInitialFormState, validateStep, validateAll } from './learningPathFormState';

const STEPS = [
    { id: 1, label: 'Thông tin cơ bản' },
    { id: 2, label: 'Chương trình (module & bài)' },
    { id: 3, label: 'Xem lại' },
    { id: 4, label: 'Xuất bản' },
];

export default function LearningPathForm({
    pathType,
    initialData,
    mode = 'create',
    mentor = null,
    onSaveDraft,
    onPublish,
}) {
    const [step, setStep] = useState(1);
    const [data, setData] = useState(() =>
        createInitialFormState(pathType, { ...(initialData || {}), pathType })
    );
    const [errors, setErrors] = useState({});
    const [submitMsg, setSubmitMsg] = useState(null);

    const mergedData = useMemo(() => ({ ...data, pathType }), [data, pathType]);

    const runValidate = (s) => {
        const e = validateStep(s, mergedData, pathType);
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const next = () => {
        if (step === 3) {
            const e = validateAll(mergedData);
            setErrors(e);
            if (Object.keys(e).length > 0) return;
            setStep(4);
            return;
        }
        if (!runValidate(step)) return;
        setStep((x) => Math.min(4, x + 1));
    };

    const back = () => {
        setErrors({});
        setStep((x) => Math.max(1, x - 1));
    };

    const handleSaveDraft = () => {
        const e = validateAll(mergedData);
        setErrors(e);
        if (Object.keys(e).length > 0) {
            setSubmitMsg('Vui lòng sửa các lỗi được đánh dấu trước khi lưu.');
            return;
        }
        setSubmitMsg(null);
        onSaveDraft?.(mergedData);
        // mock
        if (!onSaveDraft) {
            // eslint-disable-next-line no-console
            console.log('[Draft]', mergedData);
            alert('Đã lưu nháp (mock). Kiểm tra console để xem payload.');
        }
    };

    const handlePublish = () => {
        const e = validateAll(mergedData);
        setErrors(e);
        if (Object.keys(e).length > 0) {
            setSubmitMsg('Còn lỗi — quay lại các bước trước để sửa.');
            return;
        }
        setSubmitMsg(null);
        onPublish?.(mergedData);
        if (!onPublish) {
            // eslint-disable-next-line no-console
            console.log('[Publish]', mergedData);
            alert('Đã gửi xuất bản (mock). Kiểm tra console để xem payload.');
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            {/* Main column */}
            <div className="flex-1 min-w-0 w-full space-y-6">
                {/* Stepper */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm overflow-x-auto">
                    <div className="flex items-center justify-between min-w-[520px] sm:min-w-0 sm:flex-wrap gap-2">
                        {STEPS.map((s, i) => (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => {
                                    if (s.id < step) {
                                        setErrors({});
                                        setStep(s.id);
                                    }
                                }}
                                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-left transition-colors ${
                                    step === s.id
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : step > s.id
                                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                          : 'bg-slate-50 text-slate-500 border border-slate-100'
                                }`}
                                disabled={s.id > step}
                            >
                                <span
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                                        step === s.id ? 'bg-white/20' : step > s.id ? 'bg-emerald-200' : 'bg-slate-200'
                                    }`}
                                >
                                    {step > s.id ? <Check size={14} /> : s.id}
                                </span>
                                <span className="text-xs sm:text-sm font-bold leading-tight">{s.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step body */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
                    {step === 1 && (
                        <LearningPathBasicInfoSection data={mergedData} onChange={setData} errors={errors} />
                    )}
                    {step === 2 && (
                        <LearningPathCurriculumSection
                            data={mergedData}
                            onChange={setData}
                            errors={errors}
                            pathType={pathType}
                        />
                    )}
                    {step === 3 && (
                        <LearningPathReviewSection data={mergedData} pathType={pathType} mentor={mentor} />
                    )}
                    {step === 4 && (
                        <div className="space-y-6 text-center py-4">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                                <Rocket size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900">Sẵn sàng xuất bản</h3>
                                <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                                    Kiểm tra lại ở bước 3 nếu cần. Bạn có thể lưu nháp hoặc xuất bản lộ trình. (Chưa gọi API thật)
                                </p>
                            </div>
                            {submitMsg && <p className="text-sm text-rose-600 font-medium">{submitMsg}</p>}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                                <button
                                    type="button"
                                    onClick={handleSaveDraft}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-800 font-bold text-sm hover:bg-slate-50"
                                >
                                    <Save size={18} /> Lưu nháp
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePublish}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                                >
                                    <Rocket size={18} /> Xuất bản
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer nav */}
                {step < 4 && (
                    <div className="flex flex-wrap justify-between gap-3">
                        <button
                            type="button"
                            onClick={back}
                            disabled={step === 1}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 disabled:opacity-40"
                        >
                            <ChevronLeft size={18} /> Quay lại
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-md"
                        >
                            Tiếp tục <ChevronRight size={18} />
                        </button>
                    </div>
                )}
                {step === 4 && (
                    <div className="flex justify-start">
                        <button
                            type="button"
                            onClick={() => setStep(3)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50"
                        >
                            <ChevronLeft size={18} /> Quay lại bước xem lại
                        </button>
                    </div>
                )}
            </div>

            {/* Preview — desktop sticky */}
            <aside className="w-full lg:w-[340px] shrink-0 lg:sticky lg:top-24 space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Xem trước trực tiếp</p>
                <LearningPathPreviewCard data={mergedData} mentor={mentor} />
            </aside>
        </div>
    );
}
