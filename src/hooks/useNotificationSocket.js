import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useStore } from '../store';

const useNotificationSocket = (onNewNotification, onUnreadCountChange) => {
    const { isAuthenticated } = useStore();
    const [client, setClient] = useState(null);

    // Save latest callbacks to refs to avoid re-triggering useEffect
    const onNewNotificationRef = useRef(onNewNotification);
    const onUnreadCountChangeRef = useRef(onUnreadCountChange);

    useEffect(() => {
        onNewNotificationRef.current = onNewNotification;
        onUnreadCountChangeRef.current = onUnreadCountChange;
    }, [onNewNotification, onUnreadCountChange]);

    useEffect(() => {
        if (!isAuthenticated) return;

        // SockJS: có thể trỏ ws subdomain riêng (cloudflared). Mặc định cùng host với API.
        const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/skillsync';
        const wsBase = import.meta.env.VITE_WS_BASE_URL || apiBase;
        const socketUrl = `${wsBase}/ws`;

        const stompClient = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            // Reconnect every 5s if disconnected
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected to WebSocket');
                
                // Subscribe to notifications
                stompClient.subscribe('/user/queue/notifications', (msg) => {
                    if (msg.body) {
                        const notification = JSON.parse(msg.body);
                        if (onNewNotificationRef.current) {
                            onNewNotificationRef.current(notification);
                        }
                    }
                });

                // Subscribe to unread count updates
                stompClient.subscribe('/user/queue/notifications/unread-count', (msg) => {
                    if (msg.body) {
                        const count = JSON.parse(msg.body);
                        if (onUnreadCountChangeRef.current) {
                            onUnreadCountChangeRef.current(count);
                        }
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        stompClient.activate();
        setClient(stompClient);

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, [isAuthenticated]); // Only re-run if authentication status changes

    return client;
};

export default useNotificationSocket;
