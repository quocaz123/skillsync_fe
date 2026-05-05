import { useState, useEffect } from 'react';
import { useStore } from '../../store';
import {
    SquaresFour, Users, CalendarBlank, ShieldCheck, Flag,
    BookOpen, CurrencyCircleDollar, LockKey, CircleNotch,
    ArrowsClockwise, Warning, ChartLine, CheckCircle,
    ChartBar, Trophy, Lightning
} from '@phosphor-icons/react';
import { getAdminStats } from '../../services/adminStatsService';
import { getAdminSessions } from '../../services/adminSessionService';
import { Link } from 'react-router-dom';

// ─── STATUS BADGE ────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const cfg = {
        PENDING_APPROVAL: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', dot: 'bg-purple-500', label: 'Chờ duyệt' },
        SCHEDULED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', dot: 'bg-blue-500', label: 'Đã lên lịch' },
        IN_PROGRESS: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-100', dot: 'bg-cyan-500', label: 'Đang diễn ra' },
        COMPLETED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', dot: 'bg-emerald-500', label: 'Hoàn thành' },
        CANCELLED: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400', label: 'Đã hủy' },
        DISPUTED: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', dot: 'bg-orange-500', label: 'Tranh chấp' },
    };
    const c = cfg[status] || cfg.SCHEDULED;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${c.bg} ${c.text} border ${c.border} rounded-full text-[11px] font-extrabold`}>
            <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </span>
    );
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({ Icon, label, value, color, bg, border, weight = 'duotone', linkTo, alert }) => (
    <div className={`${bg} border ${border} rounded-2xl p-5 relative overflow-hidden`}>
        {alert && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bg.replace('50', '100')}`}>
                <Icon size={24} weight={weight} className={color} />
            </div>
            <div className="flex-1 min-w-0">
                <div className={`text-3xl font-black ${color}`}>{value ?? <CircleNotch size={20} className="animate-spin inline" />}</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5 truncate">{label}</div>
            </div>
        </div>
        {linkTo && (
            <Link to={linkTo} className={`mt-3 text-xs font-bold ${color} hover:underline flex items-center gap-1 opacity-70 hover:opacity-100`}>
                Xem chi tiết →
            </Link>
        )}
    </div>
);

