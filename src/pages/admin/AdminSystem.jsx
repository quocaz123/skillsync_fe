import { useState, useEffect } from 'react';
import { Database, CircleNotch, Warning, ArrowsClockwise, HardDrives, EnvelopeSimple, PaperPlaneRight } from '@phosphor-icons/react';
import { getSystemLogs } from '../../services/adminLogService';
import { getDlqMessageCount, retryAllDlqMessages } from '../../services/adminDlqService';

const levelConfig = {
    INFO: { dot: 'bg-blue-400', text: 'text-slate-600', bg: 'bg-slate-50/50' },
    WARNING: { dot: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-50/40' },
    ERROR: { dot: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50/40' },
};

const AdminSystem = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // DQL State
    const [dlqCount, setDlqCount] = useState(0);
    const [loadingDlq, setLoadingDlq] = useState(false);
    const [retrying, setRetrying] = useState(false);
    const [dlqMessage, setDlqMessage] = useState(null);

    const fetchLogs = async (p = 0) => {
        setLoading(true);
        setError(null);
        try {
            const res = await getSystemLogs(p, 50);
            if (res && res.content) {
                setLogs(res.content);
                setTotalPages(res.totalPages);
            }
        } catch (err) {
            setError('Lỗi khi tải dữ liệu log từ máy chủ.');
        } finally {
            setLoading(false);
        }
    };

    const fetchDlqCount = async () => {
        setLoadingDlq(true);
        setDlqMessage(null);
        try {
            const res = await getDlqMessageCount();
            if (res) setDlqCount(res.count || 0);
        } catch (err) {
            console.error("Lỗi khi tải DLQ count", err);
        } finally {
            setLoadingDlq(false);
        }
    };

    useEffect(() => {
        fetchLogs(page);
    }, [page]);

    useEffect(() => {
        fetchDlqCount();
    }, []);

    const handleRefresh = () => {
        fetchDlqCount();
        if (page === 0) fetchLogs(0);
        else setPage(0);
    };

    const handleRetryDlq = async () => {
        if (dlqCount === 0) return;
        setRetrying(true);
        setDlqMessage(null);
        try {
            const res = await retryAllDlqMessages();
            setDlqMessage(`Thành công: Đã gửi lại ${res?.retried || 0} email bị lỗi.`);
            setDlqCount(0);
        } catch (err) {
            setDlqMessage('Lỗi: Không thể gửi lại email do sự cố kết nối.');
        } finally {
            setRetrying(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6 pb-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <HardDrives size={22} weight="duotone" className="text-slate-600" /> Nhật ký Hoạt động (Activity Logs)
                    </h1>
                    <p className="text-sm text-slate-400 font-medium mt-1">Theo dõi tương tác và sự kiện trên nền tảng theo thời gian thực</p>
                </div>
                <button onClick={handleRefresh} disabled={loading || retrying}
                    className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold text-sm transition-colors disabled:opacity-50">
                    <ArrowsClockwise size={14} className={loading ? 'animate-spin' : ''} weight="bold" /> Làm mới
                </button>
            </div>

            {/* DLQ Recovery Card */}
            <div className="bg-white border border-rose-200 rounded-[2rem] shadow-sm overflow-hidden p-6 relative">
                <div className="absolute top-0 left-0 w-2 h-full bg-rose-500"></div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pl-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                            <EnvelopeSimple size={28} weight="duotone" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Khôi phục Email lỗi (DLQ)</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                {loadingDlq ? 'Đang kiểm tra...' : 
                                    (dlqCount > 0 
                                        ? `Hệ thống ghi nhận có ${dlqCount} email gửi thất bại đang nằm trong bộ nhớ tạm.`
                                        : 'Hiện tại hệ thống không có email nào bị kẹt lại.')}
                            </p>
                            {dlqMessage && (
                                <p className={`text-sm mt-2 font-medium ${dlqMessage.startsWith('Lỗi') ? 'text-rose-600' : 'text-emerald-600'}`}>
                                    {dlqMessage}
                                </p>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={handleRetryDlq} 
                        disabled={dlqCount === 0 || retrying || loadingDlq}
                        className={`shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${dlqCount > 0 && !retrying ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                    >
                        {retrying ? (
                            <><CircleNotch size={20} className="animate-spin" /> Đang xử lý...</>
                        ) : (
                            <><PaperPlaneRight size={20} weight="fill" /> Gửi lại toàn bộ ({dlqCount})</>
                        )}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4 flex items-center gap-3">
                    <Warning size={20} weight="duotone" className="text-rose-500 shrink-0" />
                    <p className="text-sm text-rose-700 font-medium">{error}</p>
                </div>
            )}

            {/* Activity Log */}
            <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
                    <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
                        <Database size={18} weight="duotone" className="text-slate-500" /> Toàn bộ sự kiện
                    </h3>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                            <button disabled={page === 0} onClick={() => setPage(page - 1)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50 transition-colors">
                                Trở lại
                            </button>
                            <span className="px-2 font-medium text-slate-400">Trang {page + 1} / {totalPages}</span>
                            <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50 transition-colors">
                                Tiếp theo
                            </button>
                        </div>
                    )}
                </div>

                <div className="divide-y divide-slate-50 flex-1">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <CircleNotch size={28} className="animate-spin text-[#5A63F6]" />
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <Database size={32} weight="duotone" className="mb-2 text-slate-300" />
                            <p className="text-sm font-medium">Chưa có nhật ký nào được ghi lại</p>
                        </div>
                    ) : (
                        logs.map(log => {
                            const lc = levelConfig[log.level] || levelConfig.INFO;
                            return (
                                <div key={log.id} className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-6 py-4 hover:bg-slate-50 transition-colors ${lc.bg}`}>
                                    <div className="flex items-center gap-3 w-40 shrink-0">
                                        <div className={`w-2 h-2 rounded-full ${lc.dot} shrink-0`} />
                                        <span className="text-xs text-slate-400 font-mono">
                                            {new Date(log.createdAt).toLocaleString('vi-VN')}
                                        </span>
                                    </div>
                                    <div className={`text-sm font-bold flex-1 ${lc.text}`}>
                                        {log.action}
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0 sm:w-64 justify-between sm:justify-end">
                                        <div className="text-xs font-semibold text-slate-500 truncate" title={log.userEmail}>
                                            {log.userName || log.userEmail || 'Hệ thống'}
                                        </div>
                                        <span className="text-xs font-mono font-medium text-slate-400 w-24 text-right">
                                            {log.ipAddress || '—'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminSystem;
