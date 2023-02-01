import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useSearchParams } from 'react-router-dom'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@entur/tab'
import { ClosedLockIcon } from '@entur/icons'
import { Contrast } from '@entur/layout'
import { LockedTavle } from '../Error/ErrorPages'
import { useUser } from '../../UserProvider'
import { useSettings } from '../../settings/SettingsProvider'
import { ThemeContrastWrapper } from '../ThemeContrastWrapper/ThemeContrastWrapper'
import { isDarkOrDefaultTheme } from '../../utils/utils'
import { useThemeHandler } from '../../hooks/useThemeHandler'
import { Loader } from '../../components/Loader/Loader'
import { Navbar } from '../Navbar/Navbar'
import { Footer } from '../../components/Footer/Footer'
import { LogoTab } from './LogoTab/LogoTab'
import { EditTab } from './EditTab/EditTab'
import { ThemeTab } from './ThemeTab/ThemeTab'
import { DashboardPickerTab } from './DashboardPickerTab/DashboardPickerTab'
import { NameTab } from './NameTab/NameTab'
import { LockAndViewButtons } from './LockAndViewButtons/LockAndViewButtons'
import { ShareTab } from './ShareTab/ShareTab'
import classes from './AdminPage.module.scss'

const AdminPage = (): JSX.Element => {
    const [settings] = useSettings()
    const user = useUser()
    useThemeHandler()

    const [searchParams, setSearchParams] = useSearchParams()
    const currentIndex = useMemo(
        () => Number(searchParams.get('tab')) || 0,
        [searchParams],
    )

    const switchTab = useCallback(
        (value: number) => {
            setSearchParams({ tab: value.toString() }, { replace: true })
        },
        [setSearchParams],
    )

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
            <div className={classes.Admin}>
                <h1 aria-label="Rediger tavle"></h1>
                <Tabs index={currentIndex} onChange={switchTab}>
                    <TabList className={classes.TabList}>
                        <Tab className={classes.Tab}>Rediger innhold</Tab>
                        <Tab className={classes.Tab}>Velg visning</Tab>
                        <Tab className={classes.Tab}>Tilpass utseende</Tab>
                        <Tab className={classes.Tab}>
                            Last opp logo {lockIcon}
                        </Tab>
                        <Tab className={classes.Tab}>
                            Endre lenke {lockIcon}
                        </Tab>
                        <Tab className={classes.Tab}>
                            Deling {lockIconShareTab}
                        </Tab>
                    </TabList>
                    <TabPanels>
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
                                setTabIndex={switchTab}
                            />
                        </TabPanel>
                        <TabPanel>
                            <NameTab
                                tabIndex={currentIndex}
                                setTabIndex={switchTab}
                            />
                        </TabPanel>
                        <TabPanel>
                            <ShareTab
                                tabIndex={currentIndex}
                                setTabIndex={switchTab}
                                locked={lockShareTab}
                            />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                <LockAndViewButtons />
            </div>
            <Contrast>
                <Footer />
            </Contrast>
        </ThemeContrastWrapper>
    )
}

export { AdminPage }
