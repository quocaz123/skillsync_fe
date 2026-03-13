import { useState } from 'react';
import {
    UsersThree, ChatCircle, ThumbsUp, TrendUp, Lightbulb,
    MagnifyingGlass, Plus, Star, Fire, Clock, Tag,
    BookOpen, ChalkboardTeacher, ArrowRight, Heart, BookmarkSimple, PaperPlaneRight
} from '@phosphor-icons/react';

// ─── Mock Data ────────────────────────────────────────────
const CATEGORIES = [
    { id: 'all', label: 'Tất cả', icon: '🌐' },
    { id: 'tips', label: 'Mẹo học tập', icon: '💡' },
    { id: 'recommend', label: 'Gợi ý giáo viên', icon: '⭐' },
    { id: 'resources', label: 'Tài nguyên', icon: '📚' },
    { id: 'question', label: 'Hỏi đáp', icon: '❓' },
    { id: 'experience', label: 'Chia sẻ', icon: '💬' },
];

const POSTS = [
    {
        id: 'p1',
        type: 'tips',
        typeLabel: '💡 Mẹo học tập',
        typeBg: 'bg-amber-100 text-amber-700',
        authorInitials: 'MH',
        authorColor: 'bg-violet-500',
        authorName: 'Minh Hiếu',
        authorRole: 'Học viên · React',
        timeAgo: '2 giờ trước',
        title: 'Cách mình học React hiệu quả trong 3 tháng',
        content: 'Sau 3 tháng học React nghiêm túc, mình đã đủ tự tin làm dự án thực tế. Bí quyết là học qua dự án thật, không học lý thuyết suông. Mình gợi ý mọi người tìm giáo viên có kinh nghiệm build app thực tế trên SkillSync thay vì học từ video dài.',
        tags: ['React', 'Tips', 'Frontend'],
        likes: 47,
        comments: 12,
        saves: 8,
        liked: false,
        saved: false,
        comments_preview: [
            { initials: 'TH', color: 'bg-teal-500', name: 'Thanh Hà', text: 'Mình cũng học theo cách này, hiệu quả lắm! Đặc biệt là phần hook.' },
            { initials: 'DK', color: 'bg-blue-500', name: 'Duy Khang', text: 'Bạn học với ai vậy? Giới thiệu mình với!' },
        ],
    },
    {
        id: 'p2',
        type: 'recommend',
        typeLabel: '⭐ Gợi ý',
        typeBg: 'bg-blue-100 text-blue-700',
        authorInitials: 'LH',
        authorColor: 'bg-emerald-500',
        authorName: 'Lan Hương',
        authorRole: 'Học viên · Python',
        timeAgo: '5 giờ trước',
        title: 'Ai biết giáo viên Python giỏi về Pandas & Data Analysis không?',
        content: 'Mình đang muốn học sâu về xử lý dữ liệu với Pandas. Đã thử vài khoá video nhưng không hiểu bằng học 1-1. Mọi người có gợi ý giáo viên nào giỏi phần này trên SkillSync không? Mình cần người có thể giải thích DataFrame indexing và groupby rõ ràng.',
        tags: ['Python', 'Pandas', 'Data'],
        likes: 23,
        comments: 18,
        saves: 5,
        liked: true,
        saved: false,
        comments_preview: [
            { initials: 'AT', color: 'bg-violet-500', name: 'Anh Tuấn', text: 'Bạn thử tìm anh Minh Đức trên Explore nhé, anh ấy dạy Pandas rất hay!' },
        ],
    },
    {
        id: 'p3',
        type: 'resources',
        typeLabel: '📚 Tài nguyên',
        typeBg: 'bg-green-100 text-green-700',
        authorInitials: 'BN',
        authorColor: 'bg-rose-500',
        authorName: 'Bảo Nguyên',
        authorRole: 'Giáo viên · Machine Learning',
        timeAgo: '1 ngày trước',
        title: '[TỔNG HỢP] Roadmap học Machine Learning từ zero đến dự án',
        content: 'Mình compile lại roadmap học ML sau 2 năm dạy học. Bao gồm: 1) Toán cơ bản (Linear Algebra, Stats), 2) Python fundamentals, 3) Scikit-learn, 4) Deep Learning cơ bản với PyTorch. Kèm theo các tài nguyên miễn phí mình chọn lọc kỹ nhất.',
        tags: ['Machine Learning', 'Roadmap', 'AI'],
        likes: 112,
        comments: 34,
        saves: 67,
        liked: false,
        saved: true,
        comments_preview: [
            { initials: 'KN', color: 'bg-orange-500', name: 'Khánh Ngân', text: 'Cảm ơn bạn rất nhiều! Roadmap này chi tiết hơn nhiều cái mình tìm được trên mạng.' },
            { initials: 'QT', color: 'bg-cyan-500', name: 'Quốc Toản', text: 'Phần PyTorch có link học cụ thể không bạn?' },
        ],
    },
    {
        id: 'p4',
        type: 'experience',
        typeLabel: '💬 Chia sẻ',
        typeBg: 'bg-purple-100 text-purple-700',
        authorInitials: 'PT',
        authorColor: 'bg-amber-500',
        authorName: 'Phương Thy',
        authorRole: 'Học viên · UI/UX Design',
        timeAgo: '2 ngày trước',
        title: 'Học UI/UX 3 tháng — mình đã thiết kế app đầu tiên!',
        content: 'Hôm nay mình deploy được app đầu tiên. Vui lắm! Không ngờ 3 tháng trước mình còn không biết Figma là gì. Nhờ tìm được giáo viên phù hợp trên SkillSync và kiên trì học mỗi tuần 2 buổi. Cảm ơn cộng đồng đã support mình 🙏',
        tags: ['UI/UX', 'Figma', 'Success Story'],
        likes: 89,
        comments: 26,
        saves: 12,
        liked: false,
        saved: false,
        comments_preview: [
            { initials: 'MH', color: 'bg-violet-500', name: 'Minh Hiếu', text: 'Tuyệt vời! Link app đâu bạn ơi? 😍' },
        ],
    },
    {
        id: 'p5',
        type: 'question',
        typeLabel: '❓ Hỏi đáp',
        typeBg: 'bg-red-100 text-red-700',
        authorInitials: 'QA',
        authorColor: 'bg-slate-500',
        authorName: 'Quang An',
        authorRole: 'Học viên · JavaScript',
        timeAgo: '3 giờ trước',
        title: 'Async/Await vs Promise — nên dùng cái nào và khi nào?',
        content: 'Mình đang học JavaScript và bị confuse về khi nào nên dùng async/await, khi nào nên dùng Promise trực tiếp. Giáo viên dạy mình giải thích nhưng mình vẫn không thấy rõ use case thực tế. Ai có thể giải thích hoặc gợi ý tài liệu không?',
        tags: ['JavaScript', 'Async', 'Hỏi đáp'],
        likes: 15,
        comments: 21,
        saves: 3,
        liked: false,
        saved: false,
        comments_preview: [
            { initials: 'BN', color: 'bg-rose-500', name: 'Bảo Nguyên', text: 'Về cơ bản async/await là syntactic sugar của Promise. Dùng async/await khi muốn code dễ đọc hơn, đặc biệt khi chain nhiều calls.' },
        ],
    },
];

