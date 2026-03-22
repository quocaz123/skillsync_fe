import { useState, useRef, useLayoutEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { loginWithGoogleIdToken } from '../../services/authService';

/** GIS renderButton chỉ chấp nhận width là số pixel (tối đa ~400), không dùng "100%". */
function useButtonWidthPx() {
    const ref = useRef(null);
    const [width, setWidth] = useState(400);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        const measure = () => {
            const w = el.offsetWidth;
            const px = Math.max(240, Math.min(Math.floor(w), 400));
            setWidth(px);
        };

        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    return [ref, width];
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

/**
 * Nút đăng nhập Google (GIS) — trả về JWT id_token gửi POST /auth/google.
 * Cần GoogleOAuthProvider ở root và VITE_GOOGLE_CLIENT_ID trùng Web client ID với backend.
 */
export default function GoogleSignInButton({
    mode = 'signin',
    disabled = false,
    onAuthenticated,
    onError,
}) {
    const [submitting, setSubmitting] = useState(false);
    const [widthRef, buttonWidthPx] = useButtonWidthPx();

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

    const text = mode === 'signup' ? 'signup_with' : 'continue_with';
    const busy = disabled || submitting;

    return (
        <div
            ref={widthRef}
            className={`w-full ${busy ? 'opacity-60 pointer-events-none' : ''}`}
        >
            <GoogleLogin
                onSuccess={async (credentialResponse) => {
                    const idToken = credentialResponse.credential;
                    if (!idToken) {
                        onError?.('Không nhận được id_token từ Google.');
                        return;
                    }
                    setSubmitting(true);
                    try {
                        const user = await loginWithGoogleIdToken(idToken);
                        onAuthenticated(user);
                    } catch (err) {
                        const msg =
                            err.response?.data?.message ||
                            err.message ||
                            'Đăng nhập Google thất bại.';
                        onError?.(msg);
                    } finally {
                        setSubmitting(false);
                    }
                }}
                onError={() => {
                    onError?.('Đăng nhập Google bị hủy hoặc có lỗi từ Google.');
                }}
                useOneTap={false}
                type="standard"
                theme="outline"
                size="large"
                text={text}
                shape="rectangular"
                width={buttonWidthPx}
                containerProps={{
                    className: 'w-full flex justify-center min-h-[40px]',
                }}
            />
        </div>
    );
}
