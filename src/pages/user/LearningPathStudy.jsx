import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
    BookOpen,
    ChevronLeft,
    Layers,
    Lock,
    CheckCircle2,
    Play,
    Circle,
    Loader2,
    Sparkles,
    Users,
    Zap,
    Target,
    StickyNote,
    ChevronRight,
    Star,
    Trophy,
    MessageSquarePlus,
} from 'lucide-react';
import { fetchUserLearningPath } from '../../services/userLearningPathService';
import { useStore } from '../../store';
import PathRatingModal from '../../components/learning/PathRatingModal';
import axiosClient from '../../configuration/axiosClient';
import API_ENDPOINTS from '../../configuration/apiEndpoints';

const MODULE_STATUS_LABEL = {
    LOCKED: 'Đã khóa',
    ONGOING: 'Đang học',
    COMPLETED: 'Hoàn thành',
};

const LESSON_STATUS_LABEL = {
    NOT_STARTED: 'Chưa học',
    IN_PROGRESS: 'Đang học',
    COMPLETED: 'Đã xong',
};

const QUIZ_BADGE = {
    NOT_ATTEMPTED: { text: 'Chưa làm', cls: 'bg-slate-100 text-slate-700 border-slate-200' },
    PASSED: { text: 'Đạt', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    FAILED: { text: 'Chưa đạt', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
};

const SUPPORT_LABEL = {
    NONE: 'Chưa gửi',
    SENT: 'Đã gửi yêu cầu',
    IN_PROGRESS: 'Đang được hỗ trợ',
    REPLIED: 'Đã phản hồi',
};

function SupportRequestModal({ open, onClose, moduleTitle, mentorName, onSubmit, initial }) {
    const [topic, setTopic] = useState('');
    const [context, setContext] = useState('');
    const [description, setDescription] = useState('');
    const [question, setQuestion] = useState('');

    useEffect(() => {
        if (open) {
            setTopic(initial?.topic ?? '');
            setContext(initial?.context ?? '');
            setDescription(initial?.description ?? '');
            setQuestion(initial?.question ?? '');
        }
    }, [open, initial]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="absolute inset-0" aria-hidden onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200">
                <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between">
                    <h2 className="text-lg font-extrabold text-slate-900">Gửi yêu cầu hỗ trợ</h2>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
                        ✕
                    </button>
                </div>
                <div className="p-5 space-y-4 text-sm">
                    <p className="text-slate-500">
                        Mentor: <span className="font-semibold text-slate-800">{mentorName}</span>
                        {moduleTitle && (
                            <>
                                {' '}
                                · Module: <span className="font-semibold text-slate-800">{moduleTitle}</span>
                            </>
                        )}
                    </p>
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Chủ đề cần hỗ trợ</label>
                        <input
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 font-medium"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Ví dụ: Phần phát âm trong bài 2"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lesson / module đang gặp khó</label>
                        <input
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 font-medium"
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            placeholder="Ví dụ: Module 2 — Bài 3"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mô tả vấn đề</label>
                        <textarea
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 min-h-[80px] font-medium"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tôi chưa hiểu phần phát âm trong bài 2…"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Câu hỏi cụ thể</label>
                        <textarea
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 min-h-[72px] font-medium"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Tôi muốn được giải thích lại phần này trước khi làm quiz…"
                        />
                    </div>
                </div>
                <div className="flex gap-2 px-5 pb-5 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700"
                    >
                        Huỷ
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onSubmit?.({ topic, context, description, question });
                            onClose();
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700"
                    >
                        Gửi yêu cầu
                    </button>
                </div>
            </div>
        </div>
    );
}

function QuizModal({ open, onClose, moduleTitle }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="absolute inset-0" aria-hidden onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200 p-6">
                <h2 className="text-lg font-extrabold text-slate-900 mb-1">Quiz module</h2>
                <p className="text-sm text-slate-500 mb-4">{moduleTitle}</p>
                <p className="text-sm text-slate-600 mb-6">
                    Giao diện làm quiz sẽ kết nối API khi backend sẵn sàng. Hiện tại đây là bản demo.
                </p>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold"
                >
                    Đóng
                </button>
            </div>
        </div>
    );
}

export default function LearningPathStudy() {
    const { pathId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedModuleId, setSelectedModuleId] = useState(null);
    const [supportOpen, setSupportOpen] = useState(false);
    const [quizOpen, setQuizOpen] = useState(false);
    const [quizModuleId, setQuizModuleId] = useState(null);
    const [supportModuleId, setSupportModuleId] = useState(null);
    const [ratingOpen, setRatingOpen] = useState(false);

    const addPathReview = useStore((s) => s.addPathReview);
    const pathReviews = useStore((s) => s.pathReviews);
    const existingReview = pathReviews?.[String(pathId)] ?? null;

    useEffect(() => {
        let c = false;
        setLoading(true);
        setError(null);
        fetchUserLearningPath(pathId)
            .then((d) => {
                if (!c) {
                    setData(d);
                    const ongoingId = d.modules?.find((m) => m.status === 'ONGOING')?.id;
                    const firstId = d.modules?.[0]?.id;
                    setSelectedModuleId(d.currentModuleId || ongoingId || firstId || null);
                }
            })
            .catch((e) => {
                if (!c) setError(e?.message || 'Lỗi tải dữ liệu');
            })
            .finally(() => {
                if (!c) setLoading(false);
            });
        return () => {
            c = true;
        };
    }, [pathId]);

    const selectedModule = data?.modules?.find((m) => m.id === selectedModuleId);
    const mentorName = data?.mentor?.name ?? 'Mentor';

    const goLesson = useCallback(
        (lessonId, lessonTitle, videoUrl) => {
            navigate(`/app/learning-path/study/${pathId}/lesson/${lessonId}`, {
                state: { lessonTitle, pathTitle: data?.pathTitle, videoUrl },
            });
        },
        [navigate, pathId, data?.pathTitle]
    );

    const handlePrimaryCta = () => {
        const pc = data?.primaryCta;
        if (!pc) return;
        if ((pc.type === 'CONTINUE_LESSON' || pc.type === 'REVIEW_PATH') && pc.lessonId) {
            const mod = data.modules.find((m) => m.id === pc.moduleId);
            const les = mod?.lessons?.find((l) => l.id === pc.lessonId);
            goLesson(pc.lessonId, les?.title ?? 'Bài học', les?.videoUrl);
        } else if (pc.type === 'TAKE_QUIZ' && pc.quizModuleId) {
            setQuizModuleId(pc.quizModuleId);
            setQuizOpen(true);
        } else if (pc.type === 'SUPPORT_REQUEST' && pc.moduleId) {
            setSupportModuleId(pc.moduleId);
            setSupportOpen(true);
        } else if (pc.type === 'OPEN_NEXT_MODULE' && pc.moduleId) {
            setSelectedModuleId(pc.moduleId);
            document.getElementById(`module-${pc.moduleId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleRatingSubmit = useCallback(async (reviewData) => {
        try {
            await axiosClient.post(API_ENDPOINTS.LEARNING_PATHS.RATE(pathId), reviewData);
            addPathReview(pathId, reviewData);
        } catch (error) {
            console.error('Lỗi khi đánh giá lộ trình:', error);
            throw error;
        }
    }, [pathId, addPathReview]);

    const openSupportForModule = (moduleId) => {
        setSupportModuleId(moduleId);
        setSupportOpen(true);
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto py-24 flex flex-col items-center justify-center gap-3 text-slate-500">
                <Loader2 className="animate-spin text-indigo-600" size={36} />
                <p className="text-sm font-medium">Đang tải workspace học tập…</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="max-w-lg mx-auto py-20 text-center px-4">
                <p className="text-slate-800 font-bold mb-2">{error || 'Không có dữ liệu'}</p>
                <Link to="/app/learning-path" className="text-indigo-600 font-semibold hover:underline">
                    ← Quay lại lộ trình
                </Link>
            </div>
        );
    }

    const isMentorPath = data.pathType === 'mentor';
    const quizModule = data.modules.find((m) => m.id === quizModuleId);

    return (
        <div className="max-w-6xl mx-auto font-sans pb-20 px-4">
            <Link
                to="/app/learning-path"
                className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 mb-6"
            >
                <ChevronLeft size={18} /> Lộ trình của tôi
            </Link>

            {/* A. Header progress */}
            <header
                className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm mb-6"
                style={{
                    backgroundImage: data.thumbnailFrom
                        ? `linear-gradient(135deg, ${data.thumbnailFrom}22, ${data.thumbnailTo}18, white 55%)`
                        : undefined,
                }}
            >
                <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                            <span className="text-4xl shrink-0">{data.emoji || '📚'}</span>
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{data.pathTitle}</h1>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    {isMentorPath ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 text-[11px] font-bold border border-violet-200">
                                            <Users size={10} /> Mentor-guided
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[11px] font-bold border border-sky-200">
                                            <Sparkles size={10} /> System Path
                                        </span>
                                    )}
                                    {data.currentModuleId && (
                                        <span className="text-xs text-slate-500 font-semibold">
                                            Module hiện tại:{' '}
                                            <span className="text-slate-800">
                                                {data.modules.find((m) => m.id === data.currentModuleId)?.title ?? '—'}
                                            </span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-3xl font-black text-indigo-600">{data.progressPercent}%</p>
                            <p className="text-xs text-slate-500 font-semibold">hoàn thành path</p>
                        </div>
                    </div>
                    <div className="mt-4 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-500 rounded-full transition-all"
                            style={{ width: `${Math.min(100, data.progressPercent)}%` }}
                        />
                    </div>
                    <div className="flex flex-wrap justify-between gap-2 mt-3 text-sm text-slate-600">
                        <span className="font-semibold">
                            Module: {data.completedModulesCount} / {data.totalModulesCount} đã xong
                        </span>
                        {data.lastInProgressLesson && (
                            <span className="text-slate-500">
                                Đang dở gần nhất:{' '}
                                <span className="text-slate-800 font-medium">{data.lastInProgressLesson.title}</span>
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {/* Primary CTA — theo backend trả về */}
            {data.primaryCta && (
                <div className="mb-8 rounded-2xl border-2 border-indigo-200 bg-indigo-50/60 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2 text-indigo-900 text-sm">
                        <Zap className="text-indigo-500 shrink-0" size={20} />
                        <span>
                            <span className="font-extrabold">Bước gợi ý · </span>
                            <span className="text-indigo-800/90">theo trạng thái từ hệ thống</span>
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={handlePrimaryCta}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-sm whitespace-nowrap"
                    >
                        {data.primaryCta.label}
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* B. Timeline + C. Detail */}
                <div className="lg:col-span-8 space-y-6">
                    <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                        <Layers size={20} className="text-indigo-600" /> Chương trình theo module
                    </h2>

                    <div className="space-y-3">
                        {data.modules.map((mod) => {
                            const active = selectedModuleId === mod.id;
                            const locked = mod.status === 'LOCKED';
                            return (
                                <button
                                    key={mod.id}
                                    id={`module-${mod.id}`}
                                    type="button"
                                    onClick={() => !locked && setSelectedModuleId(mod.id)}
                                    disabled={locked}
                                    className={`w-full text-left rounded-2xl border p-4 transition-all ${
                                        locked
                                            ? 'border-slate-100 bg-slate-50 opacity-70 cursor-not-allowed'
                                            : active
                                              ? 'border-indigo-300 bg-indigo-50/50 shadow-md ring-1 ring-indigo-200'
                                              : 'border-slate-200 bg-white hover:border-indigo-200 hover:shadow-sm'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
                                                mod.status === 'COMPLETED'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : mod.status === 'ONGOING'
                                                      ? 'bg-indigo-100 text-indigo-700'
                                                      : 'bg-slate-200 text-slate-500'
                                            }`}
                                        >
                                            {mod.order}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className="font-bold text-slate-900">{mod.title}</span>
                                                <span
                                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                                        mod.status === 'COMPLETED'
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                            : mod.status === 'ONGOING'
                                                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                                              : 'bg-slate-100 text-slate-600 border-slate-200'
                                                    }`}
                                                >
                                                    {MODULE_STATUS_LABEL[mod.status]}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 line-clamp-2">{mod.shortDescription}</p>
                                            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-500 font-semibold">
                                                <span>
                                                    Bài: {mod.lessonsCompleted}/{mod.lessonsTotal}
                                                </span>
                                                {mod.quiz?.enabled && (
                                                    <span>
                                                        Quiz: {QUIZ_BADGE[mod.quiz.status]?.text ?? mod.quiz.status}
                                                    </span>
                                                )}
                                                <span>
                                                    {mod.mentorSupport ? 'Có hỗ trợ mentor' : 'Tự học hoàn toàn'}
                                                </span>
                                            </div>
                                        </div>
                                        {locked ? <Lock size={18} className="text-slate-300 shrink-0" /> : <ChevronRight size={18} className="text-slate-300 shrink-0" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* C–F Module detail (only when selected & not locked) */}
                    {selectedModule && selectedModule.status !== 'LOCKED' && (
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-8">
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                                    <Target size={20} className="text-indigo-600" />
                                    {selectedModule.title}
                                </h3>
                                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{selectedModule.goal}</p>
                            </div>

                            {/* D. Lessons */}
                            <div>
                                <h4 className="text-sm font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                                    <VideoIcon /> Video bài học
                                </h4>
                                <ul className="space-y-2">
                                    {selectedModule.lessons.map((les) => (
                                        <li
                                            key={les.id}
                                            className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-900 truncate">{les.title}</p>
                                                <p className="text-[11px] text-slate-500">
                                                    {les.durationMinutes} phút · {LESSON_STATUS_LABEL[les.status]}
                                                </p>
                                            </div>
                                            {les.status === 'COMPLETED' && <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />}
                                            {les.status === 'IN_PROGRESS' && <Circle size={18} className="text-indigo-500 shrink-0" />}
                                            {les.status === 'COMPLETED' ? (
                                                <button
                                                    type="button"
                                                    onClick={() => goLesson(les.id, les.title, les.videoUrl)}
                                                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:border-indigo-300 shrink-0"
                                                >
                                                    Xem lại
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => goLesson(les.id, les.title, les.videoUrl)}
                                                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shrink-0"
                                                >
                                                    {les.status === 'NOT_STARTED' ? 'Học bài' : 'Tiếp tục'}
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* E. Quiz */}
                            {selectedModule.quiz?.enabled && (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kiểm tra cuối module</p>
                                            <span
                                                className={`inline-flex mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${QUIZ_BADGE[selectedModule.quiz.status]?.cls ?? 'bg-slate-100'}`}
                                            >
                                                {QUIZ_BADGE[selectedModule.quiz.status]?.text ?? selectedModule.quiz.status}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setQuizModuleId(selectedModule.id);
                                                setQuizOpen(true);
                                            }}
                                            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-800 hover:border-indigo-300"
                                        >
                                            {selectedModule.quiz.status === 'FAILED' ? 'Làm lại' : 'Làm quiz'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* F. Support */}
                            {selectedModule.mentorSupport && data.mentor && (
                                <div className="rounded-2xl border border-violet-200 bg-violet-50/50 p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div
                                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${data.mentor.avatarGrad || 'from-violet-500 to-indigo-500'} text-white font-extrabold flex items-center justify-center`}
                                        >
                                            {data.mentor.avatarText}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{data.mentor.name}</p>
                                            <p className="text-xs text-slate-500">{data.mentor.role}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-4">
                                        Mentor sẽ hỗ trợ khi bạn gặp khó trong module này — gửi mô tả cụ thể để được phản hồi nhanh hơn.
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2 mb-4">
                                        <span className="text-[11px] font-bold text-violet-800 bg-white/80 border border-violet-200 px-2 py-1 rounded-full">
                                            {SUPPORT_LABEL[selectedModule.supportRequest?.status ?? 'NONE'] ?? '—'}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedModule.supportRequest?.status === 'NONE' && (
                                            <button
                                                type="button"
                                                onClick={() => openSupportForModule(selectedModule.id)}
                                                className="px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700"
                                            >
                                                Gửi yêu cầu hỗ trợ
                                            </button>
                                        )}
                                        {selectedModule.supportRequest?.status === 'SENT' && (
                                            <>
                                                <button
                                                    type="button"
                                                    className="px-4 py-2 rounded-xl border border-violet-300 text-violet-800 text-sm font-bold bg-white"
                                                >
                                                    Xem yêu cầu đã gửi
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => openSupportForModule(selectedModule.id)}
                                                    className="px-4 py-2 rounded-xl text-sm font-bold text-violet-700 underline"
                                                >
                                                    Gửi lại
                                                </button>
                                            </>
                                        )}
                                        {selectedModule.supportRequest?.status === 'IN_PROGRESS' && (
                                            <button type="button" className="px-4 py-2 rounded-xl border border-violet-300 text-sm font-bold bg-white">
                                                Xem tiến độ hỗ trợ
                                            </button>
                                        )}
                                        {selectedModule.supportRequest?.status === 'REPLIED' && (
                                            <button type="button" className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold">
                                                Xem phản hồi
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* G. Sidebar */}
                <aside className="lg:col-span-4 space-y-4">
                    <div className="lg:sticky lg:top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                            <BookOpen size={16} className="text-indigo-600" /> Tóm tắt path
                        </h3>
                        <div className="text-sm space-y-2 text-slate-600">
                            <p>
                                <span className="text-slate-400">Tiến độ:</span>{' '}
                                <span className="font-bold text-slate-900">{data.progressPercent}%</span>
                            </p>
                            <p>
                                <span className="text-slate-400">Module:</span>{' '}
                                {data.completedModulesCount}/{data.totalModulesCount}
                            </p>
                        </div>
                        {data.nextRecommendedHint && (
                            <div className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-2 text-xs text-amber-900 font-medium">
                                {data.nextRecommendedHint}
                            </div>
                        )}
                        {data.learnerNote && (
                            <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2 text-xs text-slate-600 flex gap-2">
                                <StickyNote size={14} className="text-slate-400 shrink-0 mt-0.5" />
                                {data.learnerNote}
                            </div>
                        )}
                        {data.missionHint && (
                            <div className="rounded-xl bg-indigo-50 border border-indigo-100 px-3 py-2 text-xs text-indigo-900 font-medium flex gap-2">
                                <Zap size={14} className="shrink-0 mt-0.5" />
                                {data.missionHint}
                            </div>
                        )}

                        {/* Rating CTA in sidebar */}
                        <div className="pt-1 border-t border-slate-100">
                            {existingReview ? (
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đánh giá của bạn</p>
                                    <div className="flex gap-0.5">
                                        {[1,2,3,4,5].map((s) => (
                                            <Star key={s} size={16}
                                                className={s <= existingReview.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-100'}
                                            />
                                        ))}
                                    </div>
                                    {existingReview.comment && (
                                        <p className="text-xs text-slate-500 italic line-clamp-2">"{existingReview.comment}"</p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setRatingOpen(true)}
                                        className="w-full py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:border-indigo-300 hover:text-indigo-700 flex items-center justify-center gap-1.5 transition-colors"
                                    >
                                        <Star size={13} /> Sửa đánh giá
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setRatingOpen(true)}
                                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-200 transition-all"
                                >
                                    <MessageSquarePlus size={16} /> Đánh giá lộ trình
                                </button>
                            )}
                        </div>
                    </div>
                </aside>
            </div>

            <SupportRequestModal
                open={supportOpen}
                onClose={() => setSupportOpen(false)}
                moduleTitle={data.modules.find((m) => m.id === supportModuleId)?.title}
                mentorName={mentorName}
                onSubmit={() => {
                    /* Demo: backend ghi nhận POST /api/support-requests */
                }}
            />

            <QuizModal
                open={quizOpen}
                onClose={() => setQuizOpen(false)}
                moduleTitle={quizModule?.title ?? ''}
            />

            <PathRatingModal
                open={ratingOpen}
                onClose={() => setRatingOpen(false)}
                onSubmit={handleRatingSubmit}
                pathTitle={data.pathTitle}
                pathEmoji={data.emoji}
                existingRating={existingReview}
            />
        </div>
    );
}

function VideoIcon() {
    return (
        <span className="inline-flex w-5 h-5 items-center justify-center text-indigo-600">
            <Play size={14} className="fill-current" />
        </span>
    );
}
