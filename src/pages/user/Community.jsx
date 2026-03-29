import { useEffect, useState } from "react";
import {
  UsersThree,
  ChatCircle,
  ThumbsUp,
  TrendUp,
  Lightbulb,
  MagnifyingGlass,
  Plus,
  Star,
  Fire,
  Clock,
  Tag,
  BookOpen,
  ChalkboardTeacher,
  ArrowRight,
  Heart,
  BookmarkSimple,
  PaperPlaneRight,
  PencilSimple,
  TrashSimple,
  ListBullets,
  WarningCircle,
} from "@phosphor-icons/react";

import { useStore } from "../../store";
import {
  addForumComment,
  createForumPost,
  deleteForumPost,
  getForumCategories,
  getForumPostDetail,
  getForumPosts,
  getForumSavedPosts,
  getForumTrendingPosts,
  getForumUserPosts,
  toggleForumCommentLike,
  toggleForumSave,
  toggleForumVote,
  updateForumPost,
} from "../../services/forumService";

// ─── Mock Data ────────────────────────────────────────────
const CATEGORIES = [
  { id: "all", label: "Tất cả", icon: "🌐" },
  { id: "tips", label: "Mẹo học tập", icon: "💡" },
  { id: "recommend", label: "Gợi ý giáo viên", icon: "⭐" },
  { id: "resources", label: "Tài nguyên", icon: "📚" },
  { id: "question", label: "Hỏi đáp", icon: "❓" },
  { id: "experience", label: "Chia sẻ", icon: "💬" },
];

const UI_POST_TYPE_TO_BACKEND = {
  tips: "DISCUSSION",
  recommend: "DISCUSSION",
  resources: "RESOURCE_SHARE",
  question: "QUESTION",
  experience: "DISCUSSION",
};

const BACKEND_POST_TYPE_TO_UI = {
  DISCUSSION: "tips",
  QUESTION: "question",
  RESOURCE_SHARE: "resources",
};

const mapUiPostTypeToBackend = (uiType) =>
  UI_POST_TYPE_TO_BACKEND[uiType] || "DISCUSSION";
const mapBackendPostTypeToUi = (backendPostType) =>
  BACKEND_POST_TYPE_TO_UI[backendPostType] || "tips";

const SUGGESTION_ICON_POOL = [BookOpen, ChalkboardTeacher, Lightbulb, Star];

