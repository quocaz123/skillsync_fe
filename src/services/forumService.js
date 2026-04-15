import httpClient from "../configuration/axiosClient";
import { API_ENDPOINTS } from "../configuration/apiEndpoints";

const { FORUM } = API_ENDPOINTS;
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/skillsync";

const POST_TYPE_META = {
  DISCUSSION: {
    id: "discussion",
    label: "💬 Thảo luận",
    bg: "bg-violet-100 text-violet-700",
  },
  QUESTION: {
    id: "question",
    label: "❓ Hỏi đáp",
    bg: "bg-red-100 text-red-700",
  },
  RESOURCE_SHARE: {
    id: "resources",
    label: "📚 Tài nguyên",
    bg: "bg-green-100 text-green-700",
  },
};

const UI_POST_TYPE_META = {
  discussion: {
    postType: "DISCUSSION",
    label: "💬 Thảo luận",
    bg: "bg-violet-100 text-violet-700",
  },
  recommend: {
    postType: "DISCUSSION",
    label: "⭐ Gợi ý",
    bg: "bg-blue-100 text-blue-700",
  },
  resources: {
    postType: "RESOURCE_SHARE",
    label: "📚 Tài nguyên",
    bg: "bg-green-100 text-green-700",
  },
  question: {
    postType: "QUESTION",
    label: "❓ Hỏi đáp",
    bg: "bg-red-100 text-red-700",
  },
  experience: {
    postType: "DISCUSSION",
    label: "💬 Chia sẻ",
    bg: "bg-purple-100 text-purple-700",
  },
};

const AVATAR_COLORS = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-teal-500",
];

function unwrap(res) {
  return res?.data ?? res?.result ?? res;
}

