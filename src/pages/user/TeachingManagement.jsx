import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChalkboardTeacher, CalendarBlank, BellRinging, CurrencyDollar, ChartBar,
    Plus, Star, Lightning, PencilSimple, Pause, CalendarCheck, Clock,
    User, Check, X, ArrowRight, ChartLineUp, Coins, WarningCircle, MapTrifold
} from '@phosphor-icons/react';

// ────────────────────────────────────────────────
// Mock Data
// ────────────────────────────────────────────────
const TEACHING_SUBJECTS = [
    {
        id: 's1',
        icon: '⚛️',
        iconBg: 'bg-blue-100',
        name: 'React',
        level: 'Advanced',
        levelColor: 'bg-blue-100 text-blue-600',
        status: 'Hoạt động',
        desc: 'Dạy React từ cơ bản đến nâng cao: JSX, Hooks, Context API, Redux. Sau khoá học tự xây dựng project thực tế.',
        tags: ['React Hooks', 'TypeScript', 'Redux'],
        rate: 15,
        totalSessions: 12,
        creditsEarned: 180,
        rating: 4.9,
        slotsOpen: 3,
        slotsBooked: 1,
        slots: [
            { id: 'sl1', day: 'T2 10/3', time: '9:00 SA', status: 'open' },
            { id: 'sl2', day: 'T2 10/3', time: '14:00 CH', status: 'booked', student: 'Thanh Hà' },
            { id: 'sl3', day: 'T3 11/3', time: '19:00 CH', status: 'open' },
            { id: 'sl4', day: 'T4 12/3', time: '9:00 SA', status: 'pending', student: 'Duy Khang' },
            { id: 'sl5', day: 'T5 13/3', time: '16:00 CH', status: 'open' },
        ],
    },
    {
        id: 's2',
        icon: '🐍',
        iconBg: 'bg-yellow-100',
        name: 'Python',
        level: 'Intermediate',
        levelColor: 'bg-green-100 text-green-600',
        status: 'Hoạt động',
        desc: 'Python từ cơ bản cho người mới. OOP, xử lý file, thư viện phổ biến. Nhiều bài tập thực hành.',
        tags: ['Python', 'OOP', 'Pandas'],
        rate: 12,
        totalSessions: 5,
        creditsEarned: 60,
        rating: 4.7,
        slotsOpen: 1,
        slotsBooked: 0,
        slots: [
            { id: 'sl6', day: 'T2 10/3', time: '16:00 CH', status: 'open' },
            { id: 'sl7', day: 'T4 12/3', time: '14:00 CH', status: 'booked', student: 'Lan H.' },
        ],
    },
];

const REQUESTS = [
    {
        id: 'r1', initials: 'DK', color: 'bg-teal-500',
        name: 'Duy Khang', subject: 'React', subjectColor: 'bg-blue-100 text-blue-600',
        status: 'Chờ duyệt', statusColor: 'bg-amber-100 text-amber-600',
        day: 'T4 12/3', time: '9:00 SA', credits: 15, timeAgo: '5 phút trước',
        note: '"Anh ơi em đang bị stuck với useEffect dependency array, muốn được giải thích chi tiết và debug cùng a."',
    },
    {
        id: 'r2', initials: 'PT', color: 'bg-red-500',
        name: 'Phương Thy', subject: 'Python', subjectColor: 'bg-green-100 text-green-600',
        status: 'Chờ duyệt', statusColor: 'bg-amber-100 text-amber-600',
        day: 'T4 12/3', time: '14:00 CH', credits: 12, timeAgo: '30 phút trước',
        note: '"Mình mới học Python, muốn hiểu về OOP và cách xử lý file CSV với Pandas."',
    },
    {
        id: 'r3', initials: 'BN', color: 'bg-violet-500',
        name: 'Bảo Nguyên', subject: 'React', subjectColor: 'bg-blue-100 text-blue-600',
        status: 'Xác nhận', statusColor: 'bg-emerald-100 text-emerald-600',
        day: 'T3 11/3', time: '19:00 CH', credits: 15, timeAgo: '2 giờ trước',
        note: '"Em cần debug project React đang bị lỗi infinite re-render."',
    },
];

