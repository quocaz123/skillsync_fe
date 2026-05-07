import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import {
  CalendarBlank,
  Star,
  ChalkboardTeacher,
  Laptop,
  GraduationCap,
  Lightning,
  ArrowLeft,
  CircleNotch,
  ShieldCheck,
  X,
} from '@phosphor-icons/react';
import { getMentorProfile } from '../../services/userService';
import { getApprovedTeachingSkills } from '../../services/skillService';
import { SkillDynamicIcon } from '../../components/common/SkillDynamicIcon';

const LEVEL_LABEL = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  EXPERT: 'Expert',
};

const LEVEL_COLOR = {
  BEGINNER: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  INTERMEDIATE: 'bg-blue-50 text-blue-700 border-blue-200',
  ADVANCED: 'bg-violet-50 text-violet-700 border-violet-200',
  EXPERT: 'bg-amber-50 text-amber-700 border-amber-200',
};

const SkillDetailModal = ({ skill, onClose, onBook }) => {
  if (!skill) return null;

  const levelLabel = LEVEL_LABEL[skill.level] || skill.level;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
              <SkillDynamicIcon
                skillName={skill.skillName}
                defaultIcon={skill.skillIcon}
                size={22}
              />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {skill.skillName}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Cấp độ:{" "}
                <span className="font-bold text-violet-600">
                  {levelLabel}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold mb-1">
                Mức phí tham khảo
              </p>
              <p className="flex items-center gap-1 text-base font-extrabold text-amber-600">
                <Lightning size={16} weight="fill" className="text-amber-400" />
                {skill.creditsPerHour}{" "}
                <span className="text-xs text-slate-500 font-semibold">
                  credits/giờ
                </span>
              </p>
            </div>
            {skill.totalReviews > 0 && (
              <div className="text-right">
                <p className="text-xs text-slate-400 font-semibold mb-1">
                  Đánh giá
                </p>
                <p className="flex items-center justify-end gap-1 text-sm font-bold text-amber-600">
                  <Star size={14} weight="fill" />
                  {skill.averageRating?.toFixed(1)}{" "}
                  <span className="text-[11px] text-slate-400">
                    ({skill.totalReviews})
                  </span>
                </p>
              </div>
            )}
          </div>

          {skill.experienceDesc && (
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
              <p className="text-[11px] font-bold text-slate-500 uppercase mb-1">
                Kinh nghiệm thực tế
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {skill.experienceDesc}
              </p>
            </div>
          )}

          {skill.outcomeDesc && (
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
              <p className="text-[11px] font-bold text-slate-500 uppercase mb-1">
                Học viên sẽ đạt được
              </p>
              <ul className="space-y-1">
                {skill.outcomeDesc
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-700 flex items-start gap-1.5"
                    >
                      <span className="text-violet-500 mt-[2px]">✓</span>
                      <span>{line}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {skill.teachingStyle && (
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
              <p className="text-[11px] font-bold text-slate-500 uppercase mb-1">
                Phong cách giảng dạy
              </p>
              <p className="text-sm text-slate-700 leading-relaxed italic">
                {skill.teachingStyle}
              </p>
            </div>
          )}
        </div>

        <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={() => onBook(skill.id)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-sm font-bold text-white shadow-md shadow-violet-200 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <CalendarBlank size={16} weight="duotone" />
            Đặt lịch với kỹ năng này
          </button>
        </div>
      </div>
    </div>
  );
};

const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useStore();

  const [profile, setProfile] = useState(null);
  const [teachingSkills, setTeachingSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSkill, setActiveSkill] = useState(null);

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError('');

    Promise.all([
      getMentorProfile(userId),
      getApprovedTeachingSkills(),
    ])
      .then(([profileData, allSkills]) => {
        setProfile(profileData);
        // Filter teaching skills của mentor này
        const mySkills = Array.isArray(allSkills)
          ? allSkills.filter(s => String(s.teacherId) === String(userId))
          : [];
        setTeachingSkills(mySkills);
      })
      .catch(() => setError('Không thể tải profile. Vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, [userId]);

  /** Chuyển sang Explore với mentor/skill được pre-select → booking flow */
  const handleBookSkill = (teachingSkillId = null) => {
    navigate('/app/explore', {
      state: {
        openMentorId: userId,
        ...(teachingSkillId ? { openSkillId: teachingSkillId } : {}),
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3 text-slate-400 font-semibold">
        <CircleNotch size={28} weight="bold" className="animate-spin text-violet-500" />
        Đang tải hồ sơ...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center">
        <p className="text-slate-500 mb-4">{error || 'Không tìm thấy hồ sơ này.'}</p>
        <button onClick={() => navigate(-1)} className="text-violet-600 font-bold hover:underline flex items-center gap-1 mx-auto">
          <ArrowLeft size={16} /> Quay lại
        </button>
      </div>
    );
  }

  const displayName = profile.name || profile.fullName || 'Người dùng';
  const joinedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
    : null;
  const averageRating = profile.averageRating;
  const totalTeachingSessions = profile.totalTeachingSessions ?? 0;
  const totalLearningSessions = profile.totalLearningSessions ?? 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans pb-12">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-violet-600 font-semibold text-sm transition-colors"
      >
        <ArrowLeft size={16} weight="bold" /> Quay lại
      </button>

      {/* ── Hero Card ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {/* Banner */}
        <div className="h-36 relative overflow-hidden bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 opacity-90" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-screen filter blur-[80px] opacity-70" />
          <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-fuchsia-400 rounded-full mix-blend-screen filter blur-[60px] opacity-60" />
        </div>

        <div className="px-6 sm:px-10 pb-8 relative">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-end -mt-14 mb-5">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500 rounded-[1.5rem] blur-xl opacity-40 scale-105" />
              <div className="w-28 h-28 relative rounded-[1.5rem] bg-white p-1.5 shadow-2xl border border-white/50">
                <div className="w-full h-full bg-[#f1f4f9] rounded-[1.2rem] flex items-center justify-center text-5xl font-extrabold text-[#3b4758] overflow-hidden">
                  {profile.avatarUrl
                    ? <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover rounded-[1.2rem]" />
                    : displayName?.charAt(0)?.toUpperCase()}
                </div>
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full" />
              </div>
            </div>

            <div className="flex-1 py-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2 flex-wrap">
                {displayName}
                <ShieldCheck className="text-blue-500" weight="fill" size={26} />
              </h1>
              {joinedDate && (
                <p className="text-slate-500 font-medium text-sm mt-1 flex items-center gap-1.5">
                  <CalendarBlank size={14} weight="duotone" className="text-slate-400" />
                  Tham gia từ {joinedDate}
                </p>
              )}
            </div>

            {/* Nút đặt lịch — chỉ hiện khi xem người khác & họ có skill */}
            {!isOwnProfile && teachingSkills.length > 0 && (
              <button
                onClick={handleBookSkill}
                className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md shadow-violet-600/20 transition-all hover:-translate-y-0.5 active:scale-95 text-sm shrink-0"
              >
                <CalendarBlank size={18} weight="duotone" />
                Đặt lịch học
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between sm:justify-around text-center gap-6 pt-5 border-t border-slate-100 overflow-x-auto hide-scrollbar">
            {[
              { icon: ChalkboardTeacher, label: 'Buổi dạy', value: totalTeachingSessions, color: 'text-indigo-500', bg: 'bg-indigo-50' },
              { icon: Laptop, label: 'Buổi học', value: totalLearningSessions, color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { icon: Star, label: 'Đánh giá', value: averageRating != null ? averageRating.toFixed(1) : '—', color: 'text-yellow-500', bg: 'bg-yellow-50', fill: true },
            ].map(({ icon: Icon, label, value, color, bg, fill }) => (
              <div key={label} className="flex flex-col items-center shrink-0 min-w-[70px]">
                <div className={`w-11 h-11 ${bg} rounded-2xl flex items-center justify-center mb-2`}>
                  <Icon size={22} weight={fill ? 'fill' : 'duotone'} className={color} />
                </div>
                <h3 className="text-xl font-black text-slate-800">{value}</h3>
                <p className="text-slate-400 text-xs font-bold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Trái: Teaching Skills ───────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {teachingSkills.length > 0 ? (
            <div className="bg-white rounded-[2rem] border border-slate-200/60 p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-5">
                <GraduationCap size={26} weight="duotone" className="text-violet-500" />
                Kỹ năng giảng dạy
              </h2>
              <div className="space-y-3">
                {teachingSkills.map((ts) => (
                  <div
                    key={ts.id}
                    className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/30 transition-all group cursor-pointer"
                    onClick={() => setActiveSkill(ts)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200 shrink-0">
                        <SkillDynamicIcon skillName={ts.skillName} defaultIcon={ts.skillIcon} size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">{ts.skillName}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${LEVEL_COLOR[ts.level] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                            {LEVEL_LABEL[ts.level] || ts.level}
                          </span>
                          {ts.totalReviews > 0 && (
                            <span className="text-[11px] text-amber-600 font-bold flex items-center gap-0.5">
                              <Star size={11} weight="fill" /> {ts.averageRating?.toFixed(1)} ({ts.totalReviews})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-amber-600 font-extrabold text-base">
                          <Lightning size={14} weight="fill" className="text-amber-400" />
                          {ts.creditsPerHour}
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">credits/giờ</p>
                      </div>
                      {!isOwnProfile && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookSkill(ts.id);
                          }}
                          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all hover:-translate-y-0.5 active:scale-95 opacity-0 group-hover:opacity-100"
                        >
                          Đặt lịch
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] border border-dashed border-slate-200 p-12 text-center">
              <GraduationCap size={36} weight="duotone" className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">Người dùng chưa đăng ký kỹ năng giảng dạy.</p>
            </div>
          )}
        </div>

        {/* ── Phải: Bio + Trust Score ──────────────────────────────── */}
        <div className="space-y-5">
          {/* Bio */}
          <div className="bg-white rounded-[2rem] border border-slate-200/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-base font-black text-slate-900 mb-3">Giới thiệu</h3>
            {profile.bio ? (
              <p className="text-slate-600 text-sm leading-relaxed">{profile.bio}</p>
            ) : (
              <p className="text-slate-400 text-sm italic">Người dùng chưa viết giới thiệu.</p>
            )}
          </div>

          {/* CTA đặt lịch */}
          {!isOwnProfile && teachingSkills.length > 0 && (
            <button
              onClick={() => handleBookSkill()}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-extrabold rounded-2xl shadow-lg shadow-violet-600/25 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
            >
              <CalendarBlank size={20} weight="duotone" />
              Đặt lịch học ngay
            </button>
          )}
        </div>
      </div>

      {activeSkill && (
        <SkillDetailModal
          skill={activeSkill}
          onClose={() => setActiveSkill(null)}
          onBook={(skillId) => {
            setActiveSkill(null);
            handleBookSkill(skillId);
          }}
        />
      )}
    </div>
  );
};

export default PublicProfile;
