import React from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Layers } from 'lucide-react';
import LearningPathLessonEditor from './LearningPathLessonEditor';
import { createEmptyLesson } from './learningPathFormState';

export default function LearningPathModuleEditor({
    module,
    index,
    total,
    pathType,
    errors,
    onChange,
    onRemove,
    onMove,
}) {
    const showSupport = pathType === 'MENTOR';
    const errModTitle = errors[`module-${module.id}-title`];
    const errLessons = errors[`module-${module.id}-lessons`];

    const updateLessons = (lessons) => onChange({ ...module, lessons });

    const moveLesson = (li, dir) => {
        const arr = [...module.lessons];
        const j = li + dir;
        if (j < 0 || j >= arr.length) return;
        [arr[li], arr[j]] = [arr[j], arr[li]];
        updateLessons(arr);
    };

    const updateLesson = (li, lesson) => {
        const arr = [...module.lessons];
        arr[li] = lesson;
        updateLessons(arr);
    };

    const addLesson = () => updateLessons([...module.lessons, createEmptyLesson()]);

    const removeLesson = (li) => {
        if (module.lessons.length <= 1) return;
        updateLessons(module.lessons.filter((_, i) => i !== li));
    };

    return (
        <div className="rounded-2xl border-2 border-indigo-100 bg-gradient-to-b from-indigo-50/40 to-white p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 text-white font-black text-sm shrink-0">
                        {index + 1}
                    </span>
                    <div>
                        <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                            <Layers size={16} className="text-indigo-500" /> Module {index + 1}
                        </h4>
                        <p className="text-[11px] text-slate-500">Nội dung & bài học</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => onMove(-1)}
                        className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30"
                    >
                        <ChevronUp size={18} />
                    </button>
                    <button
                        type="button"
                        disabled={index >= total - 1}
                        onClick={() => onMove(1)}
                        className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30"
                    >
                        <ChevronDown size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="p-2 rounded-xl border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 ml-1"
                        title="Xóa module"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500">Tên module *</label>
                <input
                    type="text"
                    value={module.title}
                    onChange={(e) => onChange({ ...module, title: e.target.value })}
                    className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm font-medium ${errModTitle ? 'border-rose-300' : 'border-slate-200'}`}
                />
                {errModTitle && <p className="text-xs text-rose-600 mt-1">{errModTitle}</p>}
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500">Mô tả module</label>
                <textarea
                    value={module.description}
                    onChange={(e) => onChange({ ...module, description: e.target.value })}
                    rows={2}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm resize-y"
                />
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500">Mục tiêu module</label>
                <textarea
                    value={module.objective}
                    onChange={(e) => onChange({ ...module, objective: e.target.value })}
                    rows={2}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm resize-y"
                />
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500">Thời lượng ước tính (module)</label>
                <input
                    type="text"
                    value={module.estimatedDuration}
                    onChange={(e) => onChange({ ...module, estimatedDuration: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm max-w-xs"
                    placeholder="2 tuần"
                />
            </div>

            <div className="flex flex-wrap gap-4 items-center">
                <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                        type="checkbox"
                        checked={module.hasQuiz}
                        onChange={(e) => onChange({ ...module, hasQuiz: e.target.checked })}
                        className="rounded border-slate-300 text-indigo-600"
                    />
                    Có quiz
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                        type="checkbox"
                        checked={module.quizRequired}
                        onChange={(e) => onChange({ ...module, quizRequired: e.target.checked })}
                        disabled={!module.hasQuiz}
                        className="rounded border-slate-300 text-indigo-600 disabled:opacity-40"
                    />
                    Bắt buộc qua quiz
                </label>
                {showSupport && (
                    <label className="inline-flex items-center gap-2 text-sm font-medium text-violet-800 bg-violet-50 px-3 py-1.5 rounded-xl border border-violet-100">
                        <input
                            type="checkbox"
                            checked={module.enableSupport}
                            onChange={(e) => onChange({ ...module, enableSupport: e.target.checked })}
                            className="rounded border-violet-300 text-violet-600"
                        />
                        Hỗ trợ mentor (enableSupport)
                    </label>
                )}
            </div>

            {errLessons && <p className="text-xs text-rose-600 font-medium">{errLessons}</p>}

            <div className="space-y-3 pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bài học trong module</p>
                {module.lessons.map((lesson, li) => (
                    <LearningPathLessonEditor
                        key={lesson.id}
                        lesson={lesson}
                        index={li}
                        total={module.lessons.length}
                        errors={errors}
                        onChange={(l) => updateLesson(li, l)}
                        onRemove={() => removeLesson(li)}
                        onMove={(dir) => moveLesson(li, dir)}
                    />
                ))}
                <button
                    type="button"
                    onClick={addLesson}
                    className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 py-2"
                >
                    <Plus size={18} /> Thêm bài học
                </button>
            </div>
        </div>
    );
}
