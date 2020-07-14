import React, { useCallback, useState, useEffect } from 'react'
import { Button } from '@entur/button'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@entur/tab'
import { ClosedLockIcon } from '@entur/icons'

import { getDocumentId } from '../../utils'
import { useFirebaseAuthentication } from '../../auth'

import './styles.scss'
import AdminHeader from './AdminHeader'
import LogoTab from './LogoTab'
import EditTab from './EditTab'
import ThemeTab from './ThemeTab'
import ThemeContrastWrapper from '../ThemeWrapper/ThemeContrastWrapper'
import VisningTab from './DashboardPickerTab'
import { useSettingsContext } from '../../settings'

const AdminPage = ({ history }: Props): JSX.Element => {
    const [useContrastWrapper, setUseContrastWrapper] = useState<boolean>(true)
    const [settings] = useSettingsContext()

    useEffect(() => {
        if (settings) {
            if (settings.theme === 'default') {
                setUseContrastWrapper(true)
            } else {
                setUseContrastWrapper(false)
            }
        }
    }, [settings])

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
        <ThemeContrastWrapper useContrast={useContrastWrapper}>
            <div className="admin">
                <AdminHeader goBackToDashboard={goToDash} />
                <Tabs
                    index={currentIndex}
                    onChange={(newIndex) => setCurrentIndex(newIndex)}
                    className="admin__tabs"
                >
                    <TabList className="admin__tabs">
                        <Tab className="admin__tabs">Rediger innhold</Tab>
                        <Tab>Velg farger</Tab>
                        <Tab>Velg visning</Tab>
                        <Tab>Last opp logo {lockIcon}</Tab>
                    </TabList>
                    <TabPanels>
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
        </ThemeContrastWrapper>
    )
}

interface Props {
    history: any
}

export default AdminPage
