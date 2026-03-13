import { useState } from 'react';
import { BookOpen, Eye, CheckCircle2, XCircle, Zap, Users } from 'lucide-react';

const MOCK_PATHS = [
    { id: 'p1', title: 'Trở thành UI/UX Designer', mentor: 'Phạm Thị Dung', created: '2026-03-01', modules: 8, price: 400, students: 24, status: 'active', category: 'Design' },
    { id: 'p2', title: 'Fullstack Next.js Masterclass', mentor: 'Trần Thị Bình', created: '2026-03-10', modules: 12, price: 800, students: 0, status: 'pending', category: 'Lập trình' },
    { id: 'p3', title: 'Kỹ năng mềm cho IT', mentor: 'Trần Thị Bình', created: '2026-02-15', modules: 5, price: 200, students: 156, status: 'active', category: 'Kỹ năng' },
    { id: 'p4', title: 'Hack não tiếng Anh', mentor: 'Trần Thị Bình', created: '2026-03-12', modules: 10, price: 300, students: 0, status: 'rejected', category: 'Ngôn ngữ' },
    { id: 'p5', title: 'Machine Learning từ A-Z', mentor: 'Nguyễn Văn An', created: '2026-03-11', modules: 15, price: 1200, students: 0, status: 'pending', category: 'AI/ML' },
];

const statusConfig = {
    active: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', dot: 'bg-emerald-500', label: 'Đang mở' },
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', dot: 'bg-amber-500', label: 'Chờ duyệt' },
    rejected: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', dot: 'bg-rose-500', label: 'Từ chối' },
};

const StatusBadge = ({ status }) => {
    const c = statusConfig[status] || statusConfig.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${c.bg} ${c.text} border ${c.border} rounded-full text-[11px] font-extrabold`}>
            <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></div>
            {c.label}
        </span>
    );
};

const AdminPaths = () => {
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all' ? MOCK_PATHS : MOCK_PATHS.filter(p => p.status === filter);

    const pending = MOCK_PATHS.filter(p => p.status === 'pending').length;
    const active = MOCK_PATHS.filter(p => p.status === 'active').length;
    const rejected = MOCK_PATHS.filter(p => p.status === 'rejected').length;
    const totalStudents = MOCK_PATHS.reduce((a, p) => a + p.students, 0);

    return (
        <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6 pb-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <BookOpen size={22} className="text-[#5A63F6]" /> Quản lý Lộ trình Học
                    </h1>
                    <p className="text-sm text-slate-400 font-medium mt-1">Duyệt và kiểm soát chất lượng lộ trình do Mentor tạo lên</p>
                </div>
                {pending > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                        <span className="text-sm font-bold text-amber-700">{pending} lộ trình chờ duyệt</span>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Tổng lộ trình', value: MOCK_PATHS.length, icon: '🗺️', bg: 'bg-slate-50', border: 'border-slate-100', color: 'text-slate-700' },
                    { label: 'Chờ duyệt', value: pending, icon: '⏳', bg: 'bg-amber-50', border: 'border-amber-100', color: 'text-amber-700' },
                    { label: 'Đang hoạt động', value: active, icon: '✅', bg: 'bg-emerald-50', border: 'border-emerald-100', color: 'text-emerald-700' },
                    { label: 'Tổng học viên đăng ký', value: totalStudents, icon: '👥', bg: 'bg-blue-50', border: 'border-blue-100', color: 'text-blue-700' },
                ].map(s => (
                    <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5 flex items-center gap-4`}>
                        <span className="text-3xl">{s.icon}</span>
                        <div>
                            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                            <div className="text-xs font-semibold text-slate-500 mt-0.5">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
                {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'pending', label: '⏳ Chờ duyệt' },
                    { id: 'active', label: '✅ Đang mở' },
                    { id: 'rejected', label: '❌ Từ chối' },
                ].map(f => (
                    <button key={f.id} onClick={() => setFilter(f.id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${filter === f.id ? 'bg-[#5A63F6] text-white shadow-md shadow-indigo-200' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                        {f.label}
                    </button>
                ))}
                <span className="ml-auto text-xs text-slate-400 font-medium">{filtered.length} lộ trình</span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[11px] font-extrabold uppercase tracking-widest">
                                <th className="px-6 py-4">Lộ trình</th>
                                <th className="px-6 py-4">Mentor</th>
                                <th className="px-6 py-4">Danh mục</th>
                                <th className="px-6 py-4">Cấu trúc</th>
                                <th className="px-6 py-4">Giá</th>
                                <th className="px-6 py-4">Học viên</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Phê duyệt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map(path => (
                                <tr key={path.id} className={`hover:bg-slate-50/50 group transition-colors ${path.status === 'pending' ? 'bg-amber-50/20' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                                                <BookOpen size={16} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 text-sm">{path.title}</div>
                                                <div className="text-xs text-slate-400 font-medium">Tạo ngày: {path.created}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-sm text-slate-700">{path.mentor}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">{path.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{path.modules} Modules</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1 font-extrabold text-amber-600">
                                            <Zap size={14} className="fill-amber-500" /> {path.price} CR
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1 text-sm font-bold text-slate-600">
                                            <Users size={13} /> {path.students}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4"><StatusBadge status={path.status} /></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors" title="Xem chi tiết"><Eye size={15} /></button>
                                            {path.status === 'pending' && (
                                                <>
                                                    <button className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-600 font-bold transition-all shadow-sm" title="Duyệt lộ trình"><CheckCircle2 size={16} /></button>
                                                    <button className="p-2 rounded-xl bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 font-bold transition-all shadow-sm" title="Từ chối"><XCircle size={16} /></button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPaths;
