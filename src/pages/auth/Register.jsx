import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../store';
import { register as apiRegister } from '../../services/authService';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import logo from '../../assets/logo.png';

const Register = () => {
    const navigate = useNavigate();
    const setSession = useStore((state) => state.login);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const passwordsMatch = password && confirmPassword && password === confirmPassword;
    const passwordStrong = password.length >= 8;

    const handleEmailRegister = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email || !password) return;

        if (!passwordStrong) {
            setError('Mật khẩu phải có ít nhất 8 ký tự.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        setError('');
        setLoading(true);
        try {
            await apiRegister(email, password, name.trim());
            navigate('/verify-email', { state: { email: email.trim() }, replace: true });
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.message ||
                'Đăng ký thất bại. Kiểm tra backend và database.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuthenticated = (user) => {
        setSession(user);
        navigate('/app');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-10%] left-[60%] w-[40%] h-[40%] bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-[30%] right-[60%] w-[40%] h-[40%] bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 relative z-10 my-8">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block w-16 h-16 mb-4 mx-auto transition-transform hover:scale-105">
                        <img src={logo} alt="SkillSync Logo" className="w-full h-full object-contain" />
                    </Link>
                    <h2 className="text-3xl font-bold text-slate-900">Tạo tài khoản</h2>
                    <p className="text-slate-500 mt-2 font-medium">Tham gia cộng đồng học tập toàn cầu</p>
                </div>

                {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleEmailRegister} className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nguyễn Văn A"
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all placeholder:text-slate-400 bg-white"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="email"
                                required
                                value={email}
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all placeholder:text-slate-400 bg-white"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                autoComplete="new-password"
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Tối thiểu 8 ký tự"
                                className="w-full pl-10 pr-11 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all placeholder:text-slate-400 bg-white"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {password && !passwordStrong && (
                            <p className="mt-1 text-xs text-red-500">Mật khẩu phải có ít nhất 8 ký tự</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Xác nhận mật khẩu</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                required
                                value={confirmPassword}
                                autoComplete="new-password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu"
                                className={`w-full pl-10 pr-11 py-3 border rounded-xl focus:ring-2 outline-none transition-all placeholder:text-slate-400 bg-white ${
                                    confirmPassword
                                        ? passwordsMatch
                                            ? 'border-emerald-400 focus:ring-emerald-300'
                                            : 'border-red-300 focus:ring-red-200'
                                        : 'border-slate-200 focus:ring-indigo-400 focus:border-indigo-400'
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {confirmPassword && !passwordsMatch && (
                            <p className="mt-1 text-xs text-red-500">Mật khẩu không khớp</p>
                        )}
                        {passwordsMatch && (
                            <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 size={12} /> Mật khẩu khớp
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center bg-indigo-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-md shadow-indigo-500/20 active:scale-[0.98] mt-2 disabled:opacity-60 disabled:pointer-events-none"
                    >
                        {loading ? 'Đang tạo tài khoản…' : 'Đăng ký'}
                    </button>
                    <p className="text-xs text-slate-500 text-center mt-3 leading-relaxed">
                        Bằng cách tạo tài khoản, bạn đồng ý với{' '}
                        <a href="#" className="underline">Điều khoản dịch vụ</a>{' '}và{' '}
                        <a href="#" className="underline">Chính sách bảo mật</a>.
                    </p>
                </form>

                <div className="relative flex items-center py-6">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">hoặc đăng ký bằng</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <GoogleSignInButton
                    mode="signup"
                    disabled={loading}
                    onAuthenticated={handleGoogleAuthenticated}
                    onError={(msg) => setError(msg)}
                />

                <div className="mt-8 text-center text-sm text-slate-600 font-medium">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline">
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
