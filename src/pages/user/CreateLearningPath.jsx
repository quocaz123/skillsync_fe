import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Map, ListChecks, Coins, Eye, CheckCircle2, ArrowRight, ArrowLeft,
    Plus, Trash, FileText, Image, Target, Clock, AlertCircle, BookOpen, Layout
} from 'lucide-react';
import { useStore } from '../../store';

const CreateLearningPath = () => {
    const navigate = useNavigate();
    const { user } = useStore();
    const [currentStep, setCurrentStep] = useState(1);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        category: 'Tech',
        level: 'Beginner',
        duration: '',
        description: '',
        emoji: '📚',
        modules: [
            { id: 1, title: '', desc: '', sessionsNeeded: 3, criteria: 'Đủ buổi học & Làm bài kiểm tra' }
        ],
        totalCredits: 0,
        maxStudents: 10,
        registrationType: 'auto', // 'auto' or 'manual'
    });

    const categories = ['Tech', 'Design', 'Business', 'Languages', 'Soft Skills'];
    const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    const emojis = ['📚', '⚛️', '🎨', '🐍', '🚀', '💡', '🎤', '💻', '📈'];

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addModule = () => {
        setFormData(prev => ({
            ...prev,
            modules: [...prev.modules, {
                id: Date.now(),
                title: '',
                desc: '',
                sessionsNeeded: 3,
                criteria: 'Đủ buổi học'
            }]
        }));
    };

    const updateModule = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            modules: prev.modules.map(m => m.id === id ? { ...m, [field]: value } : m)
        }));
    };

    const removeModule = (id) => {
        if (formData.modules.length <= 1) return;
        setFormData(prev => ({
            ...prev,
            modules: prev.modules.filter(m => m.id !== id)
        }));
    };

    const handleSubmit = () => {
        // Here you would typically save to backend
        alert('Tạo lộ trình thành công!');
        navigate('/app/teaching');
    };

    // STEPS UI COMPONENTS

    const Step1 = () => (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-1">Thông tin tổng quan</h3>
                <p className="text-sm text-slate-500">Giới thiệu về lộ trình để thu hút học viên.</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Biểu tượng (Emoji)</label>
                    <div className="flex gap-2 flex-wrap">
                        {emojis.map(e => (
                            <button
                                key={e}
                                onClick={() => updateField('emoji', e)}
                                className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center border-2 transition-all ${formData.emoji === e ? 'border-violet-500 bg-violet-50 shadow-sm' : 'border-slate-200 bg-white hover:border-violet-300'}`}
                            >
                                {e}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tên lộ trình <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        placeholder="VD: React từ Zero đến Production"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 font-medium"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Lĩnh vực</label>
                        <select
                            value={formData.category}
                            onChange={(e) => updateField('category', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-slate-700 font-medium"
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Trình độ</label>
                        <select
                            value={formData.level}
                            onChange={(e) => updateField('level', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-slate-700 font-medium"
                        >
                            {levels.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Thời lượng dự kiến</label>
                    <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => updateField('duration', e.target.value)}
                        placeholder="VD: 10 tuần, 3 tháng..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 font-medium"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả ngắn</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        placeholder="Nêu bật kết quả học viên đạt được sau lộ trình này..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 font-medium resize-none"
                    />
                </div>
            </div>
        </div>
    );

    const Step2 = () => (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-extrabold text-slate-900 mb-1">Xây dựng Modules</h3>
                    <p className="text-sm text-slate-500">Chia nhỏ lộ trình thành các mảnh ghép dễ học tập hơn.</p>
                </div>
                <button
                    onClick={addModule}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-100 hover:bg-violet-200 text-violet-700 font-bold text-sm rounded-xl transition-colors"
                >
                    <Plus size={16} /> Thêm Module
                </button>
            </div>

            <div className="space-y-4">
                {formData.modules.map((mod, index) => (
                    <div key={mod.id} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl relative group">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => removeModule(mod.id)}
                                disabled={formData.modules.length === 1}
                                className={`p-2 rounded-lg ${formData.modules.length === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'}`}
                            >
                                <Trash size={18} />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-violet-600 text-white font-extrabold flex items-center justify-center text-sm">{index + 1}</div>
                            <h4 className="font-extrabold text-slate-700">Module {index + 1}</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 mb-1">Tên Module</label>
                                <input
                                    type="text"
                                    value={mod.title}
                                    onChange={(e) => updateModule(mod.id, 'title', e.target.value)}
                                    placeholder="VD: JavaScript Foundations"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-violet-500 font-medium"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 mb-1">Ghi chú (Tùy chọn)</label>
                                <input
                                    type="text"
                                    value={mod.desc}
                                    onChange={(e) => updateModule(mod.id, 'desc', e.target.value)}
                                    placeholder="VD: 3 buổi • Mini project: To-do app thuần JS"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-violet-500 font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Số buổi dự kiến</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={mod.sessionsNeeded}
                                    onChange={(e) => updateModule(mod.id, 'sessionsNeeded', parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-violet-500 font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Tiêu chí mở khóa tiếp</label>
                                <select
                                    value={mod.criteria}
                                    onChange={(e) => updateModule(mod.id, 'criteria', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-violet-500 font-medium bg-white"
                                >
                                    <option>Đủ buổi học</option>
                                    <option>Đủ buổi học & Làm bài Quiz</option>
                                    <option>Hoàn thành Mini Project</option>
                                    <option>GV đánh giá đạt</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const Step3 = () => (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-1">Học phí & Thiết lập lớp học</h3>
                <p className="text-sm text-slate-500">Quy định số lượng học viên và học phí toàn bộ khóa.</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3 text-blue-800 text-sm">
                <AlertCircle size={20} className="shrink-0 text-blue-600 mt-0.5" />
                <p>Khác với dạy lẻ, đây là lộ trình đóng gói dài kỳ. Bạn nên thiết lập tổng credits hợp lý bao gồm cả tài liệu và support dự án để thu hút học viên.</p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Học phí trọn gói (Credits)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-500">
                                <Coins size={18} className="fill-current" />
                            </div>
                            <input
                                type="number"
                                value={formData.totalCredits}
                                onChange={(e) => updateField('totalCredits', parseInt(e.target.value) || 0)}
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 font-extrabold text-lg"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Giới hạn học viên</label>
                        <input
                            type="number"
                            value={formData.maxStudents}
                            onChange={(e) => updateField('maxStudents', parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 font-medium"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                    <label className="block text-sm font-bold text-slate-700 mb-3">Hình thức đăng ký</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className={`relative flex cursor-pointer rounded-2xl border-2 p-4 transition-all ${formData.registrationType === 'auto' ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                            <input
                                type="radio"
                                name="regType"
                                className="sr-only"
                                checked={formData.registrationType === 'auto'}
                                onChange={() => updateField('registrationType', 'auto')}
                            />
                            <div className="flex flex-col">
                                <span className={`font-bold block mb-1 ${formData.registrationType === 'auto' ? 'text-violet-700' : 'text-slate-900'}`}>Tự động duyệt</span>
                                <span className="text-xs text-slate-500">Học viên có đủ credit đăng ký là vào học liền.</span>
                            </div>
                            {formData.registrationType === 'auto' && <CheckCircle2 size={24} className="text-violet-500 absolute top-4 right-4" />}
                        </label>

                        <label className={`relative flex cursor-pointer rounded-2xl border-2 p-4 transition-all ${formData.registrationType === 'manual' ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                            <input
                                type="radio"
                                name="regType"
                                className="sr-only"
                                checked={formData.registrationType === 'manual'}
                                onChange={() => updateField('registrationType', 'manual')}
                            />
                            <div className="flex flex-col">
                                <span className={`font-bold block mb-1 ${formData.registrationType === 'manual' ? 'text-violet-700' : 'text-slate-900'}`}>Phê duyệt thủ công</span>
                                <span className="text-xs text-slate-500">Giáo viên xem profile và chấp nhận duyệt yêu cầu.</span>
                            </div>
                            {formData.registrationType === 'manual' && <CheckCircle2 size={24} className="text-violet-500 absolute top-4 right-4" />}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );

    const Step4 = () => (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-1">Xem trước màn hiển thị</h3>
                <p className="text-sm text-slate-500">Học viên sẽ thấy giao diện này ở màn Khám Phá.</p>
            </div>

            {/* PREVIEW CARD */}
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-lg shadow-indigo-100/50 pb-8 pointer-events-none scale-95 origin-top">
                <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative">
                    <div className="flex gap-4 items-start md:items-center">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl font-bold shrink-0 shadow-sm">
                            {formData.emoji}
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-900 mb-1">{formData.title || 'Tên Lộ Trình Chưa Đặt'}</h2>
                            <p className="text-slate-600 text-sm max-w-2xl mb-3">{formData.description || 'Mô tả ngắn lộ trình của bạn...'}</p>
                            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                                <span className="flex items-center gap-1.5"><Layout size={14} className="text-blue-500" /> {formData.category}</span>
                                <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> {formData.duration || 'Chưa định thời gian'}</span>
                                <span className="flex items-center gap-1.5"><Target size={14} className="text-emerald-500" /> {formData.level}</span>
                                <span className="flex items-center gap-1.5 text-amber-600 font-bold"><Coins size={14} className="fill-current" /> {formData.totalCredits} credits</span>
                            </div>
                        </div>
                    </div>
                    <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0 opacity-50">
                        <button className="w-full md:w-auto px-8 py-3 bg-[#6B72FF] text-white font-bold rounded-xl shadow-md cursor-not-allowed">
                            Đăng ký học →
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 bg-slate-50/50">
                    <div className="p-6 md:p-8 border-r border-slate-100/50">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">GIÁO VIÊN</h4>
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-sm shrink-0">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h5 className="font-extrabold text-slate-900 flex items-center gap-1">
                                    {user?.name || 'Your Name'} <CheckCircle2 size={14} className="text-emerald-500" />
                                </h5>
                                <p className="text-xs text-slate-500 mt-0.5 max-w-[160px]">Mentor</p>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 p-6 md:p-8">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5"><BookOpen size={14} className="text-emerald-500" /> {formData.modules.length} MODULES</h4>

                        <div className="space-y-4">
                            {formData.modules.map((mod, idx) => (
                                <div key={mod.id} className="flex gap-4 items-start pb-2">
                                    <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 text-slate-500 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                        {formData.emoji}
                                    </div>
                                    <div>
                                        <h5 className="font-extrabold text-slate-800 text-sm mb-1">{idx + 1}. {mod.title || `Module ${idx + 1}`}</h5>
                                        <p className="text-xs font-medium text-slate-500">{mod.desc || 'Chưa có ghi chú'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex gap-3 text-emerald-800 text-sm shadow-sm mt-4">
                <CheckCircle2 size={20} className="shrink-0 text-emerald-600 mt-0.5" />
                <div>
                    <p className="font-bold">Sẵn sàng xuất bản!</p>
                    <p className="opacity-90 mt-1 pb-1">Khi bấm "Đăng lộ trình", học viên có thể tìm thấy bạn trong hệ thống Khám phá để đăng ký lớp.</p>
                </div>
            </div>

        </div>
    );

    const steps = [
        { id: 1, title: 'Tổng quan', icon: FileText },
        { id: 2, title: 'Chương trình', icon: ListChecks },
        { id: 3, title: 'Cấu hình', icon: Coins },
        { id: 4, title: 'Preview', icon: Eye },
    ];

    return (
        <div className="max-w-4xl mx-auto font-sans pb-16 pt-8 px-4">
            {/* Simple Header */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Map className="text-violet-600" size={32} /> Tạo mới lộ trình
                    </h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Thiết kế con đường tối ưu giúp học viên tới mục tiêu.</p>
                </div>
                <button
                    onClick={() => navigate('/app/teaching')}
                    className="text-slate-400 hover:text-slate-600 font-bold text-sm bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors"
                >
                    Hủy & Quay lại
                </button>
            </div>

            {/* Stepper Progress */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 sm:p-6 mb-8 overflow-x-auto hide-scrollbar">
                <div className="flex items-center min-w-max justify-between relative px-2 sm:px-8">
                    {/* Line behind */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 rounded-full z-0 mx-8"></div>

                    {/* Active Line (blue) */}
                    <div className="absolute top-1/2 left-0 h-1 bg-violet-500 -translate-y-1/2 rounded-full transition-all duration-500 z-0 ml-8"
                        style={{ width: `calc(${((currentStep - 1) / 3) * 100}% - 4rem)` }}></div>

                    {steps.map(step => (
                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 font-extrabold
                                ${currentStep === step.id ? 'border-violet-100 bg-violet-600 text-white scale-110 shadow-lg shadow-violet-200' :
                                    currentStep > step.id ? 'border-violet-600 bg-violet-600 text-white' :
                                        'border-white bg-slate-100 text-slate-400'}`}
                            >
                                {currentStep > step.id ? <CheckCircle2 size={20} /> : <step.icon size={20} />}
                            </div>
                            <span className={`text-xs font-bold mt-2 hidden sm:block ${currentStep >= step.id ? 'text-violet-600' : 'text-slate-400'}`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Step Content area */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 sm:p-8 lg:p-10 mb-8 overflow-hidden relative min-h-[400px]">
                {currentStep === 1 && <Step1 />}
                {currentStep === 2 && <Step2 />}
                {currentStep === 3 && <Step3 />}
                {currentStep === 4 && <Step4 />}
            </div>

            {/* Footer Navigation Controls */}
            <div className="flex items-center justify-between">
                <button
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    <ArrowLeft size={18} /> Quay lại
                </button>

                {currentStep < 4 ? (
                    <button
                        onClick={handleNext}
                        disabled={currentStep === 1 && !formData.title} // Basic validation
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${currentStep === 1 && !formData.title ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-200 active:-translate-y-0.5 hover:-translate-y-1'}`}
                    >
                        Tiếp theo <ArrowRight size={18} />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-10 py-3 rounded-xl font-bold transition-all bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-200 active:-translate-y-0.5 hover:-translate-y-1"
                    >
                        <Map size={18} fill="currentColor" className="text-emerald-100" /> Đăng lộ trình
                    </button>
                )}
            </div>
        </div>
    );
};

export default CreateLearningPath;
