import React, { useState, useEffect } from 'react';
import { 
    Trophy, Medal, Crown, Star, Lightning, 
    ArrowUp, Flame, Users, BookOpen, GraduationCap,
    CaretRight, ShieldCheck, Diamond, SketchLogo,
    MedalMilitary,
    CaretDoubleUp,
    CircleNotch,
    X
} from '@phosphor-icons/react';
import axiosInstance from '../../configuration/axiosClient';
import { API_ENDPOINTS } from '../../configuration/apiEndpoints';

const RANKS = [
    { id: 'vanguard', label: 'Vanguard', color: 'text-amber-600', bg: 'bg-gradient-to-r from-amber-400 to-amber-600', border: 'border-amber-400', icon: Crown, glow: 'shadow-amber-400/40', textOnBg: 'text-white' },
    { id: 'diamond', label: 'Diamond', color: 'text-sky-600', bg: 'bg-gradient-to-r from-sky-400 to-blue-500', border: 'border-sky-300', icon: Diamond, glow: 'shadow-sky-400/40', textOnBg: 'text-white' },
    { id: 'platinum', label: 'Platinum', color: 'text-indigo-600', bg: 'bg-gradient-to-r from-indigo-400 to-purple-500', border: 'border-indigo-300', icon: SketchLogo, glow: 'shadow-indigo-400/40', textOnBg: 'text-white' },
    { id: 'gold', label: 'Gold', color: 'text-yellow-700', bg: 'bg-gradient-to-r from-yellow-400 to-amber-500', border: 'border-yellow-300', icon: MedalMilitary, glow: 'shadow-yellow-400/30', textOnBg: 'text-white' },
    { id: 'silver', label: 'Silver', color: 'text-slate-600', bg: 'bg-gradient-to-r from-slate-300 to-slate-400', border: 'border-slate-200', icon: Medal, glow: 'shadow-slate-300/30', textOnBg: 'text-white' },
];

const MOCK_USERS_BY_RANK = {
    vanguard: [{ id: 1, name: 'Lê Văn A', avatarGrad: 'from-amber-400 to-orange-500', credits: 154000 }],
    diamond: [
        { id: 2, name: 'Nguyễn Thị B', avatarGrad: 'from-sky-400 to-blue-600', credits: 82000 },
        { id: 3, name: 'Trần Văn C', avatarGrad: 'from-sky-300 to-sky-500', credits: 78000 },
    ],
    platinum: [
        { id: 4, name: 'Phạm Minh D', avatarGrad: 'from-indigo-400 to-purple-600', credits: 45000 },
        { id: 5, name: 'Hoàng Anh E', avatarGrad: 'from-violet-400 to-indigo-500', credits: 42000 },
    ],
    gold: [
        { id: 6, name: 'Bùi Thế H', avatarGrad: 'from-yellow-400 to-amber-600', credits: 12000 },
        { id: 7, name: 'Vũ Minh K', avatarGrad: 'from-amber-300 to-yellow-500', credits: 11500 },
    ],
    silver: [
        { id: 8, name: 'Lý Lan P', avatarGrad: 'from-slate-300 to-slate-400', credits: 4500 },
        { id: 9, name: 'Đỗ Mạnh T', avatarGrad: 'from-slate-200 to-slate-300', credits: 4200 },
    ],
};

const PyramidLevel = ({ rank, users, isActive, onSelect }) => {
    const Icon = rank.icon;
    const widthClass = {
        vanguard: 'w-[40%]',
        diamond: 'w-[55%]',
        platinum: 'w-[70%]',
        gold: 'w-[85%]',
        silver: 'w-[100%]',
    };

    return (
        <button 
            onClick={() => onSelect(rank.id)}
            className={`group relative flex items-center justify-center h-16 rounded-2xl border-2 transition-all duration-300 mx-auto mb-3 shadow-md ${widthClass[rank.id]} 
                ${isActive 
                    ? `${rank.bg} ${rank.border} ${rank.glow} scale-[1.05] z-10 border-opacity-100` 
                    : `bg-white hover:bg-slate-50 border-slate-100 opacity-80 grayscale-[0.3] hover:grayscale-0`
                }`}
        >
            <div className="flex items-center gap-3">
                <Icon size={24} weight="fill" className={`${isActive ? rank.textOnBg : rank.color} transition-colors`} />
                <span className={`text-sm font-black uppercase tracking-[0.2em] ${isActive ? rank.textOnBg : 'text-slate-600'}`}>
                    {rank.label}
                </span>
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {users.length}
                </span>
            </div>
            {isActive && (
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-indigo-500 shadow-[0_0_15px_rgba(255,255,255,1)] animate-pulse" />
            )}
        </button>
    );
};

