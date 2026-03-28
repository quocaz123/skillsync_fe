import { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store';
import {
    MapPin,
    CalendarDays,
    Star,
    Medal,
    Edit3,
    Compass,
    Users,
    ShieldCheck,
    AtSign,
    Camera,
    Coins,
    Presentation,
    Laptop,
    Loader2,
    X,
    Activity,
    Target,
    Lightbulb,
    UserRound
} from 'lucide-react';
import { AddSkillModal } from '../../components/profile/AddSkillModal.jsx';
import { uploadFile } from '../../services/uploadService.js';
import { getMyProfile, updateAvatar, updateBio } from '../../services/userService.js';
import { getMyTeachingSkills, deleteTeachingSkill } from '../../services/skillService.js';
import { trackAction } from '../../services/missionService.js';

const LEVEL_LABEL = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
    EXPERT: 'Expert',
};

const Profile = () => {
    const { user, setUser } = useStore();
    const [profile, setProfile] = useState(null);
    const [activeTab, setActiveTab] = useState('learner'); // 'learner' | 'mentor'
    const [showAddSkillModal, setShowAddSkillModal] = useState(false);

    // Avatar state
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || null);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const avatarInputRef = useRef(null);

    // Bio editing
    const [bioEditing, setBioEditing] = useState(false);
    const [bioValue, setBioValue] = useState('');
    const [bioSaving, setBioSaving] = useState(false);

    // Teaching skills state
    const [teachingSkills, setTeachingSkills] = useState([]);
    const [loadingSkills, setLoadingSkills] = useState(false);

    // Load profile + teaching skills on mount
    useEffect(() => {
        getMyProfile()
            .then(p => {
                if (p) {
                    setProfile(p);
                    if (p.avatarUrl) setAvatarUrl(p.avatarUrl);
                    if (setUser) setUser(prev => ({ ...prev, ...p }));
                    setBioValue(p.bio || '');
                }
            })
            .catch(err => console.error('Failed to load profile:', err));

        loadTeachingSkills();
    }, []);

    const loadTeachingSkills = async () => {
        setLoadingSkills(true);
        try {
            const data = await getMyTeachingSkills();
            setTeachingSkills(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load teaching skills:', err);
        } finally {
            setLoadingSkills(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file ảnh (JPG, PNG, WEBP)');
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setAvatarUrl(previewUrl);
        setAvatarUploading(true);

        try {
            const { fileKey } = await uploadFile(file, 'AVATAR');
            const updatedUser = await updateAvatar(fileKey);
            const newUrl = updatedUser?.avatarUrl;
            if (newUrl) {
                setAvatarUrl(newUrl);
                setProfile(prev => ({ ...prev, avatarUrl: newUrl }));
                if (setUser) setUser(prev => ({ ...prev, avatarUrl: newUrl }));
            }
        } catch (err) {
            console.error('Avatar upload failed:', err);
            setAvatarUrl(user?.avatarUrl || null);
            alert('Upload avatar thất bại. Vui lòng thử lại.');
        } finally {
            setAvatarUploading(false);
            URL.revokeObjectURL(previewUrl);
        }
    };

    const handleSaveBio = async () => {
        setBioSaving(true);
        try {
            const updated = await updateBio(bioValue);
            if (updated) {
                setProfile(prev => ({ ...prev, bio: updated.bio }));
                if (setUser) setUser(prev => ({ ...prev, bio: updated.bio }));
            }
            setBioEditing(false);
        } catch (err) {
            console.error('Bio save failed:', err);
            alert('Lưu bio thất bại. Vui lòng thử lại.');
        } finally {
            setBioSaving(false);
        }
    };

    const handleDeleteSkill = async (skillId) => {
        if (!confirm('Bạn có chắc muốn xóa kỹ năng dạy này?')) return;
        try {
            await deleteTeachingSkill(skillId);
            setTeachingSkills(prev => prev.filter(s => s.id !== skillId));
        } catch (err) {
            console.error('Delete skill failed:', err);
            alert('Xóa thất bại. Vui lòng thử lại.');
        }
    };

    const handleSkillSaved = (newSkill) => {
        if (newSkill) setTeachingSkills(prev => [newSkill, ...prev]);
    };

    // Derived display values
    const displayName = profile?.name || user?.name || 'User';
    const credits = profile?.creditsBalance ?? user?.creditsBalance ?? 0;
    const trustScore = profile?.trustScore ?? 50;
    const averageRating = profile?.averageRating;
    const totalTeachingSessions = profile?.totalTeachingSessions ?? 0;
    const totalLearningSessions = profile?.totalLearningSessions ?? 0;
    const totalReviews = profile?.totalReviews ?? 0;
    const learningInterests = profile?.learningInterests ?? [];
    const joinedDate = profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
        : null;

    return (
        <div className="max-w-6xl mx-auto space-y-8 font-sans pb-12">

            {/* Top Profile Header */}
            <div className="bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 relative group">

                {/* Banner */}
                <div className="h-48 w-full relative overflow-hidden bg-slate-900">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/90 via-purple-600/90 to-fuchsia-600/90 z-10 mix-blend-multiply"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[80px] opacity-70 z-0 animate-pulse"></div>
                    <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-screen filter blur-[60px] opacity-60 z-0"></div>
                </div>

                {/* Avatar & Info */}
                <div className="px-6 sm:px-10 pb-10 relative z-20">
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 sm:-mt-20 mb-6">

                        {/* Avatar with upload */}
                        <div className="relative group/avatar">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-[2rem] blur opacity-30 group-hover/avatar:opacity-50 transition-opacity"></div>
                            <label className="w-32 h-32 sm:w-40 sm:h-40 relative rounded-[2rem] bg-white p-2 shadow-xl border border-white block cursor-pointer">
                                <div className="w-full h-full bg-[#f1f4f9] rounded-[1.5rem] flex items-center justify-center text-5xl sm:text-6xl text-[#3b4758] font-extrabold overflow-hidden relative">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover rounded-[1.5rem]" />
                                    ) : (
                                        <span>{displayName?.charAt(0)?.toUpperCase() || 'U'}</span>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity z-10 rounded-[1.5rem]">
                                        {avatarUploading
                                            ? <Loader2 size={28} className="animate-spin mb-1 text-white/90" />
                                            : <Camera size={28} className="mb-1 text-white/90 drop-shadow-md" />
                                        }
                                        <span className="text-xs font-bold tracking-wide drop-shadow-md">
                                            {avatarUploading ? 'Đang tải...' : 'Tải lên'}
                                        </span>
                                    </div>
                                    <input
                                        ref={avatarInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                        disabled={avatarUploading}
                                    />
                                </div>
                                <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full z-20 shadow-sm"></div>
                            </label>
                        </div>

                        {/* Name & Actions */}
                        <div className="flex-1 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                                    {displayName}
                                    <ShieldCheck className="text-blue-500" size={28} />
                                </h1>
                                {joinedDate && (
                                    <p className="text-slate-400 text-sm mt-1 flex items-center gap-1.5">
                                        <CalendarDays size={14} /> Tham gia {joinedDate}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm">
                                    <Edit3 size={18} /> Chỉnh sửa hồ sơ
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Strip */}
                    <div className="flex items-center justify-between sm:justify-around text-center overflow-x-auto gap-6 hide-scrollbar pt-6 pb-2 border-t border-slate-100">
                        <div className="flex flex-col items-center shrink-0 min-w-[70px]">
                            <Coins size={24} className="text-amber-500 mb-2" />
                            <h3 className="text-2xl font-black text-indigo-600 mb-0.5 tracking-tight">{credits}</h3>
                            <p className="text-slate-400 text-xs sm:text-sm font-medium">Credits</p>
                        </div>
                        <div className="flex flex-col items-center shrink-0 min-w-[70px]">
                            <Presentation size={24} className="text-indigo-500 mb-2" />
                            <h3 className="text-2xl font-black text-indigo-600 mb-0.5 tracking-tight">{totalTeachingSessions}</h3>
                            <p className="text-slate-400 text-xs sm:text-sm font-medium">Buổi dạy</p>
                        </div>
                        <div className="flex flex-col items-center shrink-0 min-w-[70px]">
                            <Laptop size={24} className="text-emerald-500 mb-2" />
                            <h3 className="text-2xl font-black text-indigo-600 mb-0.5 tracking-tight">{totalLearningSessions}</h3>
                            <p className="text-slate-400 text-xs sm:text-sm font-medium">Buổi học</p>
                        </div>
                        <div className="flex flex-col items-center shrink-0 min-w-[70px]">
                            <Star size={24} className="text-amber-400 mb-2 fill-current" />
                            <h3 className="text-2xl font-black text-indigo-600 mb-0.5 tracking-tight">
                                {averageRating != null ? averageRating.toFixed(1) : '—'}
                            </h3>
                            <p className="text-slate-400 text-xs sm:text-sm font-medium">
                                Đánh giá{totalReviews > 0 ? ` (${totalReviews})` : ''}
                            </p>
                        </div>
                        <div className="flex flex-col items-center shrink-0 min-w-[70px]">
                            <Activity size={24} className="text-rose-500 mb-2" />
                            <h3 className="text-2xl font-black text-indigo-600 mb-0.5 tracking-tight">{trustScore}</h3>
                            <p className="text-slate-400 text-xs sm:text-sm font-medium">Trust</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Role Tabs */}
            <div className="flex justify-center">
                <div className="bg-slate-100/80 backdrop-blur-md p-1.5 rounded-2xl inline-flex shadow-inner">
                    <button
                        onClick={() => setActiveTab('learner')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'learner' ? 'bg-white text-blue-600 shadow-sm shadow-slate-200/50 scale-100' : 'text-slate-500 hover:text-slate-700 scale-95 hover:scale-100'}`}
                    >
                        <Compass size={18} /> Học viên
                    </button>
                    <button
                        onClick={() => setActiveTab('mentor')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'mentor' ? 'bg-white text-purple-600 shadow-sm shadow-slate-200/50 scale-100' : 'text-slate-500 hover:text-slate-700 scale-95 hover:scale-100'}`}
                    >
                        <Users size={18} /> Giảng viên
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column — Skills */}
                <div className="lg:col-span-2 space-y-8 animate-in slide-in-from-bottom-4 duration-500 fade-in">
                    <div className="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 -z-0 pointer-events-none ${activeTab === 'learner' ? 'bg-blue-100' : 'bg-purple-100'}`}></div>

                        <div className="relative z-10 flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                    {activeTab === 'learner' ? (
                                        <><Target className="text-blue-500" /> Kỹ năng muốn học</>
                                    ) : (
                                        <><Lightbulb className="text-purple-500" /> Kỹ năng giảng dạy</>
                                    )}
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    {activeTab === 'learner' ? 'Những chủ đề bạn muốn thành thạo' : 'Cập nhật chứng chỉ để minh chứng năng lực'}
                                </p>
                            </div>
                            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm">
                                <Edit3 size={18} />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-3 relative z-10">
                            {activeTab === 'learner' ? (
                                learningInterests.length === 0 ? (
                                    <p className="text-slate-400 text-sm">Bạn chưa đăng ký học kỹ năng nào.</p>
                                ) : (
                                    learningInterests.map((item, idx) => (
                                        <div
                                            key={idx}
                                            title={item.learningGoal || ''}
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border font-semibold text-sm transition-all hover:-translate-y-1 shadow-sm bg-blue-50/50 border-blue-200 text-blue-700 hover:shadow-blue-200"
                                        >
                                            {item.skillIcon && <span>{item.skillIcon}</span>}
                                            <span>{item.skillName}</span>
                                            {item.desiredLevel && (
                                                <span className="text-[10px] bg-blue-100 px-1.5 py-0.5 rounded font-bold">
                                                    {LEVEL_LABEL[item.desiredLevel] || item.desiredLevel}
                                                </span>
                                            )}
                                        </div>
                                    ))
                                )
                            ) : loadingSkills ? (
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Loader2 size={18} className="animate-spin" />
                                    <span className="text-sm">Đang tải...</span>
                                </div>
                            ) : teachingSkills.length === 0 ? (
                                <p className="text-slate-400 text-sm">Bạn chưa có kỹ năng dạy nào. Thêm ngay!</p>
                            ) : (
                                teachingSkills.map((ts) => (
                                    <div key={ts.id} className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm bg-purple-50/50 border-purple-200 text-purple-700 hover:shadow-purple-200 hover:-translate-y-1 transition-all shadow-sm">
                                        <span>{ts.skillIcon}</span>
                                        <span>{ts.skillName}</span>
                                        <span className="text-[10px] bg-purple-100 px-1.5 py-0.5 rounded font-bold">{ts.level}</span>
                                        <button
                                            onClick={() => handleDeleteSkill(ts.id)}
                                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all ml-1"
                                            title="Xóa"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))
                            )}

                            {activeTab === 'mentor' && (
                                <button
                                    onClick={() => setShowAddSkillModal(true)}
                                    className="px-5 py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 font-semibold text-sm hover:bg-slate-50 hover:border-slate-400 hover:text-slate-700 transition-colors flex items-center gap-2"
                                >
                                    + Thêm mới
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700 fade-in">

                    {/* About / Bio */}
                    <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <UserRound className="text-indigo-500" size={20} /> Giới thiệu bản thân
                            </h3>
                            {!bioEditing && (
                                <button
                                    onClick={() => { setBioEditing(true); setBioValue(profile?.bio || ''); }}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                    title="Chỉnh sửa bio"
                                >
                                    <Edit3 size={16} />
                                </button>
                            )}
                        </div>

                        {bioEditing ? (
                            <div className="space-y-3">
                                <textarea
                                    className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    rows={5}
                                    maxLength={500}
                                    value={bioValue}
                                    onChange={e => setBioValue(e.target.value)}
                                    placeholder="Viết vài dòng giới thiệu về bản thân..."
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSaveBio}
                                        disabled={bioSaving}
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-60 transition-colors"
                                    >
                                        {bioSaving ? 'Đang lưu...' : 'Lưu'}
                                    </button>
                                    <button
                                        onClick={() => setBioEditing(false)}
                                        className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-600 leading-relaxed text-sm">
                                {profile?.bio || <span className="italic text-slate-400">Chưa có giới thiệu. Nhấn ✏️ để thêm.</span>}
                            </p>
                        )}

                        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                                <AtSign size={18} className="text-slate-400" />
                                {profile?.email || user?.email || '—'}
                            </div>
                            {joinedDate && (
                                <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                                    <CalendarDays size={18} className="text-slate-400" />
                                    Tham gia {joinedDate}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Trust Score Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full mix-blend-multiply filter blur-[50px] opacity-60"></div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 relative z-10">
                            <Medal className="text-amber-500" /> Điểm uy tín
                        </h3>
                        <div className="relative z-10">
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-4xl font-black text-indigo-600">{trustScore}</span>
                                <span className="text-slate-400 text-sm mb-1">/ 100</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all duration-700"
                                    style={{ width: `${Math.min(trustScore, 100)}%` }}
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-2">
                                {trustScore >= 80 ? '🌟 Uy tín cao — được cộng đồng tin tưởng'
                                    : trustScore >= 50 ? '✅ Hoạt động ổn định'
                                        : '⚠️ Hoàn thành buổi học để tăng điểm uy tín'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {showAddSkillModal && (
                <AddSkillModal
                    onClose={() => setShowAddSkillModal(false)}
                    onSave={(newSkill) => {
                        handleSkillSaved(newSkill);
                        setShowAddSkillModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default Profile;
