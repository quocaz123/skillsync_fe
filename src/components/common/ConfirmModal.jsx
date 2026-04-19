import React from 'react';
import { Warning, CheckCircle, XCircle } from '@phosphor-icons/react';

const ConfirmModal = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Xác nhận", 
  cancelText = "Huỷ",
  type = "warning", // 'warning', 'danger', 'info', 'success'
  isLoading = false
}) => {
  if (!isOpen) return null;

  const getStyle = () => {
    switch (type) {
        case 'danger':
            return {
                bg: 'bg-rose-50',
                border: 'border-rose-100',
                icon: <Warning size={28} weight="fill" />,
                iconBox: 'bg-rose-100 text-rose-600',
                btnConfirm: 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20 text-white'
            };
        case 'info':
            return {
                bg: 'bg-blue-50',
                border: 'border-blue-100',
                icon: <CheckCircle size={28} weight="fill" />,
                iconBox: 'bg-blue-100 text-blue-600',
                btnConfirm: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 text-white'
            };
        case 'success':
            return {
                bg: 'bg-emerald-50',
                border: 'border-emerald-100',
                icon: <CheckCircle size={28} weight="fill" />,
                iconBox: 'bg-emerald-100 text-emerald-600',
                btnConfirm: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 text-white'
            };
        case 'warning':
        default:
            return {
                bg: 'bg-amber-50',
                border: 'border-amber-100',
                icon: <Warning size={28} weight="fill" />,
                iconBox: 'bg-amber-100 text-amber-600',
                btnConfirm: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20 text-white'
            };
    }
  };

  const style = getStyle();

  return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-sm sm:max-w-md shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 border border-slate-100 overflow-hidden flex flex-col">
                <div className={`p-5 border-b relative flex items-center gap-4 ${style.bg} ${style.border}`}>
                    <button onClick={onCancel} disabled={isLoading} className="absolute top-5 right-5 w-8 h-8 bg-white hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors shadow-sm disabled:opacity-50">
                        <XCircle size={20} />
                    </button>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0 ${style.iconBox}`}>
                        {style.icon}
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800">{title}</h2>
                    </div>
                </div>
                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-slate-600 font-medium whitespace-pre-wrap">{message}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            disabled={isLoading}
                            className="flex-1 py-3 font-bold rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all hover:bg-slate-200 shadow-sm disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-[1.5] py-3 font-bold rounded-xl transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 ${style.btnConfirm}`}
                        >
                            {isLoading ? 'Đang xử lý...' : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
