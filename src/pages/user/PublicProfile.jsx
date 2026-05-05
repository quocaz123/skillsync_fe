import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import {
  CalendarBlank, Star, ChalkboardTeacher, Laptop,
  GraduationCap, Lightning, ArrowLeft, CircleNotch,
  Medal, At, Heartbeat, ShieldCheck,
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

const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useStore();

  const [profile, setProfile] = useState(null);
  const [teachingSkills, setTeachingSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  /** Chuyển sang Explore với mentor được pre-select → booking flow */
  const handleBookSkill = () => {
    navigate('/app/explore', { state: { openMentorId: userId } });
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
  const trustScore = profile.trustScore ?? 50;
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
              { icon: Heartbeat, label: 'Niềm tin', value: trustScore, color: 'text-rose-500', bg: 'bg-rose-50' },
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
                    className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/30 transition-all group"
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
                          onClick={handleBookSkill}
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

          {/* Trust Score */}
          <div className="bg-white rounded-[2rem] border border-slate-200/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              <Medal size={22} weight="duotone" className="text-amber-500" />
              Điểm uy tín
            </h3>
            <div className="flex items-end gap-1 mb-3">
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500">
                {trustScore}
              </span>
              <span className="text-slate-400 font-bold mb-0.5">/ 100</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-700"
                style={{ width: `${Math.min(trustScore, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-3 bg-amber-50 p-3 rounded-xl border border-amber-100">
              {trustScore >= 80
                ? '🌟 Hạng S — Trust Score xuất sắc!'
                : trustScore >= 50
                ? '✅ Hạng A — Thành viên tích cực'
                : '⚠️ Hạng B — Cần cải thiện'}
            </p>
          </div>

          {/* CTA đặt lịch */}
          {!isOwnProfile && teachingSkills.length > 0 && (
            <button
              onClick={handleBookSkill}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-extrabold rounded-2xl shadow-lg shadow-violet-600/25 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
            >
              <CalendarBlank size={20} weight="duotone" />
              Đặt lịch học ngay
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
