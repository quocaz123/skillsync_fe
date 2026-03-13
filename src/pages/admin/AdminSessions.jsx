import { useState } from 'react';
import { CalendarDays, BookOpen, RefreshCw, Download, Eye, Ban, Zap, Star } from 'lucide-react';

const MOCK_SESSIONS = [
    { id: 's1', topic: 'React.js Hooks Advanced', student: 'Nguyễn Văn An', mentor: 'Trần Thị Bình', date: '2026-03-10T10:00:00', status: 'upcoming', cost: 50, type: 'single', duration: 60 },
    { id: 's2', topic: 'UI/UX Design Basics', student: 'Lê Hoàng Cường', mentor: 'Phạm Thị Dung', date: '2026-03-09T14:00:00', status: 'completed', cost: 40, rating: 5, type: 'path', pathName: 'Trở thành UI/UX Designer', duration: 90 },
    { id: 's3', topic: 'Python Data Science', student: 'Nguyễn Văn An', mentor: 'Phạm Thị Dung', date: '2026-03-08T09:00:00', status: 'completed', cost: 60, rating: 4, type: 'single', duration: 75 },
    { id: 's4', topic: 'Public Speaking Masterclass', student: 'Phạm Thị Dung', mentor: 'Trần Thị Bình', date: '2026-03-11T16:00:00', status: 'upcoming', cost: 70, type: 'path', pathName: 'Kỹ năng mềm cho IT', duration: 60 },
    { id: 's5', topic: 'Node.js & REST API', student: 'Hoàng Văn Em', mentor: 'Nguyễn Văn An', date: '2026-03-07T11:00:00', status: 'cancelled', cost: 55, type: 'single', duration: 60 },
    { id: 's6', topic: 'Database Architecture', student: 'Lê Hoàng Cường', mentor: 'Trần Thị Bình', date: '2026-03-12T09:00:00', status: 'completed', cost: 65, rating: 5, type: 'single', duration: 90 },
];

const statusConfig = {
    upcoming: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', dot: 'bg-blue-500', label: 'Sắp diễn ra' },
    completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', dot: 'bg-emerald-500', label: 'Hoàn thành' },
    cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', dot: 'bg-rose-500', label: 'Đã hủy' },
};

const StatusBadge = ({ status }) => {
    const c = statusConfig[status] || statusConfig.upcoming;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${c.bg} ${c.text} border ${c.border} rounded-full text-[11px] font-extrabold`}>
            <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></div>
            {c.label}
        </span>
    );
};

const AdminSessions = () => {
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');

    const filtered = MOCK_SESSIONS.filter(s => {
        const statusOk = filterStatus === 'all' || s.status === filterStatus;
        const typeOk = filterType === 'all' || s.type === filterType;
        return statusOk && typeOk;
    });

    const stats = [
        { label: 'Tổng Sessions', value: MOCK_SESSIONS.length, color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-100', icon: '📅' },
        { label: 'Sắp diễn ra', value: MOCK_SESSIONS.filter(s => s.status === 'upcoming').length, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: '⏳' },
        { label: 'Hoàn thành', value: MOCK_SESSIONS.filter(s => s.status === 'completed').length, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: '✅' },
        { label: 'Đã hủy', value: MOCK_SESSIONS.filter(s => s.status === 'cancelled').length, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: '❌' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <CalendarDays size={22} className="text-[#5A63F6]" /> Quản lý Sessions
                    </h1>
                    <p className="text-sm text-slate-400 font-medium mt-1">Theo dõi toàn bộ buổi học trên hệ thống</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold text-sm transition-colors"><RefreshCw size={14} /> Làm mới</button>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-[#5A63F6] text-white rounded-xl font-bold text-sm hover:bg-[#4a53e6] transition-colors"><Download size={14} /> Xuất CSV</button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {stats.map(s => (
                    <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5 flex items-center gap-4`}>
                        <span className="text-3xl">{s.icon}</span>
                        <div>
                            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                            <div className="text-xs font-semibold text-slate-500 mt-0.5">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1">
                    {['all', 'upcoming', 'completed', 'cancelled'].map(f => (
                        <button key={f} onClick={() => setFilterStatus(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus === f ? 'bg-[#5A63F6] text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                            {{ all: 'Tất cả', upcoming: 'Sắp tới', completed: 'Hoàn thành', cancelled: 'Đã hủy' }[f]}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1">
                    {['all', 'single', 'path'].map(f => (
                        <button key={f} onClick={() => setFilterType(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterType === f ? 'bg-purple-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                            {{ all: 'Tất cả loại', single: 'Đơn lẻ', path: 'Lộ trình' }[f]}
                        </button>
                    ))}
                </div>
                <span className="ml-auto text-xs text-slate-400 font-medium">{filtered.length} sessions</span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[11px] font-extrabold uppercase tracking-widest">
                                <th className="px-6 py-4">Loại</th>
                                <th className="px-6 py-4">Chủ đề</th>
                                <th className="px-6 py-4">Học viên</th>
                                <th className="px-6 py-4">Mentor</th>
                                <th className="px-6 py-4">Ngày & Giờ</th>
                                <th className="px-6 py-4">Credits</th>
                                <th className="px-6 py-4">Đánh giá</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map(s => (
                                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        {s.type === 'path' ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-extrabold uppercase">Lộ trình</span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-extrabold uppercase">Đơn lẻ</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-[#5A63F6] shrink-0">
                                                <BookOpen size={15} />
                                            </div>
                                            <div>
                                                <span className="font-bold text-sm text-slate-800 block">{s.topic}</span>
                                                {s.type === 'path' && <p className="text-xs text-purple-600 font-medium">{s.pathName}</p>}
                                                <span className="text-xs text-slate-400">{s.duration} phút</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{s.student}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{s.mentor}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs font-bold text-slate-700">{new Date(s.date).toLocaleDateString('vi-VN')}</div>
                                        <div className="text-xs text-slate-400">{new Date(s.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1 font-extrabold text-amber-600 text-sm">
                                            <Zap size={13} className="fill-amber-500" /> {s.cost}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {s.rating ? (
                                            <span className="flex items-center gap-1 text-sm font-bold">
                                                <Star size={13} className="fill-amber-400 text-amber-400" /> {s.rating}/5
                                            </span>
                                        ) : <span className="text-xs text-slate-300">—</span>}
                                    </td>
                                    <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" title="Xem chi tiết"><Eye size={15} /></button>
                                            {s.status === 'upcoming' && (
                                                <button className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors" title="Hủy khẩn cấp"><Ban size={15} /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs font-bold text-slate-400">
                    <span>Hiển thị {filtered.length}/{MOCK_SESSIONS.length} sessions</span>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 transition-colors">Trước</button>
                        <button className="px-4 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 transition-colors">Tiếp</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSessions;
