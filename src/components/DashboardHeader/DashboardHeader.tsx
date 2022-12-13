import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { Contrast } from '@entur/layout'
import { useSettings } from '../../settings/SettingsProvider'
import { Clock } from '../Clock/Clock'
import { TavlaLogo } from '../../assets/icons'
import { isMobileWeb } from '../../utils/utils'
import classes from './DashboardHeader.module.scss'

interface Props {
    className?: string
}

const DashboardHeader: React.FC<Props> = ({ className }) => {
    const [settings] = useSettings()

    const showBoardDescription = !isMobileWeb() && settings.logoSize === '32px'

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
