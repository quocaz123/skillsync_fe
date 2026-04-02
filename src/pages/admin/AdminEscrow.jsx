import { useState, useEffect } from 'react';
import { getEscrowSessions, getEscrowReport, refundLearner, releaseToMentor } from '../../services/adminEscrowService';
import { MagnifyingGlass, FunnelSimple, ArrowsDownUp, LockKey, WarningCircle, CheckCircle, XCircle } from '@phosphor-icons/react';
import { Loader2 } from 'lucide-react';

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

const AdminEscrow = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Dispute Modal States
    const [selectedSession, setSelectedSession] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [reportLoading, setReportLoading] = useState(false);

    useEffect(() => {
        loadEscrowSessions();
    }, []);

    const loadEscrowSessions = async () => {
        setLoading(true);
        try {
            const data = await getEscrowSessions();
            setSessions(data || []);
        } catch (error) {
            console.error('Failed to load escrow sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDispute = async (session) => {
        setSelectedSession(session);
        setAdminNotes('');
        setReportLoading(true);
        try {
            const report = await getEscrowReport(session.id);
            setSelectedReport(report);
        } catch (error) {
            console.error('Failed to load report for session:', error);
            setSelectedReport({ reason: 'UNKNOWN', description: 'Không tìm thấy chi tiết báo cáo.' });
        } finally {
            setReportLoading(false);
        }
    };

    const handleCloseDispute = () => {
        setSelectedSession(null);
        setSelectedReport(null);
        setAdminNotes('');
    };

    const handleRefundLearner = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn HOÀN TIỀN cho học viên? Mentor sẽ không nhận được credits này.')) return;
        setIsActionLoading(true);
        try {
            await refundLearner(selectedSession.id, adminNotes);
            alert('Đã hoàn tiền thành công!');
            handleCloseDispute();
            loadEscrowSessions();
        } catch (error) {
            console.error(error);
            alert('Lỗi khi hoàn tiền!');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleReleaseMentor = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn TRẢ TIỀN cho Mentor? Report sẽ bị từ chối.')) return;
        setIsActionLoading(true);
        try {
            await releaseToMentor(selectedSession.id, adminNotes);
            alert('Đã giải ngân cho Mentor thành công!');
            handleCloseDispute();
            loadEscrowSessions();
        } catch (error) {
            console.error(error);
            alert('Lỗi khi giải ngân!');
        } finally {
            setIsActionLoading(false);
        }
    };

    const filteredSessions = sessions.filter(session => {
        const matchesSearch = 
            session.skillName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.learnerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.teacherName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || session.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalEscrowAmount = sessions.filter(s => s.status !== 'CANCELED' && s.status !== 'COMPLETED').reduce((sum, s) => sum + (s.creditCost || 0), 0);
    const disputedCount = sessions.filter(s => s.status === 'DISPUTED').length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">Quản lý Tạm giữ tiền (Escrow)</h1>
                    <p className="text-sm text-slate-500 mt-1">Quản lý các khoản tín dụng đang được hệ thống tạm giữ</p>
                </div>
                <button
                    onClick={loadEscrowSessions}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm"
                >
                    <ArrowsDownUp size={16} /> Làm mới
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full mix-blend-multiply filter blur-[50px] opacity-60"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Tổng tiền ĐANG bị giữ (Credits)</p>
                            <h3 className="text-3xl font-black text-indigo-600">{totalEscrowAmount.toLocaleString()}</h3>
                        </div>
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <LockKey size={24} weight="duotone" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Phiên đang lấy dữ liệu</p>
                            <h3 className="text-3xl font-black text-slate-800">{sessions.length}</h3>
                        </div>
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                            <LockKey size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Cảnh báo (Disputed)</p>
                            <h3 className="text-3xl font-black text-rose-600">{disputedCount}</h3>
                        </div>
                        <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                            <LockKey size={24} weight="fill" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm khóa học, học viên, mentor..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <FunnelSimple className="text-slate-400" size={20} />
                        <select
                            className="w-full sm:w-auto border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
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
                        <thead className="text-xs uppercase bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Mã / Ngày tạo</th>
                                <th className="px-6 py-4">Học viên (Trả)</th>
                                <th className="px-6 py-4">Mentor (Nhận)</th>
                                <th className="px-6 py-4">Khoản giữ (Credits)</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-500" />
                                        <p>Đang tải dữ liệu Escrow...</p>
                                    </td>
                                </tr>
                            ) : filteredSessions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                            <LockKey className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p className="text-base font-medium text-slate-600 mb-1">Không có khoản giữ nào</p>
                                        <p className="text-sm">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredSessions.map((session) => (
                                    <tr key={session.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-800 break-words line-clamp-1">{session.skillName || 'Session'}</div>
                                            <div className="text-xs text-slate-400 mt-0.5">
                                                {new Date(session.createdAt).toLocaleString('vi-VN')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold shrink-0">
                                                    {session.learnerName?.charAt(0)}
                                                </div>
                                                <div className="font-medium text-slate-700">{session.learnerName}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold shrink-0">
                                                    {session.teacherName?.charAt(0)}
                                                </div>
                                                <div className="font-medium text-slate-700">{session.teacherName}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-black text-indigo-600 text-lg flex items-center gap-1.5">
                                                <span>{session.creditCost}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md border ${STATUS_COLORS[session.status] || STATUS_COLORS.SCHEDULED}`}>
                                                {STATUS_LABELS[session.status] || session.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {session.status === 'DISPUTED' && (
                                                <button
                                                    onClick={() => handleOpenDispute(session)}
                                                    className="px-4 py-2 bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors rounded-lg font-semibold text-xs flex items-center gap-2"
                                                >
                                                    <WarningCircle size={16} weight="fill" />
                                                    Phán xử
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Dispute Resolution Modal */}
            {selectedSession && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <WarningCircle className="text-rose-500" size={24} weight="fill" />
                                Phán xử Tranh chấp
                            </h3>
                            <button onClick={handleCloseDispute} className="text-slate-400 hover:text-slate-600">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                                    <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">Học viên (Nguồn tiền)</p>
                                    <p className="font-bold text-slate-800 text-lg">{selectedSession.learnerName}</p>
                                </div>
                                <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4">
                                    <p className="text-xs font-semibold text-purple-500 uppercase tracking-wider mb-1">Mentor (Đích đến)</p>
                                    <p className="font-bold text-slate-800 text-lg">{selectedSession.teacherName}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                                <h4 className="font-semibold text-slate-800 mb-4">Chi tiết Báo cáo</h4>
                                {reportLoading ? (
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Loader2 className="w-4 h-4 animate-spin" /> Đang tải dữ liệu report...
                                    </div>
                                ) : selectedReport ? (
                                    <div className="space-y-3">
                                        <p className="text-sm">
                                            <span className="text-slate-500 w-24 inline-block">Mã lý do:</span> 
                                            <span className="font-mono bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-xs font-bold">{selectedReport.reason}</span>
                                        </p>
                                        <p className="text-sm">
                                            <span className="text-slate-500 w-24 inline-block align-top">Mô tả:</span> 
                                            <span className="text-slate-800 font-medium whitespace-pre-wrap flex-1">{selectedReport.description}</span>
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 italic">Không tìm thấy báo cáo.</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Ghi chú của Admin (Lý do xử lý):</label>
                                <textarea
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                    rows="3"
                                    placeholder="Nhập lý do tại sao bạn lại chọn hoàn tiền hoặc giải ngân..."
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
                            <button
                                onClick={handleRefundLearner}
                                disabled={isActionLoading || reportLoading}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold flex items-center gap-2 rounded-xl transition-colors"
                            >
                                {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle size={18} weight="bold" />}
                                Báo cáo ĐÚNG - Hoàn tiền Học viên
                            </button>
                            <button
                                onClick={handleReleaseMentor}
                                disabled={isActionLoading || reportLoading}
                                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold flex items-center gap-2 rounded-xl transition-colors"
                            >
                                {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle size={18} weight="bold" />}
                                Báo cáo SAI - Trả tiền Mentor
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEscrow;
