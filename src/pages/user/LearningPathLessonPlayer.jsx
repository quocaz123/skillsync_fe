// import { Link, useParams, useLocation } from 'react-router-dom';
// import { Play, ChevronLeft } from 'lucide-react';

// /** Trình phát bài học — placeholder; nhúng player thật khi có URL video từ API. */
// export default function LearningPathLessonPlayer() {
//     const { pathId, lessonId } = useParams();
//     const location = useLocation();
//     const title = location.state?.lessonTitle ?? 'Bài học';
//     const pathTitle = location.state?.pathTitle ?? '';

//     return (
//         <div className="max-w-4xl mx-auto font-sans pb-16 px-4">
//             <Link
//                 to={`/app/learning-path/study/${pathId}`}
//                 className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 mb-6"
//             >
//                 <ChevronLeft size={18} /> Quay lại lộ trình
//             </Link>
//             <div className="rounded-2xl border border-slate-200 bg-slate-900 aspect-video flex items-center justify-center text-white mb-4">
//                 <div className="text-center px-4">
//                     <Play size={48} className="mx-auto mb-2 opacity-80" />
//                     <p className="text-sm font-medium">Video bài học (demo)</p>
//                     <p className="text-xs text-slate-400 mt-1">{lessonId}</p>
//                 </div>
//             </div>
//             <h1 className="text-xl font-extrabold text-slate-900">{title}</h1>
//             {pathTitle && <p className="text-sm text-slate-500 mt-1">{pathTitle}</p>}
//         </div>
//     );
// }
