import { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, X } from 'lucide-react';
import axiosClient from '../../configuration/axiosClient';
import { API_ENDPOINTS } from '../../configuration/apiEndpoints';

/**
 * SetPasswordModal
 * Shown once for Google-only users (hasPassword === false) to let them set a
 * manual login password. Calls PATCH /api/users/me/password.
 *
 * Props:
 *   onSuccess(updatedUser) - called when password is set; parent should update store
 *   onSkip()               - called when user dismisses the modal
 */
const SetPasswordModal = ({ onSuccess, onSkip }) => {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [showCf, setShowCf] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);

    const isStrong = password.length >= 8;
    const isMatch = password && confirm && password === confirm;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isStrong) { setError('Mật khẩu phải có ít nhất 8 ký tự.'); return; }
        if (!isMatch)  { setError('Mật khẩu xác nhận không khớp.'); return; }

        setError('');
        setLoading(true);
        try {
            const updatedUser = await axiosClient.patch(API_ENDPOINTS.USERS.SET_PASSWORD, { newPassword: password });
            setDone(true);
            setTimeout(() => onSuccess(updatedUser), 1000);
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || 'Không thể đặt mật khẩu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 animate-in zoom-in-95 duration-200">

                {/* Skip button */}
                <button
                    onClick={onSkip}
                    className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Bỏ qua"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="mb-6 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                        <Lock size={28} className="text-indigo-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Thiết lập mật khẩu</h2>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                        Tài khoản của bạn đang dùng <strong>Google</strong> để đăng nhập. Bạn có muốn đặt thêm mật khẩu để đăng nhập bằng email trong tương lai không?
                    </p>
                </div>

                {done ? (
                    <div className="flex flex-col items-center gap-3 py-4 text-emerald-600">
                        <CheckCircle2 size={40} />
                        <p className="font-semibold">Đặt mật khẩu thành công!</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
                                {error}
                            </div>
                        )}

                        {/* New password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu mới</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Tối thiểu 8 ký tự"
                                    className="w-full pl-10 pr-11 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none placeholder:text-slate-400 bg-white text-sm"
                                />
                                <button type="button" onClick={() => setShowPw(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {password && !isStrong && (
                                <p className="text-xs text-red-500 mt-1">Mật khẩu phải có ít nhất 8 ký tự</p>
                            )}
                        </div>

                        {/* Confirm password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Xác nhận mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type={showCf ? 'text' : 'password'}
                                    required
                                    value={confirm}
                                    onChange={e => setConfirm(e.target.value)}
                                    placeholder="Nhập lại mật khẩu"
                                    className={`w-full pl-10 pr-11 py-2.5 border rounded-xl focus:ring-2 outline-none placeholder:text-slate-400 bg-white text-sm ${
                                        confirm ? (isMatch ? 'border-emerald-400 focus:ring-emerald-300' : 'border-red-300 focus:ring-red-200') : 'border-slate-200 focus:ring-indigo-400 focus:border-indigo-400'
                                    }`}
                                />
                                <button type="button" onClick={() => setShowCf(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showCf ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {confirm && isMatch && (
                                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><CheckCircle2 size={11} /> Mật khẩu khớp</p>
                            )}
                            {confirm && !isMatch && (
                                <p className="text-xs text-red-500 mt-1">Mật khẩu không khớp</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !isStrong || !isMatch}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-indigo-500/20"
                        >
                            {loading ? 'Đang lưu…' : 'Đặt mật khẩu'}
                        </button>

                        <button
                            type="button"
                            onClick={onSkip}
                            className="w-full text-sm text-slate-500 hover:text-slate-700 py-1.5 transition-colors"
                        >
                            Để sau
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SetPasswordModal;
