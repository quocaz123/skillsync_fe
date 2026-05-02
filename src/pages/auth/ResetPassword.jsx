import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { resetPasswordWithOtp } from '../../services/authService';
import { Mail, KeyRound, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const [email, setEmail] = useState(location.state?.email || searchParams.get('email') || '');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const q = searchParams.get('email');
        if (q && !location.state?.email) setEmail(q);
    }, [searchParams, location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || otp.length !== 6) return;
        if (password.length < 8) {
            setError('Mật khẩu ít nhất 8 ký tự.');
            return;
        }
        if (password !== confirm) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await resetPasswordWithOtp(email.trim(), otp.trim(), password);
            navigate('/login', {
                replace: true,
                state: { message: 'Đã đặt mật khẩu mới. Bạn có thể đăng nhập bằng email và mật khẩu, hoặc tiếp tục dùng Google.' },
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    err.message ||
                    'Không đặt lại được. Kiểm tra mã OTP hoặc thử gửi lại từ bước trước.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                <Link
                    to="/forgot-password"
                    className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Quay lại
                </Link>

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Mật khẩu mới</h1>
                    <p className="text-slate-500 text-sm mt-2">Nhập mã OTP từ email và mật khẩu bạn muốn dùng khi đăng nhập bằng form.</p>
                </div>

                {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none bg-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Mã OTP</label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                placeholder="000000"
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl tracking-widest font-mono focus:ring-2 focus:ring-indigo-400 outline-none bg-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu mới</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type={showPw ? 'text' : 'password'}
                                required
                                minLength={8}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none bg-white"
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                onClick={() => setShowPw(!showPw)}
                            >
                                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Xác nhận mật khẩu</label>
                        <input
                            type={showPw ? 'text' : 'password'}
                            required
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none bg-white"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? 'Đang lưu…' : 'Lưu mật khẩu mới'}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                    <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;
