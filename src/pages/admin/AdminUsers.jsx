import { useState, useEffect } from 'react';
import { Users, Search, CheckCircle2, Shield, Loader2 } from 'lucide-react';
import { getAllUsers, toggleUserBanStatus } from '../../services/adminUserService';

const StatusBadge = ({ status }) => {
    const cfg = {
        ACTIVE: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', dot: 'bg-emerald-500', label: 'Active' },
        INACTIVE: { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200', dot: 'bg-slate-400', label: 'Inactive' },
        BANNED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', dot: 'bg-red-500', label: 'Banned' },
    };
    const c = cfg[status] || cfg.INACTIVE;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${c.bg} ${c.text} border ${c.border} rounded-full text-[11px] font-extrabold`}>
            <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></div>
            {c.label}
        </span>
    );
};

const RoleBadge = ({ role }) => {
    const cfg = {
        LEARNER: { label: 'Học viên', bg: 'bg-indigo-50', text: 'text-indigo-700' },
        TEACHER: { label: 'Mentor', bg: 'bg-amber-50', text: 'text-amber-700' },
        ADMIN: { label: 'Admin', bg: 'bg-purple-50', text: 'text-purple-700' },
    };
    const c = cfg[role] || cfg.LEARNER;
    return <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${c.bg} ${c.text}`}>{c.label}</span>;
};

const AdminUsers = () => {
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data || []);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBan = async (user) => {
        if (user.role === 'ADMIN') {
            alert('Không thể khoá tài khoản Admin!');
            return;
        }

        const actionWord = user.status === 'BANNED' ? 'MỞ KHOÁ' : 'KHOÁ';
        if (!window.confirm(`Bạn có chắc chắn muốn ${actionWord} tài khoản của ${user.fullName}?`)) return;

        setActionLoadingId(user.id);
        try {
            const updatedUser = await toggleUserBanStatus(user.id);
            setUsers((prevUsers) => prevUsers.map(u => u.id === user.id ? updatedUser : u));
        } catch (error) {
            console.error(error);
            alert(`Lỗi khi ${actionWord.toLowerCase()} tài khoản!`);
        } finally {
            setActionLoadingId(null);
        }
    };

    const filtered = users.filter(u =>
        u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6 pb-4">
            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Users size={22} className="text-[#5A63F6]" /> Quản lý Người dùng
                </h1>
                <p className="text-sm text-slate-400 font-medium mt-1">Xem và quản lý trạng thái tài khoản người dùng trên hệ thống</p>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <p className="text-sm text-slate-500 font-medium">{users.length} người dùng trong hệ thống</p>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm theo tên, email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#5A63F6] focus:ring-1 focus:ring-[#5A63F6]/30 w-full sm:w-64 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[11px] font-extrabold uppercase tracking-widest">
                                <th className="px-6 py-4">Người dùng</th>
                                <th className="px-6 py-4">Vai trò</th>
                                <th className="px-6 py-4">Số dư (Credits)</th>
                                <th className="px-6 py-4">Trust Score</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#5A63F6]" />
                                        <p>Đang tải danh sách người dùng...</p>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                                        <Users className="w-12 h-12 text-slate-300" />
                                        <span className="font-medium text-slate-600">Không tìm thấy người dùng nào</span>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {user.avatarUrl ? (
                                                    <img src={user.avatarUrl} alt="avatar" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5A63F6] to-fuchsia-400 text-white flex items-center justify-center font-extrabold text-sm shrink-0">
                                                        {user.fullName?.charAt(0) || '?'}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-slate-900 text-sm line-clamp-1">{user.fullName || 'Người dùng'}</div>
                                                    <div className="text-xs text-slate-400 font-medium">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-700">{user.creditsBalance || 0}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${user.trustScore > 80 ? 'bg-emerald-500' : user.trustScore > 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${user.trustScore || 0}%` }}></div>
                                                </div>
                                                <span className="text-xs font-bold text-slate-700">{user.trustScore || 0}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                {user.role !== 'ADMIN' && (
                                                    <button
                                                        onClick={() => handleToggleBan(user)}
                                                        disabled={actionLoadingId === user.id}
                                                        className={`p-2 rounded-xl transition-colors ${
                                                            user.status === 'BANNED'
                                                                ? 'text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700'
                                                                : 'text-rose-400 hover:bg-rose-50 hover:text-rose-600'
                                                        }`}
                                                        title={user.status === 'BANNED' ? 'Mở khoá tài khoản' : 'Khoá tài khoản'}
                                                    >
                                                        {actionLoadingId === user.id ? (
                                                            <Loader2 size={18} className="animate-spin" />
                                                        ) : user.status === 'BANNED' ? (
                                                            <CheckCircle2 size={18} weight="bold" />
                                                        ) : (
                                                            <Shield size={18} weight="bold" />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && filtered.length > 0 && (
                    <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs font-bold text-slate-400">
                        <span>Hiển thị {filtered.length}/{users.length} người dùng</span>
                        <div className="flex gap-2">
                            {/* Pagination can be added later if needed */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
