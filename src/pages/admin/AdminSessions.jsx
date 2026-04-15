import { useState, useEffect } from 'react';
import {
    CalendarBlank, BookOpen, ArrowsClockwise, Eye, Prohibit,
    CircleNotch, Star, Lightning, Warning
} from '@phosphor-icons/react';
import { getAdminSessions } from '../../services/adminSessionService';

const STATUS_CONFIG = {
    PENDING_APPROVAL: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', dot: 'bg-purple-500', label: 'Chờ duyệt' },
    SCHEDULED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', dot: 'bg-blue-500', label: 'Đã lên lịch' },
    IN_PROGRESS: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-100', dot: 'bg-cyan-500', label: 'Đang diễn ra' },
    COMPLETED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', dot: 'bg-emerald-500', label: 'Hoàn thành' },
    CANCELLED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', dot: 'bg-rose-500', label: 'Đã hủy' },
    DISPUTED: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', dot: 'bg-orange-500', label: 'Tranh chấp' },
};

const StatusBadge = ({ status }) => {
    const c = STATUS_CONFIG[status] || STATUS_CONFIG.SCHEDULED;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${c.bg} ${c.text} border ${c.border} rounded-full text-[11px] font-extrabold`}>
            <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </span>
    );
};

const FILTER_OPTIONS = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'PENDING_APPROVAL', label: 'Chờ duyệt' },
    { id: 'SCHEDULED', label: 'Đã lên lịch' },
    { id: 'IN_PROGRESS', label: 'Đang diễn ra' },
    { id: 'COMPLETED', label: 'Hoàn thành' },
    { id: 'CANCELLED', label: 'Đã hủy' },
    { id: 'DISPUTED', label: 'Tranh chấp' },
];

const AdminSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');

    const fetchSessions = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdminSessions(filterStatus);
            setSessions(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error loading sessions:', err);
            setError('Không thể tải danh sách sessions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSessions(); }, [filterStatus]); // eslint-disable-line

    const statCounts = {
        total: sessions.length,
        pending: sessions.filter(s => s.status === 'PENDING_APPROVAL').length,
        completed: sessions.filter(s => s.status === 'COMPLETED').length,
        disputed: sessions.filter(s => s.status === 'DISPUTED').length,
    };

    const stats = [
        { Icon: CalendarBlank, label: 'Tổng Sessions', value: statCounts.total, color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-100', weight: 'duotone' },
        { Icon: CircleNotch, label: 'Chờ duyệt', value: statCounts.pending, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', weight: 'regular' },
        { Icon: Star, label: 'Hoàn thành', value: statCounts.completed, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', weight: 'fill' },
        { Icon: Warning, label: 'Tranh chấp', value: statCounts.disputed, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', weight: 'duotone' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <CalendarBlank size={22} weight="duotone" className="text-[#5A63F6]" /> Quản lý Sessions
                    </h1>
                    <p className="text-sm text-slate-400 font-medium mt-1">Theo dõi toàn bộ buổi học trên hệ thống</p>
                </div>
                <button onClick={fetchSessions} disabled={loading}
                    className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold text-sm transition-colors disabled:opacity-50">
                    <ArrowsClockwise size={14} weight={loading ? 'regular' : 'bold'} className={loading ? 'animate-spin' : ''} /> Làm mới
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map(s => (
                    <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5 flex items-center gap-4`}>
                        <s.Icon size={28} weight={s.weight} className={s.color} />
                        <div>
                            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                            <div className="text-xs font-semibold text-slate-500 mt-0.5">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 flex-wrap">
                    {FILTER_OPTIONS.map(f => (
                        <button key={f.id} onClick={() => setFilterStatus(f.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus === f.id ? 'bg-[#5A63F6] text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                            {f.label}
                        </button>
                    ))}
                </div>
                <span className="ml-auto text-xs text-slate-400 font-medium">{sessions.length} sessions</span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto min-h-[300px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-40 text-slate-400 gap-2">
                            <CircleNotch size={22} className="animate-spin text-[#5A63F6]" />
                            <span className="text-sm font-medium">Đang tải dữ liệu...</span>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-40 text-rose-500 gap-2">
                            <Warning size={20} weight="duotone" />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <CalendarBlank size={32} weight="duotone" className="text-slate-300 mb-3" />
                            <p className="font-bold text-slate-500">Không có sessions nào</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[11px] font-extrabold uppercase tracking-widest">
                                    <th className="px-6 py-4">Kỹ năng</th>
                                    <th className="px-6 py-4">Học viên</th>
                                    <th className="px-6 py-4">Mentor</th>
                                    <th className="px-6 py-4">Ngày học</th>
                                    <th className="px-6 py-4">Credits</th>
                                    <th className="px-6 py-4">Đánh giá</th>
                                    <th className="px-6 py-4">Trạng thái</th>
                                    <th className="px-6 py-4 text-right">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {sessions.map(s => (
                                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-[#5A63F6] shrink-0">
                                                    <BookOpen size={15} weight="duotone" />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-sm text-slate-800 block">{s.skillName || 'Session'}</span>
                                                    {s.slotDate && (
                                                        <span className="text-xs text-slate-400">{s.slotDate}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-600">{s.learnerName || '—'}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-600">{s.teacherName || '—'}</td>
                                        <td className="px-6 py-4">
                                            {s.slotDate ? (
                                                <>
                                                    <div className="text-xs font-bold text-slate-700">{new Date(s.slotDate).toLocaleDateString('vi-VN')}</div>
                                                    {s.slotTime && <div className="text-xs text-slate-400">{s.slotTime}</div>}
                                                </>
                                            ) : <span className="text-xs text-slate-300">—</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1 font-extrabold text-amber-600 text-sm">
                                                <Lightning size={13} weight="fill" /> {s.creditCost ?? '—'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {s.rating ? (
                                                <span className="flex items-center gap-1 text-sm font-bold">
                                                    <Star size={13} weight="fill" className="text-amber-400" /> {s.rating}/5
                                                </span>
                                            ) : <span className="text-xs text-slate-300">—</span>}
                                        </td>
                                        <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" title="Xem chi tiết">
                                                    <Eye size={15} weight="regular" />
                                                </button>
                                                {s.status === 'SCHEDULED' && (
                                                    <button className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors" title="Hủy khẩn cấp">
                                                        <Prohibit size={15} weight="duotone" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {!loading && sessions.length > 0 && (
                    <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs font-bold text-slate-400">
                        <span>{sessions.length} sessions đang hiển thị</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSessions;
