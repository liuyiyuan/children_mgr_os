import type { Vaccine, VaccineRecord } from '../types';
import { StorageService } from './storageService';

export const DEFAULT_VACCINES: Vaccine[] = [
  {
    id: 'vac-1',
    name: '乙肝疫苗',
    description: '预防乙型肝炎病毒感染',
    recommendedAge: 0,
    doses: 3,
    category: '一类疫苗',
  },
  {
    id: 'vac-2',
    name: '卡介苗',
    description: '预防结核病',
    recommendedAge: 0,
    doses: 1,
    category: '一类疫苗',
  },
  {
    id: 'vac-3',
    name: '脊髓灰质炎疫苗',
    description: '预防脊髓灰质炎（小儿麻痹症）',
    recommendedAge: 2,
    doses: 4,
    category: '一类疫苗',
  },
  {
    id: 'vac-4',
    name: '百白破疫苗',
    description: '预防百日咳、白喉、破伤风',
    recommendedAge: 3,
    doses: 4,
    category: '一类疫苗',
  },
  {
    id: 'vac-5',
    name: '麻腮风疫苗',
    description: '预防麻疹、腮腺炎、风疹',
    recommendedAge: 8,
    doses: 2,
    category: '一类疫苗',
  },
  {
    id: 'vac-6',
    name: '乙脑疫苗',
    description: '预防流行性乙型脑炎',
    recommendedAge: 8,
    doses: 2,
    category: '一类疫苗',
  },
  {
    id: 'vac-7',
    name: 'A群流脑疫苗',
    description: '预防A群流行性脑脊髓膜炎',
    recommendedAge: 6,
    doses: 2,
    category: '一类疫苗',
  },
  {
    id: 'vac-8',
    name: '甲肝疫苗',
    description: '预防甲型肝炎',
    recommendedAge: 18,
    doses: 2,
    category: '一类疫苗',
  },
  {
    id: 'vac-9',
    name: '水痘疫苗',
    description: '预防水痘',
    recommendedAge: 12,
    doses: 2,
    category: '二类疫苗',
  },
  {
    id: 'vac-10',
    name: '流感疫苗',
    description: '预防流行性感冒',
    recommendedAge: 6,
    doses: 2,
    category: '二类疫苗',
  },
  {
    id: 'vac-11',
    name: '肺炎疫苗',
    description: '预防肺炎球菌感染',
    recommendedAge: 2,
    doses: 4,
    category: '二类疫苗',
  },
  {
    id: 'vac-12',
    name: '轮状病毒疫苗',
    description: '预防轮状病毒腹泻',
    recommendedAge: 2,
    doses: 3,
    category: '二类疫苗',
  },
];

export class VaccineService {
  static getAllVaccines(): Vaccine[] {
    return DEFAULT_VACCINES;
  }

  static getVaccineById(id: string): Vaccine | null {
    return DEFAULT_VACCINES.find((v) => v.id === id) || null;
  }

  static getAllRecords(): VaccineRecord[] {
    return StorageService.getVaccineRecords<VaccineRecord>();
  }

  static getRecordsByChild(childId: string): VaccineRecord[] {
    const records = this.getAllRecords();
    return records
      .filter((r) => r.childId === childId)
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  }

  static getPendingRecords(childId: string): VaccineRecord[] {
    return this.getRecordsByChild(childId).filter((r) => r.status === 'pending');
  }

  static getCompletedRecords(childId: string): VaccineRecord[] {
    return this.getRecordsByChild(childId).filter((r) => r.status === 'completed');
  }

  static initializeVaccineRecords(childId: string, birthDate: string): void {
    const existingRecords = this.getRecordsByChild(childId);
    if (existingRecords.length > 0) return;

    const birth = new Date(birthDate);
    const records: VaccineRecord[] = [];

    DEFAULT_VACCINES.forEach((vaccine) => {
      for (let dose = 1; dose <= vaccine.doses; dose++) {
        const scheduledDate = new Date(birth);
        scheduledDate.setMonth(birth.getMonth() + vaccine.recommendedAge + (dose - 1) * 2);

        records.push({
          id: `vr-${childId}-${vaccine.id}-${dose}`,
          childId,
          vaccineId: vaccine.id,
          doseNumber: dose,
          scheduledDate: scheduledDate.toISOString().split('T')[0],
          status: 'pending',
        });
      }
    });

    const allRecords = this.getAllRecords();
    StorageService.setVaccineRecords([...allRecords, ...records]);
  }

  static completeRecord(id: string, actualDate: string, note?: string): { success: boolean; message?: string } {
    const records = this.getAllRecords();
    const index = records.findIndex((r) => r.id === id);

    if (index === -1) {
      return { success: false, message: '记录不存在' };
    }

    records[index] = {
      ...records[index],
      status: 'completed',
      actualDate,
      note,
    };
    StorageService.setVaccineRecords(records);
    return { success: true };
  }

  static getUpcomingVaccines(childId: string, days: number = 30): VaccineRecord[] {
    const pending = this.getPendingRecords(childId);
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + days);

    return pending.filter((r) => {
      const scheduled = new Date(r.scheduledDate);
      return scheduled >= now && scheduled <= future;
    });
  }
}
