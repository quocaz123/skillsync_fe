import MissionsTab from './components/MissionsTab';

const AdminMissions = () => {
    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-slate-900">Quản lý Nhiệm vụ (Missions)</h1>
                <p className="text-sm text-slate-500 mt-1">Cấu hình các nhiệm vụ cho phép người dùng kiếm thêm credits.</p>
            </div>
            <MissionsTab />
        </div>
    );
};

export default AdminMissions;
