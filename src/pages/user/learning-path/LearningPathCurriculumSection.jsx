import React from 'react';
import { Plus } from 'lucide-react';
import LearningPathModuleEditor from './LearningPathModuleEditor';
import { createEmptyModule } from './learningPathFormState';

export default function LearningPathCurriculumSection({ data, onChange, errors, pathType }) {
    const modules = data.modules || [];

    const setModules = (next) => onChange({ ...data, modules: next });

    const updateModule = (i, mod) => {
        const next = [...modules];
        next[i] = mod;
        setModules(next);
    };

    const moveModule = (i, dir) => {
        const j = i + dir;
        if (j < 0 || j >= modules.length) return;
        const next = [...modules];
        [next[i], next[j]] = [next[j], next[i]];
        setModules(next);
    };

    const removeModule = (i) => {
        if (modules.length <= 1) return;
        setModules(modules.filter((_, k) => k !== i));
    };

    const addModule = () => setModules([...modules, createEmptyModule()]);

    return (
        <div className="space-y-4">
            {errors.modules && (
                <p className="text-sm text-rose-600 font-medium bg-rose-50 border border-rose-100 rounded-xl px-4 py-2">{errors.modules}</p>
            )}

            {modules.map((mod, i) => (
                <LearningPathModuleEditor
                    key={mod.id}
                    module={mod}
                    index={i}
                    total={modules.length}
                    pathType={pathType}
                    errors={errors}
                    onChange={(m) => updateModule(i, m)}
                    onRemove={() => removeModule(i)}
                    onMove={(dir) => moveModule(i, dir)}
                />
            ))}

            <button
                type="button"
                onClick={addModule}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-indigo-200 text-indigo-700 font-bold text-sm hover:bg-indigo-50/50 transition-colors flex items-center justify-center gap-2"
            >
                <Plus size={20} /> Thêm module
            </button>
        </div>
    );
}
