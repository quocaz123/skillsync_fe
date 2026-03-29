import React, { useState } from 'react';
import {
    Map, Star, Target, BookOpen, ChevronRight, Zap, CheckCircle2, Play,
    TrendingUp, Clock, ArrowRight, Search, Users, Award, Briefcase, Calendar, MessageCircle, Navigation, Check, Lock, Info, CalendarDays, Book
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { MY_PATHS_MOCK as myPaths, EXPLORE_PATHS_MOCK as explorePaths } from '../../utils/mockData';

const LearningPath = () => {
    const [activeTab, setActiveTab] = useState('my_paths'); // 'my_paths' | 'explore'

    return (
        <div className="max-w-5xl mx-auto font-sans pb-12 space-y-6">
            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        <Map className="text-blue-600" size={28} /> Lộ trình học tập
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Học theo lộ trình của giáo viên • 1 GV xuyên suốt • Tự động hoàn thành khi đủ điều kiện</p>
                </div>
                <div className="flex bg-slate-100/80 p-1.5 rounded-2xl shadow-inner shrink-0">
                    <button
                        onClick={() => setActiveTab('my_paths')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${activeTab === 'my_paths' ? 'bg-[#5A63F6] text-white shadow-md shadow-indigo-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                    >
                        <Book size={18} /> Lộ trình của tôi
                    </button>
                    <button
                        onClick={() => setActiveTab('explore')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${activeTab === 'explore' ? 'bg-[#5A63F6] text-white shadow-md shadow-indigo-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                    >
                        <Search size={18} /> Khám phá
                    </button>
                </div>
            </div>

            {/* TAB CONTENT: Lộ trình của tôi */}
            {activeTab === 'my_paths' && (
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Left Sidebar: List of active paths */}
                    <div className="xl:col-span-1 space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Đang học ({myPaths.length})</h3>
                        {myPaths.map(path => (
                            <div key={path.id} className="bg-white rounded-[1.5rem] border-2 border-indigo-500 p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl shrink-0">
                                        {path.emoji}
                                    </div>
                                    <h4 className="font-bold text-indigo-700 text-sm leading-tight">{path.title}</h4>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">{path.mentor.avatarText}</div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                            {path.mentor.name} {path.mentor.verified && <CheckCircle2 size={12} className="text-emerald-500" />}
                                        </p>
                                        <p className="text-[10px] text-slate-500 truncate">{path.mentor.role}</p>
                                    </div>
                                </div>
                                <div className="mt-3 text-[10px] text-slate-400 font-medium">1/5 module • Đăng ký 01/01/2026</div>
                            </div>
                        ))}

                        <button onClick={() => setActiveTab('explore')} className="w-full bg-slate-50 rounded-[1.5rem] border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center gap-2 text-slate-500 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-700 transition-colors group">
                            <div className="text-2xl font-light">+</div>
                            <span className="font-bold text-sm">Tìm lộ trình mới</span>
                        </button>
                    </div>

                    {/* Right Content: Active Path Detail */}
                    <div className="xl:col-span-3 space-y-6">
                        {myPaths.map(path => (
                            <div key={path.id}>
                                {/* BIG BANNER */}
                                <div className="bg-[#6B72FF] rounded-3xl p-5 lg:p-6 text-white relative overflow-hidden shadow-xl shadow-indigo-900/20 mb-5">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[60px] -translate-y-10 translate-x-20 pointer-events-none"></div>

                                    <div className="flex flex-col lg:flex-row gap-6 relative z-10">
                                        {/* Path Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start gap-4 mb-3">
                                                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-sm border border-white/20 shrink-0">
                                                    {path.emoji}
                                                </div>
                                                <div>
                                                    <h2 className="text-xl lg:text-2xl font-extrabold tracking-tight mb-1">{path.title}</h2>
                                                    <p className="text-white/80 font-medium text-xs leading-relaxed max-w-2xl">{path.description}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 mt-6">
                                                <span className="px-3 py-1.5 bg-black/20 rounded-full font-bold text-xs flex items-center gap-1.5 backdrop-blur-sm border border-white/10">
                                                    <Clock size={14} className="text-indigo-200" /> {path.duration}
                                                </span>
                                                <span className="px-3 py-1.5 bg-black/20 rounded-full font-bold text-xs flex items-center gap-1.5 backdrop-blur-sm border border-white/10">
                                                    <Target size={14} className="text-indigo-200" /> {path.level}
                                                </span>
                                                <span className="px-3 py-1.5 bg-amber-500/20 rounded-full font-bold text-xs text-amber-200 flex items-center gap-1.5 backdrop-blur-sm border border-amber-500/30">
                                                    <Zap size={14} className="text-amber-300 fill-current" /> {path.totalCredits} credits trọn gói
                                                </span>
                                            </div>

                                            {/* Mentor inside Banner */}
                                            <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center justify-between gap-4 max-w-xl">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-12 h-12 rounded-xl bg-white text-indigo-600 flex items-center justify-center font-extrabold text-lg shrink-0 shadow-sm">{path.mentor.avatarText}</div>
                                                    <div className="min-w-0">
                                                        <p className="font-extrabold text-base flex items-center gap-1">
                                                            {path.mentor.name} <CheckCircle2 size={14} className="text-emerald-400" />
                                                        </p>
                                                        <p className="text-xs text-indigo-100 truncate mb-1">{path.mentor.role}</p>
                                                        <div className="flex items-center gap-2 text-[10px] font-medium text-indigo-200">
                                                            <span className="flex items-center gap-1"><Star size={10} className="text-amber-300 fill-current" /> {path.mentor.rating}</span>
                                                            <span>• {path.mentor.students} học viên</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="shrink-0 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 border border-white/20">
                                                    <MessageCircle size={16} /> Nhắn GV
                                                </button>
                                            </div>
                                        </div>

                                        {/* Progress Widget */}
                                        <div className="shrink-0 flex items-center lg:items-end justify-center">
                                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center w-32 h-24 flex flex-col justify-center">
                                                <div className="text-3xl font-black tracking-tighter">{path.progress}%</div>
                                                <div className="text-xs font-bold text-indigo-100 uppercase tracking-widest mt-1">xong</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress bar line */}
                                    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/20">
                                        <div className="h-full bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ width: `${path.progress}%` }}></div>
                                    </div>
                                </div>

                                {/* CRITERIA HELPER */}
                                <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50/80 rounded-2xl p-4 border border-slate-100 mb-6">
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
                                        <span className="font-bold text-slate-500">Hoàn thành module khi đủ 3:</span>
                                        <span className="flex items-center gap-1.5 font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-lg shadow-sm border border-slate-200"><CalendarDays size={14} className="text-blue-500" /> Đủ buổi học</span>
                                        <span className="flex items-center gap-1.5 font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-lg shadow-sm border border-slate-200"><Target size={14} className="text-orange-500" /> Quiz ≥67%</span>
                                        <span className="flex items-center gap-1.5 font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-lg shadow-sm border border-slate-200"><CheckCircle2 size={14} className="text-emerald-500" /> Tự đánh dấu</span>
                                    </div>
                                    <div className="text-xs font-bold text-amber-500 flex items-center gap-1">
                                        <Zap size={14} className="fill-current" /> Tự động mở khoá module tiếp theo
                                    </div>
                                </div>

                                {/* MODULES TIMELINE/LIST */}
                                <div className="space-y-4">
                                    {path.modules.map((mod, idx) => {
                                        const isCompleted = mod.status === 'completed';
                                        const isOngoing = mod.status === 'ongoing';
                                        const isLocked = mod.status === 'locked';

                                        return (
                                            <div key={mod.id} className={`rounded-2xl border-2 transition-all duration-300 relative overflow-hidden bg-white 
                                                ${isOngoing ? 'border-indigo-500 shadow-lg shadow-indigo-100 scale-[1.02] z-10' :
                                                    isCompleted ? 'border-emerald-400 opacity-90' :
                                                        'border-slate-200 opacity-80 hover:opacity-100'} 
                                            `}>
                                                <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">

                                                    {/* Left info */}
                                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0
                                                            ${isOngoing ? 'bg-indigo-500 text-white shadow-md' :
                                                                isCompleted ? 'bg-emerald-500 text-white shadow-md' :
                                                                    'bg-slate-100 text-slate-400'}
                                                        `}>
                                                            {isCompleted ? <Check size={24} strokeWidth={3} /> :
                                                                isOngoing ? path.emoji :
                                                                    'b'}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            {isOngoing && <div className="text-[10px] font-black text-orange-500 tracking-wider uppercase mb-1 flex items-center gap-1"><Zap size={10} className="fill-current" /> MODULE ĐANG HỌC</div>}
                                                            {isCompleted && <div className="text-[10px] items-center text-slate-400 font-bold uppercase tracking-widest flex justify-between">Module {idx + 1}</div>}
                                                            {!isOngoing && !isCompleted && <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 shadow-sm">Module {idx + 1}</div>}

                                                            <h3 className={`font-extrabold ${isOngoing ? 'text-xl text-slate-900 mb-1' : isCompleted ? 'text-lg text-emerald-600' : 'text-lg text-slate-700'}`}>
                                                                {isOngoing ? `Module ${idx + 1}: ${mod.title}` : mod.title} {isCompleted && <span className="text-xs text-emerald-500 ml-2 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">✓ {mod.completedDate}</span>}
                                                            </h3>

                                                            {isOngoing && (
                                                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                                                    <span>{mod.criteria} tiêu chí</span>
                                                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                                    <span>{mod.progress}%</span>
                                                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                                    <span>{mod.sessionsNeeded} buổi cần thiết</span>
                                                                </div>
                                                            )}
                                                            {isLocked && (
                                                                <div className="flex items-center gap-2 text-xs font-semibold mt-1">
                                                                    <span className="flex items-center gap-1 text-slate-400"><CalendarDays size={12} /> {mod.sessionsBooked}/{mod.sessionsNeeded}b</span>
                                                                    <span className="flex items-center gap-1 text-slate-400"><Target size={12} /> — </span>
                                                                    <span className="flex items-center gap-1 text-slate-400"><CheckCircle2 size={12} /> — </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Right Action */}
                                                    <div className="shrink-0 w-full sm:w-auto">
                                                        {isOngoing && (
                                                            <button className="w-full sm:w-auto px-6 py-3 bg-[#5A63F6] hover:bg-[#4a53e6] text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2">
                                                                + Đặt lịch <ArrowRight size={16} />
                                                            </button>
                                                        )}
                                                        {isCompleted && (
                                                            <button className="w-full sm:w-auto p-2 text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center">
                                                                <ChevronRight size={20} className="rotate-90" />
                                                            </button>
                                                        )}
                                                        {isLocked && (
                                                            <button className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                                                                Bắt đầu <ChevronRight size={16} className="rotate-90" />
                                                            </button>
                                                        )}
                                                    </div>

                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Khám phá */}
            {activeTab === 'explore' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="text-slate-500 font-medium mb-6">Khám phá lộ trình được thiết kế bởi các giáo viên chuyên gia • Đăng ký = học với GV đó suốt lộ trình</div>

                    {explorePaths.map(path => (
                        <div key={path.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">

                            {/* Card Header Banner */}
                            <div className="p-5 md:p-6 border-b border-slate-100 flex flex-col md:flex-row gap-5 justify-between items-start md:items-center relative">
                                {path.enrolled && <div className="absolute top-0 right-10 w-24 h-[8px] bg-emerald-400 rounded-b-xl"></div>}
                                <div className="flex gap-4 items-start md:items-center">
                                    <div className={`w-12 h-12 rounded-xl ${path.logoBg} ${path.logoText} flex items-center justify-center text-2xl font-bold shrink-0 shadow-sm`}>
                                        {path.emoji}
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 mb-1">
                                            <h2 className="text-xl font-extrabold text-slate-900">{path.title}</h2>
                                            {path.enrolled && <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold rounded-full flex items-center gap-1">✓ Đã đăng ký</span>}
                                        </div>
                                        <p className="text-slate-600 text-sm max-w-2xl mb-3">{path.description}</p>
                                        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                                            <span className="flex items-center gap-1.5"><Navigation size={14} className="text-blue-500" /> {path.category}</span>
                                            <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> {path.duration}</span>
                                            <span className="flex items-center gap-1.5"><Target size={14} className="text-emerald-500" /> {path.level}</span>
                                            <span className="flex items-center gap-1.5 text-amber-600 font-bold"><Zap size={14} className="fill-current" /> {path.totalCredits} credits</span>
                                            <span className="flex items-center gap-1.5"><Users size={14} className="text-slate-400" /> {path.students} học viên</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
                                    {path.enrolled ? (
                                        <button onClick={() => setActiveTab('my_paths')} className="w-full md:w-auto px-6 py-3 bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2">
                                            <Play size={16} className="fill-current" /> Xem tiến độ
                                        </button>
                                    ) : (
                                        <button className="w-full md:w-auto px-8 py-3 bg-[#6B72FF] text-white font-bold rounded-xl shadow-md shadow-indigo-200 hover:bg-indigo-600 hover:-translate-y-0.5 transition-all">
                                            Đăng ký học →
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Card Content: Mentor + Modules Sidebar Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-3 bg-slate-50/50">
                                {/* Left: Mentor Info */}
                                <div className="p-5 md:p-6 border-r border-slate-100/50">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Briefcase size={12} className="text-emerald-500" /> GIÁO VIÊN</h4>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-sm shrink-0">
                                            {path.mentor.avatarText}
                                        </div>
                                        <div>
                                            <h5 className="font-extrabold text-slate-900 flex items-center gap-1">
                                                {path.mentor.name} {path.mentor.verified && <CheckCircle2 size={14} className="text-emerald-500" />}
                                            </h5>
                                            <p className="text-xs text-slate-500 mt-0.5 leading-snug max-w-[160px]">{path.mentor.role}</p>
                                        </div>
                                    </div>

                                    <div className="flex divide-x divide-slate-200 mb-4 bg-white rounded-xl border border-slate-200 p-2 shadow-sm text-center">
                                        <div className="flex-1 px-2">
                                            <div className="text-lg font-black text-slate-800 flex justify-center items-center gap-1">{path.mentor.rating} <Star size={12} className="text-amber-400 fill-current" /></div>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase">Rating</div>
                                        </div>
                                        <div className="flex-1 px-2">
                                            <div className="text-lg font-black text-slate-800">{path.mentor.students}</div>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase">HV</div>
                                        </div>
                                        <div className="flex-1 px-2">
                                            <div className="text-lg font-black text-blue-600">{path.mentor.graduates}</div>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase">Tốt nghiệp</div>
                                        </div>
                                    </div>

                                    <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5 justify-center bg-orange-50 text-orange-600 rounded-lg py-2">
                                        <Zap size={12} className="fill-current" /> {path.mentor.costPerSession} credits/buổi • {path.mentor.totalSessions} buổi tổng
                                    </div>
                                </div>

                                {/* Right: Modules Syllabus */}
                                <div className="md:col-span-2 p-5 md:p-6">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Book size={12} className="text-emerald-500" /> {path.modules.length} MODULES</h4>

                                    <div className="space-y-4 relative">
                                        {/* Vertical line connector */}
                                        <div className="absolute top-4 bottom-4 left-3 w-0.5 bg-slate-200 z-0 hidden sm:block"></div>

                                        {path.modules.map((mod, idx) => (
                                            <div key={mod.id} className="relative z-10 flex gap-4 items-start hover:bg-white p-3 -mx-3 rounded-xl transition-colors">
                                                <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 text-slate-500 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                                    {path.emoji}
                                                </div>
                                                <div>
                                                    <h5 className="font-extrabold text-slate-800 text-sm mb-1">{idx + 1}. {mod.title}</h5>
                                                    <p className="text-xs font-medium text-slate-500">{mod.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LearningPath;
