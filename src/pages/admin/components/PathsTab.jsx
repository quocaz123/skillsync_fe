/**
 * 📚 LEARNING PATHS TAB COMPONENT
 * Approve, review, and manage learning paths created by mentors
 */

import React, { useState } from 'react';
import {
    BookOpen, CheckCircle2, XCircle, Eye, AlertCircle, Zap,
    TrendingUp, Users, Clock, Edit2, MessageSquare
} from 'lucide-react';
import { useLearningPathApproval, usePathMetrics } from '../../hooks/useAdmin';

// ─── PATH STATUS BADGE ───────────────────────────────────────────────────────
const PathStatusBadge = ({ status }) => {
    const configs = {
        approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: '✓' },
        pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: '⏳' },
        rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: '✕' },
        draft: { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200', icon: '📝' },
    };
    const cfg = configs[status] || configs.draft;

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${cfg.bg} ${cfg.text} border ${cfg.border} rounded-full text-[11px] font-bold`}>
            {cfg.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

// ─── PATH DETAIL & APPROVAL MODAL ─────────────────────────────────────────────
const PathApprovalModal = ({ path, onClose, onApprove, onReject }) => {
    const [decision, setDecision] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [issues, setIssues] = useState([]);

    const commonIssues = [
        'Insufficient content',
        'Low video quality',
        'Inappropriate content',
        'Copyright concerns',
        'Unrealistic pricing',
        'Unclear learning objectives',
        'Duplicate path',
    ];

    const handleSubmit = () => {
        if (decision === 'approve') {
            onApprove(path.id);
        } else if (decision === 'reject' && issues.length > 0) {
            onReject(path.id, issues.join(', '));
        } else if (!feedback.trim()) {
            alert('Please provide feedback');
        }
    };

    if (!path) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white sticky top-0 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">{path.title}</h2>
                        <p className="text-purple-100 text-sm mt-1">By {path.mentor}</p>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg">✕</button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Path Overview */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-slate-50 rounded-lg p-3">
                            <p className="text-xs font-bold text-slate-500 uppercase">Modules</p>
                            <p className="text-2xl font-bold text-slate-900">{path.modules}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                            <p className="text-xs font-bold text-slate-500 uppercase">Price</p>
                            <p className="text-2xl font-bold text-slate-900">{path.price}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                            <p className="text-xs font-bold text-slate-500 uppercase">Level</p>
                            <p className="text-lg font-bold text-slate-900">{path.level}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                            <p className="text-xs font-bold text-slate-500 uppercase">Category</p>
                            <p className="text-lg font-bold text-slate-900">{path.category}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="border-b border-slate-200 pb-4">
                        <h3 className="font-bold text-slate-900 mb-2">Description</h3>
                        <p className="text-slate-600 line-clamp-3">{path.description}</p>
                    </div>

                    {/* Quality Checklist */}
                    <div className="bg-slate-50 rounded-xl p-4">
                        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <CheckCircle2 size={18} className="text-emerald-600" /> Approval Criteria
                        </h3>
                        <div className="space-y-2">
                            {[
                                { item: 'Minimum 5 modules', pass: true },
                                { item: 'Each module ≥10 minutes', pass: true },
                                { item: 'All modules have materials', pass: true },
                                { item: 'Clear learning objectives', pass: true },
                                { item: 'Appropriate pricing', pass: false },
                            ].map((check, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded border-2 ${check.pass ? 'bg-emerald-500 border-emerald-500' : 'bg-red-50 border-red-300'}`} />
                                    <span className={`text-sm font-medium ${check.pass ? 'text-slate-700' : 'text-red-600'}`}>
                                        {check.item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Decision Section */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-900">Your Decision</h3>

                        <div className="space-y-2">
                            <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition border-emerald-300 bg-emerald-50">
                                <input
                                    type="radio"
                                    name="decision"
                                    value="approve"
                                    checked={decision === 'approve'}
                                    onChange={(e) => {
                                        setDecision(e.target.value);
                                        setIssues([]);
                                    }}
                                    className="w-4 h-4"
                                />
                                <div>
                                    <p className="font-bold text-emerald-900 flex items-center gap-1">
                                        <CheckCircle2 size={16} /> Approve Path
                                    </p>
                                    <p className="text-xs text-emerald-700">Publish to platform immediately</p>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 p-3 border-2 border-red-300 rounded-lg cursor-pointer transition"
                                onClick={() => setDecision('reject')}>
                                <input
                                    type="radio"
                                    name="decision"
                                    value="reject"
                                    checked={decision === 'reject'}
                                    onChange={(e) => setDecision(e.target.value)}
                                    className="w-4 h-4"
                                />
                                <div>
                                    <p className="font-bold text-red-900 flex items-center gap-1">
                                        <XCircle size={16} /> Reject Path
                                    </p>
                                    <p className="text-xs text-red-700">Request improvements</p>
                                </div>
                            </label>
                        </div>

                        {/* Issues Selection (if reject) */}
                        {decision === 'reject' && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <p className="text-sm font-bold text-red-900 mb-3">Issues Found</p>
                                <div className="space-y-2">
                                    {commonIssues.map(issue => (
                                        <label key={issue} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={issues.includes(issue)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setIssues([...issues, issue]);
                                                    } else {
                                                        setIssues(issues.filter(i => i !== issue));
                                                    }
                                                }}
                                                className="w-4 h-4 rounded"
                                            />
                                            <span className="text-sm text-red-900">{issue}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Additional Notes */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                            Additional Notes (Optional)
                        </label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Provide specific feedback for the mentor..."
                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
                            rows="3"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleSubmit}
                            disabled={!decision}
                            className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white font-bold rounded-lg transition"
                        >
                            {decision === 'approve' ? 'Approve & Publish' : decision === 'reject' ? 'Reject & Send Feedback' : 'Make Decision'}
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

// ─── MAIN PATHS TAB ────────────────────────────────────────────────────────────
export const PathsTab = ({ paths: mockPaths }) => {
    const pathApproval = useLearningPathApproval(mockPaths);
    const [selectedPath, setSelectedPath] = useState(null);
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                            <BookOpen size={20} className="text-purple-600" /> Learning Paths Management
                        </h3>
                        <p className="text-sm text-slate-500 mt-0.5">{pathApproval.pendingPaths.length} paths pending review</p>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={pathApproval.filters.status || 'pending'}
                            onChange={(e) => pathApproval.setFilters({ status: e.target.value || null })}
                            className="px-4 py-2 border border-slate-300 rounded-lg font-bold bg-white focus:border-purple-500 outline-none"
                        >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="">All</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Pending', count: mockPaths.filter(p => p.status === 'pending').length, color: 'bg-amber-50 text-amber-600 border-amber-200' },
                    { label: 'Approved', count: mockPaths.filter(p => p.status === 'approved').length, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
                    { label: 'Rejected', count: mockPaths.filter(p => p.status === 'rejected').length, color: 'bg-red-50 text-red-600 border-red-200' },
                    { label: 'Total', count: mockPaths.length, color: 'bg-slate-50 text-slate-600 border-slate-200' },
                ].map((stat, i) => (
                    <div key={i} className={`rounded-lg p-3 text-center border ${stat.color}`}>
                        <p className="text-2xl font-bold">{stat.count}</p>
                        <p className="text-xs font-bold uppercase">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Paths Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pathApproval.pendingPaths.map(path => (
                    <div
                        key={path.id}
                        className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition"
                    >
                        {/* Cover */}
                        <div className="h-32 bg-gradient-to-br from-purple-400 to-purple-600 relative flex items-center justify-center text-white text-5xl">
                            📚
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-3">
                            {/* Title */}
                            <div>
                                <div className="flex items-start justify-between mb-1">
                                    <h3 className="font-bold text-slate-900 line-clamp-2 flex-1">{path.title}</h3>
                                    <PathStatusBadge status={path.status} />
                                </div>
                                <p className="text-xs font-medium text-slate-500">By {path.mentor}</p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100">
                                <div className="text-center">
                                    <p className="text-xs font-bold text-slate-500 uppercase">Modules</p>
                                    <p className="text-lg font-bold text-slate-900">{path.modules}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-bold text-slate-500 uppercase">Price</p>
                                    <p className="text-lg font-bold text-amber-600">{path.price} CR</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-bold text-slate-500 uppercase">Level</p>
                                    <p className="text-lg font-bold text-slate-900">{path.level}</p>
                                </div>
                            </div>

                            {/* Quality Indicator */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="font-bold text-slate-600">Quality Score</span>
                                    <span className="font-bold text-emerald-600">87%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '87%' }} />
                                </div>
                            </div>

                            {/* Issues Badge */}
                            {path.status === 'pending' && path.hasIssues && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-center gap-2">
                                    <AlertCircle size={14} className="text-amber-600 flex-shrink-0" />
                                    <span className="text-xs font-bold text-amber-700">Needs improvement</span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => {
                                        setSelectedPath(path);
                                        setShowModal(true);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-lg transition"
                                >
                                    <Eye size={14} /> Review
                                </button>
                                <button className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition">
                                    📋
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {pathApproval.pendingPaths.length === 0 && (
                <div className="bg-slate-50 rounded-xl p-8 text-center">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="font-bold text-slate-900 mb-1">No paths to review</p>
                    <p className="text-sm text-slate-500">All pending paths have been processed</p>
                </div>
            )}

            {/* Approval Modal */}
            {showModal && selectedPath && (
                <PathApprovalModal
                    path={selectedPath}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedPath(null);
                    }}
                    onApprove={(pathId) => {
                        pathApproval.approvePath(pathId, 'admin_001');
                        setShowModal(false);
                    }}
                    onReject={(pathId, reason) => {
                        pathApproval.rejectPath(pathId, reason, 'admin_001');
                        setShowModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default PathsTab;