const INCOME_ROWS = [
    { date: '10/3', student: 'Thanh Hà', subject: 'React', duration: '60 phút', credits: 15, status: 'Hoàn thành' },
    { date: '8/3', student: 'Lan H.', subject: 'Python', duration: '60 phút', credits: 12, status: 'Hoàn thành' },
    { date: '6/3', student: 'Duy Khang', subject: 'React', duration: '90 phút', credits: 22, status: 'Hoàn thành' },
    { date: '4/3', student: 'Minh T.', subject: 'React', duration: '60 phút', credits: 15, status: 'Hoàn thành' },
];

// ────────────────────────────────────────────────
// Slot chip
// ────────────────────────────────────────────────
const SlotChip = ({ slot }) => {
    const cfg = {
        open: { border: 'border-emerald-300 bg-emerald-50', dot: 'bg-emerald-500', label: '● Trống', labelCls: 'text-emerald-600' },
        booked: { border: 'border-sky-300 bg-sky-50', dot: 'bg-sky-500', label: '📅 Đã đặt', labelCls: 'text-sky-600' },
        pending: { border: 'border-amber-300 bg-amber-50', dot: 'bg-amber-500', label: '⏳ Chờ duyệt', labelCls: 'text-amber-600' },
    }[slot.status];
    return (
        <div className={`rounded-xl border-2 ${cfg.border} px-3 pt-2.5 pb-3 min-w-[88px] shrink-0 text-xs font-semibold`}>
            <p className="text-slate-700 font-bold">{slot.day}</p>
            <p className="text-slate-500 mb-1.5">{slot.time}</p>
            <p className={`text-[11px] font-bold ${cfg.labelCls}`}>{cfg.label}</p>
            {slot.student && <p className="text-[10px] text-slate-500 mt-0.5 truncate">👤 {slot.student}</p>}
        </div>
    );
};

