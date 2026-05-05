import { useEffect, useMemo, useState } from "react";
import {
  Warning,
  Eye,
  Flag,
  Plus,
  ArrowsClockwise,
  X,
  CurrencyCircleDollar,
} from "@phosphor-icons/react";
import httpClient from "../../configuration/axiosClient";
import API_ENDPOINTS from "../../configuration/apiEndpoints";
import { toastError, toastSuccess } from "../../utils/toastUtils";

const typeConfig = {
  WELCOME_BONUS: { label: "Tặng thưởng", bg: "bg-amber-50", text: "text-amber-700" },
  REFUND: { label: "Hoàn tiền", bg: "bg-blue-50", text: "text-blue-700" },
  PENALTY: { label: "Phạt / Trừ tiền", bg: "bg-rose-50", text: "text-rose-700" },
  MISSION_REWARD: { label: "Thưởng nhiệm vụ", bg: "bg-indigo-50", text: "text-indigo-700" },
  SPEND_SESSION: { label: "Thanh toán", bg: "bg-slate-50", text: "text-slate-600" },
  EARN_SESSION: { label: "Thu nhập Mentor", bg: "bg-emerald-50", text: "text-emerald-700" },
  unknown: { label: "Hệ thống", bg: "bg-slate-50", text: "text-slate-700" },
};

const FILTER_OPTIONS = [
  { id: "ALL", label: "Tất cả" },
  { id: "SPEND_SESSION", label: "Thanh toán" },
  { id: "EARN_SESSION", label: "Thu nhập" },
  { id: "MISSION_REWARD", label: "Thưởng nhiệm vụ" },
  { id: "REFUND", label: "Hoàn tiền" },
  { id: "WELCOME_BONUS", label: "Bonus" },
  { id: "PENALTY", label: "Phạt" },
];

const formatDateTime = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("vi-VN");
};