const TRENDING = [
    { title: 'Học React - lộ trình mới nhất 2025', comments: 89, hot: true },
    { title: 'So sánh SkillSync với các platform khác', comments: 54 },
    { title: 'Hỏi: Có nên học TypeScript ngay từ đầu?', comments: 47 },
    { title: 'Share: Tài nguyên học Python miễn phí tốt nhất', comments: 38 },
    { title: 'Tips: Cách đặt câu hỏi hiệu quả với giáo viên', comments: 31 },
];

// ─── PostCard ─────────────────────────────────────────────
const PostCard = ({ post, onToggleLike, onToggleSave, onOpen }) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-5 pb-3">
            <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${post.authorColor} text-white flex items-center justify-center font-extrabold text-sm shrink-0`}>
                    {post.authorInitials}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2">
                        <span className="font-bold text-slate-900 text-sm">{post.authorName}</span>
                        <span className="text-xs text-slate-400">{post.authorRole}</span>
                        <span className="text-xs text-slate-300">·</span>
                        <span className="text-xs text-slate-400 flex items-center gap-0.5">
                            <Clock size={11} weight="regular" /> {post.timeAgo}
                        </span>
                    </div>
                    <span className={`mt-1 inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${post.typeBg}`}>{post.typeLabel}</span>
                </div>
            </div>

            {/* Title */}
            <h3
                className="font-extrabold text-slate-900 text-base mb-2 cursor-pointer hover:text-violet-600 transition-colors"
                onClick={() => onOpen(post)}
            >
                {post.title}
            </h3>

            {/* Content */}
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                {post.content}
            </p>
        </div>

        {/* Tags */}
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
            {post.tags.map(t => (
                <span key={t} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 flex items-center gap-1">
                    <Tag size={9} weight="fill" /> {t}
                </span>
            ))}
        </div>

        {/* Preview comments */}
        {post.comments_preview.length > 0 && (
            <div className="mx-4 mb-3 bg-slate-50 rounded-xl p-3 space-y-2">
                {post.comments_preview.slice(0, 1).map((c, i) => (
                    <div key={i} className="flex items-start gap-2">
                        <div className={`w-6 h-6 rounded-lg ${c.color} text-white flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5`}>{c.initials}</div>
                        <div className="text-xs text-slate-600">
                            <span className="font-bold text-slate-700">{c.name}: </span>{c.text}
                        </div>
                    </div>
                ))}
                {post.comments_preview.length > 1 && (
                    <p className="text-[11px] text-violet-500 font-semibold pl-8 cursor-pointer">
                        + {post.comments_preview.length - 1} bình luận khác...
                    </p>
                )}
            </div>
        )}

        {/* Actions */}
        <div className="px-5 py-3 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => onToggleLike(post.id)}
                    className={`flex items-center gap-1.5 text-sm font-semibold transition-all ${post.liked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}
                >
                    <Heart size={16} weight={post.liked ? 'fill' : 'regular'} />
                    {post.likes}
                </button>
                <button
                    onClick={() => onOpen(post)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-violet-500 transition-all"
                >
                    <ChatCircle size={16} weight="regular" />
                    {post.comments}
                </button>
            </div>
            <button
                onClick={() => onToggleSave(post.id)}
                className={`flex items-center gap-1 text-xs font-semibold transition-all ${post.saved ? 'text-violet-600' : 'text-slate-400 hover:text-violet-500'}`}
            >
                <BookmarkSimple size={15} weight={post.saved ? 'fill' : 'regular'} />
                {post.saved ? 'Đã lưu' : 'Lưu'}
            </button>
        </div>
    </div>
);