// ────────────────────────────────────────────────
// TAB: Buổi dạy
// ────────────────────────────────────────────────
const TabSubjects = () => (
    <div className="space-y-5">
        {TEACHING_SUBJECTS.map(sub => (
            <div key={sub.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Card header */}
                <div className="p-6 pb-4 flex flex-col md:flex-row md:items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${sub.iconBg} flex items-center justify-center text-2xl shrink-0`}>
                        {sub.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-extrabold text-slate-900 text-lg">{sub.name}</h3>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${sub.levelColor}`}>{sub.level}</span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600">● {sub.status}</span>
                        </div>
                        <p className="text-sm text-slate-500 mb-2">{sub.desc}</p>
                        <div className="flex flex-wrap gap-1.5">
                            {sub.tags.map(t => (
                                <span key={t} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">{t}</span>
                            ))}
                        </div>
                    </div>
                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0">
                        <button className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600 transition-all">
                            <CalendarBlank size={14} weight="duotone" /> Quản lý lịch
                        </button>
                        <button className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all">
                            <PencilSimple size={14} weight="duotone" /> Chỉnh sửa
                        </button>
                        <button className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all">
                            <Pause size={14} weight="duotone" /> Tạm dừng
                        </button>
                    </div>
                </div>

                {/* Stats row */}
                <div className="px-6 pb-4 flex flex-wrap gap-6 text-sm">
                    <div>
                        <div className="flex items-center gap-1 font-extrabold text-violet-600">
                            <Lightning size={14} weight="fill" className="text-amber-400" />
                            {sub.rate}/h
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">credits/giờ</p>
                    </div>
                    <div>
                        <div className="font-extrabold text-slate-800">{sub.totalSessions}</div>
                        <p className="text-[10px] text-slate-400 mt-0.5">Buổi đã dạy</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-1 font-extrabold text-emerald-600">
                            +{sub.creditsEarned} <Lightning size={12} weight="fill" className="text-emerald-500" />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">Credits kiếm</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-1 font-extrabold text-amber-500">
                            <Star size={14} weight="fill" /> {sub.rating}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">Đánh giá</p>
                    </div>
                    <div>
                        <div className="font-extrabold text-slate-800">{sub.slotsOpen}</div>
                        <p className="text-[10px] text-slate-400 mt-0.5">Slot trống</p>
                    </div>
                    <div>
                        <div className="font-extrabold text-slate-800">{sub.slotsBooked}</div>
                        <p className="text-[10px] text-slate-400 mt-0.5">Slot chờ</p>
                    </div>
                </div>

                {/* Slots */}
                <div className="border-t border-slate-50 bg-slate-50/50 px-6 py-4">
                    <p className="text-xs font-bold text-slate-500 mb-3">Slots gần nhất:</p>
                    <div className="flex items-center gap-2 flex-wrap">
                        {sub.slots.map(sl => <SlotChip key={sl.id} slot={sl} />)}
                        <button className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 ml-1">
                            <Plus size={14} weight="bold" /> Thêm
                        </button>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// ────────────────────────────────────────────────
// TAB: Lịch rảnh
// ────────────────────────────────────────────────
const DAYS_OF_WEEK = ['T2 10/3', 'T3 11/3', 'T4 12/3', 'T5 13/3', 'T6 14/3', 'T7 15/3', 'CN 16/3'];
const TIME_SLOTS = ['7:00 SA', '8:00 SA', '9:00 SA', '10:00 SA', '11:00 SA', '13:00 CH', '14:00 CH', '15:00 CH', '16:00 CH', '17:00 CH', '19:00 CH', '20:00 CH', '21:00 CH'];

const TabSchedule = () => {
    const [selectedSubject, setSelectedSubject] = useState('s1');
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const sub = TEACHING_SUBJECTS.find(s => s.id === selectedSubject);

    return (
        <div className="flex flex-col lg:flex-row gap-5">
            {/* Subject picker */}
            <div className="lg:w-52 shrink-0 space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chọn buổi dạy:</p>
                {TEACHING_SUBJECTS.map(s => (
                    <button key={s.id}
                        onClick={() => setSelectedSubject(s.id)}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${selectedSubject === s.id ? 'border-violet-400 bg-violet-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-base">{s.icon}</span>
                            <span className={`font-bold text-sm ${selectedSubject === s.id ? 'text-violet-700' : 'text-slate-700'}`}>{s.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{s.slots.length} slots · {s.slotsOpen} trống</p>
                    </button>
                ))}
            </div>

            {/* Schedule panel */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
                <div>
                    <h3 className="font-extrabold text-slate-900 flex items-center gap-2 text-base mb-1">
                        <CalendarBlank size={18} weight="duotone" className="text-violet-500" />
                        Lịch rảnh — {sub.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                        <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-200 mr-1" />Xanh=trống ·
                        <span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-200 mx-1" />Vàng=chờ ·
                        <span className="inline-block w-2.5 h-2.5 rounded-sm bg-sky-200 mx-1" />Xanh dương=đã đặt
                    </p>
                </div>

                {/* Existing slots */}
                <div className="flex flex-wrap gap-2">
                    {sub.slots.map(sl => <SlotChip key={sl.id} slot={sl} />)}
                </div>

                {/* Add new slot */}
                <div className="border-t border-slate-100 pt-5">
                    <p className="font-bold text-slate-700 mb-4 flex items-center gap-1.5">
                        <Plus size={16} weight="bold" className="text-violet-500" /> Thêm slot mới
                    </p>
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Day picker */}
                        <div className="flex-1">
                            <p className="text-xs font-bold text-slate-500 mb-2">Ngày:</p>
                            <div className="space-y-1.5">
                                {DAYS_OF_WEEK.map(d => (
                                    <button key={d}
                                        onClick={() => setSelectedDay(d)}
                                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${selectedDay === d ? 'border-violet-400 bg-violet-50 text-violet-700' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'}`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Time picker */}
                        <div className="flex-1">
                            <p className="text-xs font-bold text-slate-500 mb-2">Giờ:</p>
                            <div className="grid grid-cols-2 gap-1.5">
                                {TIME_SLOTS.map(t => (
                                    <button key={t}
                                        onClick={() => setSelectedTime(t)}
                                        className={`px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all ${selectedTime === t ? 'border-violet-400 bg-violet-50 text-violet-700' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button
                        disabled={!selectedDay || !selectedTime}
                        className={`mt-4 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${selectedDay && selectedTime ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                    >
                        + Thêm slot
                    </button>
                </div>
            </div>
        </div>
    );
};

// ────────────────────────────────────────────────
// TAB: Yêu cầu
// ────────────────────────────────────────────────
const TabRequests = () => {
    const pending = REQUESTS.filter(r => r.status === 'Chờ duyệt');
    return (
        <div className="space-y-5">
            {/* Alert banner */}
            {pending.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
                    <WarningCircle size={20} weight="duotone" className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-amber-800 text-sm">{pending.length} yêu cầu mới cần xử lý</p>
                        <p className="text-xs text-amber-600 mt-0.5">Hãy phản hồi sớm để học viên sắp xếp kế hoạch.</p>
                    </div>
                </div>
            )}

            {REQUESTS.map(req => (
                <div key={req.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                        {/* Avatar & info */}
                        <div className="flex items-start gap-3 flex-1">
                            <div className={`w-10 h-10 rounded-xl ${req.color} text-white flex items-center justify-center font-extrabold text-sm shrink-0`}>
                                {req.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                    <span className="font-extrabold text-slate-900 text-sm">{req.name}</span>
                                    <span className="text-[11px] text-slate-400">muốn học</span>
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${req.subjectColor}`}>📘 {req.subject}</span>
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${req.statusColor}`}>
                                        {req.status === 'Chờ duyệt' ? '⏳' : '✅'} {req.status}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-3 text-xs text-slate-500 font-medium">
                                    <span className="flex items-center gap-1"><CalendarCheck size={12} weight="duotone" className="text-violet-400" /> {req.day}</span>
                                    <span className="flex items-center gap-1"><Clock size={12} weight="duotone" className="text-violet-400" /> {req.time}</span>
                                    <span className="flex items-center gap-1 text-amber-600 font-bold"><Lightning size={12} weight="fill" className="text-amber-400" /> {req.credits} credits</span>
                                </div>
                                {req.note && (
                                    <div className="mt-3 bg-slate-50 rounded-xl px-4 py-3 text-xs text-slate-500 italic border border-slate-100">
                                        {req.note}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Actions & time */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className="text-[11px] text-slate-400">{req.timeAgo}</span>
                            {req.status === 'Chờ duyệt' ? (
                                <div className="flex flex-col gap-2 mt-1">
                                    <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm">
                                        <Check size={13} weight="bold" /> Chấp nhận
                                    </button>
                                    <button className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm">
                                        <X size={13} weight="bold" /> Từ chối
                                    </button>
                                </div>
                            ) : (
                                <button className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm mt-1">
                                    <ArrowRight size={13} weight="bold" /> Vào lớp
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// ────────────────────────────────────────────────
// TAB: Thu nhập
// ────────────────────────────────────────────────
const TabIncome = () => (
    <div className="space-y-5">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
                { icon: Lightning, label: 'Tháng này', value: '240', sub: '+15 hôm nay', color: 'text-amber-500', bg: 'bg-amber-50' },
                { icon: ChartLineUp, label: 'Tổng kiếm được', value: '1,840', sub: 'từ trước đến nay', color: 'text-violet-600', bg: 'bg-violet-50' },
                { icon: CalendarCheck, label: 'Buổi hoàn thành', value: '17', sub: 'tháng này', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { icon: Star, label: 'Đánh giá TB', value: '4.85', sub: 'trên 5.0', color: 'text-amber-400', bg: 'bg-yellow-50' },
            ].map((c, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className={`w-9 h-9 ${c.bg} rounded-xl flex items-center justify-center mb-3`}>
                        <c.icon size={18} weight="duotone" className={c.color} />
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">{c.value}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{c.label}</p>
                    <p className="text-[11px] text-emerald-600 font-bold mt-1">{c.sub}</p>
                </div>
            ))}
        </div>

        {/* Transaction table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <Coins size={16} weight="duotone" className="text-violet-500" /> Lịch sử thu nhập gần đây
                </h3>
            </div>
            <div className="divide-y divide-slate-50">
                {INCOME_ROWS.map((row, i) => (
                    <div key={i} className="flex items-center px-6 py-3.5 hover:bg-slate-50/50 transition-colors">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800">{row.student}</p>
                            <p className="text-xs text-slate-400">{row.subject} · {row.duration}</p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-sm font-extrabold text-emerald-600 flex items-center gap-1 justify-end">
                                <Lightning size={12} weight="fill" className="text-amber-400" />+{row.credits}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{row.date}/3</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// ────────────────────────────────────────────────
// TAB: Thống kê
// ────────────────────────────────────────────────
const TabStats = () => (
    <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Sessions by subject */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center gap-2">
                    <ChartBar size={16} weight="duotone" className="text-violet-500" /> Buổi dạy theo môn
                </h3>
                {TEACHING_SUBJECTS.map(s => (
                    <div key={s.id} className="mb-4">
                        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                            <span>{s.icon} {s.name}</span>
                            <span>{s.totalSessions} buổi</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-400 rounded-full"
                                style={{ width: `${(s.totalSessions / 17) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            {/* Rating breakdown */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center gap-2">
                    <Star size={16} weight="duotone" className="text-amber-400" /> Phân bố đánh giá
                </h3>
                {[5, 4, 3, 2, 1].map(r => (
                    <div key={r} className="flex items-center gap-3 mb-2.5">
                        <span className="text-xs font-bold text-slate-500 w-4">{r}★</span>
                        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-amber-400 rounded-full"
                                style={{ width: r === 5 ? '70%' : r === 4 ? '20%' : r === 3 ? '8%' : '2%' }}
                            />
                        </div>
                        <span className="text-xs text-slate-400 w-6">{r === 5 ? '70%' : r === 4 ? '20%' : r === 3 ? '8%' : '2%'}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// ────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────
const TABS = [
    { id: 'subjects', label: 'Buổi dạy', icon: ChalkboardTeacher },
    { id: 'schedule', label: 'Lịch rảnh', icon: CalendarBlank },
    { id: 'requests', label: 'Yêu cầu', icon: BellRinging, badge: 2 },
    { id: 'income', label: 'Thu nhập', icon: CurrencyDollar },
    { id: 'stats', label: 'Thống kê', icon: ChartBar },
];

const TeachingManagement = () => {
    const [activeTab, setActiveTab] = useState('subjects');
    const navigate = useNavigate();

    return (
        <div className="max-w-6xl mx-auto font-sans pb-14 space-y-6">

            {/* ─── HEADER ─── */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <ChalkboardTeacher size={26} weight="duotone" className="text-violet-500" />
                        Quản lý buổi dạy
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Tạo, quản lý buổi dạy · lịch rảnh · yêu cầu từ học viên · thu nhập</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <button
                        onClick={() => navigate('/app/teaching/create-path')}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm rounded-xl border border-indigo-200 active:scale-95 transition-all">
                        <MapTrifold size={16} weight="bold" /> Tạo lộ trình mới
                    </button>
                    <button
                        onClick={() => navigate('/app/teaching/create')}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-xl shadow-md shadow-violet-200 active:scale-95 transition-all">
                        <Plus size={16} weight="bold" /> Đăng buổi dạy mới
                    </button>
                </div>
            </div>

            {/* ─── TABS ─── */}
            <div className="flex items-center gap-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-1.5 overflow-x-auto">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all relative ${active ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                        >
                            <Icon size={16} weight={active ? 'fill' : 'duotone'} />
                            {tab.label}
                            {tab.badge && (
                                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/30 text-white' : 'bg-amber-100 text-amber-600'}`}>
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ─── CONTENT ─── */}
            <div>
                {activeTab === 'subjects' && <TabSubjects />}
                {activeTab === 'schedule' && <TabSchedule />}
                {activeTab === 'requests' && <TabRequests />}
                {activeTab === 'income' && <TabIncome />}
                {activeTab === 'stats' && <TabStats />}
            </div>
        </div>
    );
};

export default TeachingManagement;
