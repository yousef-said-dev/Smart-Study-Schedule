import React from 'react';
import { Link } from 'react-router-dom';

const HowToUse = () => {
    const steps = [
        {
            icon: '⚡',
            title: 'I. Task Ingestion',
            description: 'Start by populating your task backlog. Assign a "Heavy", "Medium", or "Light" intensity to each task. This tells the AI how much cognitive energy each unit requires.',
            color: 'from-blue-500/20 to-indigo-500/20'
        },
        {
            icon: '📡',
            title: 'II. Focus Auditing',
            description: 'Log your current focus level (1-5) at different times of the day. The more telemetry data you provide, the faster the neural engine learns your biological peaks.',
            color: 'from-indigo-500/20 to-purple-500/20'
        },
        {
            icon: '🌀',
            title: 'III. Logic Generation',
            description: 'Navigate to the Schedule page and click "Initialize Optimization". Our algorithm fragments your tasks and maps them to your highest energy windows.',
            color: 'from-purple-500/20 to-pink-500/20'
        },
        {
            icon: '📊',
            title: 'IV. Intelligence Feedback',
            description: 'Visit the Analytics page to view your "Cognitive Waveform". See exactly when your productivity spikes and adjust your study habits based on pure data.',
            color: 'from-pink-500/20 to-red-500/20'
        }
    ];

    const modules = [
        { name: 'Dashboard', detail: 'The high-level command center displaying your current focus state and system status.' },
        { name: 'Tasks', detail: 'Where you define your work. Each task is a data point for the scheduling engine.' },
        { name: 'Focus', detail: 'The manual input node for biological data. This is how the AI knows who you are.' },
        { name: 'Schedule', detail: 'The visual output of our AI optimization. A vertical timeline of your ideal day.' },
        { name: 'Analytics', detail: 'Deep dives into your productivity telemetry and focus trends.' }
    ];

    return (
        <div className="main-container animate-fade-in max-w-6xl">
            <header className="mb-20 text-center lg:text-left">
                <h4 className="text-indigo-400 font-bold uppercase tracking-[0.3em] text-xs mb-4">Operations Manual</h4>
                <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 title-gradient leading-tight">System Documentation</h1>
                <p className="text-slate-400 text-lg max-w-3xl">
                    FocusFlow is an adaptive cognitive environment. Follow these protocols to synchronize your study habits with our neural optimization engine.
                </p>
            </header>

            {/* Strategic Workflow Section */}
            <section className="mb-32">
                <h2 className="text-3xl font-black text-white mb-12 uppercase tracking-tight flex items-center gap-4">
                    <span className="w-12 h-px bg-indigo-500/50"></span>
                    Primary Workflow
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="glass-card p-1 group">
                            <div className={`bg-gradient-to-br ${step.color} rounded-[22px] p-8 h-full flex flex-col items-start transition-all duration-500 group-hover:bg-white/[0.05]`}>
                                <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">{step.icon}</div>
                                <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">{step.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Module Breakdown */}
            <section className="mb-32 grid lg:grid-cols-2 gap-16 items-center">
                <div className="glass-card p-1">
                    <div className="bg-slate-900/50 p-10 rounded-[22px] space-y-8">
                        {modules.map((module, index) => (
                            <div key={index} className="flex gap-6 group hover:translate-x-2 transition-transform">
                                <div className="text-indigo-500 font-black text-lg">0{index + 1}</div>
                                <div>
                                    <h4 className="text-white font-black uppercase text-sm mb-1 tracking-widest">{module.name}</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">{module.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-4xl font-black text-white mb-8 uppercase tracking-tight leading-tight">Module Architecture</h2>
                    <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                        Each component of the system is designed to feed data back into your <span className="text-indigo-400">Personal Optimization Model</span>.
                        The more granular your task definitions and focus logs, the more accurate your scheduling becomes.
                    </p>
                    <div className="p-8 border-l-2 border-indigo-500/20 bg-indigo-500/5 rounded-r-2xl">
                        <p className="text-white font-bold italic mb-2">"The system doesn't just manage time; it manages attention."</p>
                        <p className="text-slate-500 text-xs uppercase tracking-widest font-black">— Neural-Sync v2.4 Default Protocol</p>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <div className="py-20 text-center glass-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
                <h2 className="text-4xl font-black text-white mb-4 uppercase">Ready to Initialize?</h2>
                <p className="text-slate-400 mb-10 max-w-md mx-auto">Sync your tasks and start your first AI-optimized study session today.</p>
                <Link to="/dashboard" className="glass-btn-primary px-16 py-5 text-xl">Enter Nerve Center</Link>

                {/* Decoration */}
                <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px]"></div>
                <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-purple-500/5 rounded-full blur-[100px]"></div>
            </div>
        </div>
    );
};

export default HowToUse;
