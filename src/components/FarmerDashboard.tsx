import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { Produce } from '../types';
import { generateQRCode } from '../utils/qrcode';
import { Plus, Package, MapPin, Calendar, DollarSign, QrCode, Eye } from 'lucide-react';

const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [produces, setProduces] = useState<Produce[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const [selectedProduce, setSelectedProduce] = useState<Produce | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    harvestDate: '',
    location: '',
    price: '',
    quantity: '',
    unit: 'kg'
  });

  useEffect(() => {
    loadProduces();
  }, [user]);

  const loadProduces = async () => {
    if (user) {
      const userProduces = await apiService.getUserProduces(user.id);
      setProduces(userProduces);
      
      // Generate QR codes for each produce
      const codes: Record<string, string> = {};
      for (const produce of userProduces) {
        codes[produce.id] = await generateQRCode(produce.qrCode);
      }
      setQrCodes(codes);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const newProduce = await apiService.addProduce({
        farmerId: user.id,
        farmerName: user.name,
        name: formData.name,
        type: formData.type,
        harvestDate: formData.harvestDate,
        location: formData.location,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        status: 'harvested'
      });

      setProduces([...produces, newProduce]);
      setQrCodes({
        ...qrCodes,
        [newProduce.id]: await generateQRCode(newProduce.qrCode)
      });

      setFormData({
        name: '',
        type: '',
        harvestDate: '',
        location: '',
        price: '',
        quantity: '',
        unit: 'kg'
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding produce:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Produce</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Produce</p>
              <p className="text-3xl font-bold text-gray-900">{produces.length}</p>
            </div>
            <Package className="h-10 w-10 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Harvested</p>
              <p className="text-3xl font-bold text-green-600">
                {produces.filter(p => p.status === 'harvested').length}
              </p>
            </div>
            <Calendar className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-3xl font-bold text-orange-600">
                {produces.filter(p => p.status === 'in-transit').length}
              </p>
            </div>
            <Package className="h-10 w-10 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-3xl font-bold text-blue-600">
                {produces.filter(p => p.status === 'verified').length}
              </p>
            </div>
            <QrCode className="h-10 w-10 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Add Produce Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add New Produce</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Produce Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Vegetable">Vegetable</option>
                  <option value="Fruit">Fruit</option>
                  <option value="Grain">Grain</option>
                  <option value="Herb">Herb</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harvest Date
                </label>
                <input
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) => setFormData({...formData, harvestDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Farm location"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                    <option value="tons">tons</option>
                    <option value="units">units</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per {formData.unit}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Add Produce
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Produce List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">My Produce</h2>
        </div>
        <div className="p-6">
          {produces.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No produce added yet. Click "Add New Produce" to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {produces.map((produce) => (
                <div key={produce.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{produce.name}</h3>
                      <p className="text-sm text-gray-500">{produce.type}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      produce.status === 'harvested' ? 'bg-green-100 text-green-800' :
                      produce.status === 'in-transit' ? 'bg-orange-100 text-orange-800' :
                      produce.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {produce.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Harvested: {new Date(produce.harvestDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{produce.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>${produce.price}/{produce.unit} • {produce.quantity} {produce.unit}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedProduce(produce)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                    >
                      <QrCode className="h-4 w-4" />
                      <span>QR Code</span>
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {selectedProduce && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">QR Code - {selectedProduce.name}</h2>
            <div className="text-center">
              {qrCodes[selectedProduce.id] && (
                <img
                  src={qrCodes[selectedProduce.id]}
                  alt="QR Code"
                  className="mx-auto mb-4"
                />
              )}
              <p className="text-sm text-gray-600 mb-4">
                QR Code: {selectedProduce.qrCode}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Hash: {selectedProduce.hash}
              </p>
              <button
                onClick={() => setSelectedProduce(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;