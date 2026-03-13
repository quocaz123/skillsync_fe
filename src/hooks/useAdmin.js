/**
 * 🎣 ADMIN HOOKS - Custom React Hooks for Admin Features
 * Integrates business logic with React state management
 */

import { useState, useCallback, useMemo } from 'react';
import {
    TrustScoreService,
    UserManagementService,
    SessionManagementService,
    LearningPathService,
    MissionService,
    AnalyticsService,
} from '../services/adminServices';

// ──────────────────────────────────────────────────────────────────────────────
// USER MANAGEMENT HOOKS
// ──────────────────────────────────────────────────────────────────────────────

export const useUserManagement = (users) => {
    const [filters, setFilters] = useState({
        status: null,
        role: null,
        verification: null,
        trustScoreMin: null,
        search: '',
    });
    const [sortBy, setSortBy] = useState('trustScore');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Apply filters and sorting
    const filteredUsers = useMemo(() => {
        const filtered = UserManagementService.filterUsers(users, filters);
        const sorted = UserManagementService.sortUsers(filtered, sortBy, sortOrder);
        return sorted;
    }, [users, filters, sortBy, sortOrder]);

    // Paginate
    const paginatedUsers = useMemo(() => {
        const startIdx = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(startIdx, startIdx + itemsPerPage);
    }, [filteredUsers, currentPage]);

    const formattedUsers = useMemo(() => {
        return paginatedUsers.map(user => UserManagementService.formatUserForAdmin(user));
    }, [paginatedUsers]);

    const updateFilter = useCallback((filterKey, value) => {
        setFilters(prev => ({ ...prev, [filterKey]: value }));
        setCurrentPage(1);
    }, []);

    const updateSort = useCallback((newSortBy) => {
        if (sortBy === newSortBy) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('desc');
        }
        setCurrentPage(1);
    }, [sortBy]);

    return {
        users: formattedUsers,
        totalUsers: filteredUsers.length,
        currentPage,
        totalPages: Math.ceil(filteredUsers.length / itemsPerPage),
        filters,
        updateFilter,
        setCurrentPage,
        sortBy,
        sortOrder,
        updateSort,
        stats: {
            total: users.length,
            active: users.filter(u => u.status === 'active').length,
            banned: users.filter(u => u.status === 'banned').length,
            pending: users.filter(u => u.verificationStatus === 'pending').length,
        }
    };
};

export const useTrustScore = (user) => {
    const trustScore = useMemo(() => {
        return TrustScoreService.calculateTrustScore(user);
    }, [user]);

    const tier = useMemo(() => {
        return TrustScoreService.getTrustScoreTier(trustScore);
    }, [trustScore]);

    const canTeach = useMemo(() => {
        return TrustScoreService.canTeach(trustScore);
    }, [trustScore]);

    return { trustScore, tier, canTeach };
};

export const useUserBan = () => {
    const [bannedUsers, setBannedUsers] = useState([]);
    const [banHistory, setBanHistory] = useState([]);

    const banUser = useCallback((userId, reason, adminId) => {
        const banAction = UserManagementService.createBanAction(userId, reason, adminId);
        setBannedUsers(prev => [...prev, banAction]);
        setBanHistory(prev => [...prev, banAction]);
    }, []);

    const unbanUser = useCallback((userId) => {
        setBannedUsers(prev => prev.filter(b => b.userId !== userId));
    }, []);

    return { bannedUsers, banHistory, banUser, unbanUser };
};

// ──────────────────────────────────────────────────────────────────────────────
// SESSION MANAGEMENT HOOKS
// ──────────────────────────────────────────────────────────────────────────────

