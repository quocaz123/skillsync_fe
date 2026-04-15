import React, { useMemo, useState, useEffect } from 'react';
import API_ENDPOINTS from '../../configuration/apiEndpoints';
import axiosClient from '../../configuration/axiosClient';
import { useStore } from '../../store';
import {
    Plus,
    Pencil,
    Eye,
    Send,
    AlertCircle,
    BookOpen,
    Zap,
    Users,
    Hourglass,
    CheckCircle2,
    XCircle,
    LayoutGrid,
    Trash2,
} from 'lucide-react';
import { toastSuccess, toastError } from '../../utils/toastUtils';
import CreatePathModal from './learning-path-management/CreatePathModal';
import { mapFormToApiPayload } from './learning-path-management/pathFormUtils';
import PathPreviewModal from './learning-path-management/PathPreviewModal';
import { validatePathForm, countLessons } from './learning-path-management/pathFormUtils';

const STATUS_META = {
    DRAFT: { label: 'Nháp', className: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' },
    PENDING_APPROVAL: {
        label: 'Chờ duyệt',
        className: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
    },
    APPROVED: {
        label: 'Đã duyệt',
        className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-500',
    },
    REJECTED: { label: 'Từ chối', className: 'bg-rose-50 text-rose-800 border-rose-200', dot: 'bg-rose-500' },
};

const FILTERS = [
    { id: 'all', label: 'Tất cả', icon: LayoutGrid },
    { id: 'DRAFT', label: 'Nháp', icon: null },
    { id: 'PENDING_APPROVAL', label: 'Chờ duyệt', icon: Hourglass },
    { id: 'APPROVED', label: 'Đang mở', icon: CheckCircle2 },
    { id: 'REJECTED', label: 'Từ chối', icon: XCircle },
];

/** Chuyển API response → shape dùng trong modal/table */
function apiToPath(p) {
    return {
        id: p.id,
        title: p.title,
        shortDescription: p.shortDescription || '',
        description: p.description || '',
        skill: p.category || '',
        level: p.level || '',
        estimatedDuration: p.duration || '',
        emoji: p.emoji || '📚',
        thumbnailUrl: p.thumbnailUrl || '',
        priceType: (p.totalCredits > 0) ? 'PAID' : 'FREE',
        totalCreditsCost: String(p.totalCredits || 0),
        status: p.status || 'PENDING_APPROVAL',
        modules: (p.modules || []).map(m => ({
            id: m.id,
            title: m.title,
            description: m.description || '',
            objective: m.objective || '',
            enableSupport: m.enableSupport || false,
            lessons: (m.lessons || []).map(l => ({
                id: l.id,
                title: l.title,
                description: l.description || '',
                videoUrl: l.videoUrl || '',
                duration: l.durationMinutes ? String(l.durationMinutes) : '',
                isPreview: l.isPreview || false,
            })),
        })),
        moduleCount: p.moduleCount || 0,
        lessonCount: p.lessonCount || 0,
        learners: p.enrollmentCount || 0,
        rejectionReason: p.rejectionReason || null,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
    };
}

export default function MentorLearningPathManagementPage() {
    const { user } = useStore();
    const [paths, setPaths] = useState([]);
    const [loadingPaths, setLoadingPaths] = useState(true);
    const [filter, setFilter] = useState('all');
    const [createOpen, setCreateOpen] = useState(false);
    const [editPath, setEditPath] = useState(null);
    const [previewPath, setPreviewPath] = useState(null);
    const [rejectModal, setRejectModal] = useState(null);

    const fetchMyPaths = async () => {
        setLoadingPaths(true);
        try {
            const res = await axiosClient.get(API_ENDPOINTS.LEARNING_PATHS.GET_MY);
            const data = Array.isArray(res) ? res : (res?.data || []);
            setPaths(data.map(apiToPath));
        } catch (e) {
            console.error('Lỗi tải lộ trình:', e);
        } finally {
            setLoadingPaths(false);
        }
    };

    useEffect(() => { fetchMyPaths(); }, []);



    const sorted = useMemo(
        () => [...paths].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')),
        [paths]
    );

    const filtered = useMemo(
        () => (filter === 'all' ? sorted : sorted.filter((p) => p.status === filter)),
        [sorted, filter]
    );

    const upsertPath = (payload) => {
        setPaths((prev) => {
            const id = payload.id || `mp-${Date.now()}`;
            const existing = prev.find((p) => p.id === id);
            const next = {
                ...payload,
                id,
                updatedAt: new Date().toISOString(),
                learners: existing?.learners ?? payload.learners ?? 0,
                moduleCount: payload.modules?.length ?? 0,
                lessonCount: countLessons(payload.modules),
                createdAt: existing?.createdAt || payload.createdAt || new Date().toISOString(),
            };
            const i = prev.findIndex((p) => p.id === id);
            if (i >= 0) {
                const copy = [...prev];
                copy[i] = { ...prev[i], ...next };
                return copy;
            }
            return [...prev, { ...next, learners: 0 }];
        });
    };

    const deletePath = (path) => {
        if (!window.confirm(`Xóa khóa học "${path.title}"? Hành động này không thể hoàn tác.`)) return;
        setPaths((prev) => prev.filter((p) => p.id !== path.id));
    };

    const handleSaveDraft = (payload) => {
        upsertPath({ ...payload, id: editPath?.id, status: 'DRAFT' });
        setEditPath(null);
    };

    const handleSubmitApproval = async (payload) => {
        try {
            const apiPayload = mapFormToApiPayload(payload);
            await axiosClient.post(`${API_ENDPOINTS.LEARNING_PATHS.CREATE}?mentorId=${user?.id}`, apiPayload);
            toastSuccess('Gửi yêu cầu phê duyệt thành công!');
            setCreateOpen(false);
            fetchMyPaths();
        } catch (err) {
            toastError(err, 'Lỗi khi gửi yêu cầu phê duyệt');
        }
    };


    const sendDraftFromRow = (path) => {
        const errs = validatePathForm(path, 'full');
        if (errs.length) {
            window.alert(errs.join('\n'));
            return;
        }
        setPaths((prev) =>
            prev.map((p) =>
                p.id === path.id ? { ...p, status: 'PENDING_APPROVAL', updatedAt: new Date().toISOString() } : p
            )
        );
    };

    const openEdit = (path) => {
        setEditPath(path);
        setCreateOpen(true);
    };

    const closeModal = () => {
        setCreateOpen(false);
        setEditPath(null);
    };

    const formatDate = (iso) => {
        if (!iso) return '—';
        const d = new Date(iso);
        return d.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    return (
        <div className="max-w-7xl mx-auto pb-16 px-4 sm:px-6">
            <header className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Quản lí khóa học
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm">Tạo và quản lí các lộ trình học do bạn hướng dẫn</p>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        setEditPath(null);
                        setCreateOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-sm shadow-lg shadow-violet-500/25 hover:bg-violet-700 transition-colors"
                >
                    <Plus size={18} /> Tạo lộ trình
                </button>
            </header>

            {/* Bộ lọc + đếm */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex flex-wrap gap-2">
                    {FILTERS.map((f) => {
                        const active = filter === f.id;
                        const Icon = f.icon;
                        return (
                            <button
                                key={f.id}
                                type="button"
                                onClick={() => setFilter(f.id)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${active
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                                    }`}
                            >
                                {Icon && <Icon size={14} className={active ? 'text-white' : 'text-slate-500'} />}
                                {f.label}
                            </button>
                        );
                    })}
                </div>
                <p className="text-sm text-slate-500 font-medium">
                    <span className="font-extrabold text-slate-800">{filtered.length}</span> khóa học
                </p>
            </div>

            {/* Bảng */}
            <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[980px] text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/80">
                                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                    Khóa học
                                </th>
                                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                                    Skill
                                </th>
                                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                                    Level
                                </th>
                                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                                    Cấu trúc
                                </th>
                                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                                    Giá
                                </th>
                                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                                    Học viên
                                </th>
                                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                                    Trạng thái
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center whitespace-nowrap align-middle w-[1%] min-w-[200px]"
                                >
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-12 text-center text-slate-500 text-sm">
                                        Không có khóa học nào trong bộ lọc này.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((path) => {
                                    const st = STATUS_META[path.status] || STATUS_META.DRAFT;
                                    const mc = path.modules?.length ?? path.moduleCount ?? 0;
                                    const lc = countLessons(path.modules) || path.lessonCount || 0;
                                    const paid = path.priceType === 'PAID';
                                    const credits = Number(path.totalCreditsCost) || 0;
                                    return (
                                        <tr
                                            key={path.id}
                                            className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
                                        >
                                            <td className="px-4 py-3 align-top">
                                                <div className="flex gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                                                        <BookOpen className="w-5 h-5 text-white" strokeWidth={1.75} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">
                                                            {path.title}
                                                        </p>
                                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                                            Tạo ngày: {formatDate(path.createdAt || path.updatedAt)}
                                                        </p>
                                                        <p className="text-[11px] text-slate-400">
                                                            Cập nhật:{' '}
                                                            {path.updatedAt
                                                                ? new Date(path.updatedAt).toLocaleString('vi-VN')
                                                                : '—'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <span className="text-sm font-semibold text-violet-700">
                                                    {path.skill || '—'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 align-top text-sm text-slate-700">{path.level || '—'}</td>
                                            <td className="px-4 py-3 align-top">
                                                <span className="inline-flex px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-100">
                                                    {mc} module · {lc} bài
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 align-top whitespace-nowrap">
                                                {paid && credits > 0 ? (
                                                    <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-600">
                                                        <Zap size={15} className="fill-current shrink-0" />
                                                        {credits} CR
                                                    </span>
                                                ) : (
                                                    <span className="text-sm font-semibold text-emerald-600">Miễn phí</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <span className="inline-flex items-center gap-1 text-sm text-slate-700">
                                                    <Users size={15} className="text-slate-400 shrink-0" />
                                                    {path.learners ?? 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${st.className}`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                                    {st.label}
                                                </span>
                                            </td>
                                            <td className="px-2 py-3 align-middle text-center whitespace-nowrap w-[1%] min-w-[200px] max-w-[240px]">
                                                <div className="inline-flex items-center justify-center gap-px flex-nowrap">
                                                    <button
                                                        type="button"
                                                        title="Xem"
                                                        onClick={() => setPreviewPath(path)}
                                                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 shrink-0"
                                                    >
                                                        <Eye size={17} strokeWidth={2} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Sửa"
                                                        onClick={() => openEdit(path)}
                                                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-700 shrink-0"
                                                    >
                                                        <Pencil size={17} strokeWidth={2} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Xóa"
                                                        onClick={() => deletePath(path)}
                                                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 shrink-0"
                                                    >
                                                        <Trash2 size={17} strokeWidth={2} />
                                                    </button>
                                                    {path.status === 'DRAFT' && (
                                                        <button
                                                            type="button"
                                                            title="Gửi duyệt"
                                                            onClick={() => sendDraftFromRow(path)}
                                                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-violet-600 hover:bg-violet-50 shrink-0"
                                                        >
                                                            <Send size={17} strokeWidth={2} />
                                                        </button>
                                                    )}
                                                    {path.status === 'REJECTED' && path.rejectionReason && (
                                                        <button
                                                            type="button"
                                                            title="Lý do từ chối"
                                                            onClick={() => setRejectModal(path)}
                                                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-rose-500 hover:bg-rose-50 shrink-0"
                                                        >
                                                            <AlertCircle size={17} strokeWidth={2} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreatePathModal
                open={createOpen}
                onClose={closeModal}
                pathType="MENTOR"
                mode={editPath ? 'edit' : 'create'}
                initialData={editPath}
                onSaveDraft={handleSaveDraft}
                onSubmitApproval={handleSubmitApproval}
            />

            <PathPreviewModal open={!!previewPath} onClose={() => setPreviewPath(null)} path={previewPath} />

            {rejectModal && (
                <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-slate-900/50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-rose-100">
                        <h3 className="font-extrabold text-rose-900 text-lg mb-2">Lý do từ chối</h3>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{rejectModal.rejectionReason}</p>
                        <button
                            type="button"
                            onClick={() => setRejectModal(null)}
                            className="mt-4 w-full py-2 rounded-xl bg-slate-900 text-white font-bold text-sm"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
