import React, { useCallback } from 'react'
import { useSettings } from 'settings/SettingsProvider'
import { EditTile } from 'components/EditTile'
import { SubParagraph } from '@entur/typography'
import { Tooltip } from '@entur/tooltip'
import { ValidationInfoIcon } from '@entur/icons'
import classes from './MobileAppTile.module.scss'

function MobileAppTile() {
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
