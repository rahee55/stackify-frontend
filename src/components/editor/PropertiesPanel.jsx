import { useSite } from '../../context/SiteContext';

const PropertiesPanel = () => {
  const { selectedBlock, updateBlock } = useSite();

  if (!selectedBlock) {
    return (
      <div className="p-4 text-gray-500 text-center text-sm">
        Select an element on the canvas to edit its properties.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-bold text-gray-700 border-b pb-2">Edit {selectedBlock.type}</h3>
      
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Content</label>
        <textarea 
          className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          rows={3}
          value={selectedBlock.content}
          onChange={(e) => updateBlock(selectedBlock.id, { content: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Text Color</label>
        <input 
          type="color" 
          className="w-full h-8 cursor-pointer"
          value={selectedBlock.styles.color || '#000000'}
          onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, color: e.target.value } })}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Background</label>
        <input 
          type="color" 
          className="w-full h-8 cursor-pointer"
          value={selectedBlock.styles.backgroundColor || '#ffffff'}
          onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, backgroundColor: e.target.value } })}
        />
      </div>
    </div>
  );
};

export default PropertiesPanel;