import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, User, Mail, Lock, ArrowRight } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/dashboard');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[10%] right-[30%] w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-blob"></div>
         <div className="absolute bottom-[10%] left-[30%] w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-blob [animation-delay:4s]"></div>
      </div>

      <Link to="/" className="flex items-center gap-2 mb-8 relative z-10">
        <div className="bg-linear-to-tr from-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-slate-900">Stackify</span>
      </Link>

      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-indigo-500/10 border border-white/50 w-full max-w-md relative z-10 animate-fade-in">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">Create Account</h2>
        <p className="text-slate-500 text-center mb-8">Start building websites with AI today.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                placeholder="tariqcoder55"
                value={username} onChange={(e) => setUsername(e.target.value)} 
                required
              />
            </div>
          </div>
          
          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="email" 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                placeholder="rahee.programmer@gmail.com"
                value={email} onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="password" 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)} 
                required
              />
            </div>
          </div>

          <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 transition-all flex items-center justify-center gap-2 group mt-2">
            Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;