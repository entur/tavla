import React from 'react'
import { Helmet } from 'react-helmet'
import classNames from 'classnames'
import { isDarkOrDefaultTheme } from 'utils/utils'
import { useSettings } from 'settings/SettingsProvider'
import { EnturLogo } from 'assets/icons/EnturLogo'
import { useReloadTavleOnUpdate } from 'hooks/useReloadTavleOnUpdate'
import { useHandleFontScaling } from 'hooks/useHandleFontScaling'
import { useThemeHandler } from 'hooks/useThemeHandler'
import { useUpdateLastActive } from 'hooks/useUpdateLastActive'
import { ThemeContrastWrapper } from 'components/ThemeContrastWrapper'
import { DashboardHeader } from '../DashboardHeader'
import { BottomMenu } from './components/BottomMenu'
import classes from './DashboardWrapper.module.scss'

function DashboardWrapper({
    className,
    classes: innerClassNames = {},
    children,
}: {
    className: string
    classes?: {
        Header?: string
        Byline?: string
    }
    children: JSX.Element | JSX.Element[]
}) {
    useThemeHandler()
    useHandleFontScaling()
    useReloadTavleOnUpdate()
    useUpdateLastActive()
    const [settings] = useSettings()

    return (
        <ThemeContrastWrapper
            className={classNames(
                {
                    [classes.Rotated]: settings.direction === 'rotated',
                },
                classes.DashboardWrapper,
                className,
            )}
            useContrast={isDarkOrDefaultTheme(settings.theme)}
        >
            <Helmet>
                <title>{settings.boardName} - Tavla - Entur</title>
            </Helmet>
            <DashboardHeader className={classNames(innerClassNames.Header)} />
            {children}
            {settings.logo && (
                <div
                    className={classNames(
                        classes.Byline,
                        innerClassNames.Byline,
                    )}
                >
                    Tjenesten leveres av{' '}
                    <EnturLogo
                        height="24px"
                        style={
                            isDarkOrDefaultTheme(settings.theme)
                                ? 'white'
                                : 'black'
                        }
                    />
                </div>
            )}
            <BottomMenu />
        </ThemeContrastWrapper>
    )
}

export { DashboardWrapper }
