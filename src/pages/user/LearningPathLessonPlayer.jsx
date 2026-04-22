import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { Play, ChevronLeft, ExternalLink, CheckCircle2, ChevronRight } from 'lucide-react';
import { fetchUserLearningPath } from '../../services/userLearningPathService';
import { useStore } from '../../store/index';

export default function LearningPathLessonPlayer() {
    const { pathId, lessonId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const title = location.state?.lessonTitle ?? 'Bài học';
    const pathTitle = location.state?.pathTitle ?? '';
    const [videoUrl, setVideoUrl] = useState(location.state?.videoUrl || '');
    
    const [pathDetail, setPathDetail] = useState(null);
    const [completedStatus, setCompletedStatus] = useState(false);
    const markLessonCompleted = useStore(state => state.markLessonCompleted);
    const completedLessonsMap = useStore(state => state.completedLessons);
    const completedLessons = completedLessonsMap[pathId] || [];
    const isCompleted = completedLessons.includes(lessonId);

    // Fetch and find videoURL if missing
    useEffect(() => {
        let mounted = true;
        fetchUserLearningPath(pathId)
            .then((workspace) => {
                if (!mounted || !workspace?.modules) return;
                setPathDetail(workspace);
                if (!videoUrl) {
                    for (const module of workspace.modules) {
                        const found = (module.lessons || []).find((l) => String(l.id) === String(lessonId));
                        if (found?.videoUrl) {
                            setVideoUrl(found.videoUrl);
                            return;
                        }
                    }
                }
            })
            .catch(() => {});
        return () => { mounted = false; };
    }, [pathId, lessonId, videoUrl]);

    // Tự động hoàn thành sau 10s
    useEffect(() => {
        if (isCompleted) return;
        const timer = setTimeout(() => {
            markLessonCompleted(pathId, lessonId);
            setCompletedStatus(true);
            setTimeout(() => setCompletedStatus(false), 6000); // Ẩn toast sau 6s
        }, 10000);
        return () => clearTimeout(timer);
    }, [isCompleted, pathId, lessonId, markLessonCompleted]);

    const nextLessonInfo = useMemo(() => {
        if (!pathDetail) return null;
        let foundCurrent = false;
        for (const mod of pathDetail.modules || []) {
            for (const l of mod.lessons || []) {
                if (foundCurrent) return { id: l.id, title: l.title, videoUrl: l.videoUrl };
                if (String(l.id) === String(lessonId)) {
                    foundCurrent = true;
                }
            }
        }
        return null;
    }, [pathDetail, lessonId]);

    const embedInfo = useMemo(() => {
        const u = (videoUrl || '').trim();
        if (!u) return null;
        const yt =
            u.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([\w-]{6,})/i) ||
            u.match(/youtube\.com\/shorts\/([\w-]{6,})/i);
        if (yt) return { type: 'iframe', src: `https://www.youtube.com/embed/${yt[1]}` };
        const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
        if (vm) return { type: 'iframe', src: `https://player.vimeo.com/video/${vm[1]}` };
        if (/^https?:\/\/.+\.(mp4|webm|ogg)(\?.*)?$/i.test(u)) return { type: 'video', src: u };
        return { type: 'link', src: u };
    }, [videoUrl]);

    return (
        <div className="max-w-4xl mx-auto font-sans pb-16 px-4">
            <Link
                to={`/app/learning-path/study/${pathId}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 mb-6"
            >
                <ChevronLeft size={18} /> Quay lại lộ trình
            </Link>
            <div className="rounded-2xl border border-slate-200 bg-slate-900 aspect-video overflow-hidden mb-4 flex items-center justify-center text-white">
                {!embedInfo ? (
                    <div className="text-center px-4">
                        <Play size={48} className="mx-auto mb-2 opacity-80" />
                        <p className="text-sm font-medium">Bài học chưa có video</p>
                        <p className="text-xs text-slate-400 mt-1">{lessonId}</p>
                    </div>
                ) : embedInfo.type === 'iframe' ? (
                    <iframe
                        title={title}
                        src={embedInfo.src}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : embedInfo.type === 'video' ? (
                    <video
                        src={embedInfo.src}
                        className="h-full w-full"
                        controls
                        playsInline
                        preload="metadata"
                    />
                ) : (
                    <a
                        href={embedInfo.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-900 font-semibold"
                    >
                        <ExternalLink size={16} />
                        Mở video trong tab mới
                    </a>
                )}
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">{title}</h1>
            {pathTitle && <p className="text-sm text-slate-500 mt-1">{pathTitle}</p>}

            {completedStatus && (
                <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-wrap items-center gap-4 transition-all">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <h3 className="text-sm font-extrabold text-emerald-800">Tuyệt vời! Bạn đã hoàn thành bài học này.</h3>
                        {nextLessonInfo ? (
                            <p className="text-xs text-emerald-600 mt-0.5 font-medium">Hệ thống đã tự ghi nhận tiến độ học tập.</p>
                        ) : (
                            <p className="text-xs text-emerald-600 mt-0.5 font-medium">Chúc mừng bạn đã hoàn thành TOÀN BỘ lộ trình!</p>
                        )}
                    </div>
                    {nextLessonInfo ? (
                        <button
                            onClick={() => navigate(`/app/learning-path/study/${pathId}/lesson/${nextLessonInfo.id}`, { state: { lessonTitle: nextLessonInfo.title, pathTitle: pathDetail?.pathTitle, videoUrl: nextLessonInfo.videoUrl }})}
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 flex items-center gap-1.5 shrink-0"
                        >
                            Bài tiếp theo <ChevronRight size={16} />
                        </button>
                    ) : (
                        <Link
                            to={`/app/learning-path`}
                            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shrink-0"
                        >
                            Trang chủ Lộ trình
                        </Link>
                    )}
                </div>
            )}

            {isCompleted && !completedStatus && nextLessonInfo && (
                <div className="mt-6 flex flex-wrap gap-3 items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                     <span className="text-sm font-semibold text-slate-600 flex items-center gap-2"><CheckCircle2 className="text-emerald-500" size={18}/> Bài học đã hoàn thành</span>
                     <button
                        onClick={() => navigate(`/app/learning-path/study/${pathId}/lesson/${nextLessonInfo.id}`, { state: { lessonTitle: nextLessonInfo.title, pathTitle: pathDetail?.pathTitle, videoUrl: nextLessonInfo.videoUrl }})}
                        className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 flex items-center gap-2"
                    >
                        Học bài tiếp theo <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}
