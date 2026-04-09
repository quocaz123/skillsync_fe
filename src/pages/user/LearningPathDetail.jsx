import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
    Map, Star, Target, BookOpen, ChevronDown, Zap, CheckCircle2, Play,
    Clock, Users, Sparkles, Video, Layers, ChevronLeft, BadgeCheck,
    HelpCircle, Loader2, X, GraduationCap, ListChecks, Shield,
} from 'lucide-react';
import { fetchLearningPathById, enrollLearningPath } from '../../services/learningPathService';
import { useStore } from '../../store';

const LEVEL_LABEL = { Beginner: 'Cơ bản', Intermediate: 'Trung cấp', Advanced: 'Nâng cao' };

function LevelBadge({ level }) {
    const s =
        level === 'Advanced'
            ? 'bg-rose-50 text-rose-700 border-rose-200'
            : level === 'Intermediate'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200';
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold ${s}`}>
            <Target size={12} /> {LEVEL_LABEL[level] || level}
        </span>
    );
}

function formatMinutes(m) {
    if (!m || m < 1) return '—';
    if (m < 60) return `${Math.round(m)} phút`;
    const h = Math.floor(m / 60);
    const min = Math.round(m % 60);
    return min ? `${h}h ${min}p` : `${h} giờ`;
}

function moduleSummaryLine(m) {
    const parts = [`${m.videoLessonCount} video`];
    if (m.hasQuiz) parts.push('có quiz');
    if (m.mentorSupport) parts.push('hỗ trợ mentor');
    if (m.practiceSessionLabel) parts.push(m.practiceSessionLabel);
    return parts.join(' · ');
}

const FAQ_ITEMS = [
    {
        q: 'Học xong tôi nhận được gì?',
        a: 'Bạn nắm lộ trình kỹ năng theo mô tả đầu ra, có thể khoe project/portfolio tùy path và nhận chứng nhận hoàn thành nếu path hỗ trợ.',
    },
    {
        q: 'Có bắt buộc học theo thứ tự module không?',
        a: 'Nên học lần lượt để kiến thức nối tiếp; một số bài có thể mở sớm tùy chính sách từng lộ trình (sẽ hiển thị trong màn học).',
    },
    {
        q: 'Buổi mentor là bắt buộc hay tùy chọn?',
        a: 'Với lộ trình có mentor, phần session được ghi rõ trong từng module — có module bắt buộc để mở khóa, có phần chỉ gợi ý hỗ trợ thêm.',
    },
    {
        q: 'Credit có hoàn lại sau khi đăng ký không?',
        a: 'Credit đã trừ khi đăng ký thành công thường không hoàn theo chính sách chung; trường hợp đặc biệt (lỗi hệ thống, path bị huỷ) sẽ xử lý qua hỗ trợ.',
    },
];

function EnrollmentModal({
    open,
    onClose,
    detail,
    balance,
    onConfirm,
    submitting,
}) {
    if (!open || !detail) return null;

    const cost = Number(detail.totalCredits || 0);
    const mentorName = detail.pathType === 'mentor' && detail.mentor ? detail.mentor.name : 'Lộ trình hệ thống';
    const after = balance - cost;
    const insufficient = cost > 0 && after < 0;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div
                className="absolute inset-0"
                aria-hidden
                onClick={() => !submitting && onClose()}
            />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-extrabold text-slate-900">Xác nhận đăng ký</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="p-5 space-y-4 text-sm">
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lộ trình</p>
                        <p className="font-bold text-slate-900">{detail.title}</p>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mentor / Loại</p>
                        <p className="text-slate-700">{mentorName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                            <p className="text-[11px] text-slate-500 font-semibold">Giá</p>
                            <p className="text-lg font-black text-amber-600 flex items-center gap-1">
                                <Zap size={16} className="fill-current" /> {cost > 0 ? `${cost} credits` : 'Miễn phí'}
                            </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                            <p className="text-[11px] text-slate-500 font-semibold">Credit hiện tại</p>
                            <p className="text-lg font-black text-slate-800">{balance}</p>
                        </div>
                    </div>
                    <div
                        className={`rounded-xl border p-3 ${insufficient ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50'}`}
                    >
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sau khi đăng ký</p>
                        <p className={`text-xl font-black ${insufficient ? 'text-rose-600' : 'text-emerald-700'}`}>
                            {insufficient ? 'Không đủ credit' : `${after} credits còn lại`}
                        </p>
                    </div>
                    {insufficient && (
                        <p className="text-xs text-rose-600 font-medium">
                            Bạn cần thêm ít nhất {Math.abs(after)} credits để tiếp tục.
                        </p>
                    )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 px-5 pb-5">
                    {insufficient ? (
                        <>
                            <Link
                                to="/app/missions"
                                className="flex-1 py-2.5 text-center rounded-xl border border-indigo-200 text-indigo-700 font-bold text-sm hover:bg-indigo-50"
                                onClick={onClose}
                            >
                                Kiếm thêm credit
                            </Link>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50"
                            >
                                Đóng
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50"
                                disabled={submitting}
                            >
                                Đóng
                            </button>
                            <button
                                type="button"
                                onClick={onConfirm}
                                disabled={submitting}
                                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                                Xác nhận đăng ký
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function LearningPathDetail() {
    const { pathId } = useParams();
    const navigate = useNavigate();
    const { user, credits, syncCredits, deductCredits, addEnrolledPath, addCreditTransaction, enrolledPathIds } = useStore();

    const [detail, setDetail] = useState(null);
    const [loadState, setLoadState] = useState('loading');
    const [err, setErr] = useState(null);
    const [openIdx, setOpenIdx] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const balance = useMemo(
        () => Number(user?.creditsBalance ?? credits ?? 0),
        [user?.creditsBalance, credits]
    );

    useEffect(() => {
        let cancelled = false;
        setLoadState('loading');
        setErr(null);
        fetchLearningPathById(pathId)
            .then((d) => {
                if (!cancelled) {
                    setDetail(d);
                    setLoadState('ok');
                }
            })
            .catch((e) => {
                if (!cancelled) {
                    setErr(e?.message || 'Không tải được dữ liệu');
                    setLoadState('error');
                }
            });
        return () => {
            cancelled = true;
        };
    }, [pathId]);

    const enrolled = detail?.enrolled || (detail?.id && enrolledPathIds?.includes(detail.id));

    const handlePrimaryCta = () => {
        if (!detail) return;
        if (enrolled) {
            navigate(`/app/learning-path/study/${detail.id}`);
            return;
        }
        setModalOpen(true);
    };

    const handleEnrollConfirm = async () => {
        if (!detail) return;
        const cost = Number(detail.totalCredits || 0);
        if (cost > 0 && balance < cost) return;

        setSubmitting(true);
        try {
            const res = await enrollLearningPath(detail.id);
            addEnrolledPath(detail.id);

            if (res.creditsBalance != null && res.creditsBalance !== '') {
                syncCredits(Number(res.creditsBalance));
            } else if (res.offline && cost > 0) {
                deductCredits(cost);
                addCreditTransaction({
                    type: 'path_enroll',
                    amount: -cost,
                    description: `Đăng ký lộ trình: ${detail.title}`,
                });
            }

            setDetail((prev) => (prev ? { ...prev, enrolled: true, enrollmentId: res.enrollmentId || prev.enrollmentId } : prev));
            setModalOpen(false);
        } catch {
            /* axios đã throw — giữ modal mở */
        } finally {
            setSubmitting(false);
        }
    };

    if (loadState === 'loading') {
        return (
            <div className="max-w-6xl mx-auto py-24 flex flex-col items-center justify-center gap-3 text-slate-500">
                <Loader2 className="animate-spin text-indigo-600" size={36} />
                <p className="text-sm font-medium">Đang tải lộ trình…</p>
            </div>
        );
    }

    if (loadState === 'error' || !detail) {
        return (
            <div className="max-w-lg mx-auto py-20 text-center px-4">
                <p className="text-slate-800 font-bold mb-2">{err || 'Không tìm thấy lộ trình'}</p>
                <Link to="/app/learning-path" className="text-indigo-600 font-semibold hover:underline">
                    ← Quay lại Lộ trình khóa học
                </Link>
            </div>
        );
    }

    const isMentor = detail.pathType === 'mentor';
    const cost = Number(detail.totalCredits || 0);

    return (
        <div className="max-w-6xl mx-auto font-sans pb-24 px-4">
            <Link
                to="/app/learning-path"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 mb-6"
            >
                <ChevronLeft size={18} /> Quay lại Khám phá
            </Link>

            <div className="lg:grid lg:grid-cols-3 lg:gap-10 lg:items-start">
                <div className="lg:col-span-2 space-y-12">
                    {/* A. Hero */}
                    <section className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                        <div
                            className="relative h-52 sm:h-64 flex items-center justify-center"
                            style={{
                                background: `linear-gradient(135deg, ${detail.thumbnailFrom || '#6366f1'}, ${detail.thumbnailTo || '#8b5cf6'})`,
                            }}
                        >
                            <span className="text-7xl sm:text-8xl drop-shadow-lg select-none">{detail.emoji || '📚'}</span>
                            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                {isMentor ? (
                                    <span className="px-2.5 py-1 rounded-full bg-white/90 text-violet-700 text-xs font-bold border border-violet-200 flex items-center gap-1">
                                        <Users size={12} /> Mentor-guided
                                    </span>
                                ) : (
                                    <span className="px-2.5 py-1 rounded-full bg-white/90 text-sky-700 text-xs font-bold border border-sky-200 flex items-center gap-1">
                                        <Sparkles size={12} /> System Path
                                    </span>
                                )}
                                <LevelBadge level={detail.level} />
                            </div>
                            {detail.rating > 0 && (
                                <div className="absolute top-4 right-4 bg-black/35 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                    <Star size={12} className="text-amber-300 fill-current" /> {detail.rating.toFixed(1)}
                                </div>
                            )}
                        </div>
                        <div className="p-6 sm:p-8 space-y-4">
                            <div>
                                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">{detail.skill}</p>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{detail.title}</h1>
                                <p className="text-slate-600 text-sm mt-2 leading-relaxed">{detail.shortDescription || detail.description}</p>
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                                <span className="inline-flex items-center gap-1.5 font-semibold">
                                    <Clock size={15} className="text-slate-400" /> {detail.duration}
                                </span>
                                <span className="inline-flex items-center gap-1.5 font-semibold">
                                    <Layers size={15} className="text-slate-400" /> {detail.totalModules} module
                                </span>
                                <span className="inline-flex items-center gap-1.5 font-semibold">
                                    <Video size={15} className="text-slate-400" /> {detail.totalLessons} bài
                                </span>
                                <span className="inline-flex items-center gap-1.5 font-bold text-amber-600">
                                    <Zap size={15} className="fill-current" />{' '}
                                    {cost > 0 ? `${cost} credits` : 'Miễn phí'}
                                </span>
                            </div>

                            {isMentor && detail.mentor && (
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div
                                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${detail.mentor.avatarGrad || 'from-violet-500 to-indigo-500'} text-white font-extrabold flex items-center justify-center shrink-0`}
                                    >
                                        {detail.mentor.avatarText}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-900 flex items-center gap-1 truncate">
                                            {detail.mentor.name}
                                            {detail.mentor.verified && <BadgeCheck size={14} className="text-emerald-500 shrink-0" />}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">{detail.mentor.role}</p>
                                        <p className="text-xs font-bold text-amber-600 mt-0.5 flex items-center gap-1">
                                            <Star size={11} className="fill-current" /> {detail.mentor.rating}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {!isMentor && (
                                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-sky-50 border border-sky-100 text-sky-800 text-sm font-bold">
                                    <Sparkles size={18} /> Lộ trình hệ thống SkillSync — học linh hoạt, không gắn mentor cố định.
                                </div>
                            )}

                            <div className="flex flex-wrap gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handlePrimaryCta}
                                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 flex items-center gap-2"
                                >
                                    {enrolled ? (
                                        <>
                                            <Play size={16} className="fill-current" /> Tiếp tục học
                                        </>
                                    ) : (
                                        <>
                                            <GraduationCap size={16} /> Đăng ký học
                                        </>
                                    )}
                                </button>
                                {detail.previewAvailable && (
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-800 font-bold text-sm hover:border-indigo-300 hover:text-indigo-700 flex items-center gap-2"
                                    >
                                        <Play size={16} /> Xem trước
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* B. Overview */}
                    <section className="space-y-6">
                        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                            <ListChecks className="text-indigo-600" size={22} /> Tổng quan
                        </h2>
                        <div className="prose prose-slate prose-sm max-w-none">
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{detail.description}</p>
                        </div>
                        {detail.learningOutcomes?.length > 0 && (
                            <div>
                                <h3 className="text-sm font-extrabold text-slate-800 mb-2">Mục tiêu đầu ra</h3>
                                <ul className="space-y-2">
                                    {detail.learningOutcomes.map((t, i) => (
                                        <li key={i} className="flex gap-2 text-sm text-slate-600">
                                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                            {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {detail.whoShouldJoin && (
                            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
                                <h3 className="text-sm font-extrabold text-slate-800 mb-2">Ai nên học path này?</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{detail.whoShouldJoin}</p>
                            </div>
                        )}
                        {detail.prerequisites && (
                            <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5">
                                <h3 className="text-sm font-extrabold text-amber-900 mb-2">Yêu cầu đầu vào</h3>
                                <p className="text-sm text-amber-900/90">{detail.prerequisites}</p>
                            </div>
                        )}
                    </section>

                    {/* C. Curriculum */}
                    <section id="curriculum" className="scroll-mt-24">
                        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 mb-4">
                            <Layers className="text-indigo-600" size={22} /> Chương trình học
                        </h2>
                        <p className="text-sm text-slate-500 mb-4">
                            {enrolled
                                ? 'Chi tiết bài học sẽ mở đầy đủ trong màn học.'
                                : 'Xem trước tên bài; nội dung chi tiết hiển thị sau khi đăng ký.'}
                        </p>
                        <div className="space-y-2">
                            {detail.modules?.map((mod, idx) => {
                                const open = openIdx === idx;
                                return (
                                    <div
                                        key={mod.order}
                                        className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenIdx(open ? -1 : idx)}
                                            className="w-full flex items-start gap-3 p-4 text-left hover:bg-slate-50/80 transition-colors"
                                        >
                                            <span className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-black text-sm flex items-center justify-center shrink-0">
                                                {mod.order}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-slate-900">{mod.title}</p>
                                                <p className="text-xs text-slate-500 mt-1">{moduleSummaryLine(mod)}</p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    Video ~{formatMinutes(mod.totalVideoMinutes)}
                                                </p>
                                            </div>
                                            <ChevronDown
                                                size={20}
                                                className={`text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                        {open && (
                                            <div className="px-4 pb-4 pt-0 border-t border-slate-100">
                                                <p className="text-sm text-slate-600 py-3">{mod.description}</p>
                                                {!enrolled && mod.lessonTitlesPreview?.length > 0 && (
                                                    <div>
                                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                                            Xem trước tên bài
                                                        </p>
                                                        <ul className="space-y-1">
                                                            {mod.lessonTitlesPreview.map((t, j) => (
                                                                <li key={j} className="text-sm text-slate-700 flex gap-2">
                                                                    <span className="text-indigo-400">▹</span> {t}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* D. Mentor */}
                    {isMentor && detail.mentor && (
                        <section>
                            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 mb-4">
                                <Users className="text-violet-600" size={22} /> Mentor
                            </h2>
                            <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
                                <div
                                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${detail.mentor.avatarGrad || 'from-violet-500 to-indigo-500'} text-white text-2xl font-extrabold flex items-center justify-center shrink-0 shadow-lg`}
                                >
                                    {detail.mentor.avatarText}
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                                            {detail.mentor.name}
                                            {detail.mentor.verified && <BadgeCheck className="text-emerald-500" size={20} />}
                                        </h3>
                                        <p className="text-slate-500 text-sm">{detail.mentor.role}</p>
                                    </div>
                                    {detail.mentor.bio && (
                                        <p className="text-sm text-slate-600 leading-relaxed">{detail.mentor.bio}</p>
                                    )}
                                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                                        <span className="px-2.5 py-1 rounded-full bg-white border border-violet-200 text-violet-800">
                                            Kỹ năng dạy: {detail.mentor.teachingSkillName || detail.skill}
                                        </span>
                                        <span className="px-2.5 py-1 rounded-full bg-white border border-violet-200 text-violet-800">
                                            Trình độ: {LEVEL_LABEL[detail.mentor.teachingSkillLevel] || detail.mentor.teachingSkillLevel}
                                        </span>
                                        {detail.mentor.creditsPerHour != null && (
                                            <span className="px-2.5 py-1 rounded-full bg-white border border-amber-200 text-amber-800">
                                                ~{detail.mentor.creditsPerHour} credits/giờ (tham khảo)
                                            </span>
                                        )}
                                        <span className="px-2.5 py-1 rounded-full bg-white border border-amber-200 text-amber-800 flex items-center gap-1">
                                            <Star size={12} className="fill-current" /> {detail.mentor.rating} từ đánh giá
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* E. FAQ */}
                    <section>
                        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 mb-4">
                            <HelpCircle className="text-indigo-600" size={22} /> FAQ & chính sách
                        </h2>
                        <div className="space-y-3">
                            {FAQ_ITEMS.map((item, i) => (
                                <div key={i} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                                    <p className="font-bold text-slate-900 text-sm mb-2 flex items-start gap-2">
                                        <Shield size={16} className="text-slate-400 shrink-0 mt-0.5" />
                                        {item.q}
                                    </p>
                                    <p className="text-sm text-slate-600 leading-relaxed pl-6">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* F. Sticky panel */}
                <aside className="lg:col-span-1 mt-10 lg:mt-0">
                    <div className="lg:sticky lg:top-24 rounded-2xl border border-slate-200 bg-white shadow-lg p-5 space-y-4">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <Map size={14} /> Tóm tắt
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Giá</span>
                                <span className="font-black text-amber-600">
                                    {cost > 0 ? `${cost} credits` : 'Miễn phí'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Thời lượng</span>
                                <span className="font-semibold text-slate-800">{detail.duration}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Số module</span>
                                <span className="font-semibold text-slate-800">{detail.totalModules}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Loại</span>
                                <span className="font-semibold text-slate-800">
                                    {isMentor ? 'Mentor-guided' : 'System Path'}
                                </span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handlePrimaryCta}
                            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
                        >
                            {enrolled ? (
                                <>
                                    <Play size={16} className="fill-current" /> Tiếp tục học
                                </>
                            ) : (
                                <>
                                    <GraduationCap size={16} /> Đăng ký học
                                </>
                            )}
                        </button>
                    </div>
                </aside>
            </div>

            <EnrollmentModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                detail={detail}
                balance={balance}
                onConfirm={handleEnrollConfirm}
                submitting={submitting}
            />
        </div>
    );
}
