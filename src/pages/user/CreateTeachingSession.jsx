import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, ArrowRight, Check, Sparkle, Lightning,
    CalendarBlank, Plus, Trash, Rocket, Spinner, WarningCircle
} from '@phosphor-icons/react';
import httpClient from '../../configuration/axiosClient';
import { API_ENDPOINTS } from '../../configuration/apiEndpoints';
import { createSlotsBatch } from '../../services/sessionService';
import { toastError, toastSuccess } from "../../utils/toastUtils";
import { getNextDaysFromToday, formatDateYMDLocal, getMinTimeHHMMForDate } from '../../utils/dateUtils';
import UserSkillCard from '../../components/common/UserSkillCard';

const { TEACHING_SKILLS } = API_ENDPOINTS;

const categoryStyle = (cat) => {
    const map = {
        'Công nghệ': { bg: 'bg-blue-50',    border: 'border-blue-200',   text: 'text-blue-600'   },
        'Thiết kế':  { bg: 'bg-purple-50',  border: 'border-purple-200', text: 'text-purple-600' },
        'Kinh doanh':{ bg: 'bg-emerald-50', border: 'border-emerald-200',text: 'text-emerald-600'},
        'Ngôn ngữ':  { bg: 'bg-cyan-50',    border: 'border-cyan-200',   text: 'text-cyan-600'   },
        'Sáng tạo':  { bg: 'bg-orange-50',  border: 'border-orange-200', text: 'text-orange-600' },
        'Kỹ năng mềm':{ bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-600'  },
    };
    return map[cat] ?? { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600' };
};

const TIME_OPTIONS = [
    '07:00', '08:00', '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '19:00', '20:00', '21:00',
];

// Tự động tính giờ kết thúc = bắt đầu + 1 tiếng (cùng ngày)
const calcEndTime = (startTime) => {
    const [h, m] = startTime.split(':').map(Number);
    const d = new Date(2000, 0, 1, h, m || 0, 0, 0);
    d.setHours(d.getHours() + 1);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const timeToMinutes = (t) => {
    if (!t || typeof t !== 'string') return NaN;
    const [h, m] = t.split(':').map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return NaN;
    return h * 60 + m;
};

/** Các giờ kết thúc hợp lệ: sau giờ bắt đầu (gợi ý +1h và các mốc trong TIME_OPTIONS) */
const getEndTimeOptionsForStart = (startTime, currentEnd) => {
    const suggested = calcEndTime(startTime);
    const later = TIME_OPTIONS.filter((x) => x > startTime);
    const merged = [...new Set([suggested, ...later])];
    if (currentEnd && !merged.includes(currentEnd)) merged.push(currentEnd);
    return merged.sort();
};

/** Giờ bắt đầu khả dụng: nếu chọn hôm nay thì chỉ sau thời điểm hiện tại */
const getStartTimeOptionsForDate = (isoDate) => {
    const today = formatDateYMDLocal(new Date());
    if (isoDate !== today) return TIME_OPTIONS;
    const min = getMinTimeHHMMForDate(isoDate);
    if (!min) return TIME_OPTIONS;
    return TIME_OPTIONS.filter((t) => timeToMinutes(t) > timeToMinutes(min));
};

// 30 ngày từ hôm nay (gồm hôm nay), theo giờ local
const ALL_DATES = getNextDaysFromToday(30);

// Format ngày hiển thị
const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' });
};

// Tạo slot mới — giờ mặc định theo các mốc còn hợp lệ trong ngày đầu tiên
const newSlot = () => {
    const date = ALL_DATES[0];
    const starts = getStartTimeOptionsForDate(date);
    const time = starts[0] ?? '19:00';
    return {
        id: crypto.randomUUID(),
        date,
        time,
        endTime: calcEndTime(time),
        creditCost: 5,
    };
};

// ── Step Indicator ────────────────────────────────
const StepBar = ({ step }) => {
    const steps = ['Kỹ năng', 'Lịch rảnh', 'Xác nhận'];
    return (
        <div className="flex items-center gap-0 mb-8">
            {steps.map((label, i) => {
                const idx = i + 1;
                const done   = step > idx;
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
    const style = data.teachingSkill ? categoryStyle(data.teachingSkill.skillCategory) : {};

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
                {approvedSkills.map(skill => (
                    <UserSkillCard
                        key={skill.id}
                        skill={skill}
                        selected={data.teachingSkill?.id === skill.id}
                        onClick={() => setData(d => ({ ...d, teachingSkill: skill }))}
                        showStatusBadge={false}
                        showDesc={true}
                    />
                ))}
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

// ── Step 2: Tạo từng slot riêng lẻ với credit riêng ──────────
const Step2 = ({ data, setData, onNext, onBack }) => {
    const defaultCredits = data.teachingSkill?.creditsPerHour ?? 5;
    const [slots, setSlots] = useState(
        data.slots?.length ? data.slots : [{ ...newSlot(), creditCost: defaultCredits }]
    );

    const addSlot = () => setSlots(prev => [...prev, { ...newSlot(), creditCost: defaultCredits }]);
    const removeSlot = (id) => setSlots(prev => prev.filter(s => s.id !== id));
    const updateSlot = (id, field, value) => {
        setSlots(prev => prev.map(s => {
            if (s.id !== id) return s;
            const updated = { ...s, [field]: value };
            if (field === 'date') {
                const opts = getStartTimeOptionsForDate(value);
                if (opts.length === 0) {
                    updated.time = '';
                    updated.endTime = '';
                } else if (!opts.includes(updated.time)) {
                    updated.time = opts[0];
                    updated.endTime = calcEndTime(opts[0]);
                }
            }
            if (field === 'time') {
                updated.endTime = calcEndTime(value);
            }
            if (field === 'time' || field === 'endTime') {
                if (timeToMinutes(updated.endTime) <= timeToMinutes(updated.time)) {
                    updated.endTime = calcEndTime(updated.time);
                }
            }
            return updated;
        }));
    };

    const handleNext = () => {
        setData(d => ({ ...d, slots }));
        onNext();
    };

    const isValid = slots.length > 0 && slots.every(s => {
        if (!s.date || !s.time || s.creditCost <= 0) return false;
        if (timeToMinutes(s.endTime) <= timeToMinutes(s.time)) return false;
        const opts = getStartTimeOptionsForDate(s.date);
        if (opts.length === 0 || !opts.includes(s.time)) return false;
        return true;
    });

    return (
        <div>
            <h2 className="text-lg font-extrabold text-slate-900 mb-1">Tạo lịch dạy</h2>
            <p className="text-xs text-slate-400 mb-5">
                Mỗi dòng là một buổi học. Bạn có thể đặt số credits khác nhau cho từng buổi.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2 mb-5">
                <span className="text-lg shrink-0">💡</span>
                <p className="text-xs text-amber-700">
                    Học viên sẽ thấy từng slot kèm <strong>số credits cần trả</strong>. Credits sẽ được tạm giữ khi bạn đồng ý dạy.
                </p>
            </div>

            {/* Header */}
            <div className="hidden md:grid grid-cols-[1fr_130px_130px_110px_36px] gap-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wide mb-2 px-1">
                <span>📅 Ngày</span>
                <span>🕐 Bắt đầu</span>
                <span>🕑 Kết thúc</span>
                <span>⚡ Credits</span>
                <span></span>
            </div>

            <div className="flex flex-col gap-3 mb-4">
                {slots.map((slot) => (
                    <div key={slot.id}
                        className="group grid grid-cols-1 md:grid-cols-[1fr_130px_130px_110px_36px] gap-2 items-center bg-white border border-slate-100 rounded-2xl p-3 shadow-sm hover:border-violet-200 hover:shadow-md transition-all">

                        {/* Ngày */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 md:hidden mb-1 block">📅 Ngày</label>
                            <select
                                value={slot.date}
                                onChange={e => updateSlot(slot.id, 'date', e.target.value)}
                                className="w-full text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all cursor-pointer"
                            >
                                {ALL_DATES.map(d => (
                                    <option key={d} value={d}>{formatDate(d)} ({d})</option>
                                ))}
                            </select>
                        </div>

                        {/* Giờ bắt đầu */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 md:hidden mb-1 block">🕐 Bắt đầu</label>
                            <select
                                value={slot.time}
                                onChange={e => updateSlot(slot.id, 'time', e.target.value)}
                                className="w-full text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all cursor-pointer"
                            >
                                {getStartTimeOptionsForDate(slot.date).length === 0 ? (
                                    <option value="">Hết khung giờ — chọn ngày khác</option>
                                ) : (
                                    getStartTimeOptionsForDate(slot.date).map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))
                                )}
                            </select>
                        </div>

                        {/* Giờ kết thúc */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 md:hidden mb-1 block">🕑 Kết thúc</label>
                            <select
                                value={slot.endTime}
                                onChange={e => updateSlot(slot.id, 'endTime', e.target.value)}
                                className="w-full text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all cursor-pointer"
                            >
                                {getEndTimeOptionsForStart(slot.time, slot.endTime).map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        {/* Credits */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 md:hidden mb-1 block">⚡ Credits</label>
                            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                                <Lightning size={14} weight="fill" className="text-amber-400 shrink-0" />
                                <input
                                    type="number"
                                    min={1}
                                    max={999}
                                    value={slot.creditCost || ''}
                                    onChange={e => updateSlot(slot.id, 'creditCost', Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-full bg-transparent text-sm font-extrabold text-amber-700 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Xóa */}
                        <button
                            onClick={() => removeSlot(slot.id)}
                            disabled={slots.length === 1}
                            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <Trash size={16} weight="bold" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Thêm buổi */}
            <button
                onClick={addSlot}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-violet-200 text-violet-500 font-bold text-sm hover:border-violet-400 hover:bg-violet-50 transition-all mb-5"
            >
                <Plus size={16} weight="bold" /> Thêm buổi học
            </button>

            {/* Tổng kết */}
            {slots.length > 0 && (
                <div className="flex items-center justify-between bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 mb-4">
                    <span className="text-sm font-bold text-violet-700">
                        {slots.length} buổi học
                    </span>
                    <span className="text-sm font-extrabold text-amber-600 flex items-center gap-1">
                        <Lightning size={14} weight="fill" />
                        {slots.reduce((sum, s) => sum + (s.creditCost || 0), 0)} credits tổng
                    </span>
                </div>
            )}

            {!isValid && (
                <p className="text-xs text-amber-600 font-semibold mb-4">⚠️ Mỗi buổi cần có ngày, giờ bắt đầu — kết thúc (kết thúc phải sau giờ bắt đầu), và credits ≥ 1.</p>
            )}

            <div className="flex justify-between mt-2">
                <button onClick={onBack} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all">
                    <ArrowLeft size={15} weight="bold" /> Quay lại
                </button>
                <button onClick={handleNext} disabled={!isValid}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${isValid ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                    Xem lại <ArrowRight size={15} weight="bold" />
                </button>
            </div>
        </div>
    );
};

// ── Step 3: Xác nhận + Submit ─────────────────────
const Step3 = ({ data, onBack, onSubmit, submitting, submitError }) => {
    const s = data.teachingSkill;
    const slots = data.slots ?? [];

    return (
        <div>
            <h2 className="text-lg font-extrabold text-slate-900 mb-5">Xem lại &amp; tạo lịch</h2>

            {/* Skill preview */}
            {s && (
                <div className={`rounded-2xl border-2 p-5 mb-4 ${categoryStyle(s.skillCategory).bg} ${categoryStyle(s.skillCategory).border}`}>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{s.skillIcon || '📘'}</span>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`font-extrabold text-base ${categoryStyle(s.skillCategory).text}`}>{s.skillName}</span>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">{s.level}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{s.outcomeDesc}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Bảng slots */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm mb-4 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <CalendarBlank size={12} weight="duotone" className="text-violet-500" />
                        {slots.length} buổi học sẽ được tạo
                    </p>
                    <span className="text-xs font-extrabold text-amber-600 flex items-center gap-1">
                        <Lightning size={12} weight="fill" />
                        Tổng: {slots.reduce((sum, sl) => sum + (sl.creditCost || 0), 0)} credits
                    </span>
                </div>
                <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                    {slots.map((slot, idx) => (
                        <div key={slot.id ?? idx} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-[11px] font-bold w-5 text-slate-300 text-center">{idx + 1}</span>
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                                    {formatDate(slot.date)} ({slot.date})
                                </span>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                    {slot.time} – {slot.endTime}
                                </span>
                            </div>
                            <span className="text-xs font-extrabold text-amber-600 flex items-center gap-1 shrink-0 ml-3">
                                <Lightning size={11} weight="fill" className="text-amber-400" />
                                {slot.creditCost} credits
                            </span>
                        </div>
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
                    Sau khi tạo, học viên sẽ thấy các slot <strong>Trống</strong> kèm số credits cần trả và có thể đặt lịch ngay.
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
                    {submitting ? 'Đang tạo…' : `Tạo ${slots.length} buổi học`}
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
            Đã tạo <strong className="text-violet-600">{createdCount} buổi học</strong> cho kỹ năng <strong>{data.teachingSkill?.skillName}</strong>.
        </p>
        <div className="bg-violet-50 border border-violet-200 rounded-2xl px-6 py-4 inline-block mb-8 text-left">
            <p className="text-xs font-bold text-violet-700 mb-1">🔔 Bước tiếp theo:</p>
            <ul className="text-xs text-violet-600 space-y-1 list-disc list-inside">
                <li>Học viên tìm thấy slot trống của bạn trong mục Khám phá</li>
                <li>Họ đặt lịch → credits được giữ an toàn trong hệ thống Tạm giữ</li>
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

    const [approvedSkills, setApprovedSkills] = useState([]);
    const [loadingSkills, setLoadingSkills] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await httpClient.get(TEACHING_SKILLS.GET_MY);
                const all = res?.result ?? (Array.isArray(res) ? res : []);
                setApprovedSkills(all.filter(s => s.verificationStatus === 'APPROVED'));
            } catch {
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
        const list = form.slots ?? [];
        for (const s of list) {
            if (timeToMinutes(s.endTime) <= timeToMinutes(s.time)) {
                setSubmitError('Giờ kết thúc phải sau giờ bắt đầu.');
                toastError(null, 'Giờ kết thúc phải sau giờ bắt đầu.');
                return;
            }
            const tStr = s.time.length === 5 ? `${s.time}:00` : s.time;
            const startAt = new Date(`${s.date}T${tStr}`);
            if (Number.isFinite(startAt.getTime()) && startAt.getTime() <= Date.now()) {
                setSubmitError('Không thể tạo slot trong quá khứ.');
                toastError(null, 'Không thể tạo slot trong quá khứ.');
                return;
            }
        }

        setSubmitting(true);
        setSubmitError('');
        try {
            const slotsPayload = (form.slots ?? []).map(s => ({
                date: s.date,
                time: s.time,
                endTime: s.endTime || null,
                creditCost: s.creditCost,
            }));
            const result = await createSlotsBatch(form.teachingSkill.id, slotsPayload);
            setCreatedCount(Array.isArray(result) ? result.length : 0);
            toastSuccess(`Đã tạo ${Array.isArray(result) ? result.length : 0} slot.`);
            setDone(true);
        } catch (e) {
            setSubmitError(e?.response?.data?.message || 'Tạo slot thất bại. Vui lòng thử lại.');
            toastError(e, "Tạo slot thất bại.");
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
                <p className="text-sm text-slate-400 mt-1">Chọn kỹ năng → tạo từng buổi học với giá riêng → xác nhận</p>
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