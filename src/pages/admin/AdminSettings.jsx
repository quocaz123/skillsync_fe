import { useState } from 'react';
import { Settings, Zap, Shield, Bell, ToggleLeft, ToggleRight, Save } from 'lucide-react';

const Toggle = ({ value, onChange }) => (
    <button onClick={() => onChange(!value)} className="transition-all duration-200">
        {value
            ? <ToggleRight size={32} className="text-[#5A63F6]" />
            : <ToggleLeft size={32} className="text-slate-300" />
        }
    </button>
);

const AdminSettings = () => {
    const [creditConfig, setCreditConfig] = useState({
        ratePerHour: 50,
        pathDiscount: 15,
        missionReward: 20,
        refundBuffer: 10,
    });

    const [rules, setRules] = useState({
        minTrustToMentor: 60,
        autoban_reports: 5,
        maxDailySession: 8,
        minRatingToVerify: 4.0,
    });

    const [features, setFeatures] = useState({
        allowPathCreation: true,
        mentorVerification: true,
        communityPosts: true,
        creditTansfer: false,
        autoReward: true,
    });

    const featureLabels = {
        allowPathCreation: 'Cho phép Mentor tạo Lộ trình',
        mentorVerification: 'Kích hoạt xác thực Mentor',
        communityPosts: 'Bật tính năng Cộng đồng',
        creditTansfer: 'Cho phép chuyển Credits giữa người dùng',
        autoReward: 'Tự động trao phần thưởng Mission',
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Settings size={22} className="text-slate-600" /> Cài đặt Hệ thống
                </h1>
                <p className="text-sm text-slate-400 font-medium mt-1">Cấu hình quy tắc hoạt động và tính năng của nền tảng</p>
            </div>

            {/* Credit Config */}
            <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                    <Zap size={18} className="text-amber-500" />
                    <h3 className="font-extrabold text-slate-900">Cấu hình Credits</h3>
                </div>
                <div className="p-6 grid grid-cols-2 gap-5">
                    {[
                        { key: 'ratePerHour', label: 'Credits / giờ học', unit: 'CR/h', hint: 'Giá cơ bản cho 1 giờ session đơn lẻ' },
                        { key: 'pathDiscount', label: 'Giảm giá Lộ trình', unit: '%', hint: 'Giảm % khi mua cả lộ trình so với từng session' },
                        { key: 'missionReward', label: 'Phần thưởng Mission', unit: 'CR', hint: 'Credits tặng khi hoàn thành nhiệm vụ cơ bản' },
                        { key: 'refundBuffer', label: 'Thời gian hoàn tiền', unit: 'phút', hint: 'Cho phép hủy session trong vòng N phút sau khi đặt' },
                    ].map(f => (
                        <div key={f.key} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">{f.label}</label>
                            <p className="text-xs text-slate-400 mt-0.5 mb-3">{f.hint}</p>
                            <div className="flex items-center gap-2">
                                <input type="number" value={creditConfig[f.key]}
                                    onChange={e => setCreditConfig(prev => ({ ...prev, [f.key]: Number(e.target.value) }))}
                                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-[#5A63F6] focus:ring-1 focus:ring-[#5A63F6]/20"
                                />
                                <span className="text-xs font-bold text-slate-500 shrink-0">{f.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Platform Rules */}
            <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                    <Shield size={18} className="text-[#5A63F6]" />
                    <h3 className="font-extrabold text-slate-900">Quy tắc Nền tảng</h3>
                </div>
                <div className="p-6 grid grid-cols-2 gap-5">
                    {[
                        { key: 'minTrustToMentor', label: 'Trust Score tối thiểu để dạy', unit: 'điểm', hint: 'Người dùng cần đạt Trust Score này để đăng ký làm Mentor' },
                        { key: 'autoban_reports', label: 'Số báo cáo → Auto-ban', unit: 'lần', hint: 'Tài khoản bị auto-ban khi nhận đủ số báo cáo này' },
                        { key: 'maxDailySession', label: 'Số session tối đa / ngày', unit: 'sessions', hint: 'Giới hạn số buổi học mỗi người dùng có thể đặt trong ngày' },
                        { key: 'minRatingToVerify', label: 'Đánh giá tối thiểu để giữ Verified', unit: '/ 5.0', hint: 'Mentor bị thu hồi chứng nhận nếu rating trung bình dưới mức này' },
                    ].map(f => (
                        <div key={f.key} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">{f.label}</label>
                            <p className="text-xs text-slate-400 mt-0.5 mb-3">{f.hint}</p>
                            <div className="flex items-center gap-2">
                                <input type="number" step="0.1" value={rules[f.key]}
                                    onChange={e => setRules(prev => ({ ...prev, [f.key]: Number(e.target.value) }))}
                                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-[#5A63F6] focus:ring-1 focus:ring-[#5A63F6]/20"
                                />
                                <span className="text-xs font-bold text-slate-500 shrink-0">{f.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feature Toggles */}
            <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                    <Bell size={18} className="text-emerald-500" />
                    <h3 className="font-extrabold text-slate-900">Bật / Tắt Tính năng</h3>
                </div>
                <div className="divide-y divide-slate-50">
                    {Object.entries(features).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors">
                            <div>
                                <p className="text-sm font-bold text-slate-800">{featureLabels[key]}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{val ? 'Đang bật' : 'Đang tắt'}</p>
                            </div>
                            <Toggle value={val} onChange={(v) => setFeatures(prev => ({ ...prev, [key]: v }))} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Save */}
            <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-3 bg-[#5A63F6] text-white rounded-2xl font-bold hover:bg-[#4a53e6] transition-colors shadow-lg shadow-indigo-200">
                    <Save size={16} /> Lưu cài đặt
                </button>
            </div>
        </div>
    );
};

export default AdminSettings;
