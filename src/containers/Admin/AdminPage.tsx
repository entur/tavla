import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@entur/tab'
import { ClosedLockIcon } from '@entur/icons'
import { LockedTavle } from '../Error/ErrorPages'
import { useUser } from '../../UserProvider'
import { useSettings } from '../../settings/SettingsProvider'
import { ThemeContrastWrapper } from '../ThemeContrastWrapper/ThemeContrastWrapper'
import { isDarkOrDefaultTheme } from '../../utils/utils'
import { useThemeHandler } from '../../hooks/useThemeHandler'
import { Loader } from '../../components/Loader/Loader'
import { Navbar } from '../Navbar/Navbar'
import { LogoTab } from './LogoTab/LogoTab'
import { EditTab } from './EditTab/EditTab'
import { ThemeTab } from './ThemeTab/ThemeTab'
import { DashboardPickerTab } from './DashboardPickerTab/DashboardPickerTab'
import { NameTab } from './NameTab/NameTab'
import { LockAndViewButtons } from './LockAndViewButtons/LockAndViewButtons'
import { ShareTab } from './ShareTab/ShareTab'
import './AdminPage.scss'

const AdminPage = (): JSX.Element => {
    const [settings] = useSettings()
    const user = useUser()
    useThemeHandler()

    const [currentIndex, setCurrentIndex] = useState<number>(0)

    const [lockShareTab, setLockShareTab] = useState<boolean>(
        !user || user.isAnonymous || !settings.owners.includes(user.uid),
    )

    const lockIcon = (!user || user.isAnonymous) && <ClosedLockIcon inline />
    const lockIconShareTab = lockShareTab && <ClosedLockIcon inline />

    useEffect(() => {
        setLockShareTab(
            !user || user.isAnonymous || !settings.owners.includes(user.uid),
        )
    }, [user, settings.owners])

    if (!settings) {
        return <Loader />
    }

    const permitted =
        !settings.owners ||
        settings.owners.length === 0 ||
        settings.owners.includes(user?.uid ?? '')

    if (!permitted) {
        return <LockedTavle />
    }

    return (
        <ThemeContrastWrapper
            useContrast={isDarkOrDefaultTheme(settings.theme)}
        >
            <Helmet>
                <title>Adminside - Tavla - Entur</title>
            </Helmet>
            <Navbar theme={settings.theme} />
            <div className="admin">
                <Tabs
                    index={currentIndex}
                    onChange={setCurrentIndex}
                    className="admin__tabs"
                >
                    <h1 aria-label="Rediger tavle"></h1>
                    <TabList className="admin__tabs__header">
                        <Tab>Rediger innhold</Tab>
                        <Tab>Velg visning</Tab>
                        <Tab>Tilpass utseende</Tab>
                        <Tab>Last opp logo {lockIcon}</Tab>
                        <Tab>Endre lenke {lockIcon}</Tab>
                        <Tab>Deling {lockIconShareTab}</Tab>
                    </TabList>
                    <TabPanels className="admin__tabs__tab-panels">
                        <TabPanel>
                            <EditTab />
                        </TabPanel>
                        <TabPanel>
                            <DashboardPickerTab />
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
                                locked={lockShareTab}
                            />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                <LockAndViewButtons />
            </div>
        </ThemeContrastWrapper>
    )
}

export { AdminPage }
