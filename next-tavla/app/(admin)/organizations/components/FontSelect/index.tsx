'use client'
import { Button } from '@entur/button'
import { ChoiceChip, ChoiceChipGroup } from '@entur/chip'
import { Heading3, Paragraph } from '@entur/typography'
import { useState } from 'react'
import { TFontSize } from 'types/meta'
import { setFontSize } from './actions'
import { TOrganizationID } from 'types/settings'
import classes from './styles.module.css'

function FontSelect({
    oid,
    font,
}: {
    oid?: TOrganizationID
    font?: TFontSize
}) {
    const [fontSize, setFont] = useState<TFontSize>(font ?? 'medium')

    return (
        <div>
            <Heading3>Velg størrelse på tavla</Heading3>
            <div className={classes.container}>
                <Paragraph>
                    Tavlevisningen kan vises i ulike størrelser. Her kan du
                    velge hva som skal være standard til tavlevisningen når du
                    setter opp en ny tavle.
                </Paragraph>
                <form
                    className="flexColumn"
                    action={async () => {
                        if (!oid) return
                        await setFontSize(oid, fontSize)
                    }}
                >
                    <ChoiceChipGroup
                        className="flexRow"
                        name="font"
                        value={fontSize}
                        onChange={(e) => setFont(e.target.value as TFontSize)}
                    >
                        <ChoiceChip value="small">Liten</ChoiceChip>
                        <ChoiceChip value="medium">Medium</ChoiceChip>
                        <ChoiceChip value="large">Stor</ChoiceChip>
                    </ChoiceChipGroup>
                    <div className="flexRow justifyEnd mt-2 mr-2 ">
                        <Button variant="secondary" type="submit">
                            Lagre tekststørrelse
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export { FontSelect }
