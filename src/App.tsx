import { useCallback, useState } from 'react'
import type { MouseEvent } from 'react'
import { Layout } from '@/components/Layout'
import { ExcelDataProvider } from '@/context/ExcelDataContext'
import type { UserGroup } from '@/types'
import { TAB_LABELS } from '@/tabLabels'
import { renderTabContent } from '@/tabContent'
import './App.css'

export default function App() {
  const userGroup: UserGroup = 'GROUP_HQ'
  const [activeTab, setActiveTabState] = useState('dashboard')
  const [openTabs, setOpenTabs] = useState<string[]>(['dashboard'])

  const setActiveTab = useCallback((tabId: string) => {
    setActiveTabState(tabId)
    setOpenTabs((prev) => (prev.includes(tabId) ? prev : [...prev, tabId]))
  }, [])

  const closeTab = useCallback(
    (e: MouseEvent, tabId: string) => {
      e.stopPropagation()
      setOpenTabs((prev) => {
        const next = prev.filter((t) => t !== tabId)
        if (next.length === 0) {
          setActiveTabState('dashboard')
          return ['dashboard']
        }
        if (activeTab === tabId) {
          setActiveTabState(next[next.length - 1]!)
        }
        return next
      })
    },
    [activeTab],
  )

  return (
    <ExcelDataProvider>
      <Layout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openTabs={openTabs}
        closeTab={closeTab}
        tabLabels={TAB_LABELS}
      >
        {renderTabContent(activeTab, userGroup)}
      </Layout>
    </ExcelDataProvider>
  )
}
