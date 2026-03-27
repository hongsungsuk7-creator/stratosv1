import { create } from 'zustand';
import { buildStudentMetrics } from '@/core';
import type { RiskLevel } from '@/core';

export interface StudentMetricsState {
  pScore: number;
  zScore: number;
  ci: number;
  riskLevel: RiskLevel;
}

interface StudentStoreState {
  selectedStudentId: string | null;
  metrics: StudentMetricsState;
  setSelectedStudent: (studentId: string | null) => void;
  setMetricsFromRaw: (input: {
    correct: number;
    total: number;
    score: number;
    mean: number;
    std: number;
    scores?: number[];
  }) => void;
}

const defaultMetrics: StudentMetricsState = {
  pScore: 0,
  zScore: 0,
  ci: 0,
  riskLevel: '정상군',
};

export const useStudentStore = create<StudentStoreState>((set) => ({
  selectedStudentId: null,
  metrics: defaultMetrics,
  setSelectedStudent: (studentId) => set({ selectedStudentId: studentId }),
  setMetricsFromRaw: ({ correct, total, score, mean, std, scores }) => {
    const metrics = buildStudentMetrics({
      pScore: { correct, total },
      zScore: { score, mean, std },
      ci: { scores, mean, stdDev: std },
    });
    set({ metrics });
  },
}));
