import { useState, useMemo, useRef } from 'react';
import { BookOpen, Eye, CheckCircle2, XCircle, Zap } from 'lucide-react';
import PathPreviewModal from '../user/learning-path-management/PathPreviewModal';

const INITIAL_PATHS = [
    { id: 'p1', title: 'Trở thành UI/UX Designer', mentor: 'Phạm Thị Dung', created: '2026-03-01', modules: 8, price: 400, status: 'active', category: 'Design', level: 'Beginner' },
    { id: 'p2', title: 'Fullstack Next.js Masterclass', mentor: 'Trần Thị Bình', created: '2026-03-10', modules: 12, price: 800, status: 'pending', category: 'Lập trình', level: 'Intermediate' },
    { id: 'p3', title: 'Kỹ năng mềm cho IT', mentor: 'Trần Thị Bình', created: '2026-02-15', modules: 5, price: 200, status: 'active', category: 'Kỹ năng', level: 'Beginner' },
    { id: 'p4', title: 'Hack não tiếng Anh', mentor: 'Trần Thị Bình', created: '2026-03-12', modules: 10, price: 300, status: 'rejected', category: 'Ngôn ngữ', level: 'Intermediate', rejectionReason: 'Nội dung chưa đạt chuẩn đánh giá ban đầu.' },
    { id: 'p5', title: 'Machine Learning từ A-Z', mentor: 'Nguyễn Văn An', created: '2026-03-11', modules: 15, price: 1200, status: 'pending', category: 'AI/ML', level: 'Advanced' },
];

const statusConfig = {
    active: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', dot: 'bg-emerald-500', label: 'Đang mở' },
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', dot: 'bg-amber-500', label: 'Chờ duyệt' },
    rejected: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', dot: 'bg-rose-500', label: 'Từ chối' },
};

