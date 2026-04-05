import React, { useState, useEffect } from 'react';
import { Sparkles, Users, Zap, BookOpen, Clock, Layers, ImageOff } from 'lucide-react';

/**
 * Preview live — MENTOR: badge mentor-guided + info mentor | SYSTEM: Tự học + label hệ thống
 * Thumbnail: nhiều URL là trang web hoặc chặn hotlink → img lỗi; dùng onError + fallback gradient.
 */
export default function LearningPathPreviewCard({ data, mentor, className = '' }) {
    const [imgFailed, setImgFailed] = useState(false);
    const [mentorAvatarFailed, setMentorAvatarFailed] = useState(false);
    const thumb = typeof data.thumbnail === 'string' ? data.thumbnail.trim() : '';
    const looksLikeImageUrl = /^https?:\/\//i.test(thumb);
    const showImage = looksLikeImageUrl && !imgFailed;

    useEffect(() => {
        setImgFailed(false);
    }, [thumb]);

    useEffect(() => {
        setMentorAvatarFailed(false);
    }, [mentor?.avatarUrl]);

    const isMentor = data.pathType === 'MENTOR';
    const lessonCount = data.modules?.reduce((n, m) => n + (m.lessons?.length || 0), 0) ?? 0;
    const paid = data.priceType === 'PAID';
    const credits = Number(data.totalCreditsCost) || 0;

    const headerBg =
        'linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #a855f7 100%)';

    return (
        <div
            className={`rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 overflow-hidden ${className}`}
        >
            <div
                className="h-28 sm:h-32 flex items-center justify-center relative"
                style={{ background: showImage ? '#1e1b4b' : headerBg }}
            >
                {showImage ? (
                    <img
                        src={thumb}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                        onError={() => setImgFailed(true)}
                    />
                ) : (
                    <>
                        <BookOpen className="w-14 h-14 text-white/90 drop-shadow-lg relative z-[1]" strokeWidth={1.25} />
                        {looksLikeImageUrl && imgFailed && (
                            <span
                                className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1 rounded-lg bg-black/50 px-2 py-1 text-[10px] font-semibold text-white z-[2]"
                                title="URL không phải ảnh trực tiếp hoặc site chặn nhúng ảnh"
                            >
                                <ImageOff size={12} /> Không tải được — cần URL ảnh trực tiếp (.jpg, .png…)
                            </span>
                        )}
                    </>
                )}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {isMentor ? (
                        <span className="px-2.5 py-1 rounded-full bg-white/90 text-violet-700 text-[11px] font-bold border border-violet-200 shadow-sm">
                            Mentor-guided
                        </span>
                    ) : (
                        <span className="px-2.5 py-1 rounded-full bg-white/90 text-sky-700 text-[11px] font-bold border border-sky-200 shadow-sm flex items-center gap-1">
                            <Sparkles size={12} /> Tự học
                        </span>
                    )}
                </div>
            </div>

            <div className="p-5 space-y-4">
                <div>
                    <h3 className="font-extrabold text-slate-900 text-lg leading-snug line-clamp-2">
                        {data.title || 'Tiêu đề lộ trình'}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                        {data.shortDescription || 'Mô tả ngắn sẽ hiển thị tại đây'}
                    </p>
                </div>

                {isMentor && mentor && (
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-violet-50/80 border border-violet-100">
                        <div
                            className={`w-11 h-11 rounded-xl overflow-hidden bg-gradient-to-br ${mentor.avatarGrad} text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md`}
                        >
                            {mentor.avatarUrl && !mentorAvatarFailed ? (
                                <img
                                    src={mentor.avatarUrl}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                    onError={() => setMentorAvatarFailed(true)}
                                />
                            ) : (
                                mentor.avatarText
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-sm truncate">{mentor.name}</p>
                            <p className="text-xs text-slate-500 truncate">{mentor.title}</p>
                        </div>
                    </div>
                )}

                {!isMentor && (
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-sky-50 border border-sky-100 text-sky-800 text-sm font-bold">
                        <Sparkles size={16} className="shrink-0 text-sky-600" />
                        Lộ trình hệ thống SkillSync
                    </div>
                )}

                <div className="flex flex-wrap gap-3 text-xs text-slate-600 font-semibold">
                    <span className="inline-flex items-center gap-1">
                        <Layers size={13} className="text-slate-400" />
                        {data.modules?.length ?? 0} module
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <BookOpen size={13} className="text-slate-400" />
                        {lessonCount} bài
                    </span>
                    {data.estimatedDuration && (
                        <span className="inline-flex items-center gap-1">
                            <Clock size={13} className="text-slate-400" />
                            {data.estimatedDuration}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chi phí</span>
                    {paid && credits > 0 ? (
                        <span className="inline-flex items-center gap-1 font-black text-amber-600 text-sm">
                            <Zap size={15} className="fill-current" /> {credits} credits
                        </span>
                    ) : (
                        <span className="font-bold text-emerald-600 text-sm">Miễn phí</span>
                    )}
                </div>
            </div>
        </div>
    );
}
