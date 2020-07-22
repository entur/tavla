import React, { useState } from 'react'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@entur/tab'
import { ClosedLockIcon } from '@entur/icons'

import './styles.scss'
import { useFirebaseAuthentication } from '../../auth'

import LogoTab from './LogoTab'
import EditTab from './EditTab'
import ThemeTab from './ThemeTab'
import VisningTab from './DashboardPickerTab'
import FloatingButtons from './FloatingButtons'

const AdminPage = (): JSX.Element => {
    const user = useFirebaseAuthentication()

    const [currentIndex, setCurrentIndex] = useState<number>(0)

    const lockIcon = !(user && !user.isAnonymous) && <ClosedLockIcon />

    return (
        <div className="admin">
            <Tabs
                index={currentIndex}
                onChange={setCurrentIndex}
                className="admin__tabs"
            >
                <TabList className="admin__tabs">
                    <Tab className="admin__tabs">Rediger innhold</Tab>
                    <Tab>Velg visning</Tab>
                    <Tab>Velg farger</Tab>
                    <Tab>Last opp logo {lockIcon}</Tab>
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
                </TabPanels>
            </Tabs>
            <FloatingButtons />
        </div>
    )
}

export default AdminPage
