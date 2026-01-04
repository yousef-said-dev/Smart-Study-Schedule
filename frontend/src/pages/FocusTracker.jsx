import React, { useState, useEffect } from 'react';
import focusService from '../services/focusService';
import toast from 'react-hot-toast';

const FocusTracker = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        focusScore: 5,
        timeOfDay: new Date().getHours(),
        notes: ''
    });

    useEffect(() => {
        if ("Notification" in window) {
            Notification.requestPermission();
        }
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await focusService.getFocusLogs();
            setLogs(response.data.data.slice(0, 10));
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    const handleLogFocus = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await focusService.logFocus(formData);
            fetchLogs();
            setFormData({ ...formData, notes: '' });

            if ("Notification" in window && Notification.permission === "granted") {
                new Notification("Focus Logged!", {
                    body: `Your focus level of ${formData.focusScore} has been saved. Keep it up!`,
                    icon: "/favicon.ico"
                });
            }
            toast.success('Efficiency status logged!');
        } catch (error) {
            toast.error('Failed to log state');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-container animate-fade-in">
            <header className="mb-12">
                <h4 className="text-indigo-400 font-bold uppercase tracking-widest text-sm mb-2">Adaptive Training</h4>
                <h1 className="text-5xl font-black text-white mb-4 title-gradient">Focus Lab</h1>
                <p className="text-slate-400 text-lg max-w-2xl">
                    Log your cognitive state to train the scheduling engine. Higher resolution data leads to more accurate study windows.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Logging Form */}
                <div className="lg:col-span-5">
                    <div className="glass-card p-8 sticky top-32">
                        <h3 className="text-2xl font-black text-white mb-8">Current State Entry</h3>
                        <form onSubmit={handleLogFocus} className="space-y-8">
                            <div>
                                <div className="flex justify-between items-end mb-4">
                                    <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">Cognitive Load (1-5)</label>
                                    <span className="text-3xl font-black text-indigo-400">{formData.focusScore}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="1"
                                    value={formData.focusScore}
                                    onChange={(e) => setFormData({ ...formData, focusScore: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                                <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-bold uppercase">
                                    <span>Exhausted</span>
                                    <span>Max Peak</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider text-xs">Temporal Marker</label>
                                    <select
                                        className="glass-input text-sm"
                                        value={formData.timeOfDay}
                                        onChange={(e) => setFormData({ ...formData, timeOfDay: parseInt(e.target.value) })}
                                    >
                                        {[...Array(24)].map((_, i) => (
                                            <option key={i} value={i} className="bg-slate-900">{i}:00</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider text-xs">Date</label>
                                    <div className="glass-input text-sm flex items-center opacity-60">Today</div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider text-xs">Cognitive Notes</label>
                                <textarea
                                    className="glass-input min-h-[120px] resize-none"
                                    placeholder="Any specific factors? (e.g., Caffeine, Sleep, Environment)"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full glass-btn-primary py-4 text-lg ${loading ? 'opacity-50' : ''}`}
                            >
                                {loading ? 'Processing...' : 'Commit Log Entry'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* History List */}
                <div className="lg:col-span-7">
                    <h3 className="text-2xl font-black text-white mb-8">Temporal History</h3>
                    <div className="space-y-4">
                        {logs.length > 0 ? logs.map(log => (
                            <div key={log._id} className="glass-card p-6 flex items-center justify-between group">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-white/5 flex items-center justify-center text-xl font-black text-indigo-400 group-hover:scale-110 transition-transform">
                                            {log.focusScore}
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white uppercase tracking-tight">{log.timeOfDay}:00 Marker</h4>
                                        <p className="text-sm text-slate-500 italic max-w-sm truncate">
                                            {log.notes || 'Reflective period without specific markers.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-500 uppercase">{new Date(log.createdAt).toLocaleDateString()}</p>
                                    <div className="flex gap-1 mt-1 justify-end">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < log.focusScore ? 'bg-indigo-500 shadow-sm shadow-indigo-500/50' : 'bg-white/5'}`}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="glass-card p-20 text-center border-dashed border-2 border-white/5 opacity-40">
                                <span className="text-4xl mb-4 block">🔍</span>
                                <p className="font-medium">Sensor history is currently void.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FocusTracker;
