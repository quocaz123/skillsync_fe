import { useState, useEffect } from 'react';
import { getEscrowSessions } from '../../services/adminEscrowService';
import { getAllReports, resolveReport } from '../../services/adminReportService';
import { toastError, toastSuccess } from "../../utils/toastUtils";
import { 
    MagnifyingGlass, FunnelSimple, ArrowsDownUp, LockKey, WarningCircle, 
    CircleNotch, Flag, Eye, CheckCircle, XCircle, Warning, 
    VideoCamera, ChatCircleText, ShieldCheck, CurrencyCircleDollar,
    ListChecks
} from '@phosphor-icons/react';

const STATUS_COLORS = {
    SCHEDULED: 'bg-blue-100 text-blue-700 border-blue-200',
    IN_PROGRESS: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    COMPLETED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    DISPUTED: 'bg-rose-100 text-rose-700 border-rose-200',
    CANCELED: 'bg-slate-100 text-slate-700 border-slate-200',
};

const STATUS_LABELS = {
    SCHEDULED: 'Đã lên lịch',
    IN_PROGRESS: 'Đang diễn ra',
    COMPLETED: 'Đã hoàn thành',
    DISPUTED: 'Tranh chấp',
    CANCELED: 'Đã hủy/Hoàn tiền',
};

