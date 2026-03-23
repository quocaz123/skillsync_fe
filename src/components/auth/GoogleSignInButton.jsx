import { startGoogleLoginRedirect } from '../../services/authService';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleSignInButton({
    mode = 'signin',
    disabled = false,
    onError,
}) {
    const busy = disabled;

    if (!googleClientId) {
        return (
            <p className="text-xs text-center text-amber-800 bg-amber-50 rounded-xl border border-amber-200 px-3 py-2.5 leading-relaxed">
                Đăng nhập Google: thêm <span className="font-mono">VITE_GOOGLE_CLIENT_ID</span> vào{' '}
                <span className="font-mono">.env</span> (OAuth 2.0 Client ID loại Web, cùng giá trị với{' '}
                <span className="font-mono">google.client-id</span> ở backend). Trong Google Cloud Console,
                thêm <span className="font-mono">http://localhost:5173</span> vào Authorized JavaScript origins.
            </p>
        );
    }

    return (
        <button
            type="button"
            disabled={busy}
            onClick={() => {
                try {
                    startGoogleLoginRedirect();
                } catch (err) {
                    onError?.(err.message || 'Không thể bắt đầu đăng nhập Google.');
                }
            }}
            className="w-full flex items-center justify-center gap-3 bg-primary-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-md shadow-primary-500/20 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
        >
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" />
            </svg>
            {mode === 'signup' ? 'Đăng ký với Google' : 'Tiếp tục với Google'}
        </button>
    );
}
