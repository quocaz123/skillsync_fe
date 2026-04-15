import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Lightning, X, ArrowRight, Star, Trophy, Coins } from '@phosphor-icons/react';
import { useStore } from '../../store';

const MissionWelcomePopup = () => {
    const navigate = useNavigate();
    const { showMissionPopup, dismissMissionPopup } = useStore();

    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') dismissMissionPopup(); };
        if (showMissionPopup) document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [showMissionPopup, dismissMissionPopup]);

    if (!showMissionPopup) return null;

    const handleGoToMissions = () => {
        dismissMissionPopup();
        navigate('/app/missions');
    };

    const missions = [
        { Icon: Lightning, color: '#f59e0b', bg: '#fef3c7', label: 'Đăng nhập mỗi ngày', reward: '+10 Credits' },
        { Icon: Star, color: '#8b5cf6', bg: '#ede9fe', label: 'Hoàn thiện hồ sơ', reward: '+50 Credits' },
        { Icon: Trophy, color: '#0ea5e9', bg: '#e0f2fe', label: 'Online 30 phút', reward: '+30 Credits' },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000]">
            <div
                className="w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                style={{
                    animation: 'slideIn 0.4s ease forwards'
                }}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100">
                            <Target size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">
                                Nhiệm vụ hôm nay
                            </h3>
                            <p className="text-xs text-gray-500">
                                Nhận đến 90 Credits
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={dismissMissionPopup}
                        className="p-1 rounded-md hover:bg-gray-100"
                    >
                        <X size={16} className="text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                    {missions.map(({ Icon, label, reward }) => (
                        <div
                            key={label}
                            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition"
                        >
                            <div className="flex items-center gap-2">
                                <Icon size={16} className="text-gray-600" />
                                <span className="text-xs font-medium text-gray-700">
                                    {label}
                                </span>
                            </div>

                            <span className="text-xs font-semibold text-gray-500">
                                {reward}
                            </span>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="p-4 pt-0">
                    <button
                        onClick={handleGoToMissions}
                        className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-black hover:bg-gray-900 transition"
                    >
                        Xem nhiệm vụ
                    </button>
                </div>
            </div>

            <style>{`
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `}</style>
        </div>
    );
};

export default MissionWelcomePopup;
