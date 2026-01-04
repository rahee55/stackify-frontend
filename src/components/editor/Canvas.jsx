import { useSite } from '../../context/SiteContext';
import { themes } from '../../data/themes'; // Import your themes data

const Canvas = () => {
  const { siteData, setSelectedBlockId, selectedBlock } = useSite();

  // 1. Get current theme object (default to 'default' if missing)
  const currentTheme = themes[siteData.theme] || themes.default;

  return (
    // 2. Apply the theme.classes to the main container
    <div 
      className={`min-h-[800px] w-full max-w-4xl mx-auto p-10 shadow-xl transition-all duration-500 ease-in-out ${currentTheme.classes}`}
      onClick={() => setSelectedBlockId(null)}
    >
      {/* Example Navigation Bar using theme styles */}
      <div className={`mb-10 p-4 rounded-xl flex justify-between items-center ${currentTheme.header}`}>
        <span className="font-bold text-xl tracking-tight">My Brand</span>
        <button className={`px-5 py-2 rounded-lg font-medium text-sm ${currentTheme.button}`}>
          Contact Us
        </button>
      </div>

      {siteData.blocks.map((block) => (
        <div 
          key={block.id}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedBlockId(block.id);
          }}
          className={`
            p-4 mb-6 border-2 relative transition-all duration-200
            ${selectedBlock?.id === block.id ? 'border-blue-400 ring-2 ring-blue-200 ring-offset-2' : 'border-transparent'}
            ${currentTheme.card || ''} /* Apply theme card styles if they exist */
          `}
          style={block.styles}
        >
           {block.type === 'header' && <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{block.content}</h1>}
           {block.type === 'text' && <p className="text-lg leading-relaxed opacity-90">{block.content}</p>}
           
           {block.type === 'image' && (
             <div className="bg-black/5 h-64 rounded-xl flex items-center justify-center text-sm font-medium opacity-50 border-2 border-dashed border-current">
               Image Placeholder
             </div>
           )}
           
           {block.type === 'footer' && (
             <footer className="mt-8 pt-8 border-t border-current opacity-60 text-sm text-center">
               {block.content}
             </footer>
           )}
        </div>
      ))}

      {siteData.blocks.length === 0 && (
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-current opacity-30 rounded-xl">
          <p>Drag blocks here to start building</p>
        </div>
      )}
    </div>
  );
};

export default Canvas;