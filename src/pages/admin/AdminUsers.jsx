import { useState } from 'react';
import { Users, Search, CheckCircle2, AlertCircle, XCircle, Eye, Shield } from 'lucide-react';

const MOCK_USERS = [
    { id: 1, name: 'Nguyễn Văn An', email: 'an@example.com', credits: 180, status: 'active', role: 'both', sessions: 12, joined: '2026-01-05', rating: 4.7, trustScore: 85, verificationStatus: 'verified' },
    { id: 2, name: 'Trần Thị Bình', email: 'binh@example.com', credits: 340, status: 'active', role: 'teach', sessions: 28, joined: '2025-12-20', rating: 4.9, trustScore: 98, verificationStatus: 'verified' },
    { id: 3, name: 'Lê Hoàng Cường', email: 'cuong@example.com', credits: 50, status: 'inactive', role: 'learn', sessions: 3, joined: '2026-02-10', rating: null, trustScore: 40, verificationStatus: 'none' },
    { id: 4, name: 'Phạm Thị Dung', email: 'dung@example.com', credits: 220, status: 'active', role: 'both', sessions: 17, joined: '2026-01-15', rating: 4.5, trustScore: 70, verificationStatus: 'pending', evidence: 'GitHub Portfolio & AWS Cert' },
    { id: 5, name: 'Hoàng Văn Em', email: 'em@example.com', credits: 10, status: 'banned', role: 'learn', sessions: 1, joined: '2026-03-01', rating: null, trustScore: 10, verificationStatus: 'rejected' },
];

const StatusBadge = ({ status }) => {
    const cfg = {
        active: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', dot: 'bg-emerald-500', label: 'Active' },
        inactive: { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200', dot: 'bg-slate-400', label: 'Inactive' },
        banned: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', dot: 'bg-red-500', label: 'Banned' },
    };
    const c = cfg[status] || cfg.inactive;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${c.bg} ${c.text} border ${c.border} rounded-full text-[11px] font-extrabold`}>
            <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></div>
            {c.label}
        </span>
    );
};

const RoleBadge = ({ role }) => {
    const cfg = {
        learn: { label: 'Học viên', bg: 'bg-indigo-50', text: 'text-indigo-700' },
        teach: { label: 'Mentor', bg: 'bg-amber-50', text: 'text-amber-700' },
        both: { label: 'Học & Dạy', bg: 'bg-purple-50', text: 'text-purple-700' },
    };
    const c = cfg[role] || cfg.learn;
    return <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${c.bg} ${c.text}`}>{c.label}</span>;
};

const AdminUsers = () => {
    const [search, setSearch] = useState('');
    const filtered = MOCK_USERS.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">
            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Users size={22} className="text-[#5A63F6]" /> Quản lý Người dùng
                </h1>
                <p className="text-sm text-slate-400 font-medium mt-1">Xem, xác thực và quản lý tài khoản người dùng trên nền tảng</p>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <p className="text-sm text-slate-500 font-medium">{MOCK_USERS.length} người dùng trong hệ thống</p>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm theo tên, email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#5A63F6] focus:ring-1 focus:ring-[#5A63F6]/30 w-64 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[11px] font-extrabold uppercase tracking-widest">
                                <th className="px-6 py-4">Người dùng</th>
                                <th className="px-6 py-4">Vai trò</th>
                                <th className="px-6 py-4">Xác thực</th>
                                <th className="px-6 py-4">Trust Score</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map(user => (
                                <tr key={user.id} className={`hover:bg-slate-50/50 transition-colors group ${user.verificationStatus === 'pending' ? 'bg-amber-50/20' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5A63F6] to-fuchsia-400 text-white flex items-center justify-center font-extrabold text-sm shrink-0">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 text-sm">{user.name}</div>
                                                <div className="text-xs text-slate-400 font-medium">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                                    <td className="px-6 py-4">
                                        {user.verificationStatus === 'verified' && <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600"><CheckCircle2 size={13} /> Đã xác thực</span>}
                                        {user.verificationStatus === 'pending' && <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600"><AlertCircle size={13} /> Chờ duyệt</span>}
                                        {user.verificationStatus === 'none' && <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400">Chưa X/T</span>}
                                        {user.verificationStatus === 'rejected' && <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600"><XCircle size={13} /> Từ chối</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${user.trustScore > 80 ? 'bg-emerald-500' : user.trustScore > 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${user.trustScore}%` }}></div>
                                            </div>
                                            <span className="text-xs font-bold text-slate-700">{user.trustScore}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {user.verificationStatus === 'pending' && (
                                                <button className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white text-xs font-bold transition-colors shadow-sm" title="Duyệt minh chứng Mentor">
                                                    Review Evidence
                                                </button>
                                            )}
                                            <button className="p-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" title="Xem chi tiết"><Eye size={15} /></button>
                                            <button className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors" title="Khoá tài khoản"><Shield size={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs font-bold text-slate-400">
                    <span>Hiển thị {filtered.length}/{MOCK_USERS.length} người dùng</span>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 transition-colors">Trước</button>
                        <button className="px-4 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 transition-colors">Tiếp</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