const AdminCredits = () => {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [grantForm, setGrantForm] = useState({
    userId: "",
    amount: 50,
    transactionType: "WELCOME_BONUS",
    description: "Tặng thưởng cho thành viên",
  });

  const fetchUsers = async () => {
    try {
      const res = await httpClient.get(API_ENDPOINTS.USERS.GET_ALL);
      setUsers(Array.isArray(res) ? res : []);
    } catch {
      setUsers([]);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter && filter !== "ALL") params.type = filter;
      const res = await httpClient.get(API_ENDPOINTS.ADMIN.CREDIT_TRANSACTIONS, { params });
      setTransactions(Array.isArray(res) ? res : []);
    } catch (err) {
      setTransactions([]);
      toastError(err, "Không thể tải lịch sử giao dịch.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const filtered = useMemo(() => {
    const sq = String(searchQuery || "").trim().toLowerCase();
    const df = String(dateFilter || "").trim();
    return (Array.isArray(transactions) ? transactions : []).filter((t) => {
      if (sq) {
        const hay = `${t.userName || ""} ${t.userEmail || ""} ${t.userId || ""} ${t.id || ""}`.toLowerCase();
        if (!hay.includes(sq)) return false;
      }
      if (df) {
        const createdAt = String(t.createdAt || "");
        if (!createdAt.startsWith(df)) return false;
      }
      return true;
    });
  }, [transactions, searchQuery, dateFilter]);

  useEffect(() => {
    setCurrentPage(1);
    const mainContent = document.querySelector("main");
    if (mainContent) mainContent.scrollTo({ top: 0, behavior: "smooth" });
  }, [filter, searchQuery, dateFilter]);

  useEffect(() => {
    const mainContent = document.querySelector("main");
    if (mainContent) mainContent.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filtered.slice(startIndex, startIndex + itemsPerPage);

  const todayKey = new Date().toISOString().split("T")[0];
  const todayCount = useMemo(
    () => (Array.isArray(transactions) ? transactions : []).filter((t) => String(t.createdAt || "").startsWith(todayKey)).length,
    [transactions, todayKey],
  );
  const totalSuspicious = useMemo(
    () => (Array.isArray(transactions) ? transactions : []).filter((t) => Boolean(t.suspicious)).length,
    [transactions],
  );
  const totalCirculating = useMemo(
    () => (Array.isArray(transactions) ? transactions : []).reduce((sum, t) => sum + (Number(t.amount || 0) > 0 ? Number(t.amount || 0) : 0), 0),
    [transactions],
  );

  const displayUsers = useMemo(() => {
    const keyword = String(userSearch || "").trim().toLowerCase();
    if (!keyword) return users;
    return users.filter((u) => {
      const hay = `${u.fullName || ""} ${u.email || ""}`.toLowerCase();
      return hay.includes(keyword);
    });
  }, [users, userSearch]);

  const handleGrantCredit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...grantForm,
        amount: Number(grantForm.amount),
      };
      await httpClient.post(API_ENDPOINTS.ADMIN.GRANT_CREDIT, payload);
      toastSuccess("Đã cập nhật credits cho người dùng.");
      setIsGrantModalOpen(false);
      setGrantForm((prev) => ({ ...prev, amount: 50, description: "" }));
      await fetchTransactions();
    } catch (err) {
      toastError(err, "Lỗi khi cấp/trừ credits.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <CurrencyCircleDollar size={24} weight="duotone" className="text-amber-500" /> Credits &amp; Giao dịch
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Kiểm soát dòng credit trên toàn hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchTransactions}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold text-sm transition-colors disabled:opacity-50"
          >
            <ArrowsClockwise size={16} className={loading ? "animate-spin" : ""} /> Làm mới
          </button>
          <button
            type="button"
            onClick={() => setIsGrantModalOpen(true)}
            className="flex items-center gap-1.5 px-6 py-3 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors shadow-lg shadow-amber-100"
          >
            <Plus size={16} /> Cấp / Trừ Credit
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Credits tương tác", value: totalCirculating.toLocaleString(), icon: "💰", bg: "bg-amber-50", border: "border-amber-100", color: "text-amber-700" },
          { label: "GD hôm nay", value: todayCount.toLocaleString(), icon: "📊", bg: "bg-blue-50", border: "border-blue-100", color: "text-blue-700" },
          { label: "Tổng giao dịch", value: (Array.isArray(transactions) ? transactions.length : 0).toLocaleString(), icon: "📋", bg: "bg-slate-50", border: "border-slate-100", color: "text-slate-700" },
          { label: "Giao dịch nghi ngờ", value: totalSuspicious.toLocaleString(), icon: "⚠️", bg: "bg-rose-50", border: "border-rose-100", color: "text-rose-700" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5 flex items-center gap-4`}>
            <div className="w-10 h-10 rounded-2xl bg-white/70 border border-white flex items-center justify-center text-xl">
              {s.icon}
            </div>
            <div>
              <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${filter === f.id
              ? "bg-[#5A63F6] text-white shadow-md shadow-indigo-200"
              : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400 font-medium">
          {filtered.length} giao dịch
        </span>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          placeholder="🔍 Tìm theo tên/email/userId/txId..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[240px] border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5A63F6] focus:ring-1 focus:ring-[#5A63F6] shadow-sm bg-white"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5A63F6] text-slate-600 focus:ring-1 focus:ring-[#5A63F6] shadow-sm bg-white"
        />
        {(searchQuery || dateFilter) && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setDateFilter("");
            }}
            className="px-4 py-2.5 text-sm font-bold text-rose-500 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors shadow-sm"
          >
            Xóa lọc
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400 text-sm font-semibold">
            Đang tải...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-bold text-slate-500">Không có giao dịch nào</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[11px] font-extrabold uppercase tracking-widest whitespace-nowrap">
                    <th className="px-6 py-4">Loại</th>
                    <th className="px-6 py-4">ID User</th>
                    <th className="px-6 py-4">Người dùng</th>
                    <th className="px-6 py-4 w-1/4">Mô tả</th>
                    <th className="px-6 py-4 text-right">Giao dịch</th>
                    <th className="px-6 py-4 text-right">Tổng Ví</th>
                    <th className="px-6 py-4 text-center">Thời gian</th>
                    <th className="px-6 py-4 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedTransactions.map((t) => {
                    const tc = typeConfig[t.transactionType] || typeConfig.unknown;
                    return (
                      <tr
                        key={t.id}
                        className={`hover:bg-slate-50/50 transition-colors group ${t.suspicious ? "bg-rose-50/30" : ""
                          }`}
                      >
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold ${tc.bg} ${tc.text} whitespace-nowrap`}>
                            {tc.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            title={t.userId}
                            className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded cursor-text select-all block w-20 truncate hover:w-auto hover:absolute hover:z-10 hover:shadow-lg transition-all"
                          >
                            {t.userId || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`text-sm font-bold ${t.suspicious ? "text-rose-700" : "text-slate-800"} whitespace-nowrap`}>
                            {t.userName || "Hệ thống"}
                          </p>
                          <p className="text-xs text-slate-400 truncate max-w-[150px]">{t.userEmail || ""}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-600 max-w-xs line-clamp-2">
                            {t.description || "—"}
                          </p>
                          {t.suspicious && (
                            <span className="inline-flex items-center gap-1 text-xs text-rose-600 font-bold mt-1">
                              <Warning size={14} weight="bold" /> Nghi ngờ
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`inline-flex items-center justify-end gap-1 font-extrabold text-sm ${Number(t.amount || 0) >= 0 ? "text-emerald-600" : "text-rose-600"} whitespace-nowrap`}>
                            {(Number(t.amount || 0) > 0 ? "+" : "") + Number(t.amount || 0)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {t.userBalance != null ? (
                            <span className="text-[13px] font-bold text-amber-600 whitespace-nowrap">
                              {Number(t.userBalance || 0).toLocaleString()} C
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center justify-center whitespace-nowrap">
                            <span className="text-xs font-bold text-slate-700">
                              {t.createdAt ? new Date(t.createdAt).toLocaleDateString("vi-VN") : "—"}
                            </span>
                            <span className="text-[10px] text-slate-500 mt-0.5">
                              {t.createdAt ? new Date(t.createdAt).toLocaleTimeString("vi-VN") : ""}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => setSelectedTx(t)}
                              className="p-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => toastSuccess("MVP: đánh dấu nghi ngờ sẽ bổ sung sau.")}
                              className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                              title="Đánh dấu nghi ngờ"
                            >
                              <Flag size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs font-bold text-slate-400">
              <span>
                Hiển thị {filtered.length > 0 ? startIndex + 1 : 0} -{" "}
                {Math.min(startIndex + itemsPerPage, filtered.length)} / {filtered.length} giao dịch
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border border-slate-200 rounded-xl transition-colors ${currentPage === 1
                    ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                    : "bg-white hover:bg-slate-50 text-slate-600"
                    }`}
                >
                  Trước
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className={`px-4 py-2 border border-slate-200 rounded-xl transition-colors ${currentPage >= totalPages
                    ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                    : "bg-white hover:bg-slate-50 text-slate-600"
                    }`}
                >
                  Tiếp
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Grant */}
      {isGrantModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-8 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-extrabold text-2xl text-slate-900 flex items-center gap-2">
                <Plus size={24} weight="bold" className="text-amber-500" /> Cấp / Trừ Credits
              </h3>
              <button
                type="button"
                onClick={() => setIsGrantModalOpen(false)}
                className="p-3 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleGrantCredit} className="p-8 space-y-6 bg-white">
              <div>
                <label className="block text-lg font-extrabold text-slate-600 mb-2">
                  1. Chọn người dùng nhận / bị trừ
                </label>
                <input
                  type="text"
                  placeholder="🔍 Tìm nhanh Tên hoặc Email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full border border-slate-200 rounded-t-2xl border-b-0 px-6 py-4 text-base bg-slate-50 text-slate-700 outline-none"
                />
                <select
                  required
                  size={6}
                  value={grantForm.userId}
                  onChange={(e) => setGrantForm((prev) => ({ ...prev, userId: e.target.value }))}
                  className="w-full border border-slate-200 rounded-b-2xl px-6 py-4 text-lg font-bold text-slate-800 focus:border-[#5A63F6] outline-none overflow-y-auto"
                >
                  <option value="" disabled>
                    -- Chọn người dùng ({displayUsers.length}) --
                  </option>
                  {displayUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} ({u.email}) - {u.creditsBalance ?? 0}C
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 flex-col sm:flex-row">
                <div className="flex-1">
                  <label className="block text-lg font-extrabold text-slate-600 mb-2">
                    2. Số lượng{" "}
                    <span className="text-rose-500 font-normal text-xs">
                      (Âm để trừ)
                    </span>
                  </label>
                  <input
                    type="number"
                    required
                    value={grantForm.amount}
                    onChange={(e) => setGrantForm((prev) => ({ ...prev, amount: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base font-bold focus:border-amber-500 outline-none shadow-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-lg font-extrabold text-slate-600 mb-2">
                    3. Loại giao dịch
                  </label>
                  <select
                    value={grantForm.transactionType}
                    onChange={(e) =>
                      setGrantForm((prev) => ({ ...prev, transactionType: e.target.value }))
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none shadow-sm font-semibold"
                  >
                    <option value="WELCOME_BONUS">Tặng thưởng</option>
                    <option value="REFUND">Hoàn tiền</option>
                    <option value="PENALTY">Phạt / Trừ tiền</option>
                    <option value="MISSION_REWARD">Thưởng nhiệm vụ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-lg font-extrabold text-slate-600 mb-2">
                  4. Lý do / mô tả
                </label>
                <textarea
                  rows={3}
                  value={grantForm.description}
                  onChange={(e) =>
                    setGrantForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none shadow-sm resize-none"
                  placeholder="Ghi rõ lý do cấp/trừ credits..."
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-lg transition-all shadow-lg active:scale-95"
              >
                Xác nhận {Number(grantForm.amount) > 0 ? "Cộng" : "Trừ"} Credit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal detail */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-xl border border-slate-100">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <CurrencyCircleDollar size={20} weight="duotone" className="text-amber-500" /> Chi tiết giao dịch
              </h3>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">ID</label>
                <div className="mt-1 font-mono text-xs text-slate-700 bg-slate-50 p-2 rounded-lg break-all">
                  {selectedTx.id}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thời gian</label>
                <div className="mt-1 text-sm font-medium text-slate-800">
                  {formatDateTime(selectedTx.createdAt)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loại</label>
                  <div className="mt-1 text-sm font-bold text-indigo-600">
                    {typeConfig[selectedTx.transactionType]?.label || selectedTx.transactionType}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Số lượng</label>
                  <div className={`mt-1 text-lg font-extrabold ${Number(selectedTx.amount || 0) >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {(Number(selectedTx.amount || 0) > 0 ? "+" : "") + Number(selectedTx.amount || 0)} C
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Người dùng</label>
                <div className="mt-1 text-sm font-bold text-slate-800">{selectedTx.userName}</div>
                <div className="text-xs text-slate-500 truncate">{selectedTx.userEmail}</div>
                {selectedTx.userId && (
                  <div className="mt-2 text-[11px] font-bold text-amber-700">
                    UserId: <span className="font-mono">{selectedTx.userId}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mô tả</label>
                <div className="mt-1 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedTx.description || "—"}
                </div>
              </div>
              {selectedTx.suspicious && (
                <div className="text-sm font-bold text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 flex items-center gap-2">
                  <Warning size={18} weight="bold" /> Giao dịch bị gắn cờ nghi ngờ (mức &gt; 500 credits).
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCredits;
