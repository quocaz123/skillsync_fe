import { useState, useEffect, useRef } from 'react';
import {
    Check, X, UploadSimple, Medal, VideoCamera, LinkedinLogo,
    AirplaneTilt, GraduationCap, WarningCircle, CaretDown, CheckCircle, Spinner
} from '@phosphor-icons/react';
import { useStore } from '../../store';
import { getAllSkills, createTeachingSkill, createEvidence } from '../../services/skillService.js';
import { uploadFile } from '../../services/uploadService.js';

const LEVELS = [
    { id: 'BEGINNER', label: 'Beginner', years: '1–2 năm', icon: '🌱', color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
    { id: 'INTERMEDIATE', label: 'Intermediate', years: '2–4 năm', icon: '🚀', color: 'text-orange-500 bg-orange-50 border-orange-200' },
    { id: 'ADVANCED', label: 'Advanced', years: '4+ năm', icon: '💎', color: 'text-violet-500 bg-violet-50 border-violet-200' },
];

const EVIDENCE_DEFS = [
    { id: 'cert', label: 'Chứng chỉ chuyên môn', type: 'mandatory', pts: 40, uploadType: 'TEACHING_EVIDENCE', acceptUrl: false, icon: Medal, tips: 'IELTS, TOEIC, JLPT, AWS, Google... Điểm số cụ thể = không thể giả' },
    { id: 'video', label: 'Video tự giới thiệu bằng kỹ năng đó', type: 'mandatory', pts: 30, uploadType: 'TEACHING_EVIDENCE', acceptUrl: true, icon: VideoCamera, tips: '2 phút nói tự nhiên — học viên nghe ngay trình độ thực sự' },
    { id: 'linkedin', label: 'LinkedIn', type: 'optional', pts: 10, uploadType: null, acceptUrl: true, icon: LinkedinLogo, tips: 'Liên kết profile có endorsements' },
    { id: 'work', label: 'Bằng chứng làm việc/dự án', type: 'optional', pts: 15, uploadType: 'TEACHING_EVIDENCE', acceptUrl: true, icon: AirplaneTilt, tips: 'GitHub, Portfolio, Bằng chứng sinh sống nước ngoài...' },
    { id: 'teaching', label: 'Chứng chỉ giảng dạy', type: 'optional', pts: 5, uploadType: 'TEACHING_EVIDENCE', acceptUrl: false, icon: GraduationCap, tips: 'TESOL, CELTA, Sư phạm...' }
];

// Map evidence id -> EvidenceType enum on BE
const EVIDENCE_TYPE_MAP = {
    cert: 'CERTIFICATE',
    video: 'VIDEO_INTRO',
    linkedin: 'LINKEDIN',
    work: 'WORK_PROOF',
    teaching: 'TEACHING_CERTIFICATE',
};

export const AddSkillModal = ({ onClose, onSave }) => {
    const { user } = useStore();
    const [step, setStep] = useState(1);

    // Step 1
    const [skills, setSkills] = useState([]);
    const [loadingSkills, setLoadingSkills] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);

    // Step 2 — Chi tiết mô tả
    const [experienceDesc, setExperienceDesc] = useState('');
    const [outcomeDesc, setOutcomeDesc] = useState('');
    const [teachingStyle, setTeachingStyle] = useState('');

    // Step 3 - evidence uploads
    const [evidenceData, setEvidenceData] = useState({}); // { [evId]: { file?, url?, fileKey?, fileUrl?, uploading } }
    const [expandedEv, setExpandedEv] = useState(null);
    const fileRefs = useRef({});

    // Step 4 - saving
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    // Load skills on mount
    useEffect(() => {
        setLoadingSkills(true);
        getAllSkills()
            .then(data => setSkills(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoadingSkills(false));
    }, []);

    // Computed
    const mandatoryCount = EVIDENCE_DEFS.filter(e => e.type === 'mandatory' && evidenceData[e.id]?.done).length;
    const score = EVIDENCE_DEFS.reduce((acc, ev) => evidenceData[ev.id]?.done ? acc + ev.pts : acc, 0);
    const progressColor = score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-400' : 'bg-red-400';

    // Step 2 validation
    const step2Valid = experienceDesc.trim().length >= 20 && outcomeDesc.trim().length >= 10;

    const handleFileUpload = async (evDef, file) => {
        setEvidenceData(prev => ({ ...prev, [evDef.id]: { ...prev[evDef.id], uploading: true, done: false } }));
        try {
            const { fileKey, fileUrl } = await uploadFile(file, evDef.uploadType);
            setEvidenceData(prev => ({
                ...prev,
                [evDef.id]: { file, fileKey, fileUrl, done: true, uploading: false }
            }));
        } catch (err) {
            console.error('Upload evidence failed:', err);
            setEvidenceData(prev => ({ ...prev, [evDef.id]: { ...prev[evDef.id], uploading: false, done: false } }));
            alert('Upload thất bại. Vui lòng thử lại.');
        }
    };

    const handleUrlInput = (evId, url) => {
        setEvidenceData(prev => ({
            ...prev,
            [evId]: { ...prev[evId], externalUrl: url, done: !!url.trim() }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveError(null);
        try {
            // Create teaching skill
            const newSkill = await createTeachingSkill({
                skillId: selectedSkill.id,
                level: selectedLevel.id,
                experienceDesc: experienceDesc.trim(),
                outcomeDesc: outcomeDesc.trim(),
                teachingStyle: teachingStyle.trim() || null,
            });

            // Upload evidences sequentially
            const evPromises = EVIDENCE_DEFS.filter(ev => evidenceData[ev.id]?.done).map(ev => {
                const evInfo = evidenceData[ev.id];
                return createEvidence(newSkill.id, {
                    evidenceType: EVIDENCE_TYPE_MAP[ev.id],
                    title: ev.label,
                    fileKey: evInfo.fileKey || null,
                    fileUrl: evInfo.fileUrl || null,
                    externalUrl: evInfo.externalUrl || null,
                    fileName: evInfo.file?.name || null,
                    mimeType: evInfo.file?.type || null,
                    fileSize: evInfo.file?.size || null,
                });
            });
            await Promise.all(evPromises);

            onSave(newSkill);
        } catch (err) {
            console.error('Save teaching skill failed:', err);
            setSaveError(err?.response?.data?.message || 'Lưu thất bại. Vui lòng thử lại.');
        } finally {
            setSaving(false);
        }
    };

    const handleNext = () => {
        if (step < 4) setStep(step + 1);
        else handleSave();
    };

    // Group skills by category for display
    const categoryLabel = {
        TECH: 'Công nghệ', DATA: 'Dữ liệu', DESIGN: 'Thiết kế',
        BUSINESS: 'Kinh doanh', MARKETING: 'Marketing', FINANCE: 'Tài chính',
        LANGUAGE: 'Ngôn ngữ', EDUCATION: 'Giáo dục', SOFT_SKILL: 'Kỹ năng mềm',
        CAREER: 'Nghề nghiệp', CREATIVE: 'Sáng tạo', HEALTH: 'Sức khỏe', OTHER: 'Khác'
    };

    const skillColorByCat = {
        TECH: 'bg-blue-50 text-blue-700 border-blue-200',
        DATA: 'bg-teal-50 text-teal-700 border-teal-200',
        DESIGN: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
        BUSINESS: 'bg-amber-50 text-amber-700 border-amber-200',
        MARKETING: 'bg-rose-50 text-rose-700 border-rose-200',
        FINANCE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        LANGUAGE: 'bg-sky-50 text-sky-700 border-sky-200',
        SOFT_SKILL: 'bg-violet-50 text-violet-700 border-violet-200',
        CREATIVE: 'bg-orange-50 text-orange-700 border-orange-200',
        OTHER: 'bg-slate-100 text-slate-700 border-slate-300',
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center px-4 py-8 bg-slate-900/40 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bg-white w-full max-w-4xl max-h-full rounded-3xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden">

                {/* Header */}
                <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md z-10">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                            🎓 {step === 1 ? 'Thêm kỹ năng dạy' : step === 2 ? 'Chi tiết giảng dạy' : step === 3 ? `Chứng minh năng lực — ${selectedSkill?.name}` : 'Xác nhận & lưu'}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            {step === 1 ? 'Chọn kỹ năng và cấp độ của bạn' : step === 2 ? 'Mô tả kinh nghiệm và phong cách dạy của bạn' : step === 3 ? 'Upload bằng chứng phù hợp với nhóm kỹ năng' : 'Kiểm tra lại trước khi thêm vào hồ sơ'}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2">
                            {[1, 2, 3, 4].map((s, i) => (
                                <div key={s} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        {step > s ? <Check size={14} weight="bold" /> : s}
                                    </div>
                                    {i < 3 && <div className={`w-8 h-0.5 mx-2 ${step > s ? 'bg-indigo-600' : 'bg-slate-100'}`} />}
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

                    {/* STEP 1: Choose skill & level */}
                    {step === 1 && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-base font-extrabold text-slate-900 mb-4">Bạn dạy kỹ năng gì?</h3>

                                {loadingSkills ? (
                                    <div className="flex items-center justify-center py-12 gap-3 text-slate-400">
                                        <Spinner size={24} className="animate-spin" />
                                        <span>Đang tải danh sách kỹ năng...</span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {skills.map(skill => {
                                            const isSelected = selectedSkill?.id === skill.id;
                                            const colorClass = skillColorByCat[skill.category] || skillColorByCat.OTHER;
                                            return (
                                                <button
                                                    key={skill.id}
                                                    onClick={() => setSelectedSkill(skill)}
                                                    className={`text-left p-4 rounded-[1.25rem] border-2 transition-all relative ${isSelected ? 'border-indigo-500 bg-indigo-50/30' : 'border-transparent bg-slate-50 hover:bg-slate-100/80 shadow-sm hover:shadow'}`}
                                                >
                                                    {isSelected && <div className="absolute top-3 right-3 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center"><Check size={12} weight="bold" className="text-white" /></div>}
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-2.5 shadow-sm border ${colorClass}`}>
                                                        {skill.icon}
                                                    </div>
                                                    <p className={`font-bold text-sm mb-0.5 ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>{skill.name}</p>
                                                    <p className="text-[11px] text-slate-400 mb-2.5">{categoryLabel[skill.category] || skill.category}</p>
                                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-md bg-cyan-50/80 text-cyan-700 border border-cyan-100/50">
                                                        💻 2 bằng chứng bắt buộc
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {selectedSkill && (
                                <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="text-3xl">{selectedSkill.icon}</div>
                                            <div>
                                                <p className="font-extrabold text-slate-900 flex items-center gap-1 text-sm">
                                                    Nhóm <span className="text-emerald-600">{categoryLabel[selectedSkill.category]}</span> — hệ thống sẽ hỏi bạn cung cấp:
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

                    {/* STEP 2: Detail descriptions */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
                                <div className="text-2xl shrink-0">{selectedSkill?.icon}</div>
                                <div>
                                    <p className="font-extrabold text-indigo-900 text-sm">{selectedSkill?.name} · {selectedLevel?.label}</p>
                                    <p className="text-xs text-indigo-600 mt-0.5">Học viên sẽ thấy những thông tin này trước khi đặt lịch</p>
                                </div>
                            </div>

                            {/* Field 1: About me / Experience */}
                            <div>
                                <label className="block text-sm font-extrabold text-slate-900 mb-1.5">
                                    👤 Giới thiệu bản thân <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-slate-400 mb-2">Kinh nghiệm thực tế của bạn với kỹ năng này (tối thiểu 20 ký tự)</p>
                                <textarea
                                    value={experienceDesc}
                                    onChange={e => setExperienceDesc(e.target.value)}
                                    placeholder={`Ví dụ: Tôi có 3 năm kinh nghiệm làm việc với ${selectedSkill?.name} tại các công ty startup và agency. Đã triển khai hơn 10 dự án thực tế từ nhỏ đến lớn...`}
                                    rows={4}
                                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition focus:bg-white resize-none ${
                                        experienceDesc.trim().length > 0 && experienceDesc.trim().length < 20
                                            ? 'border-red-300 bg-red-50/50 focus:border-red-400'
                                            : experienceDesc.trim().length >= 20
                                            ? 'border-emerald-300 bg-emerald-50/30 focus:border-emerald-400'
                                            : 'border-slate-200 bg-slate-50 focus:border-indigo-400'
                                    }`}
                                />
                                <div className="flex justify-between mt-1">
                                    <span className={`text-xs font-medium ${
                                        experienceDesc.trim().length < 20 ? 'text-red-400' : 'text-emerald-500'
                                    }`}>
                                        {experienceDesc.trim().length >= 20 ? '✓ Đạt yêu cầu' : `Còn thiếu ${20 - experienceDesc.trim().length} ký tự`}
                                    </span>
                                    <span className="text-xs text-slate-400">{experienceDesc.length} ký tự</span>
                                </div>
                            </div>

                            {/* Field 2: Learning Outcomes */}
                            <div>
                                <label className="block text-sm font-extrabold text-slate-900 mb-1.5">
                                    🎯 Học viên sẽ đạt được gì? <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-slate-400 mb-2">Mỗi dòng = 1 mục tiêu, hiển thị dưới dạng danh sách tick ✓ (tối thiểu 10 ký tự)</p>
                                <textarea
                                    value={outcomeDesc}
                                    onChange={e => setOutcomeDesc(e.target.value)}
                                    placeholder={`Ví dụ:\nHiểu vững các khái niệm cốt lõi\nXây dựng được project thực tế\nTự tin làm việc trong môi trường chuyên nghiệp`}
                                    rows={5}
                                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition focus:bg-white resize-none font-mono ${
                                        outcomeDesc.trim().length > 0 && outcomeDesc.trim().length < 10
                                            ? 'border-red-300 bg-red-50/50 focus:border-red-400'
                                            : outcomeDesc.trim().length >= 10
                                            ? 'border-emerald-300 bg-emerald-50/30 focus:border-emerald-400'
                                            : 'border-slate-200 bg-slate-50 focus:border-indigo-400'
                                    }`}
                                />
                                {outcomeDesc.trim().length >= 10 && (
                                    <div className="mt-2 p-3 bg-violet-50 border border-violet-100 rounded-xl">
                                        <p className="text-[11px] font-bold text-violet-600 mb-1.5">Preview — Học viên sẽ thấy:</p>
                                        <div className="space-y-1">
                                            {outcomeDesc.split('\n').map(s => s.trim()).filter(Boolean).map((o, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-violet-700">
                                                    <span className="text-violet-500">✓</span> {o}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Field 3: Teaching Style — Optional */}
                            <div>
                                <label className="block text-sm font-extrabold text-slate-900 mb-1.5">
                                    🌀 Phong cách giảng dạy <span className="text-slate-400 font-normal text-xs">(tuỳ chọn)</span>
                                </label>
                                <p className="text-xs text-slate-400 mb-2">Bạn thường dạy theo cách nào? Thực hành, lý thuyết, hay hands-on project?</p>
                                <textarea
                                    value={teachingStyle}
                                    onChange={e => setTeachingStyle(e.target.value)}
                                    placeholder="Ví dụ: Tôi dạy theo hướng hands-on — học viên code ngay từ buổi đầu. Mỗi buổi có 1 mini-project nhỏ để luyện tập. Tôi tập trung vào cách tư duy hơn là thuộc lòng syntax..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-sm outline-none transition focus:border-indigo-400 focus:bg-white resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Upload evidence */}
                    {step === 3 && (
                        <div className="space-y-6">
                            {/* Score Card */}
                            <div className={`rounded-2xl border p-6 flex flex-col md:flex-row md:items-center gap-6 ${mandatoryCount < 2 ? 'bg-red-50/30 border-red-100' : 'bg-emerald-50/30 border-emerald-100'}`}>
                                <div className="flex items-center gap-5 md:w-1/2">
                                    <div className={`relative w-16 h-16 rounded-full border-4 flex items-center justify-center font-extrabold text-xl shrink-0 ${mandatoryCount < 2 ? 'border-red-100 text-red-500' : 'border-emerald-100 text-emerald-500'}`}>
                                        {score}
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

                            {/* Evidence items */}
                            <div className="space-y-6">
                                {/* Mandatory */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-extrabold text-slate-900 flex items-center gap-2">Bắt buộc <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">phải có để hiển thị uy tín</span></h4>
                                        <span className="text-sm font-bold text-amber-500">{mandatoryCount}/2 hoàn thành</span>
                                    </div>
                                    <div className="space-y-3">
                                        {EVIDENCE_DEFS.filter(e => e.type === 'mandatory').map(ev => (
                                            <EvidenceItem
                                                key={ev.id}
                                                ev={ev}
                                                state={evidenceData[ev.id]}
                                                expanded={expandedEv === ev.id}
                                                onToggle={() => setExpandedEv(prev => prev === ev.id ? null : ev.id)}
                                                onFileChange={(file) => handleFileUpload(ev, file)}
                                                onUrlChange={(url) => handleUrlInput(ev.id, url)}
                                                fileRef={el => fileRefs.current[ev.id] = el}
                                            />
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
                                        {EVIDENCE_DEFS.filter(e => e.type === 'optional').map(ev => (
                                            <EvidenceItem
                                                key={ev.id}
                                                ev={ev}
                                                state={evidenceData[ev.id]}
                                                expanded={expandedEv === ev.id}
                                                onToggle={() => setExpandedEv(prev => prev === ev.id ? null : ev.id)}
                                                onFileChange={(file) => handleFileUpload(ev, file)}
                                                onUrlChange={(url) => handleUrlInput(ev.id, url)}
                                                fileRef={el => fileRefs.current[ev.id] = el}
                                                compact
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Confirm */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6">
                                <h4 className="text-[11px] font-extrabold text-indigo-600 mb-4 tracking-wider uppercase flex items-center gap-2">👁️ Hồ sơ của bạn — học viên sẽ thấy</h4>
                                <div className="flex items-center gap-4 mb-4">
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

                                {/* Preview 3 fields */}
                                <div className="space-y-3 mb-5">
                                    <div className="bg-white rounded-xl border border-slate-100 p-4">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Giới thiệu</p>
                                        <p className="text-sm text-slate-600 line-clamp-2">{experienceDesc || <span className="text-slate-300 italic">Chưa điền</span>}</p>
                                    </div>
                                    <div className="bg-white rounded-xl border border-slate-100 p-4">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase mb-1.5">Mục tiêu học ({outcomeDesc.split('\n').filter(s => s.trim()).length} dòng)</p>
                                        <div className="space-y-0.5">
                                            {outcomeDesc.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 3).map((o, i) => (
                                                <p key={i} className="text-xs text-violet-600">✓ {o}</p>
                                            ))}
                                        </div>
                                    </div>
                                    {teachingStyle && (
                                        <div className="bg-white rounded-xl border border-slate-100 p-4">
                                            <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Phong cách dạy</p>
                                            <p className="text-sm text-slate-600 italic line-clamp-2">{teachingStyle}</p>
                                        </div>
                                    )}
                                </div>
                                <div className={`relative border rounded-2xl p-4 overflow-hidden ${mandatoryCount < 2 ? 'bg-red-50/50 border-red-200' : 'bg-emerald-50/50 border-emerald-200'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-extrabold text-sm border shadow-sm">{score}</div>
                                        <div>
                                            <p className={`font-extrabold flex items-center gap-2 ${mandatoryCount < 2 ? 'text-red-600' : 'text-emerald-700'}`}>
                                                {mandatoryCount < 2 ? <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> : <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                                                {mandatoryCount < 2 ? 'Chưa đủ' : 'Đạt Uy Tín'}
                                            </p>
                                            <p className="text-xs text-slate-500">{mandatoryCount}/2 bắt buộc · {Object.values(evidenceData).filter(e => e?.done).length} bằng chứng đã upload</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {mandatoryCount < 2 && (
                                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                                    <h5 className="font-extrabold text-amber-800 flex items-center gap-2 mb-1">
                                        <WarningCircle weight="fill" size={18} /> Còn {2 - mandatoryCount} bằng chứng bắt buộc chưa điền
                                    </h5>
                                    <p className="text-sm text-amber-700/80">Có thể lưu, nhưng học viên sẽ thấy Trust Score thấp và ít book hơn.</p>
                                </div>
                            )}

                            {saveError && (
                                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm font-medium">
                                    ❌ {saveError}
                                </div>
                            )}

                            <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-5">
                                <p className="text-sm text-cyan-800 leading-relaxed">
                                    <span className="font-extrabold text-cyan-900">Sau khi lưu:</span> Kỹ năng xuất hiện trong hồ sơ. Bạn có thể đăng buổi dạy cụ thể từ trang <b className="text-cyan-900">Dạy học</b>. Bằng chứng luôn có thể chỉnh sửa sau.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-3xl shrink-0">
                    <button
                        onClick={step === 1 ? onClose : () => setStep(step - 1)}
                        className="px-6 py-2.5 rounded-xl font-bold text-slate-600 border border-slate-200 hover:bg-white hover:border-slate-300 transition-all text-sm"
                        disabled={saving}
                    >
                        ← Quay lại
                    </button>
                    <div className="flex items-center gap-4">
                        {step === 3 && mandatoryCount < 2 && (
                            <span className="text-xs font-bold text-amber-500 hidden sm:flex items-center gap-1.5">
                                <WarningCircle weight="fill" size={14} /> {2 - mandatoryCount} bằng chứng bắt buộc còn thiếu
                            </span>
                        )}
                        <button
                            disabled={
                                (step === 1 && (!selectedSkill || !selectedLevel)) ||
                                (step === 2 && !step2Valid) ||
                                saving
                            }
                            onClick={handleNext}
                            className={`px-8 py-2.5 rounded-xl font-bold transition-all text-sm shadow-sm flex items-center gap-2
                                ${
                                    (step === 1 && (!selectedSkill || !selectedLevel)) ||
                                    (step === 2 && !step2Valid) ||
                                    saving
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : step === 4 ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                                }`}
                        >
                            {saving ? <><Spinner size={16} className="animate-spin" /> Đang lưu...</> :
                             step === 4 ? <><Check size={16} weight="bold" /> Lưu kỹ năng dạy</> : <>Tiếp tục →</>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-component for each evidence item
const EvidenceItem = ({ ev, state, expanded, onToggle, onFileChange, onUrlChange, fileRef, compact = false }) => {
    const isDone = state?.done;
    const isUploading = state?.uploading;

    return (
        <div className={`border rounded-xl transition-all ${isDone ? 'border-indigo-400 bg-indigo-50/20' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={onToggle}>
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${isDone ? 'bg-indigo-500 text-white' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                        {isUploading
                            ? <Spinner size={20} className="animate-spin" />
                            : <ev.icon size={compact ? 20 : 24} weight={isDone ? 'fill' : 'duotone'} />
                        }
                    </div>
                    {!compact ? (
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="font-bold text-slate-900 text-sm">{ev.label}</p>
                                {ev.type === 'mandatory' && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">BẮT BUỘC</span>}
                                <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded font-bold">+{ev.pts}pt</span>
                            </div>
                            <p className="text-[11px] text-slate-500">{ev.tips}</p>
                        </div>
                    ) : (
                        <div>
                            <p className="font-bold text-slate-900 text-sm">{ev.label}</p>
                            <p className="text-xs text-slate-400 font-semibold">+{ev.pts}pt</p>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {isDone && <span className="text-xs font-bold text-indigo-600 hidden sm:flex items-center gap-1"><CheckCircle weight="fill" size={14} /> Đã tải</span>}
                    <CaretDown size={16} className={`text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {expanded && (
                <div className="px-4 pb-4 border-t border-slate-100 pt-4 space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
                    {/* File upload option */}
                    {ev.uploadType && (
                        <div>
                            <p className="text-xs font-bold text-slate-600 mb-2">📎 Upload file:</p>
                            <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 cursor-pointer transition-colors bg-slate-50">
                                <UploadSimple size={20} className="text-slate-400" />
                                <span className="text-sm text-slate-500 font-medium">
                                    {state?.file ? `✅ ${state.file.name}` : 'Chọn file từ máy tính…'}
                                </span>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    className="hidden"
                                    onChange={e => e.target.files?.[0] && onFileChange(e.target.files[0])}
                                />
                            </label>
                        </div>
                    )}
                    {/* URL input option */}
                    {ev.acceptUrl && (
                        <div>
                            <p className="text-xs font-bold text-slate-600 mb-2">🔗 Hoặc nhập link:</p>
                            <input
                                type="url"
                                placeholder="https://..."
                                value={state?.externalUrl || ''}
                                onChange={e => onUrlChange(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};