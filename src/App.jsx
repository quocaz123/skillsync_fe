import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import GoogleAuthCallback from './pages/auth/GoogleAuthCallback';
import LandingPage from './pages/auth/LandingPage';
import UserDashboard from './pages/user/UserDashboard';
import AdminDash from './pages/admin/AdminDash';
import AdminFinancialModeration from './pages/admin/AdminFinancialModeration';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSessions from './pages/admin/AdminSessions';
import AdminCredits from './pages/admin/AdminCredits';
import AdminPaths from './pages/admin/AdminPaths';
import AdminSystem from './pages/admin/AdminSystem';
import AdminTeachingSkills from './pages/admin/AdminTeachingSkills';
import AdminForumPosts from './pages/admin/AdminForumPosts';
import AdminMissions from './pages/admin/AdminMissions';
import Explore from './pages/user/Explore';
import Sessions from './pages/user/Sessions';
import JoinSessionGuidePage from './pages/user/JoinSessionGuide';
import Profile from './pages/user/Profile';
import CreditHistory from './pages/user/CreditHistory';
import LearningPath from './pages/user/LearningPath';
import LearningPathDetail from './pages/user/LearningPathDetail';
import LearningPathStudy from './pages/user/LearningPathStudy';
import LearningPathLessonPlayer from './pages/user/LearningPathLessonPlayer';
import TeachingManagement from './pages/user/TeachingManagement';
import CreateTeachingSession from './pages/user/CreateTeachingSession';
import MentorLearningPathManagementPage from './pages/user/MentorLearningPathManagementPage';
import AdminAiConfig from './pages/admin/AdminAiConfig';
import Community from './pages/user/Community';
import PublicProfile from './pages/user/PublicProfile';
import VideoCallPage from './pages/user/VideoCallPage';
import Missions from './pages/user/Missions';
import { useStore } from './store';
import { Toaster } from "react-hot-toast";

// Mock Pages for now
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-4xl font-bold text-primary-600">404</h1>
    <p className="mt-2">Page Not Found</p>
  </div>
);

// Route Guards
const ProtectedUserRoute = ({ children }) => {
  const { isAuthenticated, role } = useStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === "admin") return <Navigate to="/admin" replace />;
  return children;
};

const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, role } = useStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { fontWeight: 600 },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />

        <Route path="/mentor" element={<ProtectedUserRoute><MainLayout /></ProtectedUserRoute>}>
          <Route index element={<Navigate to="/mentor/learning-paths" replace />} />
          <Route path="learning-paths" element={<MentorLearningPathManagementPage />} />
        </Route>

        {/* User Routes (Protected) */}
        <Route
          path="/app"
          element={
            <ProtectedUserRoute>
              <MainLayout />
            </ProtectedUserRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="explore" element={<Explore />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="guide" element={<JoinSessionGuidePage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="credits" element={<CreditHistory />} />
          <Route path="learning-path/study/:pathId/lesson/:lessonId" element={<LearningPathLessonPlayer />} />
          <Route path="learning-path/study/:pathId" element={<LearningPathStudy />} />
          <Route path="learning-path/:pathId" element={<LearningPathDetail />} />
          <Route path="learning-path" element={<LearningPath />} />
          <Route path="teaching" element={<TeachingManagement />} />
          <Route path="teaching/create" element={<CreateTeachingSession />} />
          <Route path="call/:sessionId" element={<VideoCallPage />} />
          <Route path="community" element={<Community />} />
          <Route path="profile/:userId" element={<PublicProfile />} />
          <Route path="missions" element={<Missions />} />

        </Route>

        {/* Admin Routes (Protected) */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDash />} />
          <Route path="financial-moderation" element={<AdminFinancialModeration />} />
          <Route path="forum-posts" element={<AdminForumPosts />} />
          <Route path="sessions" element={<AdminSessions />} />
          <Route path="credits" element={<AdminCredits />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="teaching-skills" element={<AdminTeachingSkills />} />
          <Route path="paths" element={<AdminPaths />} />
          <Route path="missions" element={<AdminMissions />} />
          <Route path="system" element={<AdminSystem />} />
          <Route path="ai-config" element={<AdminAiConfig />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
