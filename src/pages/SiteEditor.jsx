import { Link, useParams } from 'react-router-dom';
import { useState } from 'react'; 
import { useSite } from '../context/SiteContext'; 
import Canvas from '../components/editor/Canvas';
import PropertiesPanel from '../components/editor/PropertiesPanel';
import DraggableBlock from '../components/editor/DraggableBlock';
import ThemePanel from '../components/editor/ThemePanel'; 
import { ArrowLeft, Save, Eye, Layers, Palette } from 'lucide-react';

const EditorLayout = () => {
  const { addBlock } = useSite();
  const { siteId } = useParams();
  const [activeTab, setActiveTab] = useState('blocks');

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 font-sans">
      
      {/* Top Bar */}
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20 shadow-sm">
        <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-6 w-px bg-slate-200"></div>
            <span className="font-bold text-slate-800">Editing Site #{siteId}</span>
        </div>
        <div className="flex items-center gap-3">
            <Link to={`/preview/${siteId}`} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 px-4 py-2 hover:bg-indigo-50 rounded-lg transition-colors">
              <Eye className="w-4 h-4" /> Preview
            </Link>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar */}
        <div className="w-72 bg-white border-r border-slate-200 flex flex-col z-10">
          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            <button 
              onClick={() => setActiveTab('blocks')}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'blocks' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4" /> Blocks
            </button>
            <button 
              onClick={() => setActiveTab('themes')}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'themes' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Palette className="w-4 h-4" /> Themes
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/30">
            {activeTab === 'blocks' ? (
              <div className="space-y-3">
                <DraggableBlock type="header" label="Header Section" onAdd={addBlock} />
                <DraggableBlock type="text" label="Text Content" onAdd={addBlock} />
                <DraggableBlock type="image" label="Image Area" onAdd={addBlock} />
                <DraggableBlock type="footer" label="Footer" onAdd={addBlock} />
              </div>
            ) : (
              <ThemePanel />
            )}
          </div>
        </div>

        {/* Center Canvas Area */}
        <div className="flex-1 overflow-y-auto bg-slate-100/50 p-8 relative flex justify-center">
           <Canvas />
        </div>

        {/* Right Sidebar: Properties */}
        <div className="w-72 bg-white border-l border-slate-200 flex flex-col z-10">
          <div className="p-4 border-b border-slate-100 font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
            Properties
          </div>
          <div className="flex-1 overflow-y-auto p-0">
             <PropertiesPanel />
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditorLayout;