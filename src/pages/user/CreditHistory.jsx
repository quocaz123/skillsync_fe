import { useStore } from '../../store';
import { Zap, TrendingUp, TrendingDown, Clock, BookOpen, Award, Gift, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

const TX_CONFIG = {
    session_booked: { icon: BookOpen, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100', label: 'Đặt lịch học', sign: '-' },
    session_completed: { icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'Nhận từ buổi dạy', sign: '+' },
    welcome: { icon: Gift, color: 'text-[#5A63F6]', bg: 'bg-indigo-50', border: 'border-indigo-100', label: 'Welcome / Nhiệm vụ', sign: '+' },
    bonus: { icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', label: 'Thưởng cộng đồng', sign: '+' },
};

const CreditHistory = () => {
    const { credits, creditHistory } = useStore();

    const totalEarned = creditHistory.filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
    const totalSpent = creditHistory.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    return (
        <div className="max-w-4xl mx-auto font-sans pb-12 space-y-8">

            {/* Header */}
            <div className="bg-slate-900 rounded-[2rem] p-8 sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#5A63F6] rounded-full mix-blend-screen filter blur-[100px] opacity-25 pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-10 w-60 h-60 bg-amber-500 rounded-full mix-blend-screen filter blur-[100px] opacity-15 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
                            <Wallet size={12} className="text-amber-300" /> Ví Credits
                        </div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">Credit History</h1>
                        <p className="text-slate-400 mt-2">Theo dõi tất cả giao dịch credit của bạn</p>
                    </div>

                    {/* Balance card */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shrink-0">
                        <div className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Số dư hiện tại</div>
                        <div className="flex items-center gap-2 text-white font-extrabold text-4xl">
                            <Zap size={32} className="text-amber-400 fill-amber-400" />
                            {credits}
                        </div>
                        <div className="text-white/50 text-xs font-medium mt-1">credits</div>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
                    <div className="w-12 h-12 bg-[#5A63F6]/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Zap size={24} className="text-[#5A63F6] fill-[#5A63F6]/50" />
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 mb-1">{credits}</div>
                    <div className="text-sm font-semibold text-slate-500">Số dư hiện tại</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <ArrowUpRight size={24} className="text-emerald-600" />
                    </div>
                    <div className="text-3xl font-extrabold text-emerald-600 mb-1">+{totalEarned}</div>
                    <div className="text-sm font-semibold text-slate-500">Tổng nhận</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <ArrowDownRight size={24} className="text-red-500" />
                    </div>
                    <div className="text-3xl font-extrabold text-red-500 mb-1">-{totalSpent}</div>
                    <div className="text-sm font-semibold text-slate-500">Tổng chi tiêu</div>
                </div>
            </div>

            {/* Transaction Timeline */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                        <Clock size={20} className="text-[#5A63F6]" /> Lịch sử giao dịch
                    </h2>
                    <span className="text-sm font-bold text-slate-400">{creditHistory.length} giao dịch</span>
                </div>

                {creditHistory.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="text-5xl mb-4">💳</div>
                        <p className="text-slate-500 font-medium">Chưa có giao dịch nào</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {creditHistory.map((tx, idx) => {
                            const config = TX_CONFIG[tx.type] || TX_CONFIG['welcome'];
                            const Icon = config.icon;
                            const isPositive = tx.amount > 0;
                            return (
                                <div key={tx.id || idx} className="flex items-center gap-5 p-5 md:p-6 hover:bg-slate-50/80 transition-colors group">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-2xl ${config.bg} border ${config.border} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon size={20} className={config.color} />
                                    </div>
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-extrabold text-slate-800 truncate">{tx.description}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${config.bg} ${config.color} border ${config.border}`}>
                                                {config.label}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium">
                                                {new Date(tx.date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Amount */}
                                    <div className={`text-xl font-extrabold shrink-0 flex items-center gap-1 ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                                        <Zap size={18} className="fill-current opacity-70" />
                                        {isPositive ? '+' : ''}{tx.amount}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Earn More hint */}
            <div className="bg-gradient-to-r from-[#5A63F6] to-indigo-500 rounded-[2rem] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-extrabold mb-2 flex items-center gap-2"><Zap size={20} fill="currentColor" className="text-amber-300" /> Kiếm thêm Credits</h3>
                        <p className="text-white/80 text-sm font-medium max-w-md">Dạy kỹ năng của bạn cho người khác và nhận credits. Credits = phần thưởng cho đóng góp cộng đồng!</p>
                    </div>
                    <a href="/app/skills" className="shrink-0 px-6 py-3 bg-white text-[#5A63F6] font-bold rounded-xl hover:bg-white/90 transition-colors active:scale-95">
                        Thêm kỹ năng dạy →
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CreditHistory;
