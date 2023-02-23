import React, { useCallback } from 'react'
import { useSettings } from 'settings/SettingsProvider'
import { Direction, FontChangeAction, Theme } from 'src/types'
import { RadioCard } from 'components/RadioCard/RadioCard'
import Grey from 'assets/previews/Grey-theme.svg'
import Dark from 'assets/previews/Dark-theme.svg'
import Light from 'assets/previews/Light-theme.svg'
import Entur from 'assets/previews/Entur-theme.svg'
import { DirectionPreview } from 'assets/icons/DirectionPreview'
import { AddIcon, SubtractIcon } from '@entur/icons'
import { FloatingButton } from '@entur/button'
import { Heading2, Heading3, Paragraph } from '@entur/typography'
import { FontSizePreview } from './FontSizePreview/FontSizePreview'
import classes from './ThemeTab.module.scss'

const SCALE_STEP = 0.1

const ThemeTab = (): JSX.Element => {
    const [settings, setSettings] = useSettings()
    const directionPreviewImages = DirectionPreview(settings.theme)

    const handleSwitchTheme = useCallback(
        (value: Theme): void => {
            setSettings({
                theme: value,
            })
        },
        [setSettings],
    )

    const handleSwitchDirection = useCallback(
        (value: Direction): void => {
            setSettings({
                direction: value,
            })
        },
        [setSettings],
    )

    const handleChangeFontSize = useCallback(
        (action: FontChangeAction) => {
            let newFontScale = settings.fontScale

            switch (action) {
                case FontChangeAction.increase:
                    newFontScale += SCALE_STEP
                    break

                case FontChangeAction.decrease:
                    newFontScale = newFontScale - SCALE_STEP || SCALE_STEP
                    break
            }

            setSettings({
                fontScale: newFontScale,
            })
        },
        [settings, setSettings],
    )

    return (
        <div className={classes.ThemeTab}>
            <Heading2 className={classes.Heading}>Tilpass utseende</Heading2>
            <Paragraph className={classes.Paragraph}>
                Her kan du endre utseendet på tavlen din. Vær oppmerksom på at
                tekststørrelse og rotasjon kun vil vises på selve tavla, og ikke
                på siden hvor du endrer på instillingene. Fargene vil
                reflekteres både på tavla og i instillingene.
            </Paragraph>
            <Heading3 className={classes.Heading}>Velg farger</Heading3>
            <div className={classes.Grid}>
                <RadioCard
                    title="Entur (standard)"
                    value='default'
                    preview={Entur}
                    selected={settings.theme === 'default'}
                    onChange={handleSwitchTheme}
                    className={classes.ThemeCard}
                    altText=""
                />
                <RadioCard
                    title="Mørkt"
                    value={'dark'}
                    preview={Dark}
                    selected={settings.theme === 'dark'}
                    onChange={handleSwitchTheme}
                    className={classes.ThemeCard}
                    altText=""
                />
                <RadioCard
                    title="Lyst"
                    value={'light'}
                    preview={Light}
                    selected={settings.theme === 'light'}
                    onChange={handleSwitchTheme}
                    className={classes.ThemeCard}
                    altText=""
                />
                <RadioCard
                    title="Grått"
                    value={'grey'}
                    preview={Grey}
                    selected={settings.theme === 'grey'}
                    onChange={handleSwitchTheme}
                    className={classes.ThemeCard}
                    altText=""
                />
            </div>
            <div>
                <Heading3 className={classes.Heading}>Velg rotasjon</Heading3>
                <Paragraph className={classes.Paragraph}>
                    Her kan du velge hvilken retning innholdet på tavla skal
                    vises.
                </Paragraph>
                <div className={classes.Grid}>
                    <RadioCard
                        title="Standard"
                        value={'standard'}
                        preview={directionPreviewImages.Standard}
                        selected={settings.direction === 'standard'}
                        onChange={handleSwitchDirection}
                        className={classes.ThemeCard}
                    />
                    <RadioCard
                        title="Rotert"
                        value={'rotated'}
                        preview={directionPreviewImages.Rotated}
                        selected={settings.direction === 'rotated'}
                        onChange={handleSwitchDirection}
                        className={classes.ThemeCard}
                    />
                </div>
            </div>
            <div>
                <Heading3 className={classes.Heading}>
                    Velg tekststørrelse
                </Heading3>
                <Paragraph className={classes.Paragraph}>
                    Her kan du velge hvor stor teksten på tavla skal være.
                    Teksten vil kun gjelde for den samme nettleseren du endrer
                    innstillingen på.
                </Paragraph>
                <div className={classes.FontSizeButtons}>
                    <FloatingButton
                        onClick={() =>
                            handleChangeFontSize(FontChangeAction.decrease)
                        }
                        className={classes.FontSizeButton}
                        aria-label="Mindre"
                    >
                        Mindre
                        <SubtractIcon />
                    </FloatingButton>
                    <span className={classes.FontSizePercentage}>
                        {Math.round(settings.fontScale * 100)}%
                    </span>
                    <FloatingButton
                        onClick={() =>
                            handleChangeFontSize(FontChangeAction.increase)
                        }
                        className={classes.FontSizeButton}
                        aria-label="Større"
                    >
                        Større
                        <AddIcon />
                    </FloatingButton>
                </div>
                <FontSizePreview fontScale={settings.fontScale} />
            </div>
        </div>
    )
}

export { ThemeTab }
