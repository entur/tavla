import React, { ChangeEvent, useCallback } from 'react'
import { useSettings } from 'settings/SettingsProvider'
import { RadioGroup, Radio } from '@entur/form'
import classes from './SizePicker.module.scss'

const SizePicker = (): JSX.Element => {
    const [settings, setSettings] = useSettings()

    const handleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>): void => {
            setSettings({
                logoSize: event.target.value,
            })
        },
        [setSettings],
    )

    return (
        <RadioGroup
            name="logo-size"
            label="Størrelse på logo"
            onChange={handleChange}
            value={settings.logoSize}
            className={classes.SizePicker}
        >
            <Radio className={classes.Radio} value="32px">
                32px
            </Radio>
            <Radio className={classes.Radio} value="56px">
                56px
            </Radio>
        </RadioGroup>
    )
}

export { SizePicker }
