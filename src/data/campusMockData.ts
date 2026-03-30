export interface ClassData {
  id: string;
  name: string;
  level: string;
  course: string;
  teacherKr: string;
  teacherEn: string;
  studentCount: number;
  pScore: number;
  zScore: number;
  ar: number;
  cv: number;
  peqm: string;
  peqmScore: number;
  pcramStatus: '상향완성' | '상향불안' | '하향평준' | '관리부재';
  status: 'Excellent' | 'Normal' | 'Risk';
  difficulty: number;
  excellentRatio: number;
}

export interface StudentData {
  id: string;
  name: string;
  classId: string;
  homeroom: string;
  instructor: string;
  enrollmentMonths: number;
  pScore: number;
  zScore: number;
  ar: number;
  cv: number;
  peqm: string;
  peqmScore: number;
  pcramStatus: '상향완성' | '상향불안' | '하향평준' | '관리부재';
  riskStatus: 'Excellent' | 'Normal' | 'Risk';
}

export const NATIONAL_AVERAGES = {
  pScore: 72.4,
  zScore: 0.0,
  ar: 75.2,
  cv: 12.5,
  peqm: 68.5,
  courseRatios: {
    ECP: 35,
    ELE: 45,
    GRAD: 20
  },
  sGradeRatio: 12.4,
  aGradeRatio: 25.8,
  bGradeRatio: 35.2,
  cGradeRatio: 26.6,
  difficulty: 7.2,
  excellentRatio: 65.4
};

export const CAMPUS_DATA = {
  id: 'poly-bundang',
  name: '폴리어학원(분당)',
  pScore: 76.8,
  zScore: 0.42,
  ar: 79.5,
  cv: 10.2,
  peqm: 74.2,
  courseRatios: {
    ECP: 32,
    ELE: 48,
    GRAD: 20
  },
  sGradeRatio: 15.8
};

/** 캠퍼스 대시보드 레벨 필터 — 커리큘럼 레벨 코드 (GT / MGT / S / R / MAG) */
export const LEVELS = [
  'GT1', 'GT2', 'GT3', 'GT4',
  'MGT1', 'MGT2', 'MGT3', 'MGT4',
  'S1', 'S2', 'S3', 'S4',
  'R1', 'R2', 'R3', 'R4',
  'MAG1', 'MAG1+', 'MAG2', 'MAG2+', 'MAG3', 'MAG4',
];

export const CLASSES_DATA: ClassData[] = [
  { id: 'C001', name: 'MAG1-Yellow', level: 'MAG1', course: 'ELE', teacherKr: '김철수', teacherEn: 'James', studentCount: 12, pScore: 85.2, zScore: 1.1, ar: 88.5, cv: 8.2, peqm: 'G', peqmScore: 82, pcramStatus: '상향완성', status: 'Excellent', difficulty: 7.8, excellentRatio: 85 },
  { id: 'C002', name: 'GT2-Blue', level: 'GT2', course: 'ELE', teacherKr: '이영희', teacherEn: 'Sarah', studentCount: 15, pScore: 74.5, zScore: 0.2, ar: 76.2, cv: 11.5, peqm: 'G', peqmScore: 72, pcramStatus: '상향완성', status: 'Normal', difficulty: 6.5, excellentRatio: 65 },
  { id: 'C003', name: 'MGT3-Red', level: 'MGT3', course: 'GRAD', teacherKr: '박지성', teacherEn: 'Michael', studentCount: 10, pScore: 79.8, zScore: 0.6, ar: 81.4, cv: 9.8, peqm: 'G', peqmScore: 78, pcramStatus: '상향완성', status: 'Excellent', difficulty: 7.2, excellentRatio: 75 },
  { id: 'C004', name: 'S2-Green', level: 'S2', course: 'ELE', teacherKr: '최유진', teacherEn: 'David', studentCount: 14, pScore: 68.2, zScore: -0.3, ar: 70.5, cv: 14.2, peqm: 'L', peqmScore: 62, pcramStatus: '하향평준', status: 'Risk', difficulty: 8.5, excellentRatio: 45 },
  { id: 'C005', name: 'GT1-Yellow', level: 'GT1', course: 'ECP', teacherKr: '정미경', teacherEn: 'Emma', studentCount: 16, pScore: 72.1, zScore: -0.1, ar: 74.8, cv: 12.8, peqm: 'G', peqmScore: 69, pcramStatus: '상향불안', status: 'Normal', difficulty: 6.8, excellentRatio: 60 },
];

export const STUDENTS_DATA: StudentData[] = [
  { id: 'S001', name: '강민준', classId: 'C001', homeroom: '김철수', instructor: 'James', enrollmentMonths: 24, pScore: 88.5, zScore: 1.3, ar: 91.2, cv: 7.5, peqm: 'G', peqmScore: 85, pcramStatus: '상향완성', riskStatus: 'Excellent' },
  { id: 'S002', name: '조예은', classId: 'C001', homeroom: '김철수', instructor: 'James', enrollmentMonths: 18, pScore: 82.1, zScore: 0.9, ar: 85.4, cv: 9.2, peqm: 'G', peqmScore: 79, pcramStatus: '상향완성', riskStatus: 'Normal' },
  { id: 'S003', name: '윤도현', classId: 'C002', homeroom: '이영희', instructor: 'Sarah', enrollmentMonths: 12, pScore: 75.4, zScore: 0.3, ar: 77.8, cv: 11.2, peqm: 'G', peqmScore: 73, pcramStatus: '상향완성', riskStatus: 'Normal' },
  { id: 'S004', name: '임지우', classId: 'C004', homeroom: '최유진', instructor: 'David', enrollmentMonths: 6, pScore: 62.5, zScore: -0.8, ar: 65.2, cv: 16.5, peqm: 'L', peqmScore: 58, pcramStatus: '하향평준', riskStatus: 'Risk' },
];

export const SUBJECT_ACCURACY = [
  { subject: 'Reading', campus: 78.5, national: 72.4 },
  { subject: 'Listening', campus: 75.2, national: 70.1 },
  { subject: 'Writing', campus: 71.8, national: 68.5 },
  { subject: 'Speaking', campus: 74.2, national: 71.2 },
];

export const TREND_DATA = [
  { month: '10월', campus: 74.2, national: 71.5 },
  { month: '11월', campus: 75.8, national: 72.1 },
  { month: '12월', campus: 75.1, national: 71.8 },
  { month: '1월', campus: 76.5, national: 72.4 },
  { month: '2월', campus: 76.8, national: 72.4 },
];

export const CAMPUS_SUBJECT_PERFORMANCE = [
  { subject: 'Reading', campusAvg: 78.5, nationalAvg: 72.4 },
  { subject: 'Listening', campusAvg: 75.2, nationalAvg: 70.1 },
  { subject: 'Writing', campusAvg: 71.8, nationalAvg: 68.5 },
  { subject: 'Speaking', campusAvg: 74.2, nationalAvg: 71.2 },
];
