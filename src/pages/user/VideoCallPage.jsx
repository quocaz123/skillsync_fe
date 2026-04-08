import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { getZegoToken, markJoin, markLeave } from '../../services/sessionService';
import {
    Video,
    VideoOff,
    Mic,
    MicOff,
    PhoneOff,
    Loader2,
    AlertCircle,
    Clock,
    MonitorUp,
    ShieldCheck,
} from 'lucide-react';

const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const hh = String(hrs).padStart(2, '0');
    const mm = String(mins).padStart(2, '0');
    const ss = String(secs).padStart(2, '0');

    return hrs > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
};

const VideoCallPage = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const { user } = useStore();

    const containerRef = useRef(null);
    const zegoRef = useRef(null);
    const joinedRef = useRef(false);
    const leavingRef = useRef(false);
    const timerRef = useRef(null);

    const [status, setStatus] = useState('loading'); // loading | joining | in-call | error | ended
    const [error, setError] = useState('');
    const [sessionInfo, setSessionInfo] = useState(null);

    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [duration, setDuration] = useState(0);

    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const startTimer = useCallback(() => {
        stopTimer();
        timerRef.current = setInterval(() => {
            setDuration((prev) => prev + 1);
        }, 1000);
    }, [stopTimer]);

    // Defer destroy so ZEGOCLOUD SDK can finish its own cleanup first
    const safeDestroyZego = useCallback((delayMs = 0) => {
        const doDestroy = () => {
            try {
                if (zegoRef.current) {
                    zegoRef.current.destroy();
                    zegoRef.current = null;
                }
            } catch (e) {
                console.warn('ZEGO destroy failed', e);
            }
        };
        if (delayMs > 0) setTimeout(doDestroy, delayMs);
        else doDestroy();
    }, []);

    /**
     * Called by our custom "Kết thúc" button.
     * Asks ZEGOCLOUD SDK to leave first — this triggers onLeaveRoom which handles the rest.
     */
    const endCall = useCallback(() => {
        if (leavingRef.current) return;
        stopTimer();
        try {
            // leaveRoom triggers onLeaveRoom callback, which does backend notify + navigate
            zegoRef.current?.leaveRoom?.();
        } catch (e) {
            // If leaveRoom fails, fall back to destroy
            setStatus('ended');
            setTimeout(() => { window.location.href = '/app/sessions'; }, 1500);
        }
    }, [safeDestroyZego, stopTimer]);

    const toggleMic = useCallback(() => {
        if (!zegoRef.current) return;
        try {
            zegoRef.current.setMicrophoneOn?.(!isMicOn);
            setIsMicOn((prev) => !prev);
        } catch (e) {
            console.warn('toggleMic failed', e);
        }
    }, [isMicOn]);

    const toggleCamera = useCallback(() => {
        if (!zegoRef.current) return;
        try {
            zegoRef.current.setCameraOn?.(!isCameraOn);
            setIsCameraOn((prev) => !prev);
        } catch (e) {
            console.warn('toggleCamera failed', e);
        }
    }, [isCameraOn]);

    const toggleScreenSharing = useCallback(() => {
        if (!zegoRef.current) return;
        try {
            zegoRef.current.startScreenSharing?.();
            setIsScreenSharing(true);
        } catch (e) {
            try {
                zegoRef.current.stopScreenSharing?.();
                setIsScreenSharing(false);
            } catch (err) {
                console.warn('toggleScreenSharing failed', err);
            }
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        const initCall = async () => {
            try {
                setStatus('loading');

                const tokenData = await getZegoToken(sessionId);
                if (cancelled) return;

                if (!tokenData) throw new Error('Không nhận được dữ liệu phòng học từ server.');

                const appIdNum = Number(tokenData.appId);
                if (!Number.isFinite(appIdNum) || appIdNum <= 0) {
                    throw new Error(`Server cấu hình ZEGO appId không hợp lệ (appId=${tokenData.appId}).`);
                }
                if (!tokenData.token) throw new Error('Server chưa cấp token ZEGO.');
                if (!tokenData.roomId) throw new Error('Server chưa cấp roomId ZEGO.');

                setSessionInfo(tokenData);
                setStatus('joining');

                const { ZegoUIKitPrebuilt } = await import('@zegocloud/zego-uikit-prebuilt');
                if (cancelled) return;

                // Debug: Log the token data
                console.log('ZEGO Token Data:', {
                    appId: tokenData.appId,
                    roomId: tokenData.roomId,
                    userId: tokenData.userId,
                    userName: tokenData.userName,
                    tokenLength: tokenData.token?.length,
                    tokenPrefix: tokenData.token?.substring(0, 10)
                });

                // Assemble a proper kitToken from the server-issued Token04 before calling create()
                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
                    Number(tokenData.appId),
                    tokenData.token,
                    tokenData.roomId,
                    tokenData.userId,
                    tokenData.userName,
                );

                const zp = ZegoUIKitPrebuilt.create(kitToken);
                zegoRef.current = zp;

                zp.joinRoom({
                    container: containerRef.current,
                    sharedLinks: [],
                    scenario: {
                        mode: ZegoUIKitPrebuilt.OneONoneCall,
                    },

                    maxUsers: 2,
                    showPreJoinView: false,
                    showScreenSharingButton: true,
                    showRoomDetailsButton: false,
                    showInviteToCohostButton: false,
                    showRemoveUserButton: false,
                    showLayoutButton: false,
                    showMyMicrophoneToggleButton: false,
                    showMyCameraToggleButton: false,
                    showAudioVideoSettingsButton: false,
                    showTextChat: false,
                    showUserList: false,

                    onJoinRoom: async () => {
                        if (cancelled) return;
                        joinedRef.current = true;
                        setStatus('in-call');
                        startTimer();

                        try {
                            await markJoin(sessionId);
                        } catch (e) {
                            console.warn('markJoin failed', e);
                        }
                    },

                    onLeaveRoom: async () => {
                        // SDK has already left the room — do NOT call destroy() here
                        // or ZEGOCLOUD's internal createSpan cleanup will crash.
                        if (leavingRef.current) return;
                        leavingRef.current = true;

                        stopTimer();

                        // Defer destroy to let SDK finish its own post-leave cleanup
                        safeDestroyZego(300);

                        try {
                            if (joinedRef.current) {
                                await markLeave(sessionId);
                            }
                        } catch (e) {
                            console.warn('markLeave failed', e);
                        }

                        setStatus('ended');
                        setTimeout(() => { window.location.href = '/app/sessions'; }, 1500);
                    },
                });
            } catch (err) {
                if (cancelled) return;
                const msg =
                    err?.response?.data?.message ||
                    err?.message ||
                    'Không thể kết nối phòng học.';
                setError(msg);
                setStatus('error');
            }
        };

        initCall();

        return () => {
            cancelled = true;
            stopTimer();
            safeDestroyZego();
        };
    }, [sessionId, endCall, startTimer, stopTimer, safeDestroyZego]);

    if (status === 'loading' || status === 'joining') {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-5 text-white">
                <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                    <Video className="w-10 h-10 text-indigo-400 animate-pulse" />
                </div>

                <div className="text-center">
                    <h2 className="text-xl font-bold mb-1">
                        {status === 'loading' ? 'Đang xác thực…' : 'Đang kết nối phòng học…'}
                    </h2>
                    {sessionInfo && (
                        <p className="text-slate-400 text-sm">
                            Phòng: <code className="text-indigo-300">{sessionInfo.roomId}</code>
                        </p>
                    )}
                </div>

                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-5 text-white px-4">
                <div className="w-20 h-20 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-red-400" />
                </div>

                <div className="text-center max-w-md">
                    <h2 className="text-xl font-bold mb-2">Không thể vào phòng học</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">{error}</p>
                    <p className="text-slate-500 text-xs mt-2 flex items-center justify-center gap-1">
                        <Clock size={12} /> Chỉ có thể vào trong khoảng 10 phút trước đến 2 giờ sau giờ học.
                    </p>
                </div>

                <button
                    onClick={() => { window.location.href = '/app/sessions'; }}
                    className="mt-4 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
                >
                    ← Quay lại Lịch học
                </button>
            </div>
        );
    }



    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            <div ref={containerRef} className="w-full h-screen" />

            {status === 'ended' && (
                <div className="absolute inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center gap-4 text-white">
                    <div className="w-20 h-20 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                        <PhoneOff className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold">Buổi học đã kết thúc</h2>
                    <p className="text-slate-400 text-sm">Đang chuyển về trang Lịch học…</p>
                </div>
            )}

            {status !== 'ended' && (
                <>
                    <div className="absolute top-4 left-4 z-50 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl px-4 py-3 text-white shadow-xl">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <ShieldCheck size={16} className="text-emerald-400" />
                            Phòng học trực tuyến
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                            {sessionInfo?.roomId || '---'}
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-indigo-400" />
                                <span className="font-mono">{formatDuration(duration)}</span>
                            </div>
                            {sessionInfo?.expireSeconds && (sessionInfo.expireSeconds - duration) <= 300 && (
                                <span className="text-[10px] font-bold text-red-400 animate-pulse bg-red-900/30 px-1.5 py-0.5 rounded-md">
                                    Còn {formatDuration(Math.max(0, sessionInfo.expireSeconds - duration))}
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            {user?.fullName || sessionInfo?.userName || 'Người dùng'}
                        </div>
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
                        <div className="flex items-center gap-3 bg-slate-900/85 backdrop-blur-md border border-slate-700 rounded-2xl px-4 py-3 shadow-2xl">
                            <button
                                onClick={toggleMic}
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                                    isMicOn
                                        ? 'bg-slate-700 hover:bg-slate-600 text-white'
                                        : 'bg-amber-600 hover:bg-amber-500 text-white'
                                }`}
                                title={isMicOn ? 'Tắt mic' : 'Bật mic'}
                            >
                                {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                            </button>

                            <button
                                onClick={toggleCamera}
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                                    isCameraOn
                                        ? 'bg-slate-700 hover:bg-slate-600 text-white'
                                        : 'bg-amber-600 hover:bg-amber-500 text-white'
                                }`}
                                title={isCameraOn ? 'Tắt camera' : 'Bật camera'}
                            >
                                {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
                            </button>

                            <button
                                onClick={toggleScreenSharing}
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                                    isScreenSharing
                                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                                }`}
                                title="Chia sẻ màn hình"
                            >
                                <MonitorUp size={20} />
                            </button>

                            <button
                                onClick={endCall}
                                className="px-5 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 transition"
                                title="Kết thúc buổi học"
                            >
                                <PhoneOff size={18} />
                                <span>Kết thúc</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default VideoCallPage;