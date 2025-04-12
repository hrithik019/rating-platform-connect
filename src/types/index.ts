
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  STORE_OWNER = 'STORE_OWNER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
  avgRating: number;
}

export interface Rating {
  id: string;
  storeId: string;
  userId: string;
  value: number;
  timestamp: string;
}
