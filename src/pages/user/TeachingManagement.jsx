import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/index';
import {
    ChalkboardTeacher, CalendarBlank, BellRinging, CurrencyDollar, ChartBar,
    Plus, Star, Lightning, PencilSimple, CalendarCheck, Clock,
    Check, X, ArrowRight, ChartLineUp, Coins, WarningCircle, Trash,
    Spinner
} from '@phosphor-icons/react';
import httpClient from '../../configuration/axiosClient';
import { API_ENDPOINTS } from '../../configuration/apiEndpoints';
import {
    getSlotsBySkill, createSlotsBatch, deleteSlot,
    getMySessions
} from '../../services/sessionService';

const { TEACHING_SKILLS } = API_ENDPOINTS;

// â”€â”€ SlotChip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SlotChip = ({ slot, skillId, onDeleted }) => {
    const cfg = {
        OPEN: { border: 'border-emerald-300 bg-emerald-50', label: '⏳ Trống', labelCls: 'text-emerald-600' },
        BOOKED: { border: 'border-sky-300 bg-sky-50', label: 'Đã đặt', labelCls: 'text-sky-600' },
    }[slot.status] ?? { border: 'border-slate-200 bg-slate-50', label: slot.status, labelCls: 'text-slate-500' };

    const handleDelete = async () => {
        if (!window.confirm('Xóa slot này?')) return;
        try {
            await deleteSlot(skillId, slot.id);
            onDeleted(slot.id);
        } catch (e) {
            alert(e?.response?.data?.message || 'Không thể xóa slot đã được đặt.');
        }
    };

    const d = new Date(`${slot.slotDate}T${slot.slotTime}`);
    const dayLabel = d.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' });
    const timeLabel = slot.slotTime?.slice(0, 5) ?? d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const endLabel = slot.slotEndTime ? slot.slotEndTime.slice(0, 5) : null;

    return (
        <div className={`relative rounded-xl border-2 ${cfg.border} px-3 pt-2.5 pb-3 min-w-[110px] shrink-0 text-xs font-semibold group`}>
            <p className="text-slate-700 font-bold">{dayLabel}</p>
            <p className="text-slate-500 mb-1">
                {timeLabel}{endLabel ? ` — ${endLabel}` : ''}
            </p>
            <p className={`text-[11px] font-bold ${cfg.labelCls}`}>{cfg.label}</p>
            {slot.status === 'OPEN' && (
                <button
                    onClick={handleDelete}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    title="Xóa slot"
                >
                    <X size={10} weight="bold" />
                </button>
            )}
        </div>
    );
};

// â”€â”€ Skill Description Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SkillCard = ({ skill }) => (
    <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white border border-violet-200 flex items-center justify-center text-2xl shrink-0 shadow-sm">
            {skill.skillIcon || 'ðŸ“˜'}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-extrabold text-violet-800 text-base">{skill.skillName}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-violet-200 text-violet-600">{skill.level}</span>
                <span className="flex items-center gap-1 text-[11px] font-extrabold text-amber-600">
                    <Lightning size={11} weight="fill" className="text-amber-400" /> {skill.creditsPerHour} credits/h
                </span>
            </div>
            {skill.experienceDesc && (
                <p className="text-xs text-violet-600 leading-relaxed line-clamp-2">{skill.experienceDesc}</p>
            )}
            {skill.outcomeDesc && (
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{skill.outcomeDesc}</p>
            )}
        </div>
    </div>
);

// â”€â”€ TabSchedule â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const EMPTY_ROW = () => ({ date: '', startTime: '', endTime: '' });

