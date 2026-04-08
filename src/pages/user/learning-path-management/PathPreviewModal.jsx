import React, { useMemo, useState } from 'react';
import { X, Layers, ExternalLink, PlayCircle, Link2 } from 'lucide-react';
import { useStore } from '../../../store';
import { buildMentorPreviewFromUser } from '../learning-path/learningPathMocks';

/**
 * Chuẩn hóa URL để nhúng xem trước (YouTube, Vimeo, file .mp4/.webm).
 * @returns {{ type: 'iframe', src: string } | { type: 'video', src: string } | null}
 */
function getVideoPreviewInfo(url) {
    if (!url || typeof url !== 'string') return null;
    const u = url.trim();
    if (!u) return null;

    const yt =
        u.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([\w-]{6,})/i) ||
        u.match(/youtube\.com\/shorts\/([\w-]{6,})/i);
    if (yt) {
        return { type: 'iframe', src: `https://www.youtube.com/embed/${yt[1]}`, provider: 'YouTube' };
    }

    const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    if (vm) {
        return { type: 'iframe', src: `https://player.vimeo.com/video/${vm[1]}`, provider: 'Vimeo' };
    }

    if (/^https?:\/\/.+\.(mp4|webm|ogg)(\?.*)?$/i.test(u)) {
        return { type: 'video', src: u, provider: 'File' };
    }

    return null;
}

function LessonVideoBlock({ lesson }) {
    const url = (lesson.videoUrl || '').trim();
    const [openPreview, setOpenPreview] = useState(false);

    const embed = useMemo(() => getVideoPreviewInfo(url), [url]);

    if (!url) {
        return (
            <span className="text-slate-400 italic">Chưa có URL video</span>
        );
    }

    return (
        <div className="mt-2 space-y-2 rounded-lg bg-slate-50/80 border border-slate-100 p-2.5">
            <div className="flex items-start gap-2">
                <Link2 size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Đường dẫn video</p>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:underline break-all font-medium"
                    >
                        {url}
                    </a>
                </div>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700"
                    title="Mở video trong tab mới"
                >
                    <ExternalLink size={12} /> Mở
                </a>
            </div>

            {embed ? (
                <div>
                    <button
                        type="button"
                        onClick={() => setOpenPreview((v) => !v)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-violet-700 hover:text-violet-900"
                    >
                        <PlayCircle size={14} />
                        {openPreview ? 'Ẩn xem trước' : `Xem trước ${embed.provider ? `(${embed.provider})` : ''}`}
                    </button>
                    {openPreview && (
                        <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 bg-black shadow-inner">
                            {embed.type === 'iframe' ? (
                                <div className="aspect-video w-full">
                                    <iframe
                                        title="Video preview"
                                        src={embed.src}
                                        className="h-full w-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                <video
                                    src={embed.src}
                                    className="w-full max-h-[240px]"
                                    controls
                                    playsInline
                                    preload="metadata"
                                >
                                    Trình duyệt không hỗ trợ phát video trực tiếp.
                                </video>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-[11px] text-slate-500">
                    Không nhúng được trực tiếp — dùng nút <strong>Mở</strong> hoặc copy đường dẫn phía trên.
                </p>
            )}
        </div>
    );
}

/**
 * Xem trước read-only từ danh sách (không phải wizard).
 * @param {string} [props.headerTitle]
 * @param {string} [props.creatorName] — ép tên người tạo (vd: admin xem lộ trình của mentor)
 * @param {React.ReactNode} [props.footer] — nút hành động phía dưới (admin: Duyệt / Đóng)
 */
export default function PathPreviewModal({
    open,
    onClose,
    path,
    headerTitle = 'Xem trước lộ trình',
    creatorName = null,
    footer = null,
}) {
    const user = useStore((s) => s.user);
    const mentor = useMemo(() => buildMentorPreviewFromUser(user), [user]);

    if (!open || !path) return null;
    const isMentor = path.pathType === 'MENTOR';
    const modules = path.modules || [];
    const creatorDisplay = creatorName != null && creatorName !== '' ? creatorName : isMentor ? mentor.name : 'SkillSync';
    const statusDisplay = path.statusLabel != null ? path.statusLabel : path.status;
    const isRejected = path.status === 'REJECTED' || path.status === 'rejected';

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-sm">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] border border-slate-200 flex flex-col overflow-hidden"
                role="dialog"
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0 bg-white">
                    <h2 className="font-extrabold text-slate-900">{headerTitle}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-lg text-slate-400 hover:bg-slate-100"
                        aria-label="Đóng"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4 space-y-4 text-sm flex-1 overflow-y-auto min-h-0">
                    <p>
                        <span className="text-slate-500">Loại:</span>{' '}
                        <span className="font-bold">{path.pathType}</span>
                    </p>
                    <p>
                        <span className="text-slate-500">Trạng thái:</span>{' '}
                        <span className="font-bold">{statusDisplay}</span>
                    </p>
                    <p>
                        <span className="text-slate-500">Người tạo:</span>{' '}
                        <span className="font-bold">{creatorDisplay}</span>
                    </p>
                    <p className="font-extrabold text-lg text-slate-900">{path.title}</p>
                    <p className="text-slate-600">{path.shortDescription}</p>
                    <p>
                        Skill: <strong>{path.skill}</strong> · Level: <strong>{path.level || '—'}</strong>
                    </p>
                    <p>
                        Giá:{' '}
                        {path.priceNote != null && path.priceNote !== '' ? (
                            <span className="font-extrabold text-amber-600">{path.priceNote}</span>
                        ) : path.priceType === 'PAID' ? (
                            <span className="font-extrabold text-amber-600">{path.totalCreditsCost || 0} credits</span>
                        ) : (
                            <span className="font-extrabold text-emerald-600">Miễn phí</span>
                        )}
                    </p>
                    {path.createdAt && (
                        <p className="text-xs text-slate-400">Tạo ngày: {path.createdAt}</p>
                    )}
                    {isRejected && path.rejectionReason && (
                        <div className="rounded-xl bg-rose-50 border border-rose-100 p-3 text-rose-900 text-xs">
                            <p className="font-bold mb-1">Lý do từ chối</p>
                            <p>{path.rejectionReason}</p>
                        </div>
                    )}
                    <div className="rounded-xl border border-slate-200 p-3">
                        <h3 className="font-extrabold flex items-center gap-2 mb-3">
                            <Layers size={16} /> Chương trình
                        </h3>
                        {modules.length === 0 ? (
                            <p className="text-xs text-slate-500">Chưa có module chi tiết.</p>
                        ) : (
                            modules.map((m, mi) => (
                                <div key={m.id || mi} className="mb-4 last:mb-0 border-l-2 border-indigo-200 pl-3">
                                    <p className="font-bold text-slate-900">{m.title || `Module ${mi + 1}`}</p>
                                    <ul className="mt-2 space-y-3">
                                        {(m.lessons || []).map((l, li) => (
                                            <li key={l.id || li} className="text-xs text-slate-700">
                                                <div className="font-semibold text-slate-800">
                                                    {li + 1}. {l.title || 'Bài học'}
                                                    {l.isPreview && (
                                                        <span className="ml-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                                            Preview
                                                        </span>
                                                    )}
                                                </div>
                                                <LessonVideoBlock lesson={l} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                {footer != null && footer !== false && (
                    <div className="shrink-0 border-t border-slate-100 px-4 py-3 bg-slate-50/80">{footer}</div>
                )}
            </div>
        </div>
    );
}
