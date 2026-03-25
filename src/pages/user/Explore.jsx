import { useState } from 'react';
import { useStore } from '../../store';
import {
    MagnifyingGlass, Star, Sparkle, ArrowLeft, ChatCircle,
    Shield, Check, CalendarCheck, Lightning,
    Medal, Certificate, VideoCamera, LinkedinLogo,
    GraduationCap, FolderOpen, SealCheck,
    CalendarBlank, Clock, ChartBar, CheckCircle, Warning
} from '@phosphor-icons/react';
import { trackAction } from '../../services/missionService';

// ── Mock Data ─────────────────────────────────────────────
const MOCK_MENTORS = [
    {
        id: 'm1', name: 'Hà My', avatar: 'HM', avatarBg: 'bg-red-500',
        skill: 'Public Speaking', subSkills: ['Thuyết trình', 'Storytelling', 'Body Language'],
        level: 'Expert', rating: 5.0, totalReviews: 2, totalSessions: 64, responseTime: '<1h',
        price: 20, match: 98, slots: 3, trustScore: 100, isTopRated: true,
        bio: 'MC chuyên nghiệp, TEDx Speaker, đào tạo kỹ năng mềm 7 năm.',
        bioFull: 'MC chuyên nghiệp, TEDx Speaker, đào tạo kỹ năng mềm 7 năm. Đã từng nói sợ đám đông nhưng đã vượt qua và muốn giúp bạn làm điều tương tự.',
        teachingStyle: 'Practice makes perfect. 70% thời gian buổi học là bạn đứng trình bày, tôi phân tích và cho feedback cụ thể từng điểm. Không lý thuyết suông.',
        outcomes: [
            'Vượt qua nỗi sợ nói trước đám đông',
            'Kỹ thuật storytelling cuốn hút',
            'Body language và giọng nói chuyên nghiệp',
            'Chuẩn bị và thực hành thuyết trình thực tế',
        ],
        certs: [
            { name: 'TEDx Speaker', org: 'TEDx · Ho Chi Minh City · 2023', icon: '🎤', verified: true },
            { name: 'ICF Coaching', org: 'ICF · 2017', icon: '🏆', verified: true },
        ],
        evidences: [
            { type: 'video', label: 'Video bằng chứng', verified: true },
            { type: 'linkedin', label: 'LinkedIn với endorsements', verified: true },
            { type: 'cert', label: 'Lời chứng nhận tổ chức', verified: true },
            { type: 'event', label: 'Chứng chỉ đào tạo', verified: true },
            { type: 'link', label: 'Link sự kiện / hội nghị', verified: true },
            { type: 'badge', label: '2 Chứng chỉ', verified: true },
            { type: 'veteran', label: 'Veteran 64+ buổi', verified: true },
            { type: 'top', label: 'Top Rated 5', verified: true },
        ],
        portfolio: [
            { title: 'youtube.com/@hamyspeaks', sub: 'Kênh YouTube Public Speaking' },
            { title: 'hamyspeaking.vn', sub: 'Website cá nhân' },
        ],
        reviews: [
            { initials: 'KT', color: 'bg-violet-600', name: 'Khang T.', stars: 5, label: 'Đã học minh buổi học', comment: 'Đã vượt qua nỗi sợ nói trước đám đông!' },
            { initials: 'LN', color: 'bg-emerald-600', name: 'Linh N.', stars: 5, label: 'Đã học minh buổi học', comment: '5/5 không có gì để chê!' },
        ],
        availableSlots: [
            { day: 'T2 10/3', time: '19:00 CH', status: 'open' },
            { day: 'T4 12/3', time: '16:00 CH', status: 'open' },
            { day: 'T6 14/3', time: '9:00 SA', status: 'open' },
        ],
    },
    {
        id: 'm2', name: 'Bảo Nguyên', avatar: 'BN', avatarBg: 'bg-teal-600',
        skill: 'Machine Learning', subSkills: ['Python', 'PyTorch', 'Data Analysis'],
        level: 'Advanced', rating: 4.7, totalReviews: 8, totalSessions: 42, responseTime: '<2h',
        price: 18, match: 85, slots: 2, trustScore: 85, isTopRated: false,
        bio: 'Data Scientist và AI enthusiast. Hướng dẫn từ cơ bản đến ML models.',
        bioFull: 'Data Scientist tại một startup fintech, 4 năm kinh nghiệm build production ML models. Đam mê chia sẻ kiến thức và giúp người học rút ngắn con đường học AI.',
        teachingStyle: 'Học qua dự án thực tế 100%. Mỗi buổi sẽ có một mini-project nhỏ để áp dụng ngay. Có repo GitHub cá nhân cho từng học viên.',
        outcomes: [
            'Hiểu nền tảng Toán và Thống kê cần thiết',
            'Xây dựng models với Scikit-learn & PyTorch',
            'Deploy model lên production',
            'Phân tích và xử lý dữ liệu thực tế',
        ],
        certs: [
            { name: 'AWS Machine Learning Specialty', org: 'Amazon Web Services · 2023', icon: '☁️', verified: true },
            { name: 'Google Data Analytics', org: 'Google · 2022', icon: '📊', verified: true },
        ],
        evidences: [
            { type: 'linkedin', label: 'LinkedIn với endorsements', verified: true },
            { type: 'cert', label: 'Chứng chỉ AWS & Google', verified: true },
            { type: 'badge', label: 'Veteran 42+ buổi', verified: true },
        ],
        portfolio: [
            { title: 'github.com/baonguyen-ml', sub: 'GitHub với 20+ projects' },
        ],
        reviews: [
            { initials: 'AT', color: 'bg-blue-600', name: 'Anh Tuấn', stars: 5, label: 'Đã học 3 buổi', comment: 'Giải thích cực kỳ rõ ràng, có nhiều ví dụ thực tế.' },
            { initials: 'PT', color: 'bg-pink-600', name: 'Phương Thy', stars: 4, label: 'Đã học 1 buổi', comment: 'Rất nhiệt tình, content chất lượng.' },
        ],
        availableSlots: [
            { day: 'T3 11/3', time: '20:00 CH', status: 'open' },
            { day: 'T5 13/3', time: '9:00 SA', status: 'open' },
        ],
    },
];

