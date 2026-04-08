import { useState, useEffect } from 'react';
import {
    CurrencyCircleDollar, ChartBar, TrendUp, ArrowsClockwise,
    CircleNotch, Warning, DownloadSimple
} from '@phosphor-icons/react';
import { getAdminCreditTransactions } from '../../services/adminCreditService';

const TYPE_CONFIG = {
    WELCOME_BONUS: { label: 'Bonus', bg: 'bg-violet-50', text: 'text-violet-700' },
    SPEND_SESSION: { label: 'Thanh toán', bg: 'bg-indigo-50', text: 'text-indigo-700' },
    EARN_SESSION: { label: 'Thu nhập Mentor', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    MISSION_REWARD: { label: 'Phần thưởng', bg: 'bg-amber-50', text: 'text-amber-700' },
    REFUND: { label: 'Hoàn tiền', bg: 'bg-blue-50', text: 'text-blue-700' },
    PENALTY: { label: 'Phạt', bg: 'bg-rose-50', text: 'text-rose-700' },
};

const FILTER_OPTIONS = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'SPEND_SESSION', label: 'Thanh toán' },
    { id: 'EARN_SESSION', label: 'Thu nhập' },
    { id: 'MISSION_REWARD', label: 'Phần thưởng' },
    { id: 'REFUND', label: 'Hoàn tiền' },
    { id: 'WELCOME_BONUS', label: 'Bonus' },
    { id: 'PENALTY', label: 'Phạt' },
];

const AdminCredits = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('ALL');

    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdminCreditTransactions(filter);
            setTransactions(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError('Không thể tải lịch sử giao dịch.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTransactions(); }, [filter]); // eslint-disable-line

    const totalAmount = transactions.filter(t => t.transactionType === 'EARN_SESSION' || t.transactionType === 'WELCOME_BONUS' || t.transactionType === 'MISSION_REWARD')
        .reduce((a, t) => a + (t.amount || 0), 0);
    const totalSpent = transactions.filter(t => t.transactionType === 'SPEND_SESSION').reduce((a, t) => a + (t.amount || 0), 0);
    const totalRefund = transactions.filter(t => t.transactionType === 'REFUND').reduce((a, t) => a + (t.amount || 0), 0);

    const stats = [
        { Icon: CurrencyCircleDollar, label: 'Tổng Giao dịch', value: transactions.length, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', weight: 'duotone' },
        { Icon: TrendUp, label: 'Credits Phát sinh', value: totalAmount.toLocaleString(), color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', weight: 'duotone' },
        { Icon: ChartBar, label: 'Credits Thanh toán', value: totalSpent.toLocaleString(), color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', weight: 'duotone' },
        { Icon: Warning, label: 'Credits Hoàn trả', value: totalRefund.toLocaleString(), color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', weight: 'duotone' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <CurrencyCircleDollar size={22} weight="duotone" className="text-amber-500" /> Credits &amp; Giao dịch
                    </h1>
                    <p className="text-sm text-slate-400 font-medium mt-1">Kiểm soát dòng credit trên toàn hệ thống</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchTransactions} disabled={loading}
                        className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold text-sm transition-colors disabled:opacity-50">
                        <ArrowsClockwise size={14} className={loading ? 'animate-spin' : ''} /> Làm mới
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-[#5A63F6] text-white rounded-xl font-bold text-sm hover:bg-[#4a53e6] transition-colors">
                        <DownloadSimple size={14} weight="bold" /> Xuất báo cáo
                    </button>
                </div>
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
                {FILTER_OPTIONS.map(f => (
                    <button key={f.id} onClick={() => setFilter(f.id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${filter === f.id ? 'bg-[#5A63F6] text-white shadow-md shadow-indigo-200' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                        {f.label}
                    </button>
                ))}
                <span className="ml-auto text-xs text-slate-400 font-medium">{transactions.length} giao dịch</span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto min-h-[300px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-40 text-slate-400 gap-2">
                            <CircleNotch size={22} className="animate-spin text-[#5A63F6]" />
                            <span className="text-sm font-medium">Đang tải...</span>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-40 text-rose-500 gap-2">
                            <Warning size={20} weight="duotone" /> <span className="text-sm font-medium">{error}</span>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <CurrencyCircleDollar size={32} weight="duotone" className="text-slate-300 mb-3" />
                            <p className="font-bold text-slate-500">Không có giao dịch nào</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[11px] font-extrabold uppercase tracking-widest">
                                    <th className="px-6 py-4">Loại</th>
                                    <th className="px-6 py-4">Người dùng</th>
                                    <th className="px-6 py-4">Mô tả</th>
                                    <th className="px-6 py-4">Credits</th>
                                    <th className="px-6 py-4">Thời gian</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {transactions.map(t => {
                                    const tc = TYPE_CONFIG[t.transactionType] || { label: t.transactionType, bg: 'bg-slate-50', text: 'text-slate-600' };
                                    const isCredit = ['EARN_SESSION', 'WELCOME_BONUS', 'MISSION_REWARD', 'REFUND'].includes(t.transactionType);
                                    return (
                                        <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold ${tc.bg} ${tc.text}`}>
                                                    {tc.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-sm text-slate-800">{t.userName || 'Hệ thống'}</div>
                                                {t.userEmail && <div className="text-xs text-slate-400">{t.userEmail}</div>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-600 max-w-xs line-clamp-2">{t.description || '—'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`flex items-center gap-1 font-extrabold text-sm ${isCredit ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    <CurrencyCircleDollar size={14} weight="duotone" />
                                                    {isCredit ? '+' : '-'}{t.amount}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {t.createdAt ? (
                                                    <>
                                                        <div className="text-xs font-bold text-slate-700">{new Date(t.createdAt).toLocaleDateString('vi-VN')}</div>
                                                        <div className="text-xs text-slate-400">{new Date(t.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                                                    </>
                                                ) : <span className="text-xs text-slate-300">—</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
                {!loading && transactions.length > 0 && (
                    <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs font-bold text-slate-400">
                        <span>{transactions.length} giao dịch</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCredits;
