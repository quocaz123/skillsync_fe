import { useState } from 'react';
import { useStore } from '../../store';
import { BookOpen, GraduationCap, X, Plus, Star, Target, Sparkles, AlertCircle, Users } from 'lucide-react';

const Skills = () => {
    const { mySkills, addSkill, removeSkill } = useStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newSkill, setNewSkill] = useState({ name: '', type: 'teach', level: 'Beginner' });

    const teachingSkills = mySkills.filter(s => s.type === 'teach');
    const learningSkills = mySkills.filter(s => s.type === 'learn');

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (newSkill.name.trim()) {
            addSkill(newSkill);
            setNewSkill({ name: '', type: 'teach', level: 'Beginner' });
            setIsAdding(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 font-sans pb-12">

            {/* Header Area */}
            <div className="bg-white rounded-[2rem] p-8 sm:p-10 border border-slate-200/60 shadow-sm relative overflow-hidden group">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-700"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-700"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-4 border border-slate-200">
                            <Sparkles size={14} className="text-amber-500" /> SkillSync Profile
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">My Skills Portfolio</h1>
                        <p className="text-slate-500 mt-2 text-lg max-w-xl">Curate your expertise to teach others, or set learning goals to find the perfect mentors.</p>
                    </div>

                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className={`shrink-0 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:-translate-y-1 active:scale-95 ${isAdding
                            ? 'bg-slate-100 text-slate-700 border border-slate-200 shadow-slate-200/50 hover:bg-slate-200'
                            : 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800'
                            }`}
                    >
                        {isAdding ? <X size={20} /> : <Plus size={20} />}
                        {isAdding ? 'Close Panel' : 'Add New Skill'}
                    </button>
                </div>
            </div>

            {/* Add Skill Form Widget */}
            {isAdding && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-slate-200/40 border border-slate-200/60 animate-in fade-in slide-in-from-top-8 duration-500">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Plus size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Add a new skill</h2>
                    </div>

                    <form onSubmit={handleAddSkill} className="flex flex-col md:flex-row gap-5 items-end">
                        <div className="flex-1 w-full relative group">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Skill Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                placeholder="e.g., Python, Figma, Public Speaking"
                                value={newSkill.name}
                                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 bg-slate-50 focus:bg-white outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 group-hover:border-slate-300"
                            />
                        </div>
                        <div className="w-full md:w-56 relative group">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Intent</label>
                            <div className="relative">
                                <select
                                    value={newSkill.type}
                                    onChange={(e) => setNewSkill({ ...newSkill, type: e.target.value })}
                                    className="w-full pl-12 pr-10 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 bg-slate-50 focus:bg-white outline-none transition-all font-medium text-slate-900 appearance-none cursor-pointer group-hover:border-slate-300"
                                >
                                    <option value="teach">I can teach</option>
                                    <option value="learn">I want to learn</option>
                                </select>
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    {newSkill.type === 'teach' ? (
                                        <GraduationCap size={18} className="text-emerald-600" />
                                    ) : (
                                        <BookOpen size={18} className="text-blue-600" />
                                    )}
                                </div>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 border-l border-slate-200 pl-2">
                                    ▼
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-56 relative group">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Proficiency Level</label>
                            <div className="relative">
                                <select
                                    value={newSkill.level}
                                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                                    className="w-full pl-12 pr-10 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 bg-slate-50 focus:bg-white outline-none transition-all font-medium text-slate-900 appearance-none cursor-pointer group-hover:border-slate-300"
                                >
                                    <option value="Beginner">Beginner (101)</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced Pro</option>
                                    <option value="Expert">Master/Expert</option>
                                </select>
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <Star size={18} />
                                </div>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 border-l border-slate-200 pl-2">
                                    ▼
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full md:w-auto px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Plus size={18} /> Save Skill
                        </button>
                    </form>
                </div>
            )}

            {/* Split Grids Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8 duration-700 fade-in">

                {/* ----------------- TEACHING SKILLS ----------------- */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden group/board relative hover:shadow-md transition-all duration-500">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400"></div>
                    <div className="p-6 sm:p-8 flex items-center justify-between border-b border-slate-100 bg-gradient-to-br from-emerald-50/50 to-white">
                        <div className="flex gap-4 items-center">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                                <GraduationCap size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Skills to Teach</h2>
                                <p className="text-sm font-medium text-slate-500 mt-0.5">Your mentor portfolio</p>
                            </div>
                        </div>
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                            {teachingSkills.length} SKILLS
                        </span>
                    </div>

                    <div className="p-6 sm:p-8 space-y-4">
                        {teachingSkills.length > 0 ? teachingSkills.map(skill => (
                            <div key={skill.id} className="group flex items-center justify-between p-5 rounded-2xl border-2 border-slate-100/80 hover:border-emerald-200 hover:bg-emerald-50/40 hover:shadow-sm transition-all duration-300">
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 text-lg mb-2">{skill.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 shadow-sm">
                                            <Star size={12} className={
                                                skill.level === 'Expert' ? 'text-amber-500 fill-amber-500' :
                                                    skill.level === 'Advanced' ? 'text-emerald-500 fill-emerald-500' : 'text-slate-400'
                                            } />
                                            {skill.level}
                                        </span>
                                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1"><Users size={12} /> Verified</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeSkill(skill.id)}
                                    className="p-3 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 focus:opacity-100 outline-none -mr-2"
                                    title="Remove skill"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        )) : (
                            <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 shadow-sm text-slate-300">
                                    <GraduationCap size={32} />
                                </div>
                                <h3 className="text-slate-700 font-bold mb-1">No teaching skills yet</h3>
                                <p className="text-sm text-slate-500 max-w-xs mx-auto mb-4">Add skills you are proficient in to start earning credits by mentoring others.</p>
                                <button onClick={() => setIsAdding(true)} className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1 mx-auto">
                                    <Plus size={16} /> Add your first skill
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ----------------- LEARNING SKILLS ----------------- */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden group/board relative hover:shadow-md transition-all duration-500">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-400"></div>
                    <div className="p-6 sm:p-8 flex items-center justify-between border-b border-slate-100 bg-gradient-to-br from-blue-50/50 to-white">
                        <div className="flex gap-4 items-center">
                            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
                                <Target size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Learning Goals</h2>
                                <p className="text-sm font-medium text-slate-500 mt-0.5">Skills you want to acquire</p>
                            </div>
                        </div>
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                            {learningSkills.length} GOALS
                        </span>
                    </div>

                    <div className="p-6 sm:p-8 space-y-4">
                        {learningSkills.length > 0 ? learningSkills.map(skill => (
                            <div key={skill.id} className="group flex items-center justify-between p-5 rounded-2xl border-2 border-slate-100/80 hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-sm transition-all duration-300">
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 text-lg mb-2">{skill.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 shadow-sm">
                                            <Target size={12} className="text-blue-500" /> Target: {skill.level}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                                            <AlertCircle size={10} /> Pending Match
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeSkill(skill.id)}
                                    className="p-3 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 focus:opacity-100 outline-none -mr-2"
                                    title="Remove goal"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        )) : (
                            <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 shadow-sm text-slate-300">
                                    <BookOpen size={32} />
                                </div>
                                <h3 className="text-slate-700 font-bold mb-1">No learning goals yet</h3>
                                <p className="text-sm text-slate-500 max-w-xs mx-auto mb-4">Set up skills you want to learn so we can match you with the best mentors.</p>
                                <button onClick={() => setIsAdding(true)} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 mx-auto">
                                    <Plus size={16} /> Set your first goal
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Skills;