export default function HonorBoardSection() {
    const [activeRankId, setActiveRankId] = useState('vanguard');
    const [leaderboardData, setLeaderboardData] = useState({});
    const [loading, setLoading] = useState(true);

    const [showRoadmap, setShowRoadmap] = useState(false);
    const activeRank = RANKS.find(r => r.id === activeRankId);
    const activeUsers = leaderboardData[activeRankId] || [];
    const ActiveIcon = activeRank?.icon;

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axiosInstance.get(API_ENDPOINTS.LEADERBOARD);
                // axiosClient interceptor already returns .data field
                const list = Array.isArray(res) ? res : (res?.data || []);
                
                const grouped = {
                    vanguard: list.filter(u => u.rankTier === 'Vanguard'),
                    diamond: list.filter(u => u.rankTier === 'Diamond'),
                    platinum: list.filter(u => u.rankTier === 'Platinum'),
                    gold: list.filter(u => u.rankTier === 'Gold'),
                    silver: list.filter(u => u.rankTier === 'Silver' || u.rankTier === 'Bronze'),
                };
                setLeaderboardData(grouped);
                
                const tiers = ['vanguard', 'diamond', 'platinum', 'gold', 'silver'];
                for (const t of tiers) {
                    if (grouped[t] && grouped[t].length > 0) {
                        setActiveRankId(t);
                        break;
                    }
                }
            } catch (err) {
                console.error("Lỗi lấy leaderboard", err);
                setLeaderboardData({
                    vanguard: [], diamond: [], platinum: [], gold: [], silver: []
                });
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <section className="bg-white/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[500px] flex items-center justify-center">
            {showRoadmap && <RankRoadmapModal onClose={() => setShowRoadmap(false)} />}
            
            {loading ? (
                <div className="flex flex-col items-center gap-3">
                    <CircleNotch size={32} className="animate-spin text-violet-600" />
                    <p className="text-sm font-bold text-slate-400">Đang tải tháp vinh danh...</p>
                </div>
            ) : (
                <div className="p-6 sm:p-10 w-full">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Pyramid Side */}
                        <div className="lg:w-1/2 flex flex-col justify-center">
                            <div className="mb-10 text-center lg:text-left">
                                <h2 className="text-2xl font-black text-slate-900 flex items-center justify-center lg:justify-start gap-3">
                                    <SketchLogo size={32} weight="duotone" className="text-violet-600" />
                                    Tháp Vinh Danh
                                </h2>
                                <p className="text-sm text-slate-500 font-medium mt-2">Cống hiến để leo lên những bậc thang đẳng cấp cao nhất</p>
                            </div>

                            <div className="flex flex-col">
                                {RANKS.map(rank => (
                                    <PyramidLevel 
                                        key={rank.id} 
                                        rank={rank} 
                                        users={leaderboardData[rank.id] || []}
                                        isActive={activeRankId === rank.id}
                                        onSelect={setActiveRankId}
                                    />
                                ))}
                            </div>

                            <div className="mt-8 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                                    <CaretDoubleUp size={22} weight="bold" />
                                </div>
                                <p className="text-[11px] text-slate-600 font-bold leading-tight">
                                    Tích lũy Credits qua dạy học và đóng góp cộng đồng để thăng hạng. <br />
                                    <span className="text-violet-600">Thứ hạng Diamond trở lên nhận hoa hồng 85%.</span>
                                </p>
                            </div>
                        </div>

                        {/* Users Side */}
                        <div className="lg:w-1/2 bg-white/40 rounded-[2rem] border border-white/60 p-6 flex flex-col min-h-[400px]">
                            {activeRank && (
                                <>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-black text-slate-800 flex items-center gap-2">
                                            {ActiveIcon && <ActiveIcon size={20} weight="fill" className={activeRank.color} />}
                                            Đẳng cấp {activeRank.label}
                                        </h3>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chiến binh thực thụ</span>
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        {activeUsers.length > 0 ? activeUsers.map((user, idx) => (
                                            <div key={user.userId || idx} className="group flex items-center gap-4 p-3 rounded-2xl bg-white border border-slate-100 hover:border-violet-200 transition-all shadow-sm">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden">
                                                    <div className={`absolute inset-0 bg-gradient-to-br ${user.avatarGrad || 'from-slate-300 to-slate-400'} opacity-90`} />
                                                    <span className="relative z-10 text-white font-black text-lg">{user.name?.charAt(0) || '?'}</span>
                                                    {activeRankId === 'vanguard' && (
                                                        <div className="absolute top-0 right-0 w-4 h-4 bg-amber-400 flex items-center justify-center rounded-bl-lg">
                                                            <Star size={10} weight="fill" className="text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-extrabold text-slate-800 text-sm truncate">{user.name || 'Anonymous'}</h4>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <Lightning size={12} weight="fill" className="text-amber-400" />
                                                        <span className="text-xs font-black text-violet-700">{Math.floor(user.score || 0).toLocaleString()}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">Credits</span>
                                                    </div>
                                                </div>
                                                <div className="text-[10px] font-black text-slate-300">
                                                    #{idx + 1}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10">
                                                {ActiveIcon && <ActiveIcon size={48} weight="duotone" className="opacity-20 mb-3" />}
                                                <p className="text-sm font-bold">Chưa có ai ở bậc này</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            <div className="mt-6 pt-6 border-t border-slate-100/60">
                                <button 
                                    onClick={() => setShowRoadmap(true)}
                                    className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    <ShieldCheck size={18} weight="duotone" />
                                    Xem lộ trình thăng hạng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

const RankRoadmapModal = ({ onClose }) => {
    const TIERS = [
        { name: 'Vanguard', score: '100.000+', color: 'text-amber-500', icon: Crown, bg: 'bg-amber-50', border: 'border-amber-200', desc: 'Đẳng cấp vinh quang nhất, dành cho những bậc thầy tri thức có sức ảnh hưởng lớn nhất cộng đồng.' },
        { name: 'Diamond', score: '50.000+', color: 'text-sky-500', icon: Diamond, bg: 'bg-sky-50', border: 'border-sky-200', desc: 'Đặc quyền Mentor: Nhận 85% hoa hồng từ mọi buổi dạy. Tên của bạn sẽ lấp lánh trên bảng vàng.', highlight: true },
        { name: 'Platinum', score: '20.000+', color: 'text-indigo-500', icon: SketchLogo, bg: 'bg-indigo-50', border: 'border-indigo-200', desc: 'Được ưu tiên hiển thị hàng đầu trên trang Khám phá và nhận huy hiệu xác minh chuyên gia.' },
        { name: 'Gold', score: '5.000+', color: 'text-yellow-600', icon: MedalMilitary, bg: 'bg-yellow-50', border: 'border-yellow-200', desc: 'Mentor tiềm năng, mở khóa tính năng tạo các nhóm học tập chuyên sâu.' },
        { name: 'Silver', score: '1.000+', color: 'text-slate-500', icon: Medal, bg: 'bg-slate-50', border: 'border-slate-200', desc: 'Bước chân đầu tiên vào hàng ngũ Mentor, bắt đầu hành trình chia sẻ giá trị.' },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-500" onClick={onClose} />
            
            {/* Drawer Panel */}
            <div className="relative w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
                {/* Header */}
                <div className="p-8 pb-6 border-b border-slate-100 relative">
                    <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-all hover:rotate-90">
                        <X size={24} weight="bold" />
                    </button>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-200">
                            <Trophy size={26} weight="fill" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900">Lộ Trình Thăng Hạng</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Hành trình Mentor chuyên nghiệp</p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        Tích lũy Credits thông qua việc giảng dạy và đóng góp để nâng tầm vị thế của bạn tại SkillSync.
                    </p>
                </div>

                {/* Vertical Timeline Roadmap */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="relative space-y-8">
                        {/* Vertical Line */}
                        <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-slate-100" />

                        {TIERS.map((tier, idx) => (
                            <div key={idx} className="relative pl-12 group">
                                {/* Timeline Dot/Icon */}
                                <div className={`absolute left-0 top-0 w-12 h-12 rounded-2xl border-4 border-white shadow-md flex items-center justify-center z-10 transition-transform group-hover:scale-110 
                                    ${tier.highlight ? 'bg-sky-50 text-sky-500 ring-2 ring-sky-100' : 'bg-slate-50 text-slate-400'}`}>
                                    <tier.icon size={20} weight="fill" className={tier.color} />
                                </div>

                                {/* Content Card */}
                                <div className={`p-5 rounded-2xl border-2 transition-all duration-300
                                    ${tier.highlight ? 'bg-sky-50/50 border-sky-100 shadow-sm' : 'bg-white border-slate-100 hover:border-violet-100 hover:shadow-md'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className={`font-black text-xs uppercase tracking-widest ${tier.color}`}>{tier.name}</h4>
                                        <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded-md border border-slate-100 text-slate-400">
                                            {tier.score} Credits
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 font-bold leading-relaxed">
                                        {tier.desc}
                                    </p>
                                    
                                    {tier.highlight && (
                                        <div className="mt-3 py-1.5 px-3 bg-sky-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider text-center">
                                            Đặc quyền hoa hồng 85%
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 bg-slate-50/50 border-t border-slate-100">
                    <button 
                        onClick={onClose} 
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-violet-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
                    >
                        Tôi đã hiểu, bắt đầu thôi!
                    </button>
                    <p className="text-[10px] text-center text-slate-400 font-bold uppercase mt-4 tracking-widest">
                        Cống hiến càng nhiều - Ưu đãi càng lớn
                    </p>
                </div>
            </div>
        </div>
    );
};




