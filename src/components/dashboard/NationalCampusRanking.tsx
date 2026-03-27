import React, { useEffect, useState } from 'react';
import { Download, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { CampusRankingData } from '@/types';
import { useExcelData } from '@/context/ExcelDataContext';
import { PSCORE_CAMPUS_2025_MT_DATA } from '@/data/pscoreCampus2025MtData';
import { parseExamOptionLabel, toExamPeriodKey } from '@/utils/examPeriod';

// eslint-disable-next-line react-refresh/only-export-components -- mock dataset co-exported with component
export const mockData: CampusRankingData[] = [
  { id: 1, campus: '폴리어학원(천안)', type: '분원', region: '충청권', operationPeriod: 16, classes: 1, students: 12, avgPerClass: 12, scCv: 0.15, pScore: 93.5, tpiGrade: 'S', tpiScore: 95, balanceCv: 4.1, zScore: 0.72, confidenceCi: 0.465, coreGrade: 'S', eliteZ: 0.72, eliteCv: 4.9, emiGrade: 'G' },
  { id: 2, campus: '폴리어학원(정발)', type: '직영', region: '경인권', operationPeriod: 27, classes: 6, students: 48, avgPerClass: 8, scCv: 0.12, pScore: 90.1, tpiGrade: 'S', tpiScore: 92, balanceCv: 6.9, zScore: 0.49, confidenceCi: 0.446, coreGrade: 'S', eliteZ: 0.49, eliteCv: 5.7, emiGrade: 'G' },
  { id: 3, campus: '폴리어학원(수지별관)', type: '직영', region: '경인권', operationPeriod: 4, classes: 5, students: 60, avgPerClass: 12, scCv: 0.14, pScore: 89.9, tpiGrade: 'S', tpiScore: 91, balanceCv: 7.2, zScore: 0.48, confidenceCi: 0.42, coreGrade: 'S', eliteZ: 0.48, eliteCv: 5.8, emiGrade: 'G' },
  { id: 4, campus: '폴리어학원(광산)', type: '분원', region: '전라권', operationPeriod: 9, classes: 1, students: 8, avgPerClass: 8, scCv: 0.16, pScore: 89.7, tpiGrade: 'S', tpiScore: 90, balanceCv: 6.2, zScore: 0.46, confidenceCi: 0.4, coreGrade: 'S', eliteZ: 0.46, eliteCv: 5.1, emiGrade: 'G' },
  { id: 5, campus: '폴리어학원(강동)', type: '분원', region: '서울권', operationPeriod: 7, classes: 3, students: 25, avgPerClass: 8.3, scCv: 0.13, pScore: 89.3, tpiGrade: 'S', tpiScore: 89, balanceCv: 3.5, zScore: 0.42, confidenceCi: 0.602, coreGrade: 'S', eliteZ: 0.42, eliteCv: 4.8, emiGrade: 'G' },
  { id: 6, campus: '폴리어학원(분당)', type: '직영', region: '경인권', operationPeriod: 19, classes: 6, students: 61, avgPerClass: 10.2, pScore: 88.7, tpiGrade: 'A', tpiScore: 88, balanceCv: 8.2, zScore: 0.4, confidenceCi: 0.483, coreGrade: 'S', eliteZ: 0.4, eliteCv: 6.2, emiGrade: 'G' },
  { id: 7, campus: '대치폴리매그넷', type: '직영', region: '서울권', operationPeriod: 3, classes: 1, students: 10, avgPerClass: 10, pScore: 88.4, tpiGrade: 'A', tpiScore: 87, balanceCv: 9.4, zScore: 0.38, confidenceCi: 0.405, coreGrade: 'S', eliteZ: 0.38, eliteCv: 6.4, emiGrade: 'G' },
  { id: 8, campus: '폴리어학원(송파)', type: '직영', region: '서울권', operationPeriod: 19, classes: 4, students: 45, avgPerClass: 11.2, pScore: 88.0, tpiGrade: 'A', tpiScore: 86, balanceCv: 5.8, zScore: 0.34, confidenceCi: 0.669, coreGrade: 'A', eliteZ: 0.34, eliteCv: 7.0, emiGrade: 'G' },
  { id: 9, campus: '폴리어학원(송도)', type: '직영', region: '경인권', operationPeriod: 24, classes: 2, students: 24, avgPerClass: 12, pScore: 87.9, tpiGrade: 'A', tpiScore: 85, balanceCv: 8.3, zScore: 0.34, confidenceCi: 0.432, coreGrade: 'S', eliteZ: 0.34, eliteCv: 7.0, emiGrade: 'G' },
  { id: 10, campus: '폴리어학원(청라)', type: '분원', region: '경인권', operationPeriod: 8, classes: 1, students: 8, avgPerClass: 8, pScore: 87.8, tpiGrade: 'A', tpiScore: 84, balanceCv: 7.5, zScore: 0.33, confidenceCi: 0.785, coreGrade: 'A', eliteZ: 0.33, eliteCv: 6.2, emiGrade: 'G' },
  { id: 11, campus: '폴리어학원(수성)', type: '분원', region: '경상권', operationPeriod: 19, classes: 4, students: 37, avgPerClass: 9.2, pScore: 87.7, tpiGrade: 'A', tpiScore: 83, balanceCv: 7.6, zScore: 0.33, confidenceCi: 0.456, coreGrade: 'S', eliteZ: 0.33, eliteCv: 6.6, emiGrade: 'G' },
  { id: 12, campus: '폴리어학원(김해)', type: '분원', region: '경상권', operationPeriod: 9, classes: 2, students: 11, avgPerClass: 5.5, pScore: 87.7, tpiGrade: 'A', tpiScore: 82, balanceCv: 8.0, zScore: 0.33, confidenceCi: 0.583, coreGrade: 'S', eliteZ: 0.33, eliteCv: 5.0, emiGrade: 'G' },
  { id: 13, campus: '폴리어학원(목동)', type: '직영', region: '서울권', operationPeriod: 24, classes: 10, students: 114, avgPerClass: 11.4, pScore: 87.5, tpiGrade: 'A', tpiScore: 81, balanceCv: 8.6, zScore: 0.31, confidenceCi: 0.416, coreGrade: 'S', eliteZ: 0.31, eliteCv: 6.1, emiGrade: 'G' },
  { id: 14, campus: '폴리어학원(성동)', type: '분원', region: '서울권', operationPeriod: 20, classes: 3, students: 24, avgPerClass: 8, pScore: 87.3, tpiGrade: 'B', tpiScore: 79, balanceCv: 5.5, zScore: 0.29, confidenceCi: 0.493, coreGrade: 'S', eliteZ: 0.29, eliteCv: 6.2, emiGrade: 'G' },
  { id: 15, campus: '폴리어학원(위례)', type: '직영', region: '서울권', operationPeriod: 5, classes: 3, students: 32, avgPerClass: 10.7, pScore: 87.1, tpiGrade: 'B', tpiScore: 78, balanceCv: 6.9, zScore: 0.27, confidenceCi: 0.376, coreGrade: 'S', eliteZ: 0.27, eliteCv: 4.6, emiGrade: 'G' },
  { id: 16, campus: '폴리어학원(마산)', type: '분원', region: '경상권', operationPeriod: 7, classes: 2, students: 20, avgPerClass: 10, pScore: 86.4, tpiGrade: 'B', tpiScore: 77, balanceCv: 4.6, zScore: 0.22, confidenceCi: 0.525, coreGrade: 'S', eliteZ: 0.22, eliteCv: 5.6, emiGrade: 'G' },
  { id: 17, campus: '폴리어학원(달서)', type: '분원', region: '경상권', operationPeriod: 17, classes: 3, students: 24, avgPerClass: 8, pScore: 86.0, tpiGrade: 'B', tpiScore: 76, balanceCv: 8.0, zScore: 0.21, confidenceCi: 0.406, coreGrade: 'S', eliteZ: 0.21, eliteCv: 5.7, emiGrade: 'G' },
  { id: 18, campus: '폴리어학원(성북)', type: '분원', region: '서울권', operationPeriod: 19, classes: 4, students: 36, avgPerClass: 9, pScore: 85.9, tpiGrade: 'B', tpiScore: 75, balanceCv: 9.0, zScore: 0.2, confidenceCi: 0.56, coreGrade: 'S', eliteZ: 0.2, eliteCv: 6.4, emiGrade: 'G' },
  { id: 19, campus: '폴리어학원(영통)', type: '분원', region: '경인권', operationPeriod: 22, classes: 2, students: 21, avgPerClass: 10.5, pScore: 85.9, tpiGrade: 'B', tpiScore: 74, balanceCv: 12.0, zScore: 0.22, confidenceCi: 0.411, coreGrade: 'S', eliteZ: 0.22, eliteCv: 5.6, emiGrade: 'G' },
  { id: 20, campus: '폴리어학원(광명)', type: '직영', region: '경인권', operationPeriod: 22, classes: 2, students: 17, avgPerClass: 8.5, pScore: 85.9, tpiGrade: 'B', tpiScore: 73, balanceCv: 9.4, zScore: 0.21, confidenceCi: 0.503, coreGrade: 'S', eliteZ: 0.21, eliteCv: 5.9, emiGrade: 'G' },
  { id: 21, campus: '폴리어학원(동래)', type: '분원', region: '경상권', operationPeriod: 7, classes: 1, students: 12, avgPerClass: 12, pScore: 85.7, tpiGrade: 'B', tpiScore: 72, balanceCv: 6.9, zScore: 0.18, confidenceCi: 0.508, coreGrade: 'S', eliteZ: 0.18, eliteCv: 5.6, emiGrade: 'G' },
  { id: 22, campus: '폴리어학원(동탄)', type: '분원', region: '경인권', operationPeriod: 18, classes: 3, students: 36, avgPerClass: 12, pScore: 85.4, tpiGrade: 'B', tpiScore: 71, balanceCv: 7.6, zScore: 0.17, confidenceCi: 0.635, coreGrade: 'S', eliteZ: 0.17, eliteCv: 5.6, emiGrade: 'G' },
  { id: 23, campus: '폴리어학원(하남미사)', type: '분원', region: '경인권', operationPeriod: 5, classes: 3, students: 26, avgPerClass: 8.7, pScore: 84.8, tpiGrade: 'B', tpiScore: 70, balanceCv: 12.2, zScore: 0.14, confidenceCi: 0.394, coreGrade: 'S', eliteZ: 0.14, eliteCv: 6.5, emiGrade: 'G' },
  { id: 24, campus: '폴리어학원(광교)', type: '직영', region: '경인권', operationPeriod: 4, classes: 2, students: 16, avgPerClass: 8, pScore: 84.3, tpiGrade: 'B', tpiScore: 69, balanceCv: 9.3, zScore: 0.09, confidenceCi: 0.587, coreGrade: 'S', eliteZ: 0.09, eliteCv: 7.0, emiGrade: 'G' },
  { id: 25, campus: '폴리어학원(평촌)', type: '분원', region: '경인권', operationPeriod: 24, classes: 3, students: 36, avgPerClass: 12, pScore: 84.2, tpiGrade: 'B', tpiScore: 68, balanceCv: 9.4, zScore: 0.09, confidenceCi: 0.568, coreGrade: 'S', eliteZ: 0.09, eliteCv: 7.0, emiGrade: 'G' },
  { id: 26, campus: '폴리어학원(울산남구)', type: '분원', region: '경상권', operationPeriod: 3, classes: 1, students: 11, avgPerClass: 11, pScore: 83.6, tpiGrade: 'B', tpiScore: 67, balanceCv: 14.0, zScore: 0.06, confidenceCi: 0.35, coreGrade: 'S', eliteZ: 0.06, eliteCv: 4.2, emiGrade: 'G' },
  { id: 27, campus: '폴리어학원(김포)', type: '분원', region: '경인권', operationPeriod: 15, classes: 2, students: 18, avgPerClass: 9, pScore: 82.7, tpiGrade: 'B', tpiScore: 66, balanceCv: 13.1, zScore: 0, confidenceCi: 0.431, coreGrade: 'B', eliteZ: 0, eliteCv: 5.1, emiGrade: 'G' },
  { id: 28, campus: '폴리어학원(마포)', type: '분원', region: '서울권', operationPeriod: 19, classes: 5, students: 52, avgPerClass: 10.4, pScore: 82.7, tpiGrade: 'B', tpiScore: 65, balanceCv: 10.0, zScore: -0.02, confidenceCi: 0.423, coreGrade: 'B', eliteZ: -0.02, eliteCv: 5.4, emiGrade: 'G' },
  { id: 29, campus: '폴리어학원(유성)', type: '직영', region: '충청권', operationPeriod: 20, classes: 5, students: 55, avgPerClass: 11, pScore: 82.4, tpiGrade: 'B', tpiScore: 64, balanceCv: 8.8, zScore: -0.04, confidenceCi: 0.438, coreGrade: 'B', eliteZ: -0.04, eliteCv: 6.5, emiGrade: 'G' },
  { id: 30, campus: '폴리어학원(창원)', type: '분원', region: '경상권', operationPeriod: 18, classes: 2, students: 17, avgPerClass: 8.5, pScore: 82.4, tpiGrade: 'B', tpiScore: 63, balanceCv: 9.7, zScore: -0.04, confidenceCi: 0.366, coreGrade: 'B', eliteZ: -0.04, eliteCv: 5.5, emiGrade: 'G' },
  { id: 31, campus: '폴리어학원(부산명지)', type: '분원', region: '경상권', operationPeriod: 2, classes: 2, students: 16, avgPerClass: 8, pScore: 81.9, tpiGrade: 'C', tpiScore: 62, balanceCv: 7.0, zScore: -0.09, confidenceCi: 0.52, coreGrade: 'B', eliteZ: -0.09, eliteCv: 4.3, emiGrade: 'G' },
  { id: 32, campus: '폴리어학원(운정)', type: '직영', region: '경인권', operationPeriod: 3, classes: 3, students: 33, avgPerClass: 11, pScore: 81.8, tpiGrade: 'C', tpiScore: 61, balanceCv: 7.5, zScore: -0.1, confidenceCi: 0.662, coreGrade: 'B', eliteZ: -0.1, eliteCv: 6.7, emiGrade: 'G' },
  { id: 33, campus: '폴리어학원(세종)', type: '분원', region: '충청권', operationPeriod: 11, classes: 2, students: 15, avgPerClass: 7.5, pScore: 81.5, tpiGrade: 'C', tpiScore: 60, balanceCv: 10.9, zScore: -0.1, confidenceCi: 0.457, coreGrade: 'B', eliteZ: -0.1, eliteCv: 6.4, emiGrade: 'G' },
  { id: 34, campus: '폴리어학원(시흥장현)', type: '분원', region: '경인권', operationPeriod: 2, classes: 1, students: 5, avgPerClass: 5, pScore: 81.3, tpiGrade: 'C', tpiScore: 59, balanceCv: 11.6, zScore: -0.13, confidenceCi: 0.639, coreGrade: 'B', eliteZ: -0.13, eliteCv: 9.8, emiGrade: 'G' },
  { id: 35, campus: '폴리어학원(은평)', type: '분원', region: '서울권', operationPeriod: 12, classes: 2, students: 14, avgPerClass: 7, pScore: 81.0, tpiGrade: 'C', tpiScore: 58, balanceCv: 15.1, zScore: -0.13, confidenceCi: 0.473, coreGrade: 'B', eliteZ: -0.13, eliteCv: 5.1, emiGrade: 'G' },
  { id: 36, campus: '폴리어학원(덕양)', type: '분원', region: '경인권', operationPeriod: 24, classes: 1, students: 11, avgPerClass: 11, pScore: 80.8, tpiGrade: 'C', tpiScore: 57, balanceCv: 14.4, zScore: -0.13, confidenceCi: 0.459, coreGrade: 'B', eliteZ: -0.13, eliteCv: 5.4, emiGrade: 'G' },
  { id: 37, campus: '폴리어학원(평택지제)', type: '분원', region: '경인권', operationPeriod: 1, classes: 3, students: 23, avgPerClass: 7.7, pScore: 80.8, tpiGrade: 'C', tpiScore: 56, balanceCv: 10.3, zScore: -0.16, confidenceCi: 0.451, coreGrade: 'B', eliteZ: -0.16, eliteCv: 6.5, emiGrade: 'G' },
  { id: 38, campus: '폴리어학원(청주)', type: '분원', region: '충청권', operationPeriod: 14, classes: 6, students: 66, avgPerClass: 11, pScore: 80.2, tpiGrade: 'C', tpiScore: 55, balanceCv: 9.3, zScore: -0.2, confidenceCi: 0.564, coreGrade: 'B', eliteZ: -0.2, eliteCv: 6.3, emiGrade: 'G' },
  { id: 39, campus: '폴리어학원(관악)', type: '분원', region: '서울권', operationPeriod: 21, classes: 3, students: 27, avgPerClass: 9, pScore: 80.1, tpiGrade: 'C', tpiScore: 54, balanceCv: 7.5, zScore: -0.22, confidenceCi: 0.485, coreGrade: 'B', eliteZ: -0.22, eliteCv: 8.0, emiGrade: 'G' },
  { id: 40, campus: '폴리어학원(중계)', type: '직영', region: '서울권', operationPeriod: 24, classes: 4, students: 31, avgPerClass: 7.8, pScore: 80.0, tpiGrade: 'C', tpiScore: 53, balanceCv: 10.9, zScore: -0.21, confidenceCi: 0.477, coreGrade: 'B', eliteZ: -0.21, eliteCv: 6.3, emiGrade: 'G' },
  { id: 41, campus: '폴리어학원(부산화명)', type: '분원', region: '경상권', operationPeriod: 2, classes: 3, students: 15, avgPerClass: 5, pScore: 79.1, tpiGrade: 'C', tpiScore: 52, balanceCv: 13.1, zScore: -0.26, confidenceCi: 0.413, coreGrade: 'B', eliteZ: -0.26, eliteCv: 5.7, emiGrade: 'G' },
  { id: 42, campus: '폴리어학원(해운대)', type: '분원', region: '경상권', operationPeriod: 9, classes: 2, students: 22, avgPerClass: 11, pScore: 78.9, tpiGrade: 'C', tpiScore: 51, balanceCv: 10.3, zScore: -0.29, confidenceCi: 0.498, coreGrade: 'B', eliteZ: -0.29, eliteCv: 6.1, emiGrade: 'G' },
  { id: 43, campus: '폴리어학원(광안)', type: '분원', region: '경상권', operationPeriod: 16, classes: 2, students: 15, avgPerClass: 7.5, pScore: 78.4, tpiGrade: 'C', tpiScore: 50, balanceCv: 12.0, zScore: -0.32, confidenceCi: 0.477, coreGrade: 'B', eliteZ: -0.32, eliteCv: 5.1, emiGrade: 'G' },
  { id: 44, campus: '폴리어학원(대구북구)', type: '분원', region: '경상권', operationPeriod: 3, classes: 2, students: 16, avgPerClass: 8, pScore: 77.8, tpiGrade: 'C', tpiScore: 49, balanceCv: 8.1, zScore: -0.38, confidenceCi: 0.506, coreGrade: 'B', eliteZ: -0.38, eliteCv: 5.7, emiGrade: 'G' },
  { id: 45, campus: '폴리어학원(원주)', type: '분원', region: '강원권', operationPeriod: 1, classes: 2, students: 14, avgPerClass: 7, pScore: 77.8, tpiGrade: 'C', tpiScore: 48, balanceCv: 14.3, zScore: -0.35, confidenceCi: 0.514, coreGrade: 'B', eliteZ: -0.35, eliteCv: 5.3, emiGrade: 'G' },
  { id: 46, campus: '폴리어학원(동대문)', type: '분원', region: '서울권', operationPeriod: 19, classes: 2, students: 15, avgPerClass: 7.5, pScore: 77.3, tpiGrade: 'C', tpiScore: 47, balanceCv: 11.6, zScore: -0.4, confidenceCi: 0.533, coreGrade: 'B', eliteZ: -0.4, eliteCv: 6.2, emiGrade: 'G' },
  { id: 47, campus: '폴리어학원(광진)', type: '분원', region: '서울권', operationPeriod: 11, classes: 1, students: 12, avgPerClass: 12, pScore: 77.0, tpiGrade: 'C', tpiScore: 46, balanceCv: 12.9, zScore: -0.41, confidenceCi: 0.507, coreGrade: 'B', eliteZ: -0.41, eliteCv: 4.6, emiGrade: 'G' },
  { id: 48, campus: '폴리어학원(구리/남양주)', type: '분원', region: '경인권', operationPeriod: 17, classes: 1, students: 8, avgPerClass: 8, pScore: 76.7, tpiGrade: 'C', tpiScore: 45, balanceCv: 9.4, zScore: -0.45, confidenceCi: 0.488, coreGrade: 'B', eliteZ: -0.45, eliteCv: 5.7, emiGrade: 'G' },
  { id: 49, campus: '폴리어학원(대전)', type: '직영', region: '충청권', operationPeriod: 22, classes: 5, students: 51, avgPerClass: 10.2, pScore: 76.3, tpiGrade: 'C', tpiScore: 44, balanceCv: 8.9, zScore: -0.49, confidenceCi: 0.511, coreGrade: 'B', eliteZ: -0.49, eliteCv: 6.4, emiGrade: 'G' },
  { id: 50, campus: '폴리어학원(남동)', type: '분원', region: '경인권', operationPeriod: 9, classes: 1, students: 6, avgPerClass: 6, pScore: 76.3, tpiGrade: 'C', tpiScore: 43, balanceCv: 9.5, zScore: -0.49, confidenceCi: 0.386, coreGrade: 'B', eliteZ: -0.49, eliteCv: 5.4, emiGrade: 'G' },
  { id: 51, campus: '폴리어학원(전주)', type: '분원', region: '전라권', operationPeriod: 17, classes: 3, students: 16, avgPerClass: 5.3, pScore: 76.3, tpiGrade: 'C', tpiScore: 42, balanceCv: 7.0, zScore: -0.5, confidenceCi: 0.52, coreGrade: 'B', eliteZ: -0.5, eliteCv: 5.1, emiGrade: 'G' },
  { id: 52, campus: '폴리어학원(부천)', type: '분원', region: '경인권', operationPeriod: 24, classes: 3, students: 24, avgPerClass: 8, pScore: 75.2, tpiGrade: 'C', tpiScore: 41, balanceCv: 13.6, zScore: -0.54, confidenceCi: 0.412, coreGrade: 'B', eliteZ: -0.54, eliteCv: 6.5, emiGrade: 'L' },
  { id: 53, campus: '폴리어학원(포항)', type: '분원', region: '경상권', operationPeriod: 18, classes: 3, students: 25, avgPerClass: 8.3, pScore: 73.9, tpiGrade: 'C', tpiScore: 40, balanceCv: 12.8, zScore: -0.64, confidenceCi: 0.508, coreGrade: 'B', eliteZ: -0.64, eliteCv: 4.4, emiGrade: 'L' },
  { id: 54, campus: '폴리어학원(광주봉선)', type: '분원', region: '전라권', operationPeriod: 1, classes: 3, students: 15, avgPerClass: 5, pScore: 71.6, tpiGrade: 'C', tpiScore: 39, balanceCv: 14.9, zScore: -0.79, confidenceCi: 0.608, coreGrade: 'B', eliteZ: -0.79, eliteCv: 3.0, emiGrade: 'L' },
  { id: 55, campus: '폴리어학원(구미)', type: '분원', region: '경상권', operationPeriod: 15, classes: 3, students: 23, avgPerClass: 7.7, pScore: 69.1, tpiGrade: 'C', tpiScore: 38, balanceCv: 7.9, zScore: -1, confidenceCi: 0.643, coreGrade: 'B', eliteZ: -1, eliteCv: 5.7, emiGrade: 'L' },
  { id: 56, campus: '폴리어학원(서대문)', type: '분원', region: '서울권', operationPeriod: 18, classes: 2, students: 12, avgPerClass: 6, pScore: 69.1, tpiGrade: 'C', tpiScore: 37, balanceCv: 9.5, zScore: -1, confidenceCi: 0.573, coreGrade: 'B', eliteZ: -1, eliteCv: 3.1, emiGrade: 'L' },
  { id: 57, campus: '폴리어학원(강서)', type: '분원', region: '서울권', operationPeriod: 13, classes: 3, students: 23, avgPerClass: 7.7, pScore: 68.3, tpiGrade: 'C', tpiScore: 36, balanceCv: 10.5, zScore: -1.05, confidenceCi: 0.549, coreGrade: 'B', eliteZ: -1.05, eliteCv: 7.8, emiGrade: 'L' },
  { id: 58, campus: '폴리어학원(진주)', type: '분원', region: '경상권', operationPeriod: 2, classes: 1, students: 12, avgPerClass: 12, pScore: 60.7, tpiGrade: 'C', tpiScore: 35, balanceCv: 8.9, zScore: -1.6, confidenceCi: 0.7, coreGrade: 'B', eliteZ: -1.6, eliteCv: 6.5, emiGrade: 'L' }
];

type SortCriteria = keyof CampusRankingData | 'pScoreEng' | 'pScoreSpeech' | 'pScoreFound' | 'pScoreCult';
type FilterType = '전체' | '직영' | '분원';

export function NationalCampusRanking({ 
  title = "전국 캠퍼스 랭킹", 
  showOnlyPScore = false,
  selectedSubjects = ['English', 'Speech Building', 'Eng. Foundations'],
  subjectMap = {
    'English': { label: 'English', key: 'pScoreEng' },
    'Speech Building': { label: 'Speech Building', key: 'pScoreSpeech' },
    'Eng. Foundations': { label: 'Eng. Foundations', key: 'pScoreFound' },
    'Cultural Conn.': { label: 'Cultural Conn.', key: 'pScoreCult' }
  },
  filterCampusName,
  selectedCampuses = [],
  highlightedCampusName,
  selectedYear,
  selectedTests = []
}: { 
  title?: string, 
  showOnlyPScore?: boolean,
  selectedSubjects?: string[],
  subjectMap?: { [key: string]: { label: string, key: string } },
  filterCampusName?: string,
  selectedCampuses?: string[],
  highlightedCampusName?: string,
  selectedYear?: number,
  selectedTests?: string[]
}) {
  const { campusRankingData } = useExcelData();
  const normalizeCampusName = (name: string) =>
    name.replace('폴리어학원(', '').replace(')', '').trim();

  const pScoreRows = PSCORE_CAMPUS_2025_MT_DATA.filter((row) => row.section === 'P-Score');
  const selectedPeriodKeys = selectedTests
    .map(parseExamOptionLabel)
    .filter((period): period is { year: number; month: number } => Boolean(period))
    .map(toExamPeriodKey);
  const periodKeySet = new Set(selectedPeriodKeys);

  const candidateRows =
    periodKeySet.size > 0
      ? pScoreRows.filter((row) => periodKeySet.has(toExamPeriodKey({ year: row.year, month: row.month })))
      : selectedYear
        ? pScoreRows.filter((row) => row.year === selectedYear)
        : pScoreRows;

  const targetRows = candidateRows.length > 0 ? candidateRows : pScoreRows;
  const latestPeriodKey = targetRows.reduce((max, row) => Math.max(max, toExamPeriodKey({ year: row.year, month: row.month })), 0);
  const latestRows = targetRows.filter((row) => toExamPeriodKey({ year: row.year, month: row.month }) === latestPeriodKey);
  const excelRowByCampus = new Map(latestRows.map((row) => [normalizeCampusName(row.campus), row]));

  const mergedMockData: CampusRankingData[] = mockData.map((item) => {
    const excelRow = excelRowByCampus.get(normalizeCampusName(item.campus));
    if (!excelRow) {
      return item;
    }

    const avgPerClass = excelRow.classes > 0 ? Number((excelRow.students / excelRow.classes).toFixed(1)) : item.avgPerClass;
    const pScore = excelRow.totalAveragePct > 0 ? excelRow.totalAveragePct : item.pScore;

    return {
      ...item,
      type: excelRow.operationType || item.type,
      region: excelRow.region || item.region,
      classes: excelRow.classes || item.classes,
      students: excelRow.students || item.students,
      avgPerClass,
      zScore: excelRow.zScore,
      confidenceCi: excelRow.ciMedian,
      coreGrade: excelRow.finalGrade || item.coreGrade,
      pScore,
    };
  });

  const sourceRows = campusRankingData ?? mergedMockData;

  const [sortCriteria, setSortCriteria] = useState<SortCriteria>('pScore');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [filterType, setFilterType] = useState<FilterType>('전체');

  const displaySubjects = ['English', 'Speech Building', 'Eng. Foundations', 'Cultural Conn.'].filter(s => selectedSubjects.includes(s));

  const handleSortClick = (criteria: SortCriteria) => {
    if (sortCriteria === criteria) {
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortCriteria(criteria);
      setSortDirection('desc');
    }
  };

  const handleDownloadExcel = () => {
    const excelData = sortedData.map((item, index) => {
      const baseData: any = {
        'No.': index + 1,
        '캠퍼스': item.campus,
        '운영주체': item.type,
        '지역권역': item.region,
        '운영 연수': item.operationPeriod,
        '학급수': item.classes,
        '학생수': item.students,
        '급당평균': item.avgPerClass,
        'SC-CV': item.scCv || 0,
      };

      if (!showOnlyPScore) {
        baseData['TPI 등급'] = item.tpiGrade;
        baseData['TPI 점수'] = item.tpiScore;
      }

      if (showOnlyPScore) {
        baseData['Balance CV'] = `${item.balanceCv.toFixed(1)}%`;
        baseData['총평균'] = `${item.pScore.toFixed(1)}%`;
        displaySubjects.forEach(sub => {
          const config = subjectMap[sub];
          if (config) {
            baseData[config.label] = `${(item as any)[config.key].toFixed(1)}%`;
          }
        });
      } else {
        baseData['P-SCORE'] = `${item.pScore.toFixed(1)}%`;
        baseData['Balance CV'] = `${item.balanceCv.toFixed(1)}%`;
      }

      if (!showOnlyPScore) {
        baseData['Z-Score'] = item.zScore.toFixed(2);
        baseData['신뢰 CI'] = item.confidenceCi.toFixed(3);
        baseData['핵심 등급'] = item.coreGrade;
        baseData['Elite Z'] = item.eliteZ.toFixed(2);
        baseData['Elite CV'] = `${item.eliteCv.toFixed(1)}%`;
        baseData['EMI 등급'] = item.emiGrade;
      }

      return baseData;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);

    XLSX.writeFile(workbook, `${title.replace(/ /g, '_')}.xlsx`);
  };

  const enhancedMockData = sourceRows.map(item => ({
    ...item,
    pScoreEng: Number((item.pScore - 2.1).toFixed(1)),
    pScoreSpeech: Number((item.pScore + 3.2).toFixed(1)),
    pScoreFound: Number((item.pScore - 1.1).toFixed(1)),
    pScoreCult: Number((item.pScore + 0.5).toFixed(1)),
  }));

  const filteredData = enhancedMockData.filter(item => {
    if (selectedCampuses.length > 0) {
      return selectedCampuses.some((campus) => item.campus.includes(campus));
    }
    if (filterCampusName) {
      return item.campus.includes(filterCampusName);
    }
    if (filterType === '전체') return true;
    return item.type === filterType;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const valA = (a as any)[sortCriteria];
    const valB = (b as any)[sortCriteria];

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDirection === 'desc' 
        ? valB.localeCompare(valA) 
        : valA.localeCompare(valB);
    }
    
    const numA = valA as number;
    const numB = valB as number;
    return sortDirection === 'desc' ? numB - numA : numA - numB;
  });

  const SortButton = ({ criteria, label, align = 'center' }: { criteria: SortCriteria, label: string, align?: 'center' | 'right' | 'left' }) => {
    const isActive = sortCriteria === criteria;
    
    return (
      <button 
        onClick={() => handleSortClick(criteria)}
        className={`group flex items-center gap-1 w-full transition-colors ${
          align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'
        } ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400'}`}
      >
        <span className="font-semibold whitespace-nowrap">{label}</span>
        {isActive ? (
          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />
        ) : (
          <ArrowUpDown className="w-3 h-3 shrink-0 opacity-40 group-hover:opacity-100" />
        )}
      </button>
    );
  };

  const normalizedHighlightedCampus = highlightedCampusName ? normalizeCampusName(highlightedCampusName) : '';

  useEffect(() => {
    if (!normalizedHighlightedCampus) return;
    const rowId = `ranking-row-${encodeURIComponent(normalizedHighlightedCampus)}`;
    const rowEl = document.getElementById(rowId);
    if (rowEl) {
      rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [normalizedHighlightedCampus, sortCriteria, sortDirection, filterType, selectedCampuses, selectedYear, selectedTests]);

  return (
    <div id="national-campus-ranking" className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {title}
              <span className="text-sm font-normal text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                {filteredData.length}개 캠퍼스
              </span>
            </h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Buttons */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
              {(['전체', '직영', '분원'] as FilterType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    filterType === type
                      ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Excel Download Button */}
            <button
              onClick={handleDownloadExcel}
              className="flex items-center gap-2 px-1.5 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 rounded-lg text-sm font-medium transition-colors border border-emerald-200 dark:border-emerald-800"
            >
              <Download className="w-4 h-4" />
              Excel 다운로드
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            {/* Top Header Row for Column Groups */}
            <tr>
              <th colSpan={9} className="px-1.5 py-1 text-center border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                기본 정보
              </th>
              {!showOnlyPScore && (
                <th colSpan={2} className="px-1.5 py-1 text-center border-r border-slate-200 dark:border-slate-700 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300">
                  TPI
                </th>
              )}
              <th colSpan={showOnlyPScore ? displaySubjects.length + 2 : 2} className={`px-1.5 py-1 text-center bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 ${!showOnlyPScore ? 'border-r border-slate-200 dark:border-slate-700' : ''}`}>
                P-SCORE 영역
              </th>
              {!showOnlyPScore && (
                <>
                  <th colSpan={3} className="px-1.5 py-1 text-center border-r border-slate-200 dark:border-slate-700 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                    PC-RAM 영역
                  </th>
                  <th colSpan={3} className="px-1.5 py-1 text-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300">
                    PEQM 영역
                  </th>
                </>
              )}
            </tr>
            {/* Bottom Header Row for Column Names */}
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="px-1.5 py-1 font-semibold text-center w-12 bg-slate-50 dark:bg-slate-800">No.</th>
              <th className="px-1.5 py-1 font-semibold bg-slate-50 dark:bg-slate-800">
                <SortButton criteria="campus" label="캠퍼스" align="left" />
              </th>
              <th className="px-1.5 py-1 font-semibold text-center bg-slate-50 dark:bg-slate-800">
                <SortButton criteria="type" label="운영주체" />
              </th>
              <th className="px-1.5 py-1 font-semibold text-center bg-slate-50 dark:bg-slate-800">
                <SortButton criteria="region" label="지역권역" />
              </th>
              <th className="px-1.5 py-1 font-semibold text-right bg-slate-50 dark:bg-slate-800">
                <SortButton criteria="operationPeriod" label="운영 연수" align="right" />
              </th>
              <th className="px-1.5 py-1 font-semibold text-right bg-slate-50 dark:bg-slate-800">
                <SortButton criteria="classes" label="학급수" align="right" />
              </th>
              <th className="px-1.5 py-1 font-semibold text-right bg-slate-50 dark:bg-slate-800">
                <SortButton criteria="students" label="학생수" align="right" />
              </th>
              <th className="px-1.5 py-1 font-semibold text-right bg-slate-50 dark:bg-slate-800">
                <SortButton criteria="avgPerClass" label="급당평균" align="right" />
              </th>
              <th className="px-1.5 py-1 font-semibold text-right border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <SortButton criteria="scCv" label="SC-CV" align="right" />
              </th>
              
              {/* TPI */}
              {!showOnlyPScore && (
                <>
                  <th className="px-1.5 py-1 font-semibold text-center bg-indigo-50/50 dark:bg-indigo-900/10">
                    <SortButton criteria="tpiGrade" label="등급" />
                  </th>
                  <th className="px-1.5 py-1 font-semibold text-right border-r border-slate-200 dark:border-slate-700 bg-indigo-50/50 dark:bg-indigo-900/10">
                    <SortButton criteria="tpiScore" label="점수" align="right" />
                  </th>
                </>
              )}

              {/* P-SCORE */}
              {showOnlyPScore ? (
                <>
                  <th className="px-1.5 py-1 font-semibold text-right bg-orange-50/50 dark:bg-orange-900/10">
                    <SortButton criteria="balanceCv" label="Balance CV" align="right" />
                  </th>
                  <th className="px-1.5 py-1 font-semibold text-right bg-orange-50/50 dark:bg-orange-900/10">
                    <SortButton criteria="pScore" label="총평균" align="right" />
                  </th>
                  {displaySubjects.map(sub => (
                    <th key={sub} className="px-1.5 py-1 font-semibold text-right bg-orange-50/50 dark:bg-orange-900/10">
                      <SortButton criteria={subjectMap[sub].key as any} label={subjectMap[sub].label} align="right" />
                    </th>
                  ))}
                </>
              ) : (
                <>
                  <th className="px-1.5 py-1 font-semibold text-right bg-orange-50/50 dark:bg-orange-900/10">
                    <SortButton criteria="pScore" label="P-SCORE" align="right" />
                  </th>
                  <th className={`px-1.5 py-1 font-semibold text-right bg-orange-50/50 dark:bg-orange-900/10 ${!showOnlyPScore ? 'border-r border-slate-200 dark:border-slate-700' : ''}`}>
                    <SortButton criteria="balanceCv" label="Balance CV" align="right" />
                  </th>
                </>
              )}
              
              {/* PC-RAM */}
              {!showOnlyPScore && (
                <>
                  <th className="px-1.5 py-1 font-semibold text-right bg-blue-50/50 dark:bg-blue-900/10">
                    <SortButton criteria="zScore" label="Z-Score" align="right" />
                  </th>
                  <th className="px-1.5 py-1 font-semibold text-right bg-blue-50/50 dark:bg-blue-900/10">
                    <SortButton criteria="confidenceCi" label="신뢰 CI" align="right" />
                  </th>
                  <th className="px-1.5 py-1 font-semibold text-center border-r border-slate-200 dark:border-slate-700 bg-blue-50/50 dark:bg-blue-900/10">
                    <SortButton criteria="coreGrade" label="핵심 등급" />
                  </th>
                  
                  {/* PEQM */}
                  <th className="px-1.5 py-1 font-semibold text-right bg-emerald-50/50 dark:bg-emerald-900/10">
                    <SortButton criteria="eliteZ" label="Elite Z" align="right" />
                  </th>
                  <th className="px-1.5 py-1 font-semibold text-right bg-emerald-50/50 dark:bg-emerald-900/10">
                    <SortButton criteria="eliteCv" label="Elite CV" align="right" />
                  </th>
                  <th className="px-1.5 py-1 font-semibold text-center bg-emerald-50/50 dark:bg-emerald-900/10">
                    <SortButton criteria="emiGrade" label="EMI 등급" />
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => {
              const isHighlighted =
                normalizedHighlightedCampus.length > 0 &&
                normalizeCampusName(item.campus).includes(normalizedHighlightedCampus);

              return (
              <tr 
                key={item.id} 
                id={`ranking-row-${encodeURIComponent(normalizeCampusName(item.campus))}`}
                className={`border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                  isHighlighted
                    ? 'bg-indigo-50/70 dark:bg-indigo-900/20 [&>td]:!bg-indigo-100/85 dark:[&>td]:!bg-indigo-900/55 [&>td]:!text-indigo-950 dark:[&>td]:!text-indigo-100'
                    : ''
                }`}
              >
                <td className="px-1.5 py-1 text-center text-slate-500 dark:text-slate-400">
                  <div className="flex items-center justify-center gap-1">
                    {isHighlighted && <span className="inline-block h-8 w-1.5 rounded bg-indigo-600 dark:bg-indigo-300 shadow-sm" />}
                    <span>{filterCampusName ? item.id : index + 1}</span>
                  </div>
                </td>
                <td className="px-1.5 py-1 font-medium text-slate-900 dark:text-white">
                  {item.campus.replace('폴리어학원(', '').replace(')', '')}
                </td>
                <td className="px-1.5 py-1 text-center">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.type === '직영' 
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-1.5 py-1 text-center text-slate-600 dark:text-slate-300">{item.region}</td>
                <td className="px-1.5 py-1 text-right text-slate-600 dark:text-slate-300">{item.operationPeriod}</td>
                <td className="px-1.5 py-1 text-right text-slate-600 dark:text-slate-300">{item.classes}</td>
                <td className="px-1.5 py-1 text-right text-slate-600 dark:text-slate-300">{item.students}</td>
                <td className="px-1.5 py-1 text-right text-slate-600 dark:text-slate-300">{item.avgPerClass}</td>
                <td className="px-1.5 py-1 text-right border-r border-slate-200 dark:border-slate-700 text-orange-500 dark:text-orange-400">{(item.scCv || 0).toFixed(2)}</td>
                
                {/* TPI */}
                {!showOnlyPScore && (
                  <>
                    <td className="px-1.5 py-1 text-center bg-indigo-50/30 dark:bg-indigo-900/5">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        item.tpiGrade === 'S' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' :
                        item.tpiGrade === 'A' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                        item.tpiGrade === 'B' ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' :
                        'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                      }`}>
                        {item.tpiGrade}
                      </span>
                    </td>
                    <td className="px-1.5 py-1 text-right border-r border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-indigo-50/30 dark:bg-indigo-900/5">{item.tpiScore}</td>
                  </>
                )}

                {/* P-SCORE */}
                {showOnlyPScore ? (
                  <>
                    <td className="px-1.5 py-1 text-right text-slate-600 dark:text-slate-300 bg-orange-50/30 dark:bg-orange-900/5">{item.balanceCv.toFixed(1)}%</td>
                    <td className="px-1.5 py-1 text-right font-medium text-orange-600 dark:text-orange-400 bg-orange-50/30 dark:bg-orange-900/5">{item.pScore.toFixed(1)}%</td>
                    {displaySubjects.map(sub => (
                      <td key={sub} className="px-1.5 py-1 text-right text-slate-600 dark:text-slate-300 bg-orange-50/30 dark:bg-orange-900/5">{(item as any)[subjectMap[sub].key].toFixed(1)}%</td>
                    ))}
                  </>
                ) : (
                  <>
                    <td className="px-1.5 py-1 text-right font-medium text-orange-600 dark:text-orange-400 bg-orange-50/30 dark:bg-orange-900/5">{item.pScore.toFixed(1)}%</td>
                    <td className={`px-1.5 py-1 text-right text-slate-600 dark:text-slate-300 bg-orange-50/30 dark:bg-orange-900/5 ${!showOnlyPScore ? 'border-r border-slate-200 dark:border-slate-700' : ''}`}>{item.balanceCv.toFixed(1)}%</td>
                  </>
                )}
                
                {/* PC-RAM */}
                {!showOnlyPScore && (
                  <>
                    <td className="px-1.5 py-1 text-right font-medium text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-900/5">{item.zScore.toFixed(2)}</td>
                    <td className="px-1.5 py-1 text-right text-slate-600 dark:text-slate-300 bg-blue-50/30 dark:bg-blue-900/5">{item.confidenceCi.toFixed(3)}</td>
                    <td className="px-1.5 py-1 text-center border-r border-slate-200 dark:border-slate-700 bg-blue-50/30 dark:bg-blue-900/5">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        item.coreGrade === 'S' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                        item.coreGrade === 'A' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                      }`}>
                        {item.coreGrade}
                      </span>
                    </td>
                    
                    {/* PEQM */}
                    <td className="px-1.5 py-1 text-right font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-900/5">{item.eliteZ.toFixed(2)}</td>
                    <td className="px-1.5 py-1 text-right text-slate-600 dark:text-slate-300 bg-emerald-50/30 dark:bg-emerald-900/5">{item.eliteCv.toFixed(1)}%</td>
                    <td className="px-1.5 py-1 text-center bg-emerald-50/30 dark:bg-emerald-900/5">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        item.emiGrade === 'G' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {item.emiGrade}
                      </span>
                    </td>
                  </>
                )}
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
}
