import React, { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import toast from 'react-hot-toast';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        taskType: 'Medium',
        duration: 2,
        deadline: ''
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await taskService.getTasks();
            setTasks(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await taskService.createTask(formData);
            fetchTasks();
            setShowModal(false);
            setFormData({ title: '', subject: '', taskType: 'Medium', duration: 2, deadline: '' });
            toast.success('Task integrated into backlog');
        } catch (error) {
            toast.error('Failed to create task');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Erase this task from memory?')) return;
        try {
            await taskService.deleteTask(id);
            setTasks(tasks.filter(t => t._id !== id));
            toast.success('Task purged');
        } catch (error) {
            toast.error('Deletion failed');
        }
    };

    return (
        <div className="main-container animate-fade-in">
            <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h4 className="text-indigo-400 font-bold uppercase tracking-widest text-sm mb-2">Backlog Management</h4>
                    <h1 className="text-5xl font-black text-white mb-4 title-gradient">Study Stream</h1>
                    <p className="text-slate-400 text-lg max-w-2xl">
                        Define your objectives. The scheduling engine will automatically allocate these based on temporal focus patterns.
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="glass-btn-primary px-8 py-4"
                >
                    <span className="text-xl">+</span> Add Objective
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tasks.length > 0 ? tasks.map(task => (
                    <div key={task._id} className="glass-card p-8 group">
                        <div className="flex justify-between items-start mb-6">
                            <span className={`glass-badge ${task.taskType === 'Heavy' ? 'text-red-400 border-red-500/20 bg-red-500/5' :
                                    task.taskType === 'Light' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' :
                                        'text-indigo-400 border-indigo-500/20 bg-indigo-500/5'
                                }`}>
                                {task.taskType}
                            </span>
                            <button
                                onClick={() => handleDelete(task._id)}
                                className="text-slate-600 hover:text-red-400 transition-colors p-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>

                        <h3 className="text-2xl font-black text-white mb-2 leading-tight uppercase tracking-tight group-hover:text-indigo-400 transition-colors">
                            {task.title}
                        </h3>
                        <p className="text-indigo-400 font-bold text-sm mb-6 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
                            {task.subject}
                        </p>

                        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Duration</span>
                                <span className="text-white font-bold">{task.duration} Hours</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Deadline</span>
                                <span className="text-white font-bold">{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Adaptive'}</span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="lg:col-span-3 glass-card p-24 text-center border-dashed border-2 border-white/5">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                            <span className="text-4xl opacity-40">📝</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">The backlog is silent.</h2>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Add your study objectives to begin the intelligent optimization process.</p>
                        <button onClick={() => setShowModal(true)} className="glass-btn-secondary px-8">Create First Task</button>
                    </div>
                )}
            </div>

            {/* Modern Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
                    <div className="glass-card w-full max-w-lg p-10 relative z-10 animate-fade-in">
                        <h3 className="text-3xl font-black text-white mb-8 title-gradient">Task Initialization</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Objective Title</label>
                                <input
                                    required
                                    className="glass-input"
                                    placeholder="e.g., Quantum Mechanics Review"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subject</label>
                                    <input
                                        required
                                        className="glass-input"
                                        placeholder="Physics"
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Intensity</label>
                                    <select
                                        className="glass-input bg-slate-900"
                                        value={formData.taskType}
                                        onChange={e => setFormData({ ...formData, taskType: e.target.value })}
                                    >
                                        <option value="Light">Light</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Heavy">Heavy</option>
                                        <option value="Review">Review</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Duration (Hours)</label>
                                    <input
                                        type="number"
                                        className="glass-input"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Deadline</label>
                                    <input
                                        type="date"
                                        className="glass-input"
                                        value={formData.deadline}
                                        onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 glass-btn-secondary">Abort</button>
                                <button type="submit" className="flex-1 glass-btn-primary">Commit Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tasks;