const normalizeKeyword = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const formatRelativeTimeLabel = (input) => {
  if (!input) return "";
  const createdAt = new Date(input);
  if (Number.isNaN(createdAt.getTime())) return "";

  const diffInSeconds = Math.floor((Date.now() - createdAt.getTime()) / 1000);
  if (diffInSeconds < 60) return `${Math.max(diffInSeconds, 1)} giây trước`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} ngày trước`;
  return createdAt.toLocaleDateString("vi-VN");
};

const CommentItem = ({ comment, depth = 0, onLike, onReply, timeOverride }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    onReply(comment.id, replyText.trim());
    setReplyText("");
    setShowReplyBox(false);
  };

  return (
    <div className={depth > 0 ? "ml-10 pl-4 border-l border-slate-200" : ""}>
      <div className="flex gap-3">
        <div
          className={`w-10 h-10 rounded-full ${comment.authorColor} text-white flex items-center justify-center font-bold text-sm shrink-0`}
        >
          {comment.authorInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-3 shadow-sm inline-block max-w-full">
            <p className="font-bold text-sm text-slate-900 mb-0.5">
              {comment.authorName}
            </p>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-1.5 ml-1 text-xs font-medium text-slate-500 flex-wrap">
            <span>
              {timeOverride ||
                comment.timeAgo ||
                formatRelativeTimeLabel(comment.createdAt)}
            </span>
            <button
              onClick={() => onLike(comment.id)}
              className={`hover:text-violet-600 ${comment.liked ? "text-violet-600 font-bold" : ""}`}
            >
              {comment.likeCount || 0} {comment.liked ? "Đã thích" : "Thích"}
            </button>
            <button
              onClick={() => setShowReplyBox((value) => !value)}
              className="hover:text-violet-600"
            >
              Phản hồi
            </button>
          </div>

          {showReplyBox && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Viết phản hồi..."
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-violet-400 bg-white"
              />
              <button
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${replyText.trim() ? "bg-violet-600 text-white hover:bg-violet-700" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
              >
                Gửi
              </button>
            </div>
          )}

          {Array.isArray(comment.replies) && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                  onLike={onLike}
                  onReply={onReply}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const buildSuggestedPosts = (user, mySkills, posts, trendingPosts) => {
  const interests = Array.isArray(user?.learningInterests)
    ? user.learningInterests
        .map((interest) => ({
          name: interest.skillName,
          iconEmoji: interest.skillIcon || null,
          desiredLevel: interest.desiredLevel || "",
          learningGoal: interest.learningGoal || "",
        }))
        .filter((interest) => Boolean(interest.name))
    : [];

  const fallbackTopics =
    interests.length > 0
      ? interests
      : (Array.isArray(mySkills) ? mySkills : [])
          .filter((skill) => skill?.type === "learn" && skill?.name)
          .map((skill) => ({
            name: skill.name,
            iconEmoji: null,
            desiredLevel: skill.level || "",
            learningGoal: "Học tốt hơn",
          }));

  const uniqueTopics = fallbackTopics.filter((topic, index, list) => {
    const topicKey = normalizeKeyword(topic.name);
    return (
      topicKey &&
      index ===
        list.findIndex((item) => normalizeKeyword(item.name) === topicKey)
    );
  });

  const sourcePosts = Array.from(
    new Map(
      [
        ...(Array.isArray(posts) ? posts : []),
        ...(Array.isArray(trendingPosts) ? trendingPosts : []),
      ].map((post) => [post.id, post]),
    ).values(),
  );

  const topTrendingPosts = (Array.isArray(trendingPosts) ? trendingPosts : [])
    .slice(0, 3)
    .sort((left, right) => {
      const leftScore =
        Number(left.comments || 0) * 2 + Number(left.likes || 0);
      const rightScore =
        Number(right.comments || 0) * 2 + Number(right.likes || 0);
      return rightScore - leftScore;
    });

  const relevanceScore = (post) => {
    const haystack = normalizeKeyword(
      [
        post.title,
        post.content,
        post.categoryName,
        ...(Array.isArray(post.tags) ? post.tags : []),
      ].join(" "),
    );

    return uniqueTopics.reduce((score, topic) => {
      const keyword = normalizeKeyword(topic.name);
      if (!keyword || !haystack.includes(keyword)) return score;
      return score + 10 + Math.min(keyword.length, 8);
    }, 0);
  };

  const relatedPosts = sourcePosts
    .map((post) => ({ ...post, suggestionScore: relevanceScore(post) }))
    .filter((post) => post.suggestionScore > 0)
    .sort((left, right) => {
      const scoreCompare = right.suggestionScore - left.suggestionScore;
      if (scoreCompare !== 0) return scoreCompare;

      const leftCount =
        Number(left.comments || 0) * 2 + Number(left.likes || 0);
      const rightCount =
        Number(right.comments || 0) * 2 + Number(right.likes || 0);
      return rightCount - leftCount;
    })
    .slice(0, 3);

  const fallbackTrending = topTrendingPosts
    .filter((post) => !relatedPosts.some((item) => item.id === post.id))
    .slice(0, 3 - relatedPosts.length);

  return [...relatedPosts, ...fallbackTrending].slice(0, 3);
};

// ─── MyPostCard ───────────────────────────────────────────
const MyPostCard = ({ post, onEdit, onDelete, onOpen }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
    {/* Header */}
    <div className="p-5 pb-3">
      <div className="flex items-start gap-3 mb-3 justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div
            className={`w-10 h-10 rounded-xl ${post.authorColor} text-white flex items-center justify-center font-extrabold text-sm shrink-0`}
          >
            {post.authorInitials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2">
              <span className="font-bold text-slate-900 text-sm">
                {post.authorName}
              </span>
              <span className="text-xs text-slate-300">·</span>
              <span className="text-xs text-slate-400 flex items-center gap-0.5">
                <Clock size={11} weight="regular" /> {post.timeAgo}
              </span>
            </div>
            <span
              className={`mt-1 inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${post.typeBg}`}
            >
              {post.typeLabel}
            </span>
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={() => onEdit(post)}
            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
            title="Chỉnh sửa"
          >
            <PencilSimple size={16} weight="regular" />
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Xóa"
          >
            <TrashSimple size={16} weight="regular" />
          </button>
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
      {post.tags.map((t) => (
        <span
          key={t}
          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 flex items-center gap-1"
        >
          <Tag size={9} weight="fill" /> {t}
        </span>
      ))}
    </div>

    {/* Stats */}
    <div className="px-5 py-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500 font-semibold">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <Heart size={14} /> {post.likes} Thích
        </span>
        <span className="flex items-center gap-1">
          <ChatCircle size={14} /> {post.comments} Bình luận
        </span>
      </div>
      <span className="flex items-center gap-1">
        <BookmarkSimple size={14} /> {post.saves} Lưu
      </span>
    </div>
  </div>
);

// ─── EditPostModal ────────────────────────────────────────
const EditPostModal = ({ post, categories, onClose, onSave }) => {
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    post?.categoryId || categories?.[0]?.id || "",
  );
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(post?.tags || []);

  useEffect(() => {
    if (!selectedCategoryId && (post?.categoryId || categories?.[0]?.id)) {
      setSelectedCategoryId(post?.categoryId || categories?.[0]?.id || "");
    }
  }, [categories, post?.categoryId, selectedCategoryId]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && tags.length < 5 && !tags.includes(t)) setTags((ts) => [...ts, t]);
    setTagInput("");
  };

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      const selectedCategory = categories.find(
        (categoryItem) => categoryItem.id === selectedCategoryId,
      );
      const selectedUiType =
        CATEGORY_UI_TYPE_BY_NAME[selectedCategory?.name] ||
        mapBackendPostTypeToUi(post?.postType);

      onSave({
        ...post,
        title: title.trim(),
        content: content.trim(),
        categoryId: selectedCategoryId || post?.categoryId,
        postType: mapUiPostTypeToBackend(selectedUiType),
        tags: tags,
      });
      onClose();
    }
  };

  if (!post) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            ✏️ Chỉnh sửa bài viết
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="p-6 space-y-4">
          {/* Category */}
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">
              Loại bài viết
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategoryId(c.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${selectedCategoryId === c.id ? "bg-violet-600 text-white border-violet-600" : "border-slate-200 text-slate-600 hover:border-violet-300"}`}
                >
                  {c.icon} {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1.5 block">
              Tiêu đề *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400 bg-slate-50 focus:bg-white transition-all"
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1.5 block">
              Nội dung *
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-400 bg-slate-50 focus:bg-white resize-none transition-all"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1.5 block">
              Tags (tối đa 5)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400 bg-slate-50 focus:bg-white transition-all"
              />
              <button
                onClick={addTag}
                className="px-4 py-2.5 bg-slate-100 hover:bg-violet-100 text-violet-600 font-bold text-sm rounded-xl border border-slate-200 transition-all"
              >
                + Thêm
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-bold px-2.5 py-1 rounded-full"
                  >
                    {t}
                    <button
                      onClick={() => setTags((ts) => ts.filter((x) => x !== t))}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
            >
              Huỷ
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim()}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${title.trim() && content.trim() ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── DeleteConfirmModal ───────────────────────────────────
const DeleteConfirmModal = ({ post, onClose, onConfirm }) => {
  if (!post) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
            <WarningCircle size={24} weight="fill" className="text-red-600" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg mb-2">
            Xác nhận xóa bài viết?
          </h3>
          <p className="text-sm text-slate-500 mb-2">
            Tiêu đề:{" "}
            <span className="font-semibold text-slate-700">{post.title}</span>
          </p>
          <p className="text-sm text-slate-400 mb-6">
            Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
            >
              Huỷ
            </button>
            <button
              onClick={() => {
                onConfirm(post.id);
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-red-600 text-white hover:bg-red-700 transition-all"
            >
              Xóa bài viết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PostCard ─────────────────────────────────────────────
const PostCard = ({ post, onToggleLike, onToggleSave, onOpen }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    {/* Header */}
    <div className="p-5 pb-3">
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-xl ${post.authorColor} text-white flex items-center justify-center font-extrabold text-sm shrink-0`}
        >
          {post.authorInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2">
            <span className="font-bold text-slate-900 text-sm">
              {post.authorName}
            </span>
            <span className="text-xs text-slate-400">{post.authorRole}</span>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs text-slate-400 flex items-center gap-0.5">
              <Clock size={11} weight="regular" /> {post.timeAgo}
            </span>
          </div>
          <span
            className={`mt-1 inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${post.typeBg}`}
          >
            {post.typeLabel}
          </span>
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
      {post.tags.map((t) => (
        <span
          key={t}
          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 flex items-center gap-1"
        >
          <Tag size={9} weight="fill" /> {t}
        </span>
      ))}
    </div>

    {/* Actions */}
    <div className="px-5 py-3 border-t border-slate-50 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onToggleLike(post.id)}
          className={`flex items-center gap-1.5 text-sm font-semibold transition-all ${post.liked ? "text-red-500" : "text-slate-400 hover:text-red-400"}`}
        >
          <Heart size={16} weight={post.liked ? "fill" : "regular"} />
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
        className={`flex items-center gap-1 text-xs font-semibold transition-all ${post.saved ? "text-violet-600" : "text-slate-400 hover:text-violet-500"}`}
      >
        <BookmarkSimple size={15} weight={post.saved ? "fill" : "regular"} />
        {post.saved ? "Đã lưu" : "Lưu"}
      </button>
    </div>
  </div>
);

// ─── New Post Modal ───────────────────────────────────────
const CATEGORY_UI_TYPE_BY_NAME = {
  "Mẹo học tập": "tips",
  "Gợi ý giáo viên": "recommend",
  "Tài nguyên": "resources",
  "Hỏi đáp": "question",
  "Chia sẻ": "experience",
};

const NewPostModal = ({ onClose, onSave, categories, defaultCategoryId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    defaultCategoryId || categories?.[0]?.id || "",
  );
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (!selectedCategoryId && (defaultCategoryId || categories?.[0]?.id)) {
      setSelectedCategoryId(defaultCategoryId || categories?.[0]?.id || "");
    }
  }, [categories, defaultCategoryId, selectedCategoryId]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && tags.length < 5 && !tags.includes(t)) setTags((ts) => [...ts, t]);
    setTagInput("");
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    const selectedCategory = categories.find(
      (categoryItem) => categoryItem.id === selectedCategoryId,
    );
    const selectedUiType =
      CATEGORY_UI_TYPE_BY_NAME[selectedCategory?.name] || "tips";

    onSave({
      title: title.trim(),
      content: content.trim(),
      categoryId: selectedCategoryId || defaultCategoryId,
      postType: mapUiPostTypeToBackend(selectedUiType),
      tags,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base">
            ✍️ Tạo bài viết mới
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="p-6 space-y-4">
          {/* Category */}
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">
              Loại bài viết
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategoryId(c.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${selectedCategoryId === c.id ? "bg-violet-600 text-white border-violet-600" : "border-slate-200 text-slate-600 hover:border-violet-300"}`}
                >
                  {c.icon} {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1.5 block">
              Tiêu đề *
            </label>
            <input
              type="text"
              placeholder="Tiêu đề bài viết..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400 bg-slate-50 focus:bg-white transition-all"
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1.5 block">
              Nội dung *
            </label>
            <textarea
              rows={5}
              placeholder="Chia sẻ kinh nghiệm, mẹo học, gợi ý giáo viên, hoặc đặt câu hỏi..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-400 bg-slate-50 focus:bg-white resize-none transition-all"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1.5 block">
              Tags (tối đa 5)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập tag rồi Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400 bg-slate-50 focus:bg-white transition-all"
              />
              <button
                onClick={addTag}
                className="px-4 py-2.5 bg-slate-100 hover:bg-violet-100 text-violet-600 font-bold text-sm rounded-xl border border-slate-200 transition-all"
              >
                + Thêm
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-bold px-2.5 py-1 rounded-full"
                  >
                    {t}
                    <button
                      onClick={() => setTags((ts) => ts.filter((x) => x !== t))}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
            >
              Huỷ
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim()}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${title.trim() && content.trim() ? "bg-violet-600 text-white hover:bg-violet-700 shadow-sm" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
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
const PostDetailModal = ({
  post,
  onClose,
  onToggleLike,
  onToggleSave,
  onAddComment,
  onToggleCommentLike,
  onReplyComment,
  commentTimeOverrides,
}) => {
  const [comment, setComment] = useState("");
  const comments = Array.isArray(post.comments_detail)
    ? post.comments_detail
    : [];

  if (!post) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Actions */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${post.typeBg}`}
          >
            {post.typeLabel}
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/30">
          <div className="p-6">
            {/* Author Info */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl ${post.authorColor} text-white flex items-center justify-center font-extrabold text-lg shrink-0`}
                >
                  {post.authorInitials}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">
                    {post.authorName}
                  </h4>
                  <p className="text-sm text-slate-500">{post.authorRole}</p>
                </div>
              </div>
              <span className="text-sm text-slate-400 flex items-center gap-1 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-100">
                <Clock size={14} /> {post.timeAgo}
              </span>
            </div>

            {/* Title & Content */}
            <h2 className="text-xl font-extrabold text-slate-900 mb-3">
              {post.title}
            </h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>

            {/* Tags */}
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs font-semibold px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center gap-1 shadow-sm"
                >
                  <Tag size={12} weight="fill" className="text-violet-500" />{" "}
                  {t}
                </span>
              ))}
            </div>

            {/* Post Stats & Actions */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => onToggleLike(post.id)}
                  className={`flex items-center gap-2 font-bold transition-all ${post.liked ? "text-red-500" : "text-slate-500 hover:text-red-500"}`}
                >
                  <Heart size={20} weight={post.liked ? "fill" : "regular"} />
                  {post.likes} <span className="hidden sm:inline">Thích</span>
                </button>
                <div className="flex items-center gap-2 font-bold text-slate-500">
                  <ChatCircle size={20} weight="regular" />
                  {post.comments}{" "}
                  <span className="hidden sm:inline">Bình luận</span>
                </div>
              </div>
              <button
                onClick={() => onToggleSave(post.id)}
                className={`flex items-center gap-2 font-bold transition-all ${post.saved ? "text-violet-600" : "text-slate-500 hover:text-violet-600"}`}
              >
                <BookmarkSimple
                  size={20}
                  weight={post.saved ? "fill" : "regular"}
                />
                {post.saved ? "Đã lưu" : "Lưu bài viết"}
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-slate-50 border-t border-slate-200">
            <div className="p-6">
              <h3 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                Bình luận{" "}
                <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                  {post.comments}
                </span>
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
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl pl-4 pr-12 py-2.5 text-sm outline-none focus:border-violet-400 focus:bg-white transition-all bg-white placeholder-slate-400"
                  />
                  <button
                    onClick={() => {
                      if (!comment.trim()) return;
                      onAddComment(post.id, comment.trim());
                      setComment("");
                    }}
                    disabled={!comment.trim()}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${comment.trim() ? "text-violet-600 bg-violet-50 hover:bg-violet-100" : "text-slate-300"}`}
                  >
                    <PaperPlaneRight size={16} weight="fill" />
                  </button>
                </div>
              </div>

              {/* Nested comments from backend */}
              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((commentItem) => (
                    <CommentItem
                      key={commentItem.id}
                      comment={commentItem}
                      onLike={(commentId) =>
                        onToggleCommentLike(post.id, commentId)
                      }
                      onReply={(parentCommentId, replyContent) =>
                        onReplyComment(post.id, parentCommentId, replyContent)
                      }
                      timeOverride={commentTimeOverrides?.[commentItem.id]}
                    />
                  ))
                ) : (
                  <p className="text-sm text-slate-500 text-center py-6">
                    Chưa có bình luận nào.
                  </p>
                )}
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
  const { user, mySkills } = useStore();
  const [activeTab, setActiveTab] = useState("community");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("hot");
  const [search, setSearch] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);
  const [activePost, setActivePost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [defaultPostCategoryId, setDefaultPostCategoryId] = useState("");
  const [commentTimeOverrides, setCommentTimeOverrides] = useState({});
  const [myPostsLoaded, setMyPostsLoaded] = useState(false);
  const [feedMeta, setFeedMeta] = useState({ page: 0, size: 50 });

  const currentCategoryId = defaultPostCategoryId || categories?.[0]?.id || "";

  const loadFeedByMode = async (
    mode,
    shouldManageLoading = true,
    knownCategories = categories,
  ) => {
    if (shouldManageLoading) {
      setLoading(true);
    }
    setError("");

    try {
      if (mode === "saved") {
        const [savedPage, categoryList] = await Promise.all([
          getForumSavedPosts({ page: feedMeta.page, size: feedMeta.size }),
          knownCategories.length > 0
            ? Promise.resolve(knownCategories)
            : getForumCategories(),
        ]);
        setPosts(savedPage?.content || []);
        if (knownCategories.length === 0) {
          setCategories(categoryList || []);
        }
      } else if (mode === "hot") {
        const [trendingList, categoryList] = await Promise.all([
          getForumTrendingPosts(10),
          knownCategories.length > 0
            ? Promise.resolve(knownCategories)
            : getForumCategories(),
        ]);
        setPosts(trendingList || []);
        setTrendingPosts((trendingList || []).slice(0, 5));
        if (knownCategories.length === 0) {
          setCategories(categoryList || []);
        }
      } else {
        const [page, categoryList] = await Promise.all([
          getForumPosts({ page: feedMeta.page, size: feedMeta.size }),
          knownCategories.length > 0
            ? Promise.resolve(knownCategories)
            : getForumCategories(),
        ]);
        setPosts(page?.content || []);
        if (knownCategories.length === 0) {
          setCategories(categoryList || []);
        }
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Không tải được dữ liệu forum.",
      );
    } finally {
      if (shouldManageLoading) {
        setLoading(false);
      }
    }
  };

  const loadMyPosts = async (shouldManageLoading = true) => {
    if (!user?.id) return;

    if (shouldManageLoading) {
      setLoading(true);
    }
    setError("");

    try {
      const userPostsPage = await getForumUserPosts(user.id, {
        page: 0,
        size: 50,
      });
      setMyPosts(userPostsPage?.content || []);
      setMyPostsLoaded(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Không tải được bài viết của tôi.",
      );
    } finally {
      if (shouldManageLoading) {
        setLoading(false);
      }
    }
  };

  const refreshPost = async (postId) => {
    const updatedPost = await getForumPostDetail(postId);
    if (!updatedPost) return;

    setPosts((current) =>
      current.map((post) => (post.id === postId ? updatedPost : post)),
    );
    setMyPosts((current) =>
      current.map((post) => (post.id === postId ? updatedPost : post)),
    );
    setActivePost((current) =>
      current?.id === postId ? updatedPost : current,
    );
  };

  const handleOpenPost = async (post) => {
    try {
      const detail = await getForumPostDetail(post.id);
      setActivePost(detail || post);
    } catch {
      setActivePost(post);
    }
  };

  const loadForumData = async () => {
    setLoading(true);
    setError("");
    try {
      const categoryPromise =
        categories.length > 0
          ? Promise.resolve(categories)
          : getForumCategories();

      const feedPromise = (async () => {
        if (sortBy === "saved") {
          const savedPage = await getForumSavedPosts({
            page: feedMeta.page,
            size: feedMeta.size,
          });
          return savedPage?.content || [];
        }
        if (sortBy === "new") {
          const page = await getForumPosts({
            page: feedMeta.page,
            size: feedMeta.size,
          });
          return page?.content || [];
        }
        const trendingList = await getForumTrendingPosts(10);
        return trendingList || [];
      })();

      const trendingSidebarPromise =
        sortBy === "hot" ? feedPromise : getForumTrendingPosts(5);

      const [categoryList, initialFeed, trendingList] = await Promise.all([
        categoryPromise,
        feedPromise,
        trendingSidebarPromise,
      ]);

      setPosts(initialFeed || []);
      setTrendingPosts((trendingList || []).slice(0, 5));
      setCategories(categoryList || []);
      if (!defaultPostCategoryId) {
        setDefaultPostCategoryId(categoryList?.[0]?.id || "");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Không tải được dữ liệu forum.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForumData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (categories.length === 0) return;
    loadFeedByMode(sortBy, true, categories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  useEffect(() => {
    if (activeTab !== "my-posts" || myPostsLoaded) return;
    loadMyPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const toggleLike = async (id) => {
    try {
      await toggleForumVote(id, "UPVOTE");
      await refreshPost(id);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể cập nhật lượt thích.",
      );
    }
  };

  const toggleSave = async (id) => {
    try {
      await toggleForumSave(id);
      if (sortBy === "saved") {
        await loadFeedByMode("saved");
        return;
      }
      await refreshPost(id);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể cập nhật trạng thái lưu.",
      );
    }
  };

  const handleCreatePost = async (payload) => {
    try {
      setSaving(true);
      const categoryId = payload.categoryId || currentCategoryId;
      if (!categoryId) {
        setError("Chưa có danh mục forum hợp lệ để tạo bài viết.");
        return;
      }
      const createdPost = await createForumPost({
        categoryId,
        title: payload.title,
        content: payload.content,
        postType: payload.postType,
        tags: payload.tags,
      });
      setShowNewPost(false);
      if (activeTab === "my-posts") {
        setMyPosts((current) => {
          const nextPosts = [
            createdPost,
            ...current.filter((post) => post.id !== createdPost.id),
          ];
          return nextPosts;
        });
        setMyPostsLoaded(true);
        setActiveTab("my-posts");
      } else {
        await loadForumData();
        setMyPostsLoaded(false);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể tạo bài viết.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEditPost = async (updatedPost) => {
    try {
      setSaving(true);
      const savedPost = await updateForumPost(updatedPost.id, {
        title: updatedPost.title,
        content: updatedPost.content,
        postType: updatedPost.postType,
        tags: updatedPost.tags,
        solved: updatedPost.solved,
      });

      setPosts((current) =>
        current.map((post) =>
          post.id === updatedPost.id ? { ...post, ...savedPost } : post,
        ),
      );
      setMyPosts((current) =>
        current.map((post) =>
          post.id === updatedPost.id ? { ...post, ...savedPost } : post,
        ),
      );
      setActivePost((current) =>
        current?.id === updatedPost.id ? { ...current, ...savedPost } : current,
      );

      setEditingPost(null);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể cập nhật bài viết.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      setSaving(true);
      await deleteForumPost(id);
      setDeletingPostId(null);
      setPosts((current) => current.filter((post) => post.id !== id));
      setMyPosts((current) => current.filter((post) => post.id !== id));
      setActivePost((current) => (current?.id === id ? null : current));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể xóa bài viết.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async (postId, content, parentCommentId = null) => {
    try {
      setSaving(true);
      const createdComment = await addForumComment(postId, {
        content,
        parentCommentId,
      });
      if (createdComment?.id) {
        setCommentTimeOverrides((current) => ({
          ...current,
          [createdComment.id]: "vừa xong",
        }));
      }
      await refreshPost(postId);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể gửi bình luận.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReplyComment = async (postId, parentCommentId, content) => {
    await handleAddComment(postId, content, parentCommentId);
  };

  const handleToggleCommentLike = async (postId, commentId) => {
    try {
      setSaving(true);
      await toggleForumCommentLike(commentId);
      await refreshPost(postId);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể thích bình luận.",
      );
    } finally {
      setSaving(false);
    }
  };

  const visibleCategories = [
    { id: "all", label: "Tất cả", icon: "🌐" },
    ...categories,
  ];

  const filtered = posts.filter((post) => {
    const matchCat =
      activeCategory === "all" || post.categoryId === activeCategory;
    const searchText = search.trim().toLowerCase();
    const matchSearch =
      !searchText ||
      post.title.toLowerCase().includes(searchText) ||
      post.content.toLowerCase().includes(searchText) ||
      post.categoryName.toLowerCase().includes(searchText);
    return matchCat && matchSearch;
  });

  const sorted = [...filtered];

  const suggestedPosts = buildSuggestedPosts(
    user,
    mySkills,
    posts,
    trendingPosts,
  );

  const handleSuggestionClick = async (post) => {
    setActiveTab("community");
    setActiveCategory("all");
    setSearch("");

    try {
      const detail = await getForumPostDetail(post.id);
      setActivePost(detail || post);
    } catch {
      setActivePost(post);
    }
  };

  const myStats = [
    {
      icon: ChatCircle,
      label: "Tổng bài viết",
      value: myPosts.length.toString(),
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      icon: Heart,
      label: "Tổng lượt thích",
      value: myPosts
        .reduce((sum, post) => sum + Number(post.likes || 0), 0)
        .toString(),
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      icon: ChatCircle,
      label: "Tổng bình luận",
      value: myPosts
        .reduce((sum, post) => sum + Number(post.comments || 0), 0)
        .toString(),
      color: "text-sky-600",
      bg: "bg-sky-50",
    },
    {
      icon: BookmarkSimple,
      label: "Tổng lần lưu",
      value: myPosts
        .reduce((sum, post) => sum + Number(post.saves || 0), 0)
        .toString(),
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto font-sans pb-14 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* ─── HEADER WITH TABS ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <UsersThree
                size={26}
                weight="duotone"
                className="text-violet-500"
              />
              Cộng đồng SkillSync
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Trao đổi kinh nghiệm · gợi ý giáo viên · chia sẻ tài nguyên học
              tập
            </p>
          </div>
          {/* Tabs */}
          <div className="hidden lg:flex gap-2 ml-auto">
            <button
              onClick={() => {
                setActiveTab("community");
                setActiveCategory("all");
              }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "community" ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              <UsersThree size={14} weight="fill" className="inline mr-1.5" />
              Cộng đồng
            </button>
            <button
              onClick={() => setActiveTab("my-posts")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "my-posts" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              <ListBullets size={14} weight="fill" className="inline mr-1.5" />
              Bài viết của tôi
            </button>
          </div>
        </div>
        {activeTab === "community" && (
          <button
            onClick={() => setShowNewPost(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-xl shadow-md shadow-violet-200 active:scale-95 transition-all shrink-0"
          >
            <Plus size={16} weight="bold" /> Đăng bài
          </button>
        )}
      </div>

      {/* ─── Mobile Tabs ─── */}
      <div className="lg:hidden flex gap-2 bg-white rounded-xl p-1.5 border border-slate-100">
        <button
          onClick={() => {
            setActiveTab("community");
            setActiveCategory("all");
          }}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "community" ? "bg-violet-600 text-white" : "text-slate-600"}`}
        >
          Cộng đồng
        </button>
        <button
          onClick={() => setActiveTab("my-posts")}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "my-posts" ? "bg-slate-900 text-white" : "text-slate-600"}`}
        >
          Bài của tôi
        </button>
      </div>

      {/* ─── CONTENT ─── */}
      {activeTab === "community" ? (
        <>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* ─── MAIN FEED ─── */}
            <div className="flex-1 space-y-4">
              {/* Search & sort bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <MagnifyingGlass
                    size={16}
                    weight="regular"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Tìm kiếm bài viết..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-violet-400 transition-all"
                  />
                </div>
                <div className="flex gap-1.5 bg-white border border-slate-200 rounded-xl p-1.5">
                  {[
                    { id: "hot", label: "🔥 Nổi bật" },
                    { id: "new", label: "🕐 Mới nhất" },
                    { id: "saved", label: "🔖 Đã lưu" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSortBy(s.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sortBy === s.id ? "bg-violet-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category chips */}
              <div className="flex gap-2 flex-wrap">
                {visibleCategories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${activeCategory === c.id ? "bg-violet-600 text-white border-violet-600" : "bg-white border-slate-200 text-slate-600 hover:border-violet-300"}`}
                  >
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>

              {/* Post list */}
              {loading ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-500">
                  Đang tải bài viết...
                </div>
              ) : sorted.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                  <p className="text-3xl mb-3">🔍</p>
                  <p className="font-bold text-slate-700">
                    Không tìm thấy bài viết nào
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Thử thay đổi từ khoá hoặc danh mục
                  </p>
                </div>
              ) : (
                sorted.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onToggleLike={toggleLike}
                    onToggleSave={toggleSave}
                    onOpen={() => handleOpenPost(post)}
                  />
                ))
              )}
            </div>

            {/* ─── SIDEBAR ─── */}
            <div className="lg:w-72 space-y-4 shrink-0">
              {/* Trending */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center gap-2">
                  <TrendUp
                    size={16}
                    weight="duotone"
                    className="text-orange-500"
                  />{" "}
                  Đang thảo luận nhiều
                </h3>
                <div className="space-y-3">
                  {trendingPosts.map((t, i) => (
                    <button key={i} className="w-full text-left group">
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`text-sm font-extrabold shrink-0 w-5 ${i === 0 ? "text-orange-500" : "text-slate-400"}`}
                        >
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-slate-700 group-hover:text-violet-600 transition-colors line-clamp-2 leading-relaxed">
                            {t.hot && (
                              <Fire
                                size={11}
                                weight="fill"
                                className="text-orange-400 inline mr-1"
                              />
                            )}
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
              <div className="bg-linear-to-br from-violet-600 to-fuchsia-600 rounded-2xl p-5 text-white shadow-lg shadow-violet-200/40">
                <div className="mb-1">
                  <h3 className="font-extrabold text-base flex items-center gap-2">
                    <Star size={16} weight="duotone" /> Gợi ý cho bạn
                  </h3>
                  <p className="text-xs text-white/70 mt-1">
                    Dựa trên hồ sơ của bạn và các bài đang có trong cộng đồng
                  </p>
                </div>

                <div className="mt-4 space-y-2.5">
                  {suggestedPosts.length > 0 ? (
                    suggestedPosts.map((post, index) => (
                      <button
                        key={post.id}
                        type="button"
                        className="w-full text-left rounded-2xl p-3 bg-white/10 hover:bg-white/15 transition-all"
                        onClick={() => handleSuggestionClick(post)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0 font-bold text-xs">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-bold leading-snug line-clamp-2">
                                {post.title}
                              </p>
                              <ArrowRight
                                size={14}
                                weight="bold"
                                className="text-white/60 shrink-0 mt-0.5"
                              />
                            </div>
                            <p className="text-[11px] text-white/70 mt-1 flex items-center gap-1.5 flex-wrap">
                              <span>{post.categoryName || "Community"}</span>
                              <span>·</span>
                              <ChatCircle size={10} />
                              <span>
                                {post.comments > 0
                                  ? `${post.comments} bình luận`
                                  : "chưa có bình luận"}
                              </span>
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-white/70 bg-white/10 rounded-2xl p-3">
                      Chưa tìm thấy bài viết gợi ý phù hợp.
                    </p>
                  )}
                </div>
              </div>

              {/* Rules */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-extrabold text-slate-900 text-sm mb-3">
                  📋 Nội quy cộng đồng
                </h3>
                <ul className="space-y-2 text-xs text-slate-500">
                  {[
                    "Tôn trọng và lịch sự với mọi người",
                    "Không spam hoặc quảng cáo",
                    "Chia sẻ thông tin chính xác",
                    "Không đăng nội dung vi phạm bản quyền",
                    "Phản hồi tích cực và có ích",
                  ].map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-violet-400 font-bold shrink-0">
                        ✓
                      </span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : (
        // ─── MY POSTS TAB ───
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <ListBullets
                    size={24}
                    weight="fill"
                    className="text-slate-900"
                  />
                  Bài viết của tôi
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Quản lý, chỉnh sửa hoặc xóa bài viết của bạn
                </p>
              </div>
              <button
                onClick={() => {
                  setShowNewPost(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-xl shadow-md shadow-violet-200 active:scale-95 transition-all"
              >
                <Plus size={16} weight="bold" /> Đăng bài mới
              </button>
            </div>

            {/* Stats on top */}
            {myPosts.length > 0 && (
              <div className="mb-6 pb-6 border-b border-slate-200">
                <p className="text-sm font-bold text-slate-700 mb-3">
                  📊 Thống kê của bạn
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {myStats.map((s, i) => (
                    <div
                      key={i}
                      className="bg-slate-50 rounded-xl border border-slate-100 px-3 py-3 flex items-center gap-2"
                    >
                      <div
                        className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center shrink-0`}
                      >
                        <s.icon
                          size={16}
                          weight="duotone"
                          className={s.color}
                        />
                      </div>
                      <div>
                        <p className="text-base font-extrabold text-slate-900">
                          {s.value}
                        </p>
                        <p className="text-[10px] text-slate-500">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {myPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-3xl mb-3">✍️</p>
                <p className="font-bold text-slate-700">
                  Bạn chưa đăng bài viết nào
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Bắt đầu chia sẻ kinh nghiệm hoặc mẹo học của bạn ngay
                </p>
                <button
                  onClick={() => {
                    setActiveTab("community");
                    setShowNewPost(true);
                  }}
                  className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-lg transition-all"
                >
                  Đăng bài ngay
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {myPosts.map((post) => (
                  <MyPostCard
                    key={post.id}
                    post={post}
                    onEdit={setEditingPost}
                    onDelete={setDeletingPostId}
                    onOpen={() => handleOpenPost(post)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showNewPost && (
        <NewPostModal
          onClose={() => setShowNewPost(false)}
          onSave={handleCreatePost}
          categories={categories}
          defaultCategoryId={currentCategoryId}
        />
      )}
      {activePost && (
        <PostDetailModal
          post={activePost}
          onClose={() => setActivePost(null)}
          onToggleLike={toggleLike}
          onToggleSave={toggleSave}
          onAddComment={handleAddComment}
          onToggleCommentLike={handleToggleCommentLike}
          onReplyComment={handleReplyComment}
          commentTimeOverrides={commentTimeOverrides}
        />
      )}
      {editingPost && (
        <EditPostModal
          post={editingPost}
          categories={categories}
          onClose={() => setEditingPost(null)}
          onSave={handleEditPost}
        />
      )}
      {deletingPostId && (
        <DeleteConfirmModal
          post={myPosts.find((p) => p.id === deletingPostId)}
          onClose={() => setDeletingPostId(null)}
          onConfirm={handleDeletePost}
        />
      )}
    </div>
  );
};

export default Community;
