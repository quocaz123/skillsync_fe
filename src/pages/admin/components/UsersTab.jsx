/**
 * 👥 USERS TAB COMPONENT
 * Manage all users, verification, ban status, and trust scores
 */

import React, { useState, useMemo } from 'react';
import {
    Search, Filter, ChevronDown, Eye, Shield, Trash2, CheckCircle2,
    AlertCircle, XCircle, Clock, TrendingUp, Users
} from 'lucide-react';
import { useUserManagement, useTrustScore } from '../../hooks/useAdmin';

// ─── USER STATUS BADGE ─────────────────────────────────────────────────────
const UserStatusBadge = ({ status }) => {
    const configs = {
        active: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: '🟢' },
        inactive: { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200', icon: '⚪' },
        banned: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: '🔴' },
    };
    const cfg = configs[status] || configs.inactive;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${cfg.bg} ${cfg.text} border ${cfg.border} rounded-full text-[11px] font-bold`}>
            {cfg.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

// ─── VERIFICATION STATUS BADGE ────────────────────────────────────────────
const VerificationBadge = ({ status, onReview }) => {
    const configs = {
        verified: { icon: <CheckCircle2 size={14} />, bg: 'bg-emerald-50', text: 'text-emerald-700', label: '✓ Verified' },
        pending: { icon: <Clock size={14} />, bg: 'bg-amber-50', text: 'text-amber-700', label: '⏳ Pending', actionable: true },
        rejected: { icon: <XCircle size={14} />, bg: 'bg-red-50', text: 'text-red-700', label: '✗ Rejected' },
        none: { icon: null, bg: 'bg-slate-50', text: 'text-slate-500', label: 'None' },
    };
    const cfg = configs[status] || configs.none;

    return (
        <button
            onClick={onReview}
            disabled={!cfg.actionable}
            className={`inline-flex items-center gap-1 px-2 py-1 ${cfg.bg} ${cfg.text} rounded-md text-[11px] font-bold 
                ${cfg.actionable ? 'hover:shadow-md cursor-pointer transition-all' : 'cursor-default'}`}
        >
            {cfg.icon}
            {cfg.label}
        </button>
    );
};

// ─── TRUST SCORE PROGRESS ────────────────────────────────────────────────────
const TrustScoreDisplay = ({ user }) => {
    const { trustScore, tier } = useTrustScore(user);

    const colorMap = {
        Excellent: 'bg-emerald-500',
        Good: 'bg-emerald-400',
        Fair: 'bg-amber-400',
        Warning: 'bg-orange-500',
        Low: 'bg-red-500',
    };

    return (
        <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full ${colorMap[tier.tier]} rounded-full transition-all`}
                    style={{ width: `${trustScore}%` }}
                />
            </div>
            <span className="text-xs font-bold text-slate-700">{trustScore}</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${tier.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' : tier.color === 'light-green' ? 'bg-lime-100 text-lime-700' : tier.color === 'amber' ? 'bg-amber-100 text-amber-700' : tier.color === 'orange' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                {tier.tier}
            </span>
        </div>
    );
};

