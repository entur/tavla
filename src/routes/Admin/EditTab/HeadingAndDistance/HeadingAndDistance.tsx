import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { useSettings } from 'settings/SettingsProvider'
import { getFromLocalStorage, saveToLocalStorage } from 'settings/LocalStorage'
import { useDebounce } from 'hooks/useDebounce'
import { Heading2, Heading4, SubParagraph } from '@entur/typography'
import { Tooltip } from '@entur/tooltip'
import { TextField } from '@entur/form'
import classes from './HeadingAndDistance.module.scss'

const HeadingAndDistance: React.FC = () => {
    const [settings, setSettings] = useSettings()

    const [distance, setDistance] = useState<number>(settings.distance)

    const debouncedDistance = useDebounce(distance, 800)

    useEffect(() => {
        if (settings.distance !== debouncedDistance) {
            setSettings({
                distance: debouncedDistance,
            })
        }
    }, [debouncedDistance, setSettings, settings])

    const validateInput = useCallback((e: SyntheticEvent<HTMLInputElement>) => {
        const newDistance = Number(e.currentTarget.value)
        if (1 <= newDistance && 1000 >= newDistance) {
            setDistance(newDistance)
        } else if (newDistance < 1) {
            setDistance(1)
        } else {
            setDistance(1000)
        }
    }, [])

    const [showTooltip, setShowTooltip] = useState<boolean>(false)

    useEffect(() => {
        if (!getFromLocalStorage('hasShownTooltip')) {
            setShowTooltip(true)
            saveToLocalStorage('hasShownTooltip', true)
        }
    }, [])

    return (
        <Heading2 className={classes.Heading}>
            Viser kollektivtilbud innenfor
            <div className={classes.InputWrapper}>
                <Tooltip
                    content={
                        <div className={classes.TooltipContainer}>
                            <Heading4 className={classes.TooltipText}>
                                Endre på avstanden?
                            </Heading4>
                            <SubParagraph className={classes.TooltipText}>
                                Klikk på tallet for å skrive en ny verdi.
                            </SubParagraph>
                        </div>
                    }
                    placement="bottom"
                    isOpen={showTooltip}
                    showCloseButton={true}
                    disableHoverListener={true}
                    disableFocusListener={true}
                >
                    <TextField
                        label=""
                        className={classes.TextField}
                        size="medium"
                        defaultValue={distance}
                        onChange={validateInput}
                        append="m"
                        type="number"
                        max={1000}
                        min={1}
                        maxLength={4}
                        minLength={1}
                    />
                </Tooltip>
            </div>
            rundt {settings.boardName.split(',')[0]}
        </Heading2>
    )
}

export { HeadingAndDistance }
