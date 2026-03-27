export const ANALYSIS_GUIDES = {
    pScore: {
      title: "P-SCORE 분석 가이드",
      items: [
        { term: "P-SCORE", description: "캠퍼스 전체 학생 평균 정답률(%)이며, 값이 높을수록 교육과정 이행도가 우수합니다." },
        { term: "Balance CV", description: "과목별 정답률의 변동계수(std/mean×100)로, 낮을수록 과목 간 성취 균형이 안정적입니다." },
        { term: "기준표 5종", description: "전체/직영/분원, 지역권역, 학생수, 학급수, 운영기간 기준으로 동일 지표(캠수·학급수·학생수·급당·P-SCORE·Balance CV)를 비교합니다." },
        { term: "우측 차트 해석", description: "각 기준표 우측의 `P-SCORE / Balance CV` 듀얼축 차트로 구간별 성과와 균형도를 동시에 확인합니다." },
        { term: "순위구간별 직영/분원 분포", description: "1~10위, 11~20위 ... 구간에서 직영/분원 비중을 확인해 상위권 집중 구조를 파악합니다." },
        { term: "과목별 전국 평균 정답률", description: "현재 선택 과목 기준 전국 평균으로 과목 강약점을 비교합니다." },
        { term: "Academic Excellence Award", description: "전국 상위 5% 이내(3개) 캠퍼스를 선정하며, 기본 기준은 응시 10명 이상입니다." },
        { term: "LLM 분석결과", description: "조회 직후 기본은 `미실행`이며, 아코디언을 열 때 현재 조건 데이터로 인사이트를 생성합니다." },
        { term: "분석 필터 반영", description: "NF Studies 제외, Cultural Conn. 제외, 응시 10명 미만 포함 상태가 결과 전체(요약/표/차트/LLM)에 동일 반영됩니다." }
      ]
    },
    pcRam: {
      title: "PC-RAM 분석 가이드",
      items: [
        { term: "Z-Score", description: "캠퍼스 전체 학생의 평균 성취 수준을 전국 기준으로 표준화한 점수입니다. (직영+분원 기준)" },
        { term: "CI (Caution Index)", description: "S-P분석 기반 학습 응답 패턴의 일관성을 측정하며, 0에 가까울수록 안정적입니다." },
        { term: "CI 등급", description: "CI Median과 Risk Ratio를 결합하여 A+(안정), B(보통), C(불안정)로 판정합니다." },
        { term: "최종 등급 (S/A/B/C)", description: "Z-Score와 CI등급을 결합하여 상향완성형(S), 상향불안형(A), 하향평준형(B), 관리부재형(C)으로 분류합니다." },
        { term: "CI Risk Ratio", description: "CI가 위험 수준(>0.5)인 학생의 비율로, 30% 이상 시 C등급으로 트리거됩니다." },
        { term: "KPI 카드", description: "S/A/B/C 등급별 캠퍼스 수와 소규모 캠퍼스(≤5명) 경고 현황을 표시합니다." },
        { term: "Performance Matrix", description: "Z-Score와 CI를 축으로 4분면 진단을 시각화하여 캠퍼스 위치를 파악합니다." },
        { term: "LLM 분석결과", description: "조회 조건 데이터로 인사이트를 생성하며, C등급 즉시개선 등 실행 우선순위를 제시합니다." },
        { term: "분석 필터 반영", description: "과목 선택 및 제외 옵션이 전체 결과(요약/표/차트/LLM)에 실시간 반영됩니다." }
      ]
    },
    peqm: {
      title: "PEQM 분석 가이드",
      items: [
        { term: "NE Band (6단계)", description: "ED(≥90), NE1(80-89), NE2(70-79), NE3(60-69), NE4(50-59), NE5(<50)로 성취 구간을 분류합니다." },
        { term: "ED+NE1% (엘리트 비율)", description: "캠퍼스 내 80점 이상 학생의 비율로, 높을수록 상위권 교육 성과가 우수합니다." },
        { term: "NE4+NE5% (이탈 위험)", description: "60점 미만 학생 비율로, 10% 초과 시 Retention Alert가 활성화됩니다." },
        { term: "Elite Z-Score", description: "캠퍼스 성취 수준을 전국 기준으로 2단계 표준화한 지수입니다. (양수: 평균 초과)" },
        { term: "Elite CV [ED+NE1]", description: "상위권 학생들의 점수 균일도로, 5% 이하일 때 매우 안정적인 품질로 판정합니다." },
        { term: "EMI Grade (4등급)", description: "Z-Score와 Elite CV를 결합하여 P(Perfect), U(Unbalanced), G(Growth), L(Lack)로 분류합니다." },
        { term: "Performance Matrix", description: "Z-Score(성과)와 Elite CV(균일도)를 축으로 캠퍼스의 운영 품질 위치를 진단합니다." },
        { term: "NE Waterfall", description: "ED부터 NE5까지 구간별 학생수 분포를 시각화하여 운영 형태를 직관적으로 파악합니다." },
        { term: "LLM 분석결과", description: "조회 조건 데이터로 인사이트를 생성하며, P/G/U/L 등급별 맞춤 운영 전략을 제시합니다." }
      ]
    }
  };
  