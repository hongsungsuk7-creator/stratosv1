import { CampusData } from '../types';

export const campusData: CampusData[] = [
  { id: 'C001', name: '강남 캠퍼스', pScore: 92, zScore: 1.5, cv: 3.2, eqs: 95, ci: 0.05, eliteDensity: 25, status: '상향 평준형' },
  { id: 'C002', name: '서초 캠퍼스', pScore: 88, zScore: 1.2, cv: 4.1, eqs: 89, ci: 0.08, eliteDensity: 20, status: '상향 평준형' },
  { id: 'C003', name: '분당 캠퍼스', pScore: 85, zScore: 0.8, cv: 8.5, eqs: 78, ci: 0.12, eliteDensity: 15, status: '성과 편중형' },
  { id: 'C004', name: '목동 캠퍼스', pScore: 72, zScore: -0.5, cv: 4.5, eqs: 70, ci: 0.09, eliteDensity: 5, status: '하향 평준형' },
  { id: 'C005', name: '송파 캠퍼스', pScore: 68, zScore: -1.2, cv: 9.2, eqs: 60, ci: 0.15, eliteDensity: 2, status: '관리 부재형' },
];
