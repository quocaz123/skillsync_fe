import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, ArrowRight, Check, Sparkle, Lightning,
    CalendarBlank, Plus, Trash, Rocket, Spinner, WarningCircle
} from '@phosphor-icons/react';
import httpClient from '../../configuration/axiosClient';
import { API_ENDPOINTS } from '../../configuration/apiEndpoints';
import { createSlotsBatch } from '../../services/sessionService';

const { TEACHING_SKILLS } = API_ENDPOINTS;

const LEVELS = [
    { id: 'BEGINNER', label: 'Beginner', sub: 'Biết cơ bản' },
    { id: 'INTERMEDIATE', label: 'Intermediate', sub: 'Có kinh nghiệm thực tế' },
    { id: 'ADVANCED', label: 'Advanced', sub: 'Chuyên sâu, nhiều dự án' },
];

// Màu sắc theo category
const categoryStyle = (cat) => {
    const map = {
        'Công nghệ': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
        'Thiết kế': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
        'Kinh doanh': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' },
        'Ngôn ngữ': { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600' },
        'Sáng tạo': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600' },
        'Kỹ năng mềm': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
    };
    return map[cat] ?? { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600' };
};

// Thời gian có thể chọn
const TIME_OPTIONS = [
    '07:00', '08:00', '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '19:00', '20:00', '21:00',
];

// Tạo 14 ngày tiếp theo
const getNext14Days = () =>
    Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        return {
            iso: d.toISOString().split('T')[0],
            label: d.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' }),
        };
    });

