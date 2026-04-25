// 用户类型
export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  avatar?: string;
  displayName?: string;
  createdAt: string;
}

// 儿童类型
export interface Child {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birthDate: string;
  avatar?: string;
  parentId: string;
  bloodType?: string;
  allergies?: string[];
  notes?: string;
  createdAt: string;
}

// 成长记录类型
export interface GrowthRecord {
  id: string;
  childId: string;
  date: string;
  height?: number;
  weight?: number;
  headCircumference?: number;
  note?: string;
  ageMonths?: number;
  dateLabel?: string;
  createdAt?: string;
}

// 疫苗接种记录类型（页面实际使用）
export interface VaccinationRecord {
  vaccineId: string;
  date: string;
  batchNumber?: string;
  location?: string;
  notes?: string;
  nextDate?: string;
  completed: boolean;
}

// 疫苗类型
export interface Vaccine {
  id: string;
  name: string;
  description: string;
  recommendedAge: number;
  doses: number;
  category: string;
}

// 辅食食谱类型
export interface FoodRecipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
  nutrition: string;
  suitableAge: [number, number];
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  image?: string;
  category: string;
}

// 读物类型
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  suitableAge: [number, number];
  rating: number;
  cover?: string;
  category: string;
}

// 登录状态
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}
