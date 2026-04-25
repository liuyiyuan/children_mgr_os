import type { User } from '../types';
import { StorageService } from './storageService';

const ADMIN_USER: User = {
  id: 'admin-1',
  username: 'admin',
  password: 'admin123',
  role: 'admin',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  createdAt: new Date().toISOString(),
};

const DEMO_USER: User = {
  id: 'user-1',
  username: 'user',
  password: 'user123',
  role: 'user',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
  createdAt: new Date().toISOString(),
};

export class AuthService {
  static initializeDefaultUsers(): void {
    const users = StorageService.getUsers<User>();
    if (users.length === 0) {
      StorageService.setUsers([ADMIN_USER, DEMO_USER]);
    }
  }

  static login(username: string, password: string): { success: boolean; user?: User; message?: string } {
    this.initializeDefaultUsers();
    const users = StorageService.getUsers<User>();
    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
      return { success: true, user };
    }
    return { success: false, message: '用户名或密码错误' };
  }

  static getAllUsers(): User[] {
    return StorageService.getUsers<User>();
  }

  static createUser(userData: Omit<User, 'id' | 'createdAt'>): { success: boolean; user?: User; message?: string } {
    const users = StorageService.getUsers<User>();

    if (users.some((u) => u.username === userData.username)) {
      return { success: false, message: '用户名已存在' };
    }

    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    StorageService.setUsers([...users, newUser]);
    return { success: true, user: newUser };
  }

  static updateUser(id: string, userData: Partial<User>): { success: boolean; message?: string } {
    const users = StorageService.getUsers<User>();
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return { success: false, message: '用户不存在' };
    }

    users[index] = { ...users[index], ...userData };
    StorageService.setUsers(users);
    return { success: true };
  }

  static deleteUser(id: string): { success: boolean; message?: string } {
    const users = StorageService.getUsers<User>();

    if (id === 'admin-1') {
      return { success: false, message: '不能删除默认管理员账户' };
    }

    const filteredUsers = users.filter((u) => u.id !== id);
    StorageService.setUsers(filteredUsers);
    return { success: true };
  }
}
