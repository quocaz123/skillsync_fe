import { useState, useEffect, useRef } from 'react';
import { Bell, Clock, Wallet, User, CheckCircle, WarningCircle, ChalkboardTeacher, Check } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import useNotificationSocket from '../../hooks/useNotificationSocket';
import { getMyNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../../services/notificationService';

const getIcon = (type) => {
    switch (type) {
        case 'SESSION_BOOKED':
        case 'SESSION_APPROVED':
        case 'SESSION_REJECTED':
        case 'SESSION_CANCELLED':
        case 'SESSION_COMPLETED':
        case 'SESSION_REMINDER':
            return { Icon: Clock, color: 'blue' };
        case 'CREDIT_EARNED':
        case 'CREDIT_SPENT':
            return { Icon: Wallet, color: 'green' };
        case 'SKILL_VERIFIED':
        case 'SKILL_REJECTED':
            return { Icon: ChalkboardTeacher, color: 'violet' };
        case 'MISSION_REWARDED':
            return { Icon: Wallet, color: 'amber' };
        default:
            return { Icon: Bell, color: 'slate' };
    }
};

const formatTime = (timeString) => {
    if (!timeString) return '';
    const d = new Date(timeString);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000); // in seconds
    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
};

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Setup Socket Listeners
    useNotificationSocket(
        (newNoti) => {
            setNotifications(prev => [newNoti, ...prev]);
        },
        (count) => {
            setUnreadCount(count);
        }
    );

    // Initial Load
    useEffect(() => {
        getUnreadCount().then(data => setUnreadCount(data.unreadCount || 0)).catch(() => {});
    }, []);

    useEffect(() => {
        if (isOpen && notifications.length === 0) {
            getMyNotifications().then(data => {
                if (data && data.content) {
                    setNotifications(data.content);
                }
            }).catch(() => {});
        }
    }, [isOpen, notifications.length]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRead = async (noti) => {
        if (!noti.isRead) {
            try {
                await markAsRead(noti.id);
                setNotifications(prev => prev.map(n => n.id === noti.id ? { ...n, isRead: true } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            } catch (e) {
                console.error(e);
            }
        }
        if (noti.redirectUrl) {
            navigate(noti.redirectUrl);
            setIsOpen(false);
        }
    };

    const handleReadAll = async () => {
        try {
            await markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full border border-slate-200 transition-colors relative ${isOpen ? 'bg-violet-50 text-violet-600 border-violet-200' : 'bg-white hover:bg-slate-50 text-slate-500'}`}
                title="Thông báo"
            >
                <Bell size={18} weight={isOpen ? 'fill' : 'duotone'} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center border border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                            <Bell size={16} weight="duotone" className="text-violet-500" /> Thông báo
                        </h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={handleReadAll}
                                className="text-xs text-violet-600 hover:text-violet-700 font-bold flex items-center gap-1 bg-violet-100/50 px-2 py-1 rounded-md transition-colors"
                            >
                                <Check size={14} weight="bold" /> Đã đọc tất cả
                            </button>
                        )}
                    </div>
                    <div className="max-h-[350px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">
                                <CheckCircle size={32} weight="duotone" className="mx-auto mb-2 text-slate-300" />
                                <p className="text-sm font-medium">Bạn chưa có thông báo nào</p>
                            </div>
                        ) : (
                            notifications.map(noti => {
                                const { Icon, color } = getIcon(noti.type);
                                return (
                                    <div 
                                        key={noti.id} 
                                        onClick={() => handleRead(noti)}
                                        className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative ${!noti.isRead ? 'bg-blue-50/20' : ''}`}
                                    >
                                        {!noti.isRead && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                                        )}
                                        <div className="flex gap-3">
                                            <div className={`w-9 h-9 rounded-full bg-${color}-100 flex items-center justify-center shrink-0`}>
                                                <Icon size={18} weight="fill" className={`text-${color}-600`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm ${!noti.isRead ? 'text-slate-900 font-bold' : 'text-slate-800 font-medium'}`}>{noti.title}</p>
                                                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">{noti.content}</p>
                                                <p className="text-[10px] text-slate-400 font-medium mt-1.5 flex items-center gap-1">
                                                    <Clock size={10} weight="regular" /> {formatTime(noti.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
