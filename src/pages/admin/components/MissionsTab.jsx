/**
 * 🎯 MISSIONS TAB COMPONENT
 * Create, manage, and track user missions and rewards
 */

import React, { useState } from 'react';
import {
    Award, Plus, Edit2, Trash2, TrendingUp, Users, Zap, CheckCircle2,
    X, Activity, Calendar, Target, PieChart
} from 'lucide-react';
import { useMissionManagement } from '../../hooks/useAdmin';

// ─── MISSION FORM MODAL ───────────────────────────────────────────────────────
const MissionFormModal = ({ mission, onClose, onSave }) => {
    const [formData, setFormData] = useState(mission || {
        title: '',
        description: '',
        rewardCredits: 50,
        targetAudience: 'all',
        isActive: true,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
    });
    const [errors, setErrors] = useState([]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = [];

        if (!formData.title.trim()) newErrors.push('Title required');
        if (formData.rewardCredits <= 0) newErrors.push('Reward must be > 0');
        if (formData.rewardCredits > 500) newErrors.push('Reward max 500 CR');
        if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
            newErrors.push('End date must be after start date');
        }

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-xl w-full">
                <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-6 text-white flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{mission ? 'Edit Mission' : 'Create New Mission'}</h2>
                    <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Errors */}
                    {errors.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            {errors.map((err, i) => (
                                <p key={i} className="text-sm text-red-700 font-medium">• {err}</p>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-1">Mission Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="e.g., Complete First Session"
                            className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Describe what users need to do..."
                            className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none resize-none"
                            rows="3"
                        />
                    </div>

                    {/* Target Audience */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-1">Target Audience *</label>
                        <select
                            value={formData.targetAudience}
                            onChange={(e) => handleChange('targetAudience', e.target.value)}
                            className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:border-amber-500 outline-none"
                        >
                            <option value="all">All Users</option>
                            <option value="newUsers">New Users Only</option>
                            <option value="learners">Learners</option>
                            <option value="mentors">Mentors</option>
                        </select>
                    </div>

                    {/* Reward */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-1">Credit Reward *</label>
                        <div className="flex items-center gap-2">
                            <Zap size={18} className="text-amber-500" />
                            <input
                                type="number"
                                min="1"
                                max="500"
                                value={formData.rewardCredits}
                                onChange={(e) => handleChange('rewardCredits', Number(e.target.value))}
                                className="flex-1 px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:border-amber-500 outline-none font-bold text-amber-600"
                            />
                            <span className="font-bold text-amber-600">CR</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Max: 500 CR</p>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-1">Start Date *</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => handleChange('startDate', e.target.value)}
                                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:border-amber-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-1">End Date (Optional)</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => handleChange('endDate', e.target.value)}
                                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:border-amber-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => handleChange('isActive', e.target.checked)}
                            className="w-4 h-4 rounded"
                        />
                        <label className="text-sm font-bold text-amber-900">Activate immediately</label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-slate-200">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition"
                        >
                            {mission ? 'Update Mission' : 'Create Mission'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── MISSION STATS CARD ────────────────────────────────────────────────────────
const MissionStatsCard = ({ mission, stats }) => {
    const statusIndicator = stats.completionRate >= 70 ? 'excellent' :
        stats.completionRate >= 50 ? 'good' :
            stats.completionRate >= 20 ? 'fair' : 'poor';

    const colors = {
        excellent: 'text-emerald-600 bg-emerald-50',
        good: 'text-blue-600 bg-blue-50',
        fair: 'text-amber-600 bg-amber-50',
        poor: 'text-rose-600 bg-rose-50',
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-900">{mission.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[statusIndicator]}`}>
                    {statusIndicator === 'excellent' ? '🌟 Excellent' :
                        statusIndicator === 'good' ? '⭐ Good' :
                            statusIndicator === 'fair' ? '◐ Fair' : '⚠ Poor'}
                </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-xs font-bold text-slate-500">Completion</p>
                    <p className="text-lg font-bold text-slate-900">{stats.completionRate}%</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-2">
                    <p className="text-xs font-bold text-amber-600">Reward</p>
                    <p className="text-lg font-bold text-amber-700">{mission.rewardCredits} CR</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2">
                    <p className="text-xs font-bold text-blue-600">Completed</p>
                    <p className="text-lg font-bold text-blue-700">{stats.uniqueUsers}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
                <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-600">Progress</span>
                    <span className="font-bold text-slate-600">{stats.uniqueUsers} / {Math.ceil((mission.targetAudience === 'all' ? 1248 : 600))}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all"
                        style={{ width: `${Math.min(stats.completionRate, 100)}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

// ─── MAIN MISSIONS TAB ─────────────────────────────────────────────────────────
export const MissionsTab = ({ missions: mockMissions }) => {
    const missionMgmt = useMissionManagement(mockMissions);
    const [showForm, setShowForm] = useState(false);
    const [editingMission, setEditingMission] = useState(null);

    // Mock stats for display
    const getMissionStats = (mission) => {
        return {
            completionRate: Math.floor(Math.random() * 80) + 20,
            uniqueUsers: Math.floor(Math.random() * 500) + 50,
            totalCompletions: Math.floor(Math.random() * 800) + 100,
            totalRewardsDistributed: Math.floor(Math.random() * 50000) + 5000,
            averageCompletionTime: (Math.random() * 48 + 2).toFixed(1),
        };
    };

    const handleCreateMission = (formData) => {
        const result = missionMgmt.createMission(formData);
        if (result.success) {
            setShowForm(false);
            alert('Mission created successfully!');
        } else {
            alert('Error: ' + result.errors.join(', '));
        }
    };

    const totalMissions = mockMissions.length;
    const activeMissions = mockMissions.filter(m => m.isActive).length;
    const totalRewardDistributed = mockMissions.reduce((sum, m) => sum + (m.rewardCredits * 100), 0);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        <Award size={20} className="text-amber-600" /> Mission Manager
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">Manage onboarding and engagement missions</p>
                </div>
                <button
                    onClick={() => {
                        setEditingMission(null);
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition active:scale-95"
                >
                    <Plus size={18} /> New Mission
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
                    <p className="text-3xl font-bold text-slate-900">{totalMissions}</p>
                    <p className="text-xs text-slate-500 mt-1">{activeMissions} currently active</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Users size={20} className="text-emerald-600" />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Total Completions</p>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">5.2k</p>
                    <p className="text-xs text-slate-500 mt-1">This month</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Zap size={20} className="text-orange-600" />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Reward Distribution</p>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{totalRewardDistributed}K</p>
                    <p className="text-xs text-slate-500 mt-1">Total CR distributed</p>
                </div>
            </div>

            {/* Missions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockMissions.map(mission => (
                    <div key={mission.id} className="relative group">
                        <MissionStatsCard mission={mission} stats={getMissionStats(mission)} />

                        {/* Hover Actions */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition flex gap-1">
                            <button
                                onClick={() => {
                                    setEditingMission(mission);
                                    setShowForm(true);
                                }}
                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                                title="Edit"
                            >
                                <Edit2 size={14} />
                            </button>
                            <button
                                onClick={() => missionMgmt.deleteMission(mission.id)}
                                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                                title="Delete"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {mockMissions.length === 0 && (
                <div className="bg-slate-50 rounded-xl p-12 text-center">
                    <p className="text-5xl mb-3">🎯</p>
                    <p className="font-bold text-slate-900 text-lg mb-1">No missions yet</p>
                    <p className="text-slate-500 mb-4">Create your first mission to engage users</p>
                    <button
                        onClick={() => {
                            setEditingMission(null);
                            setShowForm(true);
                        }}
                        className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition"
                    >
                        Create First Mission
                    </button>
                </div>
            )}

            {/* Mission Form Modal */}
            {showForm && (
                <MissionFormModal
                    mission={editingMission}
                    onClose={() => {
                        setShowForm(false);
                        setEditingMission(null);
                    }}
                    onSave={handleCreateMission}
                />
            )}
        </div>
    );
};

export default MissionsTab;
