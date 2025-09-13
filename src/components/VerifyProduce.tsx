import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { Produce, Transaction } from '../types';
import { QrCode, Search, CheckCircle, AlertCircle, MapPin, Calendar, User } from 'lucide-react';

const VerifyProduce: React.FC = () => {
  const { user } = useAuth();
  const [qrCode, setQrCode] = useState('');
  const [produce, setProduce] = useState<Produce | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');

  const handleSearch = async () => {
    if (!qrCode.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const foundProduce = await apiService.getProduceByQR(qrCode);
      if (foundProduce) {
        setProduce(foundProduce);
        const produceTransactions = await apiService.getProduceTransactions(foundProduce.id);
        setTransactions(produceTransactions);
      } else {
        setError('No produce found with this QR code');
        setProduce(null);
        setTransactions([]);
      }
    } catch (err) {
      setError('Error searching for produce');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: Produce['status']) => {
    if (!produce || !user) return;

    try {
      await apiService.updateProduceStatus(
        produce.id,
        newStatus,
        user.id,
        user.name,
        notes
      );
      
      // Refresh data
      const updatedProduce = await apiService.getProduceByQR(qrCode);
      if (updatedProduce) {
        setProduce(updatedProduce);
        const produceTransactions = await apiService.getProduceTransactions(updatedProduce.id);
        setTransactions(produceTransactions);
      }
      setNotes('');
    } catch (err) {
      setError('Error updating produce status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'harvested': return 'text-green-600';
      case 'in-transit': return 'text-orange-600';
      case 'delivered': return 'text-blue-600';
      case 'verified': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getActionButtons = () => {
    if (!produce || !user) return null;

    const isConsumer = user.role === 'consumer';
    if (isConsumer) {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">Verified Authentic Product</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            This product has been verified through our blockchain system.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
            placeholder="Enter any notes about handling, transport, etc."
          />
        </div>
        
        <div className="flex space-x-3">
          {produce.status === 'harvested' && user.role === 'wholesaler' && (
            <button
              onClick={() => handleUpdateStatus('in-transit')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Mark In Transit
            </button>
          )}
          
          {produce.status === 'in-transit' && user.role === 'retailer' && (
            <button
              onClick={() => handleUpdateStatus('delivered')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Mark Delivered
            </button>
          )}
          
          {(user.role === 'wholesaler' || user.role === 'retailer') && (
            <button
              onClick={() => handleUpdateStatus('verified')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Mark Verified
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {user?.role === 'consumer' ? 'Verify Product' : 'Verify Produce'}
        </h1>
        <p className="text-gray-600">
          {user?.role === 'consumer' 
            ? 'Enter or scan QR code to verify product authenticity'
            : 'Enter or scan QR code to verify and update produce status'
          }
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QR Code or Produce ID
            </label>
            <input
              type="text"
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter QR code or scan with camera"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !qrCode.trim()}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span>Search</span>
          </button>
        </div>

        <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
          <QrCode className="h-4 w-4" />
          <span>Try: QR_TOMATO_001, QR_ORGANIC_TOMATOES_*, or any QR code from farmer dashboard</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Produce Details */}
      {produce && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{produce.name}</h2>
              <p className="text-gray-600">{produce.type}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              produce.status === 'harvested' ? 'bg-green-100 text-green-800' :
              produce.status === 'in-transit' ? 'bg-orange-100 text-orange-800' :
              produce.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {produce.status.replace('-', ' ').toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Farmer</p>
                  <p className="text-gray-600">{produce.farmerName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Harvest Date</p>
                  <p className="text-gray-600">{new Date(produce.harvestDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-gray-600">{produce.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-900">Quantity</p>
                <p className="text-gray-600">{produce.quantity} {produce.unit}</p>
              </div>
              
              <div>
                <p className="font-medium text-gray-900">Price</p>
                <p className="text-gray-600">${produce.price} per {produce.unit}</p>
              </div>
              
              <div>
                <p className="font-medium text-gray-900">Blockchain Hash</p>
                <p className="text-gray-600 font-mono text-sm break-all">{produce.hash}</p>
              </div>
            </div>
          </div>

          {getActionButtons()}
        </div>
      )}

      {/* Supply Chain History */}
      {transactions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Supply Chain History</h3>
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <div key={transaction.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full ${
                    transaction.action === 'harvest' ? 'bg-green-500' :
                    transaction.action === 'transfer' ? 'bg-orange-500' :
                    'bg-purple-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.action === 'harvest' ? 'Harvested' :
                         transaction.action === 'transfer' ? 'Transferred' : 'Verified'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {transaction.action !== 'harvest' && (
                          <span>From {transaction.fromUserName} to {transaction.toUserName}</span>
                        )}
                        {transaction.action === 'harvest' && (
                          <span>By {transaction.fromUserName}</span>
                        )}
                      </p>
                      {transaction.notes && (
                        <p className="text-sm text-gray-500 mt-1">{transaction.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">
                        {transaction.hash.substring(0, 8)}...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyProduce;