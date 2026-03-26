import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock Tasks System for Welcome Credit
const MOCK_TASKS = [
    { id: 1, title: 'Complete your profile details', reward: 50, completed: false },
    { id: 2, title: 'Add your first teaching skill', reward: 100, completed: false },
    { id: 3, title: 'Verify your email address', reward: 20, completed: true },
];

// Mock initial credit history
const INITIAL_CREDIT_HISTORY = [
    { id: 'h1', type: 'welcome', amount: +20, description: 'Welcome credit - Xác thực email', date: '2026-03-01T08:00:00' },
    { id: 'h2', type: 'session_booked', amount: -40, description: 'Đặt lịch học UI/UX Basics với Maria Garcia', date: '2026-03-09T10:00:00' },
];

// Mock learning progress
const INITIAL_LEARNING_PROGRESS = [
    { id: 'lp1', skill: 'UI/UX Design', mentor: 'Maria Garcia', level: 'Beginner', goal: 'Intermediate', totalSessions: 8, completedSessions: 3, lastSession: '2026-03-08T10:00:00' },
    { id: 'lp2', skill: 'Public Speaking', mentor: null, level: 'Beginner', goal: 'Advanced', totalSessions: 5, completedSessions: 0, lastSession: null },
];

export const useStore = create(
    persist(
        (set) => ({
            // AUTH STATE
    user: null,
    isAuthenticated: false,
    role: 'user',
    showMissionPopup: false,
    dismissMissionPopup: () => set({ showMissionPopup: false }),
    login: (userData) => set({ 
        user: userData, 
        isAuthenticated: true, 
        role: userData.role || 'user',
        credits: userData.creditsBalance !== undefined && userData.creditsBalance !== null ? userData.creditsBalance : 0,
        showMissionPopup: true,
    }),
    logout: () => set({ user: null, isAuthenticated: false, role: 'user', credits: 0, creditHistory: [] }),

    // CREDIT & PROFILE STATE
    credits: 180, // 200 welcome - 20 spent = 180 after initial tx
    addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
    deductCredits: (amount) => set((state) => ({ credits: state.credits - amount })),

    // CREDIT HISTORY
    creditHistory: INITIAL_CREDIT_HISTORY,
    addCreditTransaction: (tx) => set((state) => ({
        creditHistory: [{ ...tx, id: `h_${Date.now()}`, date: new Date().toISOString() }, ...state.creditHistory]
    })),

    // TASKS STATE (For Welcome Credit System)
    tasks: MOCK_TASKS,
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

    // ADMIN TASK MANAGEMENT
    addTask: (task) => set((state) => ({
        tasks: [...state.tasks, { ...task, id: Date.now(), completed: false }]
    })),
    removeTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== taskId)
    })),

    // SKILLS LOGIC
    mySkills: [
        { id: 1, name: 'ReactJS', type: 'teach', level: 'Advanced' },
        { id: 2, name: 'UI/UX Design', type: 'learn', level: 'Beginner' },
    ],
    addSkill: (skill) => set((state) => ({
        mySkills: [...state.mySkills, { ...skill, id: Date.now() }]
    })),
    removeSkill: (skillId) => set((state) => ({
        mySkills: state.mySkills.filter(s => s.id !== skillId)
    })),

    // SESSIONS & MATCHING
    sessions: [
        { id: 101, topic: 'UI/UX Basics', mentor: 'Maria Garcia', date: '2026-03-10T10:00:00', status: 'upcoming', cost: 40 },
        { id: 102, topic: 'ReactJS Hooks', mentor: 'Alex Johnson', date: '2026-02-20T14:00:00', status: 'completed', cost: 50, rating: 5, review: 'Rất tuyệt vời! Mentor giải thích rõ ràng.' },
    ],
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

        const mentorEarned = Math.round(session.cost * 0.8); // mentor gets 80% back as credits
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
    reviews: [
        { id: 'r1', sessionId: 102, mentorName: 'Alex Johnson', topic: 'ReactJS Hooks', rating: 5, review: 'Rất tuyệt vời! Mentor giải thích rõ ràng.', date: '2026-02-20T16:00:00' }
    ],
    addReview: (review) => set((state) => ({
        reviews: [...state.reviews, { ...review, id: `r_${Date.now()}`, date: new Date().toISOString() }]
    })),

    // LEARNING PROGRESS
    learningProgress: INITIAL_LEARNING_PROGRESS,
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
                creditHistory: state.creditHistory
            }),
        }
    )
);
