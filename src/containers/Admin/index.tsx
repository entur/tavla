import React, { useCallback, useState } from 'react'
import { Button } from '@entur/button'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@entur/tab'

import { getDocumentId } from '../../utils'

import './styles.scss'
import AdminHeader from './AdminHeader'
import LogoTab from './LogoTab'
import EditTab from './EditTab'
import ThemeTab from './ThemeTab'
import ThemeContrastWrapper from '../ThemeWrapper/ThemeContrastWrapper'

const AdminPage = ({ history }: Props): JSX.Element => {
    const documentId = getDocumentId()

    const [currentIndex, setCurrentIndex] = useState<number>(0)

    const goToDash = useCallback(() => {
        if (documentId) {
            history.push(window.location.pathname.replace('admin', 't'))
        }
        history.push(window.location.pathname.replace('admin', 'dashboard'))
    }, [history, documentId])

    return (
        <ThemeContrastWrapper useContrast={false}>
            <div className="admin">
                <AdminHeader goBackToDashboard={goToDash} />
                <Tabs
                    index={currentIndex}
                    onChange={(newIndex) => setCurrentIndex(newIndex)}
                >
                    <TabList>
                        <Tab>Rediger innhold</Tab>
                        <Tab>Velg farger</Tab>
                        <Tab>Last opp logo</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <EditTab />
                        </TabPanel>
                        <TabPanel>
                            <ThemeTab />
                        </TabPanel>
                        <TabPanel>
                            <LogoTab
                                tabIndex={currentIndex}
                                setTabIndex={() => setCurrentIndex(0)}
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
