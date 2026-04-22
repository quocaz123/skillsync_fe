import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
    persist(
        (set) => ({
            // AUTH STATE
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
            syncCredits: (balance, pendingLearner = 0, pendingTeacher = 0) => set({
                credits: balance,
                pendingLearnerCredits: pendingLearner,
                pendingTeacherCredits: pendingTeacher
            }),
            addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
            deductCredits: (amount) => set((state) => ({ credits: state.credits - amount })),

            enrolledPathIds: [],
            addEnrolledPath: (pathId) =>
                set((state) =>
                    state.enrolledPathIds.includes(pathId)
                        ? state
                        : { enrolledPathIds: [...state.enrolledPathIds, pathId] }
                ),

            logout: () => set({
                user: null,
                isAuthenticated: false,
                role: 'user',
                credits: 0,
                creditHistory: [],
                enrolledPathIds: []
            }),

            // CREDIT & PROFILE STATE
            credits: 0,
            pendingLearnerCredits: 0,
            pendingTeacherCredits: 0,
            creditHistory: [],
            addCreditTransaction: (tx) => set((state) => ({
                creditHistory: [{ ...tx, id: `h_${Date.now()}`, date: new Date().toISOString() }, ...state.creditHistory]
            })),

            // TASKS STATE
            tasks: [],
            completeTask: (taskId) => set((state) => {
                const taskIndex = state.tasks.findIndex(t => t.id === taskId);
                if (taskIndex === -1 || state.tasks[taskIndex].completed) return state;

                const newTasks = [...state.tasks];
                const reward = newTasks[taskIndex].reward;
                newTasks[taskIndex] = { ...newTasks[taskIndex], completed: true };

                const newTx = {
                    id: `h_${Date.now()}`,
                    type: 'welcome',
                    amount: +reward,
                    description: `Hoàn thành nhiệm vụ: ${newTasks[taskIndex].title}`,
                    date: new Date().toISOString()
                };

                return {
                    tasks: newTasks,
                    credits: state.credits + reward,
                    creditHistory: [newTx, ...state.creditHistory]
                };
            }),

            addTask: (task) => set((state) => ({
                tasks: [...state.tasks, { ...task, id: Date.now(), completed: false }]
            })),
            removeTask: (taskId) => set((state) => ({
                tasks: state.tasks.filter(t => t.id !== taskId)
            })),

            // SKILLS LOGIC
            mySkills: [],
            addSkill: (skill) => set((state) => ({
                mySkills: [...state.mySkills, { ...skill, id: Date.now() }]
            })),
            removeSkill: (skillId) => set((state) => ({
                mySkills: state.mySkills.filter(s => s.id !== skillId)
            })),

            // SESSIONS & MATCHING
            sessions: [],
            bookSession: (sessionDetails) => set((state) => {
                if (state.credits < sessionDetails.cost) return state;
                const newTx = {
                    id: `h_${Date.now()}`,
                    type: 'session_booked',
                    amount: -sessionDetails.cost,
                    description: `Đặt lịch học ${sessionDetails.topic} với ${sessionDetails.mentor}`,
                    date: new Date().toISOString()
                };
                return {
                    sessions: [...state.sessions, { ...sessionDetails, id: Date.now(), status: 'upcoming' }],
                    credits: state.credits - sessionDetails.cost,
                    creditHistory: [newTx, ...state.creditHistory]
                };
            }),

            completeSession: (sessionId, reviewData) => set((state) => {
                const session = state.sessions.find(s => s.id === sessionId);
                if (!session) return state;

                const mentorEarned = Math.round(session.cost * 0.8);
                const newTxEarned = {
                    id: `h_${Date.now() + 1}`,
                    type: 'session_completed',
                    amount: +mentorEarned,
                    description: `Hoàn thành buổi học ${session.topic} - Nhận credit từ người học`,
                    date: new Date().toISOString()
                };

                return {
                    sessions: state.sessions.map(s =>
                        s.id === sessionId
                            ? { ...s, status: 'completed', rating: reviewData.rating, review: reviewData.review, completedAt: new Date().toISOString() }
                            : s
                    ),
                    credits: state.credits + mentorEarned,
                    creditHistory: [newTxEarned, ...state.creditHistory],
                    reviews: [...state.reviews, {
                        id: `r_${Date.now()}`,
                        sessionId,
                        mentorName: session.mentor,
                        topic: session.topic,
                        rating: reviewData.rating,
                        review: reviewData.review,
                        date: new Date().toISOString()
                    }]
                };
            }),

            // REVIEWS
            reviews: [],
            addReview: (review) => set((state) => ({
                reviews: [...state.reviews, { ...review, id: `r_${Date.now()}`, date: new Date().toISOString() }]
            })),

            // LEARNING PROGRESS
            learningProgress: [],
            completedLessons: {}, // { pathId: ["lessonId1", "lessonId2"] }
            markLessonCompleted: (pathId, lessonId) => set((state) => {
                const pathLessons = state.completedLessons[pathId] || [];
                if (pathLessons.includes(lessonId)) return state;
                return {
                    completedLessons: {
                        ...state.completedLessons,
                        [pathId]: [...pathLessons, lessonId]
                    }
                };
            }),

            // PATH REVIEWS
            pathReviews: {}, // { pathId: { rating, comment, tags, createdAt } }
            addPathReview: (pathId, reviewData) => set((state) => ({
                pathReviews: {
                    ...state.pathReviews,
                    [String(pathId)]: {
                        ...reviewData,
                        pathId: String(pathId),
                        createdAt: new Date().toISOString(),
                    }
                }
            })),
            updateProgress: (skillId, increment) => set((state) => ({
                learningProgress: state.learningProgress.map(lp =>
                    lp.id === skillId
                        ? { ...lp, completedSessions: Math.min(lp.completedSessions + increment, lp.totalSessions) }
                        : lp
                )
            })),
        }),
        {
            name: 'skillsync-auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                role: state.role,
                credits: state.credits,
                creditHistory: state.creditHistory,
                enrolledPathIds: state.enrolledPathIds,
                completedLessons: state.completedLessons,
                pathReviews: state.pathReviews,
            }),
        }
    )
);
