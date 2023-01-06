import React, { useCallback, useMemo } from 'react'
import { SubParagraph } from '@entur/typography'
import { Tooltip } from '@entur/tooltip'
import { ValidationInfoIcon } from '@entur/icons'
import { EditTile } from '../EditTile/EditTile'
import { useSettings } from '../../../../settings/SettingsProvider'
import { CustomTilePanel } from './CustomTilePanel/CustomTilePanel'
import classes from './CustomTile.module.scss'

const CustomTile: React.FC = () => {
    const [settings, setSettings] = useSettings()

    const isLocked = useMemo(
        () => settings.owners.length > 0,
        [settings.owners],
    )

    const handleChange = useCallback(() => {
        setSettings({
            showCustomTiles: !settings.showCustomTiles,
        })
    }, [setSettings, settings])

    if (!isLocked) {
        return (
            <EditTile
                title={<>Bilde og QR</>}
                onChange={() => ({})}
                checked={false}
            >
                <SubParagraph>
                    Tavla må være låst til din konto før man kan legge til Bilde
                    og QR tiles.
                </SubParagraph>
            </EditTile>
        )
    }

    return (
        <EditTile
            title={
                <>
                    Bilde og QR
                    <Tooltip
                        content={
                            <SubParagraph className={classes.TooltipContent}>
                                Tilgjengelig i visningstyper kompakt og
                                kronologisk, og når tavla er låst.
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
            checked={settings.showCustomTiles}
        >
            <CustomTilePanel />
        </EditTile>
    )
}

export { CustomTile }
