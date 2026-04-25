const STORAGE_KEYS = {
  USERS: 'cm_users',
  CHILDREN: 'cm_children',
  GROWTH_RECORDS: 'cm_growth_records',
  VACCINE_RECORDS: 'cm_vaccine_records',
  FOOD_RECIPES: 'cm_food_recipes',
  BOOKS: 'cm_books',
} as const;

export class StorageService {
  static getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return null;
    }
  }

  static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
    }
  }

  static getUsers<T>(): T[] {
    return this.getItem<T[]>(STORAGE_KEYS.USERS) || [];
  }

  static setUsers<T>(users: T[]): void {
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  static getChildren<T>(): T[] {
    return this.getItem<T[]>(STORAGE_KEYS.CHILDREN) || [];
  }

  static setChildren<T>(children: T[]): void {
    this.setItem(STORAGE_KEYS.CHILDREN, children);
  }

  static getGrowthRecords<T>(): T[] {
    return this.getItem<T[]>(STORAGE_KEYS.GROWTH_RECORDS) || [];
  }

  static setGrowthRecords<T>(records: T[]): void {
    this.setItem(STORAGE_KEYS.GROWTH_RECORDS, records);
  }

  static getVaccineRecords<T>(): T[] {
    return this.getItem<T[]>(STORAGE_KEYS.VACCINE_RECORDS) || [];
  }

  static setVaccineRecords<T>(records: T[]): void {
    this.setItem(STORAGE_KEYS.VACCINE_RECORDS, records);
  }

  static exportAllData(): string {
    const data = {
      users: this.getUsers(),
      children: this.getChildren(),
      growthRecords: this.getGrowthRecords(),
      vaccineRecords: this.getVaccineRecords(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  static importAllData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.users) this.setUsers(data.users);
      if (data.children) this.setChildren(data.children);
      if (data.growthRecords) this.setGrowthRecords(data.growthRecords);
      if (data.vaccineRecords) this.setVaccineRecords(data.vaccineRecords);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

export { STORAGE_KEYS };