// ─── QUICK LINKS ─────────────────────────────────────────────────────────────
const QuickLink = ({ Icon, label, desc, to, color, bg }) => (
    <Link to={to} className={`${bg} border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-all flex items-center gap-3 group`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
            <Icon size={20} weight="duotone" className={color} />
        </div>
        <div className="min-w-0">
            <p className="font-bold text-slate-800 text-sm group-hover:text-[#5A63F6] transition-colors">{label}</p>
            <p className="text-xs text-slate-400 truncate">{desc}</p>
        </div>
    </Link>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const AdminDash = () => {
    const { user } = useStore();
    const [stats, setStats] = useState(null);
    const [recentSessions, setRecentSessions] = useState([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [statsError, setStatsError] = useState(null);

    const fetchAll = async () => {
        setLoadingStats(true);
        setLoadingSessions(true);
        setStatsError(null);
        try {
            const [statsData, sessionsData] = await Promise.all([
                getAdminStats(),
                getAdminSessions(),
            ]);
            setStats(statsData);
            setRecentSessions(Array.isArray(sessionsData) ? sessionsData.slice(0, 8) : []);
        } catch (err) {
            console.error('Dashboard load error:', err);
            setStatsError('Không thể tải dữ liệu tổng quan.');
        } finally {
            setLoadingStats(false);
            setLoadingSessions(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    const statCards = [
        { Icon: Users, label: 'Tổng người dùng', value: stats?.totalUsers, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', linkTo: '/admin/users' },
        { Icon: CalendarBlank, label: 'Tổng Sessions', value: stats?.totalSessions, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', linkTo: '/admin/sessions' },
        { Icon: CheckCircle, label: 'Đã hoàn thành', value: stats?.completedSessions, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', weight: 'fill' },
        { Icon: Flag, label: 'Báo cáo & Tranh chấp', value: stats?.pendingReports, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', alert: stats?.pendingReports > 0, linkTo: '/admin/financial-moderation' },
        { Icon: ShieldCheck, label: 'Kỹ năng chờ duyệt', value: stats?.pendingSkills, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', alert: stats?.pendingSkills > 0, linkTo: '/admin/teaching-skills' },
        { Icon: BookOpen, label: 'Bài viết chờ duyệt', value: stats?.pendingForumPosts, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100', alert: stats?.pendingForumPosts > 0, linkTo: '/admin/forum-posts' },
    ];

    const quickLinks = [
        { Icon: ShieldCheck, label: 'Xét duyệt Mentor', desc: `${stats?.pendingSkills ?? '...'} hồ sơ chờ`, to: '/admin/teaching-skills', color: 'text-violet-600', bg: 'bg-white' },
        { Icon: Flag, label: 'Tài chính & Báo cáo', desc: `${stats?.pendingReports ?? '...'} báo cáo PENDING`, to: '/admin/financial-moderation', color: 'text-rose-600', bg: 'bg-white' },
        { Icon: BookOpen, label: 'Duyệt Bài viết', desc: `${stats?.pendingForumPosts ?? '...'} bài chờ`, to: '/admin/forum-posts', color: 'text-teal-600', bg: 'bg-white' },
        { Icon: Users, label: 'Quản lý Người dùng', desc: `${stats?.totalUsers ?? '...'} tài khoản`, to: '/admin/users', color: 'text-indigo-600', bg: 'bg-white' },
        { Icon: CurrencyCircleDollar, label: 'Lịch sử Giao dịch', desc: `${stats?.totalTransactions ?? '...'} giao dịch`, to: '/admin/credits', color: 'text-amber-600', bg: 'bg-white' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <SquaresFour size={24} weight="duotone" className="text-[#5A63F6]" />
                        Tổng quan Hệ thống
                    </h1>
                    <p className="text-sm text-slate-400 font-medium mt-1">
                        Xin chào, <span className="font-bold text-slate-600">{user?.name || 'Admin'}</span> — Dưới đây là tình trạng hệ thống theo thời gian thực.
                    </p>
                </div>
                <button onClick={fetchAll} disabled={loadingStats}
                    className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold text-sm transition-colors disabled:opacity-50">
                    <ArrowsClockwise size={14} className={loadingStats ? 'animate-spin' : ''} weight="bold" /> Làm mới
                </button>
            </div>

            {/* Error */}
            {statsError && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4 flex items-center gap-3">
                    <Warning size={20} weight="duotone" className="text-rose-500 shrink-0" />
                    <p className="text-sm text-rose-700 font-medium">{statsError}</p>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map(s => (
                    <StatCard key={s.label} {...s} />
                ))}
            </div>

            {/* Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Sessions — 2/3 */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="font-extrabold text-slate-800 flex items-center gap-2">
                            <CalendarBlank size={18} weight="duotone" className="text-[#5A63F6]" /> Sessions gần đây
                        </h2>
                        <Link to="/admin/sessions" className="text-xs font-bold text-[#5A63F6] hover:underline">
                            Xem tất cả →
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        {loadingSessions ? (
                            <div className="flex items-center justify-center h-32 gap-2 text-slate-400">
                                <CircleNotch size={20} className="animate-spin text-[#5A63F6]" />
                                <span className="text-sm">Đang tải...</span>
                            </div>
                        ) : recentSessions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                <CalendarBlank size={28} weight="duotone" className="mb-2 text-slate-300" />
                                <p className="text-sm font-medium">Chưa có session nào</p>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
                                        <th className="px-5 py-3">Kỹ năng</th>
                                        <th className="px-5 py-3">Học viên</th>
                                        <th className="px-5 py-3">Mentor</th>
                                        <th className="px-5 py-3">Credits</th>
                                        <th className="px-5 py-3">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentSessions.map(s => (
                                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-5 py-3">
                                                <span className="font-bold text-slate-800 text-xs">{s.skillName || 'Session'}</span>
                                                {s.slotDate && <p className="text-[10px] text-slate-400">{s.slotDate}</p>}
                                            </td>
                                            <td className="px-5 py-3 text-xs text-slate-600 font-medium">{s.learnerName || '—'}</td>
                                            <td className="px-5 py-3 text-xs text-slate-600 font-medium">{s.teacherName || '—'}</td>
                                            <td className="px-5 py-3">
                                                <span className="flex items-center gap-0.5 font-extrabold text-amber-600 text-xs">
                                                    <Lightning size={11} weight="fill" /> {s.creditCost}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3"><StatusBadge status={s.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Quick Actions — 1/3 */}
                <div className="space-y-4">
                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-5">
                        <h2 className="font-extrabold text-slate-800 flex items-center gap-2 mb-4">
                            <Lightning size={18} weight="duotone" className="text-amber-500" /> Thao tác nhanh
                        </h2>
                        <div className="space-y-2">
                            {quickLinks.map(ql => (
                                <QuickLink key={ql.label} {...ql} />
                            ))}
                        </div>
                    </div>

                    {/* System summary */}
                    <div className="bg-gradient-to-br from-[#5A63F6] to-violet-600 rounded-[2rem] p-5 text-white">
                        <h3 className="font-extrabold text-base flex items-center gap-2 mb-4">
                            <ChartBar size={18} weight="duotone" /> Tóm tắt nhanh
                        </h3>
                        {loadingStats ? (
                            <div className="flex justify-center py-4">
                                <CircleNotch size={24} className="animate-spin opacity-70" />
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {[
                                    { Icon: ChartLine, label: 'Sessions hoàn thành', value: stats?.completedSessions ?? 0, weight: 'duotone' },
                                    { Icon: Warning, label: 'Đang tranh chấp', value: stats?.disputedSessions ?? 0, weight: 'duotone' },
                                    { Icon: Trophy, label: 'Tổng giao dịch', value: stats?.totalTransactions ?? 0, weight: 'duotone' },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center justify-between bg-white/10 rounded-xl px-3 py-2.5">
                                        <div className="flex items-center gap-2 text-white/80 text-xs font-medium">
                                            <item.Icon size={14} weight={item.weight} className="text-white" />
                                            {item.label}
                                        </div>
                                        <span className="font-black text-sm">{item.value.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDash;
