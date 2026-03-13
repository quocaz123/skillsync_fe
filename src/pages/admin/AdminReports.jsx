import { useState } from 'react';
import { Eye, CheckCircle2, XCircle, Flag } from 'lucide-react';

const MOCK_REPORTS = [
    { id: 'r1', title: 'Vi phạm quy tắc', urgency: 'urgent', target: 'Hoa Trần (User #1087)', targetType: 'user', reporter: 'Ẩn danh', date: 'Hôm nay', status: 'pending', desc: 'Không tham gia buổi học sau khi đã xác nhận 2 lần liên tiếp. Gây lãng phí thời gian của người dạy.' },
    { id: 'r2', title: 'Nội dung không phù hợp', urgency: 'medium', target: 'Bài đăng cộng đồng (Post #234)', targetType: 'post', reporter: 'Thanh Hà', date: 'Hôm qua', status: 'pending', desc: 'Bài đăng chứa quảng cáo dịch vụ bên ngoài vi phạm điều khoản sử dụng của SkillSync.' },
    { id: 'r3', title: 'Giao dịch credits nghi ngờ', urgency: 'urgent', target: 'Tài khoản ẩn danh (User #992)', targetType: 'system', reporter: 'Hệ thống', date: '05/03', status: 'pending', desc: 'Giao dịch 500 credits lúc 3:14 SA, bất thường so với lịch sử. Có thể là khai thác lỗ hổng.' },
    { id: 'r4', title: 'Hành vi không chuyên nghiệp', urgency: 'medium', target: 'Mentor Hùng (User #445)', targetType: 'user', reporter: 'Minh Tú', date: '04/03', status: 'resolved', desc: 'Mentor liên tục hủy buổi học vào giờ chót, không có lý do hợp lý.' },
    { id: 'r5', title: 'Đánh giá giả mạo', urgency: 'medium', target: 'Trần Thị Bình (User #2)', targetType: 'user', reporter: 'Hệ thống', date: '03/03', status: 'ignored', desc: 'Phát hiện pattern đánh giá 5 sao đột biến từ nhiều tài khoản mới trong 1 giờ.' },
];

const urgencyConfig = {
    urgent: { border: 'border-l-red-500', icon: '🚨', badge: 'bg-red-100 text-red-700 border-red-200', label: 'Khẩn cấp' },
    medium: { border: 'border-l-amber-400', icon: '⚠️', badge: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Trung bình' },
};

const targetTypeIcon = { user: '👤', post: '📄', system: '🤖' };

const AdminReports = () => {
    const [filter, setFilter] = useState('pending');

    const statCards = [
        { label: 'Khẩn cấp', value: MOCK_REPORTS.filter(r => r.urgency === 'urgent' && r.status === 'pending').length, bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-600', icon: '🚨' },
        { label: 'Chờ xử lý', value: MOCK_REPORTS.filter(r => r.status === 'pending').length, bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600', icon: '⚠️' },
        { label: 'Đã xử lý', value: MOCK_REPORTS.filter(r => r.status === 'resolved').length, bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', icon: '✅' },
    ];

    const filters = [
        { id: 'all', label: 'Tất cả' },
        { id: 'pending', label: 'Chờ xử lý' },
        { id: 'resolved', label: 'Đã xử lý' },
        { id: 'ignored', label: 'Đã bỏ qua' },
    ];

    const filtered = filter === 'all' ? MOCK_REPORTS : MOCK_REPORTS.filter(r => r.status === filter);

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
            {/* Page Title */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <Flag size={22} className="text-[#5A63F6]" /> Xử lý Báo cáo
                    </h1>
                    <p className="text-sm text-slate-400 font-medium mt-1">Xem xét và giải quyết các khiếu nại từ người dùng và hệ thống</p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-4">
                {statCards.map(s => (
                    <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-6 text-center`}>
                        <div className="text-3xl mb-1">{s.icon}</div>
                        <div className={`text-3xl font-extrabold ${s.text}`}>{s.value}</div>
                        <div className={`text-sm font-semibold ${s.text} opacity-80 mt-0.5`}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-2 flex-wrap">
                {filters.map(f => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                            filter === f.id
                                ? 'bg-[#5A63F6] text-white shadow-md shadow-indigo-200'
                                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
                <span className="ml-auto text-xs text-slate-400 font-medium">{filtered.length} báo cáo</span>
            </div>

            {/* Report Cards */}
            <div className="space-y-3">
                {filtered.length === 0 && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 font-medium">
                        Không có báo cáo nào trong danh mục này.
                    </div>
                )}
                {filtered.map(report => {
                    const uc = urgencyConfig[report.urgency];
                    return (
                        <div key={report.id} className={`bg-white border border-slate-200 border-l-4 ${uc.border} rounded-2xl p-5 flex gap-4 shadow-sm hover:shadow-md transition-shadow`}>
                            <div className="text-2xl shrink-0 mt-0.5">{uc.icon}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h4 className="font-extrabold text-slate-900 text-base">{report.title}</h4>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${uc.badge}`}>{uc.label}</span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium mb-2">
                                    <span>{targetTypeIcon[report.targetType]} Đối tượng: <span className="font-bold text-slate-700">{report.target}</span></span>
                                    <span className="mx-2">·</span>
                                    <span>Báo cáo bởi: <span className="font-bold text-slate-700">{report.reporter}</span></span>
                                </p>
                                <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">{report.desc}</p>
                            </div>
                            <div className="flex flex-col items-end justify-between gap-2 shrink-0">
                                <span className="text-xs text-slate-400 font-medium">{report.date}</span>
                                <div className="flex flex-col gap-1.5">
                                    <button className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1">
                                        <Eye size={12} /> Chi tiết
                                    </button>
                                    {report.status === 'pending' && (
                                        <>
                                            <button className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-sm">
                                                <CheckCircle2 size={12} /> Xử lý
                                            </button>
                                            <button className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center gap-1">
                                                <XCircle size={12} /> Bỏ qua
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminReports;