// ── Step Indicator ────────────────────────────────
const StepBar = ({ step }) => {
    const steps = ['Kỹ năng', 'Lịch rảnh', 'Xác nhận'];
    return (
        <div className="flex items-center gap-0 mb-8">
            {steps.map((label, i) => {
                const idx = i + 1;
                const done = step > idx;
                const active = step === idx;
                return (
                    <div key={idx} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center shrink-0">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-sm transition-all ${done ? 'bg-violet-600 text-white' : active ? 'bg-violet-600 text-white ring-4 ring-violet-100' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                                {done ? <Check size={16} weight="bold" /> : idx}
                            </div>
                            <span className={`text-[11px] font-bold mt-1 ${active ? 'text-violet-600' : done ? 'text-violet-400' : 'text-slate-400'}`}>{label}</span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className={`h-0.5 flex-1 mx-1 mb-4 transition-all ${done ? 'bg-violet-500' : 'bg-slate-200'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// ── Step 1: Chọn kỹ năng đã được duyệt ──────────
const Step1 = ({ approvedSkills, loading, data, setData, onNext }) => {
    const canNext = data.teachingSkill;
    const style = data.teachingSkill
        ? categoryStyle(data.teachingSkill.skillCategory)
        : {};

    if (loading) {
        return (
            <div className="flex flex-col items-center gap-4 py-20 text-slate-400">
                <Spinner size={28} className="animate-spin text-violet-500" />
                <p className="text-sm font-medium">Đang tải kỹ năng đã duyệt…</p>
            </div>
        );
    }

    if (approvedSkills.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <WarningCircle size={40} weight="duotone" className="text-amber-400" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-800 mb-2">Chưa có kỹ năng nào được duyệt</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                    Bạn cần đăng ký kỹ năng dạy và chờ Admin duyệt trước khi tạo lịch rảnh.
                </p>
                <a href="/app/teaching"
                    className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-violet-600 text-white font-bold rounded-xl text-sm hover:bg-violet-700 transition-all">
                    Đến trang quản lý kỹ năng →
                </a>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-lg font-extrabold text-slate-900 mb-1">Chọn kỹ năng để tạo lịch dạy</h2>
            <p className="text-xs text-slate-400 mb-5">Chỉ hiển thị kỹ năng đã được Admin duyệt ✅</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
                {approvedSkills.map(skill => {
                    const s = categoryStyle(skill.skillCategory);
                    const selected = data.teachingSkill?.id === skill.id;
                    return (
                        <button
                            key={skill.id}
                            onClick={() => setData(d => ({ ...d, teachingSkill: skill }))}
                            className={`rounded-2xl border-2 p-4 flex items-center gap-4 transition-all hover:shadow-md text-left ${selected ? `border-violet-500 ${s.bg} shadow-sm` : `border-transparent ${s.bg} hover:border-slate-200`}`}
                        >
                            <span className="text-3xl shrink-0">{skill.skillIcon || '📘'}</span>
                            <div className="flex-1 min-w-0">
                                <p className={`font-extrabold text-sm truncate ${selected ? 'text-violet-700' : s.text}`}>
                                    {skill.skillName}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">{skill.skillCategory} · {skill.level}</p>
                                <p className="text-[11px] text-amber-600 font-bold mt-1 flex items-center gap-1">
                                    <Lightning size={10} weight="fill" /> {skill.creditsPerHour} credits/giờ
                                </p>
                            </div>
                            {selected && (
                                <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center shrink-0">
                                    <Check size={13} weight="bold" className="text-white" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {data.teachingSkill && (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 ${style.bg} ${style.border} mb-6`}>
                    <span className="text-2xl">{data.teachingSkill.skillIcon || '📘'}</span>
                    <div>
                        <p className={`font-extrabold text-sm ${style.text}`}>Đã chọn: {data.teachingSkill.skillName}</p>
                        <p className="text-xs text-slate-500">{data.teachingSkill.outcomeDesc}</p>
                    </div>
                </div>
            )}

            <div className="flex justify-end">
                <button onClick={onNext} disabled={!canNext}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${canNext ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                    Tiếp theo <ArrowRight size={15} weight="bold" />
                </button>
            </div>
        </div>
    );
};

// ── Step 2: Tạo lịch rảnh (batch) ────────────────
const Step2 = ({ data, setData, onNext, onBack }) => {
    const DAYS = getNext14Days();
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedTimes, setSelectedTimes] = useState([]);

    const toggleDate = (d) => setSelectedDates(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
    const toggleTime = (t) => setSelectedTimes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

    const handleNext = () => {
        setData(d => ({ ...d, selectedDates, selectedTimes }));
        onNext();
    };

    return (
        <div>
            <h2 className="text-lg font-extrabold text-slate-900 mb-1">Tạo lịch rảnh</h2>
            <p className="text-xs text-slate-400 mb-5">
                Chọn nhiều ngày + nhiều giờ → hệ thống tạo tất cả tổ hợp (dates x times).
                Slot trùng tự được bỏ qua.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2 mb-6">
                <span className="text-lg shrink-0">💡</span>
                <p className="text-xs text-amber-700">
                    Học viên sẽ thấy các slot <strong>Trống</strong> và đặt lịch trực tiếp. Credits chuyển ngay khi đặt.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-5">
                {/* Date picker */}
                <div className="flex-1">
                    <p className="text-xs font-bold text-slate-500 mb-2">
                        📅 Chọn ngày ({selectedDates.length} đã chọn):
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 max-h-72 overflow-y-auto pr-1">
                        {DAYS.map(({ iso, label }) => {
                            const sel = selectedDates.includes(iso);
                            return (
                                <button key={iso} onClick={() => toggleDate(iso)}
                                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left ${sel ? 'border-violet-400 bg-violet-50 text-violet-700' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'}`}>
                                    {sel && <Check size={10} weight="bold" className="inline mr-1" />}
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>
                {/* Time picker */}
                <div className="flex-1">
                    <p className="text-xs font-bold text-slate-500 mb-2">
                        🕐 Chọn giờ ({selectedTimes.length} đã chọn):
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                        {TIME_OPTIONS.map(t => {
                            const sel = selectedTimes.includes(t);
                            return (
                                <button key={t} onClick={() => toggleTime(t)}
                                    className={`px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all ${sel ? 'border-violet-400 bg-violet-50 text-violet-700' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'}`}>
                                    {sel && <Check size={11} weight="bold" className="inline mr-1" />}
                                    {t}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {selectedDates.length > 0 && selectedTimes.length > 0 && (
                <p className="text-sm text-violet-700 font-bold bg-violet-50 px-4 py-2 rounded-xl inline-block mb-4">
                    Sẽ tạo tối đa <strong>{selectedDates.length * selectedTimes.length}</strong> slot
                    &nbsp;({selectedDates.length} ngày × {selectedTimes.length} giờ)
                </p>
            )}

            {selectedDates.length === 0 || selectedTimes.length === 0 ? (
                <p className="text-xs text-amber-600 font-semibold mb-4">⚠️ Vui lòng chọn ít nhất 1 ngày và 1 giờ.</p>
            ) : null}

            <div className="flex justify-between mt-2">
                <button onClick={onBack} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all">
                    <ArrowLeft size={15} weight="bold" /> Quay lại
                </button>
                <button onClick={handleNext} disabled={selectedDates.length === 0 || selectedTimes.length === 0}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${selectedDates.length > 0 && selectedTimes.length > 0 ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                    Tiếp theo <ArrowRight size={15} weight="bold" />
                </button>
            </div>
        </div>
    );
};

// ── Step 3: Xác nhận + Submit ─────────────────────
const Step3 = ({ data, onBack, onSubmit, submitting, submitError }) => {
    const s = data.teachingSkill;
    const slotCount = (data.selectedDates?.length ?? 0) * (data.selectedTimes?.length ?? 0);

    return (
        <div>
            <h2 className="text-lg font-extrabold text-slate-900 mb-5">Xem lại & tạo lịch</h2>

            {/* Skill preview */}
            {s && (
                <div className={`rounded-2xl border-2 p-5 mb-4 ${categoryStyle(s.skillCategory).bg} ${categoryStyle(s.skillCategory).border}`}>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{s.skillIcon || '📘'}</span>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`font-extrabold text-base ${categoryStyle(s.skillCategory).text}`}>{s.skillName}</span>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">{s.level}</span>
                                <span className="flex items-center gap-1 text-[11px] font-extrabold text-amber-600">
                                    <Lightning size={11} weight="fill" className="text-amber-400" /> {s.creditsPerHour}/h
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{s.outcomeDesc}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Schedule preview */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4">
                <p className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-1">
                    <CalendarBlank size={12} weight="duotone" className="text-violet-500" />
                    Slot sẽ được tạo: tối đa <strong className="text-violet-600 ml-1">{slotCount} slot</strong>
                </p>
                <div className="flex flex-wrap gap-2">
                    {(data.selectedDates ?? []).slice(0, 4).map(d => (
                        <span key={d} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">{d}</span>
                    ))}
                    {(data.selectedDates ?? []).length > 4 && (
                        <span className="text-[11px] text-slate-400">+{data.selectedDates.length - 4} ngày nữa</span>
                    )}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {(data.selectedTimes ?? []).map(t => (
                        <span key={t} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">{t}</span>
                    ))}
                </div>
            </div>

            {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700 font-medium">
                    ❌ {submitError}
                </div>
            )}

            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                <span className="text-xl shrink-0">🚀</span>
                <p className="text-xs text-sky-600">
                    Sau khi tạo, học viên sẽ thấy các slot <strong>Trống</strong> và có thể đặt lịch ngay.
                </p>
            </div>

            <div className="flex justify-between">
                <button onClick={onBack} disabled={submitting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all">
                    <ArrowLeft size={15} weight="bold" /> Quay lại
                </button>
                <button onClick={onSubmit} disabled={submitting}
                    className="flex items-center gap-2 px-7 py-2.5 rounded-xl font-bold text-sm bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-200 active:scale-95 transition-all disabled:opacity-60">
                    {submitting ? <Spinner size={15} className="animate-spin" /> : <Rocket size={16} weight="duotone" />}
                    {submitting ? 'Đang tạo…' : `Tạo ${slotCount} slot`}
                </button>
            </div>
        </div>
    );
};

// ── Success screen ────────────────────────────────
const SuccessScreen = ({ data, createdCount, onDone }) => (
    <div className="text-center py-10">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Tạo lịch thành công!</h2>
        <p className="text-slate-500 text-sm mb-4">
            Đã tạo <strong className="text-violet-600">{createdCount} slot</strong> cho kỹ năng <strong>{data.teachingSkill?.skillName}</strong>.
        </p>
        <div className="bg-violet-50 border border-violet-200 rounded-2xl px-6 py-4 inline-block mb-8 text-left">
            <p className="text-xs font-bold text-violet-700 mb-1">🔔 Bước tiếp theo:</p>
            <ul className="text-xs text-violet-600 space-y-1 list-disc list-inside">
                <li>Học viên tìm thấy slot trống của bạn trong mục Khám phá</li>
                <li>Họ đặt lịch → credits tự trừ ngay</li>
                <li>Đến giờ, cả 2 vào /app/sessions → bấm Tham gia học</li>
            </ul>
        </div>
        <div>
            <button onClick={onDone}
                className="px-8 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-all shadow-md shadow-violet-200">
                Xem quản lý buổi dạy
            </button>
        </div>
    </div>
);

// ── MAIN COMPONENT ────────────────────────────────
const CreateTeachingSession = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [done, setDone] = useState(false);
    const [form, setForm] = useState({});
    const [createdCount, setCreatedCount] = useState(0);

    // Load approved teaching skills
    const [approvedSkills, setApprovedSkills] = useState([]);
    const [loadingSkills, setLoadingSkills] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await httpClient.get(TEACHING_SKILLS.GET_MY);
                const all = res?.result ?? (Array.isArray(res) ? res : []);
                setApprovedSkills(all.filter(s => s.verificationStatus === 'APPROVED'));
            } catch (_) {
                setApprovedSkills([]);
            } finally {
                setLoadingSkills(false);
            }
        };
        load();
    }, []);

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleSubmit = async () => {
        setSubmitting(true);
        setSubmitError('');
        try {
            const result = await createSlotsBatch(
                form.teachingSkill.id,
                form.selectedDates,
                form.selectedTimes
            );
            setCreatedCount(Array.isArray(result) ? result.length : 0);
            setDone(true);
        } catch (e) {
            setSubmitError(e?.response?.data?.message || 'Tạo slot thất bại. Vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };

    const next = () => setStep(s => Math.min(s + 1, 3));
    const back = () => step === 1 ? navigate(-1) : setStep(s => s - 1);

    return (
        <div className="max-w-3xl mx-auto font-sans pb-14">
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Sparkle size={24} weight="duotone" className="text-amber-400" /> Tạo lịch dạy mới
                </h1>
                <p className="text-sm text-slate-400 mt-1">Chọn kỹ năng đã duyệt → chọn ngày/giờ → xác nhận</p>
            </div>

            {!done && <StepBar step={step} />}

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
                {done ? (
                    <SuccessScreen data={form} createdCount={createdCount} onDone={() => navigate('/app/teaching')} />
                ) : step === 1 ? (
                    <Step1
                        approvedSkills={approvedSkills}
                        loading={loadingSkills}
                        data={form}
                        setData={setForm}
                        onNext={next}
                    />
                ) : step === 2 ? (
                    <Step2 data={form} setData={setForm} onNext={next} onBack={back} />
                ) : (
                    <Step3
                        data={form}
                        onBack={back}
                        onSubmit={handleSubmit}
                        submitting={submitting}
                        submitError={submitError}
                    />
                )}
            </div>
        </div>
    );
};

export default CreateTeachingSession;
