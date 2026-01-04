import { useSite } from '../../context/SiteContext';
import { themes } from '../../data/themes'; // Make sure you created this file from the previous step

const ThemePanel = () => {
  const { siteData, changeTheme } = useSite();

  return (
    <div className="p-4 space-y-3 overflow-y-auto h-full">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
        Select A Theme
      </h3>
      
      {Object.entries(themes).map(([key, theme]) => (
        <button
          key={key}
          onClick={() => changeTheme(key)}
          className={`
            w-full relative p-3 rounded-xl border-2 text-left transition-all duration-200 group
            ${siteData.theme === key 
              ? 'border-blue-500 shadow-md ring-1 ring-blue-500' 
              : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'}
          `}
        >
          {/* This renders a mini preview of the theme's background */}
          <div className={`absolute inset-0 rounded-xl opacity-10 ${theme.classes} bg-cover!`}></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <span className="font-semibold text-gray-700 group-hover:text-blue-600">
              {theme.name}
            </span>
            {siteData.theme === key && (
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default ThemePanel;