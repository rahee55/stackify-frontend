import Navbar from '../components/layout/Navbar';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Shield, Bell, Moon } from 'lucide-react';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [theme, setTheme] = useState('light');
  
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-28 px-6 pb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Account Settings</h1>
        
        <div className="space-y-6">
          
          {/* Section: Profile */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="bg-indigo-50 p-2 rounded-lg"><User className="w-5 h-5 text-indigo-600" /></div>
              <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="group">
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Username</label>
                 <input type="text" disabled value={user?.username || 'Guest'} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-700 font-medium" />
               </div>
               <div className="group">
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                 <input type="email" disabled value={user?.email || 'guest@example.com'} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-700 font-medium" />
               </div>
            </div>
          </div>

          {/* Section: Preferences */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="bg-purple-50 p-2 rounded-lg"><Moon className="w-5 h-5 text-purple-600" /></div>
              <h2 className="text-lg font-bold text-slate-900">Appearance</h2>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Editor Theme</p>
                <p className="text-sm text-slate-500">Choose your preferred workspace appearance.</p>
              </div>
              <select 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)}
                className="border border-slate-200 bg-white p-2.5 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="system">System Default</option>
              </select>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;