const DATES = ['T2 10/3', 'T3 11/3', 'T4 12/3', 'T5 13/3', 'T6 14/3'];
const TIMES = ['8:00 SA', '9:00 SA', '10:00 SA', '14:00 CH', '15:00 CH', '16:00 CH', '19:00 CH', '20:00 CH'];

// ── Trust Score Bar ───────────────────────────────────────
const TrustBar = ({ score }) => {
    const color = score >= 90 ? 'bg-emerald-500' : score >= 70 ? 'bg-amber-400' : 'bg-red-400';
    const label = score >= 90 ? 'Đáng tin cậy cao' : score >= 70 ? 'Tin cậy tốt' : 'Đang xây dựng';
    return (
        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center font-extrabold text-emerald-700 text-lg">{score}</div>
                <div>
                    <p className="font-extrabold text-slate-800 text-sm">Trust Score</p>
                    <p className="text-xs text-emerald-600 font-semibold">● {label}</p>
                </div>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${score}%` }} />
            </div>
            <p className="text-[11px] text-slate-400">Dựa trên bằng chứng xác nhận: 5/5 tổng · 2/2 chứng chỉ xác minh</p>
        </div>
    );
};

// ── Evidence chips ────────────────────────────────────────
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

// ── TAB: Giới thiệu ───────────────────────────────────────
const TabIntro = ({ mentor }) => (
    <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-extrabold text-slate-900 text-base mb-3">Về tôi</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{mentor.bioFull}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-extrabold text-slate-900 text-base mb-4 flex items-center gap-2">
                🎯 Tôi sẽ dạy bạn
            </h3>
            <div className="space-y-2.5">
                {mentor.outcomes.map((o, i) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                        <CheckCircle size={16} weight="fill" className="text-violet-500 shrink-0" />
                        <span className="text-sm text-slate-700 font-medium">{o}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-extrabold text-slate-900 text-base mb-3 flex items-center gap-2">
                🌀 Phong cách dạy
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100 italic">
                {mentor.teachingStyle}
            </p>
        </div>
    </div>
);

// ── TAB: Bằng chứng năng lực ──────────────────────────────
const TabCredentials = ({ mentor }) => (
    <div className="space-y-5">
        {/* Trust Score */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-extrabold text-slate-900 text-sm mb-1 flex items-center gap-2">
                🏆 Bằng chứng — Kỹ năng mềm
            </h3>
            <p className="text-xs text-slate-400 mb-4">Kỹ năng chuyên ngành: xác minh bởi cộng đồng SkillSync</p>
            <TrustBar score={mentor.trustScore} />
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

        {/* Certs */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center gap-2">
                🎓 Bằng clip & Chứng chỉ
            </h3>
            <div className="space-y-3">
                {mentor.certs.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-2xl shrink-0">{c.icon}</span>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-800 text-sm">{c.name}</p>
                            <p className="text-xs text-slate-400">{c.org}</p>
                        </div>
                        {c.verified && (
                            <span className="text-[11px] font-bold px-2 py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-lg shrink-0 flex items-center gap-1">
                                <Check size={10} weight="bold" /> đã xác minh
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* Portfolio */}
        {mentor.portfolio.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h3 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center gap-2">
                    🗂️ Portfolio & Bằng chứng thực tế
                </h3>
                <div className="space-y-2.5">
                    {mentor.portfolio.map((p, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-violet-200 transition-colors cursor-pointer group">
                            <FolderOpen size={16} weight="duotone" className="text-violet-400 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-violet-600 truncate group-hover:underline">{p.title}</p>
                                <p className="text-[11px] text-slate-400">{p.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Reviews preview */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center gap-2">
                💬 Kết quả học viên thực tế
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
    </div>
);

// ── TAB: Lịch trống ───────────────────────────────────────
const TabSchedule = ({ mentor, onBook }) => (
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
                            <p className="text-xs text-slate-500 mb-2 flex items-center justify-center gap-1">
                                <Clock size={11} weight="regular" /> {sl.time}
                            </p>
                            <span className="text-[11px] font-bold text-emerald-600">● Trống</span>
                        </div>
                    ))}
                </div>
                <button
                    onClick={onBook}
                    className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md shadow-violet-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <CalendarCheck size={18} weight="duotone" /> Đặt lịch ngay ({mentor.availableSlots.length} slot trống)
                </button>
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

// ── TAB: Đánh giá ─────────────────────────────────────────
const TabReviews = ({ mentor }) => {
    const ratingDist = [
        { star: 5, pct: 75 },
        { star: 4, pct: 20 },
        { star: 3, pct: 4 },
        { star: 2, pct: 1 },
        { star: 1, pct: 0 },
    ];
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
                            <div className={`w-9 h-9 ${r.color} text-white rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0`}>{r.initials}</div>
                            <div>
                                <p className="font-bold text-slate-800 text-sm">{r.name}</p>
                                <p className="text-[11px] text-slate-400">{r.label} ✓</p>
                            </div>
                            <div className="ml-auto flex gap-0.5">
                                {[...Array(r.stars)].map((_, j) => (
                                    <Star key={j} size={13} weight="fill" className="text-amber-400" />
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">"{r.comment}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── Detail Tabs ───────────────────────────────────────────
const DETAIL_TABS = [
    { id: 'intro', label: 'Giới thiệu', emoji: '👤' },
    { id: 'creds', label: 'Bằng chứng năng lực', emoji: '🏅' },
    { id: 'schedule', label: 'Lịch trống', emoji: '📅' },
    { id: 'reviews', label: 'Đánh giá', emoji: '⭐' },
];

// ── Main Explore Component ────────────────────────────────
const Explore = () => {
    const { credits, bookSession, mySkills } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [activeTab, setActiveTab] = useState('intro');
    const [bookingStep, setBookingStep] = useState(0);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [note, setNote] = useState('');

    const learningInterests = mySkills.filter(s => s.type === 'learn').map(s => s.name.toLowerCase());

    const filteredMentors = MOCK_MENTORS.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.skill.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        const aBoost = learningInterests.includes(a.skill.toLowerCase()) ? 20 : 0;
        const bBoost = learningInterests.includes(b.skill.toLowerCase()) ? 20 : 0;
        return (b.match + bBoost) - (a.match + aBoost);
    });

    const resetAll = () => {
        setSelectedMentor(null);
        setBookingStep(0);
        setActiveTab('intro');
        setSelectedDate('');
        setSelectedTime('');
        setNote('');
    };

    const handleConfirmBooking = () => {
        if (credits < selectedMentor.price) return;
        bookSession({ topic: selectedMentor.skill, mentor: selectedMentor.name, date: new Date().toISOString(), cost: selectedMentor.price });
        trackAction('JOIN_SESSION').catch(e => console.error(e));
        trackAction('FIRST_SESSION_JOINED').catch(e => console.error(e));
        setBookingStep(3);
    };

    // ── DETAIL VIEW ──────────────────────────────────────
    if (selectedMentor && bookingStep === 0) {
        const m = selectedMentor;
        const tabCount = m.reviews?.length ?? 0;

        return (
            <div className="max-w-5xl mx-auto font-sans pb-14">
                {/* Back */}
                <button onClick={resetAll} className="flex items-center gap-2 text-slate-500 hover:text-violet-600 font-semibold mb-6 text-sm transition-colors">
                    <ArrowLeft size={16} weight="bold" /> Quay lại Khám phá
                </button>

                {/* ── Hero Header Card ─────────────────── */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
                    <div className="flex flex-col sm:flex-row items-start gap-5">
                        {/* Avatar */}
                        <div className={`w-20 h-20 rounded-2xl ${m.avatarBg} text-white flex items-center justify-center text-3xl font-extrabold shadow-md shrink-0`}>
                            {m.avatar}
                        </div>
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
                            { icon: Shield, label: 'Trust Score', value: m.trustScore, iconCls: 'text-teal-500' },
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
                    {/* ── Left: Tabs ───────────────────── */}
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
                        {activeTab === 'schedule' && <TabSchedule mentor={m} onBook={() => setBookingStep(1)} />}
                        {activeTab === 'reviews' && <TabReviews mentor={m} />}
                    </div>

                    {/* ── Right: Booking Widget ─────────── */}
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

                            <button
                                onClick={() => setBookingStep(1)}
                                className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md shadow-violet-100 active:scale-95 transition-all mb-2.5 flex items-center justify-center gap-2 text-sm"
                            >
                                <CalendarCheck size={16} weight="duotone" /> Chọn slot & đặt lịch
                            </button>
                            <button className="w-full py-3 border-2 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2">
                                <ChatCircle size={16} weight="duotone" /> Nhắn tin trước
                            </button>
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
                                <p className="text-xs font-bold text-slate-700">Cam kết chất lượng</p>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">Không hài lòng buổi đầu → hoàn 100% credits trong 24h.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── BOOKING FLOW (steps 1-3) ─────────────────────────
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
                            <h2 className="text-xl font-extrabold text-slate-900 mb-5">Chọn ngày học</h2>
                            <div className="flex flex-wrap gap-3 mb-8">
                                {DATES.map(d => (
                                    <button key={d} onClick={() => setSelectedDate(d)}
                                        className={`px-5 py-3.5 rounded-xl text-sm font-bold border-2 transition-all active:scale-95 ${selectedDate === d ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-100 text-slate-600 hover:border-slate-200'}`}>
                                        {d}
                                    </button>
                                ))}
                            </div>
                            <h2 className="text-xl font-extrabold text-slate-900 mb-5">Chọn giờ</h2>
                            <div className="grid grid-cols-4 gap-3 mb-8">
                                {TIMES.map(t => (
                                    <button key={t} onClick={() => setSelectedTime(t)}
                                        className={`px-3 py-3.5 rounded-xl text-sm font-bold border-2 transition-all active:scale-95 ${selectedTime === t ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-100 text-slate-600 hover:border-slate-200'}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                            <h2 className="text-base font-extrabold text-slate-900 mb-3">Ghi chú (tùy chọn)</h2>
                            <textarea className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm outline-none focus:border-violet-400 focus:bg-white min-h-[100px] resize-none transition-all" placeholder="Bạn muốn tập trung vào điểm gì trong buổi học này?" value={note} onChange={e => setNote(e.target.value)} />
                        </div>

                        {/* Summary sidebar */}
                        <div className="lg:w-72 shrink-0" style={{ position: 'sticky', top: '1rem' }}>
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                    <div className={`w-12 h-12 ${m.avatarBg} text-white rounded-xl flex items-center justify-center font-extrabold shrink-0`}>{m.avatar}</div>
                                    <div>
                                        <p className="font-extrabold text-slate-900 text-sm">{m.name}</p>
                                        <p className="text-xs text-slate-400">{m.skill}</p>
                                    </div>
                                </div>
                                <div className="space-y-2.5 text-sm">
                                    <div className="flex justify-between"><span className="text-slate-500">Ngày</span><span className={`font-bold ${selectedDate ? 'text-slate-800' : 'text-slate-300'}`}>{selectedDate || 'Chưa chọn'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Giờ</span><span className={`font-bold ${selectedTime ? 'text-slate-800' : 'text-slate-300'}`}>{selectedTime || 'Chưa chọn'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Chi phí</span><span className="font-extrabold text-amber-500">⚡ {m.price} credits</span></div>
                                </div>
                                <div className="flex justify-between text-sm pt-3 border-t border-slate-100">
                                    <span className="text-slate-500">Số dư sau</span>
                                    <span className={`font-extrabold ${credits >= m.price ? 'text-emerald-600' : 'text-red-500'}`}>⚡ {credits - m.price}</span>
                                </div>
                                <button disabled={!selectedDate || !selectedTime}
                                    onClick={() => setBookingStep(2)}
                                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${selectedDate && selectedTime ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
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
                            <div className={`w-14 h-14 ${m.avatarBg} text-white rounded-xl flex items-center justify-center font-extrabold text-xl shrink-0`}>{m.avatar}</div>
                            <div>
                                <p className="font-extrabold text-slate-900">{m.name}</p>
                                <p className="text-sm text-slate-400">{m.skill}</p>
                                <p className="text-xs font-bold text-violet-600 mt-1">📅 {selectedDate} · ⏰ {selectedTime}</p>
                            </div>
                        </div>
                        <div className="space-y-3 mb-6 text-sm">
                            <div className="flex justify-between"><span className="text-slate-500">Credits hiện tại</span><span className="font-bold">⚡ {credits}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Chi phí</span><span className="font-bold text-red-500">- ⚡ {m.price}</span></div>
                            <div className="flex justify-between pt-3 border-t border-slate-100 text-base">
                                <span className="font-bold text-slate-700">Còn lại</span>
                                <span className={`font-extrabold ${credits >= m.price ? 'text-emerald-600' : 'text-red-500'}`}>⚡ {credits - m.price}</span>
                            </div>
                        </div>
                        {credits < m.price && (
                            <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700">
                                <Warning size={16} weight="duotone" className="shrink-0" /> Không đủ credits để đặt lịch này.
                            </div>
                        )}
                        <button disabled={credits < m.price} onClick={handleConfirmBooking}
                            className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-base ${credits >= m.price ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-200 active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                            <CheckCircle size={20} weight="duotone" /> Xác nhận đặt lịch
                        </button>
                    </div>
                )}

                {/* Step 3: Success */}
                {bookingStep === 3 && (
                    <div className="max-w-lg mx-auto text-center mt-8">
                        <div className="text-6xl mb-4">🎉</div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Đặt lịch thành công!</h1>
                        <p className="text-slate-500 mb-8">
                            Buổi học với <b>{m.name}</b> vào <span className="font-bold text-violet-600">{selectedDate}</span> lúc <span className="font-bold text-violet-600">{selectedTime}</span> đã xác nhận.
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

    // ── EXPLORE LIST VIEW ────────────────────────────────
    return (
        <div className="max-w-6xl mx-auto font-sans pb-12 space-y-8">
            {/* Quick Filter Section */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                <div className="flex gap-4">
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
                    <button className="px-5 py-3 flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-extrabold text-sm hover:border-slate-300 transition-colors shrink-0 min-w-[200px]">
                        <span className="flex items-center gap-2">
                            <span className="relative flex shrink-0 h-4 w-4">
                                <span className="absolute top-0 right-0 w-2 h-2 bg-pink-400 rounded-sm"></span>
                                <span className="absolute top-0 left-0 w-2 h-2 bg-emerald-400 rounded-sm"></span>
                                <span className="absolute bottom-0 right-0 w-2 h-2 bg-sky-400 rounded-sm"></span>
                                <span className="absolute bottom-0 left-0 w-2 h-2 bg-violet-400 rounded-sm"></span>
                            </span>
                            Nhiều kinh nghiệm
                        </span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                    {[
                        { id: 'all', label: 'Tất cả' },
                        { id: 'tech', label: 'Công nghệ' },
                        { id: 'design', label: 'Thiết kế' },
                        { id: 'soft_skills', label: 'Kỹ năng mềm' },
                        { id: 'creative', label: 'Sáng tạo' },
                        { id: 'business', label: 'Kinh doanh' },
                        { id: 'languages', label: 'Ngôn ngữ' }
                    ].map(cat => (
                        <button
                            key={cat.id}
                            className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${cat.id === 'all'
                                    ? 'bg-indigo-50/50 text-indigo-600 border-indigo-200'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMentors.map(mentor => {
                    const isHigh = mentor.match >= 90;
                    return (
                        <div key={mentor.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group relative">
                            {isHigh && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-orange-400" />}
                            <div className="p-6 flex-1">
                                <div className="flex items-start justify-between mb-5">
                                    <div className={`w-14 h-14 rounded-2xl ${mentor.avatarBg} text-white flex items-center justify-center text-xl font-extrabold shadow-md`}>
                                        {mentor.avatar}
                                    </div>
                                    <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-full ${isHigh ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-violet-50 text-violet-700 border border-violet-100'}`}>
                                        <Sparkle size={11} weight="fill" /> {mentor.match}% Match
                                    </span>
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
                                <span className="font-extrabold text-slate-900 text-sm">⚡ {mentor.price} <span className="text-slate-400 font-normal">tín/giờ</span></span>
                                <button onClick={() => { setSelectedMentor(mentor); setBookingStep(0); setActiveTab('intro'); }}
                                    className="px-5 py-2.5 bg-slate-900 hover:bg-violet-600 text-white font-bold rounded-xl transition-all text-sm active:scale-95 shadow-sm">
                                    Xem hồ sơ
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Explore;