const AdminFinancialModeration = () => {
    // Shared State
    const [activeTab, setActiveTab] = useState('ESCROW'); // 'ESCROW' | 'REPORTS'

    // Escrow State
    const [sessions, setSessions] = useState([]);
    const [loadingEscrow, setLoadingEscrow] = useState(true);
    const [escrowSearch, setEscrowSearch] = useState('');
    const [escrowFilter, setEscrowFilter] = useState('ALL');

    // Reports State
    const [reports, setReports] = useState([]);
    const [loadingReports, setLoadingReports] = useState(true);
    const [reportFilter, setReportFilter] = useState('PENDING'); // 'all', 'PENDING', 'RESOLVED', 'REJECTED'
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [confirmModal, setConfirmModal] = useState(null);
    const [adminNote, setAdminNote] = useState('');
    const [focusedSessionId, setFocusedSessionId] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        loadEscrowSessions();
        loadReports();
    };

    const loadEscrowSessions = async () => {
        setLoadingEscrow(true);
        try {
            const data = await getEscrowSessions();
            setSessions(data || []);
        } catch (error) {
            console.error('Failed to load escrow sessions:', error);
        } finally {
            setLoadingEscrow(false);
        }
    };

    const loadReports = async () => {
        setLoadingReports(true);
        try {
            const data = await getAllReports();
            setReports(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Lỗi tải danh sách reports:', err);
        } finally {
            setLoadingReports(false);
        }
    };

    // Derived State
    const totalEscrowAmount = sessions.filter(s => s.status !== 'CANCELED' && s.status !== 'COMPLETED').reduce((sum, s) => sum + (s.creditCost || 0), 0);
    const disputedCount = sessions.filter(s => s.status === 'DISPUTED').length;
    const pendingReportsCount = reports.filter(r => r.status === 'PENDING').length;
    
    // Filtered Escrow
    const filteredSessions = sessions.filter(session => {
        const matchesSearch = 
            session.skillName?.toLowerCase().includes(escrowSearch.toLowerCase()) ||
            session.learnerName?.toLowerCase().includes(escrowSearch.toLowerCase()) ||
            session.teacherName?.toLowerCase().includes(escrowSearch.toLowerCase());
        const matchesStatus = escrowFilter === 'ALL' || session.status === escrowFilter;
        return matchesSearch && matchesStatus;
    });

    // Filtered Reports
    const filteredReports = reports.filter(r => {
        const matchesStatus = reportFilter === 'all' || r.status === reportFilter;
        const matchesFocus = focusedSessionId ? r.sessionId === focusedSessionId : true;
        return matchesStatus && matchesFocus;
    });

    // Actions
    const handleViewReport = (sessionId) => {
        setActiveTab('REPORTS');
        setReportFilter('all');
        setFocusedSessionId(sessionId);
    };

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
            // Reload escrow sessions as their statuses might have changed to CANCELED or COMPLETED
            loadEscrowSessions();
        } catch (error) {
            toastError(error, 'Không thể thực hiện');
        } finally {
            setActionLoadingId(null);
            setConfirmModal(null);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                        <ShieldCheck size={28} weight="duotone" className="text-indigo-600" />
                        Quản lý Tài chính & Tranh chấp
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Giám sát khoản giữ (Escrow) và giải quyết các báo cáo buổi học</p>
                </div>
                <button
                    onClick={loadData}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
                >
                    <ArrowsDownUp size={16} /> Làm mới toàn bộ
                </button>
            </div>

            {/* Unified Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 rounded-full mix-blend-multiply filter blur-[40px] opacity-60"></div>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                            <LockKey size={24} weight="duotone" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Tiền đang giữ</p>
                            <h3 className="text-2xl font-black text-indigo-700">{totalEscrowAmount.toLocaleString()} CR</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 shrink-0">
                        <ListChecks size={24} weight="duotone" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Sessions Escrow</p>
                        <h3 className="text-2xl font-black text-slate-800">{sessions.length}</h3>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 shrink-0">
                        <WarningCircle size={24} weight="fill" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Sessions Tranh chấp</p>
                        <h3 className="text-2xl font-black text-rose-600">{disputedCount}</h3>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                        <Flag size={24} weight="duotone" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Báo cáo chờ xử lý</p>
                        <h3 className="text-2xl font-black text-amber-600">{pendingReportsCount}</h3>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
                <button
                    onClick={() => { setActiveTab('ESCROW'); setFocusedSessionId(''); }}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
                        activeTab === 'ESCROW' 
                            ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-xl' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-xl'
                    }`}
                >
                    <CurrencyCircleDollar size={18} weight={activeTab === 'ESCROW' ? 'fill' : 'regular'} />
                    Danh sách Escrow
                </button>
                <button
                    onClick={() => setActiveTab('REPORTS')}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
                        activeTab === 'REPORTS' 
                            ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-xl' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-xl'
                    }`}
                >
                    <Flag size={18} weight={activeTab === 'REPORTS' ? 'fill' : 'regular'} />
                    Tranh chấp & Báo cáo
                    {pendingReportsCount > 0 && (
                        <span className="ml-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            {pendingReportsCount}
                        </span>
                    )}
                </button>
            </div>

            {/* TAB CONTENT: ESCROW */}
            {activeTab === 'ESCROW' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in">
                    <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full sm:w-96">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm khóa học, học viên, mentor..."
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                                value={escrowSearch}
                                onChange={(e) => setEscrowSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <FunnelSimple className="text-slate-400" size={20} />
                            <select
                                className="w-full sm:w-auto border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                                value={escrowFilter}
                                onChange={(e) => setEscrowFilter(e.target.value)}
                            >
                                <option value="ALL">Tất cả trạng thái</option>
                                {Object.keys(STATUS_LABELS).map(key => (
                                    <option key={key} value={key}>{STATUS_LABELS[key]}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="text-[11px] uppercase tracking-wider bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Mã / Ngày tạo</th>
                                    <th className="px-6 py-4">Học viên (Trả)</th>
                                    <th className="px-6 py-4">Mentor (Nhận)</th>
                                    <th className="px-6 py-4">Khoản giữ</th>
                                    <th className="px-6 py-4">Trạng thái</th>
                                    <th className="px-6 py-4 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loadingEscrow ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                            <CircleNotch className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-500" />
                                            <p className="font-medium">Đang tải dữ liệu Escrow...</p>
                                        </td>
                                    </tr>
                                ) : filteredSessions.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-16 text-center text-slate-500">
                                            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                <LockKey className="w-8 h-8 text-slate-400" weight="duotone" />
                                            </div>
                                            <p className="text-base font-bold text-slate-700 mb-1">Không có khoản giữ nào</p>
                                            <p className="text-sm">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSessions.map((session) => (
                                        <tr key={session.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800 break-words line-clamp-1">{session.skillName || 'Session'}</div>
                                                <div className="text-xs text-slate-400 font-mono mt-1">
                                                    {new Date(session.createdAt).toLocaleString('vi-VN')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-black shrink-0">
                                                        {session.learnerName?.charAt(0)}
                                                    </div>
                                                    <div className="font-medium text-slate-700">{session.learnerName}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-black shrink-0">
                                                        {session.teacherName?.charAt(0)}
                                                    </div>
                                                    <div className="font-medium text-slate-700">{session.teacherName}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-black text-indigo-600 text-lg flex items-center gap-1.5">
                                                    <span>{session.creditCost}</span> <span className="text-xs font-bold text-indigo-400">CR</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border ${STATUS_COLORS[session.status] || STATUS_COLORS.SCHEDULED}`}>
                                                    {STATUS_LABELS[session.status] || session.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {session.status === 'DISPUTED' ? (
                                                    <button
                                                        onClick={() => handleViewReport(session.id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-colors rounded-lg font-bold text-xs border border-rose-100"
                                                    >
                                                        <WarningCircle size={14} weight="fill" />
                                                        Xem Báo cáo
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-slate-400">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: REPORTS */}
            {activeTab === 'REPORTS' && (
                <div className="space-y-4 animate-in fade-in">
                    {/* Filters */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-2 flex-wrap">
                            {[
                                { id: 'all', label: 'Tất cả' },
                                { id: 'PENDING', label: 'Chờ xử lý' },
                                { id: 'RESOLVED', label: 'Đã xử lý (Learner Win)' },
                                { id: 'REJECTED', label: 'Từ chối (Mentor Win)' },
                            ].map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setReportFilter(f.id)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        reportFilter === f.id
                                            ? 'bg-slate-800 text-white shadow-md shadow-slate-200'
                                            : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                        {focusedSessionId && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                    <MagnifyingGlass size={14} /> Đang lọc theo Session: <span className="font-mono">{focusedSessionId.substring(0,8)}...</span>
                                </span>
                                <button 
                                    onClick={() => setFocusedSessionId('')}
                                    className="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
                                >
                                    Xóa lọc
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Report List */}
                    <div className="space-y-4">
                        {loadingReports ? (
                            <div className="flex items-center justify-center py-20 text-slate-400 gap-2 bg-white rounded-2xl border border-slate-200">
                                <CircleNotch size={28} className="animate-spin text-indigo-500" />
                                <span className="font-medium text-sm">Đang tải báo cáo...</span>
                            </div>
                        ) : filteredReports.length === 0 ? (
                            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
                                <Flag size={40} weight="duotone" className="text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-700 font-bold text-lg mb-1">Không có báo cáo nào</p>
                                <p className="text-slate-400 text-sm">Chưa có báo cáo nào phù hợp với bộ lọc hiện tại.</p>
                            </div>
                        ) : (
                            filteredReports.map(report => (
                                <div key={report.id} className="bg-white border border-slate-200 border-l-4 border-l-amber-400 rounded-2xl p-5 flex flex-col md:flex-row gap-5 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <h4 className="font-black text-slate-900 text-lg uppercase">Lý do: {report.reason}</h4>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black border bg-rose-50 text-rose-600 border-rose-200 uppercase tracking-wider">
                                                Session Dispute
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-3 bg-slate-50 w-fit px-3 py-1.5 rounded-lg border border-slate-100">
                                            <span>Tố cáo bởi: <strong className="text-slate-800">{report.reporterName || 'Vô danh'}</strong></span>
                                            <span className="text-slate-300">|</span>
                                            <span>Bị tố cáo: <strong className="text-slate-800">{report.reportedUserName || 'Vô danh'}</strong></span>
                                            <span className="text-slate-300">|</span>
                                            <span title={report.sessionId}>Session ID: <strong className="font-mono text-slate-400">{report.sessionId?.substring(0,8)}...</strong></span>
                                        </div>
                                        
                                        <div className="text-sm text-slate-700 bg-white rounded-xl p-4 border border-slate-200 shadow-sm mb-3">
                                            <p className="font-medium leading-relaxed">"{report.description}"</p>
                                        </div>

                                        {report.evidenceUrl && (
                                            <div className="mb-4">
                                                <a href={report.evidenceUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                                                    <Eye size={16} weight="duotone" /> Xem minh chứng (Hình ảnh/Video)
                                                </a>
                                            </div>
                                        )}

                                        {/* Counter Evidence Section */}
                                        {report.counterDescription && (
                                            <div className="mb-4 border-l-2 border-amber-300 pl-4 py-1">
                                                <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                                                    <ChatCircleText size={16} className="text-amber-500" weight="duotone" /> 
                                                    Phản hồi từ Người bị tố cáo ({report.reportedUserName})
                                                </h5>
                                                <p className="text-sm text-slate-600 italic bg-amber-50/50 p-3 rounded-lg border border-amber-100/50">
                                                    "{report.counterDescription}"
                                                </p>
                                                {report.counterEvidenceUrl && (
                                                    <a href={report.counterEvidenceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline inline-flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg transition-colors">
                                                        <Eye size={16} weight="duotone" /> Xem minh chứng phản hồi
                                                    </a>
                                                )}
                                            </div>
                                        )}

                                        {/* Session Logs Section */}
                                        <div className="mt-4 bg-slate-800 rounded-xl p-4 text-slate-200 border border-slate-700">
                                            <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                                                <VideoCamera size={16} weight="duotone" /> System Video Logs
                                            </h5>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs font-mono">
                                                <div className="flex justify-between border-b border-slate-700 pb-1">
                                                    <span className="text-slate-400">Start:</span> 
                                                    <span>{report.sessionStartedAt ? new Date(report.sessionStartedAt).toLocaleString('vi-VN') : '—'}</span>
                                                </div>
                                                <div className="flex justify-between border-b border-slate-700 pb-1">
                                                    <span className="text-slate-400">End:</span> 
                                                    <span>{report.sessionEndedAt ? new Date(report.sessionEndedAt).toLocaleString('vi-VN') : '—'}</span>
                                                </div>
                                                <div className="flex justify-between pt-1">
                                                    <span className="text-rose-400 font-bold">Teacher Left:</span> 
                                                    <span className="text-rose-100">{report.teacherLeftAt ? new Date(report.teacherLeftAt).toLocaleString('vi-VN') : '—'}</span>
                                                </div>
                                                <div className="flex justify-between pt-1">
                                                    <span className="text-emerald-400 font-bold">Learner Left:</span> 
                                                    <span className="text-emerald-100">{report.learnerLeftAt ? new Date(report.learnerLeftAt).toLocaleString('vi-VN') : '—'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {report.adminNotes && (
                                            <div className="mt-4 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg px-4 py-3 border border-slate-200">
                                                <strong className="text-slate-800 uppercase tracking-wider mr-2">Admin Note:</strong> {report.adminNotes}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Column */}
                                    <div className="flex flex-col items-start md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-5 shrink-0 w-full md:w-56">
                                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-4 md:mb-0">
                                            Ngày tạo: {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                        
                                        <div className="flex flex-col gap-2 w-full">
                                            {report.status === 'PENDING' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleActionClick(report.id, 'RESOLVED', report.reporterName, report.reportedUserName)}
                                                        disabled={actionLoadingId === report.id}
                                                        className="w-full px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/20 disabled:opacity-50 hover:-translate-y-0.5"
                                                    >
                                                        {actionLoadingId === report.id ? <CircleNotch size={16} className="animate-spin" /> : <CheckCircle size={16} weight="fill" />}
                                                        Hoàn tiền Học viên
                                                    </button>
                                                    <button
                                                        onClick={() => handleActionClick(report.id, 'REJECTED', report.reporterName, report.reportedUserName)}
                                                        disabled={actionLoadingId === report.id}
                                                        className="w-full px-4 py-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                                                    >
                                                        {actionLoadingId === report.id ? <CircleNotch size={16} className="animate-spin" /> : <XCircle size={16} weight="fill" />}
                                                        Xử thắng Gia sư
                                                    </button>
                                                </>
                                            ) : (
                                                <div className={`w-full px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border ${report.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                                                    {report.status === 'RESOLVED' ? <CheckCircle size={16} weight="fill" /> : <XCircle size={16} weight="fill" />}
                                                    {report.status === 'RESOLVED' ? 'Đã hoàn tiền' : 'Gia sư nhận tiền'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

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
                                                <span>Học viên <b className="text-slate-800">{confirmModal.reporterName}</b> sẽ nhận lại 100% Credits.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Warning size={20} className="text-rose-500 shrink-0 mt-0.5" weight="fill" /> 
                                                <span>Gia sư <b className="text-slate-800">{confirmModal.reportedName}</b> sẽ bị ghi nhận vi phạm vào hệ thống.</span>
                                            </li>
                                        </ul>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-lg font-bold text-slate-800 mb-4">Bạn đang chọn: <span className="text-rose-600">XỬ THẮNG CHO GIA SƯ</span></p>
                                        <ul className="space-y-3 text-slate-600 font-medium">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" weight="fill" /> 
                                                <span>Gia sư <b className="text-slate-800">{confirmModal.reportedName}</b> sẽ nhận được toàn bộ Credits của buổi học.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Warning size={20} className="text-rose-500 shrink-0 mt-0.5" weight="fill" /> 
                                                <span>Học viên <b className="text-slate-800">{confirmModal.reporterName}</b> sẽ bị phạt tính thêm <b>1 gậy vi phạm báo cáo sai</b>.</span>
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
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none transition-all font-medium"
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

export default AdminFinancialModeration;
