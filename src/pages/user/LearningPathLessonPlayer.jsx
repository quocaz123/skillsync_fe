import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Play, ChevronLeft, ExternalLink } from 'lucide-react';
import { fetchLearningPathById } from '../../services/learningPathService';

export default function LearningPathLessonPlayer() {
    const { pathId, lessonId } = useParams();
    const location = useLocation();
    const title = location.state?.lessonTitle ?? 'Bài học';
    const pathTitle = location.state?.pathTitle ?? '';
    const [videoUrl, setVideoUrl] = useState(location.state?.videoUrl || '');

    useEffect(() => {
        let cancelled = false;
        if (videoUrl) return undefined;
        fetchLearningPathById(pathId)
            .then((detail) => {
                if (cancelled || !detail?.modules) return;
                for (const module of detail.modules) {
                    const lessons = Array.isArray(module.lessons) ? module.lessons : [];
                    const found = lessons.find((l) => String(l.id) === String(lessonId));
                    if (found?.videoUrl) {
                        setVideoUrl(found.videoUrl);
                        return;
                    }
                }
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, [pathId, lessonId, videoUrl]);

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
        </div>
    );
}
