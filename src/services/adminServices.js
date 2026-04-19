

// ─── USER MANAGEMENT SERVICE ───────────────────────────────────────────────────
export class UserManagementService {
    static formatUserForAdmin(user) {
        return {
            ...user,
            isHighRisk: (user.warningCount || 0) > 3,
            sessionCompletionRate: user.totalSessions > 0
                ? Math.round((user.completedSessions / user.totalSessions) * 100)
                : null,
        };
    }

    static filterUsers(users, filters) {
        return users.filter(user => {
            if (filters.status && user.status !== filters.status) return false;
            if (filters.role && user.role !== filters.role) return false;

            if (filters.verification && user.verificationStatus !== filters.verification) {
                return false;
            }

            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                if (!user.name.toLowerCase().includes(searchLower) &&
                    !user.email.toLowerCase().includes(searchLower)) {
                    return false;
                }
            }

            return true;
        });
    }

    static sortUsers(users, sortBy, order = 'asc') {
        const sorted = [...users].sort((a, b) => {
            let aVal, bVal;

            switch (sortBy) {

                case 'rating':
                    aVal = a.averageRating || 0;
                    bVal = b.averageRating || 0;
                    break;
                case 'sessions':
                    aVal = a.totalSessions || 0;
                    bVal = b.totalSessions || 0;
                    break;
                case 'joined':
                    aVal = new Date(a.joinedDate).getTime();
                    bVal = new Date(b.joinedDate).getTime();
                    break;
                default: // name
                    aVal = a.name.toLowerCase();
                    bVal = b.name.toLowerCase();
            }

            const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            return order === 'desc' ? -comparison : comparison;
        });

        return sorted;
    }

    static validateUserBan(user, banReason) {
        const isValid = user && banReason && banReason.trim().length > 0;
        return {
            isValid,
            errors: !isValid ? ['User and ban reason required'] : []
        };
    }

    static createBanAction(userId, reason, adminId) {
        return {
            action: 'ban',
            userId,
            reason,
            performedBy: adminId,
            timestamp: new Date().toISOString(),
            status: 'active',
            canAppeal: true,
            appealDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
    }
}

// ─── SESSION MANAGEMENT SERVICE ───────────────────────────────────────────────
export class SessionManagementService {
    static calculateSessionStats(sessions) {
        const total = sessions.length;
        const completed = sessions.filter(s => s.status === 'completed').length;
        const upcoming = sessions.filter(s => s.status === 'upcoming').length;
        const cancelled = sessions.filter(s => s.status === 'cancelled').length;
        const noShow = sessions.filter(s => s.status === 'no-show').length;

        return {
            total,
            completed,
            upcoming,
            cancelled,
            noShow,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
            averageRating: this.calculateAverageRating(sessions),
            totalRevenue: sessions.reduce((sum, s) => sum + (s.price || 0), 0),
        };
    }

    static calculateAverageRating(sessions) {
        const ratedSessions = sessions.filter(s => s.studentRating || s.mentorRating);
        if (ratedSessions.length === 0) return null;

        const totalRating = ratedSessions.reduce((sum, s) => {
            const rating = s.studentRating || s.mentorRating || 0;
            return sum + rating;
        }, 0);

        return (totalRating / ratedSessions.length).toFixed(1);
    }

    static determineNoShowStatus(session) {
        const gracePeriod = 15 * 60 * 1000; // 15 min
        const scheduledStart = new Date(session.scheduledDate).getTime();
        const sessionEnd = scheduledStart + (session.duration * 60 * 1000);
        const now = Date.now();

        if (now < sessionEnd + gracePeriod) {
            return 'in_grace_period';
        }

        if (!session.actualStartTime) {
            return 'no_show';
        }

        return 'attended';
    }

    static calculateRefund(session, cancelledBy, timeDiff) {
        const timeMs = timeDiff; // milliseconds before session
        const hours = timeMs / (1000 * 60 * 60);

        let refundPercentage = 0;
        let reason = '';

        if (hours >= 12) {
            refundPercentage = 100;
            reason = 'Full refund (>12h before)';
        } else if (hours >= 1) {
            refundPercentage = 50;
            reason = '50% refund (<12h, >1h before)';
        } else if (hours > 0.25) {
            refundPercentage = 0;
            reason = 'No refund (<1h before)';
        } else {
            refundPercentage = 0;
            reason = 'No refund (<15min before)';
        }

        return {
            refundAmount: Math.round(session.price * (refundPercentage / 100)),
            refundPercentage,
            reason,
        };
    }

