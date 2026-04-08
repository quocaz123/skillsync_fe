import { useState, useEffect } from "react";
import {
  BookOpen,
  MagnifyingGlass,
  CheckCircle,
  Warning,
  XCircle,
  Eye,
  ShieldCheck,
  Link as LinkIcon,
  DownloadSimple,
  CircleNotch,
} from "@phosphor-icons/react";
import SkillIcon from "../../components/SkillIcon.jsx";
import {
  getAdminTeachingSkills,
  verifyTeachingSkill,
} from "../../services/adminSkillService";

const StatusBadge = ({ status }) => {
  const cfg = {
    APPROVED: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-100",
      dot: "bg-emerald-500",
      label: "Đã duyệt",
    },
    PENDING: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-100",
      dot: "bg-amber-500",
      label: "Chờ duyệt",
    },
    REJECTED: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-100",
      dot: "bg-red-500",
      label: "Từ chối",
    },
  };
  const c = cfg[status] || cfg.PENDING;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${c.bg} ${c.text} border ${c.border} rounded-full text-[11px] font-extrabold`}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></div>
      {c.label}
    </span>
  );
};

const AdminTeachingSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("PENDING"); // PENDING, APPROVED, REJECTED, ALL
  const [search, setSearch] = useState("");

  // Modal state
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAdminTeachingSkills(
        filterStatus === "ALL" ? null : filterStatus,
      );
      setSkills(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi tải danh sách kỹ năng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterStatus]);

  const handleVerify = async (action) => {
    if (action === "REJECTED" && !rejectionReason.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }

    setProcessing(true);
    try {
      await verifyTeachingSkill(selectedSkill.id, action, rejectionReason);
      setSelectedSkill(null);
      setRejectionReason("");
      loadData();
    } catch (err) {
      console.error("Lỗi duyệt kỹ năng:", err);
      alert("Xử lý thất bại: " + (err.response?.data?.message || err.message));
    } finally {
      setProcessing(false);
    }
  };

  const filtered = skills.filter(
    (s) =>
      s.userFullName?.toLowerCase().includes(search.toLowerCase()) ||
      s.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      s.skillName?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6 pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen size={22} className="text-[#5A63F6]" /> Xét duyệt Minh
            chứng Dạy học
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Quản lý và kiểm duyệt năng lực giảng dạy của Mentor
          </p>
        </div>

        <div className="flex bg-slate-100/80 p-1 rounded-xl w-fit border border-slate-200 shadow-inner">
          {["PENDING", "APPROVED", "REJECTED", "ALL"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${filterStatus === s ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {s === "ALL"
                ? "Tất cả"
                : s === "PENDING"
                  ? "Chờ duyệt"
                  : s === "APPROVED"
                    ? "Đã duyệt"
                    : "Từ chối"}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">
            {filtered.length} kết quả{" "}
            {filterStatus !== "ALL" ? filterStatus : ""}
          </p>
          <div className="relative">
            <MagnifyingGlass
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Tìm giảng viên, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#5A63F6] focus:ring-1 focus:ring-[#5A63F6]/30 w-full sm:w-64 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-slate-400 gap-2">
              <CircleNotch size={20} className="animate-spin text-[#5A63F6]" /> Đang tải dữ liệu...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                <CheckCircle size={24} weight="duotone" className="text-slate-300" />
              </div>
              <p className="font-bold text-slate-600">
                Không có hồ sơ nào cần duyệt
              </p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[11px] font-extrabold uppercase tracking-widest">
                  <th className="px-6 py-4">Mentor</th>
                  <th className="px-6 py-4">Kỹ năng dạy</th>
                  <th className="px-6 py-4">Minh chứng</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center">
                          {item.userAvatarUrl ? (
                            <img
                              src={item.userAvatarUrl}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="font-bold text-slate-400">
                              {item.userFullName?.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {item.userFullName}
                          </div>
                          <div className="text-xs text-slate-400 font-medium">
                            {item.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <div className="w-6 h-6 flex items-center justify-center">
                          <SkillIcon
                            iconName={item.skillIcon}
                            skillName={item.skillName}
                            category={item.skillCategory}
                            size={18}
                            weight="duotone"
                          />
                        </div>
                        {item.skillName}
                      </div>
                      <div className="text-[11px] text-slate-500 bg-slate-100 inline-block px-2 py-0.5 rounded mt-1 font-semibold">
                        {item.level}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                        {item.evidences?.length || 0} file đính kèm
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.verificationStatus} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => setSelectedSkill(item)}
                          className="px-4 py-2 rounded-xl bg-[#5A63F6] hover:bg-indigo-600 text-white text-xs font-bold transition-colors shadow-sm shadow-[#5A63F6]/30 flex items-center gap-2"
                        >
                          <Eye size={14} /> Xem & Duyệt
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedSkill && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center px-4 bg-slate-900/40 backdrop-blur-sm"
          onClick={(e) =>
            e.target === e.currentTarget && setSelectedSkill(null)
          }
        >
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck size={18} weight="duotone" className="text-[#5A63F6]" /> Xét duyệt hồ sơ
                giảng dạy
              </h2>
              <button
                onClick={() => setSelectedSkill(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
              >
                <XCircle size={18} weight="regular" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Info block */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-white shadow-sm overflow-hidden shrink-0">
                  {selectedSkill.userAvatarUrl ? (
                    <img
                      src={selectedSkill.userAvatarUrl}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-500">
                      {selectedSkill.userFullName?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold text-lg text-slate-900">
                    {selectedSkill.userFullName}
                  </h3>
                  <p className="text-sm text-slate-500 mb-3">
                    {selectedSkill.userEmail}
                  </p>

                  <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <SkillIcon
                          iconName={selectedSkill.skillIcon}
                          skillName={selectedSkill.skillName}
                          category={selectedSkill.skillCategory}
                          size={24}
                          weight="duotone"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">
                          {selectedSkill.skillName}
                        </p>
                        <p className="text-[11px] font-extrabold text-indigo-500 uppercase tracking-wider">
                          {selectedSkill.level}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={selectedSkill.verificationStatus} />
                  </div>
                </div>
              </div>

              {/* Text blocks */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                    Kinh nghiệm thực tế
                  </p>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 min-h-[80px]">
                    {selectedSkill.experienceDesc}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                    Cam kết đầu ra
                  </p>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 min-h-[80px]">
                    {selectedSkill.outcomeDesc}
                  </p>
                </div>
              </div>

              {/* Evidences */}
              <div>
                <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
                  File minh chứng đính kèm (
                  {selectedSkill.evidences?.length || 0})
                </p>
                <div className="space-y-2">
                  {selectedSkill.evidences?.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-xl hover:border-indigo-300 transition-all shadow-sm"
                    >
                      <div>
                        <p className="font-bold text-sm text-slate-800">
                          {ev.title}
                        </p>
                        <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                          {ev.evidenceType}
                        </p>
                      </div>
                      {ev.fileUrl && (
                        <a
                          href={ev.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                        >
                          <DownloadSimple size={14} /> Tải file
                        </a>
                      )}
                      {ev.externalUrl && (
                        <a
                          href={ev.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                        >
                          <LinkIcon size={14} /> Mở Link
                        </a>
                      )}
                    </div>
                  ))}
                  {(!selectedSkill.evidences ||
                    selectedSkill.evidences.length === 0) && (
                    <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 font-medium">
                      Người dùng chưa tải lên minh chứng nào.
                    </p>
                  )}
                </div>
              </div>

              {/* Rejection input */}
              {selectedSkill.verificationStatus === "REJECTED" &&
                selectedSkill.rejectionReason && (
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <p className="text-xs font-bold text-red-600 uppercase mb-1">
                      Lý do từ chối trước đó:
                    </p>
                    <p className="text-sm text-red-800">
                      {selectedSkill.rejectionReason}
                    </p>
                  </div>
                )}

              {selectedSkill.verificationStatus === "PENDING" && (
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                    Nếu từ chối, hãy nhập lý do:
                  </p>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Minh chứng không hợp lệ, hình mờ, link hỏng..."
                    className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all min-h-[80px]"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            {selectedSkill.verificationStatus === "PENDING" && (
              <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 shrink-0 rounded-b-3xl">
                <button
                  onClick={() => handleVerify("REJECTED")}
                  disabled={processing}
                  className="px-5 py-2.5 rounded-xl text-red-600 font-bold hover:bg-red-50 text-sm transition-colors disabled:opacity-50"
                >
                  Từ chối hồ sơ
                </button>
                <button
                  onClick={() => handleVerify("APPROVED")}
                  disabled={processing}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {processing ? (
                    <CircleNotch size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle size={16} weight="fill" />
                  )}
                  Duyệt hợp lệ
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeachingSkills;
