import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../../configuration/branding';
import { requestPasswordResetOtp, resetPasswordWithOtp, verifyPasswordResetOtp } from '../../services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: request OTP, 2: verify OTP, 3: reset password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const isValidEmail = useMemo(() => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  const onRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!isValidEmail) {
      setError('Vui lòng nhập email hợp lệ.');
      return;
    }
    setLoading(true);
    try {
      const res = await requestPasswordResetOtp(email);
      if (res?.ok === true) {
        setMessage('Đã gửi mã OTP. Vui lòng kiểm tra email.');
        setStep(2);
      } else {
        setError('Không gửi được mã OTP. Vui lòng bấm “Gửi lại mã OTP” để thử lại.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Không gửi được mã OTP. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!isValidEmail) {
      setError('Vui lòng nhập email hợp lệ.');
      return;
    }
    if (!/^\d{6}$/.test(code.trim())) {
      setError('Vui lòng nhập mã OTP gồm 6 chữ số.');
      return;
    }
    setLoading(true);
    try {
      const res = await verifyPasswordResetOtp(email, code.trim());
      if (res?.ok !== true) {
        throw new Error('Mã Xác Thực Không Đúng !!');
      }
      setMessage('Xác thực OTP thành công. Vui lòng nhập mật khẩu mới.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Mã Xác Thực Không Đúng !!');
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!isValidEmail) {
      setError('Vui lòng nhập email hợp lệ.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordWithOtp(email, code.trim(), newPassword);
      if (res?.ok !== true) {
        throw new Error('OTP không hợp lệ hoặc đã hết hạn.');
      }
      setMessage('Đổi mật khẩu thành công. Bạn có thể đăng nhập.');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Đổi mật khẩu thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000" />

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-8 relative z-10">
        <div className="text-center mb-6">
          <Link to="/" className="inline-block w-16 h-16 mb-4 mx-auto transition-transform hover:scale-105">
            <img src={BRAND.logoUrl} alt={`${BRAND.name} Logo`} className="w-full h-full object-contain" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Quên mật khẩu?</h1>
          <p className="text-slate-500 mt-2 font-medium">
            Nhập email để nhận mã OTP 6 số và đặt lại mật khẩu.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
            {message}
          </div>
        )}

        {step === 1 ? (
          <form noValidate onSubmit={onRequestOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 bg-white"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-primary-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-md shadow-primary-500/20 active:scale-[0.98]"
            >
              {loading ? 'Đang gửi mã…' : 'Gửi mã OTP'}
            </button>
          </form>
        ) : step === 2 ? (
          <form noValidate onSubmit={onVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mã OTP (6 số)</label>
              <input
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 bg-white tracking-[0.3em] text-center font-extrabold"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-primary-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-md shadow-primary-500/20 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? 'Đang xác thực…' : 'Xác thực OTP'}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setStep(1);
                setCode('');
                setNewPassword('');
                setConfirmPassword('');
                setError('');
                setMessage('');
              }}
              className="w-full text-sm font-semibold text-slate-600 hover:text-slate-800 hover:underline disabled:opacity-60"
            >
              Gửi lại mã OTP
            </button>
          </form>
        ) : (
          <form noValidate onSubmit={onResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mã OTP (6 số)</label>
              <input
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 bg-white tracking-[0.3em] text-center font-extrabold"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu mới</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 8 ký tự"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 bg-white"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-primary-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-md shadow-primary-500/20 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? 'Đang đổi mật khẩu…' : 'Đổi mật khẩu'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}

