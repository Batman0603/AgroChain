import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import FarmerDashboard from './FarmerDashboard';
import VerifyProduce from './VerifyProduce';
import AdminDashboard from './AdminDashboard';
import { Package, ShoppingCart, Truck, BarChart3, User, Mail, MapPin } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const renderRoleSpecificDashboard = () => {
    switch (user.role) {
      case 'farmer':
        return <FarmerDashboard />;
      case 'wholesaler':
      case 'retailer':
      case 'consumer':
        return <VerifyProduce />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case 'farmer': return Package;
      case 'wholesaler': return Truck;
      case 'retailer': return ShoppingCart;
      case 'consumer': return User;
      case 'admin': return BarChart3;
      default: return User;
    }
  };

  const RoleIcon = getRoleIcon();

  // Simple welcome dashboard for non-farmer roles
  if (user.role === 'wholesaler' || user.role === 'retailer' || user.role === 'consumer') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-green-600 p-3 rounded-full">
              <RoleIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
              <p className="text-gray-600 capitalize">{user.role} Dashboard</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">{user.email}</span>
              </div>
              {user.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{user.location}</span>
                </div>
              )}
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Quick Actions</h3>
              <p className="text-gray-600 text-sm">
                Use the "Verify Produce" feature to scan QR codes and track the supply chain of farm products.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">How it works:</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Scan or enter QR codes from produce packaging</p>
              <p>• View complete supply chain history and authenticity</p>
              <p>• Update status as products move through the chain</p>
              <p>• Verify blockchain-secured product information</p>
            </div>
          </div>
        </div>

        <VerifyProduce />
      </div>
    );
  }

  return renderRoleSpecificDashboard();
};

export default Dashboard;