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

// generate next 7 days starting from today
const getVietnamWeekday = (d) => {
    const wd = d.getDay(); // 0 (Sun) - 6 (Sat)
    if (wd === 0) return 'CN';
    return `T${wd + 1}`; // 1->T2, 2->T3 ... 6->T7
};

const generateNextNDays = (n = 7) => {
    const res = [];
    const today = new Date();
    for (let i = 0; i < n; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        res.push(d);
    }
    return res;
};

const DAYS = generateNextNDays(7);

// Hours options (display strings). We'll use indexes to compare start/end ordering.
const HOURS = ['7:00 SA', '8:00 SA', '9:00 SA', '10:00 SA', '11:00 SA', '13:00 CH', '14:00 CH', '15:00 CH', '16:00 CH', '17:00 CH', '19:00 CH', '20:00 CH', '21:00 CH'];

// ── Step Indicator ───────────────────────────────
const StepBar = ({ step }) => {
    const steps = ['Kỹ năng', 'Tạo Lịch', 'Xác nhận'];
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

// ── Step 2: Tạo Lịch (Mô tả + Lịch gọn) ──────────────────────────
const StepSchedule = ({ data, setData, onNext, onBack }) => {
    // merged description + compact schedule
    const [tagInput, setTagInput] = useState('');
    // selDay will be an ISO date string 'YYYY-MM-DD'
    const [selDay, setSelDay] = useState('');
    // selStart/selEnd will be time strings like '07:00'
    const [selStart, setSelStart] = useState('');
    const [selEnd, setSelEnd] = useState('');
    const [err, setErr] = useState('');
    const descLen = data.desc?.trim().length || 0;
    const canNext = descLen >= 3;

    // Lấy chuỗi ngày giờ hiện tại theo local time
    const todayStr = (() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })();
    const currentTimeStr = (() => {
        const d = new Date();
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    })();

    const minStartTime = selDay === todayStr ? (currentTimeStr > "07:00" ? currentTimeStr : "07:00") : "07:00";

    const addTag = () => {
        const t = tagInput.trim();
        if (t && (data.tags || []).length < 5 && !data.tags?.includes(t)) {
            setData(d => ({ ...d, tags: [...(d.tags || []), t] }));
        }
        setTagInput('');
    };

    const addSlot = () => {
        setErr('');
        if (!selDay || !selStart || !selEnd) {
            setErr('Vui lòng chọn ngày, giờ bắt đầu và giờ kết thúc.');
            return;
        }

        // Chặn ngày giờ trong quá khứ
        if (selDay < todayStr) {
            setErr('Không thể chọn ngày đã qua.');
            return;
        }
        if (selDay === todayStr && selStart < currentTimeStr) {
            setErr('Không thể chọn giờ hiện tại.');
            return;
        }

        // selStart/selEnd are 'HH:MM' strings; lexicographic compare works for zero-padded 24h times
        if (selEnd <= selStart) {
            setErr('Giờ kết thúc phải sau giờ bắt đầu.');
            return;
        }
        const exists = (data.slots || []).find(s => s.day === selDay && s.start === selStart && s.end === selEnd);
        if (exists) {
            setErr('Khung giờ này đã có trong danh sách!');
            return;
        }
        
        const newSlot = { day: selDay, start: selStart, end: selEnd };
        setData(d => ({ ...d, slots: [...(d.slots || []), newSlot] }));
        setSelStart('');
        setSelEnd('');
        setSelDay('');
    };

    const removeSlot = (idx) => setData(d => ({ ...d, slots: d.slots.filter((_, i) => i !== idx) }));

    return (
        <div>
            <h2 className="text-lg font-extrabold text-slate-900 mb-4">Tạo Lịch</h2>

            {/* compact description area */}
            <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-1">Mô tả buổi dạy <span className="text-red-400">*</span></label>
                <textarea rows={3} className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-sm text-slate-700 resize-none outline-none ${descLen > 0 && descLen < 3 ? 'border-red-300' : 'border-slate-200'}`} placeholder="Tóm tắt ngắn (ít nhất 3 ký tự)" value={data.desc || ''} onChange={e => setData(d => ({ ...d, desc: e.target.value }))} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="text-sm font-bold text-slate-700 mb-1 block">Học viên đạt được</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm" placeholder="Kết quả mong đợi" value={data.outcome || ''} onChange={e => setData(d => ({ ...d, outcome: e.target.value }))} />
                </div>
                <div>
                    <label className="text-sm font-bold text-slate-700 mb-1 block">Credits / giờ</label>
                    <div className="flex items-center gap-2">
                            <button onClick={() => setData(d => ({ ...d, credits: Math.max(5, (d.credits || 12) - 1) }))} className="px-3 py-2 bg-slate-100 rounded-xl">−</button>
                            <input
                                type="number"
                                min={5}
                                max={50}
                                step={1}
                                value={data.credits || 12}
                                onChange={(e) => {
                                    const v = Number(e.target.value || 0);
                                    const clamped = Math.max(5, Math.min(50, isNaN(v) ? 12 : Math.floor(v)));
                                    setData(d => ({ ...d, credits: clamped }));
                                }}
                                className="w-14 text-center font-extrabold text-violet-600 bg-transparent outline-none"
                            />
                            <button onClick={() => setData(d => ({ ...d, credits: Math.min(50, (d.credits || 12) + 1) }))} className="px-3 py-2 bg-slate-100 rounded-xl">+</button>
                        </div>
                </div>
            </div>

            {/* compact tag input */}
            <div className="mb-4">
                <label className="text-sm font-bold text-slate-700 mb-1 block">Tags</label>
                <div className="flex gap-2">
                    <input type="text" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm" placeholder="Tag rồi Enter..." value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} />
                    <button onClick={addTag} className="px-3 py-2 bg-violet-50 text-violet-600 rounded-xl">Thêm</button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {(data.tags || []).map(t => (
                        <span key={t} className="px-2 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center gap-2">{t}<button onClick={() => setData(d => ({ ...d, tags: d.tags.filter(x => x !== t) }))} className="ml-1">×</button></span>
                    ))}
                </div>
            </div>

            {/* compact schedule picker */}
            <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-bold text-slate-700">Lịch dạy (chọn ngày và khung giờ)</label>
                </div>
                
                <div className="flex flex-col md:flex-row items-stretch gap-2 bg-slate-50 border border-slate-200 p-2 rounded-xl shadow-sm">
                    {/* Ngày dạy */}
                    <div className="w-full md:flex-[1.2] bg-white rounded-lg border border-slate-200 px-3 py-2 flex flex-col justify-center hover:border-violet-300 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 transition-all">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ngày dạy</label>
                        <input
                            type="date"
                            min={todayStr}
                            className="w-full bg-transparent text-sm font-bold outline-none text-slate-800 cursor-text leading-none"
                            value={selDay}
                            onChange={(e) => setSelDay(e.target.value)}
                        />
                    </div>
                    
                    {/* Giờ */}
                    <div className="w-full md:flex-[2] flex gap-2">
                        <div className="flex-1 bg-white rounded-lg border border-slate-200 px-3 py-2 flex flex-col justify-center hover:border-violet-300 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 transition-all">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Bắt đầu</label>
                            <input
                                type="time"
                                step={1800}
                                min={minStartTime}
                                max="21:00"
                                className="w-full bg-transparent text-sm font-bold outline-none text-slate-800 cursor-text leading-none"
                                value={selStart}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setSelStart(v);
                                    if (!selEnd || selEnd <= v) {
                                        const [hh, mm] = v.split(':').map(Number);
                                        const date = new Date();
                                        date.setHours(hh);
                                        date.setMinutes(mm + 60);
                                        const newEndH = String(date.getHours()).padStart(2, '0');
                                        const newEndM = String(date.getMinutes()).padStart(2, '0');
                                        const newEnd = `${newEndH}:${newEndM}`;
                                        setSelEnd(newEnd > '21:00' ? '21:00' : newEnd);
                                    }
                                }}
                            />
                        </div>
                        <div className="flex-1 bg-white rounded-lg border border-slate-200 px-3 py-2 flex flex-col justify-center hover:border-violet-300 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 transition-all">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kết thúc</label>
                            <input
                                type="time"
                                step={1800}
                                className="w-full bg-transparent text-sm font-bold outline-none text-slate-800 cursor-text leading-none"
                                value={selEnd}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    if (selStart && v <= selStart) {
                                        setErr('Giờ kết thúc phải sau giờ bắt đầu.');
                                    } else {
                                        setErr('');
                                    }
                                    setSelEnd(v);
                                }}
                            />
                        </div>
                    </div>

                    {/* Thêm btn */}
                    <div className="w-full md:w-auto md:min-w-[110px]">
                        <button 
                            onClick={addSlot} 
                            disabled={!selDay || !selStart || !selEnd} 
                            className={`w-full h-full min-h-[48px] px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${selDay && selStart && selEnd ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm shadow-violet-200 transform active:scale-[0.98]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                        >
                            <Plus size={18} weight="bold" className="shrink-0" />
                            <span className="md:hidden lg:inline">Thêm</span>
                        </button>
                    </div>
                </div>
                {err && <p className="text-xs text-red-600 mt-2 font-semibold bg-red-50 px-3 py-2 rounded-lg inline-flex items-center gap-1.5 border border-red-100">⚠️ {err}</p>}

                {/* slots list compact */}
                <div className="mt-4">
                    {(data.slots || []).length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {(data.slots || []).map((s, i) => {
                                const d = new Date(s.day + 'T00:00');
                                const label = `${getVietnamWeekday(d)} ${d.getDate()}/${d.getMonth() + 1}`;
                                const timeLabel = `${s.start} - ${s.end}`;
                                return (
                                    <div key={i} className="group flex items-center justify-between px-3.5 py-3 rounded-xl border border-slate-200 bg-white hover:border-violet-300 hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                                                <CalendarBlank size={18} weight="duotone" />
                                            </div>
                                            <div>
                                                <div className="text-[13px] font-bold text-slate-800 leading-tight">{label}</div>
                                                <div className="text-xs font-semibold text-slate-500 mt-0.5">{timeLabel}</div>
                                            </div>
                                        </div>
                                        <button onClick={() => removeSlot(i)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                                            <Trash size={16} weight="duotone" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-[13px] font-semibold text-slate-400 bg-slate-50 border border-slate-100 border-dashed rounded-xl p-6 text-center">Chưa có slot nào. Thêm khung giờ để học viên có thể đặt lịch.</div>
                    )}
                </div>
            </div>

            <div className="flex justify-between mt-4">
                <button onClick={onBack} className="px-4 py-2 rounded-xl bg-slate-100">Quay lại</button>
                <button onClick={onNext} disabled={!canNext} className={`px-4 py-2 rounded-xl font-bold ${canNext ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-400'}`}>Tiếp theo</button>
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
                    {data.slots.map((s, i) => {
                        const d = new Date(s.day);
                        const label = `${getVietnamWeekday(d)} ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
                        const timeLabel = `${s.start} - ${s.end}`;
                        return (
                            <span key={i} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                                {label} · {timeLabel}
                            </span>
                        );
                    })}
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

    const next = () => setStep(s => Math.min(s + 1, 3));
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
                    <StepSchedule data={form} setData={setForm} onNext={next} onBack={back} />
                ) : (
                    <Step4 data={form} onBack={back} onSubmit={() => setDone(true)} />
                )}
            </div>
        </div>
    );
};

export default CreateTeachingSession;
