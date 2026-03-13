import { useState } from 'react';
import { Zap, TrendingUp, AlertTriangle, Download, Eye, Flag } from 'lucide-react';

const MOCK_TRANSACTIONS = [
    { id: 't1', from: 'Lê Hoàng Cường', to: 'Trần Thị Bình', amount: 40, type: 'session_payment', desc: 'Thanh toán buổi học UI/UX Design Basics', date: '2026-03-09T14:00:00', suspicious: false },
    { id: 't2', from: 'Hệ thống', to: 'Trần Thị Bình', amount: 40, type: 'mentor_earn', desc: 'Thu nhập mentor sau buổi học hoàn thành', date: '2026-03-09T15:30:00', suspicious: false },
    { id: 't3', from: 'Nguyễn Văn An', to: 'Phạm Thị Dung', amount: 60, type: 'session_payment', desc: 'Thanh toán buổi học Python Data Science', date: '2026-03-08T09:00:00', suspicious: false },
    { id: 't4', from: 'Tài khoản ẩn danh (User #992)', to: 'Hệ thống', amount: 500, type: 'unknown', desc: 'Giao dịch lúc 3:14 SA — không rõ nguồn gốc', date: '2026-03-05T03:14:00', suspicious: true },
    { id: 't5', from: 'Hệ thống', to: 'Nguyễn Văn An', amount: 20, type: 'mission_reward', desc: 'Phần thưởng hoàn thành nhiệm vụ: Đặt lịch lần đầu', date: '2026-03-07T10:00:00', suspicious: false },
    { id: 't6', from: 'Hệ thống', to: 'Phạm Thị Dung', amount: 50, type: 'refund', desc: 'Hoàn lại credit do session bị hủy bởi mentor', date: '2026-03-06T09:00:00', suspicious: false },
    { id: 't7', from: 'Tài khoản ẩn danh (User #992)', to: 'Nhiều tài khoản', amount: 200, type: 'unknown', desc: 'Phân phối credits bất thường cho 12 tài khoản', date: '2026-03-04T22:00:00', suspicious: true },
];

const typeConfig = {
    session_payment: { label: 'Thanh toán', bg: 'bg-indigo-50', text: 'text-indigo-700' },
    mentor_earn: { label: 'Thu nhập Mentor', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    mission_reward: { label: 'Phần thưởng', bg: 'bg-amber-50', text: 'text-amber-700' },
    refund: { label: 'Hoàn tiền', bg: 'bg-blue-50', text: 'text-blue-700' },
    unknown: { label: 'Không rõ', bg: 'bg-rose-50', text: 'text-rose-700' },
};

const AdminCredits = () => {
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all' ? MOCK_TRANSACTIONS
        : filter === 'suspicious' ? MOCK_TRANSACTIONS.filter(t => t.suspicious)
        : MOCK_TRANSACTIONS.filter(t => t.type === filter);

    const totalCirculating = 24500;
    const totalSuspicious = MOCK_TRANSACTIONS.filter(t => t.suspicious).reduce((a, t) => a + t.amount, 0);
    const todayCount = MOCK_TRANSACTIONS.filter(t => t.date.startsWith('2026-03-09')).length;

    return (
        <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6 pb-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <Zap size={22} className="text-amber-500" /> Credits & Giao dịch
                    </h1>
                    <p className="text-sm text-slate-400 font-medium mt-1">Kiểm soát dòng credit và phát hiện giao dịch bất thường</p>
                </div>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-[#5A63F6] text-white rounded-xl font-bold text-sm hover:bg-[#4a53e6] transition-colors">
                    <Download size={14} /> Xuất báo cáo
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Credits lưu thông', value: totalCirculating.toLocaleString(), icon: '💰', bg: 'bg-amber-50', border: 'border-amber-100', color: 'text-amber-700' },
                    { label: 'GD hôm nay', value: todayCount, icon: '📊', bg: 'bg-blue-50', border: 'border-blue-100', color: 'text-blue-700' },
                    { label: 'Tổng GD theo dõi', value: MOCK_TRANSACTIONS.length, icon: '📋', bg: 'bg-slate-50', border: 'border-slate-100', color: 'text-slate-700' },
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

            {/* Table */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[11px] font-extrabold uppercase tracking-widest">
                                <th className="px-6 py-4">Loại</th>
                                <th className="px-6 py-4">Từ</th>
                                <th className="px-6 py-4">Đến</th>
                                <th className="px-6 py-4">Mô tả</th>
                                <th className="px-6 py-4">Credits</th>
                                <th className="px-6 py-4">Thời gian</th>
                                <th className="px-6 py-4 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map(t => {
                                const tc = typeConfig[t.type] || typeConfig.unknown;
                                return (
                                    <tr key={t.id} className={`hover:bg-slate-50/50 transition-colors group ${t.suspicious ? 'bg-rose-50/30' : ''}`}>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold ${tc.bg} ${tc.text}`}>
                                                {tc.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-600 max-w-[150px]">
                                            <span className={`truncate block ${t.suspicious ? 'text-rose-600 font-bold' : ''}`}>{t.from}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-600">{t.to}</td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-600 max-w-xs line-clamp-2">{t.desc}</p>
                                            {t.suspicious && (
                                                <span className="inline-flex items-center gap-1 text-xs text-rose-600 font-bold mt-0.5">
                                                    <AlertTriangle size={11} /> Nghi ngờ
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-1 font-extrabold text-sm ${t.suspicious ? 'text-rose-600' : 'text-amber-600'}`}>
                                                <Zap size={13} className={t.suspicious ? 'fill-rose-500' : 'fill-amber-500'} />
                                                {t.amount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-bold text-slate-700">{new Date(t.date).toLocaleDateString('vi-VN')}</div>
                                            <div className="text-xs text-slate-400">{new Date(t.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"><Eye size={15} /></button>
                                                {!t.suspicious && <button className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors" title="Đánh dấu nghi ngờ"><Flag size={15} /></button>}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs font-bold text-slate-400">
                    <span>Hiển thị {filtered.length}/{MOCK_TRANSACTIONS.length} giao dịch</span>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 transition-colors">Trước</button>
                        <button className="px-4 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 transition-colors">Tiếp</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCredits;
