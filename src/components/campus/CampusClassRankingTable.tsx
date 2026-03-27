import React, { useState } from 'react';
import { Download, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { CLASSES_DATA, STUDENTS_DATA, ClassData, StudentData } from '../../data/campusMockData';

interface CampusClassRankingTableProps {
  selectedLevel: string;
  selectedClass: string;
  isStudentView: boolean;
}

export function CampusClassRankingTable({ selectedLevel, selectedClass, isStudentView }: CampusClassRankingTableProps) {
  const [sortCriteria, setSortCriteria] = useState<string>('pScore');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');

  const handleSortClick = (criteria: string) => {
    if (sortCriteria === criteria) {
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortCriteria(criteria);
      setSortDirection('desc');
    }
  };

  const handleDownloadExcel = () => {
    const excelData = sortedData.map((item: any, index) => {
      const baseData = {
        'No.': index + 1,
      };
      
      const specificData = isStudentView ? {
        '학생명': item.name,
        '수강반': item.classId,
        '담임': item.homeroom,
        '교수': item.instructor,
        '수강개월': item.enrollmentMonths,
      } : {
        '학급명': item.name,
        '레벨': item.level,
        '코스': item.course,
        '담임(한)': item.teacherKr,
        '담임(영)': item.teacherEn,
        '학생수': item.studentCount,
      };

      const commonData = {
        'P-SCORE': `${item.pScore.toFixed(1)}%`,
        'AR': `${item.ar.toFixed(1)}%`,
        'Z-Score': item.zScore.toFixed(2),
        'CV': `${item.cv.toFixed(1)}%`,
        '핵심 등급': item.pScore >= 85 ? 'S' : item.pScore >= 75 ? 'A' : 'B',
        'PEQM': item.peqm,
        'PEQM 점수': item.peqmScore,
        'PC-RAM 상태': item.pcramStatus
      };

      return { ...baseData, ...specificData, ...commonData };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    const sheetName = isStudentView ? '학생별_성취도_상세' : '캠퍼스_학급별_랭킹';
    XLSX.utils.book_append_sheet(workbook, worksheet, isStudentView ? '학생별 성취도 상세' : '캠퍼스 학급별 랭킹');

    XLSX.writeFile(workbook, `${sheetName}.xlsx`);
  };

  // Filter data
  const displayData = isStudentView 
    ? STUDENTS_DATA.filter(s => selectedClass === 'all' || s.classId === selectedClass)
    : CLASSES_DATA.filter(c => selectedLevel === 'all' || c.level === selectedLevel);

  // Sort data
  const sortedData = [...displayData].sort((a: any, b: any) => {
    const valA = a[sortCriteria];
    const valB = b[sortCriteria];

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDirection === 'desc' 
        ? valB.localeCompare(valA) 
        : valA.localeCompare(valB);
    }
    
    const numA = valA as number;
    const numB = valB as number;
    return sortDirection === 'desc' ? numB - numA : numA - numB;
  });

  const SortButton = ({ criteria, label, align = 'center' }: { criteria: string, label: string, align?: 'center' | 'right' | 'left' }) => {
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

  return (
    <div id="campus-class-ranking" className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {isStudentView ? '학생별 성취도 상세' : '캠퍼스 학급별 랭킹'}
              <span className="text-sm font-normal text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                {displayData.length}개 {isStudentView ? '학생' : '학급'}
              </span>
            </h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadExcel}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 rounded-lg text-sm font-medium transition-colors border border-emerald-200 dark:border-emerald-800"
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
            {/* Top Header Row */}
            <tr>
              <th colSpan={isStudentView ? 6 : 7} className="px-4 py-3 text-center border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                기본 정보
              </th>
              <th colSpan={2} className="px-4 py-3 text-center border-r border-slate-200 dark:border-slate-700 bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300">
                P-SCORE 영역
              </th>
              <th colSpan={3} className="px-4 py-3 text-center border-r border-slate-200 dark:border-slate-700 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                PC-RAM 영역
              </th>
              <th colSpan={3} className="px-4 py-3 text-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300">
                PEQM 영역
              </th>
            </tr>
            {/* Bottom Header Row */}
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="px-4 py-3 font-semibold text-center w-12 bg-slate-50 dark:bg-slate-800">No.</th>
              {isStudentView ? (
                <>
                  <th className="px-4 py-3 font-semibold bg-slate-50 dark:bg-slate-800"><SortButton criteria="name" label="학생명" align="left" /></th>
                  <th className="px-4 py-3 font-semibold text-center bg-slate-50 dark:bg-slate-800"><SortButton criteria="classId" label="수강반" /></th>
                  <th className="px-4 py-3 font-semibold text-center bg-slate-50 dark:bg-slate-800"><SortButton criteria="homeroom" label="담임" /></th>
                  <th className="px-4 py-3 font-semibold text-center bg-slate-50 dark:bg-slate-800"><SortButton criteria="instructor" label="교수" /></th>
                  <th className="px-4 py-3 font-semibold text-right border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"><SortButton criteria="enrollmentMonths" label="수강개월" align="right" /></th>
                </>
              ) : (
                <>
                  <th className="px-4 py-3 font-semibold bg-slate-50 dark:bg-slate-800"><SortButton criteria="name" label="학급명" align="left" /></th>
                  <th className="px-4 py-3 font-semibold text-center bg-slate-50 dark:bg-slate-800"><SortButton criteria="level" label="레벨" /></th>
                  <th className="px-4 py-3 font-semibold text-center bg-slate-50 dark:bg-slate-800"><SortButton criteria="course" label="코스" /></th>
                  <th className="px-4 py-3 font-semibold text-center bg-slate-50 dark:bg-slate-800"><SortButton criteria="teacherKr" label="담임(한)" /></th>
                  <th className="px-4 py-3 font-semibold text-center bg-slate-50 dark:bg-slate-800"><SortButton criteria="teacherEn" label="담임(영)" /></th>
                  <th className="px-4 py-3 font-semibold text-right border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"><SortButton criteria="studentCount" label="학생수" align="right" /></th>
                </>
              )}
              
              {/* P-SCORE */}
              <th className="px-4 py-3 font-semibold text-right bg-orange-50/50 dark:bg-orange-900/10"><SortButton criteria="pScore" label="P-SCORE" align="right" /></th>
              <th className="px-4 py-3 font-semibold text-right border-r border-slate-200 dark:border-slate-700 bg-orange-50/50 dark:bg-orange-900/10"><SortButton criteria="ar" label="AR" align="right" /></th>
              
              {/* PC-RAM */}
              <th className="px-4 py-3 font-semibold text-right bg-blue-50/50 dark:bg-blue-900/10"><SortButton criteria="zScore" label="Z-Score" align="right" /></th>
              <th className="px-4 py-3 font-semibold text-right bg-blue-50/50 dark:bg-blue-900/10"><SortButton criteria="cv" label="CV" align="right" /></th>
              <th className="px-4 py-3 font-semibold text-center border-r border-slate-200 dark:border-slate-700 bg-blue-50/50 dark:bg-blue-900/10"><SortButton criteria="pScore" label="핵심 등급" /></th>
              
              {/* PEQM */}
              <th className="px-4 py-3 font-semibold text-center bg-emerald-50/50 dark:bg-emerald-900/10"><SortButton criteria="peqm" label="PEQM" /></th>
              <th className="px-4 py-3 font-semibold text-right bg-emerald-50/50 dark:bg-emerald-900/10"><SortButton criteria="peqmScore" label="PEQM 점수" align="right" /></th>
              <th className="px-4 py-3 font-semibold text-center bg-emerald-50/50 dark:bg-emerald-900/10"><SortButton criteria="pcramStatus" label="PC-RAM 상태" /></th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item: any, index) => (
              <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="px-4 py-3 text-center text-slate-500 dark:text-slate-400">{index + 1}</td>
                {isStudentView ? (
                  <>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{(item as StudentData).name}</td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{(item as StudentData).classId}</td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{(item as StudentData).homeroom}</td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{(item as StudentData).instructor}</td>
                    <td className="px-4 py-3 text-right border-r border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">{(item as StudentData).enrollmentMonths}</td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{(item as ClassData).name}</td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{(item as ClassData).level}</td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{(item as ClassData).course}</td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{(item as ClassData).teacherKr}</td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{(item as ClassData).teacherEn}</td>
                    <td className="px-4 py-3 text-right border-r border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">{(item as ClassData).studentCount}</td>
                  </>
                )}
                
                {/* P-SCORE */}
                <td className="px-4 py-3 text-right font-medium text-orange-600 dark:text-orange-400 bg-orange-50/30 dark:bg-orange-900/5">{item.pScore.toFixed(1)}%</td>
                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 bg-orange-50/30 dark:bg-orange-900/5">{item.ar.toFixed(1)}%</td>
                
                {/* PC-RAM */}
                <td className="px-4 py-3 text-right font-medium text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-900/5">{item.zScore.toFixed(2)}</td>
                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300 bg-blue-50/30 dark:bg-blue-900/5">{item.cv.toFixed(1)}%</td>
                <td className="px-4 py-3 text-center border-r border-slate-200 dark:border-slate-700 bg-blue-50/30 dark:bg-blue-900/5">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                    item.pScore >= 85 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                    item.pScore >= 75 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                  }`}>
                    {item.pScore >= 85 ? 'S' : item.pScore >= 75 ? 'A' : 'B'}
                  </span>
                </td>
                
                {/* PEQM */}
                <td className="px-4 py-3 text-center bg-emerald-50/30 dark:bg-emerald-900/5">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    item.peqm === 'G' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {item.peqm}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-900/5">{item.peqmScore}</td>
                <td className="px-4 py-3 text-center bg-emerald-50/30 dark:bg-emerald-900/5">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.pcramStatus === '상향완성' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    item.pcramStatus === '상향불안' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                  }`}>
                    {item.pcramStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
