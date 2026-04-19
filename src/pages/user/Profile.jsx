import { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store';
import {
    MapPin,
    CalendarBlank,
    Star,
    Medal,
    PencilSimple,
    Compass,
    Users,
    ShieldCheck,
    At,
    Camera,
    Coin,
    ChalkboardTeacher,
    Laptop,
    CircleNotch,
    X,
    Heartbeat,
    Target,
    Lightbulb,
    UserCircle
} from '@phosphor-icons/react';
import { AddSkillModal } from '../../components/profile/AddSkillModal.jsx';
import { SkillDynamicIcon } from '../../components/common/SkillDynamicIcon.jsx';
import Avatar from '../../components/common/Avatar';
import { uploadFile } from '../../services/uploadService.js';
import { getMyProfile, updateAvatar, updateBio } from '../../services/userService.js';
import { getMyTeachingSkills, deleteTeachingSkill, updateSkillPrice, toggleTeachingSkillVisibility } from '../../services/skillService.js';
import { getReviewsByUserId } from '../../services/reviewService.js';

const LEVEL_LABEL = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
    EXPERT: 'Expert',
};

const Profile = () => {
    const { user, setUser } = useStore();
    const [profile, setProfile] = useState(null);
    const [activeTab, setActiveTab] = useState('mentor'); // 'mentor' | 'reviews'
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

    // Reviews state
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    // Lazy-load reviews when tab is first switched
    useEffect(() => {
        if (activeTab !== 'reviews' || reviews.length > 0) return;
        setLoadingReviews(true);
        getReviewsByUserId(user?.id)
            .then(data => setReviews(Array.isArray(data) ? data : []))
            .catch(() => setReviews([]))
            .finally(() => setLoadingReviews(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

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
            const { fileKey, fileUrl } = await uploadFile(file, 'AVATAR');
            const updatedUser = await updateAvatar(fileKey);
            // avatarUrl từ BE (buildPublicUrl) — fallback fileUrl nếu response thiếu field
            const newUrl = updatedUser?.avatarUrl ?? fileUrl;
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

    const handleToggleSkillVisibility = async (ts) => {
        try {
            const updated = await toggleTeachingSkillVisibility(ts.id);
            setTeachingSkills(prev => prev.map(s => (s.id === ts.id ? { ...s, hidden: updated.hidden } : s)));
        } catch (err) {
            console.error('Toggle visibility failed:', err);
            alert('Không thể cập nhật trạng thái hiển thị.');
        }
    };

    const handleEditPrice = async (ts) => {
        const newPrice = prompt(`Nhập mức giá mới cho kỹ năng ${ts.skillName} (Credits/Giờ):\nLưu ý: Hệ thống hỗ trợ tối đa 500 cr/h`, ts.creditsPerHour || 5);
        if (!newPrice) return;
        
        const priceVal = parseInt(newPrice, 10);
        if (isNaN(priceVal) || priceVal < 1 || priceVal > 500) {
            alert('Vui lòng nhập giá từ 1 đến 500 credits hợp lệ.');
            return;
        }

        try {
            await updateSkillPrice(ts.id, priceVal);
            setTeachingSkills(prev => prev.map(s => s.id === ts.id ? { ...s, creditsPerHour: priceVal } : s));
            alert('Cập nhật giá thành công!');
        } catch (err) {
            console.error('Update price failed:', err);
            alert('Cập nhật giá thất bại. Giá có thể đã vượt quá giới hạn hệ thống.');
        }
    };

    const handleSkillSaved = (newSkill) => {
        if (newSkill) setTeachingSkills(prev => [newSkill, ...prev]);
    };

    // Derived display values
    const displayName = profile?.name || user?.name || 'User';
    const credits = profile?.creditsBalance ?? user?.creditsBalance ?? 0;

    const averageRating = profile?.averageRating;
    const totalTeachingSessions = profile?.totalTeachingSessions ?? 0;
    const totalLearningSessions = profile?.totalLearningSessions ?? 0;
    const totalReviews = profile?.totalReviews ?? 0;
    const joinedDate = profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
        : null;

    return (
        <div className="max-w-6xl mx-auto space-y-8 font-sans pb-12">

            {/* Top Profile Header */}
            <div className="bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(90,99,246,0.1)] transition-shadow duration-300 relative group">

                {/* Banner */}
                <div className="h-48 w-full relative overflow-hidden bg-slate-900">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 z-10 opacity-90 mix-blend-multiply"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-screen filter blur-[80px] opacity-70 z-0 animate-[pulse_6s_ease-in-out_infinite]"></div>
                    <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-fuchsia-400 rounded-full mix-blend-screen filter blur-[60px] opacity-60 z-0 animate-[pulse_8s_ease-in-out_infinite]"></div>
                </div>

                {/* Avatar & Info */}
                <div className="px-6 sm:px-10 pb-10 relative z-20">
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 sm:-mt-20 mb-6">

                        {/* Avatar with upload */}
                        <div className="relative group/avatar">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500 rounded-[2rem] blur-xl opacity-40 group-hover/avatar:opacity-75 transition-all duration-500 scale-105"></div>
                            <label className="w-32 h-32 sm:w-40 sm:h-40 relative rounded-[2rem] bg-white p-2 shadow-2xl border border-white/50 block cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
                                <div className="w-full h-full bg-[#f1f4f9] rounded-[1.5rem] flex items-center justify-center text-5xl sm:text-6xl text-[#3b4758] font-extrabold overflow-hidden relative">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover rounded-[1.5rem]" />
                                    ) : (
                                        <span>{displayName?.charAt(0)?.toUpperCase() || 'U'}</span>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 z-10 rounded-[1.5rem]">
                                        {avatarUploading
                                            ? <CircleNotch size={32} weight="bold" className="animate-spin mb-1 text-white/90" />
                                            : <Camera size={32} weight="duotone" className="mb-1 text-white/90 drop-shadow-md" />
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
                                {/* Status dot */}
                                <div className="absolute bottom-1 right-1 w-7 h-7 bg-emerald-500 border-4 border-white rounded-full z-20 shadow-md"></div>
                            </label>
                        </div>

                        {/* Name & Actions */}
                        <div className="flex-1 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                                    {displayName}
                                    <ShieldCheck className="text-blue-500" weight="fill" size={32} />
                                </h1>
                                {joinedDate && (
                                    <p className="text-slate-500 font-medium text-sm mt-1.5 flex items-center gap-1.5">
                                        <CalendarBlank size={16} weight="duotone" className="text-slate-400" /> Tham gia từ {joinedDate}
                                    </p>
                                )}
                            </div>
                            {/* Edit Profile button removed */}
                        </div>

                        {/* Stats Strip */}
                    <div className="flex items-center justify-between sm:justify-around text-center overflow-x-auto gap-6 hide-scrollbar pt-6 pb-2 border-t border-slate-100">
                        <div className="flex flex-col items-center shrink-0 min-w-[70px] group/stat">
                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-2 group-hover/stat:scale-110 group-hover/stat:bg-amber-100 transition-all">
                                <Coin size={26} weight="duotone" className="text-amber-500" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{credits}</h3>
                            <p className="text-slate-400 text-xs sm:text-sm font-bold">Credits</p>
                        </div>
                        <div className="flex flex-col items-center shrink-0 min-w-[70px] group/stat">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-2 group-hover/stat:scale-110 group-hover/stat:bg-indigo-100 transition-all">
                                <ChalkboardTeacher size={26} weight="duotone" className="text-indigo-500" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{totalTeachingSessions}</h3>
                            <p className="text-slate-400 text-xs sm:text-sm font-bold">Buổi dạy</p>
                        </div>
                        <div className="flex flex-col items-center shrink-0 min-w-[70px] group/stat">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-2 group-hover/stat:scale-110 group-hover/stat:bg-emerald-100 transition-all">
                                <Laptop size={26} weight="duotone" className="text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{totalLearningSessions}</h3>
                            <p className="text-slate-400 text-xs sm:text-sm font-bold">Buổi học</p>
                        </div>
                        <div className="flex flex-col items-center shrink-0 min-w-[70px] group/stat">
                            <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center mb-2 group-hover/stat:scale-110 group-hover/stat:bg-yellow-100 transition-all">
                                <Star size={26} weight="fill" className="text-yellow-400" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                                {averageRating != null ? averageRating.toFixed(1) : '—'}
                            </h3>
                            <p className="text-slate-400 text-xs sm:text-sm font-bold">
                                Đánh giá{totalReviews > 0 ? ` (${totalReviews})` : ''}
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Role Tabs */}
            <div className="flex justify-center">
                <div className="bg-slate-100/90 backdrop-blur-md p-1.5 rounded-2xl inline-flex shadow-inner border border-slate-200/50">
                    <button
                        onClick={() => setActiveTab('mentor')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-extrabold transition-all duration-300 ${activeTab === 'mentor' ? 'bg-white text-purple-600 shadow-md scale-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 scale-95 hover:scale-100'}`}
                    >
                        <Users size={20} weight={activeTab === 'mentor' ? 'duotone' : 'regular'} /> Hồ sơ mentor
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-extrabold transition-all duration-300 ${activeTab === 'reviews' ? 'bg-white text-amber-600 shadow-md scale-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 scale-95 hover:scale-100'}`}
                    >
                        <Star size={20} weight={activeTab === 'reviews' ? 'duotone' : 'regular'} /> Đánh giá từ học viên
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column — Skills */}
                <div className="lg:col-span-2 space-y-8 animate-[slideIn_0.5s_ease-out]">
                    <div className="bg-white rounded-[2rem] border border-slate-200/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group/skills">
                        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 -z-0 pointer-events-none transition-colors duration-1000 ${activeTab === 'mentor' ? 'bg-purple-100' : 'bg-amber-100'}`}></div>

                        <div className="relative z-10 flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                    {activeTab === 'mentor' ? (
                                        <><Lightbulb size={28} weight="duotone" className="text-purple-500" /> Kỹ năng giảng dạy</>
                                    ) : (
                                        <><Star size={28} weight="duotone" className="text-amber-500" /> Đánh giá từ Học viên</>
                                    )}
                                </h2>
                                <p className="text-slate-500 mt-1 font-medium text-sm">
                                    {activeTab === 'mentor' ? 'Chứng minh năng lực của bạn với cộng đồng' : 'Những lời nhận xét mang lại động lực phát triển'}
                                </p>
                            </div>
                            {/* Section edit button removed */}
                        </div>

                        <div className="flex flex-wrap gap-3 relative z-10">
                            {activeTab === 'mentor' ? (
                                loadingSkills ? (
                                    <div className="w-full flex flex-col items-center py-10 gap-2 text-slate-400">
                                        <CircleNotch size={28} weight="bold" className="animate-spin text-purple-400" />
                                        <span className="font-semibold text-sm">Đang tải kỹ năng...</span>
                                    </div>
                                ) : teachingSkills.length === 0 ? (
                                    <div className="w-full py-10 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                        <Lightbulb size={32} weight="duotone" className="text-slate-300 mb-2" />
                                        <p className="text-slate-400 font-medium">Bạn chưa thiết lập Kỹ năng giảng dạy. Thêm ngay!</p>
                                    </div>
                                ) : (
                                    teachingSkills.map((ts) => {
                                        let cfg = {};
                                        if (ts.verificationStatus === 'APPROVED' && ts.hidden) {
                                            cfg = { bg: 'bg-gradient-to-br from-slate-100 to-slate-50 border-slate-200/80 text-slate-700 hover:shadow-slate-200', badge: 'bg-slate-200 text-slate-600 border-slate-300', badgeText: '🔕 Tạm ẩn' };
                                        } else if (ts.verificationStatus === 'APPROVED') {
                                            cfg = { bg: 'bg-gradient-to-br from-purple-50 to-fuchsia-50/50 border-purple-200/60 text-purple-800 hover:shadow-purple-200', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', badgeText: '✅ Đã duyệt' };
                                        } else if (ts.verificationStatus === 'REJECTED') {
                                            cfg = { bg: 'bg-gradient-to-br from-red-50 to-rose-50/50 border-red-200/60 text-red-800 hover:shadow-red-200 opacity-90', badge: 'bg-red-100 text-red-700 border-red-200', badgeText: '❌ Bị từ chối' };
                                        } else {
                                            cfg = { bg: 'bg-gradient-to-br from-amber-50 to-yellow-50/50 border-amber-200/60 text-amber-800 hover:shadow-amber-200 opacity-90', badge: 'bg-amber-100 text-amber-700 border-amber-200', badgeText: '⏳ Đang chờ' };
                                        }

                                        return (
                                        <div key={ts.id} className={`group relative pr-10 flex flex-col items-start gap-2.5 px-5 py-4 rounded-2xl border font-bold text-sm shadow-sm hover:-translate-y-1 transition-all ${cfg.bg}`}>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <SkillDynamicIcon skillName={ts.skillName} defaultIcon={ts.skillIcon} className="text-base" size={16} />
                                                <span className="text-[15px]">{ts.skillName}</span>
                                                <span className="text-[10px] bg-white border border-slate-200 text-slate-500 uppercase tracking-wider px-2 py-0.5 rounded-md font-black shadow-sm ml-1">{ts.level}</span>
                                                <span className={`text-[10px] border px-2 py-0.5 rounded-md font-black shadow-sm ml-1 ${cfg.badge}`}>{cfg.badgeText}</span>
                                            </div>
                                            
                                            {ts.verificationStatus === 'REJECTED' && ts.rejectionReason && (
                                                <p className="text-[11px] text-red-600 bg-white/70 p-2.5 rounded-xl italic font-medium w-full border border-red-100/50">Phản hồi từ Admin: {ts.rejectionReason}</p>
                                            )}

                                            <div className="flex items-center gap-2 mt-1 -ml-1">
                                                <span className="text-[12px] text-slate-700 bg-white/80 px-2.5 py-1 rounded-xl shadow-sm flex items-center gap-1 border border-slate-200/40">
                                                    <Coin size={14} weight="fill" className="text-amber-500" />
                                                    {ts.creditsPerHour || 5} cr/h
                                                </span>
                                            </div>
                                            {/* Skill management buttons removed */}
                                        </div>
                                    )})
                                )
                            ) : (
                                <div className="w-full flex flex-col gap-4">
                                    {loadingReviews ? (
                                        <div className="w-full flex flex-col items-center py-10 gap-2 text-slate-400">
                                            <CircleNotch size={28} weight="bold" className="animate-spin text-amber-400" />
                                            <span className="font-semibold text-sm">Đang nạp phản hồi...</span>
                                        </div>
                                    ) : reviews.length === 0 ? (
                                        <div className="w-full py-10 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                            <Star size={32} weight="duotone" className="text-slate-300 mb-2" />
                                            <p className="text-slate-400 font-medium">Chưa có đánh giá nào từ học viên. Hãy hoàn thành nhiều buổi học nhé!</p>
                                        </div>
                                    ) : (
                                        reviews.map((r) => (
                                            <div key={r.id} className="bg-gradient-to-br from-amber-50 to-yellow-50/30 border border-amber-100/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar
                                                            src={r.reviewerAvatar}
                                                            fallback={r.reviewerName?.charAt(0)}
                                                            size="w-12 h-12"
                                                            rounded="rounded-[14px]"
                                                            fallbackBg="bg-white"
                                                            extra="text-amber-600 border border-amber-100"
                                                        />
                                                        <div>
                                                            <div className="font-extrabold text-slate-800 text-sm mb-0.5">{r.reviewerName}</div>
                                                            <div className="text-xs text-slate-500 font-medium">
                                                                Trải nghiệm <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded ml-1">{r.skillName}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-0.5 bg-white px-2.5 py-1.5 rounded-xl border border-amber-100 shadow-sm">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={14} weight={i < r.rating ? 'fill' : 'regular'} className={i < r.rating ? 'text-amber-400' : 'text-slate-200'} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-slate-700 text-sm italic font-medium bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-inner border border-white">"{r.comment}"</p>
                                                <div className="text-[11px] text-slate-400 font-bold text-right mt-3 uppercase tracking-wider">
                                                    {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Add New button removed */}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8 animate-[slideIn_0.7s_ease-out]">

                    {/* About / Bio */}
                    <div className="bg-white rounded-[2rem] border border-slate-200/60 p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                <UserCircle className="text-indigo-500" weight="duotone" size={24} /> Giới thiệu
                            </h3>
                            {/* Bio edit button removed */}
                        </div>

                        {bioEditing ? (
                            <div className="space-y-3">
                                <textarea
                                    className="w-full border border-indigo-200 bg-indigo-50/30 rounded-2xl p-4 text-sm font-medium text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-inner"
                                    rows={5}
                                    maxLength={500}
                                    value={bioValue}
                                    onChange={e => setBioValue(e.target.value)}
                                    placeholder="Viết vài dòng ấn tượng giới thiệu về con người và kinh nghiệm của bạn..."
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSaveBio}
                                        disabled={bioSaving}
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-600/20 disabled:opacity-60 transition-all hover:-translate-y-0.5"
                                    >
                                        {bioSaving ? 'Đang lưu...' : 'Lưu giới thiệu'}
                                    </button>
                                    <button
                                        onClick={() => setBioEditing(false)}
                                        className="px-4 py-2.5 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-600 leading-relaxed text-sm font-medium">
                                {profile?.bio || <span className="italic text-slate-400 font-normal">Thông tin đang chờ được tỏa sáng.</span>}
                            </p>
                        )}

                        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3.5">
                            <div className="flex items-center gap-3 text-slate-600 text-sm font-bold">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                    <At size={18} weight="duotone" className="text-slate-400" />
                                </div>
                                {profile?.email || user?.email || '—'}
                            </div>
                            {joinedDate && (
                                <div className="flex items-center gap-3 text-slate-600 text-sm font-bold">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                        <CalendarBlank size={18} weight="duotone" className="text-slate-400" />
                                    </div>
                                    Tham gia từ {joinedDate}
                                </div>
                            )}
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
        </div>
    );
};

export default Profile;