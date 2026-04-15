// src/components/ai/AiMentorSearch.jsx
// ─── Self-contained AI Chat + Mentor Results panel ───────────────────────────
// Design: matches SkillSync design system (Tailwind v4, violet primary, Phosphor Icons)

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkle, PaperPlaneRight, ArrowCounterClockwise,
  Robot, User, Star, Lightning, Trophy, Shield,
  SealCheck, CaretDown, CaretUp, X
} from '@phosphor-icons/react';
import { aiService } from '../../services/aiService';

// ─── Constants ──────────────────────────────────────────────────────────────
const PLACEHOLDER_TEXTS = [
  'Mình chưa biết học gì để đi thực tập...',
  'Tìm mentor kèm ReactJS từ đầu...',
  'Mình muốn chuyển sang Data Science...',
  'Học lập trình game Unity từ cơ bản...',
  'Backend Spring Boot cho người mới bắt đầu...',
];

const LOADING_PHASES = [
  { icon: '✨', text: 'AI đang nhận diện yêu cầu...' },
  { icon: '🔍', text: 'Đang truy xuất danh sách Mentor...' },
  { icon: '🤔', text: 'Đang phân tích mức độ phù hợp...' },
  { icon: '🏆', text: 'Hoàn tất! Đang hiển thị kết quả...' },
];

const LEVEL_CONFIG = {
  BEGINNER:     { label: 'Cơ bản',   bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-200' },
  INTERMEDIATE: { label: 'Trung cấp', bg: 'bg-amber-50',    text: 'text-amber-700',   border: 'border-amber-200' },
  ADVANCED:     { label: 'Nâng cao', bg: 'bg-violet-50',   text: 'text-violet-700',  border: 'border-violet-200' },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const TypingDots = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map(i => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-violet-400 inline-block"
        style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
      />
    ))}
    <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
  </div>
);

const LoadingPhases = ({ phase }) => (
  <div className="flex items-center gap-3 px-4 py-3 text-sm text-slate-500 font-semibold">
    <span className="text-base">{LOADING_PHASES[phase]?.icon}</span>
    <span
      key={phase}
      style={{ animation: 'fadeSlideIn 0.3s ease forwards' }}
    >
      {LOADING_PHASES[phase]?.text}
    </span>
    <style>{`@keyframes fadeSlideIn { from{opacity:0;transform:translateX(8px)} to{opacity:1;transform:translateX(0)} }`}</style>
  </div>
);

// ─── Avatar helper (reuse pattern from Explore.jsx) ──────────────────────────
const AiMentorAvatar = ({ src, name, size = 'w-12 h-12' }) => {
  const [err, setErr] = useState(false);
  const initials = name ? name.charAt(0).toUpperCase() : '?';
  const colors = ['bg-violet-500', 'bg-indigo-500', 'bg-sky-500', 'bg-teal-500', 'bg-emerald-500'];
  const color = colors[name?.charCodeAt(0) % colors.length] ?? 'bg-violet-500';

  if (src && !err) {
    return (
      <img src={src} alt={name} onError={() => setErr(true)}
        className={`${size} rounded-2xl object-cover shrink-0`} />
    );
  }
  return (
    <div className={`${size} rounded-2xl ${color} text-white flex items-center justify-center font-extrabold text-lg shrink-0`}>
      {initials}
    </div>
  );
};

// ─── Score Bar ───────────────────────────────────────────────────────────────
const ScoreBar = ({ score }) => {
  const pct = Math.round(score * 100);
  const color = pct >= 85 ? 'bg-emerald-500' : pct >= 70 ? 'bg-amber-400' : 'bg-violet-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-slate-500 shrink-0">{pct}%</span>
    </div>
  );
};

