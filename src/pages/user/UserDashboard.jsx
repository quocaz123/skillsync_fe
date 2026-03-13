import { useStore } from '../../store';
import {
    Lightning, BookOpen, CalendarCheck, Star,
    GraduationCap, PlusCircle, MagnifyingGlass, Path,
    ArrowRight, Clock, Robot, UserCircle,
    ChalkboardTeacher, Hourglass, CheckCircle,
    ChartLineUp, Calendar, Sparkle
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

// ── Helpers ──────────────────────────────────────
const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Chào buổi sáng ☀️';
    if (h < 18) return 'Chào buổi chiều 🌤️';
    return 'Chào buổi tối 🌙';
};

const getDateString = () => {
    const d = new Date();
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    return `${days[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

// ── Sub-components ────────────────────────────────

/** Single stat in the banner bottom row */
const BannerStat = ({ icon: Icon, value, label, color }) => (
    <div className="flex flex-col items-center flex-1 py-3 px-2 gap-1 group">
        <div className={`flex items-center gap-1.5 text-white font-extrabold text-xl`}>
            <Icon size={18} weight="fill" className={color} />
            {value}
        </div>
        <span className="text-white/55 text-[11px] font-medium text-center leading-tight">{label}</span>
    </div>
);

/** Quick Action card row */
const ActionCard = ({ icon: Icon, bg, iconColor, title, sub, badge }) => (
    <div className="relative bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col gap-3">
        {badge && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {badge}
            </span>
        )}
        <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
            <Icon size={22} weight="duotone" className={iconColor} />
        </div>
        <div>
            <p className="font-bold text-slate-800 text-sm">{title}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{sub}</p>
        </div>
    </div>
);

/** Single session row */
const SessionRow = ({ initials, name, topic, time, badge, badgeCls }) => (
    <div className="flex items-center gap-3 py-2.5 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-sm">
            {initials}
        </div>
        <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 text-sm truncate group-hover:text-violet-600 transition-colors">{name}</p>
            <p className="text-[11px] text-slate-400 truncate">{topic} · {time}</p>
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${badgeCls}`}>{badge}</span>
    </div>
);

/** AI Teacher recommendation card */
const TeacherCard = ({ initials, name, subject, rating, stars, rate, match, highlight, avatarGrad }) => (
    <div className={`relative bg-white rounded-2xl border ${highlight ? 'border-violet-300 shadow-lg shadow-violet-100' : 'border-slate-100 shadow-sm'} p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
        {match && (
            <span className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {match}% phù hợp
            </span>
        )}
        <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarGrad} text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-sm`}>
                {initials}
            </div>
            <div className="min-w-0">
                <p className="font-bold text-slate-800 text-sm truncate">{name}</p>
                <p className="text-[11px] text-slate-400 truncate">{subject}</p>
            </div>
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} weight={i < stars ? 'fill' : 'regular'} className={i < stars ? 'text-amber-400' : 'text-slate-200'} />
                ))}
                <span className="text-[11px] text-slate-400 ml-1">{rating}</span>
            </div>
            <div className="flex items-center gap-1 text-violet-600 font-extrabold text-sm">
                <Lightning size={13} weight="fill" />
                {rate}/h
            </div>
        </div>
    </div>
);

