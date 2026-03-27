export const PCRAM_KPI_DATA = {
    totalCampuses: 27,
    totalStudents: 511,
    nationalAverage: 79.8,
    sGradeCount: 13,
    sGradePercentage: 48,
    cGradeCount: 0,
  };
  
  export const TOTAL_OPERATION_TYPE_DATA = [
    { group: '전체', campuses: 27, classes: 65, students: 511, avgPerClass: 7.9, zScore: 0.0, ci: 0.62, ciGrade: 'A+', finalGrade: 'S', pScore: 79.8, pScoreEng: 75.6, pScoreSpeech: 85.2, pScoreFound: 78.6, pScoreCult: 81.5, delta: 0 },
    { group: '직영', campuses: 2, classes: 13, students: 129, avgPerClass: 9.9, zScore: 1.2, ci: 0.55, ciGrade: 'A+', finalGrade: 'S', pScore: 86.0, pScoreEng: 82.2, pScoreSpeech: 92.5, pScoreFound: 83.4, pScoreCult: 88.0, delta: 1.2 },
    { group: '분원', campuses: 25, classes: 52, students: 382, avgPerClass: 7.3, zScore: -0.1, ci: 0.65, ciGrade: 'B', finalGrade: 'B', pScore: 79.3, pScoreEng: 75.1, pScoreSpeech: 84.6, pScoreFound: 78.2, pScoreCult: 80.5, delta: -0.1 },
  ];
  
  export const REGION_DATA = [
    { group: '서울권', campuses: 8, classes: 22, students: 180, avgPerClass: 8.2, zScore: 0.8, ci: 0.58, ciGrade: 'A+', finalGrade: 'S', pScore: 83.5, pScoreEng: 79.1, pScoreSpeech: 88.2, pScoreFound: 81.0, pScoreCult: 85.5, delta: 0.8 },
    { group: '경인권', campuses: 10, classes: 25, students: 195, avgPerClass: 7.8, zScore: 0.2, ci: 0.61, ciGrade: 'A+', finalGrade: 'S', pScore: 80.5, pScoreEng: 76.2, pScoreSpeech: 86.0, pScoreFound: 79.5, pScoreCult: 82.0, delta: 0.2 },
    { group: '강원권', campuses: 2, classes: 4, students: 28, avgPerClass: 7.0, zScore: -0.5, ci: 0.72, ciGrade: 'B', finalGrade: 'B', pScore: 77.2, pScoreEng: 73.0, pScoreSpeech: 82.5, pScoreFound: 76.0, pScoreCult: 78.5, delta: -0.5 },
    { group: '충청권', campuses: 3, classes: 6, students: 45, avgPerClass: 7.5, zScore: -0.2, ci: 0.68, ciGrade: 'B', finalGrade: 'B', pScore: 78.8, pScoreEng: 74.5, pScoreSpeech: 84.0, pScoreFound: 77.5, pScoreCult: 80.0, delta: -0.2 },
    { group: '전라권', campuses: 2, classes: 4, students: 30, avgPerClass: 7.5, zScore: -0.4, ci: 0.70, ciGrade: 'B', finalGrade: 'B', pScore: 77.8, pScoreEng: 73.5, pScoreSpeech: 83.0, pScoreFound: 76.5, pScoreCult: 79.0, delta: -0.4 },
    { group: '경상권', campuses: 2, classes: 4, students: 33, avgPerClass: 8.3, zScore: -0.1, ci: 0.64, ciGrade: 'A+', finalGrade: 'B', pScore: 79.2, pScoreEng: 75.0, pScoreSpeech: 84.5, pScoreFound: 78.0, pScoreCult: 81.0, delta: -0.1 },
  ];
  
  export const STUDENT_SIZE_DATA = [
    { group: '51명 이상 (XL)', campuses: 3, classes: 15, students: 165, avgPerClass: 11.0, zScore: 1.5, ci: 0.52, ciGrade: 'A+', finalGrade: 'S', pScore: 87.5, pScoreEng: 83.5, pScoreSpeech: 93.0, pScoreFound: 85.0, pScoreCult: 89.5, delta: 1.5 },
    { group: '31 ~ 50명 (L)', campuses: 5, classes: 18, students: 190, avgPerClass: 10.6, zScore: 0.9, ci: 0.56, ciGrade: 'A+', finalGrade: 'S', pScore: 84.2, pScoreEng: 80.0, pScoreSpeech: 89.5, pScoreFound: 82.0, pScoreCult: 86.5, delta: 0.9 },
    { group: '16 ~ 30명 (M)', campuses: 10, classes: 22, students: 220, avgPerClass: 10.0, zScore: 0.1, ci: 0.63, ciGrade: 'A+', finalGrade: 'S', pScore: 80.1, pScoreEng: 75.8, pScoreSpeech: 85.5, pScoreFound: 79.0, pScoreCult: 82.0, delta: 0.1 },
    { group: '15명 이하 (S)', campuses: 9, classes: 10, students: 115, avgPerClass: 11.5, zScore: -0.8, ci: 0.75, ciGrade: 'B', finalGrade: 'B', pScore: 75.5, pScoreEng: 71.0, pScoreSpeech: 80.5, pScoreFound: 74.0, pScoreCult: 77.5, delta: -0.8 },
  ];
  
  export const CLASS_SIZE_DATA = [
    { group: '6학급 이상', campuses: 4, classes: 28, students: 285, avgPerClass: 10.2, zScore: 1.3, ci: 0.54, ciGrade: 'A+', finalGrade: 'S', pScore: 86.5, pScoreEng: 82.5, pScoreSpeech: 92.0, pScoreFound: 84.0, pScoreCult: 88.5, delta: 1.3 },
    { group: '4 ~ 5학급', campuses: 6, classes: 26, students: 250, avgPerClass: 9.6, zScore: 0.7, ci: 0.59, ciGrade: 'A+', finalGrade: 'S', pScore: 83.0, pScoreEng: 78.8, pScoreSpeech: 88.0, pScoreFound: 80.5, pScoreCult: 85.0, delta: 0.7 },
    { group: '2 ~ 3학급', campuses: 10, classes: 24, students: 210, avgPerClass: 8.8, zScore: -0.2, ci: 0.67, ciGrade: 'B', finalGrade: 'B', pScore: 78.5, pScoreEng: 74.2, pScoreSpeech: 83.5, pScoreFound: 77.0, pScoreCult: 80.5, delta: -0.2 },
    { group: '1학급', campuses: 7, classes: 7, students: 55, avgPerClass: 7.9, zScore: -1.0, ci: 0.78, ciGrade: 'B', finalGrade: 'B', pScore: 74.5, pScoreEng: 70.0, pScoreSpeech: 79.5, pScoreFound: 73.0, pScoreCult: 76.5, delta: -1.0 },
  ];
  
  export const OPERATION_PERIOD_DATA = [
    { group: '16년 이상', campuses: 5, classes: 20, students: 195, avgPerClass: 9.8, zScore: 1.1, ci: 0.55, ciGrade: 'A+', finalGrade: 'S', pScore: 85.5, pScoreEng: 81.5, pScoreSpeech: 91.0, pScoreFound: 83.0, pScoreCult: 87.5, delta: 1.1 },
    { group: '11~15년', campuses: 6, classes: 18, students: 170, avgPerClass: 9.4, zScore: 0.6, ci: 0.60, ciGrade: 'A+', finalGrade: 'S', pScore: 82.5, pScoreEng: 78.2, pScoreSpeech: 87.5, pScoreFound: 80.0, pScoreCult: 84.5, delta: 0.6 },
    { group: '6~10년', campuses: 8, classes: 22, students: 200, avgPerClass: 9.1, zScore: 0.0, ci: 0.64, ciGrade: 'A+', finalGrade: 'B', pScore: 79.8, pScoreEng: 75.5, pScoreSpeech: 85.0, pScoreFound: 78.5, pScoreCult: 81.8, delta: 0.0 },
    { group: '3~5년', campuses: 5, classes: 15, students: 130, avgPerClass: 8.7, zScore: -0.5, ci: 0.71, ciGrade: 'B', finalGrade: 'B', pScore: 77.0, pScoreEng: 72.8, pScoreSpeech: 82.0, pScoreFound: 75.5, pScoreCult: 79.0, delta: -0.5 },
    { group: '2년 이하', campuses: 3, classes: 5, students: 40, avgPerClass: 8.0, zScore: -1.2, ci: 0.82, ciGrade: 'C', finalGrade: 'C', pScore: 73.5, pScoreEng: 69.0, pScoreSpeech: 78.5, pScoreFound: 72.0, pScoreCult: 75.5, delta: -1.2 },
  ];
  
  export const PCRAM_RANKING_DATA = [
    { rank: 1, name: '서울 강남', type: '직영', region: '서울권', years: 18, classes: 8, students: 85, avgPerClass: 10.6, zScore: 2.1, ci: 0.45, grade: 'S', testType: 'MT', pScore: 90.7, pScoreEng: 87.5, pScoreSpeech: 96.0, pScoreFound: 88.5, pScoreCult: 91.0 },
    { rank: 2, name: '경기 분당', type: '직영', region: '경인권', years: 15, classes: 5, students: 44, avgPerClass: 8.8, zScore: 1.8, ci: 0.48, grade: 'S', testType: 'MT', pScore: 89.2, pScoreEng: 85.8, pScoreSpeech: 94.5, pScoreFound: 87.0, pScoreCult: 89.5 },
    { rank: 3, name: '서울 서초', type: '분원', region: '서울권', years: 12, classes: 6, students: 62, avgPerClass: 10.3, zScore: 1.6, ci: 0.50, grade: 'S', testType: 'MT', pScore: 88.0, pScoreEng: 84.5, pScoreSpeech: 93.5, pScoreFound: 86.0, pScoreCult: 88.0 },
    { rank: 4, name: '경기 일산', type: '분원', region: '경인권', years: 10, classes: 5, students: 48, avgPerClass: 9.6, zScore: 1.4, ci: 0.52, grade: 'S', testType: 'MT', pScore: 87.1, pScoreEng: 83.5, pScoreSpeech: 92.5, pScoreFound: 85.0, pScoreCult: 87.5 },
    { rank: 5, name: '서울 목동', type: '분원', region: '서울권', years: 14, classes: 7, students: 75, avgPerClass: 10.7, zScore: 1.2, ci: 0.55, grade: 'S', testType: 'MT', pScore: 86.0, pScoreEng: 82.2, pScoreSpeech: 91.5, pScoreFound: 84.0, pScoreCult: 86.2 },
    { rank: 26, name: '강원 원주', type: '분원', region: '강원권', years: 4, classes: 2, students: 14, avgPerClass: 7.0, zScore: -1.5, ci: 0.75, grade: 'B', testType: 'MT', pScore: 72.5, pScoreEng: 68.0, pScoreSpeech: 77.5, pScoreFound: 71.0, pScoreCult: 73.5 },
    { rank: 27, name: '인천 남동', type: '분원', region: '경인권', years: 2, classes: 1, students: 8, avgPerClass: 8.0, zScore: -1.8, ci: 0.78, grade: 'B', testType: 'MT', pScore: 71.0, pScoreEng: 66.5, pScoreSpeech: 76.0, pScoreFound: 69.5, pScoreCult: 72.0 },
  ];
  
  export const MATRIX_DATA = [
    { name: '서울 강남', zScore: 2.1, ci: 0.45, grade: 'S' },
    { name: '경기 분당', zScore: 1.8, ci: 0.48, grade: 'S' },
    { name: '서울 서초', zScore: 1.6, ci: 0.50, grade: 'S' },
    { name: '경기 일산', zScore: 1.4, ci: 0.52, grade: 'S' },
    { name: '서울 목동', zScore: 1.2, ci: 0.55, grade: 'S' },
    { name: '서울 송파', zScore: 1.0, ci: 0.58, grade: 'S' },
    { name: '경기 평촌', zScore: 0.8, ci: 0.60, grade: 'S' },
    { name: '경기 수지', zScore: 0.6, ci: 0.62, grade: 'S' },
    { name: '서울 노원', zScore: 0.4, ci: 0.64, grade: 'S' },
    { name: '경기 영통', zScore: 0.2, ci: 0.64, grade: 'S' },
    { name: '서울 마포', zScore: 0.1, ci: 0.64, grade: 'S' },
    { name: '부산 해운대', zScore: 0.05, ci: 0.64, grade: 'S' },
    { name: '대구 수성', zScore: 0.02, ci: 0.64, grade: 'S' },
    { name: '경기 동탄', zScore: -0.1, ci: 0.66, grade: 'B' },
    { name: '인천 송도', zScore: -0.2, ci: 0.67, grade: 'B' },
    { name: '대전 둔산', zScore: -0.3, ci: 0.68, grade: 'B' },
    { name: '광주 봉선', zScore: -0.4, ci: 0.69, grade: 'B' },
    { name: '울산 옥동', zScore: -0.5, ci: 0.70, grade: 'B' },
    { name: '경기 부천', zScore: -0.6, ci: 0.71, grade: 'B' },
    { name: '서울 강동', zScore: -0.7, ci: 0.72, grade: 'B' },
    { name: '경기 안양', zScore: -0.8, ci: 0.73, grade: 'B' },
    { name: '충남 천안', zScore: -0.9, ci: 0.74, grade: 'B' },
    { name: '전북 전주', zScore: -1.0, ci: 0.74, grade: 'B' },
    { name: '경남 창원', zScore: -1.1, ci: 0.74, grade: 'B' },
    { name: '제주 노형', zScore: -1.2, ci: 0.74, grade: 'B' },
    { name: '강원 원주', zScore: -1.5, ci: 0.75, grade: 'B' },
    { name: '인천 남동', zScore: -1.8, ci: 0.78, grade: 'B' },
  ];
  