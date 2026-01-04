const DraggableBlock = ({ type, label, onAdd }) => {
  return (
    <div 
      className="p-3 mb-2 bg-white border border-gray-200 rounded cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition shadow-sm flex items-center gap-2"
      onClick={() => onAdd(type)} // Simplified click-to-add for now
      draggable
    >
      <span className="font-medium text-gray-700">{label}</span>
    </div>
  );
};

export default DraggableBlock;