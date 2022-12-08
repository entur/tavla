import React, { useCallback } from 'react'
import { SubParagraph } from '@entur/typography'
import { Tooltip } from '@entur/tooltip'
import { ValidationInfoIcon } from '@entur/icons'
import { EditTile } from '../EditTile/EditTile'
import { useSettings } from '../../../../settings/SettingsProvider'
import classes from './MobileAppTile.module.scss'

const MobileAppTile: React.FC = () => {
    const [settings, setSettings] = useSettings()

    const handleChange = useCallback(() => {
        setSettings({
            showMobileAppQrTile: !settings.showMobileAppQrTile,
        })
    }, [settings, setSettings])

    return (
        <EditTile
            title={
                <>
                    Entur App QR
                    <Tooltip
                        content={
                            <SubParagraph className={classes.TooltipParagraph}>
                                Tilgjengelig i visningstyper kompakt og
                                kronologisk.
                            </SubParagraph>
                        }
                        placement="top"
                    >
                        <span className={classes.Icon}>
                            <ValidationInfoIcon size={20} />
                        </span>
                    </Tooltip>
                </>
            }
            onChange={handleChange}
            checked={settings.showMobileAppQrTile}
        />
    )
}

export { MobileAppTile }
