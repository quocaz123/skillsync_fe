import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Users,
    Video,
    Award,
    TrendingUp,
    Heart,
    Zap,
    Star,
    CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
    const [hoveredFeature, setHoveredFeature] = useState(null)

    const features = [
        {
            icon: Users,
            title: 'Peer-to-Peer Learning',
            description: 'Connect directly with skilled individuals and learn at your own pace with personalized sessions.'
        },
        {
            icon: Video,
            title: 'Live Video Sessions',
            description: 'Interactive one-on-one video sessions with real-time chat, screen sharing, and instant feedback.'
        },
        {
            icon: Award,
            title: 'Verified Teachers',
            description: 'All teachers are verified with ratings and reviews from the community for your confidence.'
        },
        {
            icon: Zap,
            title: 'Credit System',
            description: 'Flexible credit-based payment system - earn credits by teaching, spend them on learning.'
        },
        {
            icon: TrendingUp,
            title: 'Track Progress',
            description: 'Visual progress tracking, learning milestones, and achievement badges to stay motivated.'
        },
        {
            icon: Heart,
            title: 'Community Support',
            description: 'Join discussion groups, share resources, and get support from a thriving learning community.'
        }
    ]

    const stats = [
        { number: '50K+', label: 'Active Learners' },
        { number: '10K+', label: 'Expert Teachers' },
        { number: '200+', label: 'Skills Available' },
        { number: '4.8★', label: 'Average Rating' }
    ]

    const testimonials = [
        {
            name: 'Alex Johnson',
            role: 'Student',
            content: 'I learned web development from John in just 3 months. The one-on-one sessions were perfect!',
            avatar: '👨‍💼'
        },
        {
            name: 'Sarah Chen',
            role: 'Teacher',
            content: 'Teaching on SkillSync has been rewarding. I earn credits while helping others grow their skills.',
            avatar: '👩‍💻'
        },
        {
            name: 'Mike Davis',
            role: 'Student',
            content: 'The credit system is fair and the teacher quality is consistently high. Highly recommended!',
            avatar: '👨‍🎓'
        }
    ]

    return (
        <div className="min-h-screen bg-white text-slate-900">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="SkillSync logo" className="w-8 h-8 object-contain" />
                        <span className="font-bold text-xl text-slate-900 hidden sm:inline">SkillSync</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium hover:text-primary-600 transition-colors">Features</a>
                        <a href="#how-it-works" className="text-sm font-medium hover:text-primary-600 transition-colors">How it Works</a>
                        <a href="#testimonials" className="text-sm font-medium hover:text-primary-600 transition-colors">Testimonials</a>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link to="/login" className="px-4 py-2 text-sm font-medium border border-slate-200 text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
                            Log In
                        </Link>
                        <Link to="/login" className="px-4 py-2 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-md hidden sm:flex transition-colors">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32 sm:pt-32 sm:pb-40">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-white to-amber-50 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div className="space-y-4 animate-slide-up-fade">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200">
                                    <Star size={16} className="text-primary-600" />
                                    <span className="text-sm font-medium text-primary-600">Join 50,000+ learners worldwide</span>
                                </div>

                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                                    Learn Skills from <span className="text-primary-600">Real Experts</span>
                                </h1>

                                <p className="text-lg text-slate-500 max-w-md">
                                    Connect with verified teachers, learn at your own pace, and master new skills through personalized video sessions.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up-fade delay-100">
                                <Link to="/login" className="w-full sm:w-auto">
                                    <button className="flex items-center justify-center w-full bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-base py-3 px-6 transition-colors">
                                        Start Learning Today <ArrowRight size={18} className="ml-2" />
                                    </button>
                                </Link>
                                <button className="w-full sm:w-auto border border-slate-300 font-medium text-slate-900 hover:bg-slate-100 rounded-lg text-base py-3 px-6 transition-colors">
                                    Watch Demo
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 pt-8 animate-slide-up-fade delay-200">
                                {stats.map((stat, idx) => (
                                    <div key={idx}>
                                        <p className="text-2xl sm:text-3xl font-bold text-primary-600">{stat.number}</p>
                                        <p className="text-sm text-slate-500">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Visual - More Lively & Animated */}
                        <div className="relative h-96 sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl animate-scale-in delay-300 group">
                            {/* Animated Background Mesh/Gradients */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-fuchsia-50 opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                            <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl animate-glow-pulse" />
                            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-glow-pulse delay-700" />

                            {/* Center Hero Icon/Element */}
                            <div className="absolute inset-0 flex items-center justify-center animate-wiggle-float">
                                <div className="relative">
                                    {/* Sub-layers for the main icon */}
                                    <div className="absolute inset-0 bg-primary-400/20 blur-2xl rounded-full scale-150 animate-glow-pulse"></div>
                                    <div className="text-8xl md:text-9xl drop-shadow-2xl relative z-10 transition-transform duration-500 hover:scale-110 cursor-pointer">
                                        🎓
                                    </div>
                                    <div className="absolute -right-4 top-0 text-3xl animate-float-fast delay-200">✨</div>
                                    <div className="absolute -left-6 bottom-4 text-4xl animate-float-fast delay-500">🚀</div>
                                </div>
                            </div>

                            {/* Floating Card 1: Live Session */}
                            <div className="absolute top-8 right-4 md:right-8 p-4 bg-white/90 backdrop-blur-md border border-white rounded-2xl shadow-xl max-w-xs animate-slide-up-fade delay-500 hover:-translate-y-2 hover:shadow-2xl transition-all cursor-pointer z-20">
                                <div className="animate-float-delayed flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl shadow-sm border border-white">👩‍🏫</div>
                                        <span className="w-3 h-3 rounded-full bg-emerald-500 absolute bottom-0 right-0 border-2 border-white animate-pulse"></span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Live Session</p>
                                        <p className="text-xs font-medium text-slate-500 mt-0.5">In 5 mins with Sarah</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Card 2: Skill Progression */}
                            <div className="absolute bottom-12 left-4 md:left-8 p-4 bg-white/90 backdrop-blur-md border border-white rounded-2xl shadow-xl max-w-xs animate-slide-up-fade delay-700 hover:-translate-y-2 hover:shadow-2xl transition-all cursor-pointer z-20">
                                <div className="animate-float flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-black text-2xl shadow-inner">
                                        12
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 border-b border-dashed border-slate-200 pb-1">Skills Mastered</p>
                                        <p className="text-[10px] font-bold text-emerald-600 mt-1 uppercase tracking-wider flex items-center gap-1">
                                            <TrendingUp size={12} /> +3 this week
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Avatar 3 (Small decoration) */}
                            <div className="absolute top-1/3 left-8 w-12 h-12 rounded-full border-4 border-white shadow-lg text-2xl flex items-center justify-center bg-blue-100 animate-float-fast delay-300 hidden sm:flex">
                                👨‍💻
                            </div>
                            {/* Floating Avatar 4 (Small decoration) */}
                            <div className="absolute bottom-1/3 right-12 w-10 h-10 rounded-full border-4 border-white shadow-lg text-xl flex items-center justify-center bg-pink-100 animate-float-fast delay-1000 hidden sm:flex">
                                🎨
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 sm:py-32 bg-slate-50 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Everything You Need to Succeed</h2>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                            Comprehensive tools and features to connect, learn, and grow with real experts from around the world.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon
                            return (
                                <div
                                    key={idx}
                                    className="p-8 bg-white rounded-2xl border border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                    onMouseEnter={() => setHoveredFeature(idx)}
                                    onMouseLeave={() => setHoveredFeature(null)}
                                >
                                    <div className="mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                                            <Icon size={24} className="text-primary-600" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                    <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 sm:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">How SkillSync Works</h2>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                            A simple process to connect with teachers and start learning in minutes.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: '1', title: 'Sign Up', desc: 'Create your free SkillSync account in seconds' },
                            { step: '2', title: 'Find Teachers', desc: 'Browse verified teachers and their skills' },
                            { step: '3', title: 'Schedule Session', desc: 'Book a time that works for both of you' },
                            { step: '4', title: 'Learn & Earn', desc: 'Start learning or teaching with credits' }
                        ].map((item, idx) => (
                            <div key={idx} className="relative">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-primary-50 border-2 border-primary-600 flex items-center justify-center mb-4">
                                        <span className="text-2xl font-bold text-primary-600">{item.step}</span>
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 text-center">{item.title}</h3>
                                    <p className="text-sm text-slate-500 text-center mt-2">{item.desc}</p>
                                </div>
                                {idx < 3 && (
                                    <div className="hidden md:block absolute top-8 -right-4 text-2xl text-primary-200">
                                        <ArrowRight size={24} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-20 sm:py-32 bg-slate-50 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">What Our Community Says</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, idx) => (
                            <div key={idx} className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-4xl">{testimonial.avatar}</div>
                                    <div>
                                        <p className="font-bold text-slate-900">{testimonial.name}</p>
                                        <p className="text-sm text-slate-500">{testimonial.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-slate-600 italic leading-relaxed">"{testimonial.content}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 sm:py-32 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-6">
                        Ready to Start Learning?
                    </h2>
                    <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto">
                        Join thousands of students and teachers on SkillSync. Learn new skills, share your expertise, and grow together.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/login" className="w-full sm:w-auto">
                            <button className="flex items-center justify-center w-full bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-base py-3 px-8 transition-colors">
                                Get Started Free <ArrowRight size={18} className="ml-2" />
                            </button>
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto">
                            <button className="w-full border border-slate-300 font-medium text-slate-900 hover:bg-slate-100 rounded-lg text-base py-3 px-8 transition-colors">
                                Already have an account? Log In
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 py-12 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <img src="/logo.png" alt="SkillSync logo" className="w-8 h-8 object-contain grayscale opacity-70" />
                                <span className="font-bold text-slate-900">SkillSync</span>
                            </div>
                            <p className="text-sm text-slate-500">Peer-to-peer learning platform for skill sharing and growth.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 mb-4">Product</p>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><a href="#" className="hover:text-primary-600">Features</a></li>
                                <li><a href="#" className="hover:text-primary-600">Pricing</a></li>
                                <li><a href="#" className="hover:text-primary-600">Security</a></li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 mb-4">Company</p>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><a href="#" className="hover:text-primary-600">About</a></li>
                                <li><a href="#" className="hover:text-primary-600">Blog</a></li>
                                <li><a href="#" className="hover:text-primary-600">Careers</a></li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 mb-4">Legal</p>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><a href="#" className="hover:text-primary-600">Privacy</a></li>
                                <li><a href="#" className="hover:text-primary-600">Terms</a></li>
                                <li><a href="#" className="hover:text-primary-600">Contact</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row justify-between items-center text-slate-500">
                        <p className="text-sm">&copy; 2026 SkillSync. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 sm:mt-0 font-medium">
                            <a href="#" className="hover:text-primary-600 transition-colors">Twitter</a>
                            <a href="#" className="hover:text-primary-600 transition-colors">LinkedIn</a>
                            <a href="#" className="hover:text-primary-600 transition-colors">GitHub</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