// ─── USER DETAIL MODAL ────────────────────────────────────────────────────────
const UserDetailModal = ({ user, onClose, onAction }) => {
    const [actionType, setActionType] = useState(null);
    const [reason, setReason] = useState('');
    const { trustScore, canTeach } = useTrustScore(user);

    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white flex justify-between items-center">
                    <h2 className="text-2xl font-bold">User Profile</h2>
                    <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition">✕</button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Name</p>
                            <p className="font-bold text-lg text-slate-900">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Email</p>
                            <p className="font-medium text-slate-700">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Role</p>
                            <div className="flex gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'teach' ? 'bg-amber-100 text-amber-700' : user.role === 'learn' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                    {user.role === 'teach' ? 'Mentor' : user.role === 'learn' ? 'Learner' : 'Both'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Status</p>
                            <UserStatusBadge status={user.status} />
                        </div>
                    </div>

                    {/* Trust & Verification */}
                    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <h3 className="font-bold text-slate-900">Trust & Verification</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-600">Trust Score:</span>
                                <TrustScoreDisplay user={user} />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-600">Can Teach:</span>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${canTeach ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                    {canTeach ? '✓ Yes' : '✗ No'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-600">Verification:</span>
                                <VerificationBadge status={user.verificationStatus} />
                            </div>
                        </div>
                    </div>

                    {/* Activity Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-blue-50 rounded-xl p-3">
                            <p className="text-xs font-bold text-blue-600 uppercase">Sessions</p>
                            <p className="text-2xl font-bold text-blue-900">{user.totalSessions || 0}</p>
                        </div>
                        <div className="bg-amber-50 rounded-xl p-3">
                            <p className="text-xs font-bold text-amber-600 uppercase">Rating</p>
                            <p className="text-2xl font-bold text-amber-900">{user.averageRating?.toFixed(1) || 'N/A'}</p>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-3">
                            <p className="text-xs font-bold text-emerald-600 uppercase">Credits</p>
                            <p className="text-2xl font-bold text-emerald-900">{user.credits || 0}</p>
                        </div>
                    </div>

                    {/* Action Section */}
                    <div className="bg-slate-100 rounded-xl p-4">
                        <h3 className="font-bold text-slate-900 mb-3">Admin Actions</h3>
                        <div className="space-y-2">
                            {actionType === null ? (
                                <div className="flex gap-2">
                                    {user.verificationStatus === 'pending' && (
                                        <button
                                            onClick={() => setActionType('review')}
                                            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
                                        >
                                            <Eye size={16} /> Review Evidence
                                        </button>
                                    )}
                                    {user.status === 'active' && (
                                        <button
                                            onClick={() => setActionType('ban')}
                                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
                                        >
                                            <Shield size={16} /> Ban User
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder={actionType === 'ban' ? 'Ban reason...' : 'Review notes...'}
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                        rows="3"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                onAction(user.id, actionType, reason);
                                                setReason('');
                                                setActionType(null);
                                            }}
                                            className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition"
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => {
                                                setReason('');
                                                setActionType(null);
                                            }}
                                            className="flex-1 px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-700 font-bold rounded-lg transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── MAIN USERS TAB COMPONENT ─────────────────────────────────────────────────
export const UsersTab = ({ users: mockUsers }) => {
    const userMgmt = useUserManagement(mockUsers);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const filterOptions = [
        { key: 'status', label: 'Status', options: ['active', 'inactive', 'banned'] },
        { key: 'role', label: 'Role', options: ['learn', 'teach', 'both'] },
        { key: 'verification', label: 'Verification', options: ['none', 'pending', 'verified', 'rejected'] },
    ];

    return (
        <div className="space-y-4">
            {/* Header with Search & Filters */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                            <Users size={20} className="text-indigo-600" /> User Management
                        </h3>
                        <p className="text-sm text-slate-500 mt-0.5">{userMgmt.totalUsers} users total</p>
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                    >
                        <Filter size={16} /> Filters
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={userMgmt.filters.search}
                        onChange={(e) => userMgmt.updateFilter('search', e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                    />
                </div>

                {/* Active Filters Display */}
                {(userMgmt.filters.status || userMgmt.filters.role || userMgmt.filters.verification) && (
                    <div className="flex flex-wrap gap-2">
                        {userMgmt.filters.status && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                                Status: {userMgmt.filters.status}
                                <button onClick={() => userMgmt.updateFilter('status', null)}>✕</button>
                            </div>
                        )}
                        {userMgmt.filters.role && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                                Role: {userMgmt.filters.role}
                                <button onClick={() => userMgmt.updateFilter('role', null)}>✕</button>
                            </div>
                        )}
                        {userMgmt.filters.verification && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                                Verification: {userMgmt.filters.verification}
                                <button onClick={() => userMgmt.updateFilter('verification', null)}>✕</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {filterOptions.map(filter => (
                            <div key={filter.key}>
                                <p className="text-xs font-bold text-slate-600 uppercase mb-2">{filter.label}</p>
                                <select
                                    value={userMgmt.filters[filter.key] || ''}
                                    onChange={(e) => userMgmt.updateFilter(filter.key, e.target.value || null)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:border-indigo-500 outline-none"
                                >
                                    <option value="">All</option>
                                    {filter.options.map(opt => (
                                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Total', value: userMgmt.stats.total, color: 'text-slate-600 bg-slate-50' },
                    { label: 'Active', value: userMgmt.stats.active, color: 'text-emerald-600 bg-emerald-50' },
                    { label: 'Pending', value: userMgmt.stats.pending, color: 'text-amber-600 bg-amber-50' },
                    { label: 'Banned', value: userMgmt.stats.banned, color: 'text-red-600 bg-red-50' },
                ].map((stat, i) => (
                    <div key={i} className={`rounded-lg p-3 text-center border ${stat.color}`}>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs font-bold uppercase">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                {['User', 'Role', 'Verification', 'Trust Score', 'Status', 'Action'].map(header => (
                                    <th key={header} className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {userMgmt.users.map(user => (
                                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition group">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{user.name}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'teach' ? 'bg-amber-100 text-amber-700' :
                                                user.role === 'learn' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-purple-100 text-purple-700'
                                            }`}>
                                            {user.role === 'teach' ? 'Mentor' : user.role === 'learn' ? 'Learner' : 'Both'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <VerificationBadge status={user.verificationStatus} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <TrustScoreDisplay user={user} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <UserStatusBadge status={user.status} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => setSelectedUser(user)}
                                            className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded transition"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs font-bold text-slate-600">
                    <span>
                        Showing {(userMgmt.currentPage - 1) * 10 + 1} - {Math.min(userMgmt.currentPage * 10, userMgmt.totalUsers)} of {userMgmt.totalUsers}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => userMgmt.setCurrentPage(Math.max(1, userMgmt.currentPage - 1))}
                            disabled={userMgmt.currentPage === 1}
                            className="px-3 py-1.5 border border-slate-300 rounded hover:bg-white disabled:opacity-50"
                        >
                            ← Prev
                        </button>
                        <span className="px-3 py-1.5">{userMgmt.currentPage} / {userMgmt.totalPages}</span>
                        <button
                            onClick={() => userMgmt.setCurrentPage(Math.min(userMgmt.totalPages, userMgmt.currentPage + 1))}
                            disabled={userMgmt.currentPage === userMgmt.totalPages}
                            className="px-3 py-1.5 border border-slate-300 rounded hover:bg-white disabled:opacity-50"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onAction={(userId, actionType, reason) => {
                        console.log('Action:', { userId, actionType, reason });
                        setSelectedUser(null);
                    }}
                />
            )}
        </div>
    );
};

export default UsersTab;
