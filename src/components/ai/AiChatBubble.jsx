// src/components/ai/AiChatBubble.jsx
// ─── Floating & Draggable AI Chat Bubble Widget ──────────────────────────────
// - Drag anywhere on screen using pointer events (no external lib)
// - Short click → open/close; significant movement → drag repositions
// - Chat window auto-repositions to stay visible in viewport
// - Default position: above mobile bottom nav (avoids overlap with nav items)

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Robot, X, PaperPlaneRight, ArrowCounterClockwise,
  Sparkle, User, Star, Lightning,
  Trophy, CaretDown, ArrowSquareOut,
} from '@phosphor-icons/react';
import { aiService } from '../../services/aiService';
import { useNavigate } from 'react-router-dom';

const LOADING_PHASES = [
  '✨ Đang nhận diện yêu cầu...',
  '🔍 Truy xuất Mentor...',
  '🤔 Phân tích độ phù hợp...',
  '🏆 Sắp xong rồi!',
];

const QUICK_PROMPTS = [
  '🎯 Tôi muốn học để đi thực tập',
  '💻 Gợi ý mentor học ReactJS',
  '📊 Chuyển sang Data Science',
  '🔒 Học Cybersecurity từ đầu',
];

const LEVEL_CONFIG = {
  BEGINNER:     { label: 'Cơ bản',    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  INTERMEDIATE: { label: 'Trung cấp', cls: 'bg-amber-50   text-amber-700   border-amber-200' },
  ADVANCED:     { label: 'Nâng cao',  cls: 'bg-violet-50  text-violet-700  border-violet-200' },
};

const BTN = 56;  // button diameter (px)
const GAP = 12;  // gap between bubble and chat window

// ─── Small helpers ────────────────────────────────────────────────────────────
const TypingDots = () => (
  <div className="flex items-center gap-1 px-1 py-0.5">
    {[0, 1, 2].map(i => (
      <span key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block"
        style={{ animation: `aiChatBounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
    ))}
  </div>
);

const MAvatar = ({ src, name, size = 'w-9 h-9' }) => {
  const [err, setErr] = useState(false);
  const ch    = name?.charAt(0)?.toUpperCase() ?? '?';
  const idx   = (name?.charCodeAt(0) ?? 0) % 5;
  const clrs  = ['bg-violet-500','bg-indigo-500','bg-sky-500','bg-teal-500','bg-emerald-500'];
  if (src && !err)
    return <img src={src} alt={name} onError={() => setErr(true)} className={`${size} rounded-xl object-cover shrink-0`} />;
  return <div className={`${size} rounded-xl ${clrs[idx]} text-white flex items-center justify-center font-extrabold text-sm shrink-0`}>{ch}</div>;
};

const ScoreBar = ({ score }) => {
  const pct = Math.round((score ?? 0) * 100);
  const col = pct >= 85 ? 'bg-emerald-500' : pct >= 70 ? 'bg-amber-400' : 'bg-violet-400';
  return (
    <div className="flex items-center gap-1.5 mt-1">
      <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${col} rounded-full`} style={{ width: `${pct}%`, transition: 'width .6s ease' }} />
      </div>
      <span className="text-[10px] font-bold text-slate-400 shrink-0">{pct}%</span>
    </div>
  );
};

const MentorMiniCard = ({ mentor, onView }) => {
  const lvl = LEVEL_CONFIG[mentor.level] ?? LEVEL_CONFIG.BEGINNER;
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm hover:border-violet-200 transition-colors">
      <div className="flex items-start gap-2.5">
        <MAvatar src={mentor.avatarUrl} name={mentor.fullName} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-extrabold text-slate-900 text-xs truncate">{mentor.fullName}</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${lvl.cls}`}>{lvl.label}</span>
          </div>
          <p className="text-[10px] text-slate-500 truncate">{mentor.skillName}</p>
          <ScoreBar score={mentor.matchScore} />
        </div>
        <div className="text-right shrink-0 ml-1">
          <div className="flex items-center gap-0.5 text-[10px] font-extrabold text-slate-700">
            <Lightning size={9} weight="fill" className="text-amber-400" />{mentor.creditsPerHour}
          </div>
          {mentor.avgRating > 0 && (
            <div className="flex items-center gap-0.5 text-[10px] text-slate-500">
              <Star size={9} weight="fill" className="text-amber-400" />{mentor.avgRating?.toFixed(1)}
            </div>
          )}
        </div>
      </div>
      {mentor.aiReason && (
        <p className="mt-2 text-[10px] text-violet-600 bg-violet-50 rounded-lg px-2 py-1.5 leading-relaxed border border-violet-100">
          🤖 {mentor.aiReason}
        </p>
      )}
      <button onClick={() => onView(mentor)}
        className="mt-2 w-full py-1.5 text-[10px] font-bold bg-slate-900 hover:bg-violet-600 text-white rounded-lg transition-all flex items-center justify-center gap-1 active:scale-95">
        Xem hồ sơ <ArrowSquareOut size={9} weight="bold" />
      </button>
    </div>
  );
};

const ChatBubble = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-violet-600' : 'bg-gradient-to-br from-violet-500 to-indigo-600'}`}>
        {isUser
          ? <User size={12} weight="fill" className="text-white" />
          : <Sparkle size={12} weight="fill" className="text-white" />
        }
      </div>
      <div className={`max-w-[82%] text-xs leading-relaxed rounded-2xl px-3 py-2 ${
        isUser
          ? 'bg-violet-600 text-white rounded-br-sm'
          : 'bg-white text-slate-700 border border-slate-100 shadow-sm rounded-bl-sm'
      }`}>
        {msg.text}
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function AiChatBubble({ onViewMentor }) {
  const navigate = useNavigate();

  // Bubble position (top-left corner of button, in viewport px)
  const [pos, setPos] = useState(() => ({
    x: window.innerWidth  - BTN - 20,
    y: window.innerHeight - BTN - 20 - 64, // above mobile bottom nav
  }));

  const [isOpen,     setOpen]     = useState(false);
  const [input,      setInput]    = useState('');
  const [chat,       setChat]     = useState([]);
  const [mentors,    setMentors]  = useState(null);
  const [loading,    setLoading]  = useState(false);
  const [phase,      setPhase]    = useState(0);
  const [hasGreeted, setGreeted]  = useState(false);

  // Drag tracking (refs avoid stale closure issues)
  const isDragging = useRef(false);
  const didMove    = useRef(false);
  const startPtr   = useRef({ x: 0, y: 0 });
  const startPos   = useRef({ x: 0, y: 0 });
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  // Auto-scroll chat
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat, loading]);

  // Loading phase cycler
  useEffect(() => {
    if (!loading) { setPhase(0); return; }
    const t = setInterval(() => setPhase(p => Math.min(p + 1, LOADING_PHASES.length - 1)), 980);
    return () => clearInterval(t);
  }, [loading]);

  // Greeting on first open
  useEffect(() => {
    if (!isOpen || hasGreeted) return;
    setGreeted(true);
    setTimeout(() => setChat([{
      role: 'ai', text: 'Xin chào! 👋 Mình là SkillSync AI. Bạn muốn học kỹ năng gì? Mình sẽ tìm Mentor phù hợp nhất cho bạn!'
    }]), 360);
  }, [isOpen, hasGreeted]);

  // Clamp on resize
  useEffect(() => {
    const onResize = () => setPos(p => ({
      x: Math.min(p.x, window.innerWidth  - BTN - 8),
      y: Math.min(p.y, window.innerHeight - BTN - 8),
    }));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Drag handlers ──────────────────────────────────────────────
  const onPointerDown = useCallback((e) => {
    isDragging.current = true;
    didMove.current    = false;
    startPtr.current   = { x: e.clientX, y: e.clientY };
    startPos.current   = { ...pos };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [pos]);

  const onPointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startPtr.current.x;
    const dy = e.clientY - startPtr.current.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) didMove.current = true;
    if (!didMove.current) return;
    setPos({
      x: Math.max(8, Math.min(startPos.current.x + dx, window.innerWidth  - BTN - 8)),
      y: Math.max(8, Math.min(startPos.current.y + dy, window.innerHeight - BTN - 8)),
    });
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    if (!didMove.current) setOpen(o => !o); // short tap = toggle
    didMove.current = false;
  }, []);

  // ── Chat ──────────────────────────────────────────────────────
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
    setChat([]); setMentors(null); setGreeted(false); setInput('');
  }, []);

  const handleViewMentor = useCallback((mentor) => {
    if (onViewMentor) {
      onViewMentor(mentor);
    } else {
      // Navigate to Explore and pass the teaching-skill ID so Explore
      // can open the detail panel directly for this mentor
      navigate('/app/explore', { state: { openMentorId: mentor.mentorId } });
    }
    setOpen(false);
  }, [onViewMentor, navigate]);

  // ── Chat window placement ──────────────────────────────────────
  const CHAT_W = 360, CHAT_H = 520;
  const vw = window.innerWidth, vh = window.innerHeight;

  // Open left if too close to right edge, else open right
  const openLeft = (pos.x + BTN + GAP + CHAT_W) > (vw - 8);
  const chatX    = openLeft ? pos.x - CHAT_W - GAP : pos.x + BTN + GAP;

  // Align top of chat window with bubble, clamped to viewport
  let chatY = pos.y;
  if (chatY + CHAT_H > vh - 8) chatY = vh - CHAT_H - 8;
  if (chatY < 8) chatY = 8;

  const userMessages = chat.filter(m => m.role === 'user').length;

  return (
    <>
      {/* ── Keyframes ──────────────────────────────────────────────── */}
      <style>{`
        @keyframes aiChatBounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        @keyframes aiBubbleIn   { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
        @keyframes aiMsgIn      { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
        @keyframes aiPulseRing  { 0%{transform:scale(1);opacity:0.55} 100%{transform:scale(1.65);opacity:0} }
        .ai-chat-win { animation: aiBubbleIn 0.25s cubic-bezier(0.34,1.4,0.64,1) forwards; }
        .ai-msg-in   { animation: aiMsgIn    0.22s ease forwards; }
      `}</style>

      {/* ── Chat Window ─────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="ai-chat-win fixed flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden z-[9998]"
          style={{
            left: chatX, top: chatY,
            width: CHAT_W, maxHeight: CHAT_H,
            boxShadow: '0 20px 48px -8px rgba(99,102,241,.22), 0 6px 20px -4px rgba(0,0,0,.1)',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 shrink-0">
            <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkle size={15} weight="fill" className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-extrabold text-sm leading-tight">SkillSync AI</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                <span className="text-white/70 text-[10px] truncate">Mentor Matcher · Luôn sẵn sàng</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {chat.length > 0 && (
                <button onClick={handleReset} title="Bắt đầu lại"
                  className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
                  <ArrowCounterClockwise size={13} className="text-white" weight="bold" />
                </button>
              )}
              <button onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
                <CaretDown size={13} className="text-white" weight="bold" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50/30"
            style={{ maxHeight: CHAT_H - 180 }}>
            {chat.map((msg, i) => (
              <div key={i} className="ai-msg-in"><ChatBubble msg={msg} /></div>
            ))}

            {/* Mentor cards */}
            {mentors && (
              <div className="ai-msg-in">
                <div className="flex items-center gap-1.5 mb-2 pl-8">
                  <Trophy size={11} weight="fill" className="text-amber-500" />
                  <span className="text-[10px] font-bold text-slate-500">{mentors.length} mentor · AI score</span>
                </div>
                <div className="pl-8 space-y-2">
                  {mentors.map((m, i) => (
                    <div key={m.mentorId} className="ai-msg-in" style={{ animationDelay: `${i * 70}ms` }}>
                      <MentorMiniCard mentor={m} onView={handleViewMentor} />
                    </div>
                  ))}
                </div>
                <div className="pl-8 mt-2">
                  <button onClick={handleReset}
                    className="w-full py-1.5 text-[10px] font-bold text-slate-400 hover:text-violet-600 border border-dashed border-slate-200 hover:border-violet-300 rounded-xl transition-all flex items-center justify-center gap-1">
                    <ArrowCounterClockwise size={9} weight="bold" /> Tìm lại với yêu cầu khác
                  </button>
                </div>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex gap-2 items-end ai-msg-in">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0">
                  <Sparkle size={12} weight="fill" className="text-white" />
                </div>
                <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-bl-sm px-3 py-2">
                  <TypingDots />
                  <p className="text-[10px] text-slate-400 mt-0.5">{LOADING_PHASES[phase]}</p>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts — shown only before first user message */}
          {userMessages === 0 && !loading && (
            <div className="px-4 pb-2 shrink-0">
              <p className="text-[10px] font-bold text-slate-400 mb-1.5">Gợi ý nhanh:</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map(q => (
                  <button key={q} onClick={() => handleSend(q)}
                    className="text-[10px] font-semibold px-2.5 py-1.5 bg-slate-50 hover:bg-violet-50 border border-slate-200 hover:border-violet-300 text-slate-600 hover:text-violet-600 rounded-full transition-all">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input bar */}
          <div className="px-4 py-3 border-t border-slate-100 bg-white shrink-0">
            <div className="flex gap-2 items-center">
              <input ref={inputRef} type="text" value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                disabled={loading}
                placeholder="Mô tả mục tiêu học tập..."
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-violet-400 focus:bg-white transition-all placeholder-slate-400 font-medium text-slate-800"
              />
              <button onClick={() => handleSend()} disabled={!input.trim() || loading}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                  input.trim() && !loading
                    ? 'bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-200 active:scale-95'
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
            <p className="text-[9px] text-slate-300 text-center mt-1.5">Powered by Gemini · SkillSync AI</p>
          </div>
        </div>
      )}

      {/* ── Draggable Bubble Button ────────────────────────────────── */}
      <div
        className="fixed z-[9999] touch-none select-none"
        style={{ left: pos.x, top: pos.y, width: BTN, height: BTN }}
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
          className={`relative w-full h-full rounded-full shadow-xl flex items-center justify-center transition-colors duration-200 ${
            isOpen
              ? 'bg-slate-700 hover:bg-slate-800'
              : 'bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500'
          }`}
          style={isOpen ? {} : { boxShadow: '0 8px 24px -4px rgba(124,58,237,0.45)' }}
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
