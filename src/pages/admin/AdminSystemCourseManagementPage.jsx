import React, { useMemo, useState } from 'react';
import { Plus, Pencil, Eye, Globe, GlobeLock } from 'lucide-react';
import CreatePathModal from '../user/learning-path-management/CreatePathModal';
import PathPreviewModal from '../user/learning-path-management/PathPreviewModal';
import { seedAdminSystemPaths } from '../user/learning-path-management/managementMockData';

const STATUS_META = {
    DRAFT: { label: 'Nháp', className: 'bg-slate-100 text-slate-700 border-slate-200' },
    PUBLISHED: { label: 'Đã xuất bản', className: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
};

export default function AdminSystemCourseManagementPage() {
    const [paths, setPaths] = useState(() => seedAdminSystemPaths());
    const [createOpen, setCreateOpen] = useState(false);
    const [editPath, setEditPath] = useState(null);
    const [previewPath, setPreviewPath] = useState(null);

    const sorted = useMemo(
        () => [...paths].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')),
        [paths]
    );

    const upsertPath = (payload) => {
        setPaths((prev) => {
            const id = payload.id || `sp-${Date.now()}`;
            const existing = prev.find((p) => p.id === id);
            const next = {
                ...payload,
                id,
                updatedAt: new Date().toISOString(),
                creatorLabel: 'SkillSync',
                learners: existing?.learners ?? payload.learners ?? 0,
                moduleCount: payload.modules?.length ?? 0,
                lessonCount:
                    payload.modules?.reduce((n, m) => n + (m.lessons?.length || 0), 0) ?? 0,
            };
            const i = prev.findIndex((p) => p.id === id);
            if (i >= 0) {
                const copy = [...prev];
                copy[i] = { ...prev[i], ...next };
                return copy;
            }
            return [...prev, { ...next, learners: 0 }];
        });
        setEditPath(null);
    };

    const handleSaveDraft = (payload) => {
        upsertPath({ ...payload, id: editPath?.id, status: 'DRAFT' });
    };

    const handlePublish = (payload) => {
        upsertPath({ ...payload, id: editPath?.id, status: 'PUBLISHED' });
    };

    const togglePublish = (path) => {
        const nextStatus = path.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
        setPaths((prev) =>
            prev.map((p) =>
                p.id === path.id ? { ...p, status: nextStatus, updatedAt: new Date().toISOString() } : p
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

    return (
        <div className="max-w-6xl mx-auto pb-16 px-4 sm:px-6">
            <header className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Quản lí khóa học hệ thống
                    </h1>
                    <p className="text-slate-500 mt-2 text-sm sm:text-base max-w-xl">
                        Tạo và quản lí các lộ trình tự học của SkillSync
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        setEditPath(null);
                        setCreateOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={18} /> Tạo lộ trình
                </button>
            </header>

            <div className="space-y-4">
                {sorted.map((path) => {
                    const st = STATUS_META[path.status] || STATUS_META.DRAFT;
                    const mc = path.modules?.length ?? path.moduleCount ?? 0;
                    const lc =
                        path.modules?.reduce((n, m) => n + (m.lessons?.length || 0), 0) ?? path.lessonCount ?? 0;
                    return (
                        <article
                            key={path.id}
                            className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-lg font-extrabold text-slate-900 truncate">{path.title}</h2>
                                        <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold border border-sky-200">
                                            Tự học
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
                                            SkillSync
                                        </span>
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${st.className}`}
                                        >
                                            {st.label}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                                        <span>
                                            <span className="text-slate-400">Skill:</span> {path.skill}
                                        </span>
                                        <span>
                                            <span className="text-slate-400">Level:</span> {path.level}
                                        </span>
                                        <span>
                                            <span className="text-slate-400">Module / Bài:</span> {mc} / {lc}
                                        </span>
                                        <span>
                                            <span className="text-slate-400">Học viên:</span> {path.learners ?? 0}
                                        </span>
                                        <span>
                                            <span className="text-slate-400">Cập nhật:</span>{' '}
                                            {path.updatedAt
                                                ? new Date(path.updatedAt).toLocaleString('vi-VN')
                                                : '—'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 lg:justify-end shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => openEdit(path)}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        <Pencil size={16} /> Chỉnh sửa
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewPath(path)}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        <Eye size={16} /> Xem trước
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => togglePublish(path)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold ${
                                            path.status === 'PUBLISHED'
                                                ? 'border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100'
                                                : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                        }`}
                                    >
                                        {path.status === 'PUBLISHED' ? (
                                            <>
                                                <GlobeLock size={16} /> Gỡ xuất bản
                                            </>
                                        ) : (
                                            <>
                                                <Globe size={16} /> Xuất bản
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            <CreatePathModal
                open={createOpen}
                onClose={closeModal}
                pathType="SYSTEM"
                mode={editPath ? 'edit' : 'create'}
                initialData={editPath}
                onSaveDraft={handleSaveDraft}
                onPublish={handlePublish}
            />

            <PathPreviewModal open={!!previewPath} onClose={() => setPreviewPath(null)} path={previewPath} />
        </div>
    );
}
