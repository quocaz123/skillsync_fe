import { useState } from 'react';
import { useStore } from '../../store';
import {
    Plus, Trash2, Edit2, Award, Users, CheckCircle2, TrendingUp, Search,
    Activity, BarChart3, Settings, Zap, Star, Clock, ChevronRight,
    Shield, BookOpen, CalendarDays, Eye, AlertCircle, MoreVertical,
    Download, RefreshCw, XCircle, CheckSquare, Flag
} from 'lucide-react';

// ─── MOCK DATA ──────────────────────────────────────────────────────────────
const MOCK_USERS = [
    { id: 1, name: 'Nguyễn Văn An', email: 'an@example.com', credits: 180, status: 'active', role: 'both', sessions: 12, joined: '2026-01-05', rating: 4.7, trustScore: 85, verificationStatus: 'verified' },
    { id: 2, name: 'Trần Thị Bình', email: 'binh@example.com', credits: 340, status: 'active', role: 'teach', sessions: 28, joined: '2025-12-20', rating: 4.9, trustScore: 98, verificationStatus: 'verified' },
    { id: 3, name: 'Lê Hoàng Cường', email: 'cuong@example.com', credits: 50, status: 'inactive', role: 'learn', sessions: 3, joined: '2026-02-10', rating: null, trustScore: 40, verificationStatus: 'none' },
    { id: 4, name: 'Phạm Thị Dung', email: 'dung@example.com', credits: 220, status: 'active', role: 'both', sessions: 17, joined: '2026-01-15', rating: 4.5, trustScore: 70, verificationStatus: 'pending', evidence: 'GitHub Portfolio & AWS Cert' },
    { id: 5, name: 'Hoàng Văn Em', email: 'em@example.com', credits: 10, status: 'banned', role: 'learn', sessions: 1, joined: '2026-03-01', rating: null, trustScore: 10, verificationStatus: 'rejected' },
];

// MOCK_USERS moved to AdminUsers.jsx

const MOCK_SESSIONS = [
    { id: 's1', topic: 'React.js Hooks Advanced', student: 'Nguyễn Văn An', mentor: 'Trần Thị Bình', date: '2026-03-10T10:00:00', status: 'upcoming', cost: 50, type: 'single' },
    { id: 's2', topic: 'UI/UX Design Basics', student: 'Lê Hoàng Cường', mentor: 'Phạm Thị Dung', date: '2026-03-09T14:00:00', status: 'completed', cost: 40, rating: 5, type: 'path', pathName: 'Trở thành UI/UX Designer' },
    { id: 's3', topic: 'Python Data Science', student: 'Nguyễn Văn An', mentor: 'Phạm Thị Dung', date: '2026-03-08T09:00:00', status: 'completed', cost: 60, rating: 4, type: 'single' },
    { id: 's4', topic: 'Public Speaking Masterclass', student: 'Phạm Thị Dung', mentor: 'Trần Thị Bình', date: '2026-03-11T16:00:00', status: 'upcoming', cost: 70, type: 'path', pathName: 'Kỹ năng mềm cho IT' },
];

const MOCK_PATHS = [
    { id: 'p1', title: 'Trở thành UI/UX Designer', mentor: 'Phạm Thị Dung', created: '2026-03-01', modules: 8, price: 400, students: 24, status: 'active' },
    { id: 'p2', title: 'Fullstack Next.js Masterclass', mentor: 'Trần Thị Bình', created: '2026-03-10', modules: 12, price: 800, students: 0, status: 'pending' },
    { id: 'p3', title: 'Kỹ năng mềm cho IT', mentor: 'Trần Thị Bình', created: '2026-02-15', modules: 5, price: 200, students: 156, status: 'active' },
    { id: 'p4', title: 'Hack não tiếng Anh', mentor: 'Trần Thị Bình', created: '2026-03-12', modules: 10, price: 300, students: 0, status: 'rejected' },
];

// ─── SUB COMPONENTS ──────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const cfg = {
        active: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', dot: 'bg-emerald-500', label: 'Active' },
        inactive: { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200', dot: 'bg-slate-400', label: 'Inactive' },
        banned: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', dot: 'bg-red-500', label: 'Banned' },
        upcoming: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', dot: 'bg-blue-500', label: 'Upcoming' },
        completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', dot: 'bg-emerald-500', label: 'Completed' },
        pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', dot: 'bg-amber-500', label: 'Pending' },
        rejected: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', dot: 'bg-rose-500', label: 'Rejected' },
    };
    const c = cfg[status] || cfg.inactive;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${c.bg} ${c.text} border ${c.border} rounded-full text-[11px] font-extrabold`}>
            <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></div>
            {c.label}
        </span>
    );
};

const RoleBadge = ({ role }) => {
    const cfg = {
        learn: { label: 'Học viên', bg: 'bg-indigo-50', text: 'text-indigo-700' },
        teach: { label: 'Mentor', bg: 'bg-amber-50', text: 'text-amber-700' },
        both: { label: 'Học & Dạy', bg: 'bg-purple-50', text: 'text-purple-700' },
    };
    const c = cfg[role] || cfg.learn;
    return <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${c.bg} ${c.text}`}>{c.label}</span>;
};

