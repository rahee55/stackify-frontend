import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SiteEditor from './pages/SiteEditor';
import Showcase from './pages/Showcase';
import Register from './pages/SignUp';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import AdminRoute from './components/auth/AdminRoute';
import Preview from './pages/Preview';

// const Preview = () => <div>Preview Page</div>; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/editor/:siteId" element={<SiteEditor />} />
          <Route path="/preview/:siteId" element={<Preview />} />
          <Route path="/explore" element={<Showcase />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              
                <AdminPanel />
              
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;