/**
 * 🎯 MISSIONS TAB COMPONENT
 * Create, manage, and track user missions and rewards
 * Connected to real API: GET /api/admin/missions
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    Award, Users, Zap,
    Loader2, AlertCircle, ToggleLeft, ToggleRight, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAdminMissions, toggleAdminMission } from '../../../services/adminMissionService';

// ─── MISSION CARD ─────────────────────────────────────────────────────────────
const MissionStatsCard = ({ mission, onToggle, toggling }) => {
    const isActive = mission.isActive || mission.status === 'ACTIVE';

    const typeConfig = {
        DAILY: { label: 'Daily', color: 'bg-blue-100 text-blue-700', icon: '📅' },
        WEEKLY: { label: 'Weekly', color: 'bg-purple-100 text-purple-700', icon: '📆' },
        ONBOARDING: { label: 'Onboarding', color: 'bg-emerald-100 text-emerald-700', icon: '🚀' },
        ACHIEVEMENT: { label: 'Achievement', color: 'bg-amber-100 text-amber-700', icon: '🏆' },
    };
    const type = typeConfig[mission.missionType] || { label: mission.missionType || 'Mission', color: 'bg-slate-100 text-slate-600', icon: '🎯' };

    return (
        <div className={`bg-white rounded-xl border-2 p-5 transition-all ${isActive ? 'border-amber-200 shadow-sm hover:shadow-md' : 'border-slate-100 opacity-70'}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${type.color}`}>{type.icon} {type.label}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                            {isActive ? '● Active' : '○ Inactive'}
                        </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base truncate">{mission.title}</h4>
                    {mission.description && (
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{mission.description}</p>
                    )}
                </div>
                <button
                    onClick={() => onToggle(mission.id)}
                    disabled={toggling === mission.id}
                    title={isActive ? 'Deactivate mission' : 'Activate mission'}
                    className="ml-3 p-1.5 rounded-lg hover:bg-slate-50 transition shrink-0 disabled:opacity-50"
                >
                    {toggling === mission.id
                        ? <Loader2 size={22} className="animate-spin text-slate-400" />
                        : isActive
                            ? <ToggleRight size={28} className="text-amber-500" />
                            : <ToggleLeft size={28} className="text-slate-300" />}
                </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center mb-4">
                <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Reward</p>
                    <p className="text-lg font-bold text-amber-600">{mission.rewardAmount ?? '—'} CR</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2">
                    <p className="text-[11px] font-bold text-blue-500 uppercase">Users</p>
                    <p className="text-lg font-bold text-blue-700">{mission.uniqueUsers ?? 0}</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-2">
                    <p className="text-[11px] font-bold text-emerald-500 uppercase">Completions</p>
                    <p className="text-lg font-bold text-emerald-700">{mission.totalCompletions ?? 0}</p>
                </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                <span className="font-medium">Total distributed</span>
                <span className="font-bold text-orange-600">{(mission.totalRewardsDistributed ?? 0).toLocaleString()} CR</span>
            </div>

            {mission.targetAction && (
                <div className="mt-2 text-[11px] text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded">
                    action: {mission.targetAction}
                </div>
            )}
        </div>
    );
};

// ─── MAIN MISSIONS TAB ─────────────────────────────────────────────────────────
export const MissionsTab = () => {
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toggling, setToggling] = useState(null);

    const fetchMissions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdminMissions();
            setMissions(data);
        } catch (err) {
            console.error('Failed to load missions:', err);
            setError('Không thể tải danh sách missions. Kiểm tra kết nối API.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMissions();
    }, [fetchMissions]);

    const handleToggle = async (missionId) => {
        setToggling(missionId);
        try {
            const updated = await toggleAdminMission(missionId);
            setMissions(prev => prev.map(m => m.id === missionId
                ? { ...m, isActive: updated?.isActive ?? !m.isActive, status: updated?.status ?? (m.isActive ? 'INACTIVE' : 'ACTIVE') }
                : m
            ));
            toast.success('Đã cập nhật trạng thái mission!');
        } catch (err) {
            toast.error('Lỗi toggle mission: ' + (err.response?.data?.message || err.message));
        } finally {
            setToggling(null);
        }
    };

    const totalMissions = missions.length;
    const activeMissions = missions.filter(m => m.isActive || m.status === 'ACTIVE').length;
    const totalCompletions = missions.reduce((sum, m) => sum + (m.totalCompletions ?? 0), 0);
    const totalRewardsDistributed = missions.reduce((sum, m) => sum + (m.totalRewardsDistributed ?? 0), 0);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        <Award size={20} className="text-amber-600" /> Mission Manager
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">Quản lý missions và phần thưởng người dùng</p>
                </div>
                <button
                    onClick={fetchMissions}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition text-sm disabled:opacity-50"
                >
                    <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Làm mới
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Award size={20} className="text-amber-600" />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Total Missions</p>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{loading ? '—' : totalMissions}</p>
                    <p className="text-xs text-slate-500 mt-1">{loading ? '...' : `${activeMissions} đang hoạt động`}</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Users size={20} className="text-emerald-600" />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Total Completions</p>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{loading ? '—' : totalCompletions.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">Tổng lần hoàn thành</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Zap size={20} className="text-orange-600" />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Reward Distribution</p>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{loading ? '—' : totalRewardsDistributed.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">Tổng CR đã phát thưởng</p>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-16 bg-white rounded-xl border border-slate-200">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                        <Loader2 size={32} className="animate-spin text-amber-500" />
                        <p className="font-semibold text-sm">Đang tải missions...</p>
                    </div>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-red-700">Lỗi tải dữ liệu</p>
                        <p className="text-sm text-red-600 mt-1">{error}</p>
                        <button onClick={fetchMissions} className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition">
                            Thử lại
                        </button>
                    </div>
                </div>
            )}

            {/* Grid */}
            {!loading && !error && missions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {missions.map(mission => (
                        <MissionStatsCard
                            key={mission.id}
                            mission={mission}
                            onToggle={handleToggle}
                            toggling={toggling}
                        />
                    ))}
                </div>
            )}

            {/* Empty */}
            {!loading && !error && missions.length === 0 && (
                <div className="bg-slate-50 rounded-xl p-12 text-center">
                    <p className="text-5xl mb-3">🎯</p>
                    <p className="font-bold text-slate-900 text-lg mb-1">Chưa có mission nào</p>
                    <p className="text-slate-500">Missions được tạo trực tiếp trong database hoặc qua seeder.</p>
                </div>
            )}
        </div>
    );
};

export default MissionsTab;