export const useSessionManagement = (sessions) => {
    const [filters, setFilters] = useState({
        status: null,
        type: null,
        dateRange: null,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const stats = useMemo(() => {
        return SessionManagementService.calculateSessionStats(sessions);
    }, [sessions]);

    const filteredSessions = useMemo(() => {
        let filtered = sessions;

        if (filters.status) {
            filtered = filtered.filter(s => s.status === filters.status);
        }

        if (filters.type) {
            filtered = filtered.filter(s => s.type === filters.type);
        }

        return filtered;
    }, [sessions, filters]);

    const paginatedSessions = useMemo(() => {
        const startIdx = (currentPage - 1) * itemsPerPage;
        return filteredSessions.slice(startIdx, startIdx + itemsPerPage);
    }, [filteredSessions, currentPage]);

    const updateFilter = useCallback((filterKey, value) => {
        setFilters(prev => ({ ...prev, [filterKey]: value }));
        setCurrentPage(1);
    }, []);

    return {
        sessions: paginatedSessions,
        stats,
        filteredTotal: filteredSessions.length,
        currentPage,
        totalPages: Math.ceil(filteredSessions.length / itemsPerPage),
        setCurrentPage,
        filters,
        updateFilter,
    };
};

export const useSessionModeration = () => {
    const [moderationRecords, setModerationRecords] = useState([]);

    const applyModeration = useCallback((sessionId, action, justification, adminId) => {
        const validation = SessionManagementService.validateModerationAction(
            action,
            justification
        );

        if (!validation.isValid) {
            return { success: false, error: validation.error };
        }

        const record = SessionManagementService.createModerationRecord(
            sessionId,
            action,
            justification,
            adminId
        );

        setModerationRecords(prev => [...prev, record]);
        return { success: true, record };
    }, []);

    return { moderationRecords, applyModeration };
};

export const useSessionRefund = () => {
    const [refunds, setRefunds] = useState([]);

    const calculateRefund = useCallback((session, cancelledBy, timeBefore) => {
        return SessionManagementService.calculateRefund(session, cancelledBy, timeBefore);
    }, []);

    const processRefund = useCallback((session, refundAmount, reason) => {
        const refund = {
            sessionId: session.id,
            studentId: session.studentId,
            amount: refundAmount,
            reason,
            processedDate: new Date().toISOString(),
            status: 'pending',
        };

        setRefunds(prev => [...prev, refund]);
        return refund;
    }, []);

    return { refunds, calculateRefund, processRefund };
};

// ──────────────────────────────────────────────────────────────────────────────
// LEARNING PATH HOOKS
// ──────────────────────────────────────────────────────────────────────────────

export const useLearningPathApproval = (paths) => {
    const [approvalRecords, setApprovalRecords] = useState([]);
    const [filters, setFilters] = useState({ status: 'pending' });

    const pendingPaths = useMemo(() => {
        return paths.filter(p => {
            if (filters.status) return p.status === filters.status;
            return true;
        });
    }, [paths, filters]);

    const validatePath = useCallback((path) => {
        return LearningPathService.validatePathForApproval(path);
    }, []);

    const approvePath = useCallback((pathId, adminId) => {
        const record = LearningPathService.createApprovalRecord(
            pathId,
            true,
            null,
            adminId
        );
        setApprovalRecords(prev => [...prev, record]);
        return record;
    }, []);

    const rejectPath = useCallback((pathId, reason, adminId) => {
        const record = LearningPathService.createApprovalRecord(
            pathId,
            false,
            reason,
            adminId
        );
        setApprovalRecords(prev => [...prev, record]);
        return record;
    }, []);

    return {
        pendingPaths,
        approvalRecords,
        filters,
        setFilters,
        validatePath,
        approvePath,
        rejectPath,
    };
};

export const usePathMetrics = (path, enrollments, sessions) => {
    const metrics = useMemo(() => {
        return LearningPathService.calculatePathMetrics(path, enrollments, sessions);
    }, [path, enrollments, sessions]);

    return metrics;
};

// ──────────────────────────────────────────────────────────────────────────────
// MISSION HOOKS
// ──────────────────────────────────────────────────────────────────────────────

export const useMissionManagement = (missions) => {
    const [localMissions, setLocalMissions] = useState(missions);
    const [completions, setCompletions] = useState([]);

    const validateMission = useCallback((missionData) => {
        return MissionService.validateMission(missionData);
    }, []);

    const createMission = useCallback((missionData) => {
        const validation = validateMission(missionData);
        if (!validation.isValid) {
            return { success: false, errors: validation.errors };
        }

        const newMission = {
            id: `mission_${Date.now()}`,
            ...missionData,
            createdAt: new Date().toISOString(),
            isArchived: false,
        };

        setLocalMissions(prev => [...prev, newMission]);
        return { success: true, mission: newMission };
    }, [validateMission]);

    const updateMission = useCallback((missionId, updates) => {
        setLocalMissions(prev =>
            prev.map(m => m.id === missionId ? { ...m, ...updates } : m)
        );
    }, []);

    const deleteMission = useCallback((missionId) => {
        setLocalMissions(prev => prev.filter(m => m.id !== missionId));
    }, []);

    const getMissionStats = useCallback((missionId) => {
        const mission = localMissions.find(m => m.id === missionId);
        if (!mission) return null;

        const missionCompletions = completions.filter(c => c.missionId === missionId);
        return MissionService.calculateMissionStats(mission, missionCompletions);
    }, [localMissions, completions]);

    return {
        missions: localMissions,
        validateMission,
        createMission,
        updateMission,
        deleteMission,
        getMissionStats,
        recordCompletion: (userId, missionId) => {
            setCompletions(prev => [...prev, {
                userId,
                missionId,
                completedDate: new Date().toISOString(),
            }]);
        },
    };
};

// ──────────────────────────────────────────────────────────────────────────────
// ANALYTICS HOOKS
// ──────────────────────────────────────────────────────────────────────────────

export const useAdminAnalytics = (users, sessions, paths, missions) => {
    const overviewStats = useMemo(() => {
        return AnalyticsService.generateOverviewStats(users, sessions, paths, missions);
    }, [users, sessions, paths, missions]);

    const userCohortAnalysis = useMemo(() => {
        return AnalyticsService.generateUserCohortAnalysis(users, 30);
    }, [users]);

    const verificationMetrics = useMemo(() => {
        return AnalyticsService.calculateVerificationMetrics(users);
    }, [users]);

    const trustScoreDistribution = useMemo(() => {
        return AnalyticsService.calculateTrustScoreDistribution(users);
    }, [users]);

    const revenueByCategory = useMemo(() => {
        return AnalyticsService.calculateRevenueByCategory(sessions);
    }, [sessions]);

    const mentorPerformance = useMemo(() => {
        return AnalyticsService.calculateMentorPerformance(users, sessions);
    }, [users, sessions]);

    return {
        overview: overviewStats,
        userCohort: userCohortAnalysis,
        verification: verificationMetrics,
        trustScore: trustScoreDistribution,
        revenue: revenueByCategory,
        mentorPerformance,
    };
};

// ──────────────────────────────────────────────────────────────────────────────
// COMBINATOR HOOK
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Master hook that provides all admin functionality
 * Usage: const admin = useAdminDashboard(mockUsers, mockSessions, mockPaths, mockMissions)
 */
export const useAdminDashboard = (users = [], sessions = [], paths = [], missions = []) => {
    const userMgmt = useUserManagement(users);
    const sessionMgmt = useSessionManagement(sessions);
    const pathApproval = useLearningPathApproval(paths);
    const missionMgmt = useMissionManagement(missions);
    const analytics = useAdminAnalytics(users, sessions, paths, missions);
    const sessionModeration = useSessionModeration();
    const sessionRefund = useSessionRefund();
    const banMgmt = useUserBan();

    return {
        users: userMgmt,
        sessions: sessionMgmt,
        paths: pathApproval,
        missions: missionMgmt,
        analytics,
        moderation: sessionModeration,
        refunds: sessionRefund,
        bans: banMgmt,
    };
};

export default {
    useUserManagement,
    useTrustScore,
    useUserBan,
    useSessionManagement,
    useSessionModeration,
    useSessionRefund,
    useLearningPathApproval,
    usePathMetrics,
    useMissionManagement,
    useAdminAnalytics,
    useAdminDashboard,
};
