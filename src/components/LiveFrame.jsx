import React, { useMemo, useState, useEffect } from 'react';

const LiveFrame = ({ siteId, title = "Preview" }) => {
  const [code, setCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch the data from your backend when siteId changes
  useEffect(() => {
    if (!siteId) return;

    const fetchSiteCode = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace this URL with your actual backend endpoint
        const response = await fetch(`https://your-api.com/sites/${siteId}`);
        
        if (!response.ok) throw new Error('Failed to load site data');
        
        const data = await response.json();
        
        // Assuming your backend returns { html: "<div>...</div>" }
        setCode(data.html); 
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteCode();
  }, [siteId]);

  // 2. Memoize the srcDoc (Injecting the fetched code)
  const srcDoc = useMemo(() => {
    // Default content if loading or error
    let content = code;
    
    // If no code is loaded yet, handled by the UI overlay below, 
    // but we ensure the iframe isn't empty:
    if (!content) content = ''; 

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
          <style>
            html { scroll-behavior: smooth; }
            body { font-family: 'Inter', sans-serif; }
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
          </style>
        </head>
        <body class="bg-white">
          ${content}
        </body>
      </html>
    `;
  }, [code]);

  return (
    <div className="w-full h-full bg-white relative overflow-hidden border rounded-lg shadow-sm">
      
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <p className="text-red-500 px-4 text-center">Error: {error}</p>
        </div>
      )}

      {/* The Iframe */}
      <iframe
        title={title}
        srcDoc={srcDoc}
        className="w-full h-full border-none"
        // sandboxing: allow-scripts is needed for Tailwind CDN to work
        sandbox="allow-scripts allow-same-origin" 
      />
    </div>
  );
};

export default LiveFrame;