const TabSchedule = ({ skills }) => {
    const [selectedSkill, setSelectedSkill] = useState(skills[0] ?? null);
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Rows to add
    const [rows, setRows] = useState([EMPTY_ROW()]);
    const [creating, setCreating] = useState(false);
    const [createMsg, setCreateMsg] = useState('');

    const today = new Date().toISOString().split('T')[0];

    const loadSlots = useCallback(async (skill) => {
        if (!skill) return;
        setLoadingSlots(true);
        try {
            const data = await getSlotsBySkill(skill.id);
            setSlots(Array.isArray(data) ? data : []);
        } catch (e) {
            setSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    }, []);

    useEffect(() => {
        if (selectedSkill) loadSlots(selectedSkill);
    }, [selectedSkill, loadSlots]);

    const updateRow = (i, field, value) =>
        setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r));

    const addRow = () => setRows(prev => [...prev, EMPTY_ROW()]);
    const removeRow = (i) => setRows(prev => prev.filter((_, idx) => idx !== i));

    const validRows = rows.filter(r => r.date && r.startTime);

    const handleCreate = async () => {
        if (!selectedSkill || validRows.length === 0) return;
        setCreating(true);
        setCreateMsg('');
        try {
            const dates = validRows.map(r => r.date);
            const times = validRows.map(r => r.startTime);
            const endTimes = validRows.map(r => r.endTime || '');
            const newSlots = await createSlotsBatch(selectedSkill.id, dates, times, endTimes.filter(Boolean).length > 0 ? endTimes : []);
            setSlots(prev => [...prev, ...(Array.isArray(newSlots) ? newSlots : [])]);
            setRows([EMPTY_ROW()]);
            setCreateMsg(`✅ Đã tạo ${Array.isArray(newSlots) ? newSlots.length : 0} slot thành công!`);
        } catch (e) {
            setCreateMsg('❌ ' + (e?.response?.data?.message || 'Tạo slot thất bại.'));
        } finally {
            setCreating(false);
        }
    };

    if (skills.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
                <p className="text-slate-400 font-semibold">Cần có ít nhất 1 kỹ năng được duyệt để tạo lịch.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-5">
            {/* Skill picker */}
            <div className="lg:w-52 shrink-0 space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chọn kỹ năng dạy:</p>
                {skills.map(s => (
                    <button key={s.id}
                        onClick={() => { setSelectedSkill(s); setCreateMsg(''); }}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${selectedSkill?.id === s.id ? 'border-violet-400 bg-violet-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-base">{s.skillIcon || 'ðŸ“˜'}</span>
                            <span className={`font-bold text-sm ${selectedSkill?.id === s.id ? 'text-violet-700' : 'text-slate-700'}`}>{s.skillName}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                            {slots.filter(sl => sl.teachingSkillId === s.id && sl.status === 'OPEN').length} slot trống
                        </p>
                    </button>
                ))}
            </div>

            {/* Schedule panel */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">

                {/* Skill description */}
                {selectedSkill && <SkillCard skill={selectedSkill} />}

                {/* Existing slots */}
                <div>
                    <h3 className="font-extrabold text-slate-900 flex items-center gap-2 text-base mb-3">
                        <CalendarBlank size={18} weight="duotone" className="text-violet-500" />
                        Các slot hiện tại — {selectedSkill?.skillName}
                    </h3>
                    {loadingSlots ? (
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Spinner size={16} className="animate-spin" /> Đang tải...
                        </div>
                    ) : slots.length === 0 ? (
                        <p className="text-sm text-slate-400">Chưa có slot nào. Hãy thêm bên dưới.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {slots.map(sl => (
                                <SlotChip
                                    key={sl.id}
                                    slot={sl}
                                    skillId={selectedSkill?.id}
                                    onDeleted={(id) => setSlots(prev => prev.filter(s => s.id !== id))}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Add slots form */}
                <div className="border-t border-slate-100 pt-5">
                    <p className="font-bold text-slate-700 mb-4 flex items-center gap-1.5">
                        <Plus size={16} weight="bold" className="text-violet-500" />
                        Tạo lịch rảnh
                        <span className="text-xs text-slate-400 font-normal ml-1">— chọn ngày, giờ bắt đầu và giờ kết thúc</span>
                    </p>

                    <div className="space-y-2 mb-4">
                        {/* Header labels */}
                        <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                            <span>NgÃ y dáº¡y</span>
                            <span>Báº¯t Ä‘áº§u</span>
                            <span>Káº¿t thÃºc</span>
                            <span></span>
                        </div>

                        {rows.map((row, i) => (
                            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                                <input
                                    type="date"
                                    min={today}
                                    value={row.date}
                                    onChange={e => updateRow(i, 'date', e.target.value)}
                                    className="px-3 py-2.5 rounded-xl border-2 border-slate-100 bg-slate-50 text-sm font-semibold text-slate-700 focus:border-violet-400 focus:bg-white outline-none transition-all w-full"
                                />
                                <input
                                    type="time"
                                    value={row.startTime}
                                    onChange={e => updateRow(i, 'startTime', e.target.value)}
                                    className="px-3 py-2.5 rounded-xl border-2 border-slate-100 bg-slate-50 text-sm font-semibold text-slate-700 focus:border-violet-400 focus:bg-white outline-none transition-all w-full"
                                />
                                <input
                                    type="time"
                                    value={row.endTime}
                                    onChange={e => updateRow(i, 'endTime', e.target.value)}
                                    className="px-3 py-2.5 rounded-xl border-2 border-slate-100 bg-slate-50 text-sm font-semibold text-slate-700 focus:border-violet-400 focus:bg-white outline-none transition-all w-full"
                                />
                                {rows.length > 1 ? (
                                    <button onClick={() => removeRow(i)}
                                        className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-all shrink-0">
                                        <X size={13} weight="bold" />
                                    </button>
                                ) : <div className="w-8" />}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <button onClick={addRow}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600 text-sm font-semibold transition-all">
                            <Plus size={14} weight="bold" /> Thêm dòng
                        </button>

                        {createMsg && (
                            <p className={`text-sm font-semibold ${createMsg.startsWith('✅') ? 'text-emerald-600' : 'text-red-600'}`}>
                                {createMsg}
                            </p>
                        )}

                        <button
                            onClick={handleCreate}
                            disabled={creating || validRows.length === 0}
                            className={`ml-auto flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${!creating && validRows.length > 0
                                    ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            {creating ? <Spinner size={14} className="animate-spin" /> : <Plus size={14} weight="bold" />}
                            {creating ? 'Đang tạo...' : `Tạo ${validRows.length} slot`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
const TabSubjects = ({ skills, onSelectSkill }) => {
    if (skills.length === 0) {
        return (
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center">
                <ChalkboardTeacher size={48} weight="duotone" className="mx-auto mb-4 text-slate-300" />
                <h3 className="text-xl font-extrabold text-slate-700 mb-2">Chưa có kỹ năng dạy nào được duyệt</h3>
                <p className="text-slate-400">Đăng ký kỹ năng dạy và chờ Admin duyệt.</p>
            </div>
        );
    }
    return (
        <div className="space-y-5">
            {skills.map(skill => (
                <div key={skill.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 pb-4 flex flex-col md:flex-row md:items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-2xl shrink-0">
                            {skill.skillIcon || 'ðŸ“˜'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h3 className="font-extrabold text-slate-900 text-lg">{skill.skillName}</h3>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{skill.level}</span>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${skill.verificationStatus === 'APPROVED'
                                        ? 'bg-emerald-100 text-emerald-600'
                                        : 'bg-amber-100 text-amber-600'
                                    }`}>
                                    {skill.verificationStatus === 'APPROVED' ? '✅ Đã duyệt' : '⏳ Chờ duyệt'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 mb-2">{skill.experienceDesc}</p>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                            <button
                                onClick={() => onSelectSkill(skill)}
                                className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600 transition-all"
                            >
                                <CalendarBlank size={14} weight="duotone" /> Quản lý lịch
                            </button>
                        </div>
                    </div>
                    <div className="px-6 pb-4 flex flex-wrap gap-4 text-sm">
                        <div>
                            <div className="flex items-center gap-1 font-extrabold text-violet-600">
                                <Lightning size={14} weight="fill" className="text-amber-400" />
                                {skill.creditsPerHour}/h
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">credits/giờ</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};





// â”€â”€ TabRequests â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TabRequests = ({ navigate }) => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMySessions('teacher', 'SCHEDULED')
            .then(data => setSessions(Array.isArray(data) ? data : []))
            .catch(() => setSessions([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex items-center gap-2 text-slate-400 py-8"><Spinner size={18} className="animate-spin" /> Đang tải...</div>;
    if (sessions.length === 0) return (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <CheckCircle size={40} className="mx-auto mb-3 text-slate-200" />
            <p className="text-slate-500 font-semibold">Không có yêu cầu đặt lịch nào đang chờ.</p>
        </div>
    );

    return (
        <div className="space-y-5">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
                <WarningCircle size={20} weight="duotone" className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                    <p className="font-bold text-amber-800 text-sm">{sessions.length} buổi học sắp diễn ra</p>
                    <p className="text-xs text-amber-600 mt-0.5">Nhấn "Vào lớp" để bắt đầu khi đến giờ.</p>
                </div>
            </div>
            {sessions.map(session => {
                const dt = new Date(`${session.slotDate}T${session.slotTime}`);
                return (
                    <div key={session.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex items-start gap-3 flex-1">
                                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-extrabold text-sm shrink-0">
                                    {session.learnerName?.charAt(0) || 'L'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                        <span className="font-extrabold text-slate-900 text-sm">{session.learnerName}</span>
                                        <span className="text-[11px] text-slate-400">muá»‘n há»c</span>
                                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-600">ðŸ“˜ {session.skillName}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-xs text-slate-500 font-medium">
                                        <span className="flex items-center gap-1"><CalendarCheck size={12} weight="duotone" className="text-violet-400" />
                                            {dt.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-1"><Clock size={12} weight="duotone" className="text-violet-400" />
                                            {dt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className="flex items-center gap-1 text-amber-600 font-bold">
                                            <Lightning size={12} weight="fill" className="text-amber-400" /> {session.creditCost} credits
                                        </span>
                                    </div>
                                    {session.learnerNotes && (
                                        <div className="mt-3 bg-slate-50 rounded-xl px-4 py-3 text-xs text-slate-500 italic border border-slate-100">
                                            "{session.learnerNotes}"
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(`/app/call/${session.id}`)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                            >
                                <ArrowRight size={13} weight="bold" /> Vào lớp
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// â”€â”€ CheckCircle (missing from imports) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CheckCircle = ({ size, className }) => (
    <CalendarBlank size={size} className={className} weight="duotone" />
);

// â”€â”€ Main â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TABS = [
    { id: 'subjects', label: 'Buổi dạy', icon: ChalkboardTeacher },
    { id: 'schedule', label: 'Lịch rảnh', icon: CalendarBlank },
    { id: 'requests', label: 'Yêu cầu', icon: BellRinging },
];

const TeachingManagement = () => {
    const [activeTab, setActiveTab] = useState('subjects');
    const [subjects, setSubjects] = useState(createInitialSubjects());
    const navigate = useNavigate();
    const [skills, setSkills] = useState([]);
    const [loadingSkills, setLoadingSkills] = useState(true);

    // Chá»‰ láº¥y ká»¹ nÄƒng Ä‘Ã£ Ä‘Æ°á»£c APPROVED
    useEffect(() => {
        const load = async () => {
            try {
                const res = await httpClient.get(TEACHING_SKILLS.GET_MY);
                const data = res?.result ?? (Array.isArray(res) ? res : []);
                setSkills(data.filter(s => s.verificationStatus === 'APPROVED'));
            } catch (_) {
                setSkills([]);
            } finally {
                setLoadingSkills(false);
            }
        };
        load();
    }, []);

    return (
        <div className="max-w-6xl mx-auto font-sans pb-4 space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <ChalkboardTeacher size={26} weight="duotone" className="text-violet-500" />
                        Quản lý buổi dạy
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Xem danh sách đã duyệt · tạo lịch rảnh · quản lý yêu cầu · vào lớp</p>
                </div>
                <button
                    onClick={() => navigate('/app/teaching/create')}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-xl shadow-md shadow-violet-200 active:scale-95 transition-all"
                >
                    <Plus size={16} weight="bold" /> Đăng ký kỹ năng mới
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-1.5 overflow-x-auto">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all relative ${active ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                        >
                            <Icon size={16} weight={active ? 'fill' : 'duotone'} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div>
                {loadingSkills ? (
                    <div className="flex items-center gap-2 text-slate-400 py-12 justify-center">
                        <Spinner size={22} className="animate-spin" /> Đang tải danh sách kỹ năng...
                    </div>
                ) : (
                    <>
                        {activeTab === 'subjects' && <TabSubjects skills={skills} onSelectSkill={() => setActiveTab('schedule')} />}
                        {activeTab === 'schedule' && <TabSchedule skills={skills} />}
                        {activeTab === 'requests' && <TabRequests navigate={navigate} />}
                    </>
                )}
            </div>
        </div>
    );
};

export default TeachingManagement;
