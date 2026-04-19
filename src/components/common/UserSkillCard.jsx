import { Coin, X } from '@phosphor-icons/react';
import { SkillDynamicIcon } from './SkillDynamicIcon';

export default function UserSkillCard({
    skill,
    onClick,
    selected,
    showStatusBadge = true,
    actionButtons,
    showDelete,
    onDelete,
    showDesc,
    className = 'w-full'
}) {
    let cfg = {};
    if (skill.verificationStatus === 'APPROVED' && skill.hidden) {
        cfg = { bg: 'bg-gradient-to-br from-slate-100 to-slate-50 border-slate-200/80 text-slate-700 hover:shadow-slate-200', badge: 'bg-slate-200 text-slate-600 border-slate-300', badgeText: '🔕 Tạm ẩn' };
    } else if (skill.verificationStatus === 'APPROVED') {
        cfg = { bg: 'bg-gradient-to-br from-purple-50 to-fuchsia-50/50 border-purple-200/60 text-purple-800 hover:shadow-purple-200', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', badgeText: '✅ Đã duyệt' };
    } else if (skill.verificationStatus === 'REJECTED') {
        cfg = { bg: 'bg-gradient-to-br from-red-50 to-rose-50/50 border-red-200/60 text-red-800 hover:shadow-red-200 opacity-90', badge: 'bg-red-100 text-red-700 border-red-200', badgeText: '❌ Bị từ chối' };
    } else {
        cfg = { bg: 'bg-gradient-to-br from-amber-50 to-yellow-50/50 border-amber-200/60 text-amber-800 hover:shadow-amber-200 opacity-90', badge: 'bg-amber-100 text-amber-700 border-amber-200', badgeText: '⏳ Đang chờ' };
    }

    const Container = onClick ? 'button' : 'div';
    const borderCls = selected ? 'border-violet-500 shadow-md ring-2 ring-violet-500/20' : cfg.bg.match(/border-[a-z]+-[0-9]+\/[0-9]+/)?.[0] || 'border-slate-200';

    return (
        <Container
            onClick={onClick}
            type={onClick ? "button" : undefined}
            className={`group relative flex flex-col items-start gap-2.5 px-5 py-4 rounded-2xl border font-bold text-sm shadow-sm transition-all text-left ${onClick ? 'hover:-translate-y-1 hover:shadow-md cursor-pointer' : 'hover:-translate-y-0.5'} ${cfg.bg.replace(/border-[^\s]+/, '')} ${borderCls} ${className}`}
        >
            <div className="flex items-center gap-2 flex-wrap w-full">
                <SkillDynamicIcon skillName={skill.skillName} defaultIcon={skill.skillIcon} className="text-base" size={18} />
                <span className="text-[15px]">{skill.skillName}</span>
                <span className="text-[10px] bg-white border border-slate-200 text-slate-500 uppercase tracking-wider px-2 py-0.5 rounded-md font-black shadow-sm ml-1">{skill.level}</span>
                
                {showStatusBadge && (
                    <span className={`text-[10px] border px-2 py-0.5 rounded-md font-black shadow-sm ml-1 w-max ${cfg.badge}`}>{cfg.badgeText}</span>
                )}

                <div className="flex-1" />
                
                {selected && (
                    <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                )}
            </div>
            
            {(showDesc && skill.experienceDesc) && (
                <p className="text-xs opacity-80 leading-relaxed max-w-full text-slate-700 mt-1 line-clamp-2 w-full">{skill.experienceDesc}</p>
            )}

            {skill.verificationStatus === 'REJECTED' && skill.rejectionReason && (
                <p className="text-[11px] text-red-600 bg-white/70 p-2.5 rounded-xl italic font-medium w-full border border-red-100/50">Phản hồi từ Admin: {skill.rejectionReason}</p>
            )}

            <div className="flex flex-wrap items-center justify-between w-full mt-1 gap-2">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[12px] text-slate-700 bg-white/80 px-2.5 py-1 rounded-xl shadow-sm flex items-center gap-1 border border-slate-200/40">
                        <Coin size={14} weight="fill" className="text-amber-500" />
                        {skill.creditsPerHour || 5} cr/h
                    </span>
                    {actionButtons}
                </div>
            </div>

            {showDelete && (
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete?.(skill.id); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-lg p-1.5 transition-all shadow-sm"
                    title="Xóa kỹ năng"
                >
                    <X size={14} weight="bold" />
                </button>
            )}
        </Container>
    );
}
