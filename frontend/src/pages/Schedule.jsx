import React, { useState, useEffect } from 'react';
import scheduleService from '../services/scheduleService';
import toast from 'react-hot-toast';

const Schedule = () => {
  const [schedule, setSchedule] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchCurrentSchedule();
  }, []);

  const fetchCurrentSchedule = async () => {
    try {
      const response = await scheduleService.getSchedules();
      const schedules = response.data.data.schedules;
      if (schedules.length > 0) {
        const detailedRes = await scheduleService.getById(schedules[0]._id);
        setSchedule(detailedRes.data.data.schedule);
        setSessions(detailedRes.data.data.sessions);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await scheduleService.generate();
      setSchedule(response.data.data.schedule);
      setSessions(response.data.data.sessions);
      toast.success('System optimized. Smart schedule active.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Optimization failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!schedule) return;
    if (window.confirm('Clear active planner?')) {
      try {
        await scheduleService.deleteSchedule(schedule._id);
        setSchedule(null);
        setSessions([]);
        toast.success('System reset');
      } catch (error) {
        toast.error('Failed to reset');
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="main-container animate-fade-in">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h4 className="text-indigo-400 font-bold uppercase tracking-widest text-sm mb-2">Temporal Allocation</h4>
          <h1 className="text-5xl font-black text-white mb-4 title-gradient">Smart Planner</h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Your study sessions are mapped to cognitive peaks. Heavy tasks are aligned with high focus windows.
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button
            onClick={handleDelete}
            className="glass-btn-secondary px-6"
            disabled={!schedule}
          >
            Reset System
          </button>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className={`flex-1 md:flex-none glass-btn-primary px-10 ${generating ? 'opacity-50' : ''}`}
          >
            {generating ? 'Optimizing...' : 'Regenerate Logic'}
          </button>
        </div>
      </header>

      {sessions.length > 0 ? (
        <div className="relative">
          {/* Visual Timeline Path */}
          <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-500/50 via-purple-500/50 to-transparent hidden md:block"></div>

          <div className="space-y-12">
            {sessions.map((session, index) => (
              <div key={session._id} className="relative md:pl-20 group">
                {/* Timeline Node */}
                <div className="absolute left-0 top-2 w-14 h-14 bg-slate-900 border-2 border-indigo-500/50 rounded-2xl hidden md:flex items-center justify-center font-black text-indigo-400 shadow-lg shadow-indigo-500/20 z-10 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all group-hover:border-indigo-400">
                  {index + 1}
                </div>

                <div className="glass-card p-1">
                  <div className={`rounded-[22px] p-8 ${session.focusLevel >= 4.5 ? 'bg-gradient-to-br from-indigo-600/10 to-transparent' :
                      'bg-white/[0.02]'
                    }`}>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                      <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-indigo-400 transition-colors">
                          {session.title}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="glass-badge bg-indigo-500/10 text-indigo-400 border-indigo-500/20 uppercase tracking-widest text-[10px]">
                            {session.notes?.replace('Focus Level: ', '') || 'General Session'}
                          </span>
                          <span className="text-slate-500 text-xs font-bold uppercase">• Adaptive Session</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Focus</span>
                          <span className={`text-xl font-black ${session.focusLevel >= 4 ? 'text-indigo-400' :
                              session.focusLevel >= 3 ? 'text-amber-400' : 'text-red-400'
                            }`}>
                            {session.focusLevel?.toFixed(1)}
                          </span>
                        </div>
                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(session.focusLevel / 5) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 border-t border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">📅</div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Schedule Date</p>
                          <p className="text-white font-bold text-sm">{new Date(session.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">⏰</div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Optimal Window</p>
                          <p className="text-white font-bold text-sm">{new Date(session.date).getHours()}:00 - {new Date(session.date).getHours() + session.duration}:00</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">⌛</div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Time Block</p>
                          <p className="text-white font-bold text-sm">{session.duration} Hours</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">🔄</div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Session Status</p>
                          <p className="text-emerald-400 font-bold text-sm uppercase tracking-widest text-[10px]">{session.status}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-32 text-center glass-card border-dashed border-2 border-white/5">
          <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
            <span className="text-5xl">🌌</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Space is currently unmapped.</h2>
          <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto">Generate a smart schedule to align your task backlog with cognitive peak telemetry.</p>
          <button
            onClick={handleGenerate}
            className="glass-btn-primary px-12 py-5 text-xl"
          >
            Initialize Optimization
          </button>
        </div>
      )}
    </div>
  );
};

export default Schedule;