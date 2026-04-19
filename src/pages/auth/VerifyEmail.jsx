import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BRAND } from '../../configuration/branding';
import { resendVerification, verifyEmail } from '../../services/authService';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function VerifyEmail() {
  const navigate = useNavigate();
  const query = useQuery();
  const [email, setEmail] = useState(query.get('email') || '');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const canSubmit = email.trim() && /^\d{6}$/.test(code.trim());

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!canSubmit) {
      setError('Vui lòng nhập email và mã gồm 6 chữ số.');
      return;
    }
    setLoading(true);
    try {
      const res = await verifyEmail(email.trim(), code.trim());
      if (res?.ok !== true) {
        throw new Error('Mã Xác Thực Không Đúng !!');
      }
      setMessage('Xác thực email thành công. Bạn có thể đăng nhập.');
      window.setTimeout(() => navigate('/login', { replace: true }), 800);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Mã Xác Thực Không Đúng !!';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setError('');
    setMessage('');
    const e = email.trim();
    if (!e) {
      setError('Vui lòng nhập email để gửi lại mã.');
      return;
    }
    setLoading(true);
    try {
      await resendVerification(e);
      setMessage('Đã gửi lại mã xác thực. Vui lòng kiểm tra email.');
    } catch (err) {
      setMessage('Nếu email tồn tại trong hệ thống, bạn sẽ nhận được mã xác thực.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 relative z-10">
        <div className="text-center mb-6">
          <Link to="/" className="inline-block w-16 h-16 mb-4 mx-auto transition-transform hover:scale-105">
            <img src={BRAND.logoUrl} alt={`${BRAND.name} Logo`} className="w-full h-full object-contain" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Xác thực email</h1>
          <p className="text-slate-500 mt-2 font-medium">
            Nhập mã 6 số đã gửi đến email của bạn.
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

        <form noValidate onSubmit={onSubmit} className="space-y-4">
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Mã xác thực (6 số)</label>
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
            {loading ? 'Đang xác thực…' : 'Xác thực'}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onResend}
            disabled={loading}
            className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline disabled:opacity-60"
          >
            Gửi lại mã
          </button>
          <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-800 hover:underline">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}

