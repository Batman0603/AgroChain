import { User, Produce, Transaction } from '../types';
import { generateHash } from '../utils/blockchain';

class ApiService {
  private users: User[] = [
    { id: '1', name: 'John Farmer', email: 'farmer@test.com', role: 'farmer', location: 'California, USA', phone: '+1-555-0101' },
    { id: '2', name: 'Jane Wholesaler', email: 'wholesaler@test.com', role: 'wholesaler', location: 'Texas, USA', phone: '+1-555-0102' },
    { id: '3', name: 'Mike Retailer', email: 'retailer@test.com', role: 'retailer', location: 'New York, USA', phone: '+1-555-0103' },
    { id: '4', name: 'Sarah Consumer', email: 'consumer@test.com', role: 'consumer', location: 'Florida, USA', phone: '+1-555-0104' },
    { id: '5', name: 'Admin User', email: 'admin@test.com', role: 'admin', location: 'HQ, USA', phone: '+1-555-0100' },
  ];

  private produces: Produce[] = [
    {
      id: '1',
      farmerId: '1',
      farmerName: 'John Farmer',
      name: 'Organic Tomatoes',
      type: 'Vegetable',
      harvestDate: '2024-01-15',
      location: 'California, USA',
      price: 5.99,
      quantity: 100,
      unit: 'kg',
      qrCode: 'QR_TOMATO_001',
      hash: 'abc123def456',
      status: 'harvested',
      createdAt: '2024-01-15T10:00:00Z'
    }
  ];

  private transactions: Transaction[] = [
    {
      id: '1',
      produceId: '1',
      fromUserId: '1',
      toUserId: '1',
      fromUserName: 'John Farmer',
      toUserName: 'John Farmer',
      action: 'harvest',
      timestamp: '2024-01-15T10:00:00Z',
      location: 'California, USA',
      hash: 'abc123def456',
      notes: 'Initial harvest'
    }
  ];

  async login(email: string, password: string): Promise<User | null> {
    // Simple mock authentication - in production, this would validate against backend
    const user = this.users.find(u => u.email === email);
    if (user && password === 'password') {
      return user;
    }
    return null;
  }

  async register(userData: Omit<User, 'id'> & { password: string }): Promise<User> {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async getUserProduces(farmerId: string): Promise<Produce[]> {
    return this.produces.filter(p => p.farmerId === farmerId);
  }

  async addProduce(produceData: Omit<Produce, 'id' | 'qrCode' | 'hash' | 'createdAt'>): Promise<Produce> {
    const id = Date.now().toString();
    const qrCode = `QR_${produceData.name.toUpperCase().replace(/\s+/g, '_')}_${id}`;
    const hash = generateHash(`${id}-${produceData.farmerId}-${produceData.name}-${Date.now()}`);
    
    const newProduce: Produce = {
      ...produceData,
      id,
      qrCode,
      hash,
      createdAt: new Date().toISOString(),
    };

    this.produces.push(newProduce);

    // Create initial transaction
    const transaction: Transaction = {
      id: Date.now().toString(),
      produceId: id,
      fromUserId: produceData.farmerId,
      toUserId: produceData.farmerId,
      fromUserName: produceData.farmerName,
      toUserName: produceData.farmerName,
      action: 'harvest',
      timestamp: new Date().toISOString(),
      location: produceData.location,
      hash,
      notes: 'Initial harvest and upload'
    };

    this.transactions.push(transaction);
    return newProduce;
  }

  async getProduceByQR(qrCode: string): Promise<Produce | null> {
    return this.produces.find(p => p.qrCode === qrCode) || null;
  }

  async getProduceTransactions(produceId: string): Promise<Transaction[]> {
    return this.transactions.filter(t => t.produceId === produceId);
  }

  async updateProduceStatus(produceId: string, status: Produce['status'], userId: string, userName: string, notes?: string): Promise<boolean> {
    const produce = this.produces.find(p => p.id === produceId);
    if (!produce) return false;

    produce.status = status;

    // Create transaction
    const transaction: Transaction = {
      id: Date.now().toString(),
      produceId,
      fromUserId: produce.farmerId,
      toUserId: userId,
      fromUserName: produce.farmerName,
      toUserName: userName,
      action: status === 'verified' ? 'verify' : 'transfer',
      timestamp: new Date().toISOString(),
      location: 'Location updated',
      hash: generateHash(`${produceId}-${userId}-${Date.now()}`),
      notes
    };

    this.transactions.push(transaction);
    return true;
  }

  async getAnalytics() {
    return {
      totalProduces: this.produces.length,
      totalTransactions: this.transactions.length,
      totalFarmers: this.users.filter(u => u.role === 'farmer').length,
      totalUsers: this.users.length,
      producesByStatus: {
        harvested: this.produces.filter(p => p.status === 'harvested').length,
        'in-transit': this.produces.filter(p => p.status === 'in-transit').length,
        delivered: this.produces.filter(p => p.status === 'delivered').length,
        verified: this.produces.filter(p => p.status === 'verified').length,
      }
    };
  }
}

export const apiService = new ApiService();