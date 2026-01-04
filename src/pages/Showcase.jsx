import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { Layers, Eye, Calendar, Clock, ExternalLink, Copy, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Showcase = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Sites');
  const [cloningId, setCloningId] = useState(null); // Track which site is being cloned
  const navigate = useNavigate();

  const categories = ['All Sites', 'Portfolio', 'Landing Page', 'E-commerce', 'Business'];

  // 1. Fetch Public Sites
  useEffect(() => {
    const fetchShowcase = async () => {
      try {
        const res = await api.get('/sites/public');
        setSites(res.data);
      } catch (error) {
        console.error("Failed to load showcase", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShowcase();
  }, []);

  // 2. Clone Handler
  const handleClone = async (siteId) => {
    // Check if user is logged in (you might need a better check depending on your auth state)
    if (!localStorage.getItem('token')) {
      alert("Please login to clone sites!");
      navigate('/login');
      return;
    }

    try {
      setCloningId(siteId); // Show loading spinner on button
      const res = await api.post(`/sites/${siteId}/clone`);
      
      // Redirect user to their dashboard to see the new site
      navigate('/dashboard'); 
      alert("Site cloned! You can now edit it in your dashboard.");
    } catch (error) {
      alert("Failed to clone site.");
    } finally {
      setCloningId(null);
    }
  };

  // Helper: Guess Category based on Title/Prompt (Simple tagging logic)
  const getCategory = (site) => {
    const text = (site.title + site.prompt).toLowerCase();
    if (text.includes('portfolio') || text.includes('resume')) return 'Portfolio';
    if (text.includes('shop') || text.includes('store') || text.includes('ecommerce')) return 'E-commerce';
    if (text.includes('landing') || text.includes('startup')) return 'Landing Page';
    return 'Business';
  };

  // Filter Logic
  const filteredSites = activeTab === 'All Sites' 
    ? sites 
    : sites.filter(site => getCategory(site) === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Site <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">Showcase</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Explore beautiful, AI-generated sites created by our community. Clone them to start your own project.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === cat 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Layout */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          </div>
        ) : filteredSites.length === 0 ? (
          <div className="text-center text-slate-400 py-10">No sites found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSites.map((site) => (
              <div key={site._id} className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                
                {/* Card Image Placeholder */}
                <div className="h-48 bg-slate-50 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] bg-size-[16px_16px]"></div>
                  
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 z-10 group-hover:scale-110 transition-transform duration-500">
                    <Layers className="w-8 h-8 text-indigo-500" />
                  </div>
                  
                  {/* Overlay Button */}
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link 
                      to={`/preview/${site._id}`}
                      className="bg-white text-slate-900 px-6 py-2.5 rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                    >
                      View Details <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{site.title}</h3>
                     <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                       {getCategory(site)}
                     </span>
                  </div>
                  
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-2">{site.prompt}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {new Date(site.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                         by {site.userId?.name || 'Unknown'}
                      </span>
                    </div>

                    <button 
                      onClick={() => handleClone(site._id)}
                      disabled={cloningId === site._id}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1 disabled:opacity-50"
                    >
                      {cloningId === site._id ? (
                        <>Cloning... <Loader2 className="w-3 h-3 animate-spin"/></>
                      ) : (
                        <>Clone Site <Copy className="w-3 h-3" /></>
                      )}
                    </button>
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

export default Showcase;