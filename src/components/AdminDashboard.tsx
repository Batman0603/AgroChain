import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Package, Activity, TrendingUp } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await apiService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusData = analytics ? [
    { name: 'Harvested', value: analytics.producesByStatus.harvested, color: '#22c55e' },
    { name: 'In Transit', value: analytics.producesByStatus['in-transit'], color: '#f97316' },
    { name: 'Delivered', value: analytics.producesByStatus.delivered, color: '#3b82f6' },
    { name: 'Verified', value: analytics.producesByStatus.verified, color: '#8b5cf6' },
  ] : [];

  const monthlyData = [
    { month: 'Jan', produces: 65, transactions: 48 },
    { month: 'Feb', produces: 78, transactions: 67 },
    { month: 'Mar', produces: 90, transactions: 84 },
    { month: 'Apr', produces: 81, transactions: 75 },
    { month: 'May', produces: 95, transactions: 89 },
    { month: 'Jun', produces: 102, transactions: 96 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Overview of the AgroChain platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{analytics?.totalUsers || 0}</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
            <Users className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Produces</p>
              <p className="text-3xl font-bold text-gray-900">{analytics?.totalProduces || 0}</p>
              <p className="text-sm text-green-600">+8% from last month</p>
            </div>
            <Package className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-3xl font-bold text-gray-900">{analytics?.totalTransactions || 0}</p>
              <p className="text-sm text-green-600">+15% from last month</p>
            </div>
            <Activity className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Farmers</p>
              <p className="text-3xl font-bold text-gray-900">{analytics?.totalFarmers || 0}</p>
              <p className="text-sm text-green-600">+5% from last month</p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="produces" fill="#22c55e" name="Produces" />
              <Bar dataKey="transactions" fill="#3b82f6" name="Transactions" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Produce Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
            <div className="bg-green-600 p-2 rounded-full">
              <Package className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">New produce added</p>
              <p className="text-sm text-gray-600">Organic Tomatoes by John Farmer • 2 minutes ago</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
            <div className="bg-orange-600 p-2 rounded-full">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Status updated</p>
              <p className="text-sm text-gray-600">Produce marked as in-transit • 15 minutes ago</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <div className="bg-blue-600 p-2 rounded-full">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">New user registered</p>
              <p className="text-sm text-gray-600">New retailer account created • 1 hour ago</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
            <div className="bg-purple-600 p-2 rounded-full">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Product verified</p>
              <p className="text-sm text-gray-600">Consumer verified product authenticity • 2 hours ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800">Blockchain Integrity</span>
              <span className="text-green-600">100%</span>
            </div>
            <div className="mt-2 bg-green-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">API Response Time</span>
              <span className="text-blue-600">98ms</span>
            </div>
            <div className="mt-2 bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }} />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-purple-800">System Uptime</span>
              <span className="text-purple-600">99.9%</span>
            </div>
            <div className="mt-2 bg-purple-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '99%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;