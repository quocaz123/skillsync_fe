import { useState, useEffect, useRef, useCallback } from 'react';
import { searchUsersForMention } from '../../services/userService';
import { getExploreTeachingSkills } from '../../services/skillService';
import { At, GraduationCap, User, CircleNotch } from '@phosphor-icons/react';

/**
 * MentionInput — Textarea hỗ trợ @mention với dropdown 2 section:
 *   🎓 Mentor đang giảng dạy skill (từ teaching-skills/explore)
 *   👤 Người dùng (từ users/search)
 *
 * Format mention được chèn: @[Tên Người Dùng](uuid)
 * Format này được render thành <Link> khi hiển thị, và được parse ở backend để gửi notification.
 */
const MentionInput = ({
  value,
  onChange,
  onMentionsChange,
  placeholder = 'Viết bình luận... Gõ @ để tag người dùng',
  rows = 3,
  className = '',
  disabled = false,
}) => {
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  const [mentionQuery, setMentionQuery] = useState(''); // keyword đang search
  const [mentionStart, setMentionStart] = useState(-1); // vị trí ký tự @ trong value
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mentorResults, setMentorResults] = useState([]); // 🎓 Mentor dạy skill đó
  const [userResults, setUserResults] = useState([]);    // 👤 Người dùng bình thường
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  // ── Debounced search ────────────────────────────────────────────────
  const doSearch = useCallback(async (q) => {
    if (!q || q.length < 2) {
      setMentorResults([]);
      setUserResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [users, mentorsPage] = await Promise.all([
        searchUsersForMention(q, 8),
        getExploreTeachingSkills({ q, size: 5 }).catch(() => null),
      ]);
      setUserResults(Array.isArray(users) ? users : []);
      // Gom nhóm mentor theo teacherId để tránh hiện trùng
      const mentors = Array.isArray(mentorsPage?.data) ? mentorsPage.data : [];
      const seen = new Set();
      const uniqueMentors = mentors.filter(m => {
        if (seen.has(m.teacherId)) return false;
        seen.add(m.teacherId);
        return true;
      });
      setMentorResults(uniqueMentors);
    } catch {
      setUserResults([]);
      setMentorResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Xử lý typing ───────────────────────────────────────────────────
  const handleChange = (e) => {
    const text = e.target.value;
    onChange(text);

    const cursor = e.target.selectionStart;
    // Tìm @ gần nhất phía trước cursor
    const before = text.slice(0, cursor);
    const atIdx = before.lastIndexOf('@');

    if (atIdx === -1) {
      closeDropdown();
      return;
    }

    const query = before.slice(atIdx + 1);
    // Đóng dropdown nếu có khoảng trắng trong query (không phải mention nữa)
    if (/\s/.test(query)) {
      closeDropdown();
      return;
    }

    setMentionQuery(query);
    setMentionStart(atIdx);

    if (query.length < 2) {
      setShowDropdown(query.length >= 0); // Hiện dropdown ngay cả khi chưa gõ gì sau @
      setMentorResults([]);
      setUserResults([]);
      return;
    }

    // Debounce 300ms
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    setShowDropdown(true);
    updateDropdownPosition(e.target, atIdx);
  };

  // ── Tính toán vị trí dropdown ───────────────────────────────────────
  const updateDropdownPosition = (textarea, atIdx) => {
    // Dropdown luôn hiện ngay dưới textarea — đơn giản nhất, tránh lỗi tính offset ký tự
    const rect = textarea.getBoundingClientRect();
    const parentRect = textarea.parentElement.getBoundingClientRect();
    setDropdownPos({
      top: rect.height + 4,
      left: 0,
    });
  };

  const closeDropdown = () => {
    setShowDropdown(false);
    setMentionQuery('');
    setMentionStart(-1);
    setMentorResults([]);
    setUserResults([]);
  };

  // ── Chèn mention khi chọn ───────────────────────────────────────────
  const insertMention = (id, displayName) => {
    if (mentionStart === -1) return;
    const before = value.slice(0, mentionStart);       // text trước @
    const after = value.slice(mentionStart + 1 + mentionQuery.length); // text sau query
    const mention = `@${displayName}`;
    const newText = before + mention + ' ' + after;
    onChange(newText);
    
    if (onMentionsChange) {
      onMentionsChange({ id, displayName });
    }
    
    closeDropdown();
    // Focus lại textarea
    setTimeout(() => {
      if (textareaRef.current) {
        const pos = before.length + mention.length + 1;
        textareaRef.current.setSelectionRange(pos, pos);
        textareaRef.current.focus();
      }
    }, 0);
  };

  // ── Click ngoài → đóng dropdown ────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          textareaRef.current && !textareaRef.current.contains(e.target)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Cleanup debounce ────────────────────────────────────────────────
  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const hasResults = mentorResults.length > 0 || userResults.length > 0;

  return (
    <div className="relative w-full">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm outline-none 
          focus:border-violet-400 focus:bg-white resize-none transition-all placeholder:text-slate-400
          disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      />

      {/* Hint nhỏ */}
      {!showDropdown && (
        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 ml-1">
          <At size={12} weight="bold" className="text-violet-400" />
          Gõ @ để tag mentor hoặc người dùng
        </div>
      )}

      {/* ── Dropdown ─────────────────────────────────────────────────── */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
          className="absolute z-50 w-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
            <At size={14} weight="bold" className="text-violet-500" />
            <span className="text-xs font-bold text-slate-500">
              {mentionQuery.length < 2
                ? 'Gõ ít nhất 2 ký tự để tìm kiếm...'
                : `Kết quả cho "${mentionQuery}"`}
            </span>
            {loading && <CircleNotch size={13} weight="bold" className="animate-spin text-violet-400 ml-auto" />}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {/* Section: 🎓 Mentor đang giảng dạy */}
            {mentorResults.length > 0 && (
              <>
                <div className="px-4 pt-3 pb-1">
                  <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest flex items-center gap-1">
                    <GraduationCap size={12} weight="fill" /> Mentor giảng dạy
                  </span>
                </div>
                {mentorResults.map((m) => (
                  <button
                    key={`mentor-${m.teacherId}`}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); insertMention(m.teacherId, m.teacherName); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-violet-50 transition-colors text-left group"
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-lg bg-violet-100 shrink-0 overflow-hidden flex items-center justify-center font-extrabold text-violet-700 text-sm">
                      {m.teacherAvatar
                        ? <img src={m.teacherAvatar} alt="" className="w-full h-full object-cover" />
                        : m.teacherName?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate group-hover:text-violet-700 transition-colors">
                        {m.teacherName}
                      </p>
                      <p className="text-[11px] text-violet-500 font-semibold flex items-center gap-1 truncate">
                        <GraduationCap size={10} weight="fill" />
                        Dạy: {m.skillName}
                        <span className="text-slate-400 font-normal">· {m.creditsPerHour} credits/h</span>
                      </p>
                    </div>
                    <span className="text-[10px] bg-violet-100 text-violet-600 font-black px-2 py-0.5 rounded-md shrink-0">Mentor</span>
                  </button>
                ))}
              </>
            )}

            {/* Divider */}
            {mentorResults.length > 0 && userResults.length > 0 && (
              <div className="border-t border-slate-100 my-1" />
            )}

            {/* Section: 👤 Người dùng */}
            {userResults.length > 0 && (
              <>
                <div className="px-4 pt-3 pb-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <User size={12} weight="fill" /> Người dùng
                  </span>
                </div>
                {userResults.map((u) => (
                  <button
                    key={`user-${u.id}`}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); insertMention(u.id, u.fullName); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 shrink-0 overflow-hidden flex items-center justify-center font-extrabold text-slate-600 text-sm">
                      {u.avatarUrl
                        ? <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
                        : u.fullName?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate group-hover:text-slate-900 transition-colors">
                        {u.fullName}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium truncate">{u.email}</p>
                    </div>
                  </button>
                ))}
              </>
            )}

            {/* Empty state */}
            {!loading && mentionQuery.length >= 2 && !hasResults && (
              <div className="px-4 py-6 text-center text-sm text-slate-400">
                Không tìm thấy người dùng nào
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MentionInput;
