import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
            {/* Background Aesthetic Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            {/* Navigation (Landing Page Version) */}
            <nav className="relative z-20 max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <span className="text-2xl">⚡</span>
                    </div>
                    <span className="text-2xl font-black title-gradient tracking-tight">FocusFlow</span>
                </div>
                <div className="flex gap-6">
                    {user ? (
                        <Link to="/dashboard" className="glass-btn-primary px-8 py-2 text-sm">Dashboard</Link>
                    ) : (
                        <>
                            <Link to="/login" className="text-slate-400 hover:text-white font-bold transition-colors mt-2 text-sm uppercase tracking-widest">Login</Link>
                            <Link to="/register" className="glass-btn-primary px-8 py-2 text-sm uppercase tracking-widest">Join Orbit</Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center lg:text-left grid lg:grid-cols-2 gap-16 items-center">
                <div className="animate-fade-in">
                    <h4 className="text-indigo-400 font-bold uppercase tracking-[0.3em] text-xs mb-6">Autonomous Learning Optimization</h4>
                    <h1 className="text-6xl lg:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight">
                        Study Smarter with <span className="title-gradient">Adaptive AI</span>
                    </h1>
                    <p className="text-slate-400 text-xl lg:text-2xl mb-12 leading-relaxed max-w-2xl">
                        Stop fighting your biological clock. FocusFlow uses <span className="text-white font-bold">Heuristic Intelligence</span> to align your study tasks with your cognitive energy peaks.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                        <Link to={user ? "/dashboard" : "/register"} className="glass-btn-primary px-12 py-5 text-lg group">
                            Initialize Neural Sync <span className="group-hover:translate-x-2 transition-transform inline-block ml-2">→</span>
                        </Link>
                        <a href="#how-it-works" className="glass-btn-secondary px-12 py-5 text-lg">Download Briefing</a>
                    </div>

                    <div className="mt-16 flex items-center gap-8 justify-center lg:justify-start">
                        <div>
                            <p className="text-white font-black text-2xl">98%</p>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Retention Rate</p>
                        </div>
                        <div className="w-px h-10 bg-white/10"></div>
                        <div>
                            <p className="text-white font-black text-2xl">Adapt v2.4</p>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Core Engine</p>
                        </div>
                    </div>
                </div>

                <div className="relative animate-float">
                    {/* Visual representation of the glassmorphism dashboard */}
                    <div className="glass-card p-1 transform rotate-3 hover:rotate-0 transition-all duration-700 bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                        <div className="bg-slate-900/90 rounded-[22px] p-8 aspect-square flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="space-y-4 w-full">
                                    <div className="h-4 bg-white/5 rounded-full w-1/3"></div>
                                    <div className="h-10 bg-indigo-500/20 rounded-2xl w-full flex items-center px-4">
                                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                            <div className="bg-indigo-500 h-full w-[85%]"></div>
                                        </div>
                                    </div>
                                    <div className="h-40 bg-white/5 rounded-[22px] w-full border border-white/5 p-6 space-y-4">
                                        <div className="h-2 bg-white/10 rounded-full w-3/4"></div>
                                        <div className="h-2 bg-white/10 rounded-full w-1/2"></div>
                                        <div className="h-2 bg-white/10 rounded-full w-full"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10"></div>
                                <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10"></div>
                                <div className="h-12 flex-1 rounded-xl bg-indigo-600/30 border border-indigo-500/50"></div>
                            </div>
                        </div>
                    </div>
                    {/* Floating elements */}
                    <div className="absolute -top-10 -right-10 glass-card p-6 blur-none animate-pulse">
                        <span className="text-2xl">🧠</span>
                    </div>
                    <div className="absolute -bottom-10 -left-10 glass-card p-6 animate-bounce" style={{ animationDuration: '3s' }}>
                        <span className="text-2xl">⚡</span>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
                <div className="text-center mb-24">
                    <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 uppercase tracking-tight">The Neural Advantage</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">Our systematic approach to cognitive load balancing ensures you study at peak intensity without burnout.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    <div className="glass-card p-10 hover:bg-white/[0.07]">
                        <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-3xl mb-8">📡</div>
                        <h3 className="text-2xl font-bold text-white mb-4">Focus Telemetry</h3>
                        <p className="text-slate-400 font-medium leading-relaxed">Log your cognitive state throughout the day to train the NeuralSync engine on your unique biological rhythm.</p>
                    </div>
                    <div className="glass-card p-10 hover:bg-white/[0.07]">
                        <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-3xl mb-8">⚖️</div>
                        <h3 className="text-2xl font-bold text-white mb-4">Load Balancing</h3>
                        <p className="text-slate-400 font-medium leading-relaxed">Heavily complex tasks are automatically prioritized for high-energy windows, keeping light reviews for lower focus periods.</p>
                    </div>
                    <div className="glass-card p-10 hover:bg-white/[0.07]">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-3xl mb-8">📅</div>
                        <h3 className="text-2xl font-bold text-white mb-4">Adaptive Planner</h3>
                        <p className="text-slate-400 font-medium leading-relaxed">One-click schedule regeneration that fragments your task backlog into a perfectly balanced vertical timeline.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                            <span className="text-lg">⚡</span>
                        </div>
                        <span className="font-black title-gradient tracking-tight">FocusFlow API v2.4</span>
                    </div>
                    <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">© 2026 FocusFlow Neural Sycn. All Protocols Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
