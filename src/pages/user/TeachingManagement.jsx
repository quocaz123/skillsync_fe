import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChalkboardTeacher, CalendarBlank, BellRinging, CurrencyDollar, ChartBar,
    Plus, Star, Lightning, PencilSimple, CalendarCheck, Clock,
    Check, X, ArrowRight, ChartLineUp, Coins, WarningCircle, Trash,
    Spinner, CheckCircle
} from '@phosphor-icons/react';
import httpClient from '../../configuration/axiosClient';
import { API_ENDPOINTS } from '../../configuration/apiEndpoints';
import {
    getSlotsBySkill, createSlotsBatch, deleteSlot,
    getMySessions, approveSession, rejectSession
} from '../../services/sessionService';
import { toggleTeachingSkillVisibility } from '../../services/skillService.js';
import { toastError, toastSuccess } from "../../utils/toastUtils";
import ConfirmModal from '../../components/common/ConfirmModal';
import Avatar from '../../components/common/Avatar';
import SessionStatusBadge from '../../components/common/SessionStatusBadge';

const { TEACHING_SKILLS } = API_ENDPOINTS;

// â”€â”€ SlotChip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SlotChip = ({ slot, onDeleted }) => {
    const cfg = {
        OPEN: { border: 'border-emerald-300 bg-emerald-50', label: '⏳ Trống', labelCls: 'text-emerald-600' },
        BOOKED: { border: 'border-sky-300 bg-sky-50', label: 'Đã đặt', labelCls: 'text-sky-600' },
    }[slot.status] ?? { border: 'border-slate-200 bg-slate-50', label: slot.status, labelCls: 'text-slate-500' };

    const handleDelete = () => {
        onDeleted(slot.id);
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
            <p className={`text-[11px] font-bold ${cfg.labelCls} mb-1`}>{cfg.label}</p>
            <p className="text-[11px] font-extrabold text-amber-600 flex items-center gap-1">
                <Lightning size={10} weight="fill" className="text-amber-400" /> {slot.creditCost || 5} cr
            </p>
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

const TabSchedule = ({ skills, onToggleVisibility }) => {
    const [selectedSkill, setSelectedSkill] = useState(skills[0] ?? null);
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Rows to add
    const [rows, setRows] = useState([EMPTY_ROW()]);
    const [creating, setCreating] = useState(false);
    const [createMsg, setCreateMsg] = useState('');
    
    // Modal state
    const [confirmDeleteSlotId, setConfirmDeleteSlotId] = useState(null);

    const today = new Date().toISOString().split('T')[0];

    const loadSlots = useCallback(async (skill) => {
        if (!skill) return;
        setLoadingSlots(true);
        try {
            const data = await getSlotsBySkill(skill.id);
            setSlots(Array.isArray(data) ? data : []);
        } catch {
            setSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    }, []);

    useEffect(() => {
        if (selectedSkill) {
            loadSlots(selectedSkill);
            setRows([EMPTY_ROW(selectedSkill.creditsPerHour || 5)]);
        }
    }, [selectedSkill, loadSlots]);

    useEffect(() => {
        setSelectedSkill(prev => {
            if (!prev) return prev;
            const fresh = skills.find(s => s.id === prev.id);
            return fresh ?? prev;
        });
    }, [skills]);

    const updateRow = (i, field, value) =>
        setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r));

    const addRow = () => setRows(prev => [...prev, EMPTY_ROW(selectedSkill?.creditsPerHour || 5)]);
    const removeRow = (i) => setRows(prev => prev.filter((_, idx) => idx !== i));

    const validRows = rows.filter(r => r.date && r.startTime);

    const handleCreate = async () => {
        if (!selectedSkill || validRows.length === 0) return;
        setCreating(true);
        setCreateMsg('');
        try {
            const slotsPayload = validRows.map(r => ({
                date: r.date,
                time: r.startTime,
                endTime: r.endTime || null,
                creditCost: selectedSkill.creditsPerHour || 0
            }));
            const newSlots = await createSlotsBatch(selectedSkill.id, slotsPayload);
            setSlots(prev => [...prev, ...(Array.isArray(newSlots) ? newSlots : [])]);
            setRows([EMPTY_ROW(selectedSkill?.creditsPerHour || 5)]);
            toastSuccess(`Đã tạo ${Array.isArray(newSlots) ? newSlots.length : 0} slot.`);
            setCreateMsg('');
        } catch (e) {
            toastError(e, "Tạo slot thất bại.");
            setCreateMsg('');
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
                    <div
                        key={s.id}
                        className={`rounded-2xl border-2 transition-all ${selectedSkill?.id === s.id ? 'border-violet-400 bg-violet-50' : 'border-slate-100 bg-white'} ${s.hidden ? 'opacity-75' : ''}`}
                    >
                        <button
                            type="button"
                            onClick={() => { setSelectedSkill(s); setCreateMsg(''); }}
                            className="w-full text-left p-4 rounded-t-2xl"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-base">{s.skillIcon || '📘'}</span>
                                <span className={`font-bold text-sm ${selectedSkill?.id === s.id ? 'text-violet-700' : 'text-slate-700'}`}>{s.skillName}</span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                                {slots.filter(sl => sl.teachingSkillId === s.id && sl.status === 'OPEN').length} slot trống
                            </p>
                        </button>
                        <div className="px-4 pb-3 flex items-center justify-between gap-2 border-t border-slate-100/80">
                            <span className={`text-[10px] font-bold uppercase tracking-wide ${s.hidden ? 'text-slate-400' : 'text-emerald-600'}`}>
                                {s.hidden ? 'Đang ẩn công khai' : 'Đang hiện Explore'}
                            </span>
                            <button
                                type="button"
                                onClick={() => onToggleVisibility?.(s)}
                                className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg transition-colors ${s.hidden ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                            >
                                {s.hidden ? 'Bật hiện' : 'Tạm ẩn'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Schedule panel */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">

                {/* Skill description */}
                {selectedSkill && (
                    <>
                        {selectedSkill.hidden && (
                            <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-2.5 text-xs font-semibold text-amber-900">
                                Kỹ năng đang <strong>tạm ẩn</strong>: không xuất hiện trên Khám phá / gợi ý AI; học viên mới không đặt lịch. Lịch &amp; buổi học đã có vẫn giữ nguyên.
                            </div>
                        )}
                        <SkillCard skill={selectedSkill} />
                    </>
                )}

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
                        <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto custom-scrollbar p-1 border border-slate-100 rounded-xl bg-slate-50/30">
                            {slots.map(sl => (
                                <SlotChip
                                    key={sl.id}
                                    slot={sl}
                                    skillId={selectedSkill?.id}
                                    onDeleted={(id) => setConfirmDeleteSlotId(id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <ConfirmModal 
                    isOpen={!!confirmDeleteSlotId} 
                    onCancel={() => setConfirmDeleteSlotId(null)} 
                    onConfirm={async () => {
                        try {
                            await deleteSlot(selectedSkill?.id, confirmDeleteSlotId);
                            setSlots(prev => prev.filter(s => s.id !== confirmDeleteSlotId));
                            toastSuccess("Đã xóa slot thành công.");
                        } catch (e) {
                            toastError(e, "Không thể xóa slot đã được đặt.");
                        } finally {
                            setConfirmDeleteSlotId(null);
                        }
                    }}
                    title="Xác nhận xoá Slot" 
                    message="Slot sẽ bị loại bỏ khỏi hệ thống. Hành động này không thể hoàn tác."
                    type="danger"
                    confirmText="Vâng, Xoá slot"
                />

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
                            <span>Ngày dạy</span>
                            <span>Bắt đầu</span>
                            <span>Kết thúc</span>
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
                            {skill.skillIcon || '📘'}
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





// ── TabRequests ──────────────────────────────────────────
const TabRequests = ({ navigate }) => {
    const [scheduledSessions, setScheduledSessions] = useState([]);
    const [pendingSessions, setPendingSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectConfirmId, setRejectConfirmId] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [scheduled, pending] = await Promise.all([
                getMySessions('teacher', 'SCHEDULED'),
                getMySessions('teacher', 'PENDING_APPROVAL')
            ]);
            setScheduledSessions(Array.isArray(scheduled) ? scheduled : []);
            setPendingSessions(Array.isArray(pending) ? pending : []);
        } catch {
            setScheduledSessions([]);
            setPendingSessions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleApprove = async (id) => {
        try {
            await approveSession(id);
            loadData();
            toastSuccess("Đã chấp nhận lịch học.");
        } catch (e) {
            toastError(e, "Không thể duyệt yêu cầu này.");
        }
    };

    const handleReject = (id) => {
        setRejectConfirmId(id);
    };

    const confirmReject = async () => {
        if (!rejectConfirmId) return;
        try {
            await rejectSession(rejectConfirmId);
            loadData();
            toastSuccess("Đã từ chối lịch học.");
        } catch (e) {
            toastError(e, "Không thể từ chối yêu cầu này.");
        } finally {
            setRejectConfirmId(null);
        }
    };

    if (loading) return <div className="flex items-center gap-2 text-slate-400 py-8"><Spinner size={18} className="animate-spin" /> Đang tải...</div>;
    if (scheduledSessions.length === 0 && pendingSessions.length === 0) return (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <CheckCircle size={40} className="mx-auto mb-3 text-slate-200" />
            <p className="text-slate-500 font-semibold">Không có yêu cầu đặt lịch nào đang chờ.</p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* PENDING SESSIONS */}
            {pendingSessions.length > 0 && (
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                        <BellRinging size={18} weight="duotone" className="text-violet-500" /> Cần duyệt ({pendingSessions.length})
                    </h3>
                    {pendingSessions.map(session => {
                        const dt = new Date(`${session.slotDate}T${session.slotTime}`);
                        return (
                            <div key={session.id} className="bg-white rounded-2xl border-2 border-violet-100 shadow-sm p-5 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 bg-violet-400 bottom-0" />
                                <div className="flex flex-col md:flex-row md:items-start gap-4">
                                    <div className="flex items-start gap-3 flex-1">
                                        <Avatar
                                            src={session.learnerAvatar}
                                            fallback={session.learnerName?.charAt(0) || 'L'}
                                            size="w-10 h-10"
                                            rounded="rounded-xl"
                                            extra="bg-violet-100 text-violet-600 font-extrabold"
                                        />
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                <span className="font-extrabold text-slate-900 text-sm">{session.learnerName}</span>
                                                <span className="text-[11px] text-slate-500">muốn học</span>
                                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-xl bg-slate-100 text-slate-700">{session.skillIcon} {session.skillName}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-3 text-xs text-slate-600 font-medium bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl inline-flex mb-3">
                                                <span className="flex items-center gap-1"><CalendarCheck size={14} weight="duotone" className="text-violet-500" />
                                                    {dt.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' })}
                                                </span>
                                                <span className="flex items-center gap-1"><Clock size={14} weight="duotone" className="text-violet-500" />
                                                    {dt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            {session.learnerNotes && (
                                                <div className="bg-indigo-50/50 rounded-xl px-4 py-3 text-xs text-slate-600 border border-indigo-100 relative">
                                                    <span className="absolute -top-2 left-3 bg-white text-[10px] font-bold text-indigo-400 px-1">Ghi chú từ sinh viên:</span>
                                                    <p className="italic">"{session.learnerNotes}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 shrink-0 md:flex-col lg:flex-row">
                                        <button
                                            onClick={() => handleReject(session.id)}
                                            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold text-xs rounded-xl transition-all"
                                        >
                                            Từ chối
                                        </button>
                                        <button
                                            onClick={() => handleApprove(session.id)}
                                            className="flex items-center justify-center gap-1.5 px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                                        >
                                            <Check size={14} weight="bold" /> Duyệt
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* SCHEDULED SESSIONS */}
            {scheduledSessions.length > 0 && (
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 mt-2">
                        <CalendarCheck size={18} weight="duotone" className="text-slate-500" /> Đã xếp lịch ({scheduledSessions.length})
                    </h3>
                    {scheduledSessions.map(session => {
                        const dt = new Date(`${session.slotDate}T${session.slotTime}`);
                        return (
                            <div key={session.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex items-center gap-3 flex-1">
                                        <Avatar
                                            src={session.learnerAvatar}
                                            fallback={session.learnerName?.charAt(0) || 'L'}
                                            size="w-10 h-10"
                                            rounded="rounded-full"
                                            extra="bg-slate-100 text-slate-600 border border-slate-200"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-slate-800 text-sm">{session.learnerName}</span>
                                                <SessionStatusBadge status="SCHEDULED" extra="text-[10px] px-2 py-0.5 rounded-full" />
                                            </div>
                                            <p className="text-xs text-slate-500 mb-1">Dạy: {session.skillIcon} {session.skillName}</p>
                                            <div className="flex gap-3 text-xs text-slate-500 font-semibold">
                                                <span>Ngày: {dt.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</span>
                                                <span>Giờ: {dt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/app/call/${session.id}`)}
                                        className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-all w-full md:w-auto"
                                    >
                                        <ArrowRight size={14} weight="bold" /> Vào lớp
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            
            <ConfirmModal 
                isOpen={!!rejectConfirmId} 
                onCancel={() => setRejectConfirmId(null)} 
                onConfirm={confirmReject} 
                title="Từ chối yêu cầu học" 
                message="Bạn sắp từ chối lịch học này. Học viên sẽ nhận được thông báo và tiền sẽ không được chuyển vào Escrow."
                type="warning"
                confirmText="Từ chối yêu cầu"
            />
        </div>
    );
};

// ── Main ──────────────────────────────────────────────────
const TABS = [
    { id: 'schedule', label: 'Lịch rảnh', icon: CalendarBlank },
    { id: 'requests', label: 'Yêu cầu', icon: BellRinging },
];

const TeachingManagement = () => {
    const [activeTab, setActiveTab] = useState('schedule');
    const navigate = useNavigate();
    const [skills, setSkills] = useState([]);
    const [loadingSkills, setLoadingSkills] = useState(true);

    const loadApprovedSkills = useCallback(async () => {
        setLoadingSkills(true);
        try {
            const res = await httpClient.get(TEACHING_SKILLS.GET_MY);
            const data = Array.isArray(res) ? res : [];
            setSkills(data.filter(s => s.verificationStatus === 'APPROVED'));
        } catch {
            setSkills([]);
        } finally {
            setLoadingSkills(false);
        }
    }, []);

    useEffect(() => {
        loadApprovedSkills();
    }, [loadApprovedSkills]);

    const handleToggleVisibility = async (skill) => {
        try {
            const updated = await toggleTeachingSkillVisibility(skill.id);
            setSkills(prev => prev.map(s => (s.id === skill.id ? { ...s, hidden: updated.hidden } : s)));
            toastSuccess(updated.hidden ? 'Đã tạm ẩn — Explore & AI không gợi ý kỹ năng này nữa.' : 'Đã hiển thị lại trên Explore & AI.');
        } catch (e) {
            toastError(e, 'Không thể đổi trạng thái hiển thị.');
        }
    };

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
                    onClick={() => navigate('/app/profile')}
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
                        {activeTab === 'schedule' && <TabSchedule skills={skills} onToggleVisibility={handleToggleVisibility} />}
                        {activeTab === 'requests' && <TabRequests navigate={navigate} />}
                    </>
                )}
            </div>
        </div>
    );
};

export default TeachingManagement;
