import { useState, useEffect } from 'react';
import { Zap, TrendingUp, AlertTriangle, Download, Eye, Flag, Plus, X } from 'lucide-react';
import httpClient from '../../configuration/axiosClient';
import API_ENDPOINTS from '../../configuration/apiEndpoints';
const typeConfig = {
    session_payment: { label: 'Thanh toán', bg: 'bg-indigo-50', text: 'text-indigo-700' },
    mentor_earn: { label: 'Thu nhập Mentor', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    mission_reward: { label: 'Phần thưởng', bg: 'bg-amber-50', text: 'text-amber-700' },
    refund: { label: 'Hoàn tiền', bg: 'bg-blue-50', text: 'text-blue-700' },
    unknown: { label: 'Không rõ', bg: 'bg-rose-50', text: 'text-rose-700' },
};

const AdminCredits = () => {
    const [transactions, setTransactions] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState(null);
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const [grantForm, setGrantForm] = useState({
        userId: '',
        amount: 50,
        transactionType: 'WELCOME_BONUS',
        description: 'Tặng thưởng cho thành viên'
    });
    const [userSearch, setUserSearch] = useState('');

    const displayUsers = users.filter(u => 
        (u.fullName || '').toLowerCase().includes(userSearch.toLowerCase()) || 
        (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
    );

    useEffect(() => {
        fetchTransactions();
        fetchUsers();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await httpClient.get(API_ENDPOINTS.ADMIN.TRANSACTIONS);
            setTransactions(Array.isArray(res) ? res : res.result || []);
        } catch (err) {
            console.error("Failed to fetch transactions:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await httpClient.get(API_ENDPOINTS.USERS.GET_ALL);
            setUsers(Array.isArray(res) ? res : res.result || []);
        } catch (err) {
            console.error("Failed to fetch users:", err);
        }
    };

    const handleGrantCredit = async (e) => {
        e.preventDefault();
        try {
            await httpClient.post(API_ENDPOINTS.ADMIN.GRANT_CREDIT, grantForm);
            setIsGrantModalOpen(false);
            setGrantForm({ ...grantForm, amount: 50, description: '' });
            fetchTransactions();
        } catch (err) {
            alert("Lỗi khi cấp credit: " + (err.response?.data?.message || err.message));
        }
    };

    const filtered = transactions.filter(t => {
        // Lọc theo Loại
        if (filter !== 'all' && filter !== 'suspicious' && t.transactionType?.toLowerCase() !== filter.toLowerCase()) return false;
        if (filter === 'suspicious' && !t.suspicious) return false;

        // Lọc theo Từ khóa (Tên / ID)
        if (searchQuery) {
            const sq = searchQuery.toLowerCase();
            const matchName = (t.userName || '').toLowerCase().includes(sq);
            const matchUserId = (t.userId || '').toLowerCase().includes(sq);
            const matchTxId = (t.id || '').toLowerCase().includes(sq);
            if (!matchName && !matchUserId && !matchTxId) return false;
        }

        // Lọc theo Ngày
        if (dateFilter) {
            if (!t.createdAt || !t.createdAt.startsWith(dateFilter)) return false;
        }

        return true;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTransactions = filtered.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [filter, searchQuery, dateFilter]);

    const totalCirculating = transactions.reduce((sum, t) => sum + (t.amount > 0 ? t.amount : 0), 0);
    const totalSuspicious = transactions.filter(t => t.suspicious).reduce((a, t) => a + Math.abs(t.amount), 0);
    // Tính số giao dịch diễn ra ngày hôm nay
    const today = new Date().toISOString().split('T')[0];
    const todayCount = transactions.filter(t => t.createdAt && t.createdAt.startsWith(today)).length;


    return (
        <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6 pb-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <Zap size={22} className="text-amber-500" /> Credits & Giao dịch
                    </h1>
                    <p className="text-sm text-slate-400 font-medium mt-1">Kiểm soát dòng credit và phát hiện giao dịch bất thường</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsGrantModalOpen(true)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors">
                        <Plus size={14} /> Cấp / Trừ Credit
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-[#5A63F6] text-white rounded-xl font-bold text-sm hover:bg-[#4a53e6] transition-colors">
                        <Download size={14} /> Xuất báo cáo
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Credits tương tác', value: totalCirculating.toLocaleString(), icon: '💰', bg: 'bg-amber-50', border: 'border-amber-100', color: 'text-amber-700' },
                    { label: 'GD hôm nay', value: todayCount, icon: '📊', bg: 'bg-blue-50', border: 'border-blue-100', color: 'text-blue-700' },
                    { label: 'Tổng GD theo dõi', value: transactions.length, icon: '📋', bg: 'bg-slate-50', border: 'border-slate-100', color: 'text-slate-700' },
                    { label: 'Credits nghi ngờ', value: totalSuspicious, icon: '⚠️', bg: 'bg-rose-50', border: 'border-rose-100', color: 'text-rose-700' },
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
            <div className="flex items-center gap-2 flex-wrap">
                {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'suspicious', label: '⚠️ Nghi ngờ' },
                    { id: 'session_payment', label: 'Thanh toán' },
                    { id: 'mentor_earn', label: 'Thu nhập Mentor' },
                    { id: 'mission_reward', label: 'Phần thưởng' },
                    { id: 'refund', label: 'Hoàn tiền' },
                ].map(f => (
                    <button key={f.id} onClick={() => setFilter(f.id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${filter === f.id
                            ? f.id === 'suspicious' ? 'bg-rose-600 text-white' : 'bg-[#5A63F6] text-white shadow-md shadow-indigo-200'
                            : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                        {f.label}
                    </button>
                ))}
                <span className="ml-auto text-xs text-slate-400 font-medium">{filtered.length} giao dịch</span>
            </div>

            {/* Tim kiem nang cao */}
            <div className="flex items-center gap-3">
                <input 
                    type="text" 
                    placeholder="🔍 Tìm kiếm theo Tên Học Viên, Mã ID Người dùng hoặc Mã Giao dịch..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5A63F6] focus:ring-1 focus:ring-[#5A63F6] shadow-sm bg-white"
                />
                <input 
                    type="date" 
                    value={dateFilter}
                    onChange={e => setDateFilter(e.target.value)}
                    className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5A63F6] text-slate-600 focus:ring-1 focus:ring-[#5A63F6] shadow-sm bg-white"
                />
                {(searchQuery || dateFilter) && (
                    <button 
                        onClick={() => { setSearchQuery(''); setDateFilter(''); }}
                        className="px-4 py-2.5 text-sm font-bold text-rose-500 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors shadow-sm">
                        Xóa Lọc
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[11px] font-extrabold uppercase tracking-widest">
                                <th className="px-6 py-4">Tên người dùng</th>
                                <th className="px-6 py-4">ID Người Dùng</th>
                                <th className="px-6 py-4">Mô tả</th>
                                <th className="px-6 py-4">Credits</th>
                                <th className="px-6 py-4">Thời gian</th>
                                <th className="px-6 py-4 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedTransactions.map(t => {
                                const tc = typeConfig[t.type] || typeConfig.unknown;
                                return (
                                    <tr key={t.id} className={`hover:bg-slate-50/50 transition-colors group ${t.suspicious ? 'bg-rose-50/30' : ''}`}>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-600 max-w-[150px]">
                                            <span className={`truncate block ${t.suspicious ? 'text-rose-600 font-bold' : ''}`}>{t.userName}</span>
                                            {t.userId && (
                                                <span className="inline-flex mt-1 items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-100">
                                                    Ví: {t.userBalance} C
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {t.userId && (
                                                <button 
                                                    onClick={() => navigator.clipboard.writeText(t.userId)}
                                                    className="font-mono text-xs bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded-md transition-colors text-slate-500 hover:text-slate-700 w-full text-left truncate flex items-center justify-between group"
                                                    title="Click để copy ID"
                                                >
                                                    <span className="truncate">{t.userId}</span>
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-600 max-w-xs line-clamp-2">{t.description}</p>
                                            {t.suspicious && (
                                                <span className="inline-flex items-center gap-1 text-xs text-rose-600 font-bold mt-0.5">
                                                    <AlertTriangle size={11} /> Nghi ngờ
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-1 font-extrabold text-sm ${t.suspicious ? 'text-rose-600' : 'text-amber-600'}`}>
                                                <Zap size={13} className={t.suspicious ? 'fill-rose-500' : 'fill-amber-500'} />
                                                {(t.amount > 0 ? '+' : '') + t.amount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-bold text-slate-700">{new Date(t.createdAt).toLocaleDateString('vi-VN')}</div>
                                            <div className="text-xs text-slate-400">{new Date(t.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setSelectedTx(t)} className="p-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" title="Xem chi tiết"><Eye size={15} /></button>
                                                {!t.suspicious && <button onClick={() => alert('Chi tiết: Giao dịch này đã được hệ thống xác thực an toàn tự động vì có khối lượng giao dịch bình thường.')} className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors" title="Đánh dấu nghi ngờ"><Flag size={15} /></button>}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs font-bold text-slate-400">
                    <span>Hiển thị {filtered.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPerPage, filtered.length)} / {filtered.length} giao dịch</span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 border border-slate-200 rounded-xl transition-colors ${currentPage === 1 ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-white hover:bg-slate-50 text-slate-600'}`}>
                            Trước
                        </button>
                        <button 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className={`px-4 py-2 border border-slate-200 rounded-xl transition-colors ${currentPage === totalPages || totalPages === 0 ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-white hover:bg-slate-50 text-slate-600'}`}>
                            Tiếp
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Tặng/Trừ Credit */}
            {isGrantModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-extrabold text-xl text-slate-900 flex items-center gap-2">
                                <Plus size={20} className="text-amber-500" /> Cấp / Trừ Credits
                            </h3>
                            <button onClick={() => setIsGrantModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleGrantCredit} className="p-6 space-y-5 bg-white">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Người dùng nhận / bị trừ</label>
                                <input 
                                    type="text"
                                    placeholder="🔍 Tìm nhanh Tên hoặc Email học viên..."
                                    value={userSearch}
                                    onChange={e => setUserSearch(e.target.value)}
                                    className="w-full border border-slate-200 rounded-t-xl border-b-0 px-4 py-2 text-sm bg-slate-50 text-slate-700 outline-none"
                                />
                                <select 
                                    required
                                    size="4"
                                    value={grantForm.userId}
                                    onChange={e => setGrantForm({...grantForm, userId: e.target.value})}
                                    className="w-full border border-slate-200 rounded-b-xl px-4 py-2.5 text-sm focus:border-amber-500 outline-none overflow-y-auto"
                                >
                                    <option value="" disabled>-- Chọn người dùng từ danh sách ({displayUsers.length}) --</option>
                                    {displayUsers.map(u => (
                                        <option className="py-2.5 px-2 cursor-pointer border-b border-slate-50" key={u.id} value={u.id}>{u.fullName} ({u.email}) - Đang có: {u.creditsBalance}C</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="flex gap-5">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Số lượng <span className="text-rose-500 font-normal text-xs">(Âm để trừ)</span></label>
                                    <input 
                                        type="number" 
                                        required 
                                        value={grantForm.amount}
                                        onChange={e => setGrantForm({...grantForm, amount: e.target.value})}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-amber-500 outline-none" 
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Loại Giao Dịch</label>
                                    <select 
                                        value={grantForm.transactionType}
                                        onChange={e => setGrantForm({...grantForm, transactionType: e.target.value})}
                                        className="w-full border border-slate-200 rounded-xl px-5 py-3 text-sm focus:border-amber-500 outline-none shadow-sm">
                                        <option value="WELCOME_BONUS">Tặng Thưởng</option>
                                        <option value="REFUND">Hoàn Tiền</option>
                                        <option value="PENALTY">Phạt / Trừ Tiền</option>
                                        <option value="MISSION_REWARD">Thưởng nhiệm vụ</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Lý do / Mô tả chi tiết</label>
                                <textarea 
                                    rows="4" 
                                    required
                                    value={grantForm.description}
                                    onChange={e => setGrantForm({...grantForm, description: e.target.value})}
                                    className="w-full border border-slate-200 rounded-xl px-5 py-3 text-sm focus:border-amber-500 outline-none shadow-sm resize-none"
                                    placeholder="Ghi rõ lý do cấp hoặc trừ tiền để lưu trữ vào lịch sử (VD: Hoàn tiền hoàn học phí khóa XYZ...)"
                                ></textarea>
                            </div>

                            <button 
                                                type="submit" 
                                                className="w-full mt-4 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-base transition-all shadow-lg active:scale-95">
                                                Xác nhận {grantForm.amount > 0 ? 'Cộng' : 'Trừ'} Credit
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}

            {/* Modal Xem chi tiết giao dịch */}
            {selectedTx && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-xl border border-slate-100">
                        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
                            <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                                <Zap size={18} className="text-amber-500" />
                                Chi tiết Giao dịch
                            </h3>
                            <button onClick={() => setSelectedTx(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mã Giao dịch (ID)</label>
                                <div className="mt-1 font-mono text-xs text-slate-700 bg-slate-50 p-2 rounded-lg break-all">{selectedTx.id}</div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thời gian</label>
                                <div className="mt-1 text-sm font-medium text-slate-800">
                                    {new Date(selectedTx.createdAt).toLocaleString('vi-VN')}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loại GD</label>
                                    <div className="mt-1 text-sm font-bold text-indigo-600">{selectedTx.transactionType}</div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Số lượng</label>
                                    <div className={`mt-1 text-lg font-extrabold flex items-center gap-1 ${selectedTx.suspicious ? 'text-rose-600' : 'text-amber-600'}`}>
                                        {(selectedTx.amount > 0 ? '+' : '') + selectedTx.amount} C
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tài khoản thao tác</label>
                                <div className="mt-1 text-sm font-bold text-slate-800">{selectedTx.userName}</div>
                                <div className="text-xs text-slate-500 truncate mb-2">{selectedTx.userEmail}</div>
                                {selectedTx.userId && (
                                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-700 px-2 py-1 rounded-lg border border-amber-100">
                                        Ví hiện hành: {selectedTx.userBalance} Credits
                                    </span>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mô tả / Ghi chú</label>
                                <div className="mt-1 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    {selectedTx.description}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                            <button 
                                onClick={() => setSelectedTx(null)}
                                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors text-sm">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCredits;
