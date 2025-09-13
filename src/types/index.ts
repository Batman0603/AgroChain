export interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'wholesaler' | 'retailer' | 'consumer' | 'admin';
  location?: string;
  phone?: string;
}

export interface Produce {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  type: string;
  harvestDate: string;
  location: string;
  price: number;
  quantity: number;
  unit: string;
  qrCode: string;
  hash: string;
  status: 'harvested' | 'in-transit' | 'delivered' | 'verified';
  createdAt: string;
}

export interface Transaction {
  id: string;
  produceId: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  toUserName: string;
  action: 'harvest' | 'transfer' | 'verify';
  timestamp: string;
  location: string;
  hash: string;
  notes?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
}