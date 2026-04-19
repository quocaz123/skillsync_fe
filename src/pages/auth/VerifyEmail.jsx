import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { verifyEmail, resendVerificationOtp } from '../../services/authService';
import { Mail, KeyRound, CheckCircle2 } from 'lucide-react';

/** Đồng bộ với AuthConstants.OTP_VALID_MINUTES (backend skill_be) */
const OTP_VALID_MINUTES = 15;

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState(location.state?.email || '');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    useEffect(() => {
        if (!location.state?.email && !email) {
            setInfo('Nhập email đã đăng ký để nhận mã xác minh.');
        }
    }, [location.state, email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email?.trim() || otp.length !== 6) return;
        setError('');
        setLoading(true);
        try {
            await verifyEmail(email.trim(), otp.trim());
            navigate('/login', {
                replace: true,
                state: {
                    message: 'Email đã được xác minh. Vui lòng đăng nhập bằng email và mật khẩu của bạn.',
                    email: email.trim(),
                },
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    err.message ||
                    'Mã không đúng hoặc đã hết hạn. Thử gửi lại mã.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email?.trim()) {
            setError('Nhập email trước khi gửi lại mã.');
            return;
        }
        setError('');
        setResending(true);
        try {
            await resendVerificationOtp(email.trim());
            setInfo('Đã gửi lại mã. Kiểm tra hộp thư (và thư mục Spam).');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Không gửi được mã.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                <div className="text-center mb-6">
                    <Link to="/" className="inline-block w-14 h-14 mb-3">
                        <img src="/logo.png" alt="SkillSync" className="w-full h-full object-contain" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Xác minh email</h1>
                    <p className="text-slate-500 text-sm mt-2">
                        Nhập mã 6 số đã gửi tới email của bạn để kích hoạt tài khoản.
                    </p>
                    <p className="text-slate-400 text-xs mt-1.5">
                        Mã có hiệu lực trong {OTP_VALID_MINUTES} phút kể từ khi gửi email.
                    </p>
                </div>

                {info && (
                    <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-start gap-2">
                        <CheckCircle2 className="shrink-0 w-4 h-4 mt-0.5" />
                        {info}
                    </div>
                )}
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
                                placeholder="name@example.com"
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none bg-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Mã OTP (6 số)</label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                placeholder="000000"
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl tracking-[0.4em] font-mono text-lg focus:ring-2 focus:ring-indigo-400 outline-none bg-white"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? 'Đang xác minh…' : 'Xác minh email'}
                    </button>
                </form>

                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="w-full mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                >
                    {resending ? 'Đang gửi…' : 'Gửi lại mã OTP'}
                </button>

                <p className="text-center text-sm text-slate-500 mt-6">
                    <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                        Quay lại đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default VerifyEmail;
