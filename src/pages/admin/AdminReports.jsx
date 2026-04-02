import { useState, useEffect } from 'react';
import { Eye, CheckCircle2, XCircle, Flag, Loader2 } from 'lucide-react';
import { getAllReports, resolveReport } from '../../services/adminReportService';

const urgencyConfig = {
    urgent: { border: 'border-l-red-500', icon: '🚨', badge: 'bg-red-100 text-red-700 border-red-200', label: 'Khẩn cấp' },
    medium: { border: 'border-l-amber-400', icon: '⚠️', badge: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Trung bình' },
};

const targetTypeIcon = { user: '👤', post: '📄', system: '🤖' };

const AdminReports = () => {
    const [filter, setFilter] = useState('PENDING');
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const data = await getAllReports();
            setReports(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Lỗi tải danh sách reports:', err);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Chờ xử lý', value: reports.filter(r => r.status === 'PENDING').length, bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600', icon: '⚠️' },
        { label: 'Đã xử lý (Refund Learner)', value: reports.filter(r => r.status === 'RESOLVED').length, bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', icon: '✅' },
        { label: 'Từ chối (Release Mentor)', value: reports.filter(r => r.status === 'REJECTED').length, bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-600', icon: '❌' },
    ];

    const filters = [
        { id: 'all', label: 'Tất cả' },
        { id: 'PENDING', label: 'Chờ xử lý' },
        { id: 'RESOLVED', label: 'Đã xử lý' },
        { id: 'REJECTED', label: 'Từ chối' },
    ];

    const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter);

    const handleAction = async (reportId, action) => {
        if (!window.confirm('Xác nhận xử lý báo cáo này?')) return;
        
        setActionLoadingId(reportId);
        try {
            const adminNotes = window.prompt("Nhập ghi chú xử lý (Tùy chọn):") || "Admin action via Dashboard";
            const updatedReport = await resolveReport(reportId, { resolution: action, adminNotes });
            setReports(prev => prev.map(r => r.id === reportId ? updatedReport : r));
            alert('Xử lý thành công!');
        } catch (error) {
            alert('Lỗi xử lý: ' + (error.response?.data?.message || 'Không thể thực hiện'));
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6 pb-4">
            {/* Page Title */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <Flag size={22} className="text-[#5A63F6]" /> Quản lý Báo cáo
                    </h1>
                    <p className="text-sm text-slate-400 font-medium mt-1">Xem xét và giải quyết các báo cáo / khiếu nại (Session Reports)</p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
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
                {loading && (
                    <div className="flex items-center justify-center py-20 text-slate-400">
                        <Loader2 className="animate-spin w-8 h-8 text-[#5A63F6]" />
                    </div>
                )}
                {!loading && filtered.length === 0 && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 font-medium">
                        Không có báo cáo nào trong danh mục này.
                    </div>
                )}
                {!loading && filtered.length > 0 && filtered.map(report => {
                    const uc = urgencyConfig['urgent']; // Force urgent style for simplicity
                    return (
                        <div key={report.id} className={`bg-white border border-slate-200 border-l-4 ${uc.border} rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 shadow-sm hover:shadow-md transition-shadow`}>
                            <div className="text-2xl shrink-0 mt-0.5">{uc.icon}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h4 className="font-extrabold text-slate-900 text-base">Lý do: {report.reason}</h4>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${uc.badge}`}>Session Dispute</span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium mb-2">
                                    <span>{targetTypeIcon.user} Bị tố cáo: <span className="font-bold text-slate-700">{report.reportedUserName || 'Vô danh'}</span></span>
                                    <span className="mx-2">·</span>
                                    <span>Tố cáo bởi: <span className="font-bold text-slate-700">{report.reporterName || 'Vô danh'}</span></span>
                                    <span className="mx-2">·</span>
                                    <span>Session ID: <span className="font-mono text-slate-400 text-[10px]">{report.sessionId}</span></span>
                                </p>
                                <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">{report.description}</p>
                                {report.evidenceUrl && (
                                    <div className="mt-2">
                                        <a href={report.evidenceUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1">
                                            <Eye size={14} /> Xem minh chứng
                                        </a>
                                    </div>
                                )}
                                {report.adminNotes && (
                                    <div className="mt-3 text-xs bg-slate-800 text-slate-200 rounded-lg px-3 py-2">
                                        <strong>Ghi chú Admin:</strong> {report.adminNotes}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between sm:justify-between gap-2 shrink-0">
                                <span className="text-xs text-slate-400 font-medium">{new Date(report.createdAt).toLocaleDateString()}</span>
                                <div className="flex flex-col gap-1.5">
                                    {report.status === 'PENDING' ? (
                                        <>
                                            <button 
                                                onClick={() => handleAction(report.id, 'RESOLVED')} 
                                                disabled={actionLoadingId === report.id}
                                                className="w-full px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-sm disabled:opacity-50"
                                            >
                                                {actionLoadingId === report.id ? <Loader2 size={12} className="animate-spin"/> : <CheckCircle2 size={12} />} Hoàn tiền (RESOLVED)
                                            </button>
                                            <button 
                                                onClick={() => handleAction(report.id, 'REJECTED')} 
                                                disabled={actionLoadingId === report.id}
                                                className="w-full px-3 py-1.5 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                                            >
                                                {actionLoadingId === report.id ? <Loader2 size={12} className="animate-spin"/> : <XCircle size={12} />} Bác bỏ (REJECTED)
                                            </button>
                                        </>
                                    ) : (
                                        <div className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${report.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                            Trạng thái: {report.status}
                                        </div>
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
