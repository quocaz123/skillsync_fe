import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  MagnifyingGlass,
  Eye,
  CheckCircle,
  XCircle,
  CircleNotch,
  Clock,
  UserCircle,
  Tag,
  Warning,
} from "@phosphor-icons/react";
import {
  getAdminForumPosts,
  verifyForumPost,
} from "../../services/adminForumService";
import { openForumEventStream } from "../../services/forumService";

const statusConfig = {
  PENDING: {
    label: "Chờ duyệt",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-100",
  },
  APPROVED: {
    label: "Đã duyệt",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-100",
  },
  REJECTED: {
    label: "Từ chối",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-100",
  },
};

const ModerationBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.PENDING;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      {cfg.label}
    </span>
  );
};

const AdminForumPosts = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("PENDING");
  const [search, setSearch] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [notice, setNotice] = useState(null);
  const [noticeTimer, setNoticeTimer] = useState(null);

  const loadData = async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
    }
    try {
      const data = await getAdminForumPosts(null);
      setAllPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load forum posts", err);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line

  useEffect(() => {
    const eventSource = openForumEventStream();
    const handleChange = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (!payload?.postId) return;

        const nextPost = {
          id: payload.postId,
          title: payload.title || "",
          content: payload.content || "",
          authorId: payload.authorId || null,
          authorName: payload.authorName || "Người dùng",
          authorEmail: payload.authorEmail || "",
          authorRole: payload.authorRole || "USER",
          authorAvatar: payload.authorAvatar || null,
          categoryId: payload.categoryId || null,
          categoryName: payload.categoryName || "",
          tags: Array.isArray(payload.tags) ? payload.tags : [],
          status: payload.status || "PENDING",
          rejectionReason: payload.rejectionReason || null,
          reviewedAt: payload.reviewedAt || null,
          reviewedByEmail: payload.reviewedByEmail || null,
          solved: Boolean(payload.solved),
          upvotes: payload.upvotes ?? 0,
          downvotes: payload.downvotes ?? 0,
          commentCount: payload.commentCount ?? 0,
          saveCount: payload.saveCount ?? 0,
          createdAt: payload.createdAt || null,
          updatedAt: payload.updatedAt || null,
        };

        setAllPosts((current) => {
          if (payload.action === "DELETE") {
            return current.filter((item) => item.id !== payload.postId);
          }

          const withoutCurrent = current.filter(
            (item) => item.id !== payload.postId,
          );

          return [nextPost, ...withoutCurrent];
        });

        setSelectedPost((current) =>
          current?.id === payload.postId
            ? payload.action === "DELETE"
              ? null
              : { ...current, ...nextPost }
            : current,
        );

        if (payload.status === "APPROVED") {
          setNotice({
            type: "success",
            message: `Đã duyệt bài "${payload.title || ""}".`,
          });
        } else if (payload.status === "REJECTED") {
          setNotice({
            type: "info",
            message: `Đã từ chối bài "${payload.title || ""}".`,
          });
        }
      } catch {
        // ignore malformed SSE payloads
      }
    };
    eventSource.addEventListener("forum-post-changed", handleChange);
    return () => {
      eventSource.removeEventListener("forum-post-changed", handleChange);
      eventSource.close();
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    setRejectionReason("");
  }, [selectedPost?.id]);

  useEffect(() => {
    if (!notice) return undefined;
    if (noticeTimer) clearTimeout(noticeTimer);
    const timer = setTimeout(() => setNotice(null), 4000);
    setNoticeTimer(timer);
    return () => clearTimeout(timer);
  }, [notice]); // eslint-disable-line

  useEffect(() => {
    return () => {
      if (noticeTimer) clearTimeout(noticeTimer);
    };
  }, [noticeTimer]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const byStatus =
      filterStatus === "ALL"
        ? allPosts
        : allPosts.filter((post) => post.status === filterStatus);

    if (!q) return byStatus;

    return byStatus.filter((post) =>
      [
        post.title,
        post.content,
        post.authorName,
        post.authorEmail,
        post.categoryName,
      ]
        .filter(Boolean)
        .some((f) => String(f).toLowerCase().includes(q)),
    );
  }, [allPosts, filterStatus, search]);

  const stats = useMemo(
    () => ({
      pending: allPosts.filter((p) => p.status === "PENDING").length,
      approved: allPosts.filter((p) => p.status === "APPROVED").length,
      rejected: allPosts.filter((p) => p.status === "REJECTED").length,
    }),
    [allPosts],
  );

  const handleModerate = async (post, action) => {
    if (!post) return;
    if (action === "REJECTED" && !rejectionReason.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }
    setProcessing(true);
    try {
      await verifyForumPost(post.id, action, rejectionReason.trim() || null);
      setAllPosts((current) =>
        current.map((item) =>
          item.id === post.id
            ? {
                ...item,
                status: action,
                rejectionReason:
                  action === "REJECTED" ? rejectionReason.trim() || null : null,
              }
            : item,
        ),
      );
      setSelectedPost(null);
      setRejectionReason("");
      setNotice({
        type: action === "APPROVED" ? "success" : "info",
        message:
          action === "APPROVED"
            ? `Đã duyệt bài "${post.title}".`
            : `Đã từ chối bài "${post.title}".`,
      });
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể xử lý bài viết",
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6 pb-4">
      {notice && (
        <div
          className={`border text-sm rounded-xl px-4 py-3 ${notice.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-sky-50 border-sky-200 text-sky-700"}`}
        >
          {notice.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen size={22} weight="duotone" className="text-[#5A63F6]" />{" "}
            Duyệt bài cộng đồng
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Duyệt các bài do người dùng đăng trước khi hiển thị công khai
          </p>
        </div>
        <div className="flex bg-slate-100/80 p-1 rounded-xl w-fit border border-slate-200 shadow-inner flex-wrap gap-1">
          {["PENDING", "APPROVED", "REJECTED", "ALL"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${filterStatus === status ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {status === "ALL" ? "Tất cả" : statusConfig[status].label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          {
            Icon: Warning,
            label: "Chờ duyệt",
            value: stats.pending,
            color: "text-amber-700",
            bg: "bg-amber-50",
            weight: "duotone",
          },
          {
            Icon: CheckCircle,
            label: "Đã duyệt",
            value: stats.approved,
            color: "text-emerald-700",
            bg: "bg-emerald-50",
            weight: "fill",
          },
          {
            Icon: XCircle,
            label: "Từ chối",
            value: stats.rejected,
            color: "text-rose-700",
            bg: "bg-rose-50",
            weight: "fill",
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`${item.bg} border border-slate-100 rounded-2xl p-5 flex items-center gap-4`}
          >
            <item.Icon size={28} weight={item.weight} className={item.color} />
            <div>
              <div className={`text-2xl font-extrabold ${item.color}`}>
                {item.value}
              </div>
              <div className="text-xs font-bold text-slate-500 mt-1">
                {item.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">
            {filtered.length} bài viết
          </p>
          <div className="relative w-full sm:w-80">
            <MagnifyingGlass
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Tìm theo tiêu đề, tác giả, danh mục..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#5A63F6] focus:ring-1 focus:ring-[#5A63F6]/30 w-full transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-slate-400 gap-2">
              <CircleNotch size={20} className="animate-spin text-[#5A63F6]" />{" "}
              Đang tải dữ liệu...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Warning
                size={32}
                weight="duotone"
                className="text-slate-300 mb-3"
              />
              <p className="font-bold text-slate-600">Không có bài viết nào</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[11px] font-extrabold uppercase tracking-widest">
                  <th className="px-6 py-4">Bài viết</th>
                  <th className="px-6 py-4">Tác giả</th>
                  <th className="px-6 py-4">Danh mục</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-slate-50/50 transition-colors group align-top"
                  >
                    <td className="px-6 py-4 max-w-[22rem]">
                      <div className="font-bold text-slate-900 text-sm line-clamp-1">
                        {post.title}
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {post.content}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="font-semibold text-slate-800">
                        {post.authorName}
                      </div>
                      <div className="text-xs text-slate-400">
                        {post.authorEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {post.categoryName}
                    </td>
                    <td className="px-6 py-4">
                      <ModerationBadge status={post.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        <button
                          onClick={() => setSelectedPost(post)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <Eye size={12} /> Chi tiết
                        </button>
                        {post.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleModerate(post, "APPROVED")}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <CheckCircle size={12} weight="fill" /> Duyệt
                            </button>
                            <button
                              onClick={() => setSelectedPost(post)}
                              className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <XCircle size={12} weight="fill" /> Từ chối
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setSelectedPost(null)}
        >
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Duyệt bài cộng đồng
                </h2>
                <ModerationBadge status={selectedPost.status} />
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
              >
                <XCircle size={18} weight="regular" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Tiêu đề
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {selectedPost.title}
                    </h3>
                    <div className="mt-3 text-sm text-slate-500 flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-1">
                        <UserCircle size={14} weight="duotone" />{" "}
                        {selectedPost.authorName}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={14} />{" "}
                        {selectedPost.createdAt
                          ? new Date(selectedPost.createdAt).toLocaleString(
                              "vi-VN",
                            )
                          : "—"}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-2">
                    {selectedPost.categoryName}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                  Nội dung
                </p>
                <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap">
                  {selectedPost.content}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {(selectedPost.tags || []).length > 0 ? (
                    selectedPost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-bold border border-violet-100"
                      >
                        <Tag size={12} /> {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">Không có tag</span>
                  )}
                </div>
              </div>
              {selectedPost.status === "REJECTED" &&
                selectedPost.rejectionReason && (
                  <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                    <p className="text-xs font-bold text-rose-600 uppercase mb-1">
                      Lý do từ chối
                    </p>
                    <p className="text-sm text-rose-800">
                      {selectedPost.rejectionReason}
                    </p>
                  </div>
                )}
              {selectedPost.status === "PENDING" && (
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                    Nếu từ chối, nhập lý do
                  </p>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Nội dung không phù hợp, thiếu minh chứng, ..."
                    className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all min-h-[80px]"
                  />
                </div>
              )}
            </div>
            {selectedPost.status === "PENDING" && (
              <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 shrink-0">
                <button
                  onClick={() => handleModerate(selectedPost, "REJECTED")}
                  disabled={processing}
                  className="px-5 py-2.5 rounded-xl text-red-600 font-bold hover:bg-red-50 text-sm transition-colors disabled:opacity-50"
                >
                  Từ chối
                </button>
                <button
                  onClick={() => handleModerate(selectedPost, "APPROVED")}
                  disabled={processing}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {processing ? (
                    <CircleNotch size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle size={16} weight="fill" />
                  )}
                  Duyệt & hiển thị
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminForumPosts;
