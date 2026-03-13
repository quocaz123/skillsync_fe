import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, ArrowRight, Check, Sparkle, Lightning,
    CalendarBlank, Plus, Trash, Rocket
} from '@phosphor-icons/react';

// ── Data ─────────────────────────────────────────
const SKILLS = [
    { id: 'react', icon: '⚛️', name: 'React', cat: 'Công nghệ', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
    { id: 'uiux', icon: '🎨', name: 'UI/UX Design', cat: 'Thiết kế', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
    { id: 'python', icon: '🐍', name: 'Python', cat: 'Công nghệ', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600' },
    { id: 'speaking', icon: '🎤', name: 'Public Speaking', cat: 'Kỹ năng mềm', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
    { id: 'figma', icon: '🖼️', name: 'Figma', cat: 'Thiết kế', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600' },
    { id: 'ml', icon: '🤖', name: 'Machine Learning', cat: 'Công nghệ', bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-600' },
    { id: 'excel', icon: '📊', name: 'Excel & Data', cat: 'Kinh doanh', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' },
    { id: 'guitar', icon: '🎸', name: 'Guitar', cat: 'Sáng tạo', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600' },
    { id: 'photo', icon: '📷', name: 'Nhiếp ảnh', cat: 'Sáng tạo', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600' },
    { id: 'english', icon: '🌐', name: 'Tiếng Anh', cat: 'Ngôn ngữ', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600' },
    { id: 'marketing', icon: '📣', name: 'Marketing', cat: 'Kinh doanh', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600' },
    { id: 'nodejs', icon: '🟩', name: 'Node.js', cat: 'Công nghệ', bg: 'bg-lime-50', border: 'border-lime-200', text: 'text-lime-600' },
];

const LEVELS = [
    { id: 'beginner', label: 'Beginner', sub: 'Biết cơ bản' },
    { id: 'intermediate', label: 'Intermediate', sub: 'Có kinh nghiệm thực tế' },
    { id: 'advanced', label: 'Advanced', sub: 'Chuyên sâu, nhiều dự án' },
];

const DAYS = ['T2 10/3', 'T3 11/3', 'T4 12/3', 'T5 13/3', 'T6 14/3', 'T7 15/3', 'CN 16/3'];
const HOURS = ['7:00 SA', '8:00 SA', '9:00 SA', '10:00 SA', '11:00 SA', '13:00 CH', '14:00 CH', '15:00 CH', '16:00 CH', '17:00 CH', '19:00 CH', '20:00 CH', '21:00 CH'];

// ── Step Indicator ───────────────────────────────
const StepBar = ({ step }) => {
    const steps = ['Kỹ năng', 'Mô tả', 'Lịch rảnh', 'Xác nhận'];
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

// ── Step 1: Skill ────────────────────────────────
const Step1 = ({ data, setData, onNext }) => {
    const canNext = data.skill && data.level;
    return (
        <div>
            <h2 className="text-lg font-extrabold text-slate-900 mb-5">Bạn muốn dạy kỹ năng gì?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
                {SKILLS.map(s => (
                    <button
                        key={s.id}
                        onClick={() => setData(d => ({ ...d, skill: s }))}
                        className={`rounded-2xl border-2 p-4 flex flex-col items-center gap-2 transition-all hover:shadow-md ${data.skill?.id === s.id ? `border-violet-500 ${s.bg} shadow-sm` : `border-transparent ${s.bg} hover:border-slate-200`}`}
                    >
                        <span className="text-3xl">{s.icon}</span>
                        <span className={`text-sm font-extrabold ${data.skill?.id === s.id ? 'text-violet-700' : s.text}`}>{s.name}</span>
                        <span className="text-[10px] text-slate-400">{s.cat}</span>
                    </button>
                ))}
            </div>

            <h3 className="text-sm font-extrabold text-slate-700 mb-3">Cấp độ của bạn:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {LEVELS.map(lv => (
                    <button
                        key={lv.id}
                        onClick={() => setData(d => ({ ...d, level: lv }))}
                        className={`rounded-2xl border-2 px-5 py-4 text-left transition-all ${data.level?.id === lv.id ? 'border-violet-500 bg-violet-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                    >
                        <p className={`font-extrabold text-sm ${data.level?.id === lv.id ? 'text-violet-700' : 'text-slate-700'}`}>{lv.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{lv.sub}</p>
                    </button>
                ))}
            </div>

            <div className="flex justify-end">
                <button onClick={onNext} disabled={!canNext}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${canNext ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                    Tiếp theo <ArrowRight size={15} weight="bold" />
                </button>
            </div>
        </div>
    );
};

// ── Step 2: Description ──────────────────────────
const Step2 = ({ data, setData, onNext, onBack }) => {
    const [tagInput, setTagInput] = useState('');
    const descLen = data.desc?.trim().length || 0;
    const canNext = descLen >= 3;

    const addTag = () => {
        const t = tagInput.trim();
        if (t && (data.tags || []).length < 5 && !data.tags?.includes(t)) {
            setData(d => ({ ...d, tags: [...(d.tags || []), t] }));
        }
        setTagInput('');
    };

    return (
        <div>
            <h2 className="text-lg font-extrabold text-slate-900 mb-5">Mô tả buổi dạy của bạn</h2>

            {/* Selected skill preview */}
            {data.skill && (
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${data.skill.bg} border-${data.skill.border} mb-5`}>
                    <span className="text-xl">{data.skill.icon}</span>
                    <span className={`font-extrabold text-sm ${data.skill.text}`}>{data.skill.name}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${data.level?.id === 'intermediate' ? 'bg-amber-100 text-amber-600' : data.level?.id === 'advanced' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                        {data.level?.label}
                    </span>
                </div>
            )}

            <div className="space-y-5">
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-bold text-slate-700">
                            Mô tả nội dung sẽ dạy <span className="text-red-400">*</span>
                        </label>
                        <span className={`text-[11px] font-semibold ${descLen >= 3 ? 'text-emerald-500' : 'text-slate-400'}`}>
                            {descLen} ký tự {descLen < 3 ? `(cần ít nhất 3)` : '✓'}
                        </span>
                    </div>
                    <textarea
                        rows={4}
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white resize-none transition-all ${descLen > 0 && descLen < 3 ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-violet-400'}`}
                        placeholder="Ví dụ: Tôi sẽ dạy React từ JSX, Hooks đến state management. Học viên được code thực hành và nhận feedback ngay..."
                        value={data.desc || ''}
                        onChange={e => setData(d => ({ ...d, desc: e.target.value }))}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Học viên đạt được gì?</label>
                    <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:bg-white transition-all"
                        placeholder="Ví dụ: Hiểu và áp dụng React Hooks vào project thực tế"
                        value={data.outcome || ''}
                        onChange={e => setData(d => ({ ...d, outcome: e.target.value }))}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Tags <span className="text-slate-400 font-normal">(tối đa 5)</span></label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:bg-white transition-all"
                            placeholder="Tag rồi Enter..."
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addTag()}
                        />
                        <button onClick={addTag} className="px-4 py-2.5 bg-slate-100 hover:bg-violet-100 text-violet-600 font-bold text-sm rounded-xl border border-slate-200 transition-all">
                            + Thêm
                        </button>
                    </div>
                    {(data.tags || []).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {data.tags.map(t => (
                                <span key={t} className="flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-bold px-2.5 py-1 rounded-full">
                                    {t}
                                    <button onClick={() => setData(d => ({ ...d, tags: d.tags.filter(x => x !== t) }))} className="hover:text-red-500 transition-colors">×</button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Credits / giờ <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-0 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                            <button onClick={() => setData(d => ({ ...d, credits: Math.max(5, (d.credits || 12) - 1) }))}
                                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-200 font-bold text-lg transition-colors">−</button>
                            <span className="w-12 text-center font-extrabold text-violet-600 text-lg">{data.credits || 12}</span>
                            <button onClick={() => setData(d => ({ ...d, credits: Math.min(50, (d.credits || 12) + 1) }))}
                                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-200 font-bold text-lg transition-colors">+</button>
                        </div>
                        <div>
                            <span className="flex items-center gap-1 text-sm font-bold text-amber-600">
                                <Lightning size={14} weight="fill" className="text-amber-400" /> credits / giờ
                            </span>
                            <p className="text-[11px] text-slate-400 mt-0.5">Gợi ý: 10–20 credits. Trung bình cộng đồng: 14.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-6">
                <button onClick={onBack} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all">
                    <ArrowLeft size={15} weight="bold" /> Quay lại
                </button>
                <button onClick={onNext} disabled={!canNext}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${canNext ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                    Tiếp theo <ArrowRight size={15} weight="bold" />
                </button>
            </div>
        </div>
    );
};

// ── Step 3: Schedule ─────────────────────────────
const Step3 = ({ data, setData, onNext, onBack }) => {
    const [selDay, setSelDay] = useState(null);
    const [selTime, setSelTime] = useState(null);
    const slots = data.slots || [];

    const addSlot = () => {
        if (!selDay || !selTime) return;
        const exists = slots.find(s => s.day === selDay && s.time === selTime);
        if (exists) return;
        setData(d => ({ ...d, slots: [...(d.slots || []), { day: selDay, time: selTime }] }));
        setSelTime(null);
    };

    const removeSlot = (idx) => setData(d => ({ ...d, slots: d.slots.filter((_, i) => i !== idx) }));

    return (
        <div>
            <h2 className="text-lg font-extrabold text-slate-900 mb-1">Tạo lịch rảnh</h2>
            <p className="text-xs text-slate-400 mb-5">Học viên chỉ đặt được vào slot bạn tạo. Có thể chỉnh sửa sau.</p>

            {/* Flow hint */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2 mb-6">
                <span className="text-lg shrink-0">💡</span>
                <div>
                    <p className="text-xs font-bold text-amber-800">Luồng hoạt động</p>
                    <p className="text-xs text-amber-600 mt-0.5">Bạn tạo slot → Học viên gửi yêu cầu chọn slot → Bạn xác nhận → Buổi học được lên lịch → Credits chuyển sau khi hoàn thành.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mb-5">
                {/* Day picker */}
                <div className="flex-1">
                    <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5">
                        <CalendarBlank size={12} weight="duotone" className="text-violet-500" /> Chọn ngày:
                    </p>
                    <div className="space-y-1.5">
                        {DAYS.map(d => (
                            <button key={d} onClick={() => setSelDay(d)}
                                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${selDay === d ? 'border-violet-400 bg-violet-50 text-violet-700' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-violet-200'}`}>
                                {d}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time picker */}
                <div className="flex-1">
                    <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5">
                        🕐 Chọn giờ:
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                        {HOURS.map(h => (
                            <button key={h} onClick={() => setSelTime(h)}
                                className={`px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all ${selTime === h ? 'border-violet-400 bg-violet-50 text-violet-700' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-violet-200'}`}>
                                {h}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button onClick={addSlot} disabled={!selDay || !selTime}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all mb-5 ${selDay && selTime ? 'border-violet-300 text-violet-600 bg-violet-50 hover:bg-violet-100' : 'border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed'}`}>
                <Plus size={14} weight="bold" /> Thêm slot
            </button>

            {/* Added slots */}
            {slots.length > 0 ? (
                <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50 mb-5 shadow-sm">
                    {slots.map((s, i) => (
                        <div key={i} className="flex items-center justify-between px-4 py-3">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                                <span className="text-sm font-bold text-slate-700">{s.day}</span>
                                <span className="text-sm text-slate-500">{s.time}</span>
                            </div>
                            <button onClick={() => removeSlot(i)} className="text-slate-300 hover:text-red-400 transition-colors">
                                <Trash size={15} weight="duotone" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-5 text-center">
                    <p className="text-sm font-bold text-amber-700">📅 Chưa có slot. Chọn ngày + giờ rồi bấm "Thêm slot"!</p>
                    <p className="text-xs text-amber-500 mt-0.5">Bạn vẫn có thể đăng và thêm slot sau.</p>
                </div>
            )}

            <div className="flex justify-between">
                <button onClick={onBack} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all">
                    <ArrowLeft size={15} weight="bold" /> Quay lại
                </button>
                <button onClick={onNext}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-violet-600 text-white hover:bg-violet-700 shadow-sm transition-all">
                    Tiếp theo <ArrowRight size={15} weight="bold" />
                </button>
            </div>
        </div>
    );
};

// ── Step 4: Confirm ──────────────────────────────
const Step4 = ({ data, onBack, onSubmit }) => (
    <div>
        <h2 className="text-lg font-extrabold text-slate-900 mb-5">Xem lại & đăng</h2>

        {/* Subject preview */}
        <div className={`rounded-2xl border-2 p-5 mb-4 ${data.skill?.bg} border-${data.skill?.border}`}>
            <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{data.skill?.icon}</span>
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-extrabold text-base ${data.skill?.text}`}>{data.skill?.name}</span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">{data.level?.label}</span>
                        <span className="flex items-center gap-1 text-[11px] font-extrabold text-amber-600">
                            <Lightning size={11} weight="fill" className="text-amber-400" /> {data.credits || 12}/h
                        </span>
                    </div>
                    {data.desc && <p className="text-xs text-slate-500 mt-1">{data.desc.slice(0, 100)}{data.desc.length > 100 ? '...' : ''}</p>}
                </div>
            </div>
            {(data.tags || []).length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {data.tags.map(t => (
                        <span key={t} className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/60 text-slate-600">{t}</span>
                    ))}
                </div>
            )}
        </div>

        {/* Slots summary */}
        {(data.slots || []).length > 0 && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4">
                <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
                    <CalendarBlank size={12} weight="duotone" className="text-violet-500" /> {data.slots.length} slot được tạo
                </p>
                <div className="flex flex-wrap gap-2">
                    {data.slots.map((s, i) => (
                        <span key={i} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                            {s.day} · {s.time}
                        </span>
                    ))}
                </div>
            </div>
        )}

        {/* Post-publish info */}
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <span className="text-xl shrink-0">🚀</span>
            <div>
                <p className="text-sm font-bold text-sky-800">Sau khi đăng</p>
                <p className="text-xs text-sky-600 mt-0.5">Buổi dạy xuất hiện trên trang Khám phá. AI gợi ý cho học viên phù hợp. Học viên gửi yêu cầu → bạn xác nhận → credits chuyển sau khi hoàn thành.</p>
            </div>
        </div>

        <div className="flex justify-between">
            <button onClick={onBack} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all">
                <ArrowLeft size={15} weight="bold" /> Quay lại
            </button>
            <button onClick={onSubmit}
                className="flex items-center gap-2 px-7 py-2.5 rounded-xl font-bold text-sm bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-200 active:scale-95 transition-all">
                <Rocket size={16} weight="duotone" /> Đăng buổi dạy
            </button>
        </div>
    </div>
);

// ── Success screen ───────────────────────────────
const SuccessScreen = ({ data, onDone }) => (
    <div className="text-center py-10">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Đã đăng thành công!</h2>
        <p className="text-slate-500 text-sm mb-6">
            Buổi dạy <b>{data.skill?.name}</b> của bạn đã xuất hiện trên trang Khám phá.
        </p>
        <div className="bg-violet-50 border border-violet-200 rounded-2xl px-6 py-4 inline-block mb-8 text-left">
            <p className="text-xs font-bold text-violet-700 mb-1">🔔 Bước tiếp theo:</p>
            <ul className="text-xs text-violet-600 space-y-1 list-disc list-inside">
                <li>Học viên sẽ gửi yêu cầu đặt lịch</li>
                <li>Bạn xác nhận hoặc từ chối yêu cầu</li>
                <li>Credits chuyển sau khi hoàn thành buổi</li>
            </ul>
        </div>
        <div>
            <button onClick={onDone} className="px-8 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-all shadow-md shadow-violet-200">
                Xem quản lý buổi dạy
            </button>
        </div>
    </div>
);

// ── MAIN COMPONENT ───────────────────────────────
const CreateTeachingSession = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [done, setDone] = useState(false);
    const [form, setForm] = useState({ credits: 12 });

    const next = () => setStep(s => Math.min(s + 1, 4));
    const back = () => step === 1 ? navigate(-1) : setStep(s => s - 1);

    return (
        <div className="max-w-3xl mx-auto font-sans pb-14">

            {/* Title */}
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Sparkle size={24} weight="duotone" className="text-amber-400" /> Đăng buổi dạy mới
                </h1>
                <p className="text-sm text-slate-400 mt-1">Chia sẻ kỹ năng và bắt đầu kiếm credits!</p>
            </div>

            {/* Step bar */}
            {!done && <StepBar step={step} />}

            {/* Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
                {done ? (
                    <SuccessScreen data={form} onDone={() => navigate('/app/teaching')} />
                ) : step === 1 ? (
                    <Step1 data={form} setData={setForm} onNext={next} />
                ) : step === 2 ? (
                    <Step2 data={form} setData={setForm} onNext={next} onBack={back} />
                ) : step === 3 ? (
                    <Step3 data={form} setData={setForm} onNext={next} onBack={back} />
                ) : (
                    <Step4 data={form} onBack={back} onSubmit={() => setDone(true)} />
                )}
            </div>
        </div>
    );
};

export default CreateTeachingSession;
