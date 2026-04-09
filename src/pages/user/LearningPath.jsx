import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Map, Star, Target, BookOpen, ChevronRight, Zap, CheckCircle2, Play,
    Clock, Search, Users, Book, SlidersHorizontal,
    X, Sparkles, LayoutGrid, Video, Layers, ChevronDown, BadgeCheck,
} from 'lucide-react';
import { MY_PATHS_MOCK as myPaths, EXPLORE_PATHS_MOCK as explorePaths } from '../../utils/mockData';

// ─────────────────────────────────────────────
// Helper: Level badge color
// ─────────────────────────────────────────────
const LEVEL_STYLE = {
    Beginner: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    Intermediate: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
    Advanced: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
};
const LEVEL_LABEL = { Beginner: 'Cơ bản', Intermediate: 'Trung cấp', Advanced: 'Nâng cao' };

function LevelBadge({ level }) {
    const s = LEVEL_STYLE[level] || LEVEL_STYLE.Beginner;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold ${s.bg} ${s.text} ${s.border}`}>
            <Target size={10} /> {LEVEL_LABEL[level] || level}
        </span>
    );
}

function TypeBadge({ type }) {
    if (type === 'mentor') return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 border border-violet-200 text-[11px] font-bold">
            <Users size={10} /> Mentor-guided
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 border border-sky-200 text-[11px] font-bold">
            <Play size={10} /> Tự học
        </span>
    );
}

// ─────────────────────────────────────────────
// Loading Skeleton Card
// ─────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse shadow-sm">
            <div className="h-40 bg-slate-200" />
            <div className="p-5 space-y-3">
                <div className="flex gap-2"><div className="h-4 w-16 bg-slate-200 rounded-full" /><div className="h-4 w-20 bg-slate-200 rounded-full" /></div>
                <div className="h-5 w-3/4 bg-slate-200 rounded-lg" />
                <div className="h-4 w-full bg-slate-100 rounded-lg" />
                <div className="h-4 w-2/3 bg-slate-100 rounded-lg" />
                <div className="flex gap-3 pt-1">
                    <div className="h-4 w-20 bg-slate-200 rounded-full" />
                    <div className="h-4 w-20 bg-slate-200 rounded-full" />
                </div>
                <div className="h-10 bg-slate-200 rounded-xl mt-2" />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Path Card
// ─────────────────────────────────────────────
function PathCard({ path }) {
    const isMentor = path.type === 'mentor';

    return (
        <Link
            to={`/app/learning-path/${path.id}`}
            className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col no-underline text-inherit"
        >
            {/* Thumbnail */}
            <div
                className="relative h-40 flex items-center justify-center overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${path.thumbnailFrom}, ${path.thumbnailTo})` }}
            >
                <span
                    className="text-6xl select-none opacity-90 drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                    style={{ textShadow: '0 4px 24px rgba(0,0,0,0.18)' }}
                >{path.emoji}</span>

                {/* Floating badges top-left */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <TypeBadge type={path.type} />
                    <LevelBadge level={path.level} />
                </div>

                {/* Rating top-right */}
                {path.rating && (
                    <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Star size={11} className="text-amber-300 fill-current" /> {path.rating.toFixed(1)}
                    </div>
                )}

                {/* Gradient overlay bottom */}
                <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col flex-1 gap-3">
                {/* Skill chip */}
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <BookOpen size={11} className="text-slate-400" /> {path.skill}
                </div>

                {/* Title */}
                <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors">
                    {path.title}
                </h3>

                {/* Description */}
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 flex-1">{path.description}</p>

                {/* Stats row */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-500 font-semibold">
                    <span className="flex items-center gap-1"><Clock size={11} className="text-slate-400" /> {path.duration}</span>
                    <span className="flex items-center gap-1"><Layers size={11} className="text-slate-400" /> {path.moduleCount} module</span>
                    <span className="flex items-center gap-1"><Video size={11} className="text-slate-400" /> {path.lessonCount} bài</span>
                    <span className="flex items-center gap-1"><Users size={11} className="text-slate-400" /> {path.learnerCount.toLocaleString()} học viên</span>
                </div>

                {/* Mentor info (mentor paths only) */}
                {isMentor && path.mentor && (
                    <div className="flex items-center gap-2.5 py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${path.mentor.avatarGrad} text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm`}>
                            {path.mentor.avatarText}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 flex items-center gap-1 truncate">
                                {path.mentor.name}
                                {path.mentor.verified && <BadgeCheck size={12} className="text-emerald-500 shrink-0" />}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">{path.mentor.role}</p>
                        </div>
                        <div className="ml-auto shrink-0 flex items-center gap-1 text-[11px] font-bold text-amber-500">
                            <Star size={11} className="fill-current" /> {path.mentor.rating}
                        </div>
                    </div>
                )}

                {/* System path badge */}
                {!isMentor && (
                    <div className="flex items-center gap-2 py-2 px-3 bg-sky-50 rounded-xl border border-sky-100">
                        <Sparkles size={14} className="text-sky-500 shrink-0" />
                        <span className="text-[11px] font-bold text-sky-600">Lộ trình hệ thống SkillSync</span>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-1 mt-auto border-t border-slate-100">
                    <div className="text-xs font-bold">
                        {path.totalCredits > 0 ? (
                            <span className="flex items-center gap-1 text-amber-600">
                                <Zap size={13} className="fill-current" /> {path.totalCredits} credits
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-emerald-600">
                                <CheckCircle2 size={13} /> Miễn phí
                            </span>
                        )}
                    </div>
                    <span className="px-4 py-2 bg-indigo-600 group-hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm shadow-indigo-200">
                        Xem chi tiết <ChevronRight size={13} />
                    </span>
                </div>
            </div>
        </Link>
    );
}

// ─────────────────────────────────────────────
// Explore Tab Content
// ─────────────────────────────────────────────
const ALL_SKILLS = ['Tất cả', ...Array.from(new Set(explorePaths.map(p => p.skill)))];
const ALL_LEVELS = ['Tất cả', 'Beginner', 'Intermediate', 'Advanced'];
const ALL_TYPES = ['Tất cả', 'mentor', 'system'];
const SORT_OPTIONS = [
    { value: 'featured', label: 'Nổi bật' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'popular', label: 'Phổ biến' },
    { value: 'rating', label: 'Rating cao' },
];
const TYPE_LABEL = { 'Tất cả': 'Tất cả', mentor: 'Có mentor hướng dẫn', system: 'Tự học' };

function ExploreTab() {
    const [keyword, setKeyword] = useState('');
    const [skillFilter, setSkillFilter] = useState('Tất cả');
    const [levelFilter, setLevelFilter] = useState('Tất cả');
    const [typeFilter, setTypeFilter] = useState('Tất cả');
    const [priceFilter, setPriceFilter] = useState('Tất cả'); // 'Tất cả' | 'free' | 'paid'
    const [sortBy, setSortBy] = useState('featured');
    const [loading, setLoading] = useState(false);
    const [showFilter, setShowFilter] = useState(false);

    // Simulate loading when filters change
    const applyFilters = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 600);
    };

    const hasActiveFilter = keyword || skillFilter !== 'Tất cả' || levelFilter !== 'Tất cả' || typeFilter !== 'Tất cả' || priceFilter !== 'Tất cả';

    const clearFilters = () => {
        setKeyword(''); setSkillFilter('Tất cả'); setLevelFilter('Tất cả');
        setTypeFilter('Tất cả'); setPriceFilter('Tất cả');
    };

    const filteredPaths = useMemo(() => {
        let list = [...explorePaths];

        if (keyword.trim()) {
            const kw = keyword.toLowerCase();
            list = list.filter(p =>
                p.title.toLowerCase().includes(kw) ||
                p.skill.toLowerCase().includes(kw) ||
                p.description.toLowerCase().includes(kw) ||
                (p.mentor?.name || '').toLowerCase().includes(kw)
            );
        }
        if (skillFilter !== 'Tất cả') list = list.filter(p => p.skill === skillFilter);
        if (levelFilter !== 'Tất cả') list = list.filter(p => p.level === levelFilter);
        if (typeFilter !== 'Tất cả') list = list.filter(p => p.type === typeFilter);
        if (priceFilter === 'free') list = list.filter(p => p.totalCredits === 0);
        if (priceFilter === 'paid') list = list.filter(p => p.totalCredits > 0);

        switch (sortBy) {
            case 'newest': return list.sort((a, b) => (b.newest ? 1 : 0) - (a.newest ? 1 : 0));
            case 'popular': return list.sort((a, b) => b.learnerCount - a.learnerCount);
            case 'rating': return list.sort((a, b) => b.rating - a.rating);
            case 'featured': default:
                return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }
    }, [keyword, skillFilter, levelFilter, typeFilter, priceFilter, sortBy]);

    const recommended = useMemo(() =>
        explorePaths.filter(p => p.featured).slice(0, 3), []);

    return (
        <div className="space-y-8">
            {/* ── Page Header ── */}
            <div className="text-center py-6 px-4 rounded-3xl bg-gradient-to-br from-indigo-50 via-violet-50 to-slate-50 border border-indigo-100/60 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-200 rounded-full opacity-20 blur-3xl" />
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-violet-200 rounded-full opacity-20 blur-3xl" />
                </div>
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold mb-3">
                        <Map size={13} /> Khám phá lộ trình học
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                        Tìm lộ trình <span className="text-indigo-600">phù hợp với bạn</span>
                    </h1>
                    <p className="text-slate-500 text-sm max-w-md mx-auto">
                        Chọn lộ trình phù hợp để bắt đầu hành trình học tập — có mentor đồng hành hoặc tự học theo tiến độ của bạn
                    </p>
                </div>
            </div>

            {/* ── Search + Filter Bar ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Search row */}
                <div className="flex items-center gap-3 p-4 border-b border-slate-100">
                    <div className="flex-1 flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus-within:border-indigo-400 focus-within:bg-white focus-within:shadow-sm transition-all">
                        <Search size={16} className="text-slate-400 shrink-0" />
                        <input
                            type="text"
                            placeholder="Tìm theo tên lộ trình, kỹ năng hoặc mentor..."
                            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none font-medium"
                            value={keyword}
                            onChange={e => { setKeyword(e.target.value); applyFilters(); }}
                        />
                        {keyword && (
                            <button onClick={() => setKeyword('')} className="text-slate-400 hover:text-slate-600">
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Sort */}
                    <div className="relative shrink-0 hidden sm:block">
                        <select
                            value={sortBy}
                            onChange={e => { setSortBy(e.target.value); applyFilters(); }}
                            className="appearance-none pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none cursor-pointer hover:border-indigo-300 transition-colors"
                        >
                            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Filter toggle */}
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${showFilter ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'}`}
                    >
                        <SlidersHorizontal size={15} />
                        <span className="hidden sm:inline">Lọc</span>
                        {hasActiveFilter && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />}
                    </button>
                </div>

                {/* Filter panel */}
                {showFilter && (
                    <div className="p-4 bg-slate-50/50 grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-slate-100">
                        {/* Skill */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Kỹ năng</label>
                            <div className="relative">
                                <select
                                    value={skillFilter}
                                    onChange={e => { setSkillFilter(e.target.value); applyFilters(); }}
                                    className="w-full appearance-none pl-3 pr-7 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                                >
                                    {ALL_SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Level */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Trình độ</label>
                            <div className="relative">
                                <select
                                    value={levelFilter}
                                    onChange={e => { setLevelFilter(e.target.value); applyFilters(); }}
                                    className="w-full appearance-none pl-3 pr-7 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                                >
                                    {ALL_LEVELS.map(l => <option key={l} value={l}>{l === 'Tất cả' ? 'Tất cả' : LEVEL_LABEL[l]}</option>)}
                                </select>
                                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Type */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Loại lộ trình</label>
                            <div className="relative">
                                <select
                                    value={typeFilter}
                                    onChange={e => { setTypeFilter(e.target.value); applyFilters(); }}
                                    className="w-full appearance-none pl-3 pr-7 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                                >
                                    {ALL_TYPES.map(t => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
                                </select>
                                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Chi phí</label>
                            <div className="relative">
                                <select
                                    value={priceFilter}
                                    onChange={e => { setPriceFilter(e.target.value); applyFilters(); }}
                                    className="w-full appearance-none pl-3 pr-7 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                                >
                                    <option value="Tất cả">Tất cả</option>
                                    <option value="free">Miễn phí</option>
                                    <option value="paid">Có trả credits</option>
                                </select>
                                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Active filter chips */}
                {hasActiveFilter && (
                    <div className="px-4 py-2.5 flex items-center gap-2 flex-wrap bg-white">
                        <span className="text-[11px] font-bold text-slate-400">Đang lọc:</span>
                        {keyword && <Chip label={`"${keyword}"`} onRemove={() => setKeyword('')} />}
                        {skillFilter !== 'Tất cả' && <Chip label={skillFilter} onRemove={() => setSkillFilter('Tất cả')} />}
                        {levelFilter !== 'Tất cả' && <Chip label={LEVEL_LABEL[levelFilter]} onRemove={() => setLevelFilter('Tất cả')} />}
                        {typeFilter !== 'Tất cả' && <Chip label={TYPE_LABEL[typeFilter]} onRemove={() => setTypeFilter('Tất cả')} />}
                        {priceFilter !== 'Tất cả' && <Chip label={priceFilter === 'free' ? 'Miễn phí' : 'Có trả credits'} onRemove={() => setPriceFilter('Tất cả')} />}
                        <button onClick={clearFilters} className="text-[11px] text-rose-500 font-bold hover:text-rose-700 ml-1">Xóa tất cả</button>
                    </div>
                )}
            </div>

            {/* ── Featured / Recommended Section (shown when no keyword/filter) ── */}
            {!hasActiveFilter && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles size={17} className="text-amber-500" />
                        <h2 className="text-base font-extrabold text-slate-800">Gợi ý dành cho bạn</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {recommended.map(path => (
                            <PathCard key={path.id} path={path} />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Full Grid ── */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <LayoutGrid size={16} className="text-slate-500" />
                        <h2 className="text-base font-extrabold text-slate-800">
                            {hasActiveFilter ? `Kết quả tìm kiếm` : 'Tất cả lộ trình'}
                        </h2>
                        <span className="text-xs text-slate-400 font-medium">
                            ({loading ? '...' : filteredPaths.length} lộ trình)
                        </span>
                    </div>
                    {/* Mobile sort */}
                    <div className="relative sm:hidden">
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="appearance-none pl-3 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                        >
                            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Loading skeletons */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : filteredPaths.length === 0 ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-4xl mb-4 shadow-inner">🔍</div>
                        <h3 className="text-lg font-extrabold text-slate-700 mb-1">Không tìm thấy lộ trình phù hợp</h3>
                        <p className="text-sm text-slate-400 max-w-xs mb-6">Thử thay đổi từ khóa hoặc xóa bộ lọc để xem thêm kết quả.</p>
                        <button
                            onClick={clearFilters}
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 flex items-center gap-2"
                        >
                            <X size={15} /> Xóa bộ lọc
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredPaths.map(path => <PathCard key={path.id} path={path} />)}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Filter chip helper
// ─────────────────────────────────────────────
function Chip({ label, onRemove }) {
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-[11px] font-bold">
            {label}
            <button onClick={onRemove} className="hover:text-rose-500 ml-0.5 transition-colors"><X size={10} /></button>
        </span>
    );
}

// ─────────────────────────────────────────────
// My Path Card (Lộ trình của tôi — không hiển thị mentor support; CTA chỉ Vào học / Tiếp tục học)
// ─────────────────────────────────────────────
function MyPathCard({ path }) {
    const isCompleted = path.status === 'COMPLETED';
    const statusBadge = () => {
        if (isCompleted) return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200">Hoàn thành</span>;
        return <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">Đang học</span>;
    };

    const showContinue = !isCompleted && path.progress > 0;
    const ctaLabel = showContinue ? 'Tiếp tục học' : 'Vào học';

    const ctaButton = () => (
        <Link
            to={`/app/learning-path/study/${path.id}`}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm shadow-indigo-200 flex items-center justify-center gap-1.5"
        >
            {showContinue ? <Play size={13} className="fill-current" /> : <BookOpen size={13} />}
            {ctaLabel}
        </Link>
    );

    return (
        <div className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group
            ${isCompleted ? 'border-emerald-200' : 'border-indigo-200 hover:-translate-y-0.5'}`}>

            {/* Thumbnail */}
            <div
                className="relative h-36 flex items-center justify-center overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${path.thumbnailFrom}, ${path.thumbnailTo})` }}
            >
                <span className="text-5xl select-none opacity-90 drop-shadow-md group-hover:scale-110 transition-transform duration-300">{path.emoji}</span>
                <div className="absolute top-3 left-3">{statusBadge()}</div>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col flex-1 gap-3">
                <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">{path.title}</h3>

                {/* Progress */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-semibold">Tiến độ</span>
                        <span className={`font-black ${isCompleted ? 'text-emerald-600' : 'text-indigo-600'}`}>{path.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                            style={{ width: `${path.progress}%` }}
                        />
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                        <Layers size={11} className="inline text-slate-400 mr-0.5 align-text-bottom" />
                        Module: {path.modulesDone}/{path.modulesTotal}
                    </p>
                </div>

                {/* Module / bài hiện tại (đang học) hoặc tóm tắt khi đã xong */}
                {!isCompleted && (path.currentModuleTitle || path.currentLesson) && (
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1">
                        {path.currentModuleTitle && (
                            <p className="text-[10px] text-slate-500 font-semibold line-clamp-1">
                                <span className="text-slate-400 font-bold uppercase tracking-wider">Module: </span>
                                {path.currentModuleTitle}
                            </p>
                        )}
                        {path.currentLesson && (
                            <p className="text-xs font-semibold text-slate-800 line-clamp-2">
                                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-0.5">Bài hiện tại</span>
                                {path.currentLesson}
                            </p>
                        )}
                    </div>
                )}
                {isCompleted && (
                    <div className="text-xs text-slate-600">
                        {path.completedDate ? (
                            <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                                <CheckCircle2 size={13} className="shrink-0" /> Hoàn thành ngày {path.completedDate}
                            </span>
                        ) : (
                            <span className="text-slate-500">Đã hoàn thành toàn bộ lộ trình</span>
                        )}
                    </div>
                )}

                <div className="mt-auto pt-1">{ctaButton()}</div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// My Paths Tab
// ─────────────────────────────────────────────
function MyPathsTab({ onExplore }) {
    const [subTab, setSubTab] = useState('ongoing'); // 'ongoing' | 'completed'

    const activePaths = myPaths.filter(p => p.status !== 'COMPLETED');
    const completedPaths = myPaths.filter(p => p.status === 'COMPLETED');

    const shownPaths = subTab === 'ongoing' ? activePaths : completedPaths;

    return (
        <div className="space-y-6">
            {/* Sub-tabs: chỉ Đang học / Đã hoàn thành */}
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl w-fit">
                <button
                    type="button"
                    onClick={() => setSubTab('ongoing')}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${subTab === 'ongoing' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Đang học
                    {activePaths.length > 0 && <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-1.5 py-0.5 rounded-full">{activePaths.length}</span>}
                </button>
                <button
                    type="button"
                    onClick={() => setSubTab('completed')}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${subTab === 'completed' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Đã hoàn thành
                    {completedPaths.length > 0 && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-1.5 py-0.5 rounded-full">{completedPaths.length}</span>}
                </button>
            </div>

            {/* Cards */}
            {shownPaths.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-4xl mb-4 shadow-inner">
                        {subTab === 'ongoing' ? '📚' : '🏆'}
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-700 mb-1">
                        {subTab === 'ongoing' ? 'Bạn chưa đăng ký lộ trình nào' : 'Chưa có lộ trình hoàn thành'}
                    </h3>
                    <p className="text-sm text-slate-400 max-w-xs mb-6">
                        {subTab === 'ongoing'
                            ? 'Khám phá các lộ trình phù hợp với kỹ năng và mục tiêu của bạn.'
                            : 'Tiếp tục học để hoàn thành lộ trình đầu tiên của bạn!'}
                    </p>
                    {subTab === 'ongoing' && (
                        <button onClick={onExplore}
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 flex items-center gap-2">
                            <Search size={15} /> Khám phá lộ trình
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {shownPaths.map(path => <MyPathCard key={path.id} path={path} />)}
                    {/* Add new path card */}
                    {subTab === 'ongoing' && (
                        <button onClick={onExplore}
                            className="rounded-2xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all duration-200 group min-h-[200px]">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                                <Search size={22} className="group-hover:text-indigo-500" />
                            </div>
                            <span className="font-bold text-sm">Tìm lộ trình mới</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
const LearningPath = () => {
    const [activeTab, setActiveTab] = useState('my_paths'); // 'my_paths' | 'explore'

    return (
        <div className="max-w-6xl mx-auto font-sans pb-16 space-y-6">
            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        <Map className="text-indigo-600" size={26} />
                        {activeTab === 'my_paths' ? 'Lộ trình của tôi' : 'Khám phá lộ trình'}
                    </h1>
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


            {/* TAB: Lộ trình của tôi */}
            {activeTab === 'my_paths' && <MyPathsTab onExplore={() => setActiveTab('explore')} />}

            {/* TAB: Khám phá */}
            {activeTab === 'explore' && <ExploreTab />}
        </div>
    );
};

export default LearningPath;
