import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Child, GrowthRecord, VaccinationRecord } from '../types';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

interface ChildrenState {
  children: Child[];
  selectedChildId: string | null;
  growthRecords: Record<string, GrowthRecord[]>;
  vaccineRecords: Record<string, Record<string, VaccinationRecord>>;
}

interface ChildrenStore extends ChildrenState {
  setChildren: (children: Child[]) => void;
  addChild: (childData: Omit<Child, 'id' | 'createdAt' | 'parentId'>) => void;
  updateChild: (id: string, childData: Partial<Omit<Child, 'id'>>) => void;
  deleteChild: (id: string) => void;
  selectChild: (id: string | null) => void;
  setSelectedChild: (id: string) => void;
  getSelectedChild: () => Child | null;
  getChildrenByParent: (parentId: string) => Child[];
  addGrowthRecord: (childId: string, record: Omit<GrowthRecord, 'id' | 'childId'>) => void;
  deleteGrowthRecord: (childId: string, recordId: string) => void;
  updateVaccineRecord: (childId: string, vaccineId: string, record: VaccinationRecord) => void;
}

export const useChildrenStore = create<ChildrenStore>()(
  persist(
    (set, get) => ({
      children: [],
      selectedChildId: null,
      growthRecords: {},
      vaccineRecords: {},

      setChildren: (children) => set({ children }),

      addChild: (childData) => {
        const newChild: Child = {
          ...childData,
          id: generateId(),
          parentId: 'current-user',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          children: [...(state.children || []), newChild],
        }));
      },

      updateChild: (id, childData) => {
        set((state) => ({
          children: (state.children || []).map((c) =>
            c.id === id ? { ...c, ...childData } : c
          ),
        }));
      },

      deleteChild: (id) => {
        set((state) => ({
          children: (state.children || []).filter((c) => c.id !== id),
          selectedChildId:
            state.selectedChildId === id ? null : state.selectedChildId,
        }));
      },

      selectChild: (id) => set({ selectedChildId: id }),

      setSelectedChild: (id) => set({ selectedChildId: id }),

      getSelectedChild: () => {
        const { children, selectedChildId } = get();
        return (children || []).find((c) => c.id === selectedChildId) || null;
      },

      getChildrenByParent: (parentId) => {
        return (get().children || []).filter((c) => c.parentId === parentId);
      },

      addGrowthRecord: (childId, record) => {
        const newRecord: GrowthRecord = {
          ...record,
          id: generateId(),
          childId,
          createdAt: new Date().toISOString(),
        };
        set((state) => {
          const existing = (state.growthRecords || {})[childId] || [];
          return {
            growthRecords: {
              ...state.growthRecords,
              [childId]: [...existing, newRecord],
            },
          };
        });
      },

      deleteGrowthRecord: (childId, recordId) => {
        set((state) => ({
          growthRecords: {
            ...state.growthRecords,
            [childId]: ((state.growthRecords || {})[childId] || []).filter(
              (r) => r.id !== recordId
            ),
          },
        }));
      },

      updateVaccineRecord: (childId, vaccineId, record) => {
        set((state) => {
          const childVaccines = { ...((state.vaccineRecords || {})[childId] || {}) };
          childVaccines[vaccineId] = record;
          return {
            vaccineRecords: {
              ...state.vaccineRecords,
              [childId]: childVaccines,
            },
          };
        });
      },
    }),
    {
      name: 'children-storage',
    }
  )
);