// ─── Mentor Result Card ───────────────────────────────────────────────────────
const MentorAiCard = ({ mentor, index, onView }) => {
  const lvl = LEVEL_CONFIG[mentor.level] ?? LEVEL_CONFIG.BEGINNER;
  const hasRating = mentor.avgRating != null && mentor.avgRating > 0;

  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group"
      style={{ animationDelay: `${index * 80}ms`, animation: 'fadeSlideInUp 0.4s ease forwards', opacity: 0 }}
    >
      <style>{`@keyframes fadeSlideInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }`}</style>

      {/* AI Match ribbon */}
      <div className="h-1 bg-gradient-to-r from-violet-500 to-indigo-400" />

      <div className="p-5 flex-1">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <AiMentorAvatar src={mentor.avatarUrl} name={mentor.fullName} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-slate-900 text-base group-hover:text-violet-600 transition-colors truncate">
                {mentor.fullName}
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${lvl.bg} ${lvl.text} ${lvl.border} shrink-0`}>
                {lvl.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{mentor.skillName}</p>
          </div>

          {/* AI Match badge */}
          <div className="shrink-0 flex items-center gap-1 bg-violet-50 border border-violet-200 text-violet-600 text-[10px] font-bold px-2 py-1 rounded-full">
            <Sparkle size={10} weight="fill" /> AI Match
          </div>
        </div>

        {/* Score bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Độ phù hợp</span>
          </div>
          <ScoreBar score={mentor.matchScore} />
        </div>

        {/* AI Reason */}
        {mentor.aiReason && (
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 mb-3 flex items-start gap-2">
            <Robot size={14} className="text-violet-500 shrink-0 mt-0.5" />
            <p className="text-xs text-violet-700 leading-relaxed font-medium">{mentor.aiReason}</p>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {hasRating && (
            <span className="flex items-center gap-1">
              <Star size={11} weight="fill" className="text-amber-400" />
              <span className="font-bold text-slate-700">{mentor.avgRating?.toFixed(1)}</span>
              {mentor.reviewCount > 0 && <span>({mentor.reviewCount})</span>}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Shield size={11} className="text-teal-500" />
            <span>{mentor.trustScore}</span>
          </span>
          <span className="ml-auto flex items-center gap-1 font-extrabold text-slate-700">
            <Lightning size={11} weight="fill" className="text-amber-400" />
            {mentor.creditsPerHour} <span className="font-normal text-slate-400">tín/giờ</span>
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <button
          onClick={() => onView(mentor)}
          className="w-full py-2.5 bg-slate-900 hover:bg-violet-600 text-white font-bold rounded-xl transition-all text-sm active:scale-95 shadow-sm"
        >
          Xem hồ sơ & Đặt slot →
        </button>
      </div>
    </div>
  );
};

// ─── Chat Message ─────────────────────────────────────────────────────────────
const ChatMsg = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isUser ? 'bg-violet-600' : 'bg-slate-800'}`}>
        {isUser
          ? <User size={14} weight="fill" className="text-white" />
          : <Sparkle size={14} weight="fill" className="text-white" />
        }
      </div>
      {/* Bubble */}
      <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? 'bg-violet-600 text-white rounded-tr-sm'
          : 'bg-white border border-slate-100 shadow-sm text-slate-700 rounded-tl-sm'
      }`}>
        {msg.text}
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AiMentorSearch({ onViewMentor }) {
  const [input, setValue]         = useState('');
  const [chatHistory, setChat]    = useState([]);
  const [aiMentors, setMentors]   = useState(null);
  const [isLoading, setLoading]   = useState(false);
  const [loadPhase, setPhase]     = useState(0);
  const [isOpen, setOpen]         = useState(false);
  const [isFocused, setFocused]   = useState(false);
  const [placeholderIdx, setPIdx] = useState(0);
  const [isExpanded, setExpanded] = useState(true);

  const chatEndRef  = useRef(null);
  const textareaRef = useRef(null);

  // Rotate placeholder
  useEffect(() => {
    if (isFocused) return;
    const t = setInterval(() => setPIdx(i => (i + 1) % PLACEHOLDER_TEXTS.length), 3200);
    return () => clearInterval(t);
  }, [isFocused]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  // Loading phase ticker
  useEffect(() => {
    if (!isLoading) { setPhase(0); return; }
    const t = setInterval(() => setPhase(p => Math.min(p + 1, LOADING_PHASES.length - 1)), 900);
    return () => clearInterval(t);
  }, [isLoading]);

  const handleSend = useCallback(async () => {
    const msg = input.trim();
    if (!msg || isLoading) return;
    setValue('');
    setOpen(true);
    setExpanded(true);
    setLoading(true);
    setChat(prev => [...prev, { role: 'user', text: msg }]);

    try {
      const res = await aiService.sendMessage(msg);
      setChat(prev => [...prev, { role: 'ai', text: res.message }]);
      if (res.isSearchResult && res.mentors?.length > 0) {
        setMentors(res.mentors);
      }
    } catch {
      setChat(prev => [...prev, { role: 'ai', text: '❌ Lỗi kết nối. Bạn thử lại nhé!' }]);
    } finally {
      setLoading(false);
    }
  }, [input, isLoading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleReset = useCallback(async () => {
    await aiService.resetSession();
    setChat([]);
    setMentors(null);
    setOpen(false);
    setExpanded(true);
    setValue('');
  }, []);

  const hasChatOrResults = chatHistory.length > 0 || aiMentors;

  return (
    <div className="mb-8">
      {/* ── Hero Search Bar ─────────────────────────────────────────────── */}
      <div className={`bg-white rounded-2xl border-2 transition-all duration-300 shadow-sm ${
        isFocused ? 'border-violet-400 shadow-violet-100 shadow-lg' : 'border-slate-100'
      }`}>
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm shadow-violet-200">
              <Sparkle size={18} weight="fill" className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm">SkillSync AI</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-violet-100 text-violet-600 rounded-full border border-violet-200">
                  Conversational RAG
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Mô tả mục tiêu → AI tìm Mentor phù hợp nhất</p>
            </div>
            {hasChatOrResults && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-violet-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-violet-50"
              >
                <ArrowCounterClockwise size={13} weight="bold" /> Tìm lại
              </button>
            )}
          </div>
        </div>

        {/* Input area */}
        <div className="px-6 py-4 relative">
          {/* Animated placeholder overlay */}
          {!input && !isFocused && (
            <div
              key={placeholderIdx}
              className="absolute left-6 top-4 right-24 text-sm text-slate-400 pointer-events-none select-none"
              style={{ animation: 'fadeSlideIn 0.4s ease forwards' }}
            >
              <span className="italic">{PLACEHOLDER_TEXTS[placeholderIdx]}</span>
            </div>
          )}
          <div className="flex gap-3 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={handleKeyDown}
              rows={2}
              disabled={isLoading}
              placeholder={isFocused ? 'Nhập mục tiêu học tập... (Enter để gửi, Shift+Enter xuống dòng)' : ''}
              className="flex-1 resize-none bg-transparent text-slate-800 text-sm outline-none placeholder-slate-300 leading-relaxed font-medium min-h-[48px]"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                input.trim() && !isLoading
                  ? 'bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-200 active:scale-95'
                  : 'bg-slate-100 cursor-not-allowed'
              }`}
            >
              {isLoading
                ? <svg className="animate-spin w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                : <PaperPlaneRight size={18} weight="fill" className={input.trim() ? 'text-white' : 'text-slate-400'} />
              }
            </button>
          </div>
        </div>

        {/* Hint bar */}
        {!hasChatOrResults && (
          <div className="px-6 pb-4 flex items-center gap-4 text-[11px] text-slate-400">
            {['💬 Hỏi bằng tiếng Việt tự nhiên', '🎯 AI hỏi lại nếu thiếu thông tin', '✨ Xếp hạng theo độ phù hợp'].map(h => (
              <span key={h} className="flex items-center gap-1">{h}</span>
            ))}
          </div>
        )}
      </div>

      {/* ── Chat Panel ──────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="mt-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          style={{ animation: 'fadeSlideInUp 0.3s ease forwards' }}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-600">Hội thoại AI</span>
              {chatHistory.length > 0 && (
                <span className="text-xs text-slate-400">· {Math.ceil(chatHistory.length / 2)} lượt</span>
              )}
            </div>
            <button onClick={() => setExpanded(e => !e)}
              className="text-slate-400 hover:text-slate-600 transition-colors">
              {isExpanded ? <CaretUp size={14} /> : <CaretDown size={14} />}
            </button>
          </div>

          {isExpanded && (
            <>
              {/* Chat messages */}
              <div className="px-5 py-4 space-y-3 max-h-72 overflow-y-auto bg-slate-50/30">
                {chatHistory.map((msg, i) => <ChatMsg key={i} msg={msg} />)}

                {/* Loading state */}
                {isLoading && (
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                      <Sparkle size={14} weight="fill" className="text-white" />
                    </div>
                    <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-tl-sm">
                      <TypingDots />
                      <LoadingPhases phase={loadPhase} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Mentor results */}
              {aiMentors && (
                <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                  {/* Results header */}
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy size={16} weight="fill" className="text-amber-500" />
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      Mentor phù hợp nhất với bạn
                    </h3>
                    <span className="text-xs font-bold text-slate-400 ml-auto">
                      {aiMentors.length} kết quả · xếp theo độ phù hợp
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {aiMentors.map((mentor, i) => (
                      <MentorAiCard
                        key={mentor.mentorId}
                        mentor={mentor}
                        index={i}
                        onView={onViewMentor}
                      />
                    ))}
                  </div>

                  {/* Reset */}
                  <button
                    onClick={handleReset}
                    className="mt-4 w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-slate-500 hover:text-violet-600 font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <ArrowCounterClockwise size={14} weight="bold" /> Tìm kiếm lại với yêu cầu khác
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