const OverviewTab = ({ tasks }) => {
    const completedTasks = tasks.filter(t => t.completed).length;
    const stats = [
        { label: 'Tổng người dùng', value: '1,248', sub: '+12% tháng này', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', trend: '+12%', trendColor: 'text-emerald-600 bg-emerald-50' },
        { label: 'Lộ trình đang mở', value: MOCK_PATHS.length, sub: '2 chờ duyệt', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-50', trend: '+2 Mới', trendColor: 'text-emerald-600 bg-emerald-50' },
        { label: 'Credits lưu thông', value: '24.5k', sub: 'Tổng hệ thống', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50', trend: '+8%', trendColor: 'text-emerald-600 bg-emerald-50' },
        { label: 'Nhiệm vụ đang chạy', value: `${tasks.length - completedTasks}/${tasks.length}`, sub: `${completedTasks} đã hoàn thành`, icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: 'Live', trendColor: 'text-blue-600 bg-blue-50' },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {stats.map((st, i) => {
                    const Icon = st.icon;
                    return (
                        <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                            <div className="flex justify-between items-start mb-5">
                                <div className={`w-12 h-12 ${st.bg} rounded-2xl flex items-center justify-center`}>
                                    <Icon size={22} className={st.color} />
                                </div>
                                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${st.trendColor}`}>{st.trend}</span>
                            </div>
                            <div className="text-3xl font-extrabold text-slate-900 mb-1">{st.value}</div>
                            <div className="text-xs font-semibold text-slate-400">{st.sub}</div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity + Top Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Sessions */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-extrabold text-slate-900 flex items-center gap-2"><CalendarDays size={18} className="text-[#5A63F6]" /> Sessions gần đây</h3>
                        <span className="text-xs font-bold text-slate-400">{MOCK_SESSIONS.length} tổng</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {MOCK_SESSIONS.slice(0, 4).map(s => (
                            <div key={s.id} className="flex items-center gap-4 p-4 hover:bg-slate-50">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5A63F6] to-fuchsia-500 text-white flex items-center justify-center font-extrabold text-sm shrink-0">
                                    {s.topic.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800 truncate">{s.topic}</p>
                                    <p className="text-xs text-slate-400 font-medium">{s.student} → {s.mentor}</p>
                                </div>
                                <StatusBadge status={s.status} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Platform Health */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-extrabold text-slate-900 flex items-center gap-2"><Activity size={18} className="text-emerald-500" /> Sức khoẻ nền tảng</h3>
                        <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">Optimal</span>
                    </div>
                    <div className="p-6 space-y-5">
                        {[
                            { label: 'Tỷ lệ hoàn thành Session', value: 94, color: 'bg-emerald-500' },
                            { label: 'Điểm đánh giá trung bình', value: 92, color: 'bg-[#5A63F6]' },
                            { label: 'Người dùng hoạt động tháng', value: 78, color: 'bg-amber-500' },
                            { label: 'Tỷ lệ giữ chân người dùng', value: 85, color: 'bg-purple-500' },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                                    <span>{item.label}</span>
                                    <span className="text-slate-800">{item.value}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── SESSIONS TAB ─────────────────────────────────────────────────────────────
const SessionsTab = () => {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2"><CalendarDays size={20} className="text-[#5A63F6]" /> Tổng quan Sessions</h3>
                    <p className="text-sm text-slate-400 font-medium mt-0.5">{MOCK_SESSIONS.length} sessions được theo dõi</p>
                </div>
                <div className="flex gap-3 text-sm">
                    <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold transition-colors"><RefreshCw size={14} /> Làm mới</button>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-[#5A63F6] text-white rounded-xl font-bold hover:bg-[#4a53e6] transition-colors"><Download size={14} /> Xuất</button>
                </div>
            </div>
            {/* Summary mini-stats */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
                {[
                    { label: 'Tổng Sessions', value: MOCK_SESSIONS.length, color: 'text-slate-800' },
                    { label: 'Đang diễn ra', value: MOCK_SESSIONS.filter(s => s.status === 'upcoming').length, color: 'text-blue-600' },
                    { label: 'Hoàn thành', value: MOCK_SESSIONS.filter(s => s.status === 'completed').length, color: 'text-emerald-600' },
                ].map((item, i) => (
                    <div key={i} className="p-5 text-center">
                        <div className={`text-2xl font-extrabold ${item.color}`}>{item.value}</div>
                        <div className="text-xs text-slate-400 font-bold mt-1">{item.label}</div>
                    </div>
                ))}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[11px] font-extrabold uppercase tracking-widest">
                            <th className="px-6 py-4">Loại</th>
                            <th className="px-6 py-4">Chủ đề</th>
                            <th className="px-6 py-4">Học viên</th>
                            <th className="px-6 py-4">Mentor</th>
                            <th className="px-6 py-4">Ngày học</th>
                            <th className="px-6 py-4">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {MOCK_SESSIONS.map(s => (
                            <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    {s.type === 'path' ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-extrabold uppercase tracking-wider">Lộ trình</span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-extrabold uppercase tracking-wider">Đơn lẻ</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-[#5A63F6] shrink-0">
                                            <BookOpen size={15} />
                                        </div>
                                        <div>
                                            <span className="font-bold text-sm text-slate-800">{s.topic}</span>
                                            {s.type === 'path' && <p className="text-xs text-purple-600 font-medium line-clamp-1">{s.pathName}</p>}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-600">{s.student}</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-600">{s.mentor}</td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-bold text-slate-500">
                                        {new Date(s.date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                                    </span>
                                </td>
                                <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ─── MISSIONS TAB ─────────────────────────────────────────────────────────────
const MissionsTab = ({ tasks, addTask, removeTask }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', reward: 10 });

    const handleAddTask = (e) => {
        e.preventDefault();
        if (newTask.title.trim()) {
            addTask({ ...newTask, reward: Number(newTask.reward) });
            setNewTask({ title: '', reward: 10 });
            setIsAdding(false);
        }
    };

    const totalReward = tasks.reduce((a, t) => a + t.reward, 0);

    return (
        <div className="space-y-6">
            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-5">
                {[
                    { label: 'Tổng nhiệm vụ', value: tasks.length, icon: Award, color: 'text-[#5A63F6]', bg: 'bg-indigo-50' },
                    { label: 'Đang hoạt động', value: tasks.filter(t => !t.completed).length, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Tổng credits thưởng', value: `${totalReward} CR`, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className={`w-11 h-11 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
                                <Icon size={20} className={item.color} />
                            </div>
                            <div>
                                <div className="text-2xl font-extrabold text-slate-900">{item.value}</div>
                                <div className="text-xs font-bold text-slate-400">{item.label}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div>
                        <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2"><Award size={20} className="text-[#5A63F6]" /> Mission Manager</h3>
                        <p className="text-sm text-slate-400 font-medium mt-0.5">Tạo và quản lý nhiệm vụ onboarding cho người dùng mới</p>
                    </div>
                    <button onClick={() => setIsAdding(!isAdding)}
                        className={`shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all active:scale-95 ${isAdding ? 'bg-slate-100 text-slate-700' : 'bg-[#5A63F6] hover:bg-[#4a53e6] text-white shadow-lg shadow-[#5A63F6]/20'}`}>
                        {isAdding ? <><XCircle size={18} /> Đóng</> : <><Plus size={18} /> Nhiệm vụ mới</>}
                    </button>
                </div>

                {/* Add Form */}
                {isAdding && (
                    <div className="p-6 border-b border-slate-100 bg-indigo-50/50">
                        <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-4 items-end bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm">
                            <div className="flex-1">
                                <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wide mb-2 block">Tên nhiệm vụ</label>
                                <input type="text" required value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#5A63F6] bg-slate-50 focus:bg-white outline-none transition-all font-medium"
                                    placeholder="Ví dụ: Hoàn thiện hồ sơ 100%..." />
                            </div>
                            <div className="w-40">
                                <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wide mb-2 block">Credits thưởng</label>
                                <div className="relative">
                                    <Zap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                                    <input type="number" min="1" required value={newTask.reward} onChange={e => setNewTask({ ...newTask, reward: e.target.value })}
                                        className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-amber-500 bg-slate-50 focus:bg-white outline-none font-extrabold text-amber-600" />
                                </div>
                            </div>
                            <button type="submit" className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-2 transition-colors h-[48px] shrink-0 active:scale-95">
                                <CheckSquare size={16} /> Lưu
                            </button>
                        </form>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[11px] font-extrabold uppercase tracking-widest">
                                <th className="px-6 py-4">#</th>
                                <th className="px-6 py-4">Nhiệm vụ</th>
                                <th className="px-6 py-4">Credits thưởng</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {tasks.length > 0 ? tasks.map((task, i) => (
                                <tr key={task.id} className="hover:bg-slate-50/50 group transition-colors">
                                    <td className="px-6 py-4 text-sm font-extrabold text-slate-300 group-hover:text-[#5A63F6]">#{i + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#5A63F6]">
                                                <Award size={18} />
                                            </div>
                                            <span className="font-bold text-slate-800">{task.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 font-extrabold text-amber-600">
                                            <Zap size={14} className="fill-amber-500" /> +{task.reward} CR
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {task.completed
                                            ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-[11px] font-extrabold border border-slate-200"><CheckCircle2 size={11} /> Đã dùng</span>
                                            : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-extrabold border border-emerald-100"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Active</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 size={15} /></button>
                                            <button onClick={() => removeTask(task.id)} className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" className="py-16 text-center">
                                    <div className="text-4xl mb-3">🎯</div>
                                    <p className="font-bold text-slate-600 mb-1">Chưa có nhiệm vụ nào</p>
                                    <p className="text-sm text-slate-400">Tạo nhiệm vụ đầu tiên để onboard người dùng mới!</p>
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-5 border-t border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-400 flex justify-between items-center">
                    <span>Hiển thị {tasks.length} nhiệm vụ</span>
                    <div className="flex gap-2">
                        <button className="px-4 py-1.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 transition-colors">Trước</button>
                        <button className="px-4 py-1.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 transition-colors">Tiếp</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── LEARNING PATHS TAB ────────────────────────────────────────────────────────
const PathsTab = () => {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2"><BookOpen size={20} className="text-[#5A63F6]" /> Quản lý Lộ trình Học</h3>
                    <p className="text-sm text-slate-400 font-medium mt-0.5">Duyệt và kiểm soát chất lượng lộ trình do Mentor tạo lên</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 font-bold transition-colors">Bộ lọc</button>
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">Tạo lộ trình mẫu</button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[11px] font-extrabold uppercase tracking-widest">
                            <th className="px-6 py-4">Lộ trình</th>
                            <th className="px-6 py-4">Mentor</th>
                            <th className="px-6 py-4">Cấu trúc</th>
                            <th className="px-6 py-4">Chi phí</th>
                            <th className="px-6 py-4">Trạng thái</th>
                            <th className="px-6 py-4 text-right">Phê duyệt</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {MOCK_PATHS.map(path => (
                            <tr key={path.id} className={`hover:bg-slate-50/50 group transition-colors ${path.status === 'pending' ? 'bg-amber-50/20' : ''}`}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                                            <BookOpen size={16} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm">{path.title}</div>
                                            <div className="text-xs text-slate-400 font-medium">Tạo ngày: {path.created}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-sm text-slate-700">{path.mentor}</td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{path.modules} Modules</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="flex items-center gap-1 font-extrabold text-amber-600">
                                        <Zap size={14} className="fill-amber-500" /> {path.price} CR
                                    </span>
                                </td>
                                <td className="px-6 py-4"><StatusBadge status={path.status} /></td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors" title="Xem chi tiết lộ trình"><Eye size={15} /></button>
                                        {path.status === 'pending' && (
                                            <>
                                                <button className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-600 font-bold transition-all shadow-sm" title="Duyệt lộ trình"><CheckCircle2 size={16} /></button>
                                                <button className="p-2 rounded-xl bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 font-bold transition-all shadow-sm" title="Từ chối"><XCircle size={16} /></button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
const TABS = [
    { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
    { id: 'paths', label: 'Lộ trình', icon: BookOpen },
    { id: 'sessions', label: 'Sessions', icon: CalendarDays },
    { id: 'missions', label: 'Missions', icon: Award },
];

const AdminDash = () => {
    const { tasks, addTask, removeTask } = useStore();
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="max-w-7xl mx-auto font-sans pb-4 space-y-6 sm:space-y-8">

            {/* Header */}
            <div className="bg-slate-900 rounded-[2rem] p-8 sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none"></div>
                <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-emerald-500 rounded-full mix-blend-screen filter blur-[100px] opacity-15 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
                            <Activity size={12} className="text-emerald-400" /> System Status: Optimal
                        </div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">Admin Control Center</h1>
                        <p className="text-slate-300 mt-2">Quản lý toàn bộ nền tảng SkillSync từ đây.</p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                        <button className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl backdrop-blur-md text-sm font-bold flex items-center gap-2 border border-white/10 transition-colors">
                            <Download size={16} /> Báo cáo
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl backdrop-blur-md text-sm font-bold flex items-center gap-2 border border-white/10 transition-colors">
                            <Settings size={16} /> Cài đặt
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1.5 flex gap-1">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 ${isActive ? 'bg-[#5A63F6] text-white shadow-md shadow-[#5A63F6]/30' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
                            <Icon size={16} />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="animate-in slide-in-from-bottom-4 duration-300 fade-in" key={activeTab}>
                {activeTab === 'overview' && <OverviewTab tasks={tasks} />}
                {activeTab === 'paths' && <PathsTab />}
                {activeTab === 'sessions' && <SessionsTab />}
                {activeTab === 'missions' && <MissionsTab tasks={tasks} addTask={addTask} removeTask={removeTask} />}
            </div>
        </div>
    );
};

export default AdminDash;