function getInitials(name) {
  const value = String(name || "User").trim();
  if (!value) return "U";
  const parts = value.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getAvatarColor(name) {
  const value = String(name || "User");
  const index =
    Math.abs([...value].reduce((sum, char) => sum + char.charCodeAt(0), 0)) %
    AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function formatRelativeTime(input) {
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
}

function normalizeComment(comment) {
  if (!comment) return null;
  return {
    id: comment.id,
    postId: comment.postId,
    parentCommentId: comment.parentCommentId ?? null,
    authorId: comment.authorId,
    authorName: comment.authorName || "Người dùng",
    authorRole: comment.authorRole || "USER",
    authorAvatar: comment.authorAvatar || null,
    authorInitials: getInitials(comment.authorName),
    authorColor: getAvatarColor(comment.authorName),
    content: comment.content || "",
    likeCount: Number(comment.likeCount ?? 0),
    liked: Boolean(comment.liked),
    timeAgo: formatRelativeTime(comment.createdAt),
    replies: Array.isArray(comment.replies)
      ? comment.replies.map(normalizeComment).filter(Boolean)
      : [],
    createdAt: comment.createdAt || null,
    updatedAt: comment.updatedAt || null,
  };
}

function normalizeCommentPreview(comment) {
  return {
    initials: getInitials(comment?.authorName),
    color: getAvatarColor(comment?.authorName),
    name: comment?.authorName || "Người dùng",
    text: comment?.content || "",
  };
}

export function mapForumCategory(category) {
  if (!category) return null;
  return {
    id: category.id,
    label: category.name,
    name: category.name,
    description: category.description || "",
    icon: category.icon || "📌",
    displayOrder: category.displayOrder ?? 0,
    createdAt: category.createdAt || null,
  };
}

export function mapForumPost(post) {
  if (!post) return null;

  const typeMeta =
    UI_POST_TYPE_META[String(post.postType || "").toLowerCase()] ||
    POST_TYPE_META[post.postType] ||
    POST_TYPE_META.DISCUSSION;
  const comments = Array.isArray(post.comments)
    ? post.comments.map(normalizeComment).filter(Boolean)
    : [];
  const previewComments = comments.slice(0, 2).map(normalizeCommentPreview);
  const authorName = post.authorName || "Người dùng";

  return {
    id: post.id,
    type: String(post.categoryId || "").toLowerCase(),
    typeLabel: typeMeta.label,
    typeBg: typeMeta.bg,
    categoryLabel: post.categoryName || typeMeta.label,
    authorInitials: getInitials(authorName),
    authorColor: getAvatarColor(authorName),
    authorName,
    authorRole: post.authorRole || "USER",
    authorAvatar: post.authorAvatar || null,
    timeAgo: formatRelativeTime(post.updatedAt || post.createdAt),
    title: post.title || "",
    content: post.content || "",
    tags: Array.isArray(post.tags) ? post.tags : [],
    likes: Number(post.upvotes ?? 0),
    downvotes: Number(post.downvotes ?? 0),
    comments: Number(post.commentCount ?? comments.length),
    saves: Number(post.saveCount ?? 0),
    liked: Boolean(post.liked),
    saved: Boolean(post.saved),
    solved: Boolean(post.solved),
    status: post.status || "APPROVED",
    rejectionReason: post.rejectionReason || null,
    reviewedAt: post.reviewedAt || null,
    reviewedByEmail: post.reviewedByEmail || null,
    comments_preview: previewComments,
    comments_detail: comments,
    categoryId: post.categoryId || null,
    categoryName: post.categoryName || "",
    postType: post.postType || "DISCUSSION",
    createdAt: post.createdAt || null,
    updatedAt: post.updatedAt || null,
  };
}

function normalizePage(page) {
  if (!page)
    return { content: [], totalElements: 0, totalPages: 0, number: 0, size: 0 };
  if (Array.isArray(page)) {
    return {
      content: page,
      totalElements: page.length,
      totalPages: 1,
      number: 0,
      size: page.length,
    };
  }

  // Backend có thể trả 1 trong 2 dạng:
  // - Spring Page JSON: { content, number, size, totalElements, totalPages, ... }
  // - Custom PageResponse: { data, currentPage, pageSize, totalElements, totalPages }
  const content = Array.isArray(page.content)
    ? page.content
    : Array.isArray(page.data)
      ? page.data
      : [];

  const number =
    page.number ??
    page.currentPage ??
    0;

  const size =
    page.size ??
    page.pageSize ??
    0;

  return {
    content,
    totalElements: page.totalElements ?? content.length ?? 0,
    totalPages: page.totalPages ?? 0,
    number,
    size,
    first: page.first,
    last: page.last,
    numberOfElements:
      page.numberOfElements ??
      content.length,
  };
}

export async function getForumCategories() {
  const res = await httpClient.get(FORUM.CATEGORIES);
  return (unwrap(res) || []).map(mapForumCategory).filter(Boolean);
}

export async function getForumPosts(params = {}) {
  const res = await httpClient.get(FORUM.POSTS, { params });
  const page = normalizePage(unwrap(res));
  return {
    ...page,
    content: (page.content || []).map(mapForumPost).filter(Boolean),
  };
}

export async function getForumTrendingPosts(limit = 10) {
  const res = await httpClient.get(FORUM.TRENDING, { params: { limit } });
  const page = normalizePage(unwrap(res));
  const content = (page.content || []).map(mapForumPost).filter(Boolean);
  return content.slice(0, limit);
}

export async function getForumPostDetail(postId) {
  const res = await httpClient.get(FORUM.POST_DETAIL(postId));
  return mapForumPost(unwrap(res));
}

export async function getForumUserPosts(userId, params = {}) {
  const res = await httpClient.get(FORUM.USER_POSTS(userId), { params });
  const page = normalizePage(unwrap(res));
  return {
    ...page,
    content: (page.content || []).map(mapForumPost).filter(Boolean),
  };
}

export async function getForumSavedPosts(params = {}) {
  const res = await httpClient.get(FORUM.SAVED_POSTS, { params });
  const page = normalizePage(unwrap(res));
  return {
    ...page,
    content: (page.content || []).map(mapForumPost).filter(Boolean),
  };
}

export async function createForumPost(payload) {
  const res = await httpClient.post(FORUM.CREATE_POST, payload);
  return mapForumPost(unwrap(res));
}

export async function updateForumPost(postId, payload) {
  const res = await httpClient.put(FORUM.UPDATE_POST(postId), payload);
  return mapForumPost(unwrap(res));
}

export async function deleteForumPost(postId) {
  await httpClient.delete(FORUM.DELETE_POST(postId));
}

export async function toggleForumVote(postId, voteType) {
  const res = await httpClient.post(FORUM.TOGGLE_VOTE(postId), { voteType });
  return unwrap(res);
}

export async function getForumVoteCounts(postId) {
  const res = await httpClient.get(FORUM.VOTE_COUNTS(postId));
  return unwrap(res);
}

export async function toggleForumSave(postId) {
  await httpClient.post(FORUM.TOGGLE_SAVE(postId));
}

export async function addForumComment(postId, payload) {
  const res = await httpClient.post(FORUM.ADD_COMMENT(postId), payload);
  return normalizeComment(unwrap(res));
}

export async function toggleForumCommentLike(commentId) {
  const res = await httpClient.post(FORUM.TOGGLE_COMMENT_VOTE(commentId));
  return normalizeComment(unwrap(res));
}

export function openForumEventStream() {
  return new EventSource(`${API_BASE_URL}${FORUM.EVENTS}`, {
    withCredentials: true,
  });
}

export async function updateForumComment(commentId, payload) {
  const res = await httpClient.put(FORUM.UPDATE_COMMENT(commentId), payload);
  return normalizeComment(unwrap(res));
}

export async function deleteForumComment(commentId) {
  await httpClient.delete(FORUM.DELETE_COMMENT(commentId));
}