    static validateModerationAction(action, justification) {
        const validActions = ['dismiss', 'warn', 'refund', 'ban'];

        if (!validActions.includes(action)) {
            return { isValid: false, error: 'Invalid action' };
        }

        if (!justification || justification.trim().length < 10) {
            return { isValid: false, error: 'Justification required (min 10 chars)' };
        }

        return { isValid: true };
    }

    static createModerationRecord(sessionId, action, justification, adminId) {
        return {
            sessionId,
            action,
            justification,
            reviewedBy: adminId,
            timestamp: new Date().toISOString(),
            status: 'applied',
        };
    }
}

// ─── LEARNING PATH SERVICE ─────────────────────────────────────────────────────
export class LearningPathService {
    static validatePathForApproval(path) {
        const errors = [];

        if (!path.modules || path.modules.length < 5) {
            errors.push('Minimum 5 modules required');
        }

        path.modules?.forEach((mod, idx) => {
            if (!mod.title || mod.title.trim() === '') {
                errors.push(`Module ${idx + 1}: Missing title`);
            }
            if (!mod.videoUrl) {
                errors.push(`Module ${idx + 1}: Missing video`);
            }
            if (mod.durationMinutes < 10) {
                errors.push(`Module ${idx + 1}: Duration must be ≥10 min`);
            }
        });

        if (!path.description || path.description.trim().length < 50) {
            errors.push('Description must be at least 50 characters');
        }

        if (path.price <= 0) {
            errors.push('Price must be greater than 0');
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    static calculatePathMetrics(path, enrollments, sessions) {
        const completed = enrollments.filter(e => e.status === 'completed').length;
        const completionRate = enrollments.length > 0
            ? Math.round((completed / enrollments.length) * 100)
            : 0;

        const pathSessions = sessions.filter(s => s.type === 'path' && s.learningPath?.pathId === path.id);
        const avgRating = this.calculateAverageRating(pathSessions);

        return {
            enrollmentCount: enrollments.length,
            completionCount: completed,
            completionRate,
            averageRating: avgRating,
            totalRevenue: path.price * enrollments.length,
            dropoffModule: this.identifyDropoffModule(enrollments),
        };
    }

    static calculateAverageRating(sessions) {
        const ratedSessions = sessions.filter(s => s.studentRating);
        if (ratedSessions.length === 0) return null;

        const total = ratedSessions.reduce((sum, s) => sum + s.studentRating, 0);
        return (total / ratedSessions.length).toFixed(1);
    }

    static identifyDropoffModule(enrollments) {
        // Analyze progress data to find where learners typically drop off
        const moduleProgressMap = {};

        enrollments.forEach(e => {
            if (e.progress && e.completedModules) {
                e.completedModules.forEach((modId, idx) => {
                    moduleProgressMap[modId] = (moduleProgressMap[modId] || 0) + 1;
                });
            }
        });

        // Find first module with significant drop-off
        let prevCount = enrollments.length;
        for (const [modId, count] of Object.entries(moduleProgressMap)) {
            if (count < prevCount * 0.7) {
                return modId; // >30% drop-off
            }
            prevCount = count;
        }

        return null;
    }

    static createApprovalRecord(pathId, approved, reason, adminId) {
        return {
            pathId,
            status: approved ? 'approved' : 'rejected',
            reason,
            reviewedBy: adminId,
            timestamp: new Date().toISOString(),
            isAppealable: !approved && reason !== 'Copyright violation',
        };
    }
}

// ─── MISSION SERVICE ───────────────────────────────────────────────────────────
export class MissionService {
    static validateMission(missionData) {
        const errors = [];

        if (!missionData.title || missionData.title.trim().length === 0) {
            errors.push('Title required');
        }

        if (!missionData.rewardCredits || missionData.rewardCredits <= 0) {
            errors.push('Reward must be > 0');
        }

        if (missionData.rewardCredits > 500) {
            errors.push('Reward cannot exceed 500 credits');
        }

        if (missionData.startDate && missionData.endDate) {
            if (new Date(missionData.startDate) >= new Date(missionData.endDate)) {
                errors.push('End date must be after start date');
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    static calculateMissionStats(mission, completions) {
        const totalCompletions = completions.length;
        const uniqueUsers = new Set(completions.map(c => c.userId)).size;
        const completionRate = mission.targetUserCount > 0
            ? Math.round((uniqueUsers / mission.targetUserCount) * 100)
            : 0;

        return {
            totalCompletions,
            uniqueUsers,
            completionRate,
            totalRewardsDistributed: totalCompletions * mission.rewardCredits,
            averageCompletionTime: this.calculateAvgCompletionTime(completions),
            isActive: new Date() >= new Date(mission.startDate) &&
                (!mission.endDate || new Date() <= new Date(mission.endDate)),
        };
    }

    static calculateAvgCompletionTime(completions) {
        if (completions.length === 0) return 0;

        const times = completions.map(c => {
            const start = new Date(c.startedDate).getTime();
            const end = new Date(c.completedDate).getTime();
            return end - start;
        });

        const avgMs = times.reduce((a, b) => a + b, 0) / times.length;
        const hours = avgMs / (1000 * 60 * 60);

        return parseFloat(hours.toFixed(1));
    }

    static determineMissionStatus(mission, stats) {
        if (stats.completionRate >= 90) return 'highly_successful';
        if (stats.completionRate >= 70) return 'successful';
        if (stats.completionRate >= 50) return 'moderate';
        if (stats.completionRate >= 20) return 'low_engagement';
        return 'poor_engagement';
    }
}

// ─── ANALYTICS SERVICE ─────────────────────────────────────────────────────────
export class AnalyticsService {
    static generateOverviewStats(users, sessions, paths, missions) {
        return {
            totalUsers: users.length,
            activeUsers: users.filter(u => u.status === 'active').length,
            newUsers: users.filter(u => {
                const joined = new Date(u.joinedDate);
                const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                return joined > thirtyDaysAgo;
            }).length,
            bannedUsers: users.filter(u => u.status === 'banned').length,

            totalSessions: sessions.length,
            completedSessions: sessions.filter(s => s.status === 'completed').length,
            upcomingSessions: sessions.filter(s => s.status === 'upcoming').length,

            totalPaths: paths.length,
            approvedPaths: paths.filter(p => p.status === 'approved').length,
            pendingPaths: paths.filter(p => p.status === 'pending').length,

            activeMissions: missions.filter(m => m.isActive).length,
            totalMissionRewards: missions.reduce((sum, m) => sum + m.rewardCredits, 0),
        };
    }

    static generateUserCohortAnalysis(users, period = 30) {
        const cutoffDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

        const newUsers = users.filter(u => new Date(u.joinedDate) > cutoffDate);
        const returningUsers = users.filter(u =>
            new Date(u.joinedDate) <= cutoffDate &&
            new Date(u.lastLoginDate) > cutoffDate
        );
        const churnedUsers = users.filter(u =>
            new Date(u.joinedDate) <= cutoffDate &&
            new Date(u.lastLoginDate) <= cutoffDate
        );

        return {
            newUsers: newUsers.length,
            returningUsers: returningUsers.length,
            churnedUsers: churnedUsers.length,
            retentionRate: users.length > 0
                ? Math.round((returningUsers.length / users.length) * 100)
                : 0,
        };
    }

    static calculateVerificationMetrics(users) {
        const verified = users.filter(u => u.verificationStatus === 'verified').length;
        const pending = users.filter(u => u.verificationStatus === 'pending').length;
        const rejected = users.filter(u => u.verificationStatus === 'rejected').length;
        const none = users.filter(u => u.verificationStatus === 'none').length;

        return {
            verified,
            pending,
            rejected,
            none,
            total: users.length,
            verificationRate: users.length > 0
                ? Math.round((verified / users.length) * 100)
                : 0,
        };
    }



    static calculateRevenueByCategory(sessions) {
        const categoryRevenue = {};

        sessions.forEach(session => {
            const category = session.category || 'Uncategorized';
            categoryRevenue[category] = (categoryRevenue[category] || 0) + (session.price || 0);
        });

        return Object.entries(categoryRevenue)
            .map(([category, revenue]) => ({ category, revenue }))
            .sort((a, b) => b.revenue - a.revenue);
    }

    static calculateMentorPerformance(users, sessions) {
        const mentors = users.filter(u => u.role === 'teach' || u.role === 'both');

        return mentors.map(mentor => {
            const mentorSessions = sessions.filter(s => s.mentorId === mentor.id);
            const completedSessions = mentorSessions.filter(s => s.status === 'completed').length;
            const earnings = mentorSessions.reduce((sum, s) =>
                sum + (s.price * (1 - s.commissionFee || 0.2)), 0
            );

            return {
                id: mentor.id,
                name: mentor.name,
                totalSessions: mentorSessions.length,
                completedSessions,
                averageRating: mentor.averageRating,
                earnings,
            };
        }).sort((a, b) => b.earnings - a.earnings);
    }
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────
export const AdminServices = {
    UserManagementService,
    SessionManagementService,
    LearningPathService,
    MissionService,
    AnalyticsService,
};

export default AdminServices;
