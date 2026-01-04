import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Monitor, Smartphone, Tablet, ExternalLink,
  ChevronLeft, Terminal, CheckCircle2, Loader2,
  Maximize2, Minimize2, RefreshCw, AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { generateWebsite, createSite } from '../services/aiService';

const Preview = () => {
  const { siteId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [device, setDevice] = useState('desktop');
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const [currentPath, setCurrentPath] = useState('/'); 
  const [toast, setToast] = useState(null); 

  const processingRef = useRef(false);

  useEffect(() => {
    const loadSite = async () => {
      let data = null;

      if (siteId === 'generating') {
        if (processingRef.current) return;
        processingRef.current = true;

        const prompt = location.state?.prompt;
        
        if (!prompt) {
          navigate('/'); 
          return;
        }

        try {
          setLogs(prev => [...prev, { text: 'Initializing AI agent...', type: 'info' }]);
          
          const aiResponse = await generateWebsite(prompt);
          setLogs(prev => [...prev, { text: 'Layout generated.', type: 'success' }]);

          const newSite = await createSite({
            title: aiResponse.title || "New Project",
            prompt: prompt,
            blocks: aiResponse.blocks || []
          });

          window.history.replaceState(null, '', `/preview/${newSite._id}`);

          data = { ...newSite, blocks: aiResponse.blocks };
          
          setLogs(prev => [...prev, { text: 'Database record created.', type: 'success' }]);
          simulateBuildProcess(["Optimizing assets...", "Finalizing DOM..."]);

        } catch (error) {
          console.error("Generation failed:", error);
          setLogs(prev => [...prev, { text: 'Generation failed.', type: 'error' }]);
          setLoading(false);
          return;
        }
      }

      else if (location.state?.siteData) {
        data = location.state.siteData;
        simulateBuildProcess(data.steps || ["Building..."]);
      } else {
        try {
          const res = await api.get(`/sites/${siteId}`);
          data = res.data;
          setLogs([{ text: 'Source loaded.', type: 'success' }]);
        } catch (err) {
          console.error(err);
          setLogs([{ text: 'Connection failed.', type: 'error' }]);
        }
      }

      if (data) {
        // Ensure blocks exist
        const normalizedBlocks = data.blocks || 
                                (typeof data.content === 'string' 
                                  ? [{ id: 'main', code: data.content, path: '/' }] 
                                  : data.content?.blocks || []);
        
        setSiteData({ ...data, blocks: normalizedBlocks });
      }
      setLoading(false);
    };
    loadSite();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId, location.state]);

  useEffect(() => {
    const handleIframeMessage = (event) => {
      if (!event.data || event.data.type !== 'PREVIEW_NAVIGATE') return;

      const targetPath = event.data.path;

      handleNavigation(targetPath);
    };

    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteData]);

  const handleNavigation = (path) => {
    console.log(`User navigating to: ${path}`);
    setCurrentPath(path); // Update URL bar only (iframe handles its own view)
    showToast(`Mapsd to: ${path}`);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const simulateBuildProcess = (steps) => {
    let delay = 0;
    if (siteId !== 'generating') setLogs([]);
    
    steps.forEach((step, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, { text: step, type: 'info' }]);
        if (index === steps.length - 1) {
          setTimeout(() => setLogs(prev => [...prev, { text: 'Build complete.', type: 'success' }]), 500);
        }
      }, delay);
      delay += 800;
    });
  };

  // --- MEMOIZED HTML GENERATION (Prevents Reloads) ---
  const iframeHtml = useMemo(() => {
    if (!siteData?.blocks) return '';

    // Wrap blocks in divs with IDs for the internal router to find
    const bodyContent = siteData.blocks.map(b => 
      `<div id="block-${b.id}" data-block-id="${b.id}" class="site-block">${b.code}</div>`
    ).join('');
    
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.tailwindcss.com"></script>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');
            body { font-family: 'Inter', sans-serif; }
            ::-webkit-scrollbar { width: 0px; background: transparent; }
            /* Smooth fade for page transitions */
            .site-block { transition: opacity 0.3s ease; animation: fadeIn 0.4s ease-out; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          </style>
          
          <script>
            // --- INTERNAL ROUTER ---
            function renderRoute(path) {
              const cleanPath = path.replace('/', '').toLowerCase() || 'home';
              const blocks = document.querySelectorAll('.site-block');
              
              blocks.forEach(block => {
                const id = block.getAttribute('data-block-id').toLowerCase();
                
                // 1. ALWAYS SHOW: Nav, Header, Footer
                if (id.includes('nav') || id.includes('footer') || id.includes('header')) {
                  block.style.display = 'block';
                  return;
                }
                
                // 2. HOME PAGE LOGIC (/)
                if (cleanPath === 'home' || cleanPath === 'index') {
                  // Show "Main" sections (Hero, Features, Testimonials)
                  // Hide specific "Standalone Pages" (Contact, About, Pricing - if they are separate)
                  if (id.includes('contact') || id.includes('about') || id.includes('privacy') || id.includes('login') || id.includes('register')) {
                     block.style.display = 'none'; 
                  } else {
                     block.style.display = 'block';
                  }
                } 
                // 3. SUB-PAGE LOGIC (e.g. /contact)
                else {
                  // Show ONLY if the block ID matches the path
                  if (id.includes(cleanPath)) {
                    block.style.display = 'block';
                  } else {
                    block.style.display = 'none';
                  }
                }
              });
              
              window.scrollTo(0,0);
            }

            document.addEventListener('DOMContentLoaded', () => {
              // Initial Render
              renderRoute('/');

              document.body.addEventListener('click', (e) => {
                const link = e.target.closest('a');
                if (!link) return;
                
                const href = link.getAttribute('href');
                if (!href) return;

                if (href.startsWith('http')) {
                  link.setAttribute('target', '_blank');
                  return;
                }

                e.preventDefault();
                
                // Normalize Path
                let targetPath = href;
                if (href.startsWith('#')) {
                   const id = href.substring(1);
                   targetPath = (id === '' || id === 'top') ? '/' : '/' + id;
                }

                // 1. Update Internal View (SPA Feel)
                renderRoute(targetPath);

                // 2. Notify Parent (Update URL Bar)
                window.parent.postMessage({ 
                  type: 'PREVIEW_NAVIGATE', 
                  path: targetPath 
                }, '*');
              });
            });
          </script>
        </head>
        <body>
          ${bodyContent}
        </body>
      </html>
    `;
  }, [siteData]); // Only re-run if siteData changes, NOT when currentPath changes

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white font-sans overflow-hidden selection:bg-indigo-500/30">

      {/* --- LEFT SIDEBAR --- */}
      <div className={`
          flex flex-col border-r border-[#2A2A2A] bg-[#0A0A0A] transition-all duration-300 ease-in-out shrink-0
          ${isFullScreen ? 'w-0 opacity-0 overflow-hidden' : 'w-[320px] opacity-100'}
        `}>
        
        <div className="h-12 flex items-center px-4 border-b border-[#2A2A2A] gap-3">
          <Link to="/dashboard" className="text-[#888] hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <span className="font-semibold text-xs tracking-wide text-gray-200 uppercase">Project Board</span>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="p-4 border-b border-[#2A2A2A]">
             <h3 className="text-[10px] uppercase text-[#666] font-bold tracking-wider mb-2">Instructions</h3>
             <div className="text-sm text-[#CCC] leading-relaxed font-light">
               {siteData?.prompt || (siteId === 'generating' ? location.state?.prompt : "Loading project configuration...")}
             </div>
          </div>

          <div className="flex-1 p-4 bg-[#0A0A0A]">
            <h3 className="text-[10px] uppercase text-[#666] font-bold tracking-wider mb-3 flex items-center gap-2">
              <Terminal className="w-3 h-3" /> Terminal
            </h3>
            <div className="space-y-3 font-mono text-[11px]">
              {loading && logs.length === 0 && <div className="text-blue-400 animate-pulse">Initializing environment...</div>}
              {logs.map((log, idx) => (
                <div key={idx} className={`flex items-start gap-2.5 animate-fade-in ${
                  log.type === 'success' ? 'text-emerald-400' : 
                  log.type === 'error' ? 'text-red-400' : 'text-[#888]'
                }`}>
                  {log.type === 'success' ? <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0" /> : 
                   <div className="w-1.5 h-1.5 rounded-full bg-[#444] mt-1.5"/>}
                  <span>{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT PREVIEW AREA --- */}
      <div className="flex-1 flex flex-col bg-[#0E0E0E] relative min-w-0">

        {/* Browser Toolbar */}
        <div className="h-12 border-b border-[#2A2A2A] flex items-center justify-between px-4 bg-[#0A0A0A]">
          <div className="flex items-center gap-3 flex-1">
             <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-1.5 text-[#666] hover:text-white rounded hover:bg-[#222] transition-colors">
               {isFullScreen ? <Minimize2 className="w-4 h-4"/> : <Maximize2 className="w-4 h-4"/>}
             </button>
             
             {/* Dynamic URL Bar */}
             <div className="bg-[#151515] border border-[#2A2A2A] rounded flex items-center px-3 py-1.5 gap-2 w-full max-w-md group focus-within:border-[#444] transition-colors">
                <RefreshCw className="w-3 h-3 text-[#444] group-hover:text-[#888] transition-colors cursor-pointer" />
                <span className="text-xs text-[#666] font-mono truncate">localhost:3000{currentPath}</span>
             </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center bg-[#151515] rounded-md border border-[#2A2A2A] p-0.5">
                <button onClick={() => setDevice('desktop')} className={`p-1.5 rounded text-[#888] transition-all ${device === 'desktop' ? 'bg-[#2A2A2A] text-white shadow-sm' : 'hover:text-[#CCC]'}`}>
                  <Monitor className="w-4 h-4" />
                </button>
                <button onClick={() => setDevice('tablet')} className={`p-1.5 rounded text-[#888] transition-all ${device === 'tablet' ? 'bg-[#2A2A2A] text-white shadow-sm' : 'hover:text-[#CCC]'}`}>
                  <Tablet className="w-4 h-4" />
                </button>
                <button onClick={() => setDevice('mobile')} className={`p-1.5 rounded text-[#888] transition-all ${device === 'mobile' ? 'bg-[#2A2A2A] text-white shadow-sm' : 'hover:text-[#CCC]'}`}>
                  <Smartphone className="w-4 h-4" />
                </button>
             </div>
             
             <button className="bg-white text-black hover:bg-[#EEE] px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-2">
                <ExternalLink className="w-3 h-3" /> Deploy
             </button>
          </div>
        </div>

        {/* Viewport Stage */}
        <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-[#0E0E0E]">
           
           {/* Toast Notification (Simulates Page Load) */}
           {toast && (
             <div className="absolute top-4 z-50 bg-[#222] text-white text-xs px-4 py-2 rounded-full border border-white/10 shadow-xl flex items-center gap-2 animate-fade-in-down">
               <AlertCircle className="w-3 h-3 text-blue-400" />
               {toast}
             </div>
           )}

           {loading ? (
             <div className="flex flex-col items-center gap-4">
               <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
               <span className="text-xs text-[#666] font-mono uppercase tracking-widest">Building Application...</span>
             </div>
           ) : (
             <div className={`
                transition-all duration-500 ease-in-out bg-white shadow-2xl relative overflow-hidden
                ${device === 'mobile' ? 'w-[375px] h-[667px] rounded-4xl border-8 border-[#222]' : ''}
                ${device === 'tablet' ? 'w-3xl h-[1024px] rounded-[20px] border-8 border-[#222] scale-75' : ''}
                ${device === 'desktop' ? 'w-full h-full border-0' : ''}
              `}>
                <iframe 
                  title="Preview"
                  srcDoc={iframeHtml}
                  className="w-full h-full border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin"
                />
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default Preview;