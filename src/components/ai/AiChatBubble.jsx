// src/components/ai/AiChatBubble.jsx
// ─── Floating AI Chat Bubble — Mobile bottom-sheet / Desktop floating window ──

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Robot, X, PaperPlaneRight, ArrowCounterClockwise,
  Sparkle, User, Star, Lightning,
  Trophy, CaretDown, ArrowSquareOut, Smiley,
} from '@phosphor-icons/react';
import { aiService } from '../../services/aiService';
import { useNavigate } from 'react-router-dom';

const LOADING_PHASES = [
  'Đang nhận diện yêu cầu...',
  'Truy xuất Mentor...',
  'Phân tích độ phù hợp...',
  'Sắp xong rồi!',
];

const QUICK_PROMPTS = [
  'Tôi muốn học để đi thực tập',
  'Gợi ý mentor học ReactJS',
  'Chuyển sang Data Science',
  'Học Cybersecurity từ đầu',
];

const LEVEL_CONFIG = {
  BEGINNER:     { label: 'Cơ bản',    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  INTERMEDIATE: { label: 'Trung cấp', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  ADVANCED:     { label: 'Nâng cao',  cls: 'bg-violet-50 text-violet-700 border-violet-200' },
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const TypingDots = () => (
  <div className="flex items-center gap-1 px-1 py-0.5">
    {[0, 1, 2].map(i => (
      <span key={i} className="w-2 h-2 rounded-full bg-violet-400 inline-block"
        style={{ animation: `aiDot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
    ))}
  </div>
);

const MAvatar = ({ src, name, size = 'w-9 h-9' }) => {
  const [err, setErr] = useState(false);
  const ch  = name?.charAt(0)?.toUpperCase() ?? '?';
  const idx = (name?.charCodeAt(0) ?? 0) % 5;
  const clrs = ['bg-violet-500','bg-indigo-500','bg-sky-500','bg-teal-500','bg-emerald-500'];
  if (src && !err)
    return <img src={src} alt={name} onError={() => setErr(true)} className={`${size} rounded-xl object-cover shrink-0`} />;
  return (
    <div className={`${size} rounded-xl ${clrs[idx]} text-white flex items-center justify-center font-extrabold text-sm shrink-0`}>
      {ch}
    </div>
  );
};

const ScoreBar = ({ score }) => {
  const pct = Math.round((score ?? 0) * 100);
  const col = pct >= 85 ? 'bg-emerald-500' : pct >= 70 ? 'bg-amber-400' : 'bg-violet-400';
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${col} rounded-full`} style={{ width: `${pct}%`, transition: 'width .6s ease' }} />
      </div>
      <span className="text-[10px] font-bold text-slate-400 shrink-0">{pct}% phù hợp</span>
    </div>
  );
};

const MentorMiniCard = ({ mentor, onView }) => {
  const lvl = LEVEL_CONFIG[mentor.level] ?? LEVEL_CONFIG.BEGINNER;
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-sm hover:shadow-md hover:border-violet-200 transition-all">
      <div className="flex items-start gap-3">
        <MAvatar src={mentor.avatarUrl} name={mentor.fullName} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-extrabold text-slate-900 text-xs truncate">{mentor.fullName}</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${lvl.cls}`}>{lvl.label}</span>
          </div>
          <p className="text-[11px] text-slate-500 truncate mt-0.5">{mentor.skillName}</p>
          <ScoreBar score={mentor.matchScore} />
        </div>
        <div className="text-right shrink-0 ml-1">
          <div className="flex items-center gap-0.5 text-[11px] font-extrabold text-amber-600">
            <Lightning size={10} weight="fill" className="text-amber-400" />{mentor.creditsPerHour}cr
          </div>
          {mentor.avgRating > 0 && (
            <div className="flex items-center gap-0.5 text-[10px] text-slate-500 mt-0.5">
              <Star size={9} weight="fill" className="text-amber-400" />{mentor.avgRating?.toFixed(1)}
            </div>
          )}
        </div>
      </div>
      {mentor.aiReason && (
        <p className="mt-2.5 text-[10px] text-violet-700 bg-violet-50 rounded-xl px-2.5 py-2 leading-relaxed border border-violet-100 italic">
          ✨ {mentor.aiReason}
        </p>
      )}
      <button onClick={() => onView(mentor)}
        className="mt-2.5 w-full py-2 text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95">
        Xem hồ sơ <ArrowSquareOut size={11} weight="bold" />
      </button>
    </div>
  );
};

const ChatBubble = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
        isUser ? 'bg-violet-600' : 'bg-gradient-to-br from-violet-500 to-indigo-600'
      }`}>
        {isUser
          ? <User size={13} weight="fill" className="text-white" />
          : <Sparkle size={13} weight="fill" className="text-white" />
        }
      </div>
      <div className={`max-w-[80%] text-[13px] leading-relaxed rounded-2xl px-3.5 py-2.5 shadow-sm ${
        isUser
          ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-sm'
          : 'bg-white text-slate-700 border border-slate-100 rounded-bl-sm'
      }`}>
        {msg.text}
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AiChatBubble({ onViewMentor }) {
  const navigate = useNavigate();

  // Mobile detection (<=640px)
  const isMobile = () => window.innerWidth <= 640;

  // Desktop bubble position
  const [pos, setPos] = useState(() => ({
    x: window.innerWidth  - 68,
    y: window.innerHeight - 68 - 64,
  }));

  const [isOpen,     setOpen]    = useState(false);
  const [input,      setInput]   = useState('');
  const [chat,       setChat]    = useState([]);
  const [mentors,    setMentors] = useState(null);
  const [loading,    setLoading] = useState(false);
  const [phase,      setPhase]   = useState(0);
  const hasGreetedRef = useRef(false); // dùng ref tránh re-render thêm
  const [mobile,     setMobile]  = useState(isMobile());

  const isDragging = useRef(false);
  const didMove    = useRef(false);
  const startPtr   = useRef({ x: 0, y: 0 });
  const startPos   = useRef({ x: 0, y: 0 });
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  // Track mobile breakpoint
  useEffect(() => {
    const onResize = () => {
      setMobile(isMobile());
      setPos(p => ({
        x: Math.min(p.x, window.innerWidth  - 68),
        y: Math.min(p.y, window.innerHeight - 68),
      }));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Auto-scroll
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat, loading]);

  // Loading phase cycler
  useEffect(() => {
    if (!loading) { setPhase(0); return; }
    const t = setInterval(() => setPhase(p => Math.min(p + 1, LOADING_PHASES.length - 1)), 980);
    return () => clearInterval(t);
  }, [loading]);

  // Greeting on first open — dùng ref tránh re-render loop + bỏ setTimeout
  useEffect(() => {
    if (!isOpen || hasGreetedRef.current) return;
    hasGreetedRef.current = true;
    setChat([{
      role: 'ai', text: 'Xin chào! 👋 Mình là SkillSync AI. Bạn muốn học kỹ năng gì? Mình sẽ tìm Mentor phù hợp nhất cho bạn!'
    }]);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 400);
  }, [isOpen]);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (mobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobile, isOpen]);

  // ── Drag (desktop only) ────────────────────────────────────────────
  const onPointerDown = useCallback((e) => {
    if (mobile) return;
    isDragging.current = true;
    didMove.current    = false;
    startPtr.current   = { x: e.clientX, y: e.clientY };
    startPos.current   = { ...pos };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [pos, mobile]);

  const onPointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startPtr.current.x;
    const dy = e.clientY - startPtr.current.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) didMove.current = true;
    if (!didMove.current) return;
    setPos({
      x: Math.max(8, Math.min(startPos.current.x + dx, window.innerWidth  - 60)),
      y: Math.max(8, Math.min(startPos.current.y + dy, window.innerHeight - 60)),
    });
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    if (!didMove.current) setOpen(o => !o);
    didMove.current = false;
  }, []);

  // ── Chat ───────────────────────────────────────────────────────────
  const handleSend = useCallback(async (override) => {
    const text = (override ?? input).trim();
    if (!text || loading) return;
    setInput('');
    setLoading(true);
    setMentors(null);
    setChat(prev => [...prev, { role: 'user', text }]);
    inputRef.current?.focus();
    try {
      const res = await aiService.sendMessage(text);
      setChat(prev => [...prev, { role: 'ai', text: res.message }]);
      if (res.isSearchResult && res.mentors?.length > 0) setMentors(res.mentors);
    } catch {
      setChat(prev => [...prev, { role: 'ai', text: '❌ Lỗi kết nối. Bạn thử lại nhé!' }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  const handleReset = useCallback(async () => {
    await aiService.resetSession();
    hasGreetedRef.current = false;
    setChat([]); setMentors(null); setInput('');
  }, []);

  const handleViewMentor = useCallback((mentor) => {
    if (onViewMentor) {
      onViewMentor(mentor);
    } else {
      navigate('/app/explore', { state: { openMentorId: mentor.mentorId } });
    }
    setOpen(false);
  }, [onViewMentor, navigate]);

  // ── Desktop window placement ──────────────────────────────────────
  const CHAT_W = 360, CHAT_H = 540;
  const vw = window.innerWidth, vh = window.innerHeight;
  const openLeft = (pos.x + 60 + 12 + CHAT_W) > (vw - 8);
  const chatX    = openLeft ? pos.x - CHAT_W - 12 : pos.x + 60 + 12;
  let chatY = pos.y;
  if (chatY + CHAT_H > vh - 8) chatY = vh - CHAT_H - 8;
  if (chatY < 8) chatY = 8;

  const userMessages = chat.filter(m => m.role === 'user').length;

  // ── Header JSX ──────────────────────────────────────────────────
  const headerJsx = (
    <div className="flex items-center gap-3 px-4 py-3.5 shrink-0"
      style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}>
      <div className="w-8 h-8 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
        <Sparkle size={16} weight="fill" className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-extrabold text-sm leading-tight tracking-tight">SkillSync AI</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shadow-sm" />
          <span className="text-white/70 text-[10px] font-medium truncate">Mentor Matcher · Luôn sẵn sàng</span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {chat.length > 0 && (
          <button onClick={handleReset} title="Bắt đầu lại"
            className="w-7 h-7 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all active:scale-90">
            <ArrowCounterClockwise size={13} className="text-white" weight="bold" />
          </button>
        )}
        <button onClick={() => setOpen(false)}
          className="w-7 h-7 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all active:scale-90">
          {mobile ? <X size={14} className="text-white" weight="bold" /> : <CaretDown size={13} className="text-white" weight="bold" />}
        </button>
      </div>
    </div>
  );

  // ── Messages JSX ─────────────────────────────────────────────────
  const messagesJsx = (maxH) => (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      style={maxH ? { maxHeight: maxH } : {}}>
      {chat.map((msg, i) => (
        <div key={i} className="ai-msg-in"><ChatBubble msg={msg} /></div>
      ))}
      {mentors && (
        <div className="ai-msg-in">
          <div className="flex items-center gap-1.5 mb-2.5 pl-9">
            <Trophy size={12} weight="fill" className="text-amber-500" />
            <span className="text-[11px] font-bold text-slate-500">{mentors.length} mentor phù hợp nhất</span>
          </div>
          <div className="pl-9 space-y-2.5">
            {mentors.map((m, idx) => (
              <div key={m.mentorId} className="ai-msg-in" style={{ animationDelay: `${idx * 70}ms` }}>
                <MentorMiniCard mentor={m} onView={handleViewMentor} />
              </div>
            ))}
          </div>
          <div className="pl-9 mt-3">
            <button onClick={handleReset}
              className="w-full py-2 text-[11px] font-bold text-slate-400 hover:text-violet-600 border border-dashed border-slate-200 hover:border-violet-300 rounded-xl transition-all flex items-center justify-center gap-1.5">
              <ArrowCounterClockwise size={10} weight="bold" /> Tìm lại với yêu cầu khác
            </button>
          </div>
        </div>
      )}
      {loading && (
        <div className="flex gap-2 items-end ai-msg-in">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
            <Sparkle size={13} weight="fill" className="text-white" />
          </div>
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-2.5">
            <TypingDots />
            <p className="text-[10px] text-slate-400 mt-1 font-medium">{LOADING_PHASES[phase]}</p>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );

  // ── Quick prompts JSX ─────────────────────────────────────────────
  const quickPromptsJsx = userMessages === 0 && !loading ? (
    <div className="px-4 pb-3 shrink-0">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Gợi ý nhanh</p>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_PROMPTS.map(q => (
          <button key={q} onClick={() => handleSend(q)}
            className="text-[11px] font-semibold px-3 py-1.5 bg-violet-50 hover:bg-violet-100 border border-violet-200 hover:border-violet-300 text-violet-700 rounded-full transition-all active:scale-95">
            {q}
          </button>
        ))}
      </div>
    </div>
  ) : null;

  // ── Input bar JSX ─────────────────────────────────────────────────
  const inputBarJsx = (
    <div className="px-4 py-3 border-t border-slate-100 bg-white/80 backdrop-blur-sm shrink-0">
      <div className="flex gap-2 items-center">
        <input ref={inputRef} type="text" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          disabled={loading}
          placeholder="Mô tả mục tiêu học tập..."
          className="flex-1 text-[13px] bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 outline-none focus:border-violet-400 focus:bg-white transition-all placeholder-slate-400 font-medium text-slate-800"
        />
        <button onClick={() => handleSend()} disabled={!input.trim() || loading}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
            input.trim() && !loading
              ? 'bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-200 active:scale-90'
              : 'bg-slate-100 cursor-not-allowed'
          }`}>
          {loading
            ? <svg className="animate-spin w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            : <PaperPlaneRight size={16} weight="fill" className={input.trim() ? 'text-white' : 'text-slate-400'} />
          }
        </button>
      </div>
      <p className="text-[9px] text-slate-300 text-center mt-2 font-medium tracking-wide">
        ✶ Powered by Gemini · SkillSync AI
      </p>
    </div>
  );

  return (
    <>
      {/* ── Keyframes ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes aiDot        { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        @keyframes aiBubbleIn   { from{opacity:0;transform:scale(0.92) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes aiSheetIn    { from{opacity:0;transform:translateY(100%)} to{opacity:1;transform:translateY(0)} }
        @keyframes aiMsgIn      { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes aiPulseRing  { 0%{transform:scale(1);opacity:0.55} 100%{transform:scale(1.7);opacity:0} }
        .ai-chat-win  { animation: aiBubbleIn 0.28s cubic-bezier(0.34,1.4,0.64,1) forwards; }
        .ai-sheet-in  { animation: aiSheetIn  0.32s cubic-bezier(0.22,1,0.36,1) forwards; }
        .ai-msg-in    { animation: aiMsgIn    0.22s ease forwards; }
        .ai-overlay   { animation: aiBubbleIn 0.2s ease forwards; }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════
          MOBILE — Bottom Sheet (full width, slides up)
          ============================================================ */}
      {mobile && isOpen && (
        <>
          {/* Backdrop */}
          <div className="ai-overlay fixed inset-0 bg-black/40 backdrop-blur-sm z-[9997]"
            onClick={() => setOpen(false)} />
          {/* Sheet */}
          <div className="ai-sheet-in fixed bottom-0 left-0 right-0 z-[9998] flex flex-col bg-white rounded-t-3xl overflow-hidden"
            style={{ maxHeight: '90dvh', minHeight: '60dvh', boxShadow: '0 -8px 40px -4px rgba(99,102,241,0.25)' }}>
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-slate-200" />
            </div>
            {headerJsx}
            {messagesJsx()}
            {quickPromptsJsx}
            {inputBarJsx}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
          DESKTOP — Floating window
          ============================================================ */}
      {!mobile && isOpen && (
        <div
          className="ai-chat-win fixed flex flex-col bg-white rounded-3xl overflow-hidden z-[9998]"
          style={{
            left: chatX, top: chatY,
            width: CHAT_W, maxHeight: CHAT_H,
            boxShadow: '0 24px 56px -8px rgba(99,102,241,0.28), 0 8px 24px -4px rgba(0,0,0,0.12)',
            border: '1px solid rgba(226,232,240,0.8)',
          }}
        >
          {headerJsx}
          {messagesJsx(CHAT_H - 190)}
          {quickPromptsJsx}
          {inputBarJsx}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          Floating Bubble Button
          ============================================================ */}
      <div
        className="fixed z-[9999] touch-none select-none"
        style={{ left: pos.x, top: pos.y, width: 56, height: 56 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* Pulse rings when closed */}
        {!isOpen && (
          <>
            <span className="absolute inset-0 rounded-full bg-violet-500 pointer-events-none"
              style={{ animation: 'aiPulseRing 2s ease-out 0.6s infinite' }} />
            <span className="absolute inset-0 rounded-full bg-violet-400 pointer-events-none"
              style={{ animation: 'aiPulseRing 2s ease-out 1.3s infinite' }} />
          </>
        )}
        <button
          className={`relative w-full h-full rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 ${
            isOpen
              ? 'bg-slate-700 hover:bg-slate-800 scale-95'
              : 'bg-gradient-to-br from-violet-600 to-indigo-600 hover:scale-105'
          }`}
          style={isOpen ? {} : { boxShadow: '0 8px 28px -4px rgba(124,58,237,0.5)' }}
          aria-label="Mở AI Mentor Chat"
        >
          {isOpen
            ? <X size={22} weight="bold" className="text-white" />
            : <Robot size={26} weight="fill" className="text-white" />
          }
        </button>
      </div>
    </>
  );
}
