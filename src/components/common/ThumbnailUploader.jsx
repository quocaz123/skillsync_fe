import React, { useRef, useState } from 'react';
import { ImageSquare, CloudArrowUp, X, CircleNotch, Warning } from '@phosphor-icons/react';
import { uploadFile } from '../../services/uploadService';

/**
 * ThumbnailUploader — Component upload ảnh thumbnail lộ trình
 * Dùng hệ thống Presigned URL (Cloudflare R2), thay thế input URL thủ công.
 *
 * Props:
 *   value    {string}   URL ảnh hiện tại ('' nếu chưa có)
 *   onChange {Function} callback(newUrl: string) khi upload xong / xóa ảnh
 */
export default function ThumbnailUploader({ value, onChange }) {
    const inputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [dragging, setDragging] = useState(false);

    const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_MB = 5;

    const handleFile = async (file) => {
        if (!file) return;
        setError('');

        if (!ACCEPTED.includes(file.type)) {
            setError('Chỉ hỗ trợ JPG, PNG, WEBP.');
            return;
        }
        if (file.size > MAX_MB * 1024 * 1024) {
            setError(`Ảnh phải nhỏ hơn ${MAX_MB}MB.`);
            return;
        }

        setUploading(true);
        try {
            const { fileUrl } = await uploadFile(file, 'LEARNING_PATH_THUMBNAIL');
            onChange(fileUrl);
        } catch (err) {
            console.error('Thumbnail upload failed:', err);
            setError('Upload thất bại. Vui lòng thử lại.');
        } finally {
            setUploading(false);
        }
    };

    const handleInputChange = (e) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        // Reset input để cho phép chọn lại cùng file
        e.target.value = '';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const handleRemove = () => {
        onChange('');
        setError('');
    };

    // --- Trạng thái: đã có ảnh → preview ---
    if (value) {
        return (
            <div className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <img
                    src={value}
                    alt="Thumbnail preview"
                    className="w-full h-36 object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-white text-slate-800 text-xs font-bold shadow hover:bg-slate-50 transition-all flex items-center gap-1.5"
                    >
                        <CloudArrowUp size={14} weight="bold" />
                        Thay ảnh
                    </button>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="p-1.5 rounded-lg bg-rose-500 text-white shadow hover:bg-rose-600 transition-all"
                        title="Xóa ảnh"
                    >
                        <X size={14} weight="bold" />
                    </button>
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPTED.join(',')}
                    className="hidden"
                    onChange={handleInputChange}
                />
            </div>
        );
    }

    // --- Trạng thái: chưa có ảnh → vùng drop ---
    return (
        <div>
            <div
                onClick={() => !uploading && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`
                    relative flex flex-col items-center justify-center gap-2.5
                    rounded-xl border-2 border-dashed h-36 cursor-pointer
                    transition-all duration-200 select-none
                    ${dragging
                        ? 'border-indigo-400 bg-indigo-50/60 scale-[1.01]'
                        : 'border-slate-200 bg-slate-50/40 hover:border-indigo-300 hover:bg-indigo-50/30'
                    }
                    ${uploading ? 'pointer-events-none opacity-70' : ''}
                `}
            >
                {uploading ? (
                    <>
                        <CircleNotch size={28} className="text-indigo-500 animate-spin" />
                        <p className="text-xs font-bold text-indigo-500">Đang tải lên...</p>
                    </>
                ) : (
                    <>
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all
                            ${dragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                            <ImageSquare size={24} weight="duotone" />
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-bold text-slate-600">
                                Kéo thả hoặc{' '}
                                <span className="text-indigo-600 underline underline-offset-2">chọn ảnh</span>
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">JPG, PNG, WEBP · Tối đa {MAX_MB}MB</p>
                        </div>
                    </>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPTED.join(',')}
                    className="hidden"
                    onChange={handleInputChange}
                />
            </div>

            {error && (
                <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-rose-600">
                    <Warning size={12} weight="fill" />
                    {error}
                </p>
            )}
        </div>
    );
}
