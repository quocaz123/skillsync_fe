import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../../services/authService';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

/**
 * Bước 1: nhập email — backend gửi OTP (dùng cho quên mật khẩu hoặc thiết lập mật khẩu lần đầu sau Google).
 */
const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setError('');
        setLoading(true);
        try {
            await requestPasswordReset(email.trim());
            setDone(true);
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.message ||
                'Không thực hiện được. Kiểm tra email hoặc thử lại sau.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const goReset = () => {
        navigate('/reset-password', { state: { email: email.trim() } });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                <Link
                    to="/login"
                    className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Đăng nhập
                </Link>

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Thiết lập / đặt lại mật khẩu</h1>
                    <p className="text-slate-500 text-sm mt-2">
                        Nhập email tài khoản. Chúng tôi gửi mã OTP 6 số (hết hạn sau 15 phút). Bạn có thể đặt mật
                        khẩu mới và vẫn đăng nhập Google như bình thường.
                    </p>
                </div>

                {done ? (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex gap-2">
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            <span>
                                Nếu email tồn tại trong hệ thống, bạn sẽ nhận mã OTP. Kiểm tra cả thư mục Spam.
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={goReset}
                            className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                        >
                            Tiếp tục — nhập mã & mật khẩu mới
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    placeholder="name@example.com"
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none bg-white"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? 'Đang gửi…' : 'Gửi mã OTP'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
