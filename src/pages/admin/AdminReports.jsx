import { useState, useEffect } from 'react';
import {
    Flag, Eye, CheckCircle, XCircle, CircleNotch, Warning,
    Clock, VideoCamera, ChatCircleText, User, Users
} from '@phosphor-icons/react';
import { getAllReports, resolveReport } from '../../services/adminReportService';
import { toastError, toastSuccess } from "../../utils/toastUtils";

const AdminReports = () => {
    const [filter, setFilter] = useState('PENDING');
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [confirmModal, setConfirmModal] = useState(null);
    const [adminNote, setAdminNote] = useState('');

    useEffect(() => { fetchReports(); }, []);

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
        { Icon: Warning, label: 'Chờ xử lý', value: reports.filter(r => r.status === 'PENDING').length, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', weight: 'duotone' },
        { Icon: CheckCircle, label: 'Hoàn tiền Learner', value: reports.filter(r => r.status === 'RESOLVED').length, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', weight: 'fill' },
        { Icon: XCircle, label: 'Bác bỏ (Release)', value: reports.filter(r => r.status === 'REJECTED').length, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', weight: 'fill' },
    ];

    const filters = [
        { id: 'all', label: 'Tất cả' },
        { id: 'PENDING', label: 'Chờ xử lý' },
        { id: 'RESOLVED', label: 'Đã xử lý' },
        { id: 'REJECTED', label: 'Từ chối' },
    ];

    const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter);

    const handleActionClick = (reportId, action, reporterName, reportedName) => {
        setConfirmModal({ reportId, action, reporterName, reportedName });
        setAdminNote('');
    };

    const handleConfirmAction = async () => {
        if (!confirmModal) return;
        const { reportId, action } = confirmModal;
        setActionLoadingId(reportId);
        try {
            const finalNotes = adminNote.trim() || 'Admin action via Dashboard';
            const updatedReport = await resolveReport(reportId, { resolution: action, adminNotes: finalNotes });
            setReports(prev => prev.map(r => r.id === reportId ? updatedReport : r));
            toastSuccess('Xử lý thành công!');
        } catch (error) {
            toastError(error, 'Không thể thực hiện');
        } finally {
            setActionLoadingId(null);
            setConfirmModal(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <Flag size={22} weight="duotone" className="text-[#5A63F6]" />
                        Quản lý Báo cáo
                    </h1>
                    <p className="text-sm text-slate-400 font-medium mt-1">
                        Xem xét và giải quyết các báo cáo / khiếu nại (Session Reports)
                    </p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {statCards.map(s => (
                    <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5 flex items-center gap-4`}>
                        <s.Icon size={28} weight={s.weight} className={s.color} />
                        <div>
                            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                            <div className="text-xs font-semibold text-slate-500 mt-0.5">{s.label}</div>
                        </div>
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
                    <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
                        <CircleNotch size={28} className="animate-spin text-[#5A63F6]" />
                    </div>
                )}
                {!loading && filtered.length === 0 && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                        <Flag size={32} weight="duotone" className="text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-400 font-medium">Không có báo cáo nào trong danh mục này.</p>
                    </div>
                )}
                {!loading && filtered.map(report => (
                    <div key={report.id} className="bg-white border border-slate-200 border-l-4 border-l-rose-400 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h4 className="font-extrabold text-slate-900 text-base">Lý do: {report.reason}</h4>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold border bg-rose-100 text-rose-700 border-rose-200">
                                    Session Dispute
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium mb-2">
                                Bị tố cáo: <span className="font-bold text-slate-700">{report.reportedUserName || 'Vô danh'}</span>
                                <span className="mx-2">·</span>
                                Tố cáo bởi: <span className="font-bold text-slate-700">{report.reporterName || 'Vô danh'}</span>
                                <span className="mx-2">·</span>
                                Session ID: <span className="font-mono text-slate-400 text-[10px]">{report.sessionId}</span>
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

                            {/* Session Logs Section */}
                            <div className="mt-4 border-t border-slate-100 pt-3">
                                <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-2">
                                    <VideoCamera size={14} className="text-[#5A63F6]" /> Video Room Logs (Hệ thống)
                                </h5>
                                <div className="bg-blue-50 rounded-lg p-3 text-[11px] text-blue-900 grid grid-cols-2 gap-2 border border-blue-100">
                                    <div><strong>Start:</strong> {report.sessionStartedAt ? new Date(report.sessionStartedAt).toLocaleString('vi-VN') : 'N/A'}</div>
                                    <div><strong>End:</strong> {report.sessionEndedAt ? new Date(report.sessionEndedAt).toLocaleString('vi-VN') : 'N/A'}</div>
                                    <div><strong className="text-rose-600">Teacher Left:</strong> {report.teacherLeftAt ? new Date(report.teacherLeftAt).toLocaleString('vi-VN') : 'N/A'}</div>
                                    <div><strong className="text-emerald-600">Learner Left:</strong> {report.learnerLeftAt ? new Date(report.learnerLeftAt).toLocaleString('vi-VN') : 'N/A'}</div>
                                </div>
                            </div>

                            {/* Counter Evidence Section */}
                            {report.counterDescription && (
                                <div className="mt-3 border-t border-slate-100 pt-3">
                                    <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-2">
                                        <ChatCircleText size={14} className="text-amber-500" /> Bác bỏ từ Người bị tố cáo: {report.reportedUserName}
                                    </h5>
                                    <p className="text-xs text-slate-600 bg-amber-50 rounded-xl px-4 py-2 border border-amber-100 italic">
                                        "{report.counterDescription}"
                                    </p>
                                    <div className="mt-1 flex items-center gap-3">
                                        <span className="text-[10px] text-slate-400">
                                            Phản hồi lúc: {new Date(report.counterSubmittedAt).toLocaleString('vi-VN')}
                                        </span>
                                        {report.counterEvidenceUrl && (
                                            <a href={report.counterEvidenceUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1">
                                                <Eye size={12} /> Minh chứng phản hồi
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between sm:justify-between gap-2 shrink-0">
                            <span className="text-xs text-slate-400 font-medium">{new Date(report.createdAt).toLocaleDateString('vi-VN')}</span>
                            <div className="flex flex-col gap-1.5">
                                {report.status === 'PENDING' ? (
                                    <>
                                        <button
                                            onClick={() => handleActionClick(report.id, 'RESOLVED', report.reporterName, report.reportedUserName)}
                                            disabled={actionLoadingId === report.id}
                                            className="w-full px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1 shadow-sm disabled:opacity-50"
                                        >
                                            {actionLoadingId === report.id ? <CircleNotch size={12} className="animate-spin" /> : <CheckCircle size={12} weight="fill" />}
                                            XỬ THẮNG CHO HỌC VIÊN
                                        </button>
                                        <button
                                            onClick={() => handleActionClick(report.id, 'REJECTED', report.reporterName, report.reportedUserName)}
                                            disabled={actionLoadingId === report.id}
                                            className="w-full px-3 py-1.5 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                                        >
                                            {actionLoadingId === report.id ? <CircleNotch size={12} className="animate-spin" /> : <XCircle size={12} weight="fill" />}
                                            XỬ THẮNG CHO GIA SƯ
                                        </button>
                                    </>
                                ) : (
                                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${report.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                        {report.status === 'RESOLVED' ? <CheckCircle size={12} weight="fill" /> : <XCircle size={12} weight="fill" />}
                                        {report.status}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Confirmation Modal */}
            {confirmModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 border border-slate-100 overflow-hidden flex flex-col">
                        <div className={`p-6 border-b relative flex items-center gap-4 ${confirmModal.action === 'RESOLVED' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                            <button onClick={() => setConfirmModal(null)} className="absolute top-6 right-6 w-8 h-8 bg-white hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors shadow-sm">
                                <XCircle size={20} />
                            </button>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm shrink-0 ${confirmModal.action === 'RESOLVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                <Warning size={32} weight="fill" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-800">Xác nhận Phán quyết</h2>
                                <p className="text-slate-500 font-medium text-sm">Hành động này mang tính quyết định cuối cùng.</p>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="mb-8">
                                {confirmModal.action === 'RESOLVED' ? (
                                    <>
                                        <p className="text-lg font-bold text-slate-800 mb-4">Bạn đang chọn: <span className="text-emerald-600">HOÀN TIỀN CHO HỌC VIÊN</span></p>
                                        <ul className="space-y-3 text-slate-600 font-medium">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" weight="fill" /> 
                                                <span>Học viên <b>{confirmModal.reporterName}</b> sẽ nhận lại 100% Credits.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Warning size={20} className="text-rose-500 shrink-0 mt-0.5" weight="fill" /> 
                                                <span>Gia sư <b>{confirmModal.reportedName}</b> sẽ bị phạt <b>1 gậy (1 strike)</b> và trừ <b>5 điểm uy tín</b>.</span>
                                            </li>
                                        </ul>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-lg font-bold text-slate-800 mb-4">Bạn đang chọn: <span className="text-rose-600">XỬ THẮNG CHO GIA SƯ</span></p>
                                        <ul className="space-y-3 text-slate-600 font-medium">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" weight="fill" /> 
                                                <span>Gia sư <b>{confirmModal.reportedName}</b> sẽ nhận được toàn bộ Credits của buổi học.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Warning size={20} className="text-rose-500 shrink-0 mt-0.5" weight="fill" /> 
                                                <span>Học viên <b>{confirmModal.reporterName}</b> sẽ bị phạt tính thêm <b>1 gậy vi phạm báo cáo sai</b>.</span>
                                            </li>
                                        </ul>
                                    </>
                                )}
                            </div>

                            <div className="mb-8">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                                    Ghi chú của hệ thống (Tùy chọn)
                                </label>
                                <textarea
                                    value={adminNote}
                                    onChange={e => setAdminNote(e.target.value)}
                                    rows={2}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none transition-all"
                                    placeholder="Ví dụ: Đã đối chiếu logs và chat..."
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmModal(null)}
                                    className="flex-1 py-3.5 font-bold rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                                >
                                    Huỷ bỏ
                                </button>
                                <button
                                    onClick={handleConfirmAction}
                                    className={`flex-1 py-3.5 font-bold text-white rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:-translate-y-0.5 ${confirmModal.action === 'RESOLVED' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'}`}
                                >
                                    {confirmModal.action === 'RESOLVED' ? <CheckCircle size={18} weight="bold" /> : <XCircle size={18} weight="bold" />}
                                    Chốt phán quyết
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReports;
