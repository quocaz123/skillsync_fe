/**
 * 🎛️ REFINED ADMIN DASHBOARD
 * Complete admin control center with all tabs and components integrated
 */

import React, { useState } from 'react';
import { useStore } from '../../store';
import {
    BarChart3, BookOpen, Users, CalendarDays, Award, Activity,
    Settings, Download, Bell, Search, ChevronDown
} from 'lucide-react';

import OverviewTab from './components/OverviewTab';
import UsersTab from './components/UsersTab';
import SessionsTab from './components/SessionsTab';
import PathsTab from './components/PathsTab';
import MissionsTab from './components/MissionsTab';

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// (Re-use from original AdminDash.jsx - truncated for brevity in actual implementation)
const MOCK_USERS = [
    { id: 1, name: 'Nguyễn Văn An', email: 'an@example.com', credits: 180, status: 'active', role: 'both', sessions: 12, joined: '2026-01-05', rating: 4.7, trustScore: 85, verificationStatus: 'verified', completedSessions: 12 },
    { id: 2, name: 'Trần Thị Bình', email: 'binh@example.com', credits: 340, status: 'active', role: 'teach', sessions: 28, joined: '2025-12-20', rating: 4.9, trustScore: 98, verificationStatus: 'verified', completedSessions: 28 },
    { id: 3, name: 'Lê Hoàng Cường', email: 'cuong@example.com', credits: 50, status: 'inactive', role: 'learn', sessions: 3, joined: '2026-02-10', rating: null, trustScore: 40, verificationStatus: 'none', completedSessions: 3 },
    { id: 4, name: 'Phạm Thị Dung', email: 'dung@example.com', credits: 220, status: 'active', role: 'both', sessions: 17, joined: '2026-01-15', rating: 4.5, trustScore: 70, verificationStatus: 'pending', completedSessions: 17 },
    { id: 5, name: 'Hoàng Văn Em', email: 'em@example.com', credits: 10, status: 'banned', role: 'learn', sessions: 1, joined: '2026-03-01', rating: null, trustScore: 10, verificationStatus: 'rejected', completedSessions: 0 },
];

const MOCK_SESSIONS = [
    { id: 's1', topic: 'React.js Hooks Advanced', student: 'Nguyễn Văn An', mentor: 'Trần Thị Bình', date: '2026-03-10T10:00:00', status: 'upcoming', cost: 50, price: 50, type: 'single' },
    { id: 's2', topic: 'UI/UX Design Basics', student: 'Lê Hoàng Cường', mentor: 'Phạm Thị Dung', date: '2026-03-09T14:00:00', status: 'completed', cost: 40, price: 40, rating: 5, type: 'path', pathName: 'Trở thành UI/UX Designer' },
    { id: 's3', topic: 'Python Data Science', student: 'Nguyễn Văn An', mentor: 'Phạm Thị Dung', date: '2026-03-08T09:00:00', status: 'completed', cost: 60, price: 60, rating: 4, type: 'single' },
    { id: 's4', topic: 'Public Speaking Masterclass', student: 'Phạm Thị Dung', mentor: 'Trần Thị Bình', date: '2026-03-11T16:00:00', status: 'upcoming', cost: 70, price: 70, type: 'path', pathName: 'Kỹ năng mềm cho IT' },
];

const MOCK_PATHS = [
    { id: 'p1', title: 'Trở thành UI/UX Designer', mentor: 'Phạm Thị Dung', created: '2026-03-01', modules: 8, price: 400, students: 24, status: 'approved', level: 'Intermediate', category: 'Design', description: 'Learn UI/UX from scratch...', hasIssues: false },
    { id: 'p2', title: 'Fullstack Next.js Masterclass', mentor: 'Trần Thị Bình', created: '2026-03-10', modules: 12, price: 800, students: 0, status: 'pending', level: 'Advanced', category: 'Tech', description: 'Master Next.js framework...', hasIssues: true },
    { id: 'p3', title: 'Kỹ năng mềm cho IT', mentor: 'Trần Thị Bình', created: '2026-02-15', modules: 5, price: 200, students: 156, status: 'approved', level: 'Beginner', category: 'Soft Skills', description: 'Essential soft skills...', hasIssues: false },
    { id: 'p4', title: 'Hack não tiếng Anh', mentor: 'Trần Thị Bình', created: '2026-03-12', modules: 10, price: 300, students: 0, status: 'rejected', level: 'Intermediate', category: 'Languages', description: 'English learning path...', hasIssues: true },
];