// ─── New Post Modal ───────────────────────────────────────
const NewPostModal = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('tips');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);

    const addTag = () => {
        const t = tagInput.trim();
        if (t && tags.length < 5 && !tags.includes(t)) setTags(ts => [...ts, t]);
        setTagInput('');
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 text-base">✍️ Tạo bài viết mới</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-bold">×</button>
                </div>
                <div className="p-6 space-y-4">
                    {/* Category */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-2 block">Loại bài viết</label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.slice(1).map(c => (
                                <button key={c.id} onClick={() => setCategory(c.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${category === c.id ? 'bg-violet-600 text-white border-violet-600' : 'border-slate-200 text-slate-600 hover:border-violet-300'}`}>
                                    {c.icon} {c.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1.5 block">Tiêu đề *</label>
                        <input
                            type="text"
                            placeholder="Tiêu đề bài viết..."
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400 bg-slate-50 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1.5 block">Nội dung *</label>
                        <textarea
                            rows={5}
                            placeholder="Chia sẻ kinh nghiệm, mẹo học, gợi ý giáo viên, hoặc đặt câu hỏi..."
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-400 bg-slate-50 focus:bg-white resize-none transition-all"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1.5 block">Tags (tối đa 5)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Nhập tag rồi Enter..."
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addTag()}
                                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400 bg-slate-50 focus:bg-white transition-all"
                            />
                            <button onClick={addTag} className="px-4 py-2.5 bg-slate-100 hover:bg-violet-100 text-violet-600 font-bold text-sm rounded-xl border border-slate-200 transition-all">+ Thêm</button>
                        </div>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map(t => (
                                    <span key={t} className="flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-bold px-2.5 py-1 rounded-full">
                                        {t}
                                        <button onClick={() => setTags(ts => ts.filter(x => x !== t))} className="hover:text-red-500">×</button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl font-bold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">Huỷ</button>
                        <button
                            disabled={!title.trim() || !content.trim()}
                            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${title.trim() && content.trim() ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                        >
                            Đăng bài
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Post Detail Modal ────────────────────────────────────
const PostDetailModal = ({ post, onClose, onToggleLike, onToggleSave }) => {
    const [comment, setComment] = useState('');

    if (!post) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header Actions */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${post.typeBg}`}>{post.typeLabel}</span>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto bg-slate-50/30">
                    <div className="p-6">
                        {/* Author Info */}
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl ${post.authorColor} text-white flex items-center justify-center font-extrabold text-lg shrink-0`}>
                                    {post.authorInitials}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{post.authorName}</h4>
                                    <p className="text-sm text-slate-500">{post.authorRole}</p>
                                </div>
                            </div>
                            <span className="text-sm text-slate-400 flex items-center gap-1 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-100">
                                <Clock size={14} /> {post.timeAgo}
                            </span>
                        </div>

                        {/* Title & Content */}
                        <h2 className="text-xl font-extrabold text-slate-900 mb-3">{post.title}</h2>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                        {/* Tags */}
                        <div className="mt-5 flex flex-wrap gap-2">
                            {post.tags.map(t => (
                                <span key={t} className="text-xs font-semibold px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center gap-1 shadow-sm">
                                    <Tag size={12} weight="fill" className="text-violet-500" /> {t}
                                </span>
                            ))}
                        </div>

                        {/* Post Stats & Actions */}
                        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => onToggleLike(post.id)}
                                    className={`flex items-center gap-2 font-bold transition-all ${post.liked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}
                                >
                                    <Heart size={20} weight={post.liked ? 'fill' : 'regular'} />
                                    {post.likes} <span className="hidden sm:inline">Thích</span>
                                </button>
                                <div className="flex items-center gap-2 font-bold text-slate-500">
                                    <ChatCircle size={20} weight="regular" />
                                    {post.comments} <span className="hidden sm:inline">Bình luận</span>
                                </div>
                            </div>
                            <button
                                onClick={() => onToggleSave(post.id)}
                                className={`flex items-center gap-2 font-bold transition-all ${post.saved ? 'text-violet-600' : 'text-slate-500 hover:text-violet-600'}`}
                            >
                                <BookmarkSimple size={20} weight={post.saved ? 'fill' : 'regular'} />
                                {post.saved ? 'Đã lưu' : 'Lưu bài viết'}
                            </button>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="bg-slate-50 border-t border-slate-200">
                        <div className="p-6">
                            <h3 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                                Bình luận <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{post.comments}</span>
                            </h3>

                            {/* Comment Input */}
                            <div className="flex gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 shrink-0">
                                    U
                                </div>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="Viết bình luận của bạn..."
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        className="w-full border border-slate-200 rounded-xl pl-4 pr-12 py-2.5 text-sm outline-none focus:border-violet-400 focus:bg-white transition-all bg-white placeholder-slate-400"
                                    />
                                    <button
                                        disabled={!comment.trim()}
                                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${comment.trim() ? 'text-violet-600 bg-violet-50 hover:bg-violet-100' : 'text-slate-300'}`}
                                    >
                                        <PaperPlaneRight size={16} weight="fill" />
                                    </button>
                                </div>
                            </div>

                            {/* Default preview comments for static data */}
                            <div className="space-y-4">
                                {post.comments_preview.map((c, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className={`w-10 h-10 rounded-full ${c.color} text-white flex items-center justify-center font-bold text-sm shrink-0`}>
                                            {c.initials}
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-3 shadow-sm inline-block max-w-full">
                                                <p className="font-bold text-sm text-slate-900 mb-0.5">{c.name}</p>
                                                <p className="text-sm text-slate-600">{c.text}</p>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1.5 ml-1 text-xs font-medium text-slate-500">
                                                <span>1 giờ trước</span>
                                                <button className="hover:text-violet-600">Thích</button>
                                                <button className="hover:text-violet-600">Phản hồi</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── MAIN ─────────────────────────────────────────────────
const Community = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortBy, setSortBy] = useState('hot');
    const [search, setSearch] = useState('');
    const [showNewPost, setShowNewPost] = useState(false);
    const [activePost, setActivePost] = useState(null);
    const [posts, setPosts] = useState(POSTS);

    const toggleLike = (id) => setPosts(ps => ps.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
    const toggleSave = (id) => setPosts(ps => ps.map(p => p.id === id ? { ...p, saved: !p.saved } : p));

    const filtered = posts.filter(p => {
        const matchCat = activeCategory === 'all' || p.type === activeCategory;
        const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const sorted = [...filtered].sort((a, b) => sortBy === 'hot' ? (b.likes + b.comments) - (a.likes + a.comments) : 0);

    return (
        <div className="max-w-6xl mx-auto font-sans pb-14 space-y-6">

            {/* ─── HEADER ─── */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <UsersThree size={26} weight="duotone" className="text-violet-500" />
                        Cộng đồng SkillSync
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Trao đổi kinh nghiệm · gợi ý giáo viên · chia sẻ tài nguyên học tập</p>
                </div>
                <button
                    onClick={() => setShowNewPost(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-xl shadow-md shadow-violet-200 active:scale-95 transition-all shrink-0">
                    <Plus size={16} weight="bold" /> Đăng bài
                </button>
            </div>

            {/* ─── STATS STRIP ─── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { icon: UsersThree, label: 'Thành viên', value: '1,284', color: 'text-violet-600', bg: 'bg-violet-50' },
                    { icon: ChatCircle, label: 'Bài viết tháng này', value: '342', color: 'text-sky-600', bg: 'bg-sky-50' },
                    { icon: Lightbulb, label: 'Gợi ý hữu ích', value: '89', color: 'text-amber-500', bg: 'bg-amber-50' },
                    { icon: ThumbsUp, label: 'Lượt thích hôm nay', value: '1.2K', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((s, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-4 flex items-center gap-3">
                        <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center shrink-0`}>
                            <s.icon size={18} weight="duotone" className={s.color} />
                        </div>
                        <div>
                            <p className="text-lg font-extrabold text-slate-900">{s.value}</p>
                            <p className="text-[11px] text-slate-400">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* ─── MAIN FEED ─── */}
                <div className="flex-1 space-y-4">
                    {/* Search & sort bar */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <MagnifyingGlass size={16} weight="regular" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm bài viết..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-violet-400 transition-all"
                            />
                        </div>
                        <div className="flex gap-1.5 bg-white border border-slate-200 rounded-xl p-1.5">
                            {[
                                { id: 'hot', label: '🔥 Nổi bật' },
                                { id: 'new', label: '🕐 Mới nhất' },
                                { id: 'saved', label: '🔖 Đã lưu' },
                            ].map(s => (
                                <button key={s.id} onClick={() => setSortBy(s.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sortBy === s.id ? 'bg-violet-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category chips */}
                    <div className="flex gap-2 flex-wrap">
                        {CATEGORIES.map(c => (
                            <button key={c.id} onClick={() => setActiveCategory(c.id)}
                                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${activeCategory === c.id ? 'bg-violet-600 text-white border-violet-600' : 'bg-white border-slate-200 text-slate-600 hover:border-violet-300'}`}>
                                {c.icon} {c.label}
                            </button>
                        ))}
                    </div>

                    {/* Post list */}
                    {sorted.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                            <p className="text-3xl mb-3">🔍</p>
                            <p className="font-bold text-slate-700">Không tìm thấy bài viết nào</p>
                            <p className="text-sm text-slate-400 mt-1">Thử thay đổi từ khoá hoặc danh mục</p>
                        </div>
                    ) : (
                        sorted.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onToggleLike={toggleLike}
                                onToggleSave={toggleSave}
                                onOpen={setActivePost}
                            />
                        ))
                    )}
                </div>

                {/* ─── SIDEBAR ─── */}
                <div className="lg:w-72 space-y-4 shrink-0">
                    {/* Trending */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <h3 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center gap-2">
                            <TrendUp size={16} weight="duotone" className="text-orange-500" /> Đang thảo luận nhiều
                        </h3>
                        <div className="space-y-3">
                            {TRENDING.map((t, i) => (
                                <button key={i} className="w-full text-left group">
                                    <div className="flex items-start gap-2.5">
                                        <span className={`text-sm font-extrabold shrink-0 w-5 ${i === 0 ? 'text-orange-500' : 'text-slate-400'}`}>{i + 1}</span>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-700 group-hover:text-violet-600 transition-colors line-clamp-2 leading-relaxed">
                                                {t.hot && <Fire size={11} weight="fill" className="text-orange-400 inline mr-1" />}
                                                {t.title}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                                <ChatCircle size={10} /> {t.comments} bình luận
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick suggest */}
                    <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl p-5 text-white">
                        <h3 className="font-extrabold text-base mb-1 flex items-center gap-2">
                            <Star size={16} weight="duotone" /> Gợi ý cho bạn
                        </h3>
                        <p className="text-xs text-white/70 mb-4">Dựa trên skills bạn đang học</p>
                        {[
                            { icon: BookOpen, label: 'React nâng cao', sub: '3 giáo viên phù hợp' },
                            { icon: ChalkboardTeacher, label: 'Lập trình Python', sub: '5 giáo viên phù hợp' },
                        ].map((s, i) => (
                            <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                                    <s.icon size={15} weight="duotone" className="text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold">{s.label}</p>
                                    <p className="text-[11px] text-white/60">{s.sub}</p>
                                </div>
                                <ArrowRight size={14} weight="bold" className="text-white/60 shrink-0" />
                            </div>
                        ))}
                        <button className="w-full mt-3 bg-white/20 hover:bg-white/30 text-white font-bold text-xs py-2.5 rounded-xl transition-all">
                            Khám phá tất cả →
                        </button>
                    </div>

                    {/* Rules */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <h3 className="font-extrabold text-slate-900 text-sm mb-3">📋 Nội quy cộng đồng</h3>
                        <ul className="space-y-2 text-xs text-slate-500">
                            {[
                                'Tôn trọng và lịch sự với mọi người',
                                'Không spam hoặc quảng cáo',
                                'Chia sẻ thông tin chính xác',
                                'Không đăng nội dung vi phạm bản quyền',
                                'Phản hồi tích cực và có ích',
                            ].map((r, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-violet-400 font-bold shrink-0">✓</span>
                                    {r}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {showNewPost && <NewPostModal onClose={() => setShowNewPost(false)} />}
            {activePost && (
                <PostDetailModal
                    post={activePost}
                    onClose={() => setActivePost(null)}
                    onToggleLike={toggleLike}
                    onToggleSave={toggleSave}
                />
            )}
        </div>
    );
};

export default Community;
