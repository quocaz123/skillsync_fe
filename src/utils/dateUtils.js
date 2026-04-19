/**
 * Chuỗi YYYY-MM-DD theo lịch local (tránh lệch ngày so với toISOString() UTC).
 */
export function formatDateYMDLocal(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

/** Hôm nay (00:00 local), dạng YYYY-MM-DD */
export function getTodayYMD() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return formatDateYMDLocal(d);
}

/**
 * Ngày mai (00:00 local) — có thể dùng làm min nếu chỉ cho đặt từ ngày sau.
 */
export function getTomorrowYMD() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 1);
    return formatDateYMDLocal(d);
}

/** HH:mm — giờ phút hiện tại theo máy người dùng */
export function getMinTimeHHMMNow() {
    const n = new Date();
    return `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`;
}

/**
 * Khi chọn đúng ngày hôm nay: trả về HH:mm tối thiểu cho giờ bắt đầu (sau thời điểm hiện tại).
 * Ngày khác → undefined (không giới hạn theo “đã qua trong ngày”).
 */
export function getMinTimeHHMMForDate(isoDate) {
    if (!isoDate || isoDate !== getTodayYMD()) return undefined;
    return getMinTimeHHMMNow();
}

/**
 * Các ngày từ hôm nay trở đi, đủ `count` ngày (gồm hôm nay).
 */
export function getNextDaysFromToday(count) {
    return Array.from({ length: count }, (_, i) => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + i);
        return formatDateYMDLocal(d);
    });
}

/**
 * Các ngày từ ngày mai (không gồm hôm nay).
 */
export function getNextDaysFromTomorrow(count) {
    return Array.from({ length: count }, (_, i) => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 1 + i);
        return formatDateYMDLocal(d);
    });
}
