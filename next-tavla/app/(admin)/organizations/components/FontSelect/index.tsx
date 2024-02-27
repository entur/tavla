'use client'
import { SecondaryButton } from '@entur/button'
import { ChoiceChip, ChoiceChipGroup } from '@entur/chip'
import { Heading4 } from '@entur/typography'
import { useState } from 'react'
import { TFontSize } from 'types/meta'
import { setFontSize } from './actions'
import { TOrganizationID } from 'types/settings'

function FontSelect({
    oid,
    font,
}: {
    oid?: TOrganizationID
    font?: TFontSize
}) {
    const [fontSize, setFont] = useState<TFontSize>(font ?? 'medium')

    return (
        <form
            className="flexColumn g-1"
            action={async () => {
                if (!oid) return
                await setFontSize(oid, fontSize)
            }}
        >
            <Heading4 className="m-0">Velg tekststørrelse: </Heading4>
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
            <SecondaryButton type="submit" aria-label="Lagre tekststørrelse">
                Lagre
            </SecondaryButton>
        </form>
    )
}

export { FontSelect }
