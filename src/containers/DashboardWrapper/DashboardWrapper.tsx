import React from 'react'
import classNames from 'classnames'
import { Contrast } from '@entur/layout'
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
import './DashboardWrapper.scss'

interface DashboardWrapperProps {
    className: string
    children: JSX.Element | JSX.Element[]
}

function DashboardWrapper({
    className,
    children,
}: DashboardWrapperProps): JSX.Element {
    useThemeHandler()
    useHandleFontScaling()
    useReloadTavleOnUpdate()
    const [settings] = useSettings()

    return (
        <ThemeContrastWrapper
            className={classNames({
                rotated: settings.direction === Direction.ROTATED,
            })}
            useContrast={isDarkOrDefaultTheme(settings.theme)}
        >
            <DashboardHeader />
            <div className={classNames('dashboard-wrapper', className)}>
                {children}
                {settings.logo && (
                    <div className="dashboard-wrapper__byline">
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
                <Contrast>
                    <BottomMenu className="dashboard-wrapper__bottom-menu" />
                </Contrast>
            </div>
        </ThemeContrastWrapper>
    )
}

export { DashboardWrapper }
