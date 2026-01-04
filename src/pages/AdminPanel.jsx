import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { Check, X, ShieldAlert, Loader2 } from 'lucide-react';
import api from '../services/api'; // Ensure you have your axios instance imported

const AdminPanel = () => {
  const [pendingSites, setPendingSites] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data on Mount
  const fetchPendingSites = async () => {
    try {
      const res = await api.get('/admin/pending');
      setPendingSites(res.data);
    } catch (error) {
      console.error("Failed to load admin queue", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSites();
  }, []);

  // 2. Handle Approve/Reject
  const handleAction = async (id, action) => {
    try {
      // Optimistic UI Update: Remove from list immediately
      setPendingSites(prev => prev.filter(site => site._id !== id));

      // Call API
      await api.put(`/admin/action/${id}`, { action });
      
      // Optional: Show success toast here
      console.log(`Site ${action}d successfully`);
    } catch (error) {
      console.error(`Failed to ${action} site`, error);
      // Re-fetch if failed
      fetchPendingSites(); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-28 px-6 pb-10">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
           <div className="bg-red-100 p-2 rounded-lg">
             <ShieldAlert className="w-6 h-6 text-red-600" />
           </div>
           <div>
             <h1 className="text-3xl font-bold text-slate-900">Admin Console</h1>
             <p className="text-slate-500">Moderation queue for public showcase submissions.</p>
           </div>
        </div>
        
        {/* Main Content */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Pending Approvals</h3>
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
              {pendingSites.length} Items
            </span>
          </div>
          
          {loading ? (
            <div className="p-12 flex justify-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : pendingSites.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p>No pending sites to review. Good job</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                  <th className="p-5 font-bold">Site Title</th>
                  <th className="p-5 font-bold">Author</th>
                  <th className="p-5 font-bold">Submission Date</th>
                  <th className="p-5 font-bold">Status</th>
                  <th className="p-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pendingSites.map((site) => (
                  <tr key={site._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-5 font-bold text-slate-900">
                      {site.title}
                      {/* Optional: Add a link to preview the site */}
                      <a href={`/preview/${site._id}`} target="_blank" rel="noreferrer" className="block text-xs text-blue-500 hover:underline font-normal mt-1">
                        View Preview
                      </a>
                    </td>
                    <td className="p-5 text-sm text-slate-600">
                      {/* Check if userId is populated, otherwise show 'Unknown' */}
                      {site.userId?.name || site.userId?.email || 'Unknown User'}
                    </td>
                    <td className="p-5 text-sm text-slate-500">
                      {new Date(site.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-5">
                      <span className="bg-amber-50 text-amber-600 border border-amber-100 text-xs font-bold px-2 py-1 rounded-full capitalize">
                        {site.status}
                      </span>
                    </td>
                    <td className="p-5 flex justify-end gap-2">
                      <button 
                        onClick={() => handleAction(site._id, 'approve')}
                        className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleAction(site._id, 'reject')}
                        className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;