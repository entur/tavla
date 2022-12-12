import React from 'react'
import { Link } from 'react-router-dom'
import { Contrast } from '@entur/layout'
import { useSettings } from '../../settings/SettingsProvider'
import { Clock } from '../Clock/Clock'
import { TavlaLogo } from '../../assets/icons'
import { isMobileWeb } from '../../utils/utils'
import classes from './DashboardHeader.module.scss'

function DashboardHeader(): JSX.Element | null {
    const [settings] = useSettings()

    const showBoardDescription = !isMobileWeb() && settings.logoSize === '32px'

    return (
        <Contrast>
            <div className={classes.DashboardHeader}>
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
