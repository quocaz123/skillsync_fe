import React from 'react';
import { GripVertical, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

export default function LearningPathLessonEditor({
    lesson,
    index,
    total,
    errors,
    onChange,
    onRemove,
    onMove,
}) {
    const errTitle = errors[`lesson-${lesson.id}-title`];
    const errVideo = errors[`lesson-${lesson.id}-videoUrl`];

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-sm">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 text-slate-500">
                    <GripVertical size={16} className="shrink-0 opacity-50" />
                    <span className="text-xs font-bold uppercase tracking-wider">Bài {index + 1}</span>
                </div>
                <div className="flex items-center gap-0.5">
                    <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => onMove(-1)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30"
                    >
                        <ChevronUp size={18} />
                    </button>
                    <button
                        type="button"
                        disabled={index >= total - 1}
                        onClick={() => onMove(1)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30"
                    >
                        <ChevronDown size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 ml-1"
                        title="Xóa bài"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div>
                <label className="text-[11px] font-bold text-slate-500">Tiêu đề bài *</label>
                <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) => onChange({ ...lesson, title: e.target.value })}
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${errTitle ? 'border-rose-300' : 'border-slate-200'}`}
                />
                {errTitle && <p className="text-xs text-rose-600 mt-0.5">{errTitle}</p>}
            </div>

            <div>
                <label className="text-[11px] font-bold text-slate-500">Mô tả</label>
                <textarea
                    value={lesson.description}
                    onChange={(e) => onChange({ ...lesson, description: e.target.value })}
                    rows={2}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-y"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="text-[11px] font-bold text-slate-500">URL video *</label>
                    <input
                        type="url"
                        value={lesson.videoUrl}
                        onChange={(e) => onChange({ ...lesson, videoUrl: e.target.value })}
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${errVideo ? 'border-rose-300' : 'border-slate-200'}`}
                        placeholder="https://..."
                    />
                    {errVideo && <p className="text-xs text-rose-600 mt-0.5">{errVideo}</p>}
                </div>
                <div>
                    <label className="text-[11px] font-bold text-slate-500">Thời lượng</label>
                    <input
                        type="text"
                        value={lesson.duration}
                        onChange={(e) => onChange({ ...lesson, duration: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        placeholder="15 phút"
                    />
                </div>
            </div>

            <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                <input
                    type="checkbox"
                    checked={lesson.isPreview}
                    onChange={(e) => onChange({ ...lesson, isPreview: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Cho phép xem trước (preview)
            </label>
        </div>
    );
}
