import React from 'react';
import { 
    Clock, CheckCircle, XCircle, 
    WarningCircle, PlayCircle 
} from '@phosphor-icons/react';

const STATUS_CONFIGS = {
    SCHEDULED: {
        label: 'Sắp diễn ra',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-100',
        icon: <Clock size={16} weight="bold" />
    },
    IN_PROGRESS: {
        label: 'Đang diễn ra',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-100',
        icon: <PlayCircle size={16} weight="bold" />
    },
    COMPLETED: {
        label: 'Đã hoàn thành',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-100',
        icon: <CheckCircle size={16} weight="bold" />
    },
    CANCELLED: {
        label: 'Đã hủy',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-100',
        icon: <XCircle size={16} weight="bold" />
    },
    DISPUTED: {
        label: 'Khiếu nại',
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-100',
        icon: <WarningCircle size={16} weight="bold" />
    }
};

const SessionStatusBadge = ({ status, extra = '' }) => {
    const config = STATUS_CONFIGS[status] || {
        label: status,
        bg: 'bg-slate-50',
        text: 'text-slate-600',
        border: 'border-slate-100',
        icon: null
    };

    return (
        <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border ${config.bg} ${config.text} ${config.border} text-sm font-bold ${extra}`}>
            {config.icon}
            {config.label}
        </div>
    );
};

export default SessionStatusBadge;
