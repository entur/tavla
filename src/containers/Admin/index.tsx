import React, { useCallback, useState, useEffect } from 'react'
import { Button } from '@entur/button'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@entur/tab'
import { ClosedLockIcon } from '@entur/icons'

import './styles.scss'
import { getDocumentId } from '../../utils'
import { useFirebaseAuthentication } from '../../auth'

import LogoTab from './LogoTab'
import EditTab from './EditTab'
import ThemeTab from './ThemeTab'
import VisningTab from './DashboardPickerTab'

const AdminPage = ({ history }: Props): JSX.Element => {
    const documentId = getDocumentId()
    const user = useFirebaseAuthentication()

    const [currentIndex, setCurrentIndex] = useState<number>(0)

    const goToDash = useCallback(() => {
        if (documentId) {
            history.push(window.location.pathname.replace('admin', 't'))
        }
        history.push(window.location.pathname.replace('admin', 'dashboard'))
    }, [history, documentId])

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
            <Button
                className="admin__submit-button"
                variant="primary"
                onClick={goToDash}
            >
                Se avgangstavla
            </Button>
        </div>
    )
}

interface Props {
    history: any
}

export default AdminPage
