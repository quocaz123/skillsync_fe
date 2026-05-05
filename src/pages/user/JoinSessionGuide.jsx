import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
    Compass, CalendarCheck, VideoCamera, Star,
    GraduationCap, Lightning, ShieldCheck, Wallet,
    CaretDown, CaretUp, ArrowRight, Question,
    MagnifyingGlass, ChalkboardTeacher
} from '@phosphor-icons/react';

const FaqItem = ({ q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:border-violet-300 transition-colors">
            <button 
                onClick={() => setOpen(!open)}
                className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none"
            >
                <span className="font-extrabold text-slate-800">{q}</span>
                {open ? <CaretUp size={18} className="text-violet-500" /> : <CaretDown size={18} className="text-slate-400" />}
            </button>
            {open && (
                <div className="px-5 pb-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3 bg-slate-50">
                    {a}
                </div>
            )}
        </div>
    );
};

const JoinSessionGuidePage = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-5xl mx-auto space-y-8 font-sans pb-12">
            {/* Header Hero */}
            <div className="relative bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 opacity-90" />
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-screen filter blur-[80px] opacity-70" />
                <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-fuchsia-400 rounded-full mix-blend-screen filter blur-[60px] opacity-60" />
                
                <div className="relative z-10 p-10 md:p-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md mb-6 shadow-xl border border-white/30">
                        <Compass size={32} weight="duotone" className="text-white" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight" style={{ textShadow: "0 4px 15px rgba(0, 0, 0, 0.3)" }}>
                        Hướng dẫn sử dụng SkillSync
                    </h1>
                    <p className="text-lg text-white/90 max-w-2xl mx-auto font-medium" style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)" }}>
                        Nền tảng trao đổi kỹ năng toàn diện. Dù bạn muốn học hỏi hay chia sẻ kiến thức, hành trình của bạn bắt đầu tại đây.
                    </p>
                </div>
            </div>

            {/* Dành cho Learner */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                        <GraduationCap size={26} weight="duotone" className="text-sky-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Dành cho Học viên (Learner)</h2>
                        <p className="text-sm text-slate-500 font-medium">4 bước đơn giản để bắt đầu học tập</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                    <div className="hidden md:block absolute top-6 left-10 right-10 h-0.5 bg-slate-100 -z-10" />
                    
                    {[
                        { 
                            step: 1, 
                            title: 'Khám phá', 
                            desc: 'Tìm kiếm kỹ năng hoặc nhờ AI tư vấn Mentor phù hợp nhất với mục tiêu của bạn.',
                            icon: MagnifyingGlass,
                            color: 'text-violet-500',
                            bg: 'bg-violet-100'
                        },
                        { 
                            step: 2, 
                            title: 'Đặt lịch', 
                            desc: 'Chọn khung giờ trống của Mentor và thanh toán bằng Credits.',
                            icon: CalendarCheck,
                            color: 'text-sky-500',
                            bg: 'bg-sky-100'
                        },
                        { 
                            step: 3, 
                            title: 'Học 1-1', 
                            desc: 'Tham gia phòng học Video Call tương tác trực tiếp với Mentor.',
                            icon: VideoCamera,
                            color: 'text-emerald-500',
                            bg: 'bg-emerald-100'
                        },
                        { 
                            step: 4, 
                            title: 'Đánh giá', 
                            desc: 'Hoàn thành buổi học, để lại nhận xét và tích luỹ điểm uy tín.',
                            icon: Star,
                            color: 'text-amber-500',
                            bg: 'bg-amber-100'
                        }
                    ].map((s) => (
                        <div key={s.step} className="flex flex-col relative bg-white md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none border border-slate-100 md:border-none shadow-sm md:shadow-none">
                            <div className={`w-12 h-12 rounded-full ${s.bg} border-4 border-white flex items-center justify-center font-black ${s.color} text-lg mb-4 shadow-sm mx-auto md:mx-0`}>
                                {s.step}
                            </div>
                            <h3 className="text-base font-extrabold text-slate-800 mb-2 md:text-left text-center flex items-center justify-center md:justify-start gap-1.5">
                                <s.icon size={18} weight="bold" className={s.color} /> {s.title}
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed md:text-left text-center">
                                {s.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dành cho Mentor */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                        <ChalkboardTeacher size={26} weight="duotone" className="text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Dành cho Người hướng dẫn (Mentor)</h2>
                        <p className="text-sm text-slate-500 font-medium">Chia sẻ kiến thức & kiếm Credits</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex gap-4 hover:border-amber-200 hover:bg-amber-50/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                            <ShieldCheck size={20} weight="duotone" className="text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-slate-800 mb-1">1. Đăng ký Kỹ năng</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">Cập nhật hồ sơ, thêm kỹ năng bạn muốn dạy kèm theo bằng chứng (chứng chỉ, portfolio) để hệ thống phê duyệt.</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex gap-4 hover:border-amber-200 hover:bg-amber-50/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                            <Wallet size={20} weight="duotone" className="text-violet-500" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-slate-800 mb-1">2. Thiết lập Lịch & Nhận Credits</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">Mở các khung giờ rảnh rỗi. Khi học viên hoàn thành buổi học, Credits sẽ tự động cộng vào ví của bạn.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                        <Question size={26} weight="duotone" className="text-rose-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Câu hỏi thường gặp</h2>
                        <p className="text-sm text-slate-500 font-medium">Những điều bạn cần biết</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <FaqItem 
                        q="Credits là gì và làm sao để có được?" 
                        a={
                            <div className="space-y-3">
                                <p><strong>Credits</strong> là đơn vị tiền tệ nội bộ của SkillSync. Bạn dùng Credits để đặt lịch học, và nhận Credits khi dạy người khác.</p>
                                <div className="bg-violet-50 p-3 rounded-xl border border-violet-100">
                                    <p className="text-violet-700 font-semibold text-sm">
                                        💡 <strong>Đặc biệt dành cho Mentor & Người đóng góp:</strong><br/>
                                        Credits tích luỹ không chỉ dùng để học mà sắp tới sẽ được áp dụng <strong>cơ chế quy đổi thành tiền thưởng thực tế</strong>. Càng đóng góp nhiều, bạn càng có cơ hội tạo thêm thu nhập hấp dẫn!
                                    </p>
                                </div>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Làm nhiệm vụ hàng ngày (Đăng nhập, học tập).</li>
                                    <li>Đóng góp trong diễn đàn Cộng đồng (được vote up).</li>
                                    <li>Dạy học viên khác.</li>
                                    <li>Mua trực tiếp tại trang Ví Credits.</li>
                                </ul>
                            </div>
                        }
                    />
                    <FaqItem 
                        q="Làm sao để hủy buổi học?" 
                        a="Bạn có thể hủy buổi học trong phần 'Buổi học' ít nhất 24 giờ trước khi bắt đầu để được hoàn lại 100% Credits. Nếu hủy quá sát giờ, bạn có thể bị trừ một phần Credits tuỳ theo chính sách."
                    />
                    <FaqItem 
                        q="Điểm Uy tín (Trust Score) hoạt động thế nào?" 
                        a="Hệ thống dựa trên đánh giá của người học/người dạy và mức độ hoàn thành các buổi học để tính điểm Uy tín. Điểm càng cao, hồ sơ của bạn càng được ưu tiên hiển thị và AI đề xuất nhiều hơn."
                    />
                    <FaqItem 
                        q="Xử lý thế nào nếu gặp sự cố trong phòng học Video?" 
                        a="Hãy kiểm tra quyền truy cập Camera/Micro trên trình duyệt. Bạn có thể F5 (tải lại trang) để vào lại phòng. Nếu vẫn gặp sự cố, hãy chat với Mentor/Learner qua nền tảng và báo cáo lỗi cho hệ thống."
                    />
                </div>
            </div>

            {/* Call to action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="w-full sm:w-auto px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                    Quay lại
                </button>
                <button 
                    onClick={() => navigate('/app/explore')}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold rounded-xl shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95 transition-all"
                >
                    Khám phá ngay <ArrowRight size={18} weight="bold" />
                </button>
            </div>
        </div>
    );
};

export default JoinSessionGuidePage;
