import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useStore } from '../../store';
import { login as apiLogin } from '../../services/authService';
import { getMyProfile } from '../../services/userService';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const setSession = useStore((state) => state.login);
    const syncCredits = useStore((state) => state.syncCredits);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    useEffect(() => {
        if (location.state?.message) {
            setInfo(location.state.message);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) return;
        setError('');
        setLoading(true);
        try {
            const user = await apiLogin(email, password);
            setSession(user);
            // Fetch lại creditsBalance mới nhất từ DB để đảm bảo đồng bộ
            try {
                const freshUser = await getMyProfile();
                if (freshUser?.creditsBalance != null) syncCredits(freshUser.creditsBalance);
            } catch { /* không block login nếu fetch me thất bại */ }
            if (user.role === 'admin') navigate('/admin');
            else navigate('/app');
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.message ||
                'Đăng nhập thất bại. Kiểm tra backend đã chạy và URL API (.env).';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuthenticated = async (user) => {
        setSession(user);
        // Sync credits sau Google login
        try {
            const freshUser = await getMyProfile();
            if (freshUser?.creditsBalance != null) syncCredits(freshUser.creditsBalance);
        } catch { /* ignore */ }
        if (user.role === 'admin') navigate('/admin');
        else navigate('/app');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 relative z-10">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block w-16 h-16 mb-4 mx-auto transition-transform hover:scale-105">
                        <img src="/logo.png" alt="SkillSync Logo" className="w-full h-full object-contain" />
                    </Link>
                    <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
                    <p className="text-slate-500 mt-2 font-medium">Log in to your SkillSync account</p>
                </div>

                {info && (
                    <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
                        {info}
                    </div>
                )}
                {error && (
                    <div
                        className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="email"
                                required
                                value={email}
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 bg-white"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-slate-700">Password</label>
                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-primary-600 hover:text-primary-700"
                            >
                                Quên mật khẩu? / Thiết lập mật khẩu
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="password"
                                required
                                value={password}
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 bg-white"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center bg-primary-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-md shadow-primary-500/20 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
                    >
                        {loading ? 'Đang đăng nhập…' : 'Sign In'}
                    </button>
                </form>

                <div className="relative flex items-center py-6">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">or continue with</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <GoogleSignInButton
                    mode="signin"
                    disabled={loading}
                    onAuthenticated={handleGoogleAuthenticated}
                    onError={(msg) => setError(msg)}
                />

                <div className="mt-8 text-center text-sm text-slate-600 font-medium">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold hover:underline">
                        Sign up
                    </Link>
                </div>

                <p className="text-xs text-center text-slate-400 mt-4">
                    Tài khoản admin do backend gán role ADMIN — không còn mock theo email.
                </p>
            </div>
        </div>
    );
};

export default Login;
