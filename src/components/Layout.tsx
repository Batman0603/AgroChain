import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Home, Package, BarChart3, ShoppingCart, Truck } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  const getNavItems = () => {
    switch (user?.role) {
      case 'farmer':
        return [
          { icon: Home, label: 'Dashboard', path: '/dashboard' },
          { icon: Package, label: 'My Produce', path: '/produce' },
        ];
      case 'wholesaler':
      case 'retailer':
        return [
          { icon: Home, label: 'Dashboard', path: '/dashboard' },
          { icon: Truck, label: 'Verify Produce', path: '/verify' },
        ];
      case 'consumer':
        return [
          { icon: Home, label: 'Home', path: '/dashboard' },
          { icon: ShoppingCart, label: 'Verify Product', path: '/verify' },
        ];
      case 'admin':
        return [
          { icon: Home, label: 'Dashboard', path: '/dashboard' },
          { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      <nav className="bg-white shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-green-800">AgroChain</span>
              </div>
              
              <div className="hidden md:flex space-x-6">
                {getNavItems().map((item) => (
                  <button
                    key={item.label}
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="h-5 w-5" />
                <span className="font-medium">{user?.name}</span>
                <span className="text-sm text-gray-500 capitalize">({user?.role})</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;