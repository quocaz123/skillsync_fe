import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    SquaresFour, CalendarBlank, CurrencyCircleDollar,
    Users, BookOpen, Flag, ChartBar, GearSix,
    List, SignOut, ShieldCheck
} from '@phosphor-icons/react';
import { useStore } from '../../store';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useStore();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navGroups = [
        {
            label: 'Tổng quan',
            items: [
                { path: '/admin', label: 'Dashboard', icon: SquaresFour, exact: true },
                { path: '/admin/reports', label: 'Báo cáo', icon: Flag },
                { path: '/admin/sessions', label: 'Sessions', icon: CalendarBlank },
                { path: '/admin/credits', label: 'Credits & GD', icon: CurrencyCircleDollar },
            ],
        },
        {
            label: 'Người dùng',
            items: [
                { path: '/admin/users', label: 'Quản lý Người dùng', icon: Users },
                { path: '/admin/paths', label: 'Lộ trình Học', icon: BookOpen },
            ],
        },
        {
            label: 'Hệ thống',
            items: [
                { path: '/admin/system', label: 'Hệ thống', icon: ChartBar },
                { path: '/admin/settings', label: 'Cài đặt', icon: GearSix },
            ],
        },
    ];

    const headerTitles = {
        '/admin': 'Tổng quan Hệ thống',
        '/admin/reports': 'Xử lý Báo cáo',
        '/admin/sessions': 'Quản lý Sessions',
        '/admin/credits': 'Credits & Giao dịch',
        '/admin/users': 'Quản lý Người dùng',
        '/admin/paths': 'Quản lý Lộ trình Học',
        '/admin/system': 'Sức khoẻ Hệ thống',
        '/admin/settings': 'Cài đặt Hệ thống',
    };

    // Flatten navGroups to get all navigation items
    const navItems = navGroups.flatMap(group => group.items);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Admin Sidebar - Same style as MainLayout */}
            <aside
                className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 relative z-20`}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center px-4 border-b border-slate-200 shrink-0">
                    <div className="flex items-center gap-3 overflow-hidden ml-1">
                        <img src="/logo.png" alt="SkillSync logo" className="w-8 h-8 object-contain shrink-0" />
                        {!isCollapsed && (
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-violet-800 shrink-0 whitespace-nowrap animate-in fade-in duration-300">
                                SkillSync Admin
                            </span>
                        )}
                    </div>
                </div>

                {/* Nav Links */}
                <div className="p-4 flex-1 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
                    {navGroups.map((group) => (
                        <div key={group.label} className="mb-4">
                            {!isCollapsed ? (
                                <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 animate-in fade-in duration-300">{group.label}</p>
                            ) : (
                                <div className="h-6 mb-2"></div>
                            )}
                            <nav className="flex flex-col gap-1">
                                {group.items.map((item) => {
                                    const isActive = item.exact
                                        ? location.pathname === item.path
                                        : location.pathname === item.path;
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
                    ))}
                </div>

                {/* Admin Mini Profile & Logout */}
                <div className={`p-4 border-t border-slate-200 shrink-0 transition-all ${isCollapsed ? 'items-center flex flex-col' : ''}`}>
                    <div className={`flex items-center gap-3 mb-4 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
                        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 font-bold border border-rose-200 shrink-0">
                            <ShieldCheck size={20} weight="duotone" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0 animate-in fade-in duration-300">
                                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Super Admin'}</p>
                                <p className="text-xs text-slate-500 truncate font-medium">Toàn quyền</p>
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
                            {headerTitles[location.pathname] || 'Admin'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                            SkillSync Admin v1.0
                        </span>
                    </div>
                </header>

                {/* Page Content */}
                <div id="admin-main-scroll" className="flex-1 p-4 sm:p-8 bg-slate-50/50 w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;