const MOCK_MISSIONS = [
    { id: 'm1', title: 'Hoàn thành hồ sơ 100%', description: 'Điền đầy đủ thông tin profile', rewardCredits: 50, targetAudience: 'newUsers', startDate: '2026-03-01', endDate: '2026-04-01', isActive: true },
    { id: 'm2', title: 'Tham gia buổi học đầu tiên', description: 'Hoàn thành session đầu tiên', rewardCredits: 100, targetAudience: 'all', startDate: '2026-03-01', endDate: null, isActive: true },
    { id: 'm3', title: '10 sessions streak', description: 'Hoàn thành 10 buổi học liên tiếp', rewardCredits: 200, targetAudience: 'learners', startDate: '2026-03-01', endDate: '2026-05-01', isActive: true },
];

// ─── TAB CONFIGURATION ────────────────────────────────────────────────────────
const TABS = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'paths', label: 'Learning Paths', icon: BookOpen },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'sessions', label: 'Sessions', icon: CalendarDays },
    { id: 'missions', label: 'Missions', icon: Award },
];

// ─── HEADER COMPONENT ────────────────────────────────────────────────────────
const AdminHeader = () => {
    return (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-8 sm:p-10 relative overflow-hidden mb-8">
            {/* Decorative gradient blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-emerald-500 rounded-full mix-blend-screen filter blur-[100px] opacity-15 pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4 border border-white/10 backdrop-blur-md">
                            <Activity size={12} className="text-emerald-400" /> System Status: Optimal
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Admin Control Center</h1>
                        <p className="text-slate-300 mt-2">Manage SkillSync platform, monitor metrics, and optimize user experience</p>
                    </div>
                    <div className="flex gap-3 shrink-0 flex-wrap sm:flex-nowrap">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-md text-sm font-bold border border-white/10 transition-all">
                            <Bell size={16} /> Alerts
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-md text-sm font-bold border border-white/10 transition-all">
                            <Download size={16} /> Reports
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-md text-sm font-bold border border-white/10 transition-all">
                            <Settings size={16} /> Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── TAB NAVIGATION COMPONENT ────────────────────────────────────────────────
const TabNavigation = ({ activeTab, onTabChange }) => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-1.5 flex gap-1 mb-8 overflow-x-auto sticky top-16 z-40">
            {TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 sm:px-4 rounded-lg font-bold text-sm whitespace-nowrap transition-all shrink-0 ${isActive
                                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                    >
                        <Icon size={16} />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

// ─── MAIN ADMIN DASHBOARD COMPONENT ────────────────────────────────────────
export const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <AdminHeader />

                {/* Tab Navigation */}
                <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Tab Content */}
                <div className="animate-in fade-in duration-300">
                    {activeTab === 'overview' && (
                        <OverviewTab users={MOCK_USERS} sessions={MOCK_SESSIONS} paths={MOCK_PATHS} missions={MOCK_MISSIONS} />
                    )}

                    {activeTab === 'paths' && (
                        <PathsTab paths={MOCK_PATHS} />
                    )}

                    {activeTab === 'users' && (
                        <UsersTab users={MOCK_USERS} />
                    )}

                    {activeTab === 'sessions' && (
                        <SessionsTab sessions={MOCK_SESSIONS} />
                    )}

                    {activeTab === 'missions' && (
                        <MissionsTab missions={MOCK_MISSIONS} />
                    )}
                </div>

                {/* Footer */}
                <div className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
                    <p>SkillSync Admin Dashboard • Last updated: {new Date().toLocaleString('vi-VN')}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
