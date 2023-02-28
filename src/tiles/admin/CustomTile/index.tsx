import React, { useCallback, useMemo } from 'react'
import { useSettings } from 'settings/SettingsProvider'
import { AdminTile } from 'components/AdminTile'
import { SubParagraph } from '@entur/typography'
import { Tooltip } from '@entur/tooltip'
import { ValidationInfoIcon } from '@entur/icons'
import classes from './CustomTile.module.scss'
import { CustomTilePanel } from './components/CustomTilePanel'

function CustomTile() {
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
            <AdminTile
                title={<>Bilde og QR</>}
                onChange={() => ({})}
                checked={false}
            >
                <SubParagraph>
                    Tavla må være låst til din konto før man kan legge til Bilde
                    og QR tiles.
                </SubParagraph>
            </AdminTile>
        )
    }

    return (
        <AdminTile
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
        </AdminTile>
    )
}

export { CustomTile }
