import { useState, useEffect, useCallback } from 'react';
import { Star, X, Send, CheckCircle2, ThumbsUp, Sparkles, Loader2 } from 'lucide-react';

const RATING_LABELS = {
    1: { text: 'Kém', color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200' },
    2: { text: 'Tạm được', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
    3: { text: 'Bình thường', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
    4: { text: 'Tốt', color: 'text-lime-600', bg: 'bg-lime-50', border: 'border-lime-200' },
    5: { text: 'Xuất sắc!', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
};

const QUICK_TAGS = [
    'Nội dung dễ hiểu',
    'Video chất lượng cao',
    'Cấu trúc rõ ràng',
    'Phù hợp người mới',
    'Thực hành nhiều',
    'Mentor hỗ trợ tốt',
    'Tiến độ hợp lý',
    'Bổ ích thiết thực',
];

function StarRating({ value, hovered, onHover, onSelect }) {
    return (
        <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= (hovered || value);
                const active = star <= value;
                return (
                    <button
                        key={star}
                        type="button"
                        onMouseEnter={() => onHover(star)}
                        onMouseLeave={() => onHover(0)}
                        onClick={() => onSelect(star)}
                        className="group relative p-1 transition-transform duration-150 hover:scale-110 active:scale-95"
                        aria-label={`Đánh giá ${star} sao`}
                    >
                        <Star
                            size={36}
                            className={`transition-all duration-150 ${
                                filled
                                    ? active
                                        ? 'text-amber-400 fill-amber-400 drop-shadow-md'
                                        : 'text-amber-300 fill-amber-300'
                                    : 'text-slate-200 fill-slate-100 group-hover:text-amber-200'
                            }`}
                        />
                        {filled && (
                            <span className="absolute inset-0 animate-ping-once rounded-full opacity-0" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export default function PathRatingModal({ open, onClose, onSubmit, pathTitle, pathEmoji, existingRating }) {
    const [rating, setRating] = useState(existingRating?.rating || 0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState(existingRating?.comment || '');
    const [tags, setTags] = useState(existingRating?.tags || []);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (open) {
            setRating(existingRating?.rating || 0);
            setComment(existingRating?.comment || '');
            setTags(existingRating?.tags || []);
            setSubmitted(false);
            setSubmitting(false);
            setTimeout(() => setVisible(true), 10);
        } else {
            setVisible(false);
        }
    }, [open, existingRating]);

    const toggleTag = useCallback((tag) => {
        setTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    }, []);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setSubmitting(true);
        try {
            await onSubmit?.({ rating, comment: comment.trim(), tags });
            setSubmitted(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = useCallback(() => {
        setVisible(false);
        setTimeout(onClose, 200);
    }, [onClose]);

    if (!open) return null;

    const labelInfo = RATING_LABELS[hovered || rating];

    return (
        <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-200 ${visible ? 'bg-slate-900/60 backdrop-blur-sm' : 'bg-transparent'}`}>
            <div className="absolute inset-0" aria-hidden onClick={handleClose} />

            <div
                className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 transition-all duration-200 ${
                    visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
                }`}
            >
                {/* Header gradient */}
                <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 pt-6 pb-10">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                        <X size={16} />
                    </button>
                    <div className="text-center">
                        <span className="text-5xl block mb-2 drop-shadow-lg">
                            {submitted ? '🎉' : pathEmoji || '📚'}
                        </span>
                        <h2 className="text-xl font-extrabold text-white">
                            {submitted ? 'Cảm ơn bạn đã đánh giá!' : 'Đánh giá lộ trình'}
                        </h2>
                        {pathTitle && (
                            <p className="text-white/75 text-sm mt-1 font-medium line-clamp-1">{pathTitle}</p>
                        )}
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 pb-6 -mt-5">
                    {submitted ? (
                        /* Success state */
                        <div className="text-center py-6 space-y-4">
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <CheckCircle2 size={32} />
                            </div>
                            <div>
                                <p className="font-extrabold text-slate-900 text-lg">Đánh giá đã được ghi nhận!</p>
                                <p className="text-slate-500 text-sm mt-1">
                                    Phản hồi của bạn giúp cải thiện chất lượng lộ trình cho mọi người.
                                </p>
                            </div>
                            <div className="flex justify-center gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        size={22}
                                        className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-100'}
                                    />
                                ))}
                            </div>
                            {comment && (
                                <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm text-slate-600 italic text-left">
                                    "{comment}"
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={handleClose}
                                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    ) : (
                        /* Rating form */
                        <div className="space-y-5">
                            {/* Star input */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center space-y-3">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Bạn đánh giá lộ trình này thế nào?
                                </p>
                                <div className="flex justify-center">
                                    <StarRating
                                        value={rating}
                                        hovered={hovered}
                                        onHover={setHovered}
                                        onSelect={setRating}
                                    />
                                </div>
                                {labelInfo && (
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border transition-all ${labelInfo.color} ${labelInfo.bg} ${labelInfo.border}`}
                                    >
                                        <ThumbsUp size={13} />
                                        {labelInfo.text}
                                    </span>
                                )}
                                {!rating && !hovered && (
                                    <p className="text-slate-400 text-sm">Nhấn vào ngôi sao để chọn</p>
                                )}
                            </div>

                            {/* Quick tags */}
                            {rating > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <Sparkles size={12} className="text-indigo-500" />
                                        Điểm nổi bật (chọn nhiều)
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {QUICK_TAGS.map((tag) => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => toggleTag(tag)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                                    tags.includes(tag)
                                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200'
                                                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:text-indigo-700'
                                                }`}
                                            >
                                                {tags.includes(tag) ? '✓ ' : ''}{tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Comment */}
                            {rating > 0 && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                                        Nhận xét thêm (tùy chọn)
                                    </label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Chia sẻ cảm nhận của bạn về lộ trình này..."
                                        rows={3}
                                        maxLength={500}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 resize-none transition-all font-medium"
                                    />
                                    <p className="text-right text-[11px] text-slate-400">{comment.length}/500</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
                                >
                                    Để sau
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={rating === 0 || submitting}
                                    className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-200"
                                >
                                    {submitting ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Send size={15} />
                                    )}
                                    {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
