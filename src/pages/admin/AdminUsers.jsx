import { useState, useEffect } from 'react';
import {
    Users, MagnifyingGlass, ShieldCheck, ShieldSlash,
    CircleNotch, Warning, UserCircle
} from '@phosphor-icons/react';
import { getAllUsers, toggleUserBanStatus } from '../../services/adminUserService';
import ConfirmModal from '../../components/common/ConfirmModal';

const RoleBadge = ({ role }) => {
    const cfg = {
        ADMIN: 'bg-violet-100 text-violet-700 border-violet-200',
        MENTOR: 'bg-blue-100 text-blue-700 border-blue-200',
        LEARNER: 'bg-slate-100 text-slate-600 border-slate-200',
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${cfg[role] || cfg.LEARNER}`}>
            {role}
        </span>
    );
};

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [togglingId, setTogglingId] = useState(null);
    const [error, setError] = useState(null);
    const [confirmUserToggle, setConfirmUserToggle] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Không thể tải danh sách người dùng.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleClick = (u) => {
        setConfirmUserToggle(u);
    };

    const executeToggleBan = async () => {
        if (!confirmUserToggle) return;
        setTogglingId(confirmUserToggle.id);
        try {
            const updated = await toggleUserBanStatus(confirmUserToggle.id);
            setUsers(prev => prev.map(u => u.id === confirmUserToggle.id ? { ...u, ...updated } : u));
        } catch (err) {
            alert('Lỗi cập nhật: ' + (err?.response?.data?.message || err.message));
        } finally {
            setTogglingId(null);
            setConfirmUserToggle(null);
        }
    };

    const filtered = users.filter(u =>
        u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    const totalBanned = users.filter(u => u.banned).length;
    const totalMentors = users.filter(u => u.role === 'MENTOR').length;

    return (
        <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6 pb-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <Users size={22} weight="duotone" className="text-[#5A63F6]" />
                        Quản lý Người dùng
                    </h1>
                    <p className="text-sm text-slate-400 font-medium mt-1">
                        Xem và kiểm soát trạng thái tài khoản trên hệ thống
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[
                    { Icon: Users, label: 'Tổng người dùng', value: users.length, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', weight: 'duotone' },
                    { Icon: ShieldCheck, label: 'Mentor', value: totalMentors, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', weight: 'duotone' },
                    { Icon: ShieldSlash, label: 'Đã bị cấm', value: totalBanned, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', weight: 'duotone' },
                ].map(s => (
                    <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5 flex items-center gap-4`}>
                        <s.Icon size={28} weight={s.weight} className={s.color} />
                        <div>
                            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                            <div className="text-xs font-semibold text-slate-500 mt-0.5">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table card */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <p className="text-sm text-slate-500 font-medium">{filtered.length} người dùng</p>
                    <div className="relative w-full sm:w-72">
                        <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm theo tên, email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#5A63F6] focus:ring-1 focus:ring-[#5A63F6]/30 w-full transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-40 text-slate-400 gap-2">
                            <CircleNotch size={22} className="animate-spin text-[#5A63F6]" />
                            <span className="text-sm font-medium">Đang tải...</span>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-40 text-rose-500 gap-2">
                            <Warning size={20} weight="duotone" />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <Users size={32} weight="duotone" className="text-slate-300 mb-3" />
                            <p className="font-bold text-slate-500">Không tìm thấy người dùng</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[11px] font-extrabold uppercase tracking-widest">
                                    <th className="px-6 py-4">Người dùng</th>
                                    <th className="px-6 py-4">Vai trò</th>
                                    <th className="px-6 py-4">Credits</th>
                                    <th className="px-6 py-4">Trạng thái</th>
                                    <th className="px-6 py-4 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                                                    {u.avatarUrl
                                                        ? <img src={u.avatarUrl} className="w-full h-full object-cover" alt="avatar" />
                                                        : <UserCircle size={24} weight="duotone" className="text-slate-400" />
                                                    }
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 text-sm">{u.fullName}</div>
                                                    <div className="text-xs text-slate-400">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><RoleBadge role={u.role} /></td>
                                        <td className="px-6 py-4 font-bold text-amber-600 text-sm">
                                            {u.creditsBalance ?? 0}
                                        </td>
                                        <td className="px-6 py-4">
                                            {u.banned ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-100 rounded-full text-[11px] font-extrabold">
                                                    <ShieldSlash size={12} weight="fill" /> Bị cấm
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[11px] font-extrabold">
                                                    <ShieldCheck size={12} weight="fill" /> Hoạt động
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => handleToggleClick(u)}
                                                    disabled={togglingId === u.id}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50
                                                        ${u.banned
                                                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white border border-emerald-200'
                                                            : 'bg-rose-50 text-rose-700 hover:bg-rose-500 hover:text-white border border-rose-200'
                                                        }`}
                                                >
                                                    {togglingId === u.id
                                                        ? <CircleNotch size={14} className="animate-spin" />
                                                        : u.banned ? <ShieldCheck size={14} weight="duotone" /> : <ShieldSlash size={14} weight="duotone" />
                                                    }
                                                    {u.banned ? 'Gỡ cấm' : 'Cấm'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={!!confirmUserToggle}
                onCancel={() => setConfirmUserToggle(null)}
                onConfirm={executeToggleBan}
                title={confirmUserToggle?.banned ? "Gỡ cấm người dùng" : "Cấm người dùng"}
                message={confirmUserToggle?.banned 
                    ? `Bạn có chắc muốn khôi phục quyền truy cập cho tài khoản "${confirmUserToggle?.email}"?` 
                    : `Tài khoản "${confirmUserToggle?.email}" sẽ bị khóa và không thể đăng nhập. Hệ thống sẽ ghi nhận lịch sử xử phạt.`}
                type={confirmUserToggle?.banned ? "success" : "danger"}
                confirmText={confirmUserToggle?.banned ? "Xác nhận gỡ cấm" : "Khóa tài khoản"}
            />
        </div>
    );
};

export default AdminUsers;
