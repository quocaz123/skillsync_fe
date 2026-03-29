import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, Clock, Lightning, Gift } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

import { getMyMissions, completeMission } from '../../services/missionService';

const Missions = () => {
    const navigate = useNavigate();
    const [missions, setMissions] = useState([]);
    const [activeTab, setActiveTab] = useState('daily');
    const [onlineTime, setOnlineTime] = useState(0);

    const { user, addCredits, addCreditTransaction } = useStore();
    const userId = user?.id || 'guest';
    const missionsKey = `userMissions_${userId}`;
    const resetDateKey = `lastMissionResetDate_${userId}`;

    useEffect(() => {
        const timeKey = `onlineTime_${userId}`;
        setOnlineTime(parseInt(localStorage.getItem(timeKey) || '0', 10));
        const handleUpdate = () => {
            setOnlineTime(parseInt(localStorage.getItem(timeKey) || '0', 10));
        };
        window.addEventListener('onlineTimeUpdated', handleUpdate);
        return () => window.removeEventListener('onlineTimeUpdated', handleUpdate);
    }, [userId]);

    useEffect(() => {
        const fetchMissions = async () => {
            if (user) {
                try {
                    const data = await getMyMissions();
                    setMissions(data);
                } catch (error) {
                    console.error("Failed to load missions", error);
                }
            }
        };
        fetchMissions();
    }, [user, userId]);

    const handleActionClick = async (mission) => {
        if (mission.status === 'completed') return;

        const isTimeMissionReady = mission.targetAction === 'ONLINE_30_MINS' && onlineTime >= 1800;

        if (mission.status === 'in-progress' || isTimeMissionReady) {
            try {
                const data = await completeMission(mission.id);
                addCredits(data.reward);
                addCreditTransaction({
                    type: 'mission_reward',
                    amount: +data.reward,
                    description: `Thưởng nhiệm vụ: ${data.title}`
                });
                setMissions(prev => prev.map(m => m.id === mission.id ? { ...m, status: 'completed' } : m));
            } catch (error) {
                console.error("Failed to complete mission:", error);
                alert("Lỗi khi nhận thưởng: " + (error.response?.data?.message || "Điều kiện chưa hoàn thành."));
            }
        } else {
            // Chuyển hướng đi làm nhiệm vụ
            switch (mission.targetAction) {
                case 'JOIN_SESSION':
                case 'FIRST_SESSION_JOINED':
                    navigate('/app/sessions');
                    break;
                case 'UPDATE_PROFILE':
                    navigate('/app/profile');
                    break;
                case 'FIRST_SESSION_TAUGHT':
                    navigate('/app/teaching');
                    break;
                case 'SHARE_COURSE':
                    navigate('/app/explore');
                    break;
                case 'ONLINE_30_MINS':
                    // Đã bị disable nút, nhưng phòng hờ
                    alert(`Cần tải thêm ${Math.ceil((1800 - onlineTime) / 60)} phút nữa!`);
                    break;
                default:
                    break;
            }
        }
    };

    const filteredMissions = missions.filter(m => m.type === activeTab);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header / Banner */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-center">
                <div className="relative z-10 w-full md:w-2/3">
                    <h1 className="text-2xl md:text-3xl font-bold mb-3 flex items-center gap-3">
                        <Gift size={32} weight="duotone" className="text-amber-300" />
                        Nhiệm vụ & Phần thưởng
                    </h1>
                    <p className="text-violet-100 text-sm md:text-base leading-relaxed">
                        Hoàn thành các nhiệm vụ dưới đây để nhận thêm <strong>Credits</strong>. Bạn có thể sử dụng Credits để trao đổi kỹ năng và đăng ký các buổi học trên hệ thống SkillSync.
                    </p>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 right-10 opacity-20 pointer-events-none hidden md:block">
                    <Target size={160} weight="duotone" className="text-white" />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveTab('daily')}
                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all border ${activeTab === 'daily'
                            ? 'bg-violet-600 border-violet-600 text-white shadow-md'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                >
                    Nhiệm vụ hằng ngày
                </button>
                <button
                    onClick={() => setActiveTab('once')}
                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all border ${activeTab === 'once'
                            ? 'bg-violet-600 border-violet-600 text-white shadow-md'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                >
                    Nhiệm vụ một lần
                </button>
            </div>

            {/* List of Missions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg md:text-xl font-bold text-slate-800">
                        {activeTab === 'daily' ? 'Danh sách nhiệm vụ hằng ngày' : 'Danh sách nhiệm vụ một lần'}
                    </h2>
                    <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5">
                        <Lightning size={16} weight="duotone" className="text-amber-500" />
                        {filteredMissions.filter(m => m.status === 'completed').length} / {filteredMissions.length} hoàn thành
                    </span>
                </div>
                <div className="divide-y divide-slate-100">
                    {filteredMissions.map((mission, idx) => (
                        <div key={mission.id} className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 hover:bg-slate-50/50 transition-colors">
                            {/* Left Side: Icon & Details */}
                            <div className="flex gap-4 md:gap-5 items-start flex-1">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${mission.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : mission.status === 'in-progress' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                    {mission.status === 'completed' ? (
                                        <CheckCircle size={26} weight="fill" />
                                    ) : mission.status === 'in-progress' ? (
                                        <Clock size={26} weight="duotone" />
                                    ) : (
                                        <Target size={26} weight="duotone" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-base md:text-lg font-bold ${mission.status === 'completed' ? 'text-slate-600 line-through' : 'text-slate-800'}`}>
                                        {mission.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                                        {mission.description}
                                    </p>
                                    {mission.targetAction === 'ONLINE_30_MINS' && mission.status !== 'completed' && (
                                        <div className="mt-3 w-full max-w-sm">
                                            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
                                                <span>{Math.floor(onlineTime / 60).toString().padStart(2, '0')}:{(onlineTime % 60).toString().padStart(2, '0')}</span>
                                                <span className={onlineTime >= 1800 ? "text-emerald-500 font-bold" : ""}>{onlineTime >= 1800 ? "Đã đạt yêu cầu" : "30:00"}</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${onlineTime >= 1800 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                                    style={{ width: `${Math.min((onlineTime / 1800) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Side: Reward & Action */}
                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 md:gap-2 ml-[68px] md:ml-0 shrink-0">
                                <div className="flex flex-col md:items-end">
                                    <div className={`flex items-center gap-1.5 font-bold md:text-lg ${mission.status === 'completed' ? 'text-slate-400' : 'text-amber-500'}`}>
                                        + {mission.reward} Credits
                                    </div>
                                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded flex items-center justify-center mt-1 w-max ${mission.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : mission.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {mission.status === 'completed'
                                            ? 'Đã hoàn thành'
                                            : mission.targetAction === 'ONLINE_30_MINS'
                                                ? onlineTime >= 1800 ? 'Sẵn sàng nhận thưởng' : 'Đang tiến hành'
                                                : mission.status === 'in-progress'
                                                    ? 'Đang tiến hành'
                                                    : 'Chưa bắt đầu'}
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleActionClick(mission)}
                                    disabled={mission.status === 'completed' || (mission.targetAction === 'ONLINE_30_MINS' && onlineTime < 1800)}
                                    className={`px-4 py-2 text-sm md:text-base rounded-xl font-bold transition-all w-full md:w-auto md:min-w-[120px] ${mission.status === 'completed'
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            : mission.targetAction === 'ONLINE_30_MINS' && onlineTime < 1800
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                : (mission.status === 'in-progress' || (mission.targetAction === 'ONLINE_30_MINS' && onlineTime >= 1800))
                                                    ? 'bg-amber-500 text-white hover:bg-amber-600 active:scale-95 shadow-md shadow-amber-200 hover:shadow-lg'
                                                    : 'bg-violet-600 text-white hover:bg-violet-700 active:scale-95 shadow-md shadow-violet-200 hover:shadow-lg'
                                        }`}
                                >
                                    {mission.status === 'completed'
                                        ? 'Đã nhận'
                                        : (mission.status === 'in-progress' || (mission.targetAction === 'ONLINE_30_MINS' && onlineTime >= 1800))
                                            ? 'Nhận thưởng'
                                            : mission.targetAction === 'ONLINE_30_MINS'
                                                ? 'Chưa đủ giờ'
                                                : 'Thực hiện'}
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredMissions.length === 0 && (
                        <div className="p-8 text-center text-slate-500">
                            Không có nhiệm vụ nào trong mục này.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Missions;