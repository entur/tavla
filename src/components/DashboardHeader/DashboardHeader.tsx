import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { useSettings } from 'settings/SettingsProvider'
import { TavlaLogo } from 'assets/icons/TavlaLogo'
import { Contrast } from '@entur/layout'
import { Clock } from '../Clock/Clock'
import classes from './DashboardHeader.module.scss'

function DashboardHeader({ className }: { className?: string }) {
    const [settings] = useSettings()

    const showBoardDescription = settings.logoSize === '32px'

    return (
        <Contrast>
            <div className={classNames(classes.DashboardHeader, className)}>
                <div>
                    <Link to="/">
                        {settings.logo ? (
                            <img
                                src={settings.logo}
                                height={settings.logoSize}
                            />
                        ) : (
                            <TavlaLogo
                                className={classes.Logo}
                                theme={settings.theme}
                            />
                        )}
                    </Link>
                    {showBoardDescription && (
                        <span className={classes.LogoDescription}>
                            {settings.description
                                ? settings.description
                                : 'Finn din rute på entur.no eller i Entur-appen'}
                        </span>
                    )}
                </div>
                <Clock />
            </div>
        </Contrast>
    )
}

export { DashboardHeader }
