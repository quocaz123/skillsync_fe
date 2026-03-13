import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    House, Compass, User, BookOpen, Clock, SignOut,
    Question, List, Wallet, Path, Lightning, ChalkboardTeacher, UsersThree,
    Bell
} from '@phosphor-icons/react';
import { useStore } from '../../store';

const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, credits, logout } = useStore();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/app', label: 'Trang chủ', icon: House },
        { path: '/app/explore', label: 'Khám phá', icon: Compass },
        { path: '/app/sessions', label: 'Buổi học', icon: Clock },
        { path: '/app/teaching', label: 'Quản lý dạy', icon: ChalkboardTeacher },
        { path: '/app/community', label: 'Cộng đồng', icon: UsersThree },
        { path: '/app/learning-path', label: 'Lộ trình học', icon: Path },
        { path: '/app/credits', label: 'Lịch sử credits', icon: Wallet },
        { path: '/app/profile', label: 'Hồ sơ', icon: User },
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar Navigation */}
            <aside
                className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 relative z-20`}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center px-4 border-b border-slate-200 shrink-0">
                    <div className="flex items-center gap-3 overflow-hidden ml-1">
                        <img src="/logo.png" alt="SkillSync logo" className="w-8 h-8 object-contain shrink-0" />
                        {!isCollapsed && (
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-violet-800 shrink-0 whitespace-nowrap animate-in fade-in duration-300">
                                SkillSync
                            </span>
                        )}
                    </div>
                </div>

                {/* Nav Links */}
                <div className="p-4 flex-1 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
                    <div className="mb-4">
                        {!isCollapsed ? (
                            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 animate-in fade-in duration-300">Menu</p>
                        ) : (
                            <div className="h-6 mb-2"></div>
                        )}
                        <nav className="flex flex-col gap-1">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/app');
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        title={isCollapsed ? item.label : undefined}
                                        className={`flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'} rounded-xl transition-all duration-200 group ${isActive
                                            ? 'bg-violet-100 text-violet-700 font-semibold'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                            }`}
                                    >
                                        <Icon
                                            size={22}
                                            weight={isActive ? 'duotone' : 'regular'}
                                            className={`shrink-0 ${isActive ? 'text-violet-600' : 'text-slate-400 group-hover:text-slate-600'}`}
                                        />
                                        {!isCollapsed && (
                                            <span className="shrink-0 whitespace-nowrap animate-in fade-in duration-200">{item.label}</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="mt-4">
                        {!isCollapsed ? (
                            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 animate-in fade-in duration-300">Hỗ trợ</p>
                        ) : (
                            <div className="h-6 mb-2 border-t border-slate-100 mt-2 pt-2"></div>
                        )}
                        <Link
                            to="/app/guide"
                            title={isCollapsed ? 'Hướng dẫn tham gia' : undefined}
                            className={`flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'} rounded-xl bg-orange-100 hover:bg-orange-200 transition-colors duration-200 group border border-orange-200/50`}
                        >
                            <Question size={22} weight="duotone" className="shrink-0 text-orange-500" />
                            {!isCollapsed && (
                                <span className="shrink-0 whitespace-nowrap text-orange-700 font-semibold animate-in fade-in duration-200">Hướng dẫn tham gia</span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* User Mini Profile & Logout */}
                <div className={`p-4 border-t border-slate-200 shrink-0 transition-all ${isCollapsed ? 'items-center flex flex-col' : ''}`}>
                    <div className={`flex items-center gap-3 mb-4 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
                        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 font-bold border border-violet-200 uppercase shrink-0 text-sm">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0 animate-in fade-in duration-300">
                                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Guest'}</p>
                                <p className="text-xs text-slate-500 truncate flex items-center gap-1 font-semibold">
                                    <Lightning size={12} weight="fill" className="text-amber-400" />
                                    {credits} Credits
                                </p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        title={isCollapsed ? 'Logout' : undefined}
                        className={`w-full flex items-center justify-center gap-2 p-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 hover:text-slate-900 transition-colors ${isCollapsed ? '' : 'px-4 py-2'}`}
                    >
                        <SignOut size={isCollapsed ? 18 : 16} weight="duotone" />
                        {!isCollapsed && <span className="animate-in fade-in duration-200">Đăng xuất</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-y-auto w-full relative">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 shrink-0 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <List size={24} weight="bold" />
                        </button>
                        <h2 className="text-lg font-semibold text-slate-800 capitalize hidden sm:block">
                            {location.pathname === '/app' || location.pathname === '/'
                                ? 'Dashboard'
                                : location.pathname.split('/').pop().replace('-', ' ')}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200" title="Số Credit của bạn">
                            <Wallet size={18} weight="duotone" className="text-violet-600" />
                            <span className="text-sm font-bold text-slate-700">{credits || 0}</span>
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`p-2 rounded-full border border-slate-200 transition-colors relative ${showNotifications ? 'bg-violet-50 text-violet-600 border-violet-200' : 'bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700'}`}
                                title="Thông báo"
                            >
                                <Bell size={20} weight={showNotifications ? "fill" : "duotone"} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>

                            {/* Notification Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                        <h3 className="font-semibold text-slate-800">Thông báo</h3>
                                        <button className="text-xs text-violet-600 hover:text-violet-700 font-medium">Đánh dấu đã đọc</button>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {/* Sample Notifications - In real app, fetch these from state/API */}
                                        <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                                    <Clock size={16} weight="fill" className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-800 font-medium">Buổi học sắp tới</p>
                                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">Bạn có buổi học ReactJS Căn bản với Nguyễn Văn A trong 30 phút nữa.</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">Vừa xong</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                                    <Wallet size={16} weight="fill" className="text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-800 font-medium">Nhận 50 Credits</p>
                                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">Bạn đã hoàn thành buổi dạy và nhận được 50 credits từ hệ thống.</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">2 giờ trước</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer opacity-70">
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                                                    <User size={16} weight="fill" className="text-violet-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-800 font-medium">Người theo dõi mới</p>
                                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">Trần Thị B vừa bắt đầu theo dõi bạn.</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">1 ngày trước</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 border-t border-slate-100 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                                        <span className="text-xs font-medium text-violet-600">Xem tất cả thông báo</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div id="main-scroll" className="flex-1 p-4 sm:p-8 bg-slate-50/50 w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