// ── Main Dashboard ────────────────────────────────
const UserDashboard = () => {
    const { user, credits } = useStore();
    const displayName = user?.name || 'Người dùng';

    const bannerStats = [
        { icon: Lightning, value: credits ?? 47, label: 'Credits\nhiện có', color: 'text-amber-300' },
        { icon: ChalkboardTeacher, value: 12, label: 'Buổi dạy\ntháng này', color: 'text-sky-300' },
        { icon: BookOpen, value: 8, label: 'Buổi học\ntháng này', color: 'text-emerald-300' },
        { icon: Star, value: '4.9', label: 'Đánh giá\ntrung bình', color: 'text-yellow-300' },
    ];

    const quickActions = [
        { icon: CalendarCheck, bg: 'bg-violet-100', iconColor: 'text-violet-600', title: 'Buổi dạy', sub: '2 yêu cầu mới', badge: 2 },
        { icon: PlusCircle, bg: 'bg-teal-50', iconColor: 'text-teal-500', title: 'Thêm lịch rảnh', sub: 'Cho buổi dạy React', badge: null },
        { icon: MagnifyingGlass, bg: 'bg-orange-50', iconColor: 'text-orange-500', title: 'Tìm người dạy', sub: 'AI đề xuất 4 người', badge: null },
        { icon: Path, bg: 'bg-pink-50', iconColor: 'text-pink-500', title: 'Lộ trình', sub: 'Frontend 40% xong', badge: null },
    ];

    const teachingSessions = [
        { initials: 'TH', name: 'Thanh Hà', topic: 'React', time: 'T2 10/3 · 14:00', badge: '📅 Đã đặt', badgeCls: 'bg-sky-100 text-sky-600' },
        { initials: 'DK', name: 'Duy Khang', topic: 'React', time: 'T4 12/3 · 9:00', badge: '⏳ Chờ duyệt', badgeCls: 'bg-amber-100 text-amber-600' },
    ];

    const learningSessions = [
        { initials: 'MA', name: 'Minh Anh', topic: 'React Development', time: 'T2 10/3 · 9:00 SA', badge: '🔵 Sắp tới', badgeCls: 'bg-blue-50 text-blue-600' },
        { initials: 'TL', name: 'Thùy Linh', topic: 'UI/UX Design', time: 'T4 12/3 · 9:00 SA', badge: '🔵 Sắp tới', badgeCls: 'bg-blue-50 text-blue-600' },
    ];

    const aiTeachers = [
        { initials: 'MA', name: 'Minh Anh', subject: 'React Development', rating: '4.8', stars: 5, rate: 15, match: 98, highlight: true, avatarGrad: 'from-violet-500 to-fuchsia-500' },
        { initials: 'TL', name: 'Thùy Linh', subject: 'UI/UX Design', rating: '4.7', stars: 4, rate: 12, match: null, highlight: false, avatarGrad: 'from-purple-500 to-pink-500' },
        { initials: 'QB', name: 'Quốc Bảo', subject: 'Python & ML', rating: '4.9', stars: 5, rate: 18, match: null, highlight: false, avatarGrad: 'from-teal-500 to-emerald-500' },
    ];

    return (
        <div className="max-w-7xl mx-auto font-sans pb-14 space-y-6">

            {/* ─── HERO BANNER ─── */}
            <div
                className="relative rounded-3xl overflow-hidden p-8 sm:p-10"
                style={{ background: 'linear-gradient(140deg, #5A63F6 0%, #7C3AED 55%, #A855F7 100%)' }}
            >
                {/* Decorative circles */}
                <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/10 rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 right-32 w-52 h-52 bg-white/10 rounded-full pointer-events-none" />
                <div className="absolute top-6 right-56 w-4 h-4 bg-white/30 rounded-full pointer-events-none" />
                <div className="absolute top-20 right-44 w-2 h-2 bg-white/40 rounded-full pointer-events-none" />

                <div className="relative z-10">
                    {/* Greeting & Date */}
                    <div className="flex items-center gap-2 text-white/65 text-xs font-semibold mb-3">
                        <Sparkle size={13} weight="fill" className="text-yellow-300" />
                        <span>{getGreeting()}</span>
                        <span className="w-1 h-1 rounded-full bg-white/40 inline-block" />
                        <span>{getDateString()}</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
                        {displayName} — hôm nay dạy gì?
                    </h1>
                    <p className="text-sm text-white/65 mb-7 font-medium">
                        Bạn có{' '}
                        <span className="text-white font-bold underline underline-offset-2 decoration-dotted">2 yêu cầu mới</span>
                        {' '}chờ xử lý ·{' '}
                        <span className="text-white font-bold underline underline-offset-2 decoration-dotted">2 buổi học sắp tới</span>
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        <Link to="/app/explore">
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-violet-600 font-bold text-sm rounded-xl shadow-md hover:bg-white/90 active:scale-95 transition-all">
                                <MagnifyingGlass size={15} weight="bold" /> Tìm người dạy
                            </button>
                        </Link>
                        <Link to="/app/sessions">
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm text-white font-bold text-sm rounded-xl border border-white/25 hover:bg-white/25 active:scale-95 transition-all">
                                <Calendar size={15} weight="duotone" /> Quản lý buổi dạy
                            </button>
                        </Link>
                        <Link to="/app/learning-path">
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm text-white font-bold text-sm rounded-xl border border-white/25 hover:bg-white/25 active:scale-95 transition-all">
                                <Path size={15} weight="duotone" /> Lộ trình học
                            </button>
                        </Link>
                    </div>

                    {/* Stats Row */}
                    <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl flex flex-wrap divide-x divide-white/15">
                        {bannerStats.map((s, i) => (
                            <BannerStat key={i} {...s} />
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── QUICK ACTIONS ─── */}
            <div>
                <h2 className="text-base font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                    <ChartLineUp size={18} weight="duotone" className="text-violet-500" />
                    Truy cập nhanh
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {quickActions.map((a, i) => (
                        <ActionCard key={i} {...a} />
                    ))}
                </div>
            </div>

            {/* ─── UPCOMING SESSIONS ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Teaching */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                            <ChalkboardTeacher size={18} weight="duotone" className="text-violet-500" />
                            Buổi dạy sắp tới
                        </h2>
                        <Link to="/app/sessions" className="flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-700">
                            Xem tất cả <ArrowRight size={13} weight="bold" />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {teachingSessions.map((s, i) => <SessionRow key={i} {...s} />)}
                    </div>
                </div>

                {/* Learning */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                            <BookOpen size={18} weight="duotone" className="text-sky-500" />
                            Buổi học sắp tới
                        </h2>
                        <Link to="/app/sessions" className="flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-700">
                            Xem tất cả <ArrowRight size={13} weight="bold" />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {learningSessions.map((s, i) => <SessionRow key={i} {...s} />)}
                    </div>
                </div>
            </div>

            {/* ─── AI RECOMMENDATIONS ─── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                        <Robot size={18} weight="duotone" className="text-violet-500" />
                        AI Gợi ý dành cho bạn
                    </h2>
                    <Link to="/app/explore" className="flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-700">
                        Xem tất cả <ArrowRight size={13} weight="bold" />
                    </Link>
                </div>
                <p className="text-[12px] text-slate-400 font-medium mb-5">Dựa trên lộ trình học và kỹ năng bạn đang cần</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {aiTeachers.map((t, i) => <TeacherCard key={i} {...t} />)}
                </div>
            </div>

        </div>
    );
};

export default UserDashboard;
