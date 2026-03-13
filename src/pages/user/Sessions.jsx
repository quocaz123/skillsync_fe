import { useState } from 'react';
import { useStore } from '../../store';
import {
    Clock, CheckCircle2, ArrowRight, Play, Star,
    CalendarDays, Zap, BookOpen, XCircle, ThumbsUp, Medal, Award
} from 'lucide-react';

const StarRating = ({ rating, setRating }) => (
    <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(star => (
            <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-125 active:scale-95">
                <Star size={36} className={star <= rating ? 'text-amber-400 fill-amber-400 drop-shadow-sm' : 'text-slate-200 fill-slate-100'} />
            </button>
        ))}
    </div>
);

const Sessions = () => {
    const { sessions, completeSession } = useStore();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [reviewModal, setReviewModal] = useState(null); // session object
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [successModal, setSuccessModal] = useState(null);

    const upcomingSessions = sessions.filter(s => s.status === 'upcoming');
    const pastSessions = sessions.filter(s => s.status === 'completed');

    const handleOpenReview = (session) => {
        setReviewModal(session);
        setRating(0);
        setReviewText('');
    };

    const handleSubmitReview = () => {
        if (!rating) return;
        completeSession(reviewModal.id, { rating, review: reviewText });
        setSuccessModal(reviewModal);
        setReviewModal(null);
        setActiveTab('past');
    };

    const ratingLabels = { 1: 'Cần cải thiện nhiều', 2: 'Chưa hài lòng', 3: 'Bình thường', 4: 'Rất tốt', 5: 'Tuyệt vời!' };

    return (
        <div className="max-w-6xl mx-auto space-y-5 sm:space-y-8 font-sans pb-6">

            {/* Header Redesigned */}
            <div className="bg-gradient-to-br from-indigo-900 via-violet-900 to-fuchsia-900 rounded-[1.5rem] sm:rounded-[2.5rem] px-5 py-7 sm:p-12 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-5 shadow-xl shadow-indigo-900/20">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-fuchsia-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-indigo-100 text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
                        <CalendarDays size={14} className="text-fuchsia-300" /> Quản lý học tập
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-3">Lịch học của bạn</h1>
                    <p className="text-indigo-200/80 font-medium text-lg max-w-md">Theo dõi lịch hẹn 1-kèm-1, đánh giá Mentor và quản lý tiến trình của bạn.</p>
                </div>

                <div className="relative z-10 flex p-1.5 bg-white/10 backdrop-blur-md rounded-2xl w-full md:w-auto border border-white/20 shadow-inner">
                    <button onClick={() => setActiveTab('upcoming')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all duration-300 ${activeTab === 'upcoming' ? 'bg-white text-indigo-700 shadow-md scale-[1.02]' : 'text-white hover:bg-white/10'}`}>
                        Sắp diễn ra <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-black ${activeTab === 'upcoming' ? 'bg-indigo-100 text-indigo-700' : 'bg-white/20 text-white'}`}>{upcomingSessions.length}</span>
                    </button>
                    <button onClick={() => setActiveTab('past')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all duration-300 ${activeTab === 'past' ? 'bg-white text-slate-800 shadow-md scale-[1.02]' : 'text-white hover:bg-white/10'}`}>
                        Đã hoàn thành <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-black ${activeTab === 'past' ? 'bg-slate-100 text-slate-700' : 'bg-white/20 text-white'}`}>{pastSessions.length}</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">

                {/* UPCOMING SESSIONS */}
                {activeTab === 'upcoming' && (
                    <div className="space-y-6">
                        {upcomingSessions.length === 0 ? (
                            <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-200 p-16 text-center">
                                <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 rotate-3">
                                    <CalendarDays size={40} className="text-indigo-500" />
                                </div>
                                <h3 className="text-2xl font-extrabold text-slate-800 mb-2">Chưa có lịch học nào trống</h3>
                                <p className="text-slate-500 mb-8 max-w-sm mx-auto">Vào mục Khám phá để tìm Mentor phù hợp và đặt lịch học ngay!</p>
                                <a href="/app/explore" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-1 transition-all">
                                    Tìm Mentor Ngay <ArrowRight size={18} />
                                </a>
                            </div>
                        ) : upcomingSessions.map((session, index) => (
                            <div key={session.id} className={`bg-white rounded-[2rem] border overflow-hidden transition-all hover:shadow-xl hover:shadow-indigo-900/5 ${index === 0 ? 'border-indigo-500 ring-4 ring-indigo-50 shadow-md' : 'border-slate-200'}`}>
                                {index === 0 && (
                                    <div className="bg-indigo-600 px-6 py-2.5 flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-2 h-2 bg-white rounded-full animate-ping absolute"></div>
                                            <div className="w-2 h-2 bg-white rounded-full relative"></div>
                                            <span className="text-white text-xs font-black uppercase tracking-widest opacity-90">Sắp diễn ra tiếp theo</span>
                                        </div>
                                        <span className="text-indigo-200 text-xs font-bold">Chỉ còn 2 ngày nữa</span>
                                    </div>
                                )}
                                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
                                    {/* Mentor Visual Component */}
                                    <div className="relative shrink-0 group">
                                        <div className="w-20 h-20 rounded-[1.5rem] bg-indigo-100 flex items-center justify-center text-3xl font-black text-indigo-600 relative z-10 overflow-hidden border-4 border-white shadow-sm">
                                            {session.mentor?.charAt(0) || 'M'}
                                        </div>
                                        {/* Status badge */}
                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center z-20 shadow-sm border border-slate-100">
                                            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Session Info Details */}
                                    <div className="flex-1 min-w-0 md:pl-2">
                                        <h3 className="text-2xl font-black text-slate-900 mb-2 truncate">{session.topic}</h3>
                                        <p className="text-slate-500 font-medium mb-4 flex items-center gap-2">
                                            <span>Giảng viên:</span> <span className="text-slate-800 font-bold bg-slate-100 px-2.5 py-0.5 rounded-lg">{session.mentor}</span>
                                        </p>

                                        <div className="flex flex-wrap gap-2.5">
                                            {/* Time Capsule */}
                                            <div className="flex items-center bg-indigo-50 rounded-xl overflow-hidden border border-indigo-100/50">
                                                <div className="flex items-center gap-1.5 px-3 py-2 bg-indigo-100/50 text-indigo-800 text-sm font-bold border-r border-indigo-100">
                                                    <CalendarDays size={16} />
                                                    {new Date(session.date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })}
                                                </div>
                                                <div className="flex items-center gap-1.5 px-3 py-2 text-indigo-800 text-sm font-bold">
                                                    <Clock size={16} />
                                                    {new Date(session.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>

                                            {/* Cost Tag */}
                                            <div className="flex items-center gap-1.5 px-3 py-2 text-amber-700 text-sm font-bold bg-amber-50 rounded-xl border border-amber-100">
                                                <Zap size={16} className="fill-amber-500" /> {session.cost} Credits
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-3 shrink-0 w-full md:w-48">
                                        <button className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0">
                                            <Play size={18} fill="currentColor" /> Tham gia học
                                        </button>
                                        <button onClick={() => handleOpenReview(session)} className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-emerald-50 text-emerald-600 font-bold rounded-xl border-2 border-emerald-100 hover:border-emerald-200 transition-colors">
                                            <CheckCircle2 size={18} /> Đánh giá hoàn tất
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* PAST SESSIONS: ACHIEVEMENT STYLE CARDS */}
                {activeTab === 'past' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {pastSessions.length === 0 ? (
                            <div className="lg:col-span-2 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 p-16 text-center">
                                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                    <BookOpen size={40} className="text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-extrabold text-slate-700 mb-2">Bộ sưu tập kỹ năng trống</h3>
                                <p className="text-slate-400 max-w-sm mx-auto">Chưa có buổi học nào được hoàn thành. Bắt đầu ngay để tích lũy kiến thức tại đây nhé.</p>
                            </div>
                        ) : pastSessions.map((session) => (
                            <div key={session.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col">
                                {/* Achievement Header */}
                                <div className="bg-slate-50/50 p-6 border-b border-slate-100 flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl font-black text-slate-700 shadow-sm shrink-0">
                                            {session.mentor?.charAt(0) || 'M'}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-900 text-lg leading-tight mb-1">{session.topic}</h3>
                                            <p className="text-slate-500 font-semibold text-sm">Với {session.mentor}</p>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0" title="Hoàn thành xuất sắc">
                                        <Medal size={20} weight="duotone" />
                                    </div>
                                </div>

                                {/* Info Body */}
                                <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                                    <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                        <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg text-xs">
                                            <CalendarDays size={14} /> Hoàn tất: {new Date(session.date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                                        </span>
                                        <div className="flex items-center gap-1 text-red-500">
                                            <Zap size={16} className="fill-red-500" /> -{session.cost}
                                        </div>
                                    </div>

                                    {session.review ? (
                                        <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-100/50 relative mt-auto">
                                            <div className="absolute -top-3 left-4 bg-white border border-amber-100 px-2 py-0.5 rounded-full flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} className={i < session.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'} />
                                                ))}
                                            </div>
                                            <p className="mt-2 text-sm text-slate-700 italic font-medium">"{session.review}"</p>
                                        </div>
                                    ) : (
                                        <div className="mt-auto pt-4 flex justify-end">
                                            <button onClick={() => handleOpenReview(session)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors">
                                                Viết đánh giá
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* REVIEW MODAL (BEAUTIFIED) */}
            {reviewModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 border border-white/20 overflow-hidden flex flex-col">

                        {/* Modal Header */}
                        <div className="bg-indigo-600 p-8 text-center relative">
                            <button onClick={() => setReviewModal(null)} className="absolute top-6 right-6 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors">
                                <XCircle size={20} />
                            </button>
                            <div className="w-20 h-20 mx-auto bg-white rounded-[1.5rem] flex items-center justify-center text-4xl font-black text-indigo-600 shadow-lg mb-4 rotate-3">
                                {reviewModal.mentor?.charAt(0)}
                            </div>
                            <h2 className="text-2xl font-black text-white px-4 leading-tight">{reviewModal.topic}</h2>
                            <p className="text-indigo-200 mt-2 font-medium">Mentor: {reviewModal.mentor}</p>
                        </div>

                        <div className="p-8">
                            {/* Star Rating Block */}
                            <div className="mb-8 text-center">
                                <p className="text-sm font-black text-slate-400 mb-4 uppercase tracking-widest">Trải nghiệm của bạn?</p>
                                <div className="flex justify-center bg-slate-50 py-4 px-6 rounded-3xl border border-slate-100 inline-flex shadow-inner">
                                    <StarRating rating={rating} setRating={setRating} />
                                </div>
                                <div className="h-6 mt-3">
                                    {rating > 0 && (
                                        <span className="inline-block bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-black animate-in pop-in duration-200">
                                            {ratingLabels[rating]}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Review Text */}
                            <div className="mb-8 relative">
                                <textarea
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] p-5 text-sm font-medium outline-none focus:border-indigo-500 focus:bg-white min-h-[120px] resize-none transition-colors placeholder:text-slate-400 pb-10"
                                    placeholder="Mentor dạy dễ hiểu không? Không khí học ra sao? Chia sẻ nhé!"
                                    value={reviewText}
                                    onChange={e => setReviewText(e.target.value)}
                                />
                                <div className="absolute bottom-4 right-4 text-xs font-bold text-slate-400">{reviewText.length}/500</div>
                            </div>

                            {/* Credit Note & Submit */}
                            <div className="flex flex-col gap-4">
                                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100/50 flex items-center justify-center gap-2">
                                    <Zap size={20} className="text-emerald-500 fill-emerald-500 shrink-0" />
                                    <p className="text-sm font-bold text-emerald-800">
                                        Nhận lại <span className="text-lg font-black text-emerald-600 px-1">{Math.round(reviewModal.cost * 0.8)}</span> credits khi gửi đánh giá!
                                    </p>
                                </div>

                                <button
                                    onClick={handleSubmitReview}
                                    disabled={!rating}
                                    className={`w-full py-4.5 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all text-lg ${rating ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/30 hover:-translate-y-1' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                                >
                                    <ThumbsUp size={20} /> Hoàn thành buổi học
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SUCCESS MODAL (ENHANCED) */}
            {successModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[3rem] w-full max-w-sm p-10 shadow-2xl text-center flex flex-col items-center relative overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Confetti effect background simple */}
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-emerald-100 to-transparent opacity-50"></div>

                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 relative z-10 animate-bounce">
                            <Award size={48} className="text-emerald-500" />
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 mb-2">Quá Đỉnh!</h2>
                        <p className="text-slate-500 mb-8 font-medium">Bạn đã hoàn thành cột mốc mới với khoá học <span className="text-slate-700 font-bold">{successModal.topic}</span>.</p>

                        <div className="bg-emerald-50 rounded-[1.5rem] p-5 w-full border border-emerald-100 mb-8 flex flex-col items-center">
                            <span className="text-xs font-black uppercase text-emerald-600 tracking-wider mb-2">Phần thưởng của bạn</span>
                            <div className="flex items-center justify-center gap-2">
                                <Zap size={28} className="text-emerald-500 fill-emerald-500" />
                                <span className="text-4xl font-black text-emerald-600">+{Math.round(successModal.cost * 0.8)}</span>
                            </div>
                        </div>

                        <button onClick={() => setSuccessModal(null)} className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-1 active:translate-y-0 text-lg">
                            Đóng lại
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sessions;
