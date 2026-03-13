/**
 * 📊 OVERVIEW TAB COMPONENT  
 * Dashboard overview with key metrics, charts, and analytics
 */

import React, { useMemo } from 'react';
import {
    BarChart3, Users, BookOpen, Zap, TrendingUp, Activity,
    Award, AlertCircle, CheckCircle2, Clock, Target
} from 'lucide-react';
import { useAdminAnalytics } from '../../hooks/useAdmin';

// ─── STAT CARD COMPONENT ──────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color, trend, unit = '' }) => {
    const colorMap = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
        purple: 'bg-purple-50 text-purple-600',
        rose: 'bg-rose-50 text-rose-600',
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${colorMap[color]} rounded-lg flex items-center justify-center`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.positive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                        {trend.positive ? '↑' : '↓'} {trend.value}
                    </span>
                )}
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">
                {value.toLocaleString()} {unit}
            </p>
            <p className="text-sm text-slate-500 font-medium">{label}</p>
        </div>
    );
};

// ─── CHART COMPONENT (Simple Bar Chart) ────────────────────────────────────────
const SimpleBarChart = ({ title, data, unit = '' }) => {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4">{title}</h3>
            <div className="space-y-3">
                {data.map((item, i) => (
                    <div key={i}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-slate-700">{item.label}</span>
                            <span className="text-sm font-bold text-slate-900">
                                {item.value} {unit}
                            </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${item.color || 'bg-indigo-500'}`}
                                style={{ width: `${(item.value / maxValue) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── PERFORMANCE GAUGE ────────────────────────────────────────────────────────
const PerformanceGauge = ({ title, value, max = 100, color = 'bg-emerald-500' }) => {
    const percentage = (value / max) * 100;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
            <p className="text-sm font-bold text-slate-500 uppercase mb-4">{title}</p>
            <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                    {/* Progress circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="url(#gauge-gradient)"
                        strokeWidth="8"
                        strokeDasharray={`${percentage * 2.51} 251`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                    />
                    <defs>
                        <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                        <p className="text-3xl font-bold text-slate-900">{Math.round(percentage)}%</p>
                        <p className="text-xs text-slate-500">{value}/{max}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── PLATFORM HEALTH COMPONENT ────────────────────────────────────────────────
const PlatformHealth = ({ analytics }) => {
    const healthMetrics = [
        {
            label: 'Session Completion Rate',
            value: analytics.overview?.completedSessions
                ? Math.round((analytics.overview.completedSessions / (analytics.overview.totalSessions || 1)) * 100)
                : 0,
        },
        {
            label: 'User Retention Rate',
            value: analytics.userCohort?.retentionRate || 0,
        },
        {
            label: 'Mentor Verification Rate',
            value: analytics.verification?.verificationRate || 0,
        },
        {
            label: 'Average User Rating',
            value: 92, // Mock
        },
    ];

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Activity size={18} className="text-emerald-600" /> Platform Health
            </h3>
            <div className="space-y-4">
                {healthMetrics.map((metric, i) => {
                    const getColor = (val) => {
                        if (val >= 80) return 'bg-emerald-500';
                        if (val >= 60) return 'bg-amber-500';
                        return 'bg-red-500';
                    };

                    return (
                        <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-slate-700">{metric.label}</span>
                                <span className="font-bold text-slate-900">{metric.value}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${getColor(metric.value)} transition-all`}
                                    style={{ width: `${metric.value}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ─── RECENT ACTIVITY COMPONENT ────────────────────────────────────────────────
const RecentActivity = () => {
    const activities = [
        { type: 'user_verified', user: 'Trần Thị Bình', time: '5 min ago', icon: '✓', color: 'text-emerald-600' },
        { type: 'path_approved', path: 'React.js Masterclass', time: '15 min ago', icon: '📚', color: 'text-blue-600' },
        { type: 'session_completed', session: 'Python Basics', time: '1 hour ago', icon: '✓', color: 'text-emerald-600' },
        { type: 'user_banned', user: 'Nguyễn X', reason: 'Fraud', time: '2 hours ago', icon: '🔴', color: 'text-red-600' },
        { type: 'mission_completed', user: 'Phạm Thị Dung', reward: '+50 CR', time: '3 hours ago', icon: '🏆', color: 'text-amber-600' },
    ];

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
                {activities.map((activity, i) => (
                    <div key={i} className="flex items-center justify-between text-sm border-b border-slate-100 pb-3 last:border-0">
                        <div className="flex items-center gap-3">
                            <span className="text-lg">{activity.icon}</span>
                            <div>
                                <p className="font-medium text-slate-900">
                                    {activity.type === 'user_verified' && `User verified: ${activity.user}`}
                                    {activity.type === 'path_approved' && `Path approved: ${activity.path}`}
                                    {activity.type === 'session_completed' && `Session completed: ${activity.session}`}
                                    {activity.type === 'user_banned' && `User banned: ${activity.user} (${activity.reason})`}
                                    {activity.type === 'mission_completed' && `Mission completed: ${activity.user} ${activity.reward}`}
                                </p>
                                <p className={`text-xs font-bold ${activity.color} uppercase`}>{activity.time}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── MAIN OVERVIEW TAB ────────────────────────────────────────────────────────
export const OverviewTab = ({ users = [], sessions = [], paths = [], missions = [] }) => {
    const analytics = useAdminAnalytics(users, sessions, paths, missions);

    const revenueData = [
        { label: 'React', value: 12500, color: 'bg-blue-500' },
        { label: 'UI/UX', value: 8900, color: 'bg-purple-500' },
        { label: 'Python', value: 6700, color: 'bg-amber-500' },
        { label: 'English', value: 5100, color: 'bg-emerald-500' },
    ];

    const trustScoreData = [
        { label: 'Excellent (90+)', value: Math.ceil(analytics.trustScore.excellent), color: 'bg-emerald-500' },
        { label: 'Good (75-89)', value: Math.ceil(analytics.trustScore.good), color: 'bg-blue-500' },
        { label: 'Fair (60-74)', value: Math.ceil(analytics.trustScore.fair), color: 'bg-amber-500' },
        { label: 'Warning (45-59)', value: Math.ceil(analytics.trustScore.warning), color: 'bg-orange-500' },
        { label: 'Low (0-44)', value: Math.ceil(analytics.trustScore.low), color: 'bg-red-500' },
    ];

    return (
        <div className="space-y-6">
            {/* Main Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Users"
                    value={analytics.overview?.totalUsers || 0}
                    icon={Users}
                    color="blue"
                    trend={{ positive: true, value: '+12%' }}
                />
                <StatCard
                    label="Active Users"
                    value={analytics.overview?.activeUsers || 0}
                    icon={Activity}
                    color="emerald"
                    unit=""
                />
                <StatCard
                    label="Total Sessions"
                    value={analytics.overview?.totalSessions || 0}
                    icon={BarChart3}
                    color="purple"
                    unit=""
                />
                <StatCard
                    label="Learning Paths"
                    value={analytics.overview?.totalPaths || 0}
                    icon={BookOpen}
                    color="amber"
                    unit=""
                />
            </div>

            {/* Platform Health & Revenue */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1">
                    <PlatformHealth analytics={analytics} />
                </div>
                <div className="lg:col-span-2">
                    <SimpleBarChart
                        title="Revenue by Category"
                        data={revenueData}
                        unit="CR"
                    />
                </div>
            </div>

            {/* User Metrics & Trust Score */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Verified Users</p>
                        <p className="text-3xl font-bold text-emerald-600 mb-1">
                            {analytics.verification?.verified || 0}
                        </p>
                        <p className="text-xs text-slate-500">
                            {analytics.verification?.verificationRate || 0}% of total
                        </p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Pending Verification</p>
                        <p className="text-3xl font-bold text-amber-600 mb-1">
                            {analytics.verification?.pending || 0}
                        </p>
                        <p className="text-xs text-slate-500">Awaiting review</p>
                    </div>
                </div>

                <SimpleBarChart
                    title="Trust Score Distribution"
                    data={trustScoreData}
                    unit="users"
                />
            </div>

            {/* Mentor Performance & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Top Mentors by Revenue</h3>
                    <div className="space-y-3">
                        {analytics.mentorPerformance?.slice(0, 5).map((mentor, i) => (
                            <div key={i} className="flex items-center justify-between pb-3 border-b border-slate-100 last:border-0">
                                <div>
                                    <p className="font-bold text-slate-900">{mentor.name}</p>
                                    <p className="text-xs text-slate-500">{mentor.totalSessions} sessions</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-amber-600">{mentor.earnings} CR</p>
                                    <p className="text-xs text-slate-500">⭐ {mentor.averageRating?.toFixed(1)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <RecentActivity />
            </div>

            {/* Key Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-amber-900">Paths Pending Approval</p>
                        <p className="text-sm text-amber-800 mt-1">
                            {analytics.overview?.pendingPaths || 2} learning paths waiting for review
                        </p>
                    </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-red-900">High-Risk Users</p>
                        <p className="text-sm text-red-800 mt-1">
                            5 users with trust score below 40 - review recommended
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
