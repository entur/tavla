import React from 'react'
import { Helmet } from 'react-helmet'
import classNames from 'classnames'
import { isDarkOrDefaultTheme } from '../../utils/utils'
import { useSettings } from '../../settings/SettingsProvider'
import { EnturLogo } from '../../assets/icons/EnturLogo'
import { Direction } from '../../types'
import { ThemeContrastWrapper } from '../ThemeContrastWrapper/ThemeContrastWrapper'
import { useReloadTavleOnUpdate } from '../../hooks/useReloadTavleOnUpdate'
import { useHandleFontScaling } from '../../hooks/useHandleFontScaling'
import { useThemeHandler } from '../../hooks/useThemeHandler'
import { DashboardHeader } from '../../components/DashboardHeader/DashboardHeader'
import { BottomMenu } from './BottomMenu/BottomMenu'
import classes from './DashboardWrapper.module.scss'

interface DashboardWrapperProps {
    className: string
    classes?: {
        Header?: string
        Byline?: string
    }
    children: JSX.Element | JSX.Element[]
}

function DashboardWrapper({
    className,
    classes: innerClassNames = {},
    children,
}: DashboardWrapperProps): JSX.Element {
    useThemeHandler()
    useHandleFontScaling()
    useReloadTavleOnUpdate()
    const [settings] = useSettings()

    return (
        <ThemeContrastWrapper
            className={classNames(
                {
                    [classes.Rotated]: settings.direction === Direction.ROTATED,
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
