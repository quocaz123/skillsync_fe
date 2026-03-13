import { Activity, Server, Database, Zap, Users, RefreshCw } from 'lucide-react';

const MOCK_LOGS = [
    { id: 1, user: 'Trần Thị Bình', action: 'Đăng nhập thành công', time: '12:30:25', ip: '192.168.1.1', level: 'info' },
    { id: 2, user: 'Nguyễn Văn An', action: 'Tạo session mới: React.js Hooks', time: '12:28:10', ip: '10.0.0.2', level: 'info' },
    { id: 3, user: 'Ẩn danh', action: 'Báo cáo người dùng #1087', time: '12:25:44', ip: '10.0.0.15', level: 'warning' },
    { id: 4, user: 'Hệ thống', action: 'Phát hiện giao dịch bất thường #992', time: '12:20:03', ip: 'system', level: 'error' },
    { id: 5, user: 'Phạm Thị Dung', action: 'Đăng nhập thành công', time: '12:18:57', ip: '172.16.0.5', level: 'info' },
    { id: 6, user: 'Trần Thị Bình', action: 'Gửi lộ trình mới chờ duyệt: Fullstack Next.js', time: '12:10:22', ip: '192.168.1.1', level: 'info' },
    { id: 7, user: 'Hệ thống', action: 'Trao phần thưởng mission cho Nguyễn Văn An', time: '12:05:00', ip: 'system', level: 'info' },
    { id: 8, user: 'Admin', action: 'Khoá tài khoản Hoàng Văn Em #5', time: '11:55:33', ip: 'admin', level: 'warning' },
];

const weeklyData = [
    { day: 'T2', dau: 340 },
    { day: 'T3', dau: 420 },
    { day: 'T4', dau: 380 },
    { day: 'T5', dau: 510 },
    { day: 'T6', dau: 635 },
    { day: 'T7', dau: 720 },
    { day: 'CN', dau: 480 },
];
const maxDau = Math.max(...weeklyData.map(d => d.dau));

const levelConfig = {
    info:    { dot: 'bg-blue-400', text: 'text-slate-600', bg: '' },
    warning: { dot: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-50/40' },
    error:   { dot: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50/40' },
};

const AdminSystem = () => {
    const metrics = [
        { label: 'CPU Load', value: 24, color: 'bg-emerald-500', unit: '%' },
        { label: 'Memory', value: 67, color: 'bg-blue-500', unit: '%' },
        { label: 'DB Response', value: 42, color: 'bg-emerald-500', unit: 'ms', maxScale: 200 },
        { label: 'API Latency', value: 38, color: 'bg-emerald-500', unit: 'ms', maxScale: 200 },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6 pb-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <Server size={22} className="text-slate-600" /> Sức khoẻ Hệ thống
                    </h1>
                    <p className="text-sm text-slate-400 font-medium mt-1">Theo dõi hiệu suất và hoạt động kỹ thuật của nền tảng</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-sm font-bold text-emerald-700">Hệ thống bình thường</span>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'DAU (hôm nay)', value: '720', Icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                    { label: 'MAU', value: '8,420', Icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
                    { label: 'Uptime', value: '99.8%', Icon: Server, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                    { label: 'Credits phát hành', value: '24.5k', Icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                ].map(({ label, value, Icon, color, bg, border }) => (
                    <div key={label} className={`${bg} border ${border} rounded-2xl p-5`}>
                        <Icon size={20} className={`${color} mb-2`} />
                        <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
                        <div className="text-xs font-semibold text-slate-500 mt-0.5">{label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Health Meters */}
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
                    <h3 className="font-extrabold text-slate-900 flex items-center gap-2 mb-5">
                        <Activity size={18} className="text-emerald-500" /> Performance Metrics
                        <button className="ml-auto p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                            <RefreshCw size={14} />
                        </button>
                    </h3>
                    <div className="space-y-5">
                        {metrics.map(m => {
                            const barPct = m.maxScale ? (m.value / m.maxScale) * 100 : m.value;
                            return (
                                <div key={m.label}>
                                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                                        <span>{m.label}</span>
                                        <span className="text-slate-800">{m.value}{m.unit}</span>
                                    </div>
                                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${m.color} rounded-full`} style={{ width: `${barPct}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* DAU Chart */}
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
                    <h3 className="font-extrabold text-slate-900 flex items-center gap-2 mb-5">
                        <Users size={18} className="text-blue-500" /> DAU — 7 ngày gần nhất
                    </h3>
                    <div className="flex items-end gap-3 h-36">
                        {weeklyData.map(d => (
                            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-[10px] font-bold text-slate-500">{d.dau}</span>
                                <div className="w-full bg-[#5A63F6] rounded-t-lg hover:bg-violet-500 transition-colors"
                                    style={{ height: `${(d.dau / maxDau) * 100}%` }} />
                                <span className="text-[10px] font-bold text-slate-400">{d.day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
                        <Database size={18} className="text-slate-500" /> Activity Log
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">Cập nhật realtime</span>
                </div>
                <div className="divide-y divide-slate-50">
                    {MOCK_LOGS.map(log => {
                        const lc = levelConfig[log.level];
                        return (
                            <div key={log.id} className={`flex items-center gap-4 px-6 py-3 hover:bg-slate-50/50 ${lc.bg}`}>
                                <div className={`w-2 h-2 rounded-full ${lc.dot} shrink-0`} />
                                <span className="text-xs text-slate-400 font-mono w-16 shrink-0">{log.time}</span>
                                <span className={`text-sm font-medium flex-1 ${lc.text}`}>{log.action}</span>
                                <span className="text-xs text-slate-400 font-medium">{log.user}</span>
                                <span className="text-xs font-mono text-slate-300">{log.ip}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AdminSystem;
