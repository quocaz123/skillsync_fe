import { useState } from 'react';
import { useStore } from '../../store';
import {
    MapPin,
    Calendar,
    Briefcase,
    Star,
    Award,
    Edit3,
    BookOpen,
    Users,
    TrendingUp,
    ShieldCheck,
    Mail,
    Globe,
    ExternalLink,
    Clock,
    Camera,
    Zap,
    GraduationCap
} from 'lucide-react';
import { AddSkillModal } from '../../components/profile/AddSkillModal';

const Profile = () => {
    const { user, credits } = useStore();
    const [activeTab, setActiveTab] = useState('learner'); // 'learner' | 'mentor'
    const [showAddSkillModal, setShowAddSkillModal] = useState(false);

    // Mock data based on the UI/UX analysis
    const learnerData = {
        totalSessions: 24,
        hoursLearning: 36,
        upcomingSessions: 2,
        interests: ['React.js', 'UI/UX Design', 'Python', 'Machine Learning', 'Figma', 'TypeScript'],
        badges: [
            { name: 'Fast Learner', icon: '🚀', color: 'from-blue-400 to-blue-600', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
            { name: 'Curious Mind', icon: '🧠', color: 'from-purple-400 to-purple-600', text: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
            { name: 'Consistent', icon: '🔥', color: 'from-orange-400 to-orange-600', text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' }
        ]
    };

    const mentorData = {
        totalSessions: 156,
        hoursTeaching: 234,
        rating: 4.8,
        reviews: 89,
        expertise: ['JavaScript', 'Frontend Dev', 'Career Advice', 'React Native', 'Node.js'],
        earnings: '3,450 CR',
        badges: [
            { name: 'Top Rated', icon: '⭐', color: 'from-amber-400 to-amber-600', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
            { name: 'Patient Teacher', icon: '🕊️', color: 'from-emerald-400 to-emerald-600', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
            { name: 'JS Expert', icon: '⚡', color: 'from-yellow-400 to-yellow-600', text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' }
        ]
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 font-sans pb-12">

            {/* Top Profile Header - Glassmorphism & Gradient */}
            <div className="bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 relative group">

                {/* Banner Gradient Modern */}
                <div className="h-48 w-full relative overflow-hidden bg-slate-900">
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/90 via-purple-600/90 to-fuchsia-600/90 z-10 mix-blend-multiply"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[80px] opacity-70 z-0 animate-pulse"></div>
                    <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-screen filter blur-[60px] opacity-60 z-0"></div>

                    {/* Banner Control */}
                    <button className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl backdrop-blur-md transition-all duration-300 flex items-center gap-2 text-sm font-medium z-20 border border-white/10 shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                        <Edit3 size={16} /> Cập nhật ảnh bìa
                    </button>
                </div>

                {/* Avatar & Info */}
                <div className="px-6 sm:px-10 pb-10 relative z-20">
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 sm:-mt-20 mb-6">
                        {/* Avatar Wrapper with glow */}
                        <div className="relative group/avatar">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-[2rem] blur opacity-30 group-hover/avatar:opacity-50 transition-opacity"></div>
                            <label className="w-32 h-32 sm:w-40 sm:h-40 relative rounded-[2rem] bg-white p-2 shadow-xl border border-white block cursor-pointer">
                                <div className="w-full h-full bg-[#f1f4f9] rounded-[1.5rem] flex items-center justify-center text-5xl sm:text-6xl text-[#3b4758] font-extrabold overflow-hidden relative">
                                    {/* Fallback to Initials */}
                                    {user?.name?.charAt(0) || 'G'}

                                    {/* Upload Overlay */}
                                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity z-10">
                                        <Camera size={28} weight="fill" className="mb-1 text-white/90 drop-shadow-md" />
                                        <span className="text-xs font-bold tracking-wide drop-shadow-md">Tải lên</span>
                                    </div>
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => console.log(e.target.files[0])} />
                                </div>
                                <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full z-20 shadow-sm"></div>
                            </label>
                        </div>

                        {/* Name & Primary Actions */}
                        <div className="flex-1 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                                    {user?.name || 'User Name'}
                                    <ShieldCheck className="text-blue-500" size={28} />
                                </h1>
                                <p className="text-slate-500 font-medium mt-1 text-lg">Thiết kế UX/UI & Lập trình viên</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm">
                                    <Edit3 size={18} /> Chỉnh sửa hồ sơ
                                </button>
                                <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-slate-900/20">
                                    Chia sẻ
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Grid / Stats Strip */}
                    <div className="flex items-center justify-between sm:justify-around text-center overflow-x-auto gap-6 hide-scrollbar pt-6 pb-2 border-t border-slate-100">
                        <div className="flex flex-col items-center shrink-0 min-w-[70px]">
                            <Zap size={24} className="text-orange-500 mb-2 fill-current" />
                            <h3 className="text-2xl font-black text-indigo-600 mb-0.5 tracking-tight">47</h3>
                            <p className="text-slate-400 text-xs sm:text-sm font-medium">Credits</p>
                        </div>
                        <div className="flex flex-col items-center shrink-0 min-w-[70px]">
                            <GraduationCap size={24} className="text-[#41396b] mb-2 fill-current" />
                            <h3 className="text-2xl font-black text-indigo-600 mb-0.5 tracking-tight">12</h3>
                            <p className="text-slate-400 text-xs sm:text-sm font-medium">Buổi dạy</p>
                        </div>
                        <div className="flex flex-col items-center shrink-0 min-w-[70px]">
                            <BookOpen size={24} className="text-emerald-500 mb-2" />
                            <h3 className="text-2xl font-black text-indigo-600 mb-0.5 tracking-tight">8</h3>
                            <p className="text-slate-400 text-xs sm:text-sm font-medium">Buổi học</p>
                        </div>
                        <div className="flex flex-col items-center shrink-0 min-w-[70px]">
                            <Star size={24} className="text-amber-400 mb-2 fill-current" />
                            <h3 className="text-2xl font-black text-indigo-600 mb-0.5 tracking-tight">4.9</h3>
                            <p className="text-slate-400 text-xs sm:text-sm font-medium">Đánh giá</p>
                        </div>
                        <div className="flex flex-col items-center shrink-0 min-w-[70px]">
                            <MapPin size={24} className="text-pink-500 mb-2 fill-current" />
                            <h3 className="text-2xl font-black text-indigo-600 mb-0.5 tracking-tight">HN</h3>
                            <p className="text-slate-400 text-xs sm:text-sm font-medium">Hà Nội</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Role Tabs Switcher - Apple iOS Style */}
            <div className="flex justify-center">
                <div className="bg-slate-100/80 backdrop-blur-md p-1.5 rounded-2xl inline-flex shadow-inner">
                    <button
                        onClick={() => setActiveTab('learner')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'learner' ? 'bg-white text-blue-600 shadow-sm shadow-slate-200/50 scale-100' : 'text-slate-500 hover:text-slate-700 scale-95 hover:scale-100'}`}
                    >
                        <BookOpen size={18} className={activeTab === 'learner' ? 'animate-bounce-slight' : ''} /> Học viên
                    </button>
                    <button
                        onClick={() => setActiveTab('mentor')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'mentor' ? 'bg-white text-purple-600 shadow-sm shadow-slate-200/50 scale-100' : 'text-slate-500 hover:text-slate-700 scale-95 hover:scale-100'}`}
                    >
                        <Users size={18} className={activeTab === 'mentor' ? 'animate-bounce-slight' : ''} /> Giảng viên
                    </button>
                </div>
            </div>

            {/* Layout Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column (Stats & Metrics based on Tab) */}
                <div className="lg:col-span-2 space-y-8 animate-in slide-in-from-bottom-4 duration-500 fade-in">



                    {/* MAIN SKILL SECTION */}
                    <div className="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm relative overflow-hidden">
                        {/* Decorative blob */}
                        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 -z-0 pointer-events-none ${activeTab === 'learner' ? 'bg-blue-100' : 'bg-purple-100'}`}></div>

                        <div className="relative z-10 flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                    {activeTab === 'learner' ? (
                                        <><BookOpen className="text-blue-500" /> Kỹ năng muốn học</>
                                    ) : (
                                        <><Star className="text-purple-500" /> Kỹ năng giảng dạy</>
                                    )}
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    {activeTab === 'learner' ? "Những chủ đề bạn muốn thành thạo" : "Cập nhật chứng chỉ để minh chứng năng lực"}
                                </p>
                            </div>
                            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm">
                                <Edit3 size={18} />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-3 relative z-10">
                            {(activeTab === 'learner' ? learnerData.interests : mentorData.expertise).map((item, idx) => (
                                <div key={idx} className={`px-5 py-2.5 rounded-xl border font-semibold text-sm transition-all hover:-translate-y-1 shadow-sm
                                    ${activeTab === 'learner'
                                        ? 'bg-blue-50/50 border-blue-200 text-blue-700 hover:shadow-blue-200'
                                        : 'bg-purple-50/50 border-purple-200 text-purple-700 hover:shadow-purple-200'
                                    }`}
                                >
                                    {item}
                                </div>
                            ))}
                            <button onClick={() => setShowAddSkillModal(true)} className="px-5 py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 font-semibold text-sm hover:bg-slate-50 hover:border-slate-400 hover:text-slate-700 transition-colors flex items-center gap-2">
                                + Thêm mới
                            </button>
                        </div>
                    </div>

                </div>

                {/* Right Column (Badges & About) */}
                <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700 fade-in">

                    {/* About Widget */}
                    <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Giới thiệu bản thân</h3>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            Tôi là một nhà thiết kế và lập trình viên đam mê với kinh nghiệm phong phú.
                            Luôn sẵn sàng học hỏi những điều mới và chia sẻ lại cho cộng đồng. Tin tưởng mạnh mẽ vào tiềm năng của giáo dục đồng đẳng!
                        </p>
                        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3">
                            <a href="#" className="flex items-center gap-3 text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors">
                                <Globe size={18} className="text-slate-400" /> myportfolio.com <ExternalLink size={14} />
                            </a>
                            <a href="#" className="flex items-center gap-3 text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors">
                                <Mail size={18} className="text-slate-400" /> hello@username.com
                            </a>
                        </div>
                    </div>

                    {/* Badges Widget */}
                    <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full mix-blend-multiply filter blur-[50px] opacity-60"></div>
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                            <Award className="text-amber-500" />
                            {activeTab === 'learner' ? 'Danh hiệu Học viên' : 'Huy hiệu Giảng viên'}
                        </h3>

                        <div className="space-y-4 relative z-10">
                            {(activeTab === 'learner' ? learnerData.badges : mentorData.badges).map((badge, idx) => (
                                <div key={idx} className={`flex items-center gap-4 p-4 rounded-2xl border ${badge.border} ${badge.bg} group hover:shadow-md transition-all`}>
                                    <div className={`w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                                        {badge.icon}
                                    </div>
                                    <div>
                                        <h4 className={`font-bold ${badge.text}`}>{badge.name}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Đạt được 2 tháng trước</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {showAddSkillModal && (
                <AddSkillModal
                    onClose={() => setShowAddSkillModal(false)}
                    onSave={(skillData) => {
                        console.log('Saved SKill:', skillData);
                        // Typically we would update the store/backend here
                    }}
                />
            )}
        </div>
    );
};

export default Profile;
