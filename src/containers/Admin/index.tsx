import React, { useState } from 'react'

import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@entur/tab'
import { ClosedLockIcon } from '@entur/icons'

import { useUser } from '../../auth'

import { useSettingsContext } from '../../settings'

import ThemeContrastWrapper from '../ThemeWrapper/ThemeContrastWrapper'

import { isDarkOrDefaultTheme } from '../../utils'

import LogoTab from './LogoTab'
import EditTab from './EditTab'
import ThemeTab from './ThemeTab'
import VisningTab from './DashboardPickerTab'
import NameTab from './NameTab'
import FloatingButtons from './FloatingButtons'
import './styles.scss'
import ShareTab from './ShareTab'

const AdminPage = (): JSX.Element => {
    const user = useUser()

    const [currentIndex, setCurrentIndex] = useState<number>(5) //TODO: sett til 0

    const lockIcon = !(user && !user.isAnonymous) && <ClosedLockIcon inline />

    const [settings] = useSettingsContext()

    const { theme } = settings || {}

    return (
        <ThemeContrastWrapper useContrast={isDarkOrDefaultTheme(theme)}>
            <div className="admin">
                <Tabs
                    index={currentIndex}
                    onChange={setCurrentIndex}
                    className="admin__tabs"
                >
                    <TabList className="admin__tabs__header">
                        <Tab>Rediger innhold</Tab>
                        <Tab>Velg visning</Tab>
                        <Tab>Velg farger</Tab>
                        <Tab>Last opp logo {lockIcon}</Tab>
                        <Tab>Endre lenke {lockIcon}</Tab>
                        <Tab>Deling {lockIcon}</Tab>
                    </TabList>
                    <TabPanels className="admin__tabs__tab-panels">
                        <TabPanel>
                            <EditTab />
                        </TabPanel>
                        <TabPanel>
                            <VisningTab />
                        </TabPanel>
                        <TabPanel>
                            <ThemeTab />
                        </TabPanel>
                        <TabPanel>
                            <LogoTab
                                tabIndex={currentIndex}
                                setTabIndex={setCurrentIndex}
                            />
                        </TabPanel>
                        <TabPanel>
                            <NameTab
                                tabIndex={currentIndex}
                                setTabIndex={setCurrentIndex}
                            />
                        </TabPanel>
                        <TabPanel>
                            <ShareTab
                                tabIndex={currentIndex}
                                setTabIndex={setCurrentIndex}
                            />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                <FloatingButtons />
            </div>
        </ThemeContrastWrapper>
    )
}

export default AdminPage
