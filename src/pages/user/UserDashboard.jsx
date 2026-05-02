import { useState, useEffect } from 'react';
import { useStore } from '../../store';
import {
    Lightning, BookOpen, CalendarCheck, Star,
    PlusCircle, MagnifyingGlass, Path,
    ArrowRight, Robot, ChalkboardTeacher, Calendar, Sparkle, CircleNotch
} from '@phosphor-icons/react';
import { Link, useNavigate } from 'react-router-dom';

import { getGreeting, getDateString } from '../../utils/formatUtils';
import { getMySessions } from '../../services/sessionService';
import { getApprovedTeachingSkills } from '../../services/skillService';

// ── Sub-components ────────────────────────────────

/** Quick Action card row */
const ActionCard = ({ icon: Icon, bg, iconColor, title, sub, badge, to }) => (
    <Link to={to} className="relative bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(90,99,246,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3 group">
        {badge && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {badge}
            </span>
        )}
        <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={22} weight="duotone" className={iconColor} />
        </div>
        <div>
            <p className="font-bold text-slate-800 text-sm group-hover:text-violet-600 transition-colors">{title}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{sub}</p>
        </div>
    </Link>
);

/** Single session row */
const SessionRow = ({ session, isTeacher }) => {
    const navigate = useNavigate();
    const otherUser = isTeacher ? session.learnerName : session.teacherName;
    const badgeText = session.status === 'IN_PROGRESS' ? 'Đang diễn ra' : 'Sắp tới';
    const badgeCls = session.status === 'IN_PROGRESS' ? 'bg-red-50 text-red-600 border border-red-100 animate-pulse' : 'bg-violet-50 text-violet-600 border border-violet-100';

    return (
        <div onClick={() => navigate('/app/sessions')} className="flex items-center gap-3 py-3 px-2 group cursor-pointer hover:bg-slate-50/50 rounded-xl transition-colors">
            <div className={`w-10 h-10 rounded-[14px] ${isTeacher ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500' : 'bg-gradient-to-br from-sky-400 to-indigo-500'} text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-sm`}>
                {otherUser ? otherUser.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 text-sm truncate group-hover:text-violet-600 transition-colors">
                    {session.skillName || 'Session'}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-0.5">
                    <span>{otherUser || 'Người dùng'}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-violet-600 font-bold">{session.slotTime ? session.slotTime.substring(0, 5) : 'N/A'}</span>
                    {' '} ({session.slotDate || 'N/A'})
                </div>
            </div>
            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0 ${badgeCls}`}>{badgeText}</span>
        </div>
    );
};

/** AI Teacher recommendation card */
const TeacherCard = ({ teacher }) => {
    const rating = teacher.averageRating ?? null;
    const ratingDisplay = rating != null ? Number(rating).toFixed(1) : null;

    return (
        <Link to={`/app/explore`} className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-violet-100/50 p-5 shadow-[0_4px_20px_-4px_rgba(90,99,246,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(90,99,246,0.2)] hover:border-violet-300 hover:-translate-y-1 transition-all duration-300 group">
            <span className="absolute top-0 right-0 bg-gradient-to-br from-orange-400 to-pink-500 text-white text-[9px] font-black px-2 py-1 rounded-bl-xl rounded-tr-2xl shadow-sm tracking-wider uppercase">
                🔥 Hot
            </span>
            <div className="flex items-center gap-3 mb-4 mt-1">
                <img src={teacher.userAvatar || `https://ui-avatars.com/api/?name=${teacher.userName}&background=random`} alt="avatar" className="w-11 h-11 rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform duration-300 object-cover" />
                <div className="min-w-0">
                    <p className="font-extrabold text-slate-800 text-sm truncate group-hover:text-violet-600 transition-colors">{teacher.userName || 'Mentor'}</p>
                    <p className="text-[11px] font-bold text-slate-400 truncate bg-slate-50 inline-block px-1.5 py-0.5 rounded mt-0.5">{teacher.skill?.name || 'Kỹ năng'}</p>
                </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                {ratingDisplay != null ? (
                    <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={13} weight={i < Math.floor(Number(ratingDisplay)) ? 'fill' : 'regular'} className={i < Math.floor(Number(ratingDisplay)) ? 'text-amber-400' : 'text-slate-200'} />
                        ))}
                        <span className="text-[11px] font-bold text-slate-600 ml-1">{ratingDisplay}</span>
                    </div>
                ) : (
                    <span className="text-[11px] text-slate-400 font-medium italic">Chưa có đánh giá</span>
                )}
                <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg font-extrabold text-xs">
                    <Lightning size={12} weight="fill" />
                    {teacher.creditsPerHour}/h
                </div>
            </div>
        </Link>
    );
};

