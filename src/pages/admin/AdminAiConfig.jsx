import { useState, useEffect, useCallback } from 'react';
import {
  Brain, Sliders, Timer, MagnifyingGlass,
  FloppyDisk, ArrowsClockwise, CheckCircle,
  Warning, ToggleLeft, ToggleRight, Info,
} from '@phosphor-icons/react';
import { aiConfigService } from '../../services/aiConfigService';

// ─── Reusable sub-components ───────────────────────────────────────────────

const Section = ({ icon: Icon, title, subtitle, children }) => (
  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
        <Icon size={19} weight="duotone" className="text-indigo-500" />
      </div>
      <div>
        <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="p-6 space-y-5">{children}</div>
  </div>
);

const SliderField = ({ label, desc, value, min, max, step = 1, unit = '', onChange }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <span className="text-sm font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg">
        {typeof value === 'number' ? (step < 1 ? value.toFixed(2) : value) : value}{unit}
      </span>
    </div>
    {desc && <p className="text-xs text-slate-400 mb-2">{desc}</p>}
    <input
      type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value))}
      className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-500"
    />
    <div className="flex justify-between text-xs text-slate-400 mt-1 font-mono">
      <span>{min}{unit}</span><span>{max}{unit}</span>
    </div>
  </div>
);

const ToggleField = ({ label, desc, value, onChange }) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm transition-all ${
        value
          ? 'bg-indigo-500 text-white hover:bg-indigo-600'
          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
      }`}
    >
      {value
        ? <><ToggleRight size={18} weight="bold" /> Bật</>
        : <><ToggleLeft  size={18} weight="bold" /> Tắt</>}
    </button>
  </div>
);

const SelectField = ({ label, desc, value, options, onChange }) => (
  <div>
    <label className="text-sm font-semibold text-slate-700 block mb-1">{label}</label>
    {desc && <p className="text-xs text-slate-400 mb-2">{desc}</p>}
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 appearance-none"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

// ─── Groq models ─────────────────────────────────────────────────────────
const GROQ_MODELS = [
  { value: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile (default)' },
  { value: 'llama-3.1-8b-instant',    label: 'Llama 3.1 8B Instant (nhanh hơn)' },
];

// ─── Main page ─────────────────────────────────────────────────────────────
const AdminAiConfig = () => {
  const [config, setConfig]   = useState(null);
  const [draft,  setDraft]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState(null); // { type: 'success'|'error', msg }

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const data = await aiConfigService.getConfig();
      setConfig(data);
      setDraft(data);
    } catch {
      showToast('error', 'Không thể tải cấu hình từ server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  const patch = (key, val) => setDraft(d => ({ ...d, [key]: val }));

  const isDirty = config && draft && JSON.stringify(config) !== JSON.stringify(draft);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await aiConfigService.updateConfig(draft);
      setConfig(updated);
      setDraft(updated);
      showToast('success', 'Cấu hình đã được cập nhật thành công!');
    } catch {
      showToast('error', 'Lỗi khi lưu cấu hình. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => setDraft(config);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Brain size={24} weight="duotone" className="text-indigo-500" />
            Cấu hình AI — SkillSync
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Thay đổi có hiệu lực ngay lập tức, không cần restart server
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchConfig} disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold text-sm transition-colors disabled:opacity-50"
          >
            <ArrowsClockwise size={14} className={loading ? 'animate-spin' : ''} weight="bold" />
            Làm mới
          </button>
          {isDirty && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 border border-orange-200 text-orange-600 rounded-xl hover:bg-orange-50 font-bold text-sm transition-colors"
            >
              Hoàn tác
            </button>
          )}
          <button
            onClick={handleSave} disabled={saving || !isDirty}
            className="flex items-center gap-1.5 px-5 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 font-bold text-sm transition-all disabled:opacity-40 shadow-sm"
          >
            <FloppyDisk size={16} weight="bold" />
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border font-medium text-sm transition-all ${
          toast.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-rose-50 border-rose-200 text-rose-700'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle size={18} weight="duotone" />
            : <Warning size={18} weight="duotone" />}
          {toast.msg}
        </div>
      )}

      {/* Unsaved indicator */}
      {isDirty && (
        <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm font-semibold">
          <Info size={16} weight="duotone" />
          Bạn có thay đổi chưa lưu
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : draft ? (
        <div className="space-y-5">

          {/* 1. Groq LLM */}
          <Section icon={Brain} title="Groq LLM" subtitle="Cấu hình model ngôn ngữ Groq Cloud">
            <SelectField
              label="Model"
              desc="Model ảnh hưởng đến chất lượng hội thoại và tốc độ phản hồi"
              value={draft.groqModel}
              options={GROQ_MODELS}
              onChange={v => patch('groqModel', v)}
            />
            <SliderField
              label="Temperature"
              desc="Thấp = câu trả lời nhất quán hơn · Cao = sáng tạo hơn"
              value={draft.groqTemperature}
              min={0} max={1} step={0.05}
              onChange={v => patch('groqTemperature', v)}
            />
            <SliderField
              label="Max Output Tokens"
              desc="Số token tối đa trong mỗi phản hồi của AI"
              value={draft.groqMaxOutputTokens}
              min={128} max={2048} step={64} unit=" tokens"
              onChange={v => patch('groqMaxOutputTokens', v)}
            />
          </Section>

          {/* 2. Session Memory */}
          <Section icon={Timer} title="Session Memory" subtitle="Cấu hình bộ nhớ phiên hội thoại (Redis)">
            <SliderField
              label="TTL Session"
              desc="Thời gian session được giữ trong Redis trước khi tự xóa"
              value={draft.sessionTtlMinutes}
              min={5} max={120} step={5} unit=" phút"
              onChange={v => patch('sessionTtlMinutes', v)}
            />
            <SliderField
              label="Max Recent Turns"
              desc="Số lượt hội thoại gần nhất được giữ lại (1 lượt = 1 user + 1 AI)"
              value={draft.sessionMaxRecentTurns}
              min={2} max={20} step={2} unit=" lượt"
              onChange={v => patch('sessionMaxRecentTurns', v)}
            />
            <SliderField
              label="Summary Trigger"
              desc="Tóm tắt lịch sử sau mỗi N lượt để tiết kiệm token"
              value={draft.sessionSummaryTrigger}
              min={2} max={20} step={2} unit=" lượt"
              onChange={v => patch('sessionSummaryTrigger', v)}
            />
          </Section>

          {/* 3. Vector Search */}
          <Section icon={MagnifyingGlass} title="Vector Search" subtitle="Cấu hình tìm kiếm skill bằng embedding">
            <ToggleField
              label="Bật Vector Search"
              desc="Mở rộng tìm kiếm skill bằng cosine similarity (cần pgvector + Gemini key)"
              value={draft.vectorSearchEnabled}
              onChange={v => patch('vectorSearchEnabled', v)}
            />
            <SliderField
              label="Cosine Similarity Threshold"
              desc="Ngưỡng tối thiểu để chấp nhận skill tương tự · Cao = chặt hơn"
              value={draft.vectorSearchThreshold}
              min={0.5} max={1.0} step={0.01}
              onChange={v => patch('vectorSearchThreshold', v)}
            />
            <SliderField
              label="Min Primary Results"
              desc="Nếu alias search đã có đủ N kết quả thì bỏ qua vector expansion"
              value={draft.vectorMinPrimaryResults}
              min={1} max={10} step={1} unit=" kết quả"
              onChange={v => patch('vectorMinPrimaryResults', v)}
            />
          </Section>

          {/* 4. Feature Flags */}
          <Section icon={Sliders} title="Feature Flags" subtitle="Bật / tắt tính năng không cần code">
            <ToggleField
              label="Enrich Mentor Reasons"
              desc='Gọi thêm 1 lượt LLM để tạo lý do "tại sao mentor này phù hợp" · Tắt để tiết kiệm quota'
              value={draft.enrichReasonsEnabled}
              onChange={v => patch('enrichReasonsEnabled', v)}
            />
          </Section>

        </div>
      ) : null}
    </div>
  );
};

export default AdminAiConfig;
