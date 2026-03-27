import { create } from 'zustand';

export type AnalysisModule = 'pscore' | 'pcram' | 'peqm';

export interface CampusFilterState {
  testType: string;
  selectedYear: number;
  includeUnder10: boolean;
  selectedCourses: string[];
  selectedCampuses: string[];
  selectedSubjects: string[];
  selectedTests: string[];
  showAnalysis: boolean;
}

const defaultFilterState: CampusFilterState = {
  testType: 'MT',
  selectedYear: 2025,
  includeUnder10: false,
  selectedCourses: [],
  selectedCampuses: [],
  selectedSubjects: ['Eng. Foundations', 'English', 'Speech Building'],
  selectedTests: [],
  showAnalysis: false,
};

interface CampusStoreState {
  filtersByModule: Record<AnalysisModule, CampusFilterState>;
  setFilter: <K extends keyof CampusFilterState>(
    module: AnalysisModule,
    key: K,
    value: CampusFilterState[K],
  ) => void;
  markAnalyzed: (module: AnalysisModule) => void;
  resetModuleFilters: (module: AnalysisModule) => void;
}

export const useCampusStore = create<CampusStoreState>((set) => ({
  filtersByModule: {
    pscore: { ...defaultFilterState },
    pcram: { ...defaultFilterState },
    peqm: { ...defaultFilterState },
  },
  setFilter: (module, key, value) =>
    set((state) => ({
      filtersByModule: {
        ...state.filtersByModule,
        [module]: {
          ...state.filtersByModule[module],
          [key]: value,
        },
      },
    })),
  markAnalyzed: (module) =>
    set((state) => ({
      filtersByModule: {
        ...state.filtersByModule,
        [module]: {
          ...state.filtersByModule[module],
          showAnalysis: true,
        },
      },
    })),
  resetModuleFilters: (module) =>
    set((state) => ({
      filtersByModule: {
        ...state.filtersByModule,
        [module]: { ...defaultFilterState },
      },
    })),
}));
