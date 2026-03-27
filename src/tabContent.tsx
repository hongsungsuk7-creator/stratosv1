import type { ReactNode } from 'react'
import type { UserGroup } from '@/types'
import { Dashboard } from '@/pages/Dashboard'
import { PScore } from '@/pages/PScore'
import { PcRam } from '@/pages/PcRam'
import { Peqm } from '@/pages/Peqm'
import { Eqs } from '@/pages/Eqs'
import { CampusDashboard } from '@/pages/CampusDashboard'
import { CampusPScore } from '@/pages/CampusPScore'
import { CampusPcRam } from '@/pages/CampusPcRam'
import { CampusPeqm } from '@/pages/CampusPeqm'
import { ResearchDashboard } from '@/pages/ResearchDashboard'
import { TestAnalytics } from '@/pages/TestAnalytics'
import { ItemAnalytics } from '@/pages/ItemAnalytics'
import { IrtModel } from '@/pages/IrtModel'
import { ItemCalibration } from '@/pages/ItemCalibration'
import { AnchorItem } from '@/pages/AnchorItem'
import { ScaleLinking } from '@/pages/ScaleLinking'
import { DifficultyStandardization } from '@/pages/DifficultyStandardization'
import { ItemRepository } from '@/pages/ItemRepository'
import { ItemPerformance } from '@/pages/ItemPerformance'
import { ItemUsage } from '@/pages/ItemUsage'
import { TestAssembly } from '@/pages/TestAssembly'
import { Placeholder } from '@/pages/Placeholder'

/** 사이드바 `id` → 화면 컴포넌트 */
export function renderTabContent(tabId: string, userGroup: UserGroup): ReactNode {
  switch (tabId) {
    case 'dashboard':
      return <Dashboard userGroup={userGroup} />
    case 'pscore':
      return <PScore userGroup={userGroup} />
    case 'pcram':
      return <PcRam userGroup={userGroup} />
    case 'peqm':
      return <Peqm userGroup={userGroup} />
    case 'eqs':
      return <Eqs userGroup={userGroup} />

    case 'campus-dashboard':
      return <CampusDashboard userGroup={userGroup} />
    case 'campus-pscore':
      return <CampusPScore userGroup={userGroup} />
    case 'campus-pcram':
      return <CampusPcRam userGroup={userGroup} />
    case 'campus-peqm':
      return <CampusPeqm userGroup={userGroup} />
    case 'class-analysis':
      return <Placeholder title="Class Analysis" />
    case 'student-analysis':
      return <Placeholder title="Student Analysis" />
    case 'teaching-insight':
      return <Placeholder title="Teaching Insight" />

    case 'rs-dashboard':
      return <ResearchDashboard userGroup={userGroup} />
    case 'rs-pscore':
      return <PScore userGroup={userGroup} />
    case 'rs-pcram':
      return <PcRam userGroup={userGroup} />
    case 'rs-peqm':
      return <Peqm userGroup={userGroup} />
    case 'test-analytics':
      return <TestAnalytics userGroup={userGroup} />
    case 'item-analytics':
      return <ItemAnalytics userGroup={userGroup} />
    case 'irt-model':
      return <IrtModel userGroup={userGroup} />

    case 'item-calibration':
      return <ItemCalibration userGroup={userGroup} />
    case 'anchor-item':
      return <AnchorItem userGroup={userGroup} />
    case 'scale-linking':
      return <ScaleLinking userGroup={userGroup} />
    case 'difficulty-standardization':
      return <DifficultyStandardization userGroup={userGroup} />

    case 'item-repository':
      return <ItemRepository userGroup={userGroup} />
    case 'item-performance':
      return <ItemPerformance userGroup={userGroup} />
    case 'item-usage':
      return <ItemUsage userGroup={userGroup} />
    case 'test-composition':
      return <TestAssembly userGroup={userGroup} />

    default:
      return <Placeholder title={tabId} />
  }
}
