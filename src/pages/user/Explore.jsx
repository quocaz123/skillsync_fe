import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../../store';
import * as sessionService from '../../services/sessionService';
import { getAllSkills, getExploreTeachingSkills } from '../../services/skillService';
import { getMyProfile } from '../../services/userService';
import {
    MagnifyingGlass, Star, Sparkle, ArrowLeft, ChatCircle,
    Shield, Check, CalendarCheck, Lightning,
    Medal, Certificate, VideoCamera, LinkedinLogo,
    GraduationCap, FolderOpen, SealCheck,
    CalendarBlank, Clock, ChartBar, CheckCircle, Warning
} from '@phosphor-icons/react';
// trackAction import removed
import { mapSkillToMentor } from '../../utils/mapperUtils';
import { toastError, toastSuccess } from "../../utils/toastUtils";

const DATES = ['T2 10/3', 'T3 11/3', 'T4 12/3', 'T5 13/3', 'T6 14/3'];
const TIMES = ['8:00 SA', '9:00 SA', '10:00 SA', '14:00 CH', '15:00 CH', '16:00 CH', '19:00 CH', '20:00 CH'];

import Avatar from '../../components/common/Avatar';

// ─── Evidence chips ──────────────────────────────────────────────────────
const EvidenceIcon = ({ type }) => {
    const map = {
        video: <VideoCamera size={12} weight="fill" className="text-blue-500" />,
        linkedin: <LinkedinLogo size={12} weight="fill" className="text-blue-700" />,
        cert: <Certificate size={12} weight="fill" className="text-violet-500" />,
        event: <GraduationCap size={12} weight="fill" className="text-teal-500" />,
        link: <FolderOpen size={12} weight="fill" className="text-orange-500" />,
        badge: <Medal size={12} weight="fill" className="text-amber-500" />,
        veteran: <SealCheck size={12} weight="fill" className="text-emerald-500" />,
        top: <Star size={12} weight="fill" className="text-yellow-500" />,
    };
    return map[type] || <Check size={12} weight="bold" className="text-slate-400" />;
};

// ─── TAB: Giới thiệu ─────────────────────────────────────────────────────
const TabIntro = ({ mentor }) => (
    <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-extrabold text-slate-900 text-base mb-3">Về tôi</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
                {mentor.bioFull || <span className="italic text-slate-300">Chưa có mô tả giới thiệu.</span>}
            </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-extrabold text-slate-900 text-base mb-4 flex items-center gap-2">
                Tôi sẽ dạy bạn
            </h3>
            {mentor.outcomes.length > 0 ? (
                <div className="space-y-2.5">
                    {mentor.outcomes.map((o, i) => (
                        <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                            <CheckCircle size={16} weight="fill" className="text-violet-500 shrink-0" />
                            <span className="text-sm text-slate-700 font-medium">{o}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-slate-300 italic">Người dạy chưa điền mục tiêu học.</p>
            )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-extrabold text-slate-900 text-base mb-3 flex items-center gap-2">
                🌀 Phong cách dạy
            </h3>
            {mentor.teachingStyle ? (
                <p className="text-sm text-slate-500 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100 italic">
                    {mentor.teachingStyle}
                </p>
            ) : (
                <p className="text-sm text-slate-300 italic bg-slate-50 rounded-xl p-4 border border-slate-100">
                    Người dạy chưa mô tả phong cách giảng dạy.
                </p>
            )}
        </div>
    </div>
);

// ─── TAB: Bằng chứng năng lực ────────────────────────────────────────────
const TabCredentials = ({ mentor }) => (
    <div className="space-y-5">
        {/* Trust Score */}
        {mentor.evidences.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-extrabold text-slate-900 text-sm mb-1 flex items-center gap-2">
                Tổng quan xác minh
            </h3>
            <p className="text-xs text-slate-400 mb-4">Danh sách các bằng chứng đã được thêm vào hồ sơ</p>

            {/* Badge grid */}
            <div className="grid grid-cols-2 gap-2 mt-3">
                {mentor.evidences.map((e, i) => (
                    <div key={i} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold ${e.verified ? 'bg-white border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                        <EvidenceIcon type={e.type} />
                        <span className="truncate">{e.label}</span>
                        {e.verified && <Check size={11} weight="bold" className="text-emerald-500 ml-auto shrink-0" />}
                    </div>
                ))}
            </div>
        </div>
        )}

        {/* Certs */}
        {mentor.certs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center gap-2">
                Bằng cấp & Chứng chỉ
            </h3>
            <div className="space-y-3">
                {mentor.certs.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-800 text-sm">{c.title}</p>
                            <p className="text-xs text-slate-400">{c.description}</p>
                        </div>
                        {c.isVerified && (
                            <span className="text-[11px] font-bold px-2 py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-lg shrink-0 flex items-center gap-1">
                                <Check size={10} weight="bold" /> đã xác minh
                            </span>
                        )}
                        {/* Lazy load strategy */}
                        {c.externalUrl ? (
                            <a href={c.externalUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-violet-600 hover:underline px-3 py-1.5 bg-violet-50 rounded-lg whitespace-nowrap">Xem chi tiết</a>
                        ) : c.fileUrl ? (
                            <a href={c.fileUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-violet-600 hover:underline px-3 py-1.5 bg-violet-50 rounded-lg whitespace-nowrap">Xem đính kèm</a>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
        )}

        {/* Portfolio */}
        {mentor.portfolio.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h3 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center gap-2">
                    Portfolio & Bằng chứng thực tế
                </h3>
                <div className="space-y-2.5">
                    {mentor.portfolio.map((p, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-violet-200 transition-colors">
                            <FolderOpen size={16} weight="duotone" className="text-violet-400 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-700">{p.title}</p>
                                <p className="text-[11px] text-slate-400">{p.description}</p>
                            </div>
                            {/* Lazy load strategy */}
                            {p.externalUrl ? (
                                <a href={p.externalUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-violet-600 hover:underline px-3 py-1.5 bg-violet-50 rounded-lg break-keep whitespace-nowrap">Kiểm chứng</a>
                            ) : p.fileUrl ? (
                                <a href={p.fileUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-violet-600 hover:underline px-3 py-1.5 bg-violet-50 rounded-lg break-keep whitespace-nowrap">Xem tài liệu</a>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Reviews preview */}
        {mentor.reviews.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center gap-2">
                Kết quả học viên thực tế
            </h3>
            <p className="text-xs text-slate-400 mb-3">Đánh giá từ học viên thực sự đã học</p>
            <div className="space-y-3">
                {mentor.reviews.slice(0, 2).map((r, i) => (
                    <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <div className={`w-8 h-8 ${r.color} text-white rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0`}>{r.initials}</div>
                        <div>
                            <p className="text-xs font-bold text-slate-700">{r.name}</p>
                            <p className="text-[11px] text-slate-400 italic mb-1">"{r.comment}"</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        )}
        {mentor.reviews.length === 0 && mentor.portfolio.length === 0 && mentor.certs.length === 0 && (
            <p className="text-center text-sm text-slate-400 py-10">Người dùng chưa thêm bằng chứng năng lực nào.</p>
        )}
    </div>
);

// ─── TAB: Lịch trống ─────────────────────────────────────────────────────
const TabSchedule = ({ mentor, onBook, isOwner }) => (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 className="font-extrabold text-slate-900 text-base mb-1 flex items-center gap-2">
            📅 Lịch rảnh hiện có
        </h3>
        <p className="text-xs text-slate-400 mb-5">Người dạy tự đặt các slot này. Chỉ đặt được vào slot <span className="text-emerald-600 font-semibold">● Trống</span>.</p>

        {mentor.availableSlots.length > 0 ? (
            <>
                <div className="flex flex-wrap gap-3 mb-6">
                    {mentor.availableSlots.map((sl, i) => (
                        <div key={i} className="min-w-[120px] rounded-xl border-2 border-teal-200 bg-teal-50 px-4 py-4 text-center">
                            <p className="font-extrabold text-slate-800 text-sm mb-0.5">{sl.day}</p>
                            <p className="text-xs text-slate-500 mb-1 flex items-center justify-center gap-1">
                                <Clock size={11} weight="regular" /> {sl.time}
                            </p>
                            <span className="text-[11px] font-bold text-emerald-600 mb-2 block">● Trống</span>
                            <div className="text-[11px] font-extrabold text-amber-600 flex items-center justify-center gap-1 bg-white rounded-lg py-1 border border-teal-100 mt-auto">
                                <Lightning size={11} weight="fill" className="text-amber-400" /> {sl.creditCost ?? mentor.price} credits
                            </div>
                        </div>
                    ))}
                </div>
                {!isOwner && (
                    <button
                        onClick={onBook}
                        className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md shadow-violet-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <CalendarCheck size={18} weight="duotone" /> Đặt lịch ngay ({mentor.availableSlots.length} slot trống)
                    </button>
                )}
            </>
        ) : (
            <div className="text-center py-10 text-slate-400">
                <CalendarBlank size={36} weight="duotone" className="mx-auto mb-3 text-slate-300" />
                <p className="font-semibold">Không có slot trống trong tuần này</p>
                <p className="text-xs mt-1">Nhắn tin hỏi giáo viên để sắp xếp lịch riêng</p>
            </div>
        )}
    </div>
);

// ─── TAB: Đánh giá ───────────────────────────────────────────────────────
const TabReviews = ({ mentor }) => {
    const ratingDist = useMemo(() => {
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        mentor.reviews.forEach(r => {
            const star = Math.round(r.rating);
            if (counts[star] !== undefined) counts[star]++;
        });
        const total = mentor.reviews.length || 1;
        return [5, 4, 3, 2, 1].map(star => ({
            star,
            pct: Math.round((counts[star] / total) * 100)
        }));
    }, [mentor.reviews]);
    return (
        <div className="space-y-5">
            {/* Rating overview */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-start gap-6">
                    {/* Big number */}
                    <div className="text-center shrink-0">
                        <p className="text-5xl font-extrabold text-slate-900">{mentor.rating}</p>
                        <div className="flex items-center gap-0.5 justify-center my-1.5">
                            {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} size={14} weight="fill" className="text-amber-400" />
                            ))}
                        </div>
                        <p className="text-xs text-slate-400">{mentor.totalReviews} đánh giá</p>
                    </div>
                    {/* Bar chart */}
                    <div className="flex-1 space-y-2">
                        {ratingDist.map(r => (
                            <div key={r.star} className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500 w-3 shrink-0">{r.star}</span>
                                <Star size={11} weight="fill" className="text-amber-400 shrink-0" />
                                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${r.pct}%` }} />
                                </div>
                                <span className="text-[11px] text-slate-400 w-8 text-right shrink-0">{r.pct}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Review cards */}
            <div className="space-y-3">
                {mentor.reviews.map((r, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-9 h-9 ${r.color} text-white rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 rounded-full`}>
                                {r.avatar ? <img src={r.avatar} alt="avatar" className="w-full h-full object-cover rounded-full"/> : r.initials}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-sm">{r.name}</p>
                                <p className="text-[11px] text-slate-400">{new Date(r.date).toLocaleDateString('vi-VN')} ✓</p>
                            </div>
                            <div className="ml-auto flex gap-0.5">
                                {[...Array(r.rating || 5)].map((_, j) => (
                                    <Star key={j} size={13} weight="fill" className="text-amber-400" />
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">"{r.comment}"</p>
                    </div>
                ))}
                {mentor.reviews.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-sm text-slate-500 font-medium">Chưa có đánh giá nào.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Detail Tabs ─────────────────────────────────────────────────────────
const DETAIL_TABS = [
    { id: 'intro', label: 'Giới thiệu', emoji: '👤' },
    { id: 'creds', label: 'Bằng chứng năng lực', emoji: '🏅' },
    { id: 'schedule', label: 'Lịch trống', emoji: '📅' },
    { id: 'reviews', label: 'Đánh giá', emoji: '⭐' },
];

// ─── Main Explore Component ──────────────────────────────────────────────

const Explore = () => {
    const { credits, user, syncCredits } = useStore();
    const location = useLocation();
    const currentUserId = user?.id ?? null;
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedQ, setDebouncedQ] = useState('');
    const [mentors, setMentors] = useState([]);
    const [loadingMentors, setLoadingMentors] = useState(true);
    const [explorePage, setExplorePage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [availableSkills, setAvailableSkills] = useState([]);
    const [activeSkillId, setActiveSkillId] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    const [selectedMentor, setSelectedMentor] = useState(null);
    const [activeTab, setActiveTab] = useState('intro');
    const [bookingStep, setBookingStep] = useState(0);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedSlotId, setSelectedSlotId] = useState('');
    const [selectedSlotCost, setSelectedSlotCost] = useState(0);
    const [note, setNote] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [isProposing, setIsProposing] = useState(false);
    const [proposeDate, setProposeDate] = useState('');
    const [proposeTime, setProposeTime] = useState('');
    const [proposeEndTime, setProposeEndTime] = useState('');

    useEffect(() => {
        const t = setTimeout(() => setDebouncedQ(searchTerm.trim()), 400);
        return () => clearTimeout(t);
    }, [searchTerm]);

    const mapSortToApi = (sb) => {
        switch (sb) {
            case 'experience': return 'experience';
            case 'credits_asc': return 'credits_asc';
            case 'credits_desc': return 'credits_desc';
            case 'newest':
            default:
                return 'newest';
        }
    };

    const apiSort = mapSortToApi(sortBy);

    const loadExplore = useCallback(async (page = 0, append = false) => {
        setLoadingMentors(true);
        try {
            const params = {
                page,
                size: 24,
                sort: apiSort,
                ...(debouncedQ ? { q: debouncedQ } : {}),
                ...(activeSkillId !== 'all' ? { skillId: activeSkillId } : {}),
            };
            const pr = await getExploreTeachingSkills(params);
            const rows = Array.isArray(pr?.data) ? pr.data : [];
            const mapped = rows.map(mapSkillToMentor);
            if (append) {
                setMentors(prev => [...prev, ...mapped]);
            } else {
                setMentors(mapped);
            }
            setExplorePage(pr?.currentPage ?? page);
            setTotalPages(pr?.totalPages ?? 0);
        } catch (err) {
            console.error('Lỗi lấy danh sách khám phá:', err);
            if (!append) {
                setMentors([]);
                setTotalPages(0);
            }
        } finally {
            setLoadingMentors(false);
        }
    }, [debouncedQ, activeSkillId, apiSort]);

    useEffect(() => {
        loadExplore(0, false);
    }, [loadExplore]);

    // ── Auto-open từ AI Chat Bubble ──────────────────────────────────────────
    // Khi navigate từ AiChatBubble với state { openMentorId }, tìm mentor
    // trong danh sách đã fetch và mở trang chi tiết ngay lập tức.
    useEffect(() => {
        const targetId = location.state?.openMentorId;
        if (!targetId || loadingMentors || mentors.length === 0) return;

        // AI trả về mentorId = User UUID của teacher → map sang m.teacherId trong Explore
        // m.id là TeachingSkill ID (khác), m.teacherId mới là teacher's user UUID
        const found = mentors.find(m => String(m.teacherId) === String(targetId));
        if (found) {
            setSelectedMentor(found);
            setBookingStep(0);
            setActiveTab('intro');
            // Xoá state khỏi history để không bị re-trigger khi navigate lại
            window.history.replaceState({}, '');
        }
    }, [location.state, mentors, loadingMentors]);

    // Tải danh mục skill sau (idle / micro-delay) để ưu tiên request Explore — cảm nhận tải nhanh hơn.
    useEffect(() => {
        const loadSkills = async () => {
            try {
                const data = await getAllSkills();
                setAvailableSkills(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Lỗi lấy danh sách skills:', err);
            }
        };
        if (typeof requestIdleCallback !== 'undefined') {
            const id = requestIdleCallback(() => { loadSkills(); }, { timeout: 2500 });
            return () => cancelIdleCallback(id);
        }
        const t = setTimeout(loadSkills, 1);
        return () => clearTimeout(t);
    }, []);

    // Fetch lịch trống khi click vào mentor
    useEffect(() => {
        if (!selectedMentor) return;
        const loadSlots = async () => {
            try {
                const slots = await sessionService.getOpenSlotsBySkill(selectedMentor.id);
                // Map API slots to { day, time, status, id }
                // Backend trả về: [{ id, slotDate, slotTime, status }]
                const mappedSlots = slots.map(s => {
                    const d = new Date(s.slotDate);
                    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
                    return {
                        id: s.id,
                        day: `${days[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`,
                        time: s.slotTime.slice(0, 5),
                        creditCost: s.creditCost ?? selectedMentor?.price ?? 0,
                        status: 'open',
                        rawDate: s.slotDate
                    };
                });
                setSelectedMentor(prev => ({ ...prev, availableSlots: mappedSlots, slots: mappedSlots.length }));
            } catch (err) {
                console.error("Lỗi lấy slots của mentor", err);
            }
        };
        loadSlots();
    }, [selectedMentor?.id]);


    /** Sắp xếp được phụ trách 100% bởi backend */
    const displayMentors = mentors;

    const resetAll = () => {
        setSelectedMentor(null);
        setBookingStep(0);
        setActiveTab('intro');
        setSelectedDate('');
        setSelectedTime('');
        setSelectedSlotId('');
        setSelectedSlotCost(0);
        setNote('');
        setIsProposing(false);
        setProposeDate('');
        setProposeTime('');
        setProposeEndTime('');
    };

    const handleConfirmBooking = async () => {
        const slotPrice = selectedSlotCost || selectedMentor.price || 0;
        if (credits < slotPrice) return;
        setBookingLoading(true);
        try {
            if (isProposing || selectedSlotId === 'PROPOSE') {
                if (!proposeDate || !proposeTime || !proposeEndTime) {
                    toastError("Vui lòng chọn đầy đủ ngày, giờ bắt đầu và giờ kết thúc!");
                    setBookingLoading(false);
                    return;
                }
                await sessionService.proposeSession(selectedMentor.id, proposeDate, proposeTime, proposeEndTime, note);
            } else {
                await sessionService.bookSession(selectedSlotId, note);
            }
            toastSuccess("Đã gửi yêu cầu đặt lịch. Vui lòng chờ mentor xác nhận.");
            setBookingStep(3);
            // Sync updated credits from server
            try {
                const freshUser = await getMyProfile();
                if (freshUser?.creditsBalance != null) syncCredits(freshUser.creditsBalance);
            } catch (err) {
                console.error('Lỗi sync credits sau booking:', err);
            }
        } catch (error) {
            console.error('Lỗi khi book session:', error);
            toastError(error, "Lỗi đặt lịch. Vui lòng thử lại.");
        } finally {
            setBookingLoading(false);
        }
    };

    // ─── DETAIL VIEW ────────────────────────────────────────────────────
    if (selectedMentor && bookingStep === 0) {
        const m = selectedMentor;
        const tabCount = m.reviews?.length ?? 0;
        const isOwner = currentUserId && currentUserId === m.teacherId;

        return (
            <div className="max-w-5xl mx-auto font-sans pb-14">
                {/* Back */}
                <button onClick={resetAll} className="flex items-center gap-2 text-slate-500 hover:text-violet-600 font-semibold mb-6 text-sm transition-colors">
                    <ArrowLeft size={16} weight="bold" /> Quay lại Khám phá
                </button>

                {/* ─── Hero Header Card ─────────────────────────── */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
                    <div className="flex flex-col sm:flex-row items-start gap-5">
                        {/* Avatar */}
                        <Avatar
                            src={m.avatarUrl}
                            fallback={m.avatar}
                            fallbackBg={m.avatarBg}
                            size="w-20 h-20"
                            textSize="text-3xl"
                            rounded="rounded-2xl"
                        />
                        <div className="flex-1 min-w-0">
                            {/* Name + badges */}
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h1 className="text-2xl font-extrabold text-slate-900">{m.name}</h1>
                                {m.isTopRated && <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200">Top Rated</span>}
                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> {m.slots} slot
                                </span>
                            </div>
                            <p className="text-slate-500 text-sm font-medium mb-2 flex items-center gap-1">
                                <GraduationCap size={14} weight="duotone" className="text-violet-400" /> {m.skill}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {m.subSkills.map(s => (
                                    <span key={s} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-5 pt-5 border-t border-slate-100">
                        {[
                            { icon: Star, label: 'Đánh giá', value: m.rating, iconCls: 'text-amber-400' },
                            { icon: ChartBar, label: 'Buổi đã dạy', value: m.totalSessions, iconCls: 'text-violet-500' },
                            { icon: Clock, label: 'Phản hồi', value: m.responseTime, iconCls: 'text-sky-500' },
                            { icon: CalendarCheck, label: 'Còn trống', value: `${m.slots} slot`, iconCls: 'text-emerald-500' },

                        ].map((s, i) => (
                            <div key={i} className="text-center">
                                <div className="flex items-center justify-center gap-1 font-extrabold text-slate-900">
                                    <s.icon size={14} weight={i === 0 ? 'fill' : 'duotone'} className={s.iconCls} />
                                    <span>{s.value}</span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-5 items-start">
                    {/* ─── Left: Tabs ────────────────────────────── */}
                    <div className="flex-1 space-y-4 min-w-0">
                        {/* Tab bar */}
                        <div className="flex items-center gap-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-1.5 overflow-x-auto">
                            {DETAIL_TABS.map(tab => {
                                const active = activeTab === tab.id;
                                const label = tab.id === 'reviews' ? `${tab.emoji} ${tab.label} (${tabCount})` : `${tab.emoji} ${tab.label}`;
                                return (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${active ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
                                        {label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab content */}
                        {activeTab === 'intro' && <TabIntro mentor={m} />}
                        {activeTab === 'creds' && <TabCredentials mentor={m} />}
                        {activeTab === 'schedule' && <TabSchedule mentor={m} onBook={() => setBookingStep(1)} isOwner={isOwner} />}
                        {activeTab === 'reviews' && <TabReviews mentor={m} />}
                    </div>

                    {/* ─── Right: Booking Widget ────────────────── */}
                    <div className="lg:w-72 shrink-0 space-y-4" style={{ position: 'sticky', top: '1rem' }}>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            {/* Price */}
                            <div className="flex items-baseline gap-1 mb-1">
                                <Lightning size={20} weight="fill" className="text-amber-400" />
                                <span className="text-2xl font-extrabold text-violet-600">{m.price}</span>
                                <span className="text-sm text-slate-500 font-bold">credits/giờ</span>
                            </div>
                            <p className="text-xs text-slate-400 mb-4">Số dư của bạn: <span className="font-bold text-slate-700">⚡ {credits}</span></p>

                            {/* Slots */}
                            {m.availableSlots.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-xs font-bold text-emerald-600 mb-2">● {m.slots} slot đang trống</p>
                                    <p className="text-[11px] text-slate-400">
                                        Sớm nhất: {m.availableSlots[0].day} · {m.availableSlots[0].time}
                                    </p>
                                </div>
                            )}

                            {currentUserId && currentUserId === m.teacherId ? (
                                <div className="w-full py-3 bg-slate-100 text-slate-500 font-bold rounded-xl text-sm text-center mb-2.5 flex items-center justify-center gap-2">
                                    🎓 Đây là kỹ năng của bạn
                                </div>
                            ) : (
                                <button
                                    onClick={() => setBookingStep(1)}
                                    className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md shadow-violet-100 active:scale-95 transition-all mb-2.5 flex items-center justify-center gap-2 text-sm"
                                >
                                    <CalendarCheck size={16} weight="duotone" /> Chọn slot & Đặt lịch
                                </button>
                            )}
                            {/* <button className="w-full py-3 border-2 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2">
                                <ChatCircle size={16} weight="duotone" /> Nhắn tin trước
                            </button> */}
                        </div>

                        {/* Credentials sidebar */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <p className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
                                <Medal size={14} weight="duotone" className="text-amber-500" /> Bằng chứng năng lực
                            </p>
                            <ul className="space-y-1.5 text-xs text-slate-600">
                                {m.certs.map((c, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <Check size={11} weight="bold" className="text-emerald-500 shrink-0" />
                                        {c.name} <span className="text-slate-400 truncate text-[10px]">xác nhận công việc</span>
                                    </li>
                                ))}
                                <li className="flex items-center gap-2">
                                    <Check size={11} weight="bold" className="text-emerald-500 shrink-0" />
                                    2 chứng chỉ đã xác minh
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check size={11} weight="bold" className="text-emerald-500 shrink-0" />
                                    2 portfolio/project công khai
                                </li>
                            </ul>
                        </div>

                        {/* Quality guarantee */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield size={16} weight="duotone" className="text-emerald-500" />
                                <p className="text-xs font-bold text-slate-700">Thanh toán an toàn (Tạm giữ)</p>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">Credits được giữ an toàn. Chỉ chuyển cho mentor khi bạn bấm "Hoàn thành buổi học".</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ─── BOOKING FLOW (steps 1-3) ──────────────────────────────────────
    if (selectedMentor && bookingStep >= 1) {
        const m = selectedMentor;
        return (
            <div className="max-w-5xl mx-auto font-sans pb-14">
                {bookingStep < 3 && (
                    <button onClick={() => bookingStep === 1 ? setBookingStep(0) : setBookingStep(bookingStep - 1)} className="flex items-center gap-2 text-slate-500 hover:text-violet-600 font-semibold mb-6 text-sm transition-colors">
                        <ArrowLeft size={16} weight="bold" /> Quay lại
                    </button>
                )}

                {/* Stepper */}
                {bookingStep < 3 && (
                    <div className="flex justify-center items-center mb-10">
                        {['Chọn lịch', 'Xác nhận', 'Hoàn tất'].map((label, i) => {
                            const sn = i + 1;
                            const isActive = bookingStep === sn;
                            const isPast = bookingStep > sn;
                            return (
                                <div key={label} className="flex items-center">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${(isActive || isPast) ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                                            {isPast ? <Check size={16} weight="bold" /> : sn}
                                        </div>
                                        <span className={`text-xs mt-1 font-bold ${(isActive || isPast) ? 'text-violet-600' : 'text-slate-400'}`}>{label}</span>
                                    </div>
                                    {i < 2 && <div className={`h-1 w-20 mx-3 mb-4 rounded-full ${isPast ? 'bg-violet-500' : 'bg-slate-200'}`} />}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Step 1: Schedule picker */}
                {bookingStep === 1 && (
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
                            <h2 className="text-xl font-extrabold text-slate-900 mb-5">Chọn lịch học trống</h2>
                            {m.availableSlots.length > 0 ? (
                                <div>
                                    <div className="flex flex-wrap gap-3 mb-8">
                                        {m.availableSlots.map(sl => (
                                            <button key={sl.id} onClick={() => { setSelectedDate(sl.day); setSelectedTime(sl.time); setSelectedSlotId(sl.id); setSelectedSlotCost(sl.creditCost ?? m.price ?? 0); setIsProposing(false); }}
                                                className={`px-5 py-3.5 rounded-xl text-sm font-bold border-2 transition-all active:scale-95 text-left ${selectedSlotId === sl.id ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-100 text-slate-600 hover:border-slate-200'}`}>
                                                <p className="font-extrabold text-base mb-1">{sl.day}</p>
                                                <p className="flex items-center gap-1 text-xs opacity-90 font-semibold mt-1">
                                                    <Clock size={13} weight="bold" /> {sl.time}
                                                </p>
                                                <p className="flex items-center gap-1 text-[11px] font-extrabold text-amber-600 mt-1.5">
                                                    <Lightning size={11} weight="fill" className="text-amber-400" /> {sl.creditCost ?? m.price} credits
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between mb-8">
                                        <span className="text-sm text-slate-500">Giờ không phù hợp?</span>
                                        <button onClick={() => { setIsProposing(true); setSelectedSlotId('PROPOSE'); setSelectedDate(proposeDate); setSelectedTime(proposeTime); setSelectedSlotCost(m.price); }} className="text-violet-600 font-bold text-sm hover:underline">
                                           Đề xuất lịch riêng
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-violet-50 border border-violet-100 rounded-xl p-6 mb-8">
                                    <p className="font-bold text-violet-800 mb-2">Đề xuất khung giờ của bạn 🕒</p>
                                    <p className="text-xs text-violet-600 mb-4">Mentor này chưa thiết lập sẵn slot rảnh. Bạn có thể chủ động đề xuất ngày giờ phù hợp, hệ thống sẽ gửi yêu cầu duyệt đến Mentor.</p>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                         <input type="date" value={proposeDate} min={new Date().toISOString().split("T")[0]} onChange={e => {setProposeDate(e.target.value); setSelectedDate(e.target.value); setSelectedSlotCost(m.price); setIsProposing(true); setSelectedSlotId('PROPOSE');}} className="flex-1 px-4 py-3 rounded-xl border border-violet-200 outline-none focus:border-violet-500 text-sm font-semibold text-slate-700 bg-white" placeholder="Ngày học" />
                                         <input type="time" title="Giờ bắt đầu" value={proposeTime} onChange={e => {setProposeTime(e.target.value); setSelectedTime(e.target.value); setSelectedSlotCost(m.price); setIsProposing(true); setSelectedSlotId('PROPOSE');}} className="flex-1 px-4 py-3 rounded-xl border border-violet-200 outline-none focus:border-violet-500 text-sm font-semibold text-slate-700 bg-white" />
                                         <input type="time" title="Giờ kết thúc" value={proposeEndTime} onChange={e => {setProposeEndTime(e.target.value); setIsProposing(true); setSelectedSlotId('PROPOSE');}} className="flex-1 px-4 py-3 rounded-xl border border-violet-200 outline-none focus:border-violet-500 text-sm font-semibold text-slate-700 bg-white" />
                                    </div>
                                </div>
                            )}

                            {isProposing && m.availableSlots.length > 0 && (
                                <div className="bg-violet-50 border border-violet-100 rounded-xl p-6 mb-8 mt-4">
                                    <p className="font-bold text-violet-800 mb-2">Đề xuất khung giờ của bạn 🕒</p>
                                    <p className="text-xs text-violet-600 mb-4">Chủ động đề xuất ngày giờ phù hợp ngoài các slot có sẵn.</p>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                         <input type="date" value={proposeDate} min={new Date().toISOString().split("T")[0]} onChange={e => {setProposeDate(e.target.value); setSelectedDate(e.target.value); setSelectedSlotCost(m.price); setIsProposing(true); setSelectedSlotId('PROPOSE');}} className="flex-1 px-4 py-3 rounded-xl border border-violet-200 outline-none focus:border-violet-500 text-sm font-semibold text-slate-700 bg-white" />
                                         <input type="time" title="Giờ bắt đầu" value={proposeTime} onChange={e => {setProposeTime(e.target.value); setSelectedTime(e.target.value); setSelectedSlotCost(m.price); setIsProposing(true); setSelectedSlotId('PROPOSE');}} className="flex-1 px-4 py-3 rounded-xl border border-violet-200 outline-none focus:border-violet-500 text-sm font-semibold text-slate-700 bg-white" />
                                         <input type="time" title="Giờ kết thúc" value={proposeEndTime} onChange={e => {setProposeEndTime(e.target.value); setIsProposing(true); setSelectedSlotId('PROPOSE');}} className="flex-1 px-4 py-3 rounded-xl border border-violet-200 outline-none focus:border-violet-500 text-sm font-semibold text-slate-700 bg-white" />
                                    </div>
                                </div>
                            )}
                            <h2 className="text-base font-extrabold text-slate-900 mb-3">Ghi chú (tùy chọn)</h2>
                            <textarea className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm outline-none focus:border-violet-400 focus:bg-white min-h-[100px] resize-none transition-all" placeholder="Bạn muốn tập trung vào điểm gì trong buổi học này?" value={note} onChange={e => setNote(e.target.value)} />
                        </div>

                        {/* Summary sidebar */}
                        <div className="lg:w-72 shrink-0" style={{ position: 'sticky', top: '1rem' }}>
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                <Avatar
                                        src={m.avatarUrl}
                                        fallback={m.avatar}
                                        fallbackBg={m.avatarBg}
                                        size="w-12 h-12"
                                        textSize="text-base"
                                        rounded="rounded-xl"
                                    />
                                    <div>
                                        <p className="font-extrabold text-slate-900 text-sm">{m.name}</p>
                                        <p className="text-xs text-slate-400">{m.skill}</p>
                                    </div>
                                </div>
                                <div className="space-y-2.5 text-sm">
                                    <div className="flex justify-between"><span className="text-slate-500">Ngày</span><span className={`font-bold ${selectedDate ? 'text-slate-800' : 'text-slate-300'}`}>{selectedDate || 'Chưa chọn'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Giờ</span><span className={`font-bold ${selectedTime ? 'text-slate-800' : 'text-slate-300'}`}>{selectedTime || 'Chưa chọn'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Tạm giữ</span><span className="font-extrabold text-amber-500">⚡ {selectedSlotCost || '—'} credits</span></div>
                                </div>
                                <div className="flex justify-between text-sm pt-3 border-t border-slate-100">
                                    <span className="text-slate-500">Dự kiến số dư</span>
                                    <span className={`font-extrabold ${selectedSlotCost ? (credits >= selectedSlotCost ? 'text-emerald-600' : 'text-red-500') : 'text-slate-400'}`}>⚡ {selectedSlotCost ? credits - selectedSlotCost : '—'}</span>
                                </div>
                                <button disabled={!selectedDate || !selectedTime || !selectedSlotId}
                                    onClick={() => setBookingStep(2)}
                                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${selectedDate && selectedTime && selectedSlotId ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                                    Tiếp theo →
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Confirm */}
                {bookingStep === 2 && (
                    <div className="max-w-lg mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-6 pb-4 border-b border-slate-100">Xác nhận đặt lịch</h2>
                        <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-4 mb-6 border border-slate-100">
                            <Avatar
                                src={m.avatarUrl}
                                fallback={m.avatar}
                                fallbackBg={m.avatarBg}
                                size="w-14 h-14"
                                textSize="text-xl"
                                rounded="rounded-xl"
                            />
                            <div>
                                <p className="font-extrabold text-slate-900">{m.name}</p>
                                <p className="text-sm text-slate-400">{m.skill}</p>
                                <p className="text-xs font-bold text-violet-600 mt-1">📅 {selectedDate} · ⏰ {selectedTime}</p>
                            </div>
                        </div>
                        <div className="space-y-3 mb-6 text-sm">
                            <div className="flex justify-between"><span className="text-slate-500">Credits hiện tại</span><span className="font-bold">⚡ {credits}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Sẽ đưa vào tạm giữ</span><span className="font-bold text-red-500">- ⚡ {selectedSlotCost}</span></div>
                            <div className="flex justify-between pt-3 border-t border-slate-100 text-base">
                                <span className="font-bold text-slate-700">Dự kiến còn lại</span>
                                <span className={`font-extrabold ${credits >= selectedSlotCost ? 'text-emerald-600' : 'text-red-500'}`}>⚡ {credits - selectedSlotCost}</span>
                            </div>
                        </div>
                        {credits < selectedSlotCost && (
                            <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700">
                                <Warning size={16} weight="duotone" className="shrink-0" /> Không đủ credits để đặt lịch này.
                            </div>
                        )}
                        <button disabled={credits < selectedSlotCost || bookingLoading} onClick={handleConfirmBooking}
                            className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-base ${credits >= selectedSlotCost && !bookingLoading ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-200 active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                            {bookingLoading ? (
                                <span className="flex items-center gap-2"><svg className="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Đang đặt lịch...</span>
                            ) : (
                                <><CheckCircle size={20} weight="duotone" /> Xác nhận đặt lịch</>
                            )}
                        </button>
                    </div>
                )}

                {/* Step 3: Success / Pending */}
                {bookingStep === 3 && (
                    <div className="max-w-lg mx-auto text-center mt-8">
                        <div className="text-6xl mb-4">⏳</div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Đã gửi Yêu cầu Đặt lịch!</h1>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
                            {isProposing || selectedSlotId === 'PROPOSE' ? (
                                <>
                                    Đề xuất lịch học với <b>{m.name}</b> vào <span className="font-bold text-violet-600">{selectedDate}</span> từ <span className="font-bold text-violet-600">{selectedTime}</span> đến <span className="font-bold text-violet-600">{proposeEndTime}</span> đã được ghi nhận. Vui lòng chờ Mentor Duyệt lịch.
                                </>
                            ) : (
                                <>
                                    Yêu cầu đăng ký slot học với <b>{m.name}</b> vào <span className="font-bold text-violet-600">{selectedDate}</span> lúc <span className="font-bold text-violet-600">{selectedTime}</span> đã được chuyển đi. Vui lòng chờ Mentor Duyệt lịch.
                                </>
                            )}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button onClick={() => window.location.href = '/app/sessions'} className="px-7 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 shadow-md shadow-violet-200 transition-all">
                                📅 Xem lịch học
                            </button>
                            <button onClick={resetAll} className="px-7 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all">
                                Về Khám phá
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ─── EXPLORE LIST VIEW ──────────────────────────────────────────────
    return (
        <div className="max-w-6xl mx-auto font-sans pb-12 space-y-8">
            {/* ── Tìm kiếm thủ công ───────────────────────────────────── */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <MagnifyingGlass size={18} weight="bold" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kỹ năng, tên người dạy..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:border-violet-300 focus:bg-white transition-all font-semibold"
                        />
                    </div>
                    <div className="relative shrink-0 sm:min-w-[200px]">
                        <button
                            onClick={() => setShowSortDropdown(!showSortDropdown)}
                            className="w-full px-5 py-3 flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-extrabold text-sm hover:border-slate-300 transition-colors"
                        >
                            <span className="flex items-center gap-2">
                                <span className="relative flex shrink-0 h-4 w-4">
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-pink-400 rounded-sm"></span>
                                    <span className="absolute top-0 left-0 w-2 h-2 bg-emerald-400 rounded-sm"></span>
                                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-sky-400 rounded-sm"></span>
                                    <span className="absolute bottom-0 left-0 w-2 h-2 bg-violet-400 rounded-sm"></span>
                                </span>
                                {sortBy === 'newest' && 'Mới nhất'}
                                {sortBy === 'experience' && 'Nhiều kinh nghiệm'}
                                {sortBy === 'credits_asc' && 'Credits tăng dần'}
                                {sortBy === 'credits_desc' && 'Credits giảm dần'}
                            </span>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`}>
                                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {showSortDropdown && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)}></div>
                                <div className="absolute right-0 top-full mt-2 w-full bg-white rounded-xl border border-slate-100 shadow-lg py-2 z-20 animate-in fade-in slide-in-from-top-2">
                                    {[
                                        { id: 'newest', label: 'Mới nhất' },
                                        { id: 'experience', label: 'Nhiều kinh nghiệm' },
                                        { id: 'credits_asc', label: 'Credits tăng dần' },
                                        { id: 'credits_desc', label: 'Credits giảm dần' },
                                    ].map(option => (
                                        <button
                                            key={option.id}
                                            onClick={() => { setSortBy(option.id); setShowSortDropdown(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 transition-colors ${sortBy === option.id ? 'text-violet-600 bg-violet-50' : 'text-slate-600'}`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex overflow-x-auto gap-2.5 pb-3 pt-1 -mx-2 px-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 transition-colors">
                    <button
                        onClick={() => setActiveSkillId('all')}
                        className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-all ${activeSkillId === 'all'
                            ? 'bg-indigo-50/50 text-indigo-600 border-indigo-200 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
                            }`}
                    >
                        Tất cả
                    </button>
                    {availableSkills.map(skill => (
                        <button
                            key={skill.id}
                            onClick={() => setActiveSkillId(skill.id)}
                            className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-all ${activeSkillId === skill.id
                                ? 'bg-indigo-50/50 text-indigo-600 border-indigo-200 shadow-sm'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
                                }`}
                        >
                            {skill.name}
                        </button>
                    ))}
                </div>
            </div>

            {loadingMentors && mentors.length === 0 && (
                <div className="text-center py-16 text-slate-400 font-semibold">Đang tải danh sách mentor…</div>
            )}
            {!loadingMentors && displayMentors.length === 0 && (
                <div className="text-center py-16 text-slate-500 font-medium">Không tìm thấy mentor phù hợp. Thử đổi từ khóa hoặc bộ lọc kỹ năng.</div>
            )}

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayMentors.map(mentor => {
                    return (
                        <div key={mentor.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group relative">
                            <div className="p-6 flex-1">
                                <div className="flex items-start justify-between mb-5">
                                    <Avatar
                                        src={mentor.avatarUrl}
                                        fallback={mentor.avatar}
                                        fallbackBg={mentor.avatarBg}
                                        size="w-14 h-14"
                                        textSize="text-xl"
                                        rounded="rounded-2xl"
                                    />
                                </div>
                                <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-violet-600 transition-colors mb-1">{mentor.name}</h3>
                                <p className="text-sm text-slate-500 mb-3">{mentor.subSkills.slice(0, 2).join(' · ')}</p>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                                    <span className="flex items-center gap-1"><Star size={11} weight="fill" className="text-amber-400" /> {mentor.rating}</span>
                                    <span>·</span>
                                    <span>{mentor.totalSessions} buổi</span>
                                    <span>·</span>
                                    <span className="text-emerald-600 font-semibold">{mentor.slots} slot trống</span>
                                </div>
                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 italic">"{mentor.bio}"</p>
                            </div>
                            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                <span className="font-extrabold text-slate-900 text-sm">⚡ {mentor.price} <span className="text-slate-400 font-normal">tin/giờ</span></span>
                                <button onClick={() => { setSelectedMentor(mentor); setBookingStep(0); setActiveTab('intro'); }}
                                    className="px-5 py-2.5 bg-slate-900 hover:bg-violet-600 text-white font-bold rounded-xl transition-all text-sm active:scale-95 shadow-sm">
                                    Xem hồ sơ
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {totalPages > 1 && explorePage < totalPages - 1 && (
                <div className="flex justify-center pt-2">
                    <button
                        type="button"
                        disabled={loadingMentors}
                        onClick={() => loadExplore(explorePage + 1, true)}
                        className="px-8 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-bold text-sm hover:border-violet-300 hover:bg-violet-50/50 transition-all disabled:opacity-50"
                    >
                        {loadingMentors ? 'Đang tải…' : 'Xem thêm mentor'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Explore;
