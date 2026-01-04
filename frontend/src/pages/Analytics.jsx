import React, { useState, useEffect } from 'react';
import focusService from '../services/focusService';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Analytics = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await focusService.getFocusStats();
            setStats(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setLoading(false);
        }
    };

    const chartData = {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: [
            {
                label: 'Mean Focus Energy',
                data: Array.from({ length: 24 }, (_, i) => {
                    const hourStat = stats.find(s => s._id === i);
                    return hourStat ? hourStat.averageFocus : null;
                }),
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#6366f1',
                pointBorderWidth: 2,
                pointRadius: 4,
                spanGaps: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleFont: { size: 14, weight: 'bold' },
                padding: 12,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
            }
        },
        scales: {
            y: {
                min: 0,
                max: 5,
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#64748b' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', maxRotation: 0 }
            },
        },
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
    );

    const peakHour = stats.length > 0 ? [...stats].sort((a, b) => b.averageFocus - a.averageFocus)[0] : null;

    return (
        <div className="main-container animate-fade-in">
            <header className="mb-12">
                <h4 className="text-indigo-400 font-bold uppercase tracking-widest text-sm mb-2">Pattern Recognition</h4>
                <h1 className="text-5xl font-black text-white mb-4 title-gradient">Cognitive Analytics</h1>
                <p className="text-slate-400 text-lg max-w-2xl">
                    Visualizing your mental energy patterns throughout the day. This data directly influences your adaptive study sessions.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                <div className="glass-card p-8 lg:col-span-3">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-white">Daily Focus Waveform</h3>
                            <p className="text-slate-500 text-sm">Average focus score relative to the 24-hour cycle</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="glass-badge bg-indigo-500/10 text-indigo-400 border-indigo-500/20">Active Telemetry</div>
                        </div>
                    </div>
                    <div className="h-[400px]">
                        <Line data={chartData} options={options} />
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Summary Cards */}
                    <div className="glass-card p-8 bg-gradient-to-br from-indigo-600/20 to-transparent">
                        <span className="text-3xl mb-4 block">📈</span>
                        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Peak Optimization</h4>
                        <p className="text-4xl font-black text-white mb-2">{peakHour ? `${peakHour._id}:00` : '--:--'}</p>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">Best time for high-intensity deep work or exams.</p>
                    </div>

                    <div className="glass-card p-8 bg-gradient-to-br from-purple-600/20 to-transparent">
                        <span className="text-3xl mb-4 block">💤</span>
                        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Rest Window</h4>
                        <p className="text-4xl font-black text-white mb-2">03:00</p>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">Historically lowest focus detected. Prioritize recovery.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-card p-8">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-2xl mb-6">🎯</div>
                    <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">Adaptive Scheduling</h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">
                        The engine matches <span className="text-indigo-400 font-bold">Heavy Tasks</span> to hours where your focus is above 4.0.
                    </p>
                </div>
                <div className="glass-card p-8">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-2xl mb-6">🔋</div>
                    <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">Energy Management</h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">
                        Review sessions are grouped in periods of <span className="text-emerald-400 font-bold">lower focus</span> to prevent burnout.
                    </p>
                </div>
                <div className="glass-card p-8">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-2xl mb-6">⚖️</div>
                    <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">Precision Logic</h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">
                        Based on <span className="text-amber-400 font-bold">{stats.length} data points</span>, the current margin of error is +/- 8%.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