const StatusBadge = ({ status }) => {
    const c = statusConfig[status] || statusConfig.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${c.bg} ${c.text} border ${c.border} rounded-full text-[11px] font-extrabold`}>
            <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </span>
    );
};

/** Map dòng bảng admin → shape dùng chung với modal xem trước (mentor) */
function adminRowToPreviewPath(row) {
    const statusMap = {
        active: { code: 'APPROVED', label: 'Đang mở' },
        pending: { code: 'PENDING_APPROVAL', label: 'Chờ duyệt' },
        rejected: { code: 'REJECTED', label: 'Từ chối' },
    };
    const s = statusMap[row.status] || { code: row.status, label: row.status };
    const n = Math.max(1, Number(row.modules) || 1);
    const modules = Array.from({ length: n }, (_, i) => ({
        id: `adm-m-${row.id}-${i}`,
        title: `Module ${i + 1}`,
        enableSupport: true,
        lessons: [
            {
                id: `adm-l-${row.id}-${i}`,
                title: 'Bài học',
                videoUrl: '',
                isPreview: false,
            },
        ],
    }));
    return {
        pathType: 'MENTOR',
        status: s.code,
        statusLabel: s.label,
        title: row.title,
        shortDescription: `Danh mục: ${row.category} — ${row.modules} module`,
        skill: row.category,
        level: row.level || '—',
        priceNote: `${row.price} CR`,
        createdAt: row.created,
        modules,
        rejectionReason: row.rejectionReason,
    };
}

const AdminPaths = () => {
    const [paths, setPaths] = useState(INITIAL_PATHS);
    const [filter, setFilter] = useState('all');
    const [viewPath, setViewPath] = useState(null);
    const [rejectTarget, setRejectTarget] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [toast, setToast] = useState(null);
    const toastTimerRef = useRef(null);

    const showToast = (message) => {
        setToast(message);
        if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
        toastTimerRef.current = window.setTimeout(() => setToast(null), 3200);
    };

    const filtered = useMemo(
        () => (filter === 'all' ? paths : paths.filter((p) => p.status === filter)),
        [paths, filter]
    );

    const pending = useMemo(() => paths.filter((p) => p.status === 'pending').length, [paths]);
    const active = useMemo(() => paths.filter((p) => p.status === 'active').length, [paths]);

    const applyApprove = (path) => {
        setPaths((prev) =>
            prev.map((p) => (p.id === path.id ? { ...p, status: 'active', rejectionReason: undefined } : p))
        );
        showToast('Đã duyệt lộ trình — trạng thái: Đang mở');
    };

    const handleApprove = (path) => {
        if (!window.confirm(`Duyệt và mở lộ trình "${path.title}"?`)) return;
        applyApprove(path);
    };

    const openRejectModal = (path) => {
        setRejectTarget(path);
        setRejectReason('');
    };

    const confirmReject = () => {
        if (!rejectTarget) return;
        const reason = rejectReason.trim();
        setPaths((prev) =>
            prev.map((p) =>
                p.id === rejectTarget.id
                    ? { ...p, status: 'rejected', rejectionReason: reason || 'Không có lý do cụ thể.' }
                    : p
            )
        );
        showToast('Đã từ chối lộ trình');
        setRejectTarget(null);
        setRejectReason('');
    };

    const stats = [
        { Icon: MapTrifold, label: 'Tổng lộ trình', value: MOCK_PATHS.length, color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-100', weight: 'duotone' },
        { Icon: HourglassMedium, label: 'Chờ duyệt', value: pending, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100', weight: 'duotone' },
        { Icon: CheckCircle, label: 'Đang hoạt động', value: active, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100', weight: 'fill' },
        { Icon: Users, label: 'Tổng học viên', value: totalStudents, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100', weight: 'duotone' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6 pb-4">
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-xl">
                    {toast}
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <MapTrifold size={22} weight="duotone" className="text-[#5A63F6]" /> Quản lý Lộ trình Học
                    </h1>
                    <p className="text-sm text-slate-400 font-medium mt-1">Duyệt và kiểm soát chất lượng lộ trình do Mentor tạo lên</p>
                </div>
                {pending > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-sm font-bold text-amber-700">{pending} lộ trình chờ duyệt</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Tổng lộ trình', value: paths.length, icon: '🗺️', bg: 'bg-slate-50', border: 'border-slate-100', color: 'text-slate-700' },
                    { label: 'Chờ duyệt', value: pending, icon: '⏳', bg: 'bg-amber-50', border: 'border-amber-100', color: 'text-amber-700' },
                    { label: 'Đang hoạt động', value: active, icon: '✅', bg: 'bg-emerald-50', border: 'border-emerald-100', color: 'text-emerald-700' },
                ].map((s) => (
                    <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5 flex items-center gap-4`}>
                        <s.Icon size={28} weight={s.weight} className={s.color} />
                        <div>
                            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                            <div className="text-xs font-semibold text-slate-500 mt-0.5">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'pending', label: '⏳ Chờ duyệt' },
                    { id: 'active', label: '✅ Đang mở' },
                    { id: 'rejected', label: '❌ Từ chối' },
                ].map((f) => (
                    <button
                        key={f.id}
                        type="button"
                        onClick={() => setFilter(f.id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${filter === f.id
                                ? 'bg-[#5A63F6] text-white shadow-md shadow-indigo-200'
                                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
                <span className="ml-auto text-xs text-slate-400 font-medium">{filtered.length} lộ trình</span>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[11px] font-extrabold uppercase tracking-widest">
                                <th className="px-6 py-4">Lộ trình</th>
                                <th className="px-6 py-4">Mentor</th>
                                <th className="px-6 py-4">Danh mục</th>
                                <th className="px-6 py-4 whitespace-nowrap">Level</th>
                                <th className="px-6 py-4">Cấu trúc</th>
                                <th className="px-6 py-4">Giá</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Phê duyệt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map((path) => (
                                <tr
                                    key={path.id}
                                    className={`hover:bg-slate-50/50 group transition-colors ${path.status === 'pending' ? 'bg-amber-50/20' : ''
                                        }`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                                                <MapTrifold size={16} weight="bold" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 text-sm">{path.title}</div>
                                                <div className="text-xs text-slate-400 font-medium">Tạo ngày: {path.created}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-sm text-slate-700">{path.mentor}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                                            {path.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">
                                        {path.level || '—'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                            {path.modules} Modules
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1 font-extrabold text-amber-600">
                                            <CurrencyCircleDollar size={15} weight="duotone" /> {path.price} CR
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={path.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setViewPath(path)}
                                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                                                title="Xem chi tiết"
                                            >
                                                <Eye size={15} />
                                            </button>
                                            {path.status === 'pending' && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleApprove(path)}
                                                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-600 font-bold transition-all shadow-sm"
                                                        title="Duyệt lộ trình"
                                                    >
                                                        <CheckCircle2 size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openRejectModal(path)}
                                                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 font-bold transition-all shadow-sm"
                                                        title="Từ chối"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <PathPreviewModal
                open={!!viewPath}
                onClose={() => setViewPath(null)}
                path={viewPath ? adminRowToPreviewPath(viewPath) : null}
                headerTitle="Chi tiết lộ trình"
                creatorName={viewPath?.mentor}
                footer={
                    viewPath ? (
                        <div className="flex justify-end gap-2 flex-wrap">
                            {viewPath.status === 'pending' && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            applyApprove(viewPath);
                                            setViewPath(null);
                                        }}
                                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700"
                                    >
                                        Duyệt ngay
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const p = viewPath;
                                            setViewPath(null);
                                            openRejectModal(p);
                                        }}
                                        className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 text-sm font-bold hover:bg-rose-50"
                                    >
                                        Từ chối
                                    </button>
                                </>
                            )}
                            <button
                                type="button"
                                onClick={() => setViewPath(null)}
                                className="px-4 py-2 rounded-xl bg-slate-200/90 text-slate-800 text-sm font-bold hover:bg-slate-300"
                            >
                                Đóng
                            </button>
                        </div>
                    ) : null
                }
            />

            {/* Modal: Từ chối + lý do */}
            {rejectTarget && (
                <div
                    className="fixed inset-0 z-[260] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 p-5">
                        <h3 className="font-extrabold text-slate-900 text-lg mb-1">Từ chối lộ trình</h3>
                        <p className="text-sm text-slate-500 mb-3 line-clamp-2">{rejectTarget.title}</p>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                            Lý do (khuyến nghị)
                        </label>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows={4}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-rose-200 focus:border-rose-300 outline-none resize-y"
                            placeholder="Ví dụ: Thiếu outline module, cần bổ sung video minh họa..."
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setRejectTarget(null);
                                    setRejectReason('');
                                }}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={confirmReject}
                                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700"
                            >
                                Xác nhận từ chối
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPaths;
