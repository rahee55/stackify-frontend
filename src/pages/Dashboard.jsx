import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { 
  Plus, Trash2, ExternalLink, Edit3, Globe, 
  Loader2, Clock, CheckCircle, AlertCircle, 
  Layout, Eye, Share2 
} from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch User's Sites
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await api.get('/sites'); // Calls getUserSites
        setSites(res.data);
      } catch (error) {
        console.error("Failed to load sites", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSites();
  }, []);

  // 2. Delete Site Handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;
    try {
      await api.delete(`/sites/${id}`);
      setSites(sites.filter(site => site._id !== id)); // Update UI instantly
    } catch (error) {
      alert("Failed to delete site");
    }
  };

  // 3. Submit for Showcase Handler
  const handleSubmitToShowcase = async (id) => {
    try {
      // Optimistic Update
      setSites(sites.map(site => 
        site._id === id ? { ...site, status: 'pending' } : site
      ));
      
      await api.put(`/sites/${id}/submit`);
      alert("Site submitted for review! Check back soon.");
    } catch (error) {
      alert("Failed to submit site.");
      window.location.reload();
    }
  };

  // 4. Calculate Stats
  const totalSites = sites.length;
  const publicSites = sites.filter(site => site.status === 'approved').length;
  const totalViews = sites.reduce((acc, site) => acc + (site.views || 0), 0);

  // Helper to render Status Badge
  const renderStatus = (status) => {
    switch(status) {
      case 'approved': return <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full"><CheckCircle className="w-3 h-3" /> Live</span>;
      case 'pending': return <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full"><Clock className="w-3 h-3" /> Under Review</span>;
      case 'rejected': return <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full"><AlertCircle className="w-3 h-3" /> Rejected</span>;
      default: return <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Draft</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-28 px-6 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Your Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage your projects, track views, and publish to showcase.</p>
          </div>
          <Link to="/" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-200">
            <Plus className="w-5 h-5 cursor-pointer" /> Create New Site
          </Link>
        </div>

        {/* --- STATS SUMMARY SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Total Sites */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="bg-blue-50 p-4 rounded-xl text-blue-600">
              <Layout className="w-8 h-8" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-semibold">Total Projects</p>
              <h3 className="text-3xl font-bold text-slate-900">{totalSites}</h3>
            </div>
          </div>

          {/* Card 2: Public Sites */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="bg-green-50 p-4 rounded-xl text-green-600">
              <Share2 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-semibold">Live on Showcase</p>
              <h3 className="text-3xl font-bold text-slate-900">{publicSites}</h3>
            </div>
          </div>

          {/* Card 3: Total Views */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="bg-amber-50 p-4 rounded-xl text-amber-600">
              <Eye className="w-8 h-8" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-semibold">Total Views</p>
              <h3 className="text-3xl font-bold text-slate-900">{totalViews}</h3>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <h3 className="text-xl font-bold text-slate-800 mb-6">Recent Projects</h3>
        
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
        ) : sites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No websites yet</h3>
            <p className="text-slate-500 mb-6">Start by creating your first AI-generated website.</p>
            <Link to="/create" className="text-indigo-600 font-medium hover:underline">Create Now &rarr;</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <div key={site._id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                
                {/* Card Header */}
                <div className="h-40 bg-slate-100 relative border-b border-slate-100 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-tr from-slate-100 to-slate-50" />
                  <Globe className="w-12 h-12 text-slate-300 relative z-10" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 z-20">
                    {renderStatus(site.status)}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-slate-900 mb-1 truncate">{site.title || "Untitled Site"}</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{site.prompt}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex gap-3">
                      <Link to={`/preview/${site._id}`} className="text-slate-600 hover:text-indigo-600 text-sm font-medium flex items-center gap-1">
                        <Edit3 className="w-4 h-4" /> Edit
                      </Link>
                      <a href={`/preview/${site._id}`} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-indigo-600 text-sm font-medium flex items-center gap-1">
                        <ExternalLink className="w-4 h-4" /> View
                      </a>
                    </div>
                    
                    <button 
                      onClick={() => handleDelete(site._id)} 
                      className="text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete Site"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Submit for Showcase Button */}
                  <div className="mt-4">
                    {site.status === 'draft' || site.status === 'rejected' ? (
                      <button 
                        onClick={() => handleSubmitToShowcase(site._id)}
                        className="w-full text-center text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-2 rounded-lg transition-colors border border-indigo-100"
                      >
                        Submit to Public Showcase
                      </button>
                    ) : site.status === 'pending' ? (
                      <button disabled className="w-full text-center text-xs font-bold text-slate-400 bg-slate-50 py-2 rounded-lg cursor-not-allowed border border-slate-100">
                        Waiting for Approval...
                      </button>
                    ) : (
                      <button disabled className="w-full text-center text-xs font-bold text-green-600 bg-green-50 py-2 rounded-lg cursor-not-allowed border border-green-100">
                        Site is Live on Showcase!
                      </button>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;