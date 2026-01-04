import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import taskService from '../services/taskService';
import focusService from '../services/focusService';
import scheduleService from '../services/scheduleService';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [focusStats, setFocusStats] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, statsRes, schedulesRes] = await Promise.all([
        taskService.getTasks(),
        focusService.getFocusStats(),
        scheduleService.getSchedules()
      ]);
      setTasks(tasksRes.data.data.slice(0, 4));
      setFocusStats(statsRes.data.data);
      setSchedules(schedulesRes.data.data.schedules.slice(0, 2));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const currentHour = new Date().getHours();
  const currentFocus = focusStats.find(s => s._id === currentHour)?.averageFocus || 0;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="main-container animate-fade-in">
      <header className="mb-12">
        <h4 className="text-indigo-400 font-bold uppercase tracking-widest text-sm mb-2">Personal Overview</h4>
        <h1 className="text-5xl font-black text-white mb-4">
          Welcome back, <span className="title-gradient">Student</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Your adaptive study companion is ready. You have <span className="text-indigo-400 font-bold">{tasks.length} tasks</span> prioritized for today.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Focus Status Card */}
        <div className="glass-card p-1">
          <div className="bg-gradient-to-br from-indigo-600/90 to-purple-700/90 rounded-[22px] p-8 h-full">
            <div className="flex justify-between items-start mb-10">
              <span className="glass-badge bg-white/10">Active State</span>
              <div className="p-3 bg-white/10 rounded-2xl">⚡</div>
            </div>
            <h2 className="text-slate-100 text-sm font-bold uppercase tracking-wider mb-2 opacity-80">Current Focus Level</h2>
            <div className="flex items-baseline gap-2 mb-8">
              <h3 className="text-6xl font-black text-white">{currentFocus ? currentFocus.toFixed(1) : 'Logged'}</h3>
              <span className="text-indigo-200 text-sm">/ 5.0</span>
            </div>
            <Link to="/focus" className="w-full glass-btn-secondary bg-white/10 hover:bg-white/20 border-white/5">
              Update Focus Status
            </Link>
          </div>
        </div>

        {/* Productivity Insights Card */}
        <div className="glass-card p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <span className="glass-badge text-emerald-400 border-emerald-500/20 bg-emerald-500/5">Smart Insight</span>
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-white font-bold text-2xl mb-4">Peak Utility</h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              Your analytics suggest focusing on <span className="text-indigo-400 font-bold">Heavier Tasks</span> around
              <span className="text-white font-bold"> {focusStats.length > 0 ? `${[...focusStats].sort((a, b) => b.averageFocus - a.averageFocus)[0]._id}:00` : '--:--'}</span> for maximum efficiency.
            </p>
          </div>
          <Link to="/analytics" className="text-indigo-400 font-bold flex items-center gap-2 hover:gap-4 transition-all group">
            Explore Full Analytics <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Progress Statistics */}
        <div className="glass-card p-8">
          <div className="flex justify-between items-start mb-8">
            <span className="glass-badge text-amber-400 border-amber-500/20 bg-amber-500/5">Execution</span>
            <span className="text-2xl">📈</span>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase mb-1">Active Backlog</p>
                <p className="text-3xl font-black text-white">{tasks.length}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-xs font-bold uppercase mb-1">Completion Rate</p>
                <p className="text-3xl font-black text-emerald-400">72%</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                <span>Weekly Goal</span>
                <span>18 / 25 Hours</span>
              </div>
              <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full shadow-lg shadow-indigo-500/40" style={{ width: '72%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Usage Explanation Section */}
      <section className="mb-16">
        <div className="glass-card p-1">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950/30 rounded-[22px] p-8 md:p-12 relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">Intelligence Briefing</h2>
                <p className="text-slate-400 leading-relaxed mb-6">
                  FocusFlow isn't just a calendar; it's a <span className="text-indigo-400 font-bold">Heuristic Adaptive Engine</span>.
                  Our core algorithm uses your biological data to architect the perfect day.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs mt-1">1</div>
                    <div>
                      <p className="text-white font-bold text-sm">Pattern Recognition</p>
                      <p className="text-slate-500 text-xs mt-1">We analyze your historical focus logs to calculate your cognitive waveform across a 24-hour cycle.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs mt-1">2</div>
                    <div>
                      <p className="text-white font-bold text-sm">Dynamic Load Balancing</p>
                      <p className="text-slate-500 text-xs mt-1">Tasks marked as 'Heavy' are automatically prioritized for your peak energy windows to maximize retention.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs mt-1">3</div>
                    <div>
                      <p className="text-white font-bold text-sm">Temporal Scheduling</p>
                      <p className="text-slate-500 text-xs mt-1">Our engine fragments your backlog into optimal sessions that fit within your preferred study phases.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-6 bg-white/5 text-center">
                  <span className="text-2xl mb-2 block">📡</span>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">State</p>
                  <p className="text-white font-black">ACTIVE</p>
                </div>
                <div className="glass-card p-6 bg-white/5 text-center">
                  <span className="text-2xl mb-2 block">📉</span>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Resolution</p>
                  <p className="text-white font-black">HIGH</p>
                </div>
                <div className="glass-card p-6 bg-white/5 text-center col-span-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Algorithm Version</p>
                  <p className="text-xl font-black text-indigo-400 title-gradient uppercase">Neural-Sync v2.4</p>
                </div>
              </div>
            </div>
            {/* Background Decoration */}
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]"></div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Modern Task List */}
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-white">Priority Stream</h2>
            <Link to="/tasks" className="glass-btn-secondary py-2 text-sm">View Backlog</Link>
          </div>
          <div className="space-y-4">
            {tasks.length > 0 ? tasks.map(task => (
              <div key={task._id} className="glass-card p-5 group hover:bg-white/[0.07] cursor-pointer">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${task.taskType === 'Heavy' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                      'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                      }`}>
                      {task.title.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{task.title}</h4>
                      <p className="text-sm text-slate-500">{task.subject} • {task.duration} Hours</p>
                    </div>
                  </div>
                  <span className="glass-badge text-[10px] uppercase opacity-60">{task.taskType}</span>
                </div>
              </div>
            )) : (
              <div className="glass-card p-12 text-center">
                <p className="text-slate-500 font-medium">Your priority stream is empty.</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-white">Active Timeline</h2>
            <Link to="/schedule" className="glass-btn-secondary py-2 text-sm">Open Planner</Link>
          </div>
          <div className="space-y-6">
            {schedules.length > 0 ? schedules.map(schedule => (
              <div key={schedule._id} className="glass-card bg-gradient-to-br from-indigo-600/10 to-transparent p-8 relative overflow-hidden group">
                <div className="relative z-10">
                  <span className="glass-badge mb-4 inline-block bg-indigo-500/10 text-indigo-400">Smart Schedule</span>
                  <h4 className="font-black text-2xl text-white mb-2 group-hover:text-indigo-300 transition-colors">{schedule.title}</h4>
                  <p className="text-slate-400 text-sm mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {schedule.sessionCount} Active sessions generated
                  </p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl text-xs font-bold text-slate-300">
                      ⭐ {schedule.totalHours}H ALLOCATED
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 uppercase">
                      Adaptive Logic 2.0
                    </div>
                  </div>
                </div>
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/40 transition-all duration-700"></div>
              </div>
            )) : (
              <div className="glass-card p-12 text-center border-dashed border-2 border-white/5">
                <p className="text-slate-500 mb-6 font-medium">No active planner found.</p>
                <button
                  onClick={() => navigate('/schedule')}
                  className="glass-btn-primary mx-auto"
                >
                  Initialize Smart Planner
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;