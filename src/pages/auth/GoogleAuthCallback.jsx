import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { exchangeGoogleAuthCode } from '../../services/authService';

export default function GoogleAuthCallback() {
    const navigate = useNavigate();
    const setSession = useStore((state) => state.login);
    const handledRef = useRef(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (handledRef.current) return;
        handledRef.current = true;

        const run = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const code = params.get('code');
                const state = params.get('state');
                const user = await exchangeGoogleAuthCode(code, state);
                setSession(user);
                if (user.role === 'admin') navigate('/admin', { replace: true });
                else navigate('/app', { replace: true });
            } catch (err) {
                setError(err.message || 'Xác thực Google thất bại.');
                window.setTimeout(() => navigate('/login', { replace: true }), 1400);
            }
        };

        run();
    }, [navigate, setSession]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-lg p-8 text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
                <h2 className="text-2xl font-bold text-slate-900">Đang xác thực Google...</h2>
                <p className="text-slate-500 mt-2">Vui lòng chờ trong giây lát.</p>
                {error && (
                    <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}

