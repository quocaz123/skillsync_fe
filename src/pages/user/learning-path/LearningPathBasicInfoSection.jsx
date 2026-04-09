import React from 'react';
import { MOCK_SKILLS, LEVEL_OPTIONS } from './learningPathMocks';

export default function LearningPathBasicInfoSection({ data, onChange, errors }) {
    const set = (field, value) => onChange({ ...data, [field]: value });

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tiêu đề *</label>
                <input
                    type="text"
                    value={data.title}
                    onChange={(e) => set('title', e.target.value)}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-shadow ${
                        errors.title ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                    }`}
                    placeholder="Ví dụ: UX Design từ zero đến portfolio"
                />
                {errors.title && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.title}</p>}
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mô tả ngắn</label>
                <input
                    type="text"
                    value={data.shortDescription}
                    onChange={(e) => set('shortDescription', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/30 outline-none"
                    placeholder="Một dòng giới thiệu lộ trình"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mô tả đầy đủ</label>
                <textarea
                    value={data.description}
                    onChange={(e) => set('description', e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/30 outline-none resize-y min-h-[100px]"
                    placeholder="Nội dung chi tiết, mục tiêu, đối tượng..."
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kỹ năng *</label>
                    <input
                        type="text"
                        list="learning-path-skill-suggestions"
                        value={data.skill}
                        onChange={(e) => set('skill', e.target.value)}
                        autoComplete="off"
                        className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none ${
                            errors.skill ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                        }`}
                        placeholder="Nhập hoặc chọn gợi ý — ví dụ: UX Design, React…"
                    />
                    <datalist id="learning-path-skill-suggestions">
                        {MOCK_SKILLS.map((s) => (
                            <option key={s} value={s} />
                        ))}
                    </datalist>
                    <p className="text-[11px] text-slate-400 mt-1">Gõ tự do; danh sách gợi ý chỉ để tham khảo.</p>
                    {errors.skill && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.skill}</p>}
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Trình độ *</label>
                    <select
                        value={data.level}
                        onChange={(e) => set('level', e.target.value)}
                        className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/30 outline-none ${
                            errors.level ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                        }`}
                    >
                        <option value="">Chọn trình độ</option>
                        {LEVEL_OPTIONS.map((l) => (
                            <option key={l} value={l}>
                                {l}
                            </option>
                        ))}
                    </select>
                    {errors.level && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.level}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Thời lượng ước tính</label>
                    <input
                        type="text"
                        value={data.estimatedDuration}
                        onChange={(e) => set('estimatedDuration', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/30"
                        placeholder="Ví dụ: 8 tuần"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Thumbnail (URL ảnh)</label>
                    <input
                        type="url"
                        value={data.thumbnail}
                        onChange={(e) => set('thumbnail', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/30"
                        placeholder="https://example.com/banner.jpg"
                    />
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                        Dán <strong className="text-slate-500">đường dẫn file ảnh</strong> (kết thúc .jpg, .png, .webp…). Link bài viết / trang chủ thường{' '}
                        <em>không</em> phải ảnh; một số host cũng chặn hiển thị ngoài site (hotlink).
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Giá & credits</p>
                <div className="flex flex-wrap gap-4">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="priceType"
                            checked={data.priceType === 'FREE'}
                            onChange={() => set('priceType', 'FREE')}
                            className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-semibold text-slate-800">Miễn phí (FREE)</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="priceType"
                            checked={data.priceType === 'PAID'}
                            onChange={() => set('priceType', 'PAID')}
                            className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-semibold text-slate-800">Trả credits (PAID)</span>
                    </label>
                </div>
                {data.priceType === 'PAID' && (
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Tổng credits *</label>
                        <input
                            type="number"
                            min={1}
                            value={data.totalCreditsCost || ''}
                            onChange={(e) => set('totalCreditsCost', Number(e.target.value))}
                            className={`w-full max-w-xs rounded-xl border px-4 py-2.5 text-sm font-bold ${
                                errors.totalCreditsCost ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                            }`}
                            placeholder="Số credits"
                        />
                        {errors.totalCreditsCost && (
                            <p className="text-xs text-rose-600 mt-1 font-medium">{errors.totalCreditsCost}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
