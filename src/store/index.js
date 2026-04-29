import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * SkillSync Global Store (Zustand)
 *
 * Chỉ giữ:
 *   - Auth state (user, isAuthenticated, role)
 *   - Credit balance (đồng bộ từ BE sau mỗi transaction)
 *   - enrolledPathIds (local cache để tránh gọi API nhiều lần)
 *   - completedLessons / pathReviews (learning progress)
 *   - creditHistory (local log — KHÔNG dùng cho display chính, dùng /api/users/me/transactions)
 *
 * ĐÃ XÓA (technical debt):
 *   - tasks / completeTask / addTask / removeTask — duplicate với missionService
 *   - sessions / bookSession / completeSession — duplicate với sessionService
 *   - reviews / addReview — duplicate với reviewService
 */
export const useStore = create(
    persist(
        (set) => ({
            // ── Auth ────────────────────────────────────────────────
            user: null,
            isAuthenticated: false,
            role: 'user',
            showMissionPopup: false,

            dismissMissionPopup: () => set({ showMissionPopup: false }),

            login: (userData) => set((state) => ({
                user: userData,
                isAuthenticated: true,
                role: userData.role || 'user',
                credits: (userData.creditsBalance !== undefined && userData.creditsBalance !== null)
                    ? userData.creditsBalance
                    : state.credits,
                pendingLearnerCredits: userData.pendingLearnerCredits || 0,
                pendingTeacherCredits: userData.pendingTeacherCredits || 0,
                showMissionPopup: true,
            })),

            logout: () => set({
                user: null,
                isAuthenticated: false,
                role: 'user',
                credits: 0,
                creditHistory: [],
                enrolledPathIds: [],
                pendingLearnerCredits: 0,
                pendingTeacherCredits: 0,
            }),

            /** Dùng bởi Profile.jsx và các nơi cần update user partial */
            setUser: (updater) => set((state) => ({
                user: typeof updater === 'function' ? updater(state.user) : { ...state.user, ...updater }
            })),

            // ── Credits ─────────────────────────────────────────────
            credits: 0,
            pendingLearnerCredits: 0,
            pendingTeacherCredits: 0,
            creditHistory: [],

            /**
             * Đồng bộ credit balance từ BE (gọi sau mỗi transaction quan trọng).
             * pendingLearner/pendingTeacher optional — nếu không biết thì giữ nguyên.
             */
            syncCredits: (balance, pendingLearner, pendingTeacher) => set((state) => ({
                credits: balance,
                user: state.user
                    ? { ...state.user, creditsBalance: balance }
                    : state.user,
                pendingLearnerCredits: pendingLearner ?? state.pendingLearnerCredits,
                pendingTeacherCredits: pendingTeacher ?? state.pendingTeacherCredits,
            })),

            /** Local credit increment — dùng khi nhận mission reward (optimistic update) */
            addCredits: (amount) => set((state) => {
                const currentCredits = Number(state.user?.creditsBalance ?? state.credits ?? 0);
                const nextCredits = currentCredits + amount;
                return {
                    credits: nextCredits,
                    user: state.user
                        ? { ...state.user, creditsBalance: nextCredits }
                        : state.user,
                };
            }),

            /** Local credit decrement — dùng cho optimistic update khi cần */
            deductCredits: (amount) => set((state) => {
                const currentCredits = Number(state.user?.creditsBalance ?? state.credits ?? 0);
                const nextCredits = Math.max(0, currentCredits - amount);
                return {
                    credits: nextCredits,
                    user: state.user
                        ? { ...state.user, creditsBalance: nextCredits }
                        : state.user,
                };
            }),

            /** Ghi local transaction log — không thay thế /api/users/me/transactions */
            addCreditTransaction: (tx) => set((state) => ({
                creditHistory: [
                    { ...tx, id: `h_${Date.now()}`, date: new Date().toISOString() },
                    ...state.creditHistory,
                ].slice(0, 50) // Giới hạn 50 entries để tránh localStorage bloat
            })),

            // ── Learning ────────────────────────────────────────────
            enrolledPathIds: [],
            addEnrolledPath: (pathId) => set((state) =>
                state.enrolledPathIds.includes(pathId)
                    ? state
                    : { enrolledPathIds: [...state.enrolledPathIds, pathId] }
            ),


            completedLessons: {}, // { pathId: ["lessonId1", "lessonId2"] }
            markLessonCompleted: (pathId, lessonId) => set((state) => {
                const pathLessons = state.completedLessons[pathId] || [];
                if (pathLessons.includes(lessonId)) return state;
                return {
                    completedLessons: {
                        ...state.completedLessons,
                        [pathId]: [...pathLessons, lessonId],
                    },
                };
            }),

            pathReviews: {}, // { pathId: { rating, comment, tags, createdAt } }
            addPathReview: (pathId, reviewData) => set((state) => ({
                pathReviews: {
                    ...state.pathReviews,
                    [String(pathId)]: {
                        ...reviewData,
                        pathId: String(pathId),
                        createdAt: new Date().toISOString(),
                    },
                },
            })),
        }),
        {
            name: 'skillsync-auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                role: state.role,
                credits: state.credits,
                pendingLearnerCredits: state.pendingLearnerCredits,
                pendingTeacherCredits: state.pendingTeacherCredits,
                creditHistory: state.creditHistory,
                enrolledPathIds: state.enrolledPathIds,
                completedLessons: state.completedLessons,
                pathReviews: state.pathReviews,
            }),
        }
    )
);
