import type { GrowthRecord } from '../types';
import { StorageService } from './storageService';

export class GrowthService {
  static getAllRecords(): GrowthRecord[] {
    return StorageService.getGrowthRecords<GrowthRecord>();
  }

  static getRecordsByChild(childId: string): GrowthRecord[] {
    const records = this.getAllRecords();
    return records
      .filter((r) => r.childId === childId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  static getLatestRecord(childId: string): GrowthRecord | null {
    const records = this.getRecordsByChild(childId);
    return records.length > 0 ? records[records.length - 1] : null;
  }

  static createRecord(recordData: Omit<GrowthRecord, 'id' | 'createdAt'>): GrowthRecord {
    const records = this.getAllRecords();
    const newRecord: GrowthRecord = {
      ...recordData,
      id: `growth-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    StorageService.setGrowthRecords([...records, newRecord]);
    return newRecord;
  }

  static updateRecord(id: string, recordData: Partial<GrowthRecord>): { success: boolean; message?: string } {
    const records = this.getAllRecords();
    const index = records.findIndex((r) => r.id === id);

    if (index === -1) {
      return { success: false, message: '记录不存在' };
    }

    records[index] = { ...records[index], ...recordData };
    StorageService.setGrowthRecords(records);
    return { success: true };
  }

  static deleteRecord(id: string): { success: boolean; message?: string } {
    const records = this.getAllRecords();
    const filteredRecords = records.filter((r) => r.id !== id);
    StorageService.setGrowthRecords(filteredRecords);
    return { success: true };
  }

  static getChartData(childId: string) {
    const records = this.getRecordsByChild(childId);
    return records.map((r) => ({
      date: r.date,
      height: r.height,
      weight: r.weight,
    }));
  }
}
