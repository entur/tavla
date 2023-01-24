import React, { useCallback } from 'react'
import { Heading2, Paragraph } from '@entur/typography'
import { Button } from '@entur/button'
import { useToast } from '@entur/alert'
import { useSettings } from '../../../../settings/SettingsProvider'
import classes from './ReloadTile.module.scss'

const ReloadTile: React.FC = () => {
    const [, setSettings] = useSettings()
    const { addToast } = useToast()

    const handleClick = useCallback(() => {
        setSettings({
            pageRefreshedAt: new Date().getTime(),
        })
        addToast({
            content: 'Alle tavlene er lastet inn på nytt',
            variant: 'success',
        })
    }, [addToast, setSettings])

    return (
        <div className={classes.ReloadTile}>
            <div className={classes.Header}>
                <Heading2 className={classes.Heading}>
                    Last inn tavler på nytt
                </Heading2>
            </div>
            <div>
                <Paragraph>
                    Når du trykker på knappen vil alle skjermer som viser denne
                    tavlen bli lastet inn på nytt.
                </Paragraph>
                <Button onClick={handleClick} variant="primary">
                    Last inn tavler på nytt
                </Button>
            </div>
        </div>
    )
}

export { ReloadTile }