// ── Main Dashboard ────────────────────────────────
const UserDashboard = () => {
    const { user, credits } = useStore();
    const displayName = user?.name || 'Người dùng';
    
    const [upcomingTeaching, setUpcomingTeaching] = useState([]);
    const [upcomingLearning, setUpcomingLearning] = useState([]);
    const [recommendedMentors, setRecommendedMentors] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoadingData(true);
            try {
                // Fetch Sessions
                const sessionsRes = await getMySessions('all');
                const sessionsObj = sessionsRes.data ?? sessionsRes;
                const sessions = Array.isArray(sessionsObj) ? sessionsObj : [];
                
                // Filter only SCHEDULED and IN_PROGRESS
                const activeSessions = sessions.filter(s => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS');
                
                // Sort by nearest date basically
                activeSessions.sort((a, b) => new Date(a.slotDate) - new Date(b.slotDate));

                setUpcomingTeaching(activeSessions.filter(s => s.teacherId === user?.id).slice(0, 3));
                setUpcomingLearning(activeSessions.filter(s => s.learnerId === user?.id).slice(0, 3));

                // Fetch Recommended Mentors (just grab approved teaching skills)
                const mentorsRes = await getApprovedTeachingSkills({ page: 0, size: 3 });
                const mentorsObj = mentorsRes.data ?? mentorsRes;
                const mentorsList = mentorsObj.content ? mentorsObj.content : (Array.isArray(mentorsObj) ? mentorsObj : []);
                setRecommendedMentors(mentorsList.slice(0, 3));
                
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu dashboard", err);
            } finally {
                setLoadingData(false);
            }
        };
        fetchDashboardData();
    }, [user?.id]);

    const quickActions = [
        { icon: CalendarCheck, bg: 'bg-violet-100', iconColor: 'text-violet-600', title: 'Quản lý lịch', sub: 'Học và dạy', badge: (upcomingTeaching.length + upcomingLearning.length > 0) ? (upcomingTeaching.length + upcomingLearning.length) : null, to: '/app/sessions' },
        { icon: PlusCircle, bg: 'bg-teal-100', iconColor: 'text-teal-600', title: 'Thêm lịch rảnh', sub: 'Mở slot dạy mới', badge: null, to: '/app/teaching/create' },
        { icon: MagnifyingGlass, bg: 'bg-orange-100', iconColor: 'text-orange-600', title: 'Tìm người dạy', sub: 'Khám phá Mentors', badge: null, to: '/app/explore' },
        { icon: Path, bg: 'bg-pink-100', iconColor: 'text-pink-600', title: 'Lộ trình', sub: 'Học theo mảng', badge: null, to: '/app/learning-path' },
    ];


    return (
        <div className="max-w-7xl mx-auto font-sans pb-10 space-y-6 sm:space-y-8">

            {/* ─── HERO BANNER (ANIMATED MULTI-LAYER) ─── */}
            <div className="relative rounded-3xl overflow-hidden px-6 py-8 sm:p-12 shadow-xl border border-white/20 bg-slate-900 group">
                
                {/* Background Base */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#4f46e5] via-[#7c3aed] to-[#c026d3]" />
                
                {/* Animated Gradient Blob 1 */}
                <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-[spin_8s_linear_infinite]" />
                
                {/* Animated Gradient Blob 2 */}
                <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-fuchsia-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-[spin_10s_linear_infinite_reverse]" />
                
                {/* Glass Overlay to soften the blobs */}
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

                {/* Decorative floating elements */}
                <div className="absolute top-8 right-12 w-6 h-6 rounded-full bg-white/20 animate-pulse" />
                <div className="absolute bottom-12 right-1/3 w-3 h-3 rounded-full bg-white/30 animate-ping" />
                
                {/* Banner Content (Relative to stay above absolute backgrounds) */}
                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    
                    {/* Left: Text */}
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-[11px] font-bold mb-4 border border-white/20 shadow-inner">
                            <Sparkle size={12} weight="fill" className="text-yellow-300 animate-pulse" />
                            <span>{getGreeting()}</span>
                            <span className="w-1 h-1 rounded-full bg-white/50" />
                            <span>{getDateString()}</span>
                        </div>
                        
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight mb-2 drop-shadow-sm">
                            Sẵn sàng nâng tầm kỹ năng, {displayName.split(' ')[0]}?
                        </h1>
                        <p className="text-sm sm:text-base text-white/75 font-medium mb-6 leading-relaxed">
                            Khám phá hàng ngàn mentor chất lượng, hoặc chia sẻ kiến thức của chính bạn. Nền tảng trao đổi kỹ năng đột phá nhất.
                        </p>
                        
                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <Link to="/app/explore">
                                <button className="flex items-center gap-2 px-6 py-3 bg-white text-violet-700 font-extrabold text-sm rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] hover:bg-slate-50 hover:-translate-y-0.5 active:scale-95 transition-all duration-300">
                                    <MagnifyingGlass size={16} weight="bold" /> Tìm Mentor
                                </button>
                            </Link>
                            <Link to="/app/teaching/create">
                                <button className="flex items-center gap-2 px-6 py-3 bg-white/15 backdrop-blur-md text-white font-bold text-sm rounded-xl border border-white/30 hover:bg-white/25 hover:-translate-y-0.5 active:scale-95 transition-all duration-300">
                                    <Calendar size={16} weight="duotone" /> Mở lớp mới
                                </button>
                            </Link>
                        </div>
                    </div>
                    
                    {/* Right: Floating Glass Card for Credits */}
                    <div className="flex items-center justify-center p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl relative overflow-hidden group-hover:bg-white/15 transition-colors duration-500 min-w-[200px]">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50" />
                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 mb-1">
                                <Lightning size={28} weight="fill" className="text-white" />
                            </div>
                            <span className="text-white font-black text-4xl tracking-tight drop-shadow-md">
                                {credits ?? 0}
                            </span>
                            <span className="text-white/70 text-xs font-bold uppercase tracking-widest">
                                Số dư Credits
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── QUICK ACTIONS ─── */}
            <div className="relative z-10 -mt-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
                    {quickActions.map((a, i) => (
                        <ActionCard key={i} {...a} />
                    ))}
                </div>
            </div>

            {/* ─── UPCOMING SESSIONS ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

                {/* Teaching */}
                <div className="bg-white/50 backdrop-blur-xl rounded-[2rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-7 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-400/5 rounded-full blur-3xl -z-10 group-hover:bg-violet-400/10 transition-colors duration-500" />
                    
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-black text-slate-800 text-lg flex items-center gap-2">
                            <ChalkboardTeacher size={22} weight="duotone" className="text-violet-500" />
                            Buổi sắp dạy
                        </h2>
                        {upcomingTeaching.length > 0 && (
                            <Link to="/app/sessions" className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wide text-violet-600 hover:text-violet-700 hover:bg-violet-50 px-2 py-1 rounded-md transition-colors">
                                Quản lý <ArrowRight size={12} weight="bold" />
                            </Link>
                        )}
                    </div>
                    
                    <div className="space-y-1 relative z-10">
                        {loadingData ? (
                            <div className="flex justify-center py-6"><CircleNotch size={24} className="animate-spin text-violet-400" /></div>
                        ) : upcomingTeaching.length > 0 ? (
                            upcomingTeaching.map((s, i) => <SessionRow key={i} session={s} isTeacher={true} />)
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                    <ChalkboardTeacher size={28} weight="duotone" className="text-slate-300" />
                                </div>
                                <p className="text-sm font-bold text-slate-500">Bạn đang rất rảnh</p>
                                <p className="text-xs text-slate-400 mb-4 mt-1 text-center max-w-[200px]">Chưa có lịch dạy nào đang chờ đón. Hãy mở thêm slot dạy nhé!</p>
                                <Link to="/app/teaching/create" className="text-xs font-extrabold text-violet-600 bg-violet-50 px-4 py-2 rounded-xl hover:bg-violet-100 transition-colors">
                                    Mở slot ngay
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Learning */}
                <div className="bg-white/50 backdrop-blur-xl rounded-[2rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-7 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-400/5 rounded-full blur-3xl -z-10 group-hover:bg-sky-400/10 transition-colors duration-500" />

                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-black text-slate-800 text-lg flex items-center gap-2">
                            <BookOpen size={22} weight="duotone" className="text-sky-500" />
                            Buổi sắp học
                        </h2>
                        {upcomingLearning.length > 0 && (
                            <Link to="/app/sessions" className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wide text-sky-600 hover:text-sky-700 hover:bg-sky-50 px-2 py-1 rounded-md transition-colors">
                                Lịch học <ArrowRight size={12} weight="bold" />
                            </Link>
                        )}
                    </div>
                    
                    <div className="space-y-1 relative z-10">
                        {loadingData ? (
                            <div className="flex justify-center py-6"><CircleNotch size={24} className="animate-spin text-sky-400" /></div>
                        ) : upcomingLearning.length > 0 ? (
                            upcomingLearning.map((s, i) => <SessionRow key={i} session={s} isTeacher={false} />)
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                    <BookOpen size={28} weight="duotone" className="text-slate-300" />
                                </div>
                                <p className="text-sm font-bold text-slate-500">Chuẩn bị thêm kiến thức?</p>
                                <p className="text-xs text-slate-400 mb-4 mt-1 text-center max-w-[200px]">Nâng cấp bản thân ngay bằng cách tìm Mentor xịn.</p>
                                <Link to="/app/explore" className="text-xs font-extrabold text-sky-600 bg-sky-50 px-4 py-2 rounded-xl hover:bg-sky-100 transition-colors">
                                    Tìm khoá học
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default UserDashboard;
