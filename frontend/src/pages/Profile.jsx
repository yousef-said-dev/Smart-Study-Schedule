import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    studyHoursPerDay: user?.preferences?.studyHoursPerDay || 4,
    preferredStudyTime: user?.preferences?.preferredStudyTime || 'morning',
    notificationSettings: {
      studyReminders: user?.preferences?.notificationSettings?.studyReminders ?? true,
      focusReminders: user?.preferences?.notificationSettings?.focusReminders ?? true
    }
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await authService.updatePreferences({
        studyHoursPerDay: formData.studyHoursPerDay,
        preferredStudyTime: formData.preferredStudyTime,
        notificationSettings: formData.notificationSettings
      });

      setUser({ ...user, preferences: response.data.data.user.preferences });
      toast.success('Core parameters updated');
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container animate-fade-in max-w-4xl">
      <header className="mb-12">
        <h4 className="text-indigo-400 font-bold uppercase tracking-widest text-sm mb-2">System Configuration</h4>
        <h1 className="text-5xl font-black text-white mb-4 title-gradient">User Preferences</h1>
        <p className="text-slate-400 text-lg">
          Calibrate the adaptive engine to match your subjective study availability and notification needs.
        </p>
      </header>

      <div className="glass-card overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-800 relative">
          <div className="absolute -bottom-10 left-10 w-24 h-24 rounded-3xl bg-slate-900 border-4 border-indigo-500/20 flex items-center justify-center text-3xl shadow-2xl">
            👤
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="p-10 pt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Account Section */}
          <div className="space-y-8">
            <h3 className="text-xl font-black text-white uppercase tracking-tight border-b border-white/5 pb-4">Identity Marker</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">User Index Name</label>
                <input
                  type="text"
                  value={formData.name}
                  readOnly
                  className="glass-input opacity-50 cursor-not-allowed bg-black/20"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Authenticated Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="glass-input opacity-50 cursor-not-allowed bg-black/20"
                />
              </div>
            </div>
          </div>

          {/* Engine Logic Section */}
          <div className="space-y-8">
            <h3 className="text-xl font-black text-white uppercase tracking-tight border-b border-white/5 pb-4">Engine Heuristics</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Daily Allocation (Hours)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={formData.studyHoursPerDay}
                    onChange={(e) => setFormData({ ...formData, studyHoursPerDay: parseInt(e.target.value) })}
                    className="flex-1 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <span className="text-white font-black w-8">{formData.studyHoursPerDay}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Subjective Peak Window</label>
                <select
                  className="glass-input text-sm bg-slate-900"
                  value={formData.preferredStudyTime}
                  onChange={(e) => setFormData({ ...formData, preferredStudyTime: e.target.value })}
                >
                  <option value="morning">Morning Phase (06:00 - 12:00)</option>
                  <option value="afternoon">Afternoon Phase (12:00 - 17:00)</option>
                  <option value="evening">Evening Phase (17:00 - 22:00)</option>
                  <option value="night">Nocturnal Phase (22:00 - 06:00)</option>
                </select>
              </div>

              <div className="space-y-4 pt-4">
                <label className="flex items-center gap-4 cursor-pointer group p-3 rounded-2xl hover:bg-white/5 transition-colors">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-white/10 bg-white/5 text-indigo-500 focus:ring-indigo-500/50"
                    checked={formData.notificationSettings.studyReminders}
                    onChange={(e) => setFormData({
                      ...formData,
                      notificationSettings: { ...formData.notificationSettings, studyReminders: e.target.checked }
                    })}
                  />
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-tight">Active Reminders</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Study session triggers</p>
                  </div>
                </label>
                <label className="flex items-center gap-4 cursor-pointer group p-3 rounded-2xl hover:bg-white/5 transition-colors">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-white/10 bg-white/5 text-indigo-500 focus:ring-indigo-500/50"
                    checked={formData.notificationSettings.focusReminders}
                    onChange={(e) => setFormData({
                      ...formData,
                      notificationSettings: { ...formData.notificationSettings, focusReminders: e.target.checked }
                    })}
                  />
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-tight">Telemetry Audits</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Focus level logging reminders</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end pt-10 border-t border-white/5 mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`glass-btn-primary px-12 py-4 text-lg ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? 'Synchronizing...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
