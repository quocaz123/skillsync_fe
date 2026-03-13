import { useState } from 'react';
import {
    Check, X, UploadSimple, Medal, VideoCamera, LinkedinLogo,
    AirplaneTilt, GraduationCap, WarningCircle, CaretDown, CheckCircle
} from '@phosphor-icons/react';
import { useStore } from '../../store';

const SKILLS_LIST = [
    { id: 'react', name: 'React', group: 'Công nghệ', icon: '⚛️', color: 'bg-blue-50 text-blue-700', border: 'border-blue-200' },
    { id: 'uiux', name: 'UI/UX Design', group: 'Thiết kế', icon: '🎨', color: 'bg-fuchsia-50 text-fuchsia-700', border: 'border-fuchsia-200' },
    { id: 'python', name: 'Python', group: 'Công nghệ', icon: '🐍', color: 'bg-amber-50 text-amber-700', border: 'border-amber-200' },
    { id: 'speaking', name: 'Public Speaking', group: 'Kỹ năng mềm', icon: '🎤', color: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-200' },
    { id: 'figma', name: 'Figma', group: 'Thiết kế', icon: '🖼️', color: 'bg-pink-50 text-pink-700', border: 'border-pink-200' },
    { id: 'ml', name: 'Machine Learning', group: 'Công nghệ', icon: '🤖', color: 'bg-teal-50 text-teal-700', border: 'border-teal-200' },
    { id: 'excel', name: 'Excel & Data', group: 'Kinh doanh', icon: '📊', color: 'bg-indigo-50 text-indigo-700', border: 'border-indigo-200' },
    { id: 'guitar', name: 'Guitar', group: 'Sáng tạo', icon: '🎸', color: 'bg-orange-50 text-orange-700', border: 'border-orange-200' },
    { id: 'photo', name: 'Nhiếp ảnh', group: 'Sáng tạo', icon: '📷', color: 'bg-slate-100 text-slate-700', border: 'border-slate-300' },
    { id: 'english', name: 'Tiếng Anh', group: 'Ngôn ngữ', icon: '🌍', color: 'bg-blue-100/50 text-blue-800', border: 'border-blue-300' },
    { id: 'marketing', name: 'Marketing', group: 'Kinh doanh', icon: '📣', color: 'bg-rose-50 text-rose-700', border: 'border-rose-200' },
    { id: 'node', name: 'Node.js', group: 'Công nghệ', icon: '🟩', color: 'bg-green-50 text-green-700', border: 'border-green-200' },
];

const LEVELS = [
    { id: 'beginner', label: 'Beginner', years: '1–2 năm', icon: '🌱', color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
    { id: 'intermediate', label: 'Intermediate', years: '2–4 năm', icon: '🚀', color: 'text-orange-500 bg-orange-50 border-orange-200' },
    { id: 'advanced', label: 'Advanced', years: '4+ năm', icon: '💎', color: 'text-violet-500 bg-violet-50 border-violet-200' },
];

const EVIDENCES = [
    { id: 'cert', label: 'Chứng chỉ chuyên môn', type: 'mandatory', pts: 40, icon: Medal, tips: 'IELTS, TOEIC, JLPT, AWS, Google... Điểm số cụ thể = không thể giả' },
    { id: 'video', label: 'Video tự giới thiệu bằng kỹ năng đó', type: 'mandatory', pts: 30, icon: VideoCamera, tips: '2 phút nói tự nhiên — học viên nghe ngay trình độ thực sự' },
    { id: 'linkedin', label: 'LinkedIn', type: 'optional', pts: 10, icon: LinkedinLogo, tips: 'Liên kết profile có endorsements' },
    { id: 'work', label: 'Bằng chứng làm việc/dự án', type: 'optional', pts: 15, icon: AirplaneTilt, tips: 'GitHub, Portfolio, Bằng chứng sinh sống nước ngoài...' },
    { id: 'teaching', label: 'Chứng chỉ giảng dạy', type: 'optional', pts: 5, icon: GraduationCap, tips: 'TESOL, CELTA, Sư phạm...' }
];

export const AddSkillModal = ({ onClose, onSave }) => {
    const { user } = useStore();
    const [step, setStep] = useState(1);

    // Step 1 State
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);

    // Step 2 State
    const [uploads, setUploads] = useState({});

    const toggleUpload = (id) => {
        setUploads(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
        else {
            onSave({
                skill: selectedSkill,
                level: selectedLevel,
                score,
                mandatoryCount,
                badges: EVIDENCES.filter(e => uploads[e.id])
            });
            onClose();
        }
    };

    const mandatoryCount = EVIDENCES.filter(e => e.type === 'mandatory' && uploads[e.id]).length;
    const score = EVIDENCES.reduce((acc, curr) => uploads[curr.id] ? acc + curr.pts : acc, 0);
    const progressColor = score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-400' : 'bg-red-400';

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center px-4 py-8 bg-slate-900/40 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bg-white w-full max-w-4xl max-h-full rounded-3xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden">

                {/* Header */}
                <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md z-10">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                            🎓 {step === 1 ? 'Thêm kỹ năng dạy' : step === 2 ? `Chứng minh năng lực — ${selectedSkill?.name}` : 'Xác nhận & lưu'}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            {step === 1 ? 'Chọn kỹ năng và cấp độ của bạn' : step === 2 ? 'Upload bằng chứng phù hợp với nhóm kỹ năng' : 'Kiểm tra lại trước khi thêm vào hồ sơ'}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Stepper */}
                        <div className="hidden sm:flex items-center gap-2">
                            {[1, 2, 3].map((s, i) => (
                                <div key={s} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        {step > s ? <Check size={14} weight="bold" /> : s}
                                    </div>
                                    {i < 2 && <div className={`w-8 h-0.5 mx-2 ${step > s ? 'bg-indigo-600' : 'bg-slate-100'}`} />}
                                </div>
                            ))}
                        </div>
                        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors">
                            <X size={16} weight="bold" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                    {/* STEP 1 */}
                    {step === 1 && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-base font-extrabold text-slate-900 mb-4">Bạn dạy kỹ năng gì?</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {SKILLS_LIST.map(skill => {
                                        const isSelected = selectedSkill?.id === skill.id;
                                        return (
                                            <button
                                                key={skill.id}
                                                onClick={() => setSelectedSkill(skill)}
                                                className={`text-left p-4 rounded-[1.25rem] border-2 transition-all relative ${isSelected ? 'border-indigo-500 bg-indigo-50/30' : 'border-transparent bg-slate-50 hover:bg-slate-100/80 shadow-sm hover:shadow'}`}
                                            >
                                                {isSelected && <div className="absolute top-3 right-3 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center"><Check size={12} weight="bold" className="text-white" /></div>}
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-2.5 shadow-sm ${skill.color} border ${skill.border}`}>
                                                    {skill.icon}
                                                </div>
                                                <p className={`font-bold text-sm mb-0.5 ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>{skill.name}</p>
                                                <p className="text-[11px] text-slate-400 mb-2.5">{skill.group}</p>
                                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-md bg-cyan-50/80 text-cyan-700 border border-cyan-100/50">
                                                    💻 2 bằng chứng bắt buộc
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {selectedSkill && (
                                <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="text-3xl">{selectedSkill.icon}</div>
                                            <div>
                                                <p className="font-extrabold text-slate-900 flex items-center gap-1 text-sm">
                                                    Nhóm <span className="text-emerald-600">{selectedSkill.group}</span> — hệ thống sẽ hỏi bạn cung cấp:
                                                </p>
                                                <p className="text-xs text-slate-500">Kỹ năng chuyên môn — xác minh bằng trình độ hoặc kinh nghiệm thực tế</p>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-base font-extrabold text-slate-900 mb-4">Cấp độ thực tế của bạn:</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {LEVELS.map(lvl => {
                                            const isSelected = selectedLevel?.id === lvl.id;
                                            return (
                                                <button
                                                    key={lvl.id}
                                                    onClick={() => setSelectedLevel(lvl)}
                                                    className={`p-5 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${isSelected ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100 bg-white hover:border-slate-200'} shadow-sm text-center`}
                                                >
                                                    <div className="text-3xl mb-2">{lvl.icon}</div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold mb-2 ${lvl.color}`}>{lvl.label}</span>
                                                    <span className="text-sm text-slate-500 font-medium">{lvl.years}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <div className="space-y-6">
                            {/* Score Card */}
                            <div className={`rounded-2xl border p-6 flex flex-col md:flex-row md:items-center gap-6 ${mandatoryCount < 2 ? 'bg-red-50/30 border-red-100' : 'bg-emerald-50/30 border-emerald-100'}`}>
                                <div className="flex items-center gap-5 md:w-1/2">
                                    <div className={`relative w-16 h-16 rounded-full border-4 flex items-center justify-center font-extrabold text-xl shrink-0 ${mandatoryCount < 2 ? 'border-red-100 text-red-500' : 'border-emerald-100 text-emerald-500'}`}>
                                        {score}
                                        {/* Simple SVG circle progress */}
                                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray={`${score * 2.89} 289`} className={`${mandatoryCount < 2 ? 'text-red-400' : 'text-emerald-400'}`} strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-extrabold text-lg flex items-center gap-2 ${mandatoryCount < 2 ? 'text-red-600' : 'text-emerald-600'}`}>
                                            {mandatoryCount < 2 ? <span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> : <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />}
                                            {mandatoryCount < 2 ? 'Chưa đủ' : 'Đạt yêu cầu cơ bản'}
                                        </h3>
                                        <p className="text-sm text-slate-500 mb-2">Điểm chứng minh năng lực ({score}/100 điểm)</p>
                                        <div className="h-2.5 bg-slate-200/60 rounded-full overflow-hidden">
                                            <div className={`h-full ${progressColor} transition-all duration-500`} style={{ width: `${score}%` }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:w-1/2 md:border-l md:border-slate-200 md:pl-6 space-y-3">
                                    {mandatoryCount < 2 ? (
                                        <div className="bg-amber-50 rounded-xl p-3 border border-amber-200/50 flex items-start gap-2 text-sm text-amber-800 font-medium">
                                            <WarningCircle size={18} className="shrink-0 mt-0.5" weight="fill" />
                                            <p>{mandatoryCount}/2 bằng chứng bắt buộc — cần thêm {2 - mandatoryCount} nữa</p>
                                        </div>
                                    ) : (
                                        <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200/50 flex items-start gap-2 text-sm text-emerald-700 font-medium">
                                            <CheckCircle size={18} className="shrink-0 mt-0.5" weight="fill" />
                                            <p>2/2 bằng chứng bắt buộc — Đã đủ để giảng dạy.</p>
                                        </div>
                                    )}
                                    <p className="text-xs text-slate-500 flex items-center gap-1.5"><span className="text-amber-500">💡</span> Điền đủ bắt buộc → booking tăng 3×. Thêm không bắt buộc → tăng thêm 2× nữa.</p>
                                </div>
                            </div>

                            <p className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100 flex items-center gap-2">
                                🌍 Điểm thi cụ thể ≥ câu 'tôi giỏi {selectedSkill?.name}'
                            </p>

                            {/* Forms */}
                            <div className="space-y-6">
                                {/* Mandatory */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-extrabold text-slate-900 flex items-center gap-2">Bắt buộc <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">phải có để hiển thị uy tín</span></h4>
                                        <span className="text-sm font-bold text-amber-500">{mandatoryCount}/2 hoàn thành</span>
                                    </div>
                                    <div className="space-y-3">
                                        {EVIDENCES.filter(e => e.type === 'mandatory').map(ev => (
                                            <div key={ev.id} className={`border rounded-xl p-4 transition-all flex items-center justify-between cursor-pointer ${uploads[ev.id] ? 'border-indigo-400 bg-indigo-50/20' : 'border-slate-200 bg-white hover:border-slate-300'}`} onClick={() => toggleUpload(ev.id)}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${uploads[ev.id] ? 'bg-indigo-500 text-white' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                                                        <ev.icon size={24} weight={uploads[ev.id] ? 'fill' : 'duotone'} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="font-bold text-slate-900 text-sm">{ev.label}</p>
                                                            <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">BẮT BUỘC</span>
                                                            <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded font-bold">+{ev.pts}pt</span>
                                                        </div>
                                                        <p className="text-[11px] text-slate-500">{ev.tips}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {uploads[ev.id] && <span className="text-xs font-bold text-indigo-600 flex items-center gap-1"><CheckCircle weight="fill" size={14} /> Đã tải lên</span>}
                                                    <CaretDown size={16} className={`text-slate-400 transition-transform ${uploads[ev.id] ? 'rotate-180' : ''}`} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Optional */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <h4 className="font-extrabold text-slate-900 leading-none">Không bắt buộc</h4>
                                        <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">thêm để tăng trust score</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {EVIDENCES.filter(e => e.type === 'optional').map(ev => (
                                            <div key={ev.id} className={`border rounded-xl p-4 transition-all flex items-center justify-between cursor-pointer ${uploads[ev.id] ? 'border-indigo-400 bg-indigo-50/20' : 'border-slate-200 bg-white hover:border-slate-300'}`} onClick={() => toggleUpload(ev.id)}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${uploads[ev.id] ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-50 text-slate-500'}`}>
                                                        <ev.icon size={20} weight={uploads[ev.id] ? 'fill' : 'duotone'} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] relative">
                                                            {ev.label}
                                                            <span className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                                                        </p>
                                                        <p className="text-xs text-slate-400 font-semibold">+{ev.pts}pt</p>
                                                    </div>
                                                </div>
                                                {uploads[ev.id] ? <CheckCircle size={18} weight="fill" className="text-indigo-600" /> : <CaretDown size={16} className="text-slate-400" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6">
                                <h4 className="text-[11px] font-extrabold text-indigo-600 mb-4 tracking-wider uppercase flex items-center gap-2">
                                    👁️ Hồ sơ của bạn — học viên sẽ thấy
                                </h4>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-indigo-500 rounded-2xl text-white flex items-center justify-center text-xl font-extrabold shadow-sm shrink-0">
                                        {user?.name?.substring(0, 2).toUpperCase() || 'UN'}
                                    </div>
                                    <div className="flex items-center flex-wrap gap-2 text-lg">
                                        <b className="font-extrabold">{user?.name || 'Nguyễn Văn'}</b>
                                        <span className="text-slate-400 text-sm">dạy</span>
                                        <span className="flex items-center gap-1.5 font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-sm text-sm">
                                            {selectedSkill?.icon} {selectedSkill?.name}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-lg border text-xs font-bold ${selectedLevel?.color}`}>
                                            {selectedLevel?.label}
                                        </span>
                                    </div>
                                </div>

                                <div className={`relative border rounded-2xl p-4 overflow-hidden ${mandatoryCount < 2 ? 'bg-red-50/50 border-red-200' : 'bg-emerald-50/50 border-emerald-200'}`}>
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-extrabold text-sm border shadow-sm">
                                            {score}
                                        </div>
                                        <div>
                                            <p className={`font-extrabold flex items-center gap-2 ${mandatoryCount < 2 ? 'text-red-600' : 'text-emerald-700'}`}>
                                                {mandatoryCount < 2 ? <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> : <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                                                {mandatoryCount < 2 ? 'Chưa đủ' : 'Đạt Uy Tín'}
                                            </p>
                                            <p className="text-xs text-slate-500">{mandatoryCount}/2 bắt buộc</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {mandatoryCount < 2 ? (
                                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                                    <h5 className="font-extrabold text-amber-800 flex items-center gap-2 mb-1">
                                        <WarningCircle weight="fill" size={18} /> Còn {2 - mandatoryCount} bằng chứng bắt buộc chưa điền
                                    </h5>
                                    <p className="text-sm text-amber-700/80">Có thể lưu, nhưng học viên sẽ thấy Trust Score thấp và ít book hơn.</p>
                                </div>
                            ) : null}

                            <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-5">
                                <p className="text-sm text-cyan-800 leading-relaxed">
                                    <span className="font-extrabold text-cyan-900">Sau khi lưu:</span> Kỹ năng xuất hiện trong hồ sơ. Bạn có thể đăng buổi dạy cụ thể từ trang <b className="text-cyan-900">Dạy học</b>. Bằng chứng luôn có thể chỉnh sửa sau.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-3xl shrink-0">
                    <button
                        onClick={step === 1 ? onClose : () => setStep(step - 1)}
                        className="px-6 py-2.5 rounded-xl font-bold text-slate-600 border border-slate-200 hover:bg-white hover:border-slate-300 transition-all text-sm"
                    >
                        ← Quay lại
                    </button>

                    <div className="flex items-center gap-4">
                        {step === 2 && mandatoryCount < 2 && (
                            <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5 hidden sm:flex">
                                <WarningCircle weight="fill" size={14} /> {2 - mandatoryCount} bằng chứng bắt buộc còn thiếu
                            </span>
                        )}
                        <button
                            disabled={step === 1 && (!selectedSkill || !selectedLevel)}
                            onClick={handleNext}
                            className={`px-8 py-2.5 rounded-xl font-bold transition-all text-sm shadow-sm flex items-center gap-2
                                ${step === 1 && (!selectedSkill || !selectedLevel) ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : step === 3 ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'}
                            `}
                        >
                            {step === 3 ? (
                                <><Check size={16} weight="bold" /> Lưu kỹ năng dạy</>
                            ) : (
                                <>Tiếp tục →</>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
