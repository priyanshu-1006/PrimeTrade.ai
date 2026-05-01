import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, UserCircle } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">PrimeTrade</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
              <UserCircle className="w-5 h-5 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">{user.email}</span>
              {user.role === 'ADMIN' && (
                <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-primary-100 text-primary-700 rounded uppercase">Admin</span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
