export const themes = {
  default: {
    name: "Clean Slate",
    classes: "bg-white text-gray-900",
    header: "bg-white border-b border-gray-100",
    button: "bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all hover:scale-105",
  },
  aurora: {
    name: "Aurora Borealis",
    // Animate-gradient is a custom class we will add to CSS
    classes: "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white animate-gradient bg-[length:200%_200%]",
    header: "bg-white/10 backdrop-blur-md border-b border-white/20",
    button: "bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all hover:scale-105",
    card: "bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl hover:bg-white/20 transition"
  },
  sunset: {
    name: "Golden Hour",
    classes: "bg-gradient-to-tr from-orange-100 via-amber-50 to-rose-100 text-gray-800",
    header: "bg-white/60 backdrop-blur-md border-b border-orange-200/50",
    button: "bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white shadow-lg shadow-orange-200 transition-all hover:-translate-y-1",
    card: "bg-white border border-orange-100 rounded-xl shadow-sm hover:shadow-orange-200/50 transition"
  },
  cyberpunk: {
    name: "Neon Nights",
    classes: "bg-gray-950 text-cyan-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-950 to-black",
    header: "bg-black/50 backdrop-blur-xl border-b border-cyan-500/30",
    button: "bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black shadow-[0_0_10px_#22d3ee] transition-all duration-300 uppercase tracking-wider font-bold",
    card: "bg-gray-900/80 border border-cyan-900/50 rounded-none hover:border-cyan-400/50 transition duration-500"
  }
};