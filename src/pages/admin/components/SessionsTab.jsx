/**
 * 📅 SESSIONS TAB COMPONENT
 * Monitor and moderate all sessions, handle reports and refunds
 */

import React, { useState } from 'react';
import {
    CalendarDays, Filter, Search, Eye, AlertCircle, RefreshCw, Download,
    CheckCircle2, XCircle, Clock, Zap, MoreVertical
} from 'lucide-react';
import { useSessionManagement } from '../../hooks/useAdmin';

// ─── SESSION STATUS BADGE ────────────────────────────────────────────────────
const SessionStatusBadge = ({ status }) => {
    const configs = {
        upcoming: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: '📅' },
        completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: '✓' },
        cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: '✕' },
        'no-show': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: '⚠' },
    };
    const cfg = configs[status] || configs.upcoming;

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${cfg.bg} ${cfg.text} border ${cfg.border} rounded-full text-[11px] font-bold`}>
            {cfg.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

// ─── SESSION DETAIL & MODERATION MODAL ────────────────────────────────────────
const SessionModerationModal = ({ session, onClose, onModerate }) => {
    const [action, setAction] = useState(null);
    const [justification, setJustification] = useState('');
    const [refundAmount, setRefundAmount] = useState(session?.price || 0);

    if (!session) return null;

    const handleSubmit = () => {
        if (!justification.trim()) {
            alert('Please provide justification');
            return;
        }
        onModerate(session.id, action, justification, refundAmount);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white flex justify-between">
                    <h2 className="text-2xl font-bold">Session Moderation</h2>
                    <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg">✕</button>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Session Info */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Topic</p>
                            <p className="font-bold text-slate-900">{session.topic}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Price</p>
                            <p className="font-bold text-slate-900">{session.price} CR</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Student</p>
                            <p className="font-bold text-slate-900">{session.student}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Mentor</p>
                            <p className="font-bold text-slate-900">{session.mentor}</p>
                        </div>
                    </div>

                    {/* Action Selection */}
                    <div>
                        <h3 className="font-bold text-slate-900 mb-3">Moderation Action</h3>
                        <div className="space-y-2">
                            {['dismiss', 'warn', 'refund', 'ban'].map(act => (
                                <label key={act} className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition"
                                    style={{
                                        borderColor: action === act ? '#5A63F6' : '#e2e8f0',
                                        backgroundColor: action === act ? '#f0f4ff' : 'white'
                                    }}>
                                    <input
                                        type="radio"
                                        name="action"
                                        value={act}
                                        checked={action === act}
                                        onChange={(e) => setAction(e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <div>
                                        <p className="font-bold text-slate-900 capitalize">{act}</p>
                                        <p className="text-xs text-slate-500">
                                            {act === 'dismiss' && 'No action, close case'}
                                            {act === 'warn' && 'Send warning to involved users'}
                                            {act === 'refund' && 'Issue refund to student'}
                                            {act === 'ban' && 'Ban user from platform'}
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Refund Amount (if refund selected) */}
                    {action === 'refund' && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                            <p className="text-sm font-bold text-emerald-900 mb-3">Refund Amount</p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={refundAmount}
                                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                                    className="flex-1 px-3 py-2 border border-emerald-300 rounded-lg font-bold text-emerald-900"
                                    min="0"
                                    max={session.price}
                                />
                                <span className="font-bold text-emerald-900">CR</span>
                            </div>
                            <p className="text-xs text-emerald-700 mt-2">Max: {session.price} CR</p>
                        </div>
                    )}

                    {/* Justification */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                            Justification *
                        </label>
                        <textarea
                            value={justification}
                            onChange={(e) => setJustification(e.target.value)}
                            placeholder="Explain the reason for this moderation action..."
                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                            rows="4"
                        />
                        <p className="text-xs text-slate-500 mt-1">{justification.length}/500 characters</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleSubmit}
                            disabled={!action || justification.length < 10}
                            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-lg transition"
                        >
                            Submit Moderation
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── MAIN SESSIONS TAB ────────────────────────────────────────────────────────
export const SessionsTab = ({ sessions: mockSessions }) => {
    const sessionMgmt = useSessionManagement(mockSessions);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSession, setSelectedSession] = useState(null);
    const [showModerationModal, setShowModerationModal] = useState(false);

    const filteredBySearch = sessionMgmt.sessions.filter(s =>
        s.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.mentor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {/* Header Section */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-4">
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                            <CalendarDays size={20} className="text-blue-600" /> Sessions Management
                        </h3>
                        <p className="text-sm text-slate-500 mt-0.5">{sessionMgmt.filteredTotal} sessions</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition">
                            <RefreshCw size={16} /> Refresh
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition">
                            <Download size={16} /> Export
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by topic, student, or mentor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-600">{sessionMgmt.stats.total}</p>
                    <p className="text-xs font-bold text-blue-700 uppercase">Total</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-emerald-600">{sessionMgmt.stats.completed}</p>
                    <p className="text-xs font-bold text-emerald-700 uppercase">Completed</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-purple-600">{sessionMgmt.stats.upcoming}</p>
                    <p className="text-xs font-bold text-purple-700 uppercase">Upcoming</p>
                </div>
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-rose-600">{sessionMgmt.stats.cancelled}</p>
                    <p className="text-xs font-bold text-rose-700 uppercase">Cancelled</p>
                </div>
            </div>

            {/* Sessions Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                {['Topic', 'Student', 'Mentor', 'Date', 'Status', 'Rating', 'Action'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBySearch.map(session => (
                                <tr key={session.id} className="border-b border-slate-100 hover:bg-slate-50 transition group">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                {session.topic.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{session.topic}</p>
                                                {session.pathName && <p className="text-xs text-slate-500">{session.pathName}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600 font-medium">{session.student}</td>
                                    <td className="px-4 py-3 text-slate-600 font-medium">{session.mentor}</td>
                                    <td className="px-4 py-3 text-xs font-bold text-slate-500">
                                        {new Date(session.date).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-4 py-3">
                                        <SessionStatusBadge status={session.status} />
                                    </td>
                                    <td className="px-4 py-3">
                                        {session.rating ? (
                                            <span className="flex items-center gap-1 font-bold text-amber-600">
                                                ⭐ {session.rating}/5
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => {
                                                setSelectedSession(session);
                                                setShowModerationModal(true);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded transition"
                                        >
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs font-bold text-slate-600">
                    <span>Page {sessionMgmt.currentPage} of {sessionMgmt.totalPages}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => sessionMgmt.setCurrentPage(Math.max(1, sessionMgmt.currentPage - 1))}
                            disabled={sessionMgmt.currentPage === 1}
                            className="px-3 py-1.5 border border-slate-300 rounded hover:bg-white disabled:opacity-50"
                        >
                            ← Prev
                        </button>
                        <button
                            onClick={() => sessionMgmt.setCurrentPage(Math.min(sessionMgmt.totalPages, sessionMgmt.currentPage + 1))}
                            disabled={sessionMgmt.currentPage === sessionMgmt.totalPages}
                            className="px-3 py-1.5 border border-slate-300 rounded hover:bg-white disabled:opacity-50"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </div>

            {/* Moderation Modal */}
            {showModerationModal && selectedSession && (
                <SessionModerationModal
                    session={selectedSession}
                    onClose={() => {
                        setShowModerationModal(false);
                        setSelectedSession(null);
                    }}
                    onModerate={(sessionId, action, justification, refund) => {
                        console.log('Moderation applied:', { sessionId, action, justification, refund });
                    }}
                />
            )}
        </div>
    );
};

export default SessionsTab;
