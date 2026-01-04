import Navbar from '../components/layout/Navbar';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
// Removed aiService imports because we aren't using them here anymore
import { Sparkles, ArrowRight, Loader2, Zap, Palette, Code } from 'lucide-react';

const Home = () => {
  const [prompt, setPrompt] = useState('');
  // We don't strictly need isGenerating for the API anymore, 
  // but it's good for preventing double-clicks
  const [isGenerating, setIsGenerating] = useState(false); 
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    if (!user) { navigate('/register'); return; }

    setIsGenerating(true);

    // 1. Navigate IMMEDIATELY. 
    // We send the user to a "generating" state on the preview page.
    // We pass the prompt in 'state' so the Preview page can read it and start the API call.
    navigate('/preview/generating', { 
      state: { 
        prompt: prompt,
        isNewGeneration: true 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      <Navbar />

      <div className="relative pt-32 pb-20 px-4 text-center max-w-5xl mx-auto z-10">

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-indigo-100 backdrop-blur-sm text-indigo-600 text-sm font-semibold mb-8 animate-fade-in shadow-sm">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Website Builder v2.0</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 animate-fade-in">
          Build websites like <br />
          <span className="text-gradient">magic, not code.</span>
        </h1>

        <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in">
          Describe your dream website in plain English. Our advanced AI engine designs, builds, and deploys it in seconds.
        </p>

        <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-2xl shadow-indigo-500/10 border border-slate-200 flex items-center gap-2 animate-fade-in hover:border-indigo-300 transition-colors group">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            disabled={isGenerating}
            placeholder="Describe your site (e.g., 'A portfolio for a photographer')"
            className="flex-1 p-4 text-lg outline-none bg-transparent placeholder-slate-400 text-slate-800 disabled:opacity-50"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 flex items-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>Starting... <Loader2 className="w-5 h-5 animate-spin" /></>
            ) : (
              <>Generate <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 animate-fade-in [animation-delay:0.4s]">
          {[
            { icon: Zap, title: "Lightning Fast", desc: "Generated in under 30 seconds." },
            { icon: Palette, title: "Modern Themes", desc: "Beautiful, responsive layouts." },
            { icon: Code, title: "Export Code", desc: "Download React + Tailwind code." }
          ].map((feature, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-white/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-left">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Home;