import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    House, Compass, User, BookOpen, Clock, SignOut,
    Question, List, Wallet, Path, Lightning, ChalkboardTeacher, UsersThree,
    Bell, X
} from '@phosphor-icons/react';
import { useStore } from '../../store';

const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, credits, logout } = useStore();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
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

    // Bottom nav items (5 most important for mobile)
    const bottomNavItems = [
        { path: '/app', label: 'Trang chủ', icon: House },
        { path: '/app/explore', label: 'Khám phá', icon: Compass },
        { path: '/app/sessions', label: 'Buổi học', icon: Clock },
        { path: '/app/community', label: 'Cộng đồng', icon: UsersThree },
        { path: '/app/profile', label: 'Hồ sơ', icon: User },
    ];

    const routeTitle = {
        '/app': 'Dashboard',
        '/app/explore': 'Khám phá',
        '/app/sessions': 'Buổi học',
        '/app/teaching': 'Quản lý dạy',
        '/app/community': 'Cộng đồng',
        '/app/learning-path': 'Lộ trình học',
        '/app/credits': 'Lịch sử Credits',
        '/app/profile': 'Hồ sơ',
        '/app/guide': 'Hướng dẫn',
    };

    const SidebarContent = ({ onLinkClick }) => (
        <>
            {/* Logo */}
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
                        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu</p>
                    ) : (
                        <div className="h-6 mb-2" />
                    )}
                    <nav className="flex flex-col gap-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={onLinkClick}
                                    title={isCollapsed ? item.label : undefined}
                                    className={`flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'} rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-violet-100 text-violet-700 font-semibold'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                >
                                    <Icon size={22} weight={isActive ? 'duotone' : 'regular'}
                                        className={`shrink-0 ${isActive ? 'text-violet-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
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
                        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Hỗ trợ</p>
                    ) : (
                        <div className="h-6 mb-2 border-t border-slate-100 mt-2 pt-2" />
                    )}
                    <Link
                        to="/app/guide"
                        onClick={onLinkClick}
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
            <div className={`p-4 border-t border-slate-200 shrink-0 ${isCollapsed ? 'items-center flex flex-col' : ''}`}>
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
        </>
    );

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">

            {/* ── DESKTOP/TABLET SIDEBAR (hidden on mobile) ── */}
            <aside className={`hidden md:flex ${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-slate-200 flex-col transition-all duration-300 relative z-20 shrink-0`}>
                <SidebarContent onLinkClick={undefined} />
            </aside>

            {/* ── MOBILE DRAWER OVERLAY ── */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}
            <aside className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-200 flex flex-col z-40 md:hidden transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Close button on mobile drawer */}
                <button
                    className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                    onClick={() => setMobileOpen(false)}
                >
                    <X size={18} />
                </button>
                <SidebarContent onLinkClick={() => setMobileOpen(false)} />
            </aside>

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 flex flex-col overflow-y-auto w-full min-w-0 relative">
                {/* Top Header */}
                <header className="h-14 md:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 md:px-8 z-10 shrink-0 sticky top-0">
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Mobile: hamburger opens drawer | Desktop: collapse toggle */}
                        <button
                            onClick={() => { if (window.innerWidth < 768) setMobileOpen(true); else setIsCollapsed(!isCollapsed); }}
                            className="p-2 -ml-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <List size={22} weight="bold" />
                        </button>
                        <h2 className="text-base md:text-lg font-semibold text-slate-800 truncate hidden sm:block">
                            {routeTitle[location.pathname] || 'SkillSync'}
                        </h2>
                        {/* Mobile logo (only shown when drawer is closed) */}
                        <div className="flex items-center gap-2 sm:hidden">
                            <img src="/logo.png" alt="" className="w-6 h-6 object-contain" />
                            <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-violet-800">SkillSync</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-full border border-slate-200" title="Số Credit">
                            <Wallet size={16} weight="duotone" className="text-violet-600" />
                            <span className="text-sm font-bold text-slate-700">{credits || 0}</span>
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`p-2 rounded-full border border-slate-200 transition-colors relative ${showNotifications ? 'bg-violet-50 text-violet-600 border-violet-200' : 'bg-white hover:bg-slate-50 text-slate-500'}`}
                                title="Thông báo"
                            >
                                <Bell size={18} weight={showNotifications ? 'fill' : 'duotone'} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                        <h3 className="font-semibold text-slate-800">Thông báo</h3>
                                        <button className="text-xs text-violet-600 hover:text-violet-700 font-medium">Đánh dấu đã đọc</button>
                                    </div>
                                    <div className="max-h-72 overflow-y-auto">
                                        {[
                                            { Icon: Clock, color: 'blue', label: 'Buổi học sắp tới', desc: 'Có buổi học ReactJS trong 30 phút nữa.', time: 'Vừa xong' },
                                            { Icon: Wallet, color: 'green', label: 'Nhận 50 Credits', desc: 'Hoàn thành buổi dạy, nhận 50 credits.', time: '2 giờ trước' },
                                            { Icon: User, color: 'violet', label: 'Người theo dõi mới', desc: 'Trần Thị B vừa bắt đầu theo dõi bạn.', time: '1 ngày trước' },
                                        ].map(({ Icon, color, label, desc, time }) => (
                                            <div key={label} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                                                <div className="flex gap-3">
                                                    <div className={`w-8 h-8 rounded-full bg-${color}-100 flex items-center justify-center shrink-0`}>
                                                        <Icon size={16} weight="fill" className={`text-${color}-600`} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-slate-800 font-medium">{label}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{desc}</p>
                                                        <p className="text-[10px] text-slate-400 mt-1">{time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 border-t border-slate-100 text-center bg-slate-50 hover:bg-slate-100 cursor-pointer">
                                        <span className="text-xs font-medium text-violet-600">Xem tất cả thông báo</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div id="main-scroll" className="flex-1 p-3 sm:p-5 md:p-8 bg-slate-50/50 w-full pb-20 md:pb-8">
                    <Outlet />
                </div>
            </main>

            {/* ── MOBILE BOTTOM NAV BAR ── */}
            <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-slate-200 flex z-30 safe-area-bottom">
                {bottomNavItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${isActive ? 'text-violet-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Icon size={22} weight={isActive ? 'duotone' : 'regular'} />
                            <span className={`text-[10px] font-semibold ${isActive ? 'text-violet-600' : 'text-slate-400'}`}>
                                {item.label}
                            </span>
                            {isActive && <div className="absolute bottom-0 w-8 h-0.5 bg-violet-500 rounded-full" />}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default MainLayout;
