import React from 'react';
import { Sparkles, Users, Layers, HelpCircle } from 'lucide-react';

export default function LearningPathReviewSection({ data, pathType, mentor }) {
    const isMentor = pathType === 'MENTOR';
    const lessonCount = data.modules?.reduce((n, m) => n + (m.lessons?.length || 0), 0) ?? 0;

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Loại lộ trình</h4>
                <div className="flex flex-wrap items-center gap-2">
                    {isMentor ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-sm font-bold border border-violet-200">
                            <Users size={14} /> Mentor-guided (MENTOR)
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-sm font-bold border border-sky-200">
                            <Sparkles size={14} /> Tự học — Lộ trình hệ thống SkillSync
                        </span>
                    )}
                </div>
                {isMentor && mentor && (
                    <p className="text-sm text-slate-600 mt-3">
                        Mentor: <span className="font-bold text-slate-900">{mentor.name}</span> — {mentor.title}
                    </p>
                )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tóm tắt</h4>
                <p className="font-extrabold text-lg text-slate-900">{data.title || '—'}</p>
                <p className="text-sm text-slate-600">{data.shortDescription || '—'}</p>
                <ul className="text-sm text-slate-600 space-y-1 mt-2">
                    <li>
                        <span className="text-slate-400">Kỹ năng:</span> {data.skill || '—'}
                    </li>
                    <li>
                        <span className="text-slate-400">Trình độ:</span> {data.level || '—'}
                    </li>
                    <li>
                        <span className="text-slate-400">Thời lượng:</span> {data.estimatedDuration || '—'}
                    </li>
                    <li>
                        <span className="text-slate-400">Giá:</span>{' '}
                        {data.priceType === 'PAID' ? `${data.totalCreditsCost || 0} credits` : 'Miễn phí'}
                    </li>
                </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Layers size={16} /> Chương trình ({data.modules?.length ?? 0} module · {lessonCount} bài)
                </h4>
                <ol className="space-y-4">
                    {data.modules?.map((m, i) => (
                        <li key={m.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                            <p className="font-bold text-slate-900">
                                {i + 1}. {m.title || 'Module chưa đặt tên'}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                {m.lessons?.length ?? 0} bài học
                                {m.hasQuiz && ' · có quiz'}
                                {m.quizRequired && ' (bắt buộc)'}
                            </p>
                            {isMentor && (
                                <p className="text-xs text-violet-700 font-semibold mt-1 flex items-center gap-1">
                                    <HelpCircle size={12} />
                                    Hỗ trợ mentor: {m.enableSupport ? 'Bật' : 'Tắt'}
                                </p>
                            )}
                            <ul className="mt-2 space-y-1 text-sm text-slate-600 list-disc list-inside">
                                {m.lessons?.map((l) => (
                                    <li key={l.id}>
                                        {l.title || 'Bài không tên'}
                                        {l.isPreview && (
                                            <span className="text-indigo-600 text-xs font-bold ml-1">(preview)</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}
