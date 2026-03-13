import { useNavigate } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';

const JoinSessionGuidePage = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto font-sans">
            {/* Header */}
            <div className="text-center space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                    Join a Learning Session
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    A complete guide to getting started with your video learning sessions on SkillSync
                </p>
            </div>

            {/* Visual Flow Diagram */}
            <div className="p-8 border border-slate-200 rounded-2xl bg-gradient-to-br from-primary-50 to-amber-50 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                    Session Flow Diagram
                </h2>

                <div className="space-y-4">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center justify-between md:flex-row gap-2">
                        <div className="flex-1 w-full p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <p className="font-semibold text-slate-900">1. View Learning Plans</p>
                            <p className="text-sm text-slate-500 mt-1">
                                Go to "Explore" and select a plan
                            </p>
                        </div>
                        <div className="mx-4 text-primary-500">
                            <ArrowDown size={24} className="hidden md:block" />
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center justify-between md:flex-row gap-2">
                        <div className="flex-1 w-full p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <p className="font-semibold text-slate-900">2. Find Scheduled Session</p>
                            <p className="text-sm text-slate-500 mt-1">
                                Look for sessions with "Scheduled" status
                            </p>
                        </div>
                        <div className="mx-4 text-primary-500">
                            <ArrowDown size={24} className="hidden md:block" />
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center justify-between md:flex-row gap-2">
                        <div className="flex-1 w-full p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <p className="font-semibold text-slate-900">3. Click "Join Session"</p>
                            <p className="text-sm text-slate-500 mt-1">
                                A modal will appear with device checks
                            </p>
                        </div>
                        <div className="mx-4 text-primary-500">
                            <ArrowDown size={24} className="hidden md:block" />
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex flex-col items-center justify-between md:flex-row gap-2">
                        <div className="flex-1 w-full p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <p className="font-semibold text-slate-900">4. Verify Camera & Microphone</p>
                            <p className="text-sm text-slate-500 mt-1">
                                Toggle your devices on/off as needed
                            </p>
                        </div>
                        <div className="mx-4 text-primary-500">
                            <ArrowDown size={24} className="hidden md:block" />
                        </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex flex-col items-center justify-between md:flex-row gap-2">
                        <div className="flex-1 w-full p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <p className="font-semibold text-slate-900">5. Enter Video Session</p>
                            <p className="text-sm text-slate-500 mt-1">
                                You're now in the video room with your teacher
                            </p>
                        </div>
                        <div className="mx-4 text-primary-500">
                            <ArrowDown size={24} className="hidden md:block" />
                        </div>
                    </div>

                    {/* Step 6 */}
                    <div className="flex flex-col items-center justify-between md:flex-row gap-2">
                        <div className="flex-1 w-full p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <p className="font-semibold text-slate-900">6. Learn & Interact</p>
                            <p className="text-sm text-slate-500 mt-1">
                                Use chat, screen share, and ask questions
                            </p>
                        </div>
                        <div className="mx-4 text-primary-500">
                            <ArrowDown size={24} className="hidden md:block" />
                        </div>
                    </div>

                    {/* Step 7 */}
                    <div className="flex flex-col items-center justify-between md:flex-row gap-2">
                        <div className="flex-1 w-full p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <p className="font-semibold text-slate-900">7. End Session</p>
                            <p className="text-sm text-slate-500 mt-1">
                                Click "End Session" when finished
                            </p>
                        </div>
                        <div className="mx-4 text-primary-500">
                            <ArrowDown size={24} className="hidden md:block" />
                        </div>
                    </div>

                    {/* Step 8 */}
                    <div className="flex flex-col items-center justify-between md:flex-row gap-2">
                        <div className="flex-1 w-full p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <p className="font-semibold text-slate-900">8. Confirm & Review</p>
                            <p className="text-sm text-slate-500 mt-1">
                                Complete session and leave a review
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Common Issues */}
            <div className="p-8 border border-slate-200 rounded-2xl bg-white shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Common Issues & Solutions</h2>
                <div className="space-y-6">
                    <div className="border-l-4 border-primary-500 pl-4">
                        <h3 className="font-semibold text-slate-900">Camera/Mic not working?</h3>
                        <p className="text-sm text-slate-600 mt-1">
                            Check browser permissions and allow SkillSync to access your devices. Refresh the page if needed.
                        </p>
                    </div>
                    <div className="border-l-4 border-primary-500 pl-4">
                        <h3 className="font-semibold text-slate-900">Poor connection?</h3>
                        <p className="text-sm text-slate-600 mt-1">
                            Ensure stable WiFi, close background apps, and check your internet speed.
                        </p>
                    </div>
                    <div className="border-l-4 border-primary-500 pl-4">
                        <h3 className="font-semibold text-slate-900">Can't see teacher?</h3>
                        <p className="text-sm text-slate-600 mt-1">
                            Make sure both cameras are enabled and wait for the teacher to connect.
                        </p>
                    </div>
                    <div className="border-l-4 border-primary-500 pl-4">
                        <h3 className="font-semibold text-slate-900">Session got disconnected?</h3>
                        <p className="text-sm text-slate-600 mt-1">
                            You can rejoin the session. Contact your teacher if you have connection issues.
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    className="w-full py-4 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </button>
                <button
                    className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-sm shadow-primary-500/30 transition-colors"
                    onClick={() => navigate('/app/sessions')}
                >
                    Go to My Sessions
                </button>
            </div>
        </div>
    );
}

export default JoinSessionGuidePage;
