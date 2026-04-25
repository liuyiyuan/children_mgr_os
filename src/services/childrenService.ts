import type { Child } from '../types';
import { StorageService } from './storageService';

export class ChildrenService {
  static getAllChildren(): Child[] {
    return StorageService.getChildren<Child>();
  }

  static getChildrenByParent(parentId: string): Child[] {
    const children = this.getAllChildren();
    return children.filter((c) => c.parentId === parentId);
  }

  static getChildById(id: string): Child | null {
    const children = this.getAllChildren();
    return children.find((c) => c.id === id) || null;
  }

  static createChild(childData: Omit<Child, 'id' | 'createdAt'>): Child {
    const children = this.getAllChildren();
    const newChild: Child = {
      ...childData,
      id: `child-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    StorageService.setChildren([...children, newChild]);
    return newChild;
  }

  static updateChild(id: string, childData: Partial<Child>): { success: boolean; message?: string } {
    const children = this.getAllChildren();
    const index = children.findIndex((c) => c.id === id);

    if (index === -1) {
      return { success: false, message: '儿童档案不存在' };
    }

    children[index] = { ...children[index], ...childData };
    StorageService.setChildren(children);
    return { success: true };
  }

  static deleteChild(id: string): { success: boolean; message?: string } {
    const children = this.getAllChildren();
    const filteredChildren = children.filter((c) => c.id !== id);
    StorageService.setChildren(filteredChildren);
    return { success: true };
  }

  static calculateAge(birthDate: string): { years: number; months: number; days: number } {
    const birth = new Date(birthDate);
    const now = new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  }

  static formatAge(birthDate: string): string {
    const { years, months, days } = this.calculateAge(birthDate);

    if (years > 0) {
      return `${years}岁${months > 0 ? ` ${months}个月` : ''}`;
    }
    if (months > 0) {
      return `${months}个月${days > 0 ? ` ${days}天` : ''}`;
    }
    return `${days}天`;
  }
}
