import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { Check, X, ShieldAlert, Loader2, Trash2, Eye, LayoutGrid, ListChecks, Calendar, User } from 'lucide-react';
import api from '../services/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'showcase'
  const [pendingSites, setPendingSites] = useState([]);
  const [showcaseSites, setShowcaseSites] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH DATA (Dynamic based on Tab) ---
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'pending') {
        const res = await api.get('/admin/pending');
        setPendingSites(res.data);
      } else {
        // Fetch Approved/Showcase Sites
        const res = await api.get('/admin/showcase');
        setShowcaseSites(res.data);
      }
    } catch (error) {
      console.error("Failed to load admin data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // --- 2. ACTIONS ---
  
  const handleApproval = async (id, action) => {
    try {
      // Optimistic Update
      setPendingSites(prev => prev.filter(site => site._id !== id));
      await api.put(`/admin/action/${id}`, { action });
    } catch (error) {
      console.error(`Failed to ${action} site`, error);
      fetchData(); 
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this site from the showcase?")) return;
    
    try {
      // Optimistic Update
      setShowcaseSites(prev => prev.filter(site => site._id !== id));
      await api.delete(`/admin/site/${id}`);
    } catch (error) {
      console.error("Failed to delete site", error);
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-28 px-6 pb-10">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
           <div className="bg-indigo-100 p-2 rounded-lg">
             <ShieldAlert className="w-8 h-8 text-indigo-700" />
           </div>
           <div>
             <h1 className="text-3xl font-bold text-slate-900">Admin Console</h1>
             <p className="text-slate-500">Manage submissions and live showcase content.</p>
           </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`pb-3 px-2 flex items-center gap-2 font-medium transition-all ${activeTab === 'pending' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <ListChecks className="w-4 h-4" /> 
            Pending Approvals
            {pendingSites.length > 0 && <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{pendingSites.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('showcase')}
            className={`pb-3 px-2 flex items-center gap-2 font-medium transition-all ${activeTab === 'showcase' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <LayoutGrid className="w-4 h-4" /> 
            Live Showcase
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{showcaseSites.length}</span>
          </button>
        </div>
        
        {/* Main Content Area */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="p-12 flex justify-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <>
              {/* --- VIEW 1: PENDING APPROVALS (Table View) --- */}
              {activeTab === 'pending' && (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="p-5 font-bold">Project Name</th>
                      <th className="p-5 font-bold">Author</th>
                      <th className="p-5 font-bold">Date Submitted</th>
                      <th className="p-5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {pendingSites.length === 0 ? (
                      <tr><td colSpan="4" className="p-12 text-center text-slate-500">No pending requests. All caught up!</td></tr>
                    ) : pendingSites.map((site) => (
                      <tr key={site._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-5">
                          <div className="font-bold text-slate-900">{site.title || "Untitled Project"}</div>
                          <div className="text-xs text-slate-500 mt-1 line-clamp-1">{site.prompt}</div>
                          <a href={`/preview/${site._id}`} target="_blank" className="text-xs text-indigo-500 hover:underline mt-1 inline-block">View Preview</a>
                        </td>
                        <td className="p-5 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">
                              {site.userId?.name?.charAt(0) || 'U'}
                            </div>
                            {site.userId?.name || 'Unknown User'}
                          </div>
                        </td>
                        <td className="p-5 text-sm text-slate-500">{new Date(site.createdAt).toLocaleDateString()}</td>
                        <td className="p-5 flex justify-end gap-2">
                          <button onClick={() => handleApproval(site._id, 'approve')} className="bg-green-50 text-green-600 p-2 rounded hover:bg-green-100 transition-colors" title="Approve"><Check className="w-4 h-4" /></button>
                          <button onClick={() => handleApproval(site._id, 'reject')} className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-100 transition-colors" title="Reject"><X className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* --- VIEW 2: MANAGE SHOWCASE (Grid View) --- */}
              {activeTab === 'showcase' && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {showcaseSites.length === 0 ? (
                    <div className="col-span-full text-center text-slate-500 py-20 flex flex-col items-center">
                      <LayoutGrid className="w-12 h-12 text-slate-300 mb-3" />
                      <p>No live sites in the showcase yet.</p>
                      <button onClick={() => setActiveTab('pending')} className="text-indigo-600 text-sm font-bold mt-2 hover:underline">Go approve some!</button>
                    </div>
                  ) : showcaseSites.map((site) => (
                    <div key={site._id} className="group border border-slate-200 rounded-xl p-4 flex flex-col hover:shadow-lg hover:border-indigo-100 transition-all bg-white">
                      {/* Card Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                           <LayoutGrid className="w-5 h-5" />
                        </div>
                        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
                        </span>
                      </div>

                      {/* Card Body */}
                      <h3 className="font-bold text-slate-900 truncate text-lg mb-1">{site.title || "Untitled Site"}</h3>
                      <p className="text-xs text-slate-500 mb-4 line-clamp-2 h-8">{site.prompt}</p>
                      
                      {/* Meta Data */}
                      <div className="flex flex-col gap-2 mt-auto border-t border-slate-100 pt-3 mb-4">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <User className="w-3 h-3" /> {site.userId?.name || 'Unknown'}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar className="w-3 h-3" /> {new Date(site.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <a 
                          href={`/preview/${site._id}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex-1 bg-slate-50 text-slate-700 text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                        >
                          <Eye className="w-3 h-3" /> View
                        </a>
                        <button 
                          onClick={() => handleDelete(site._id)}
                          className="flex-1 bg-white border border-red-100 text-red-600 text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;