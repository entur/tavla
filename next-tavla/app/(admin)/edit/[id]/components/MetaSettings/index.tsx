'use client'
import classes from './styles.module.css'
import { Button } from '@entur/button'
import { ChoiceChip, ChoiceChipGroup } from '@entur/chip'
import { TextField } from '@entur/form'
import { Heading4 } from '@entur/typography'
import { DEFAULT_BOARD_NAME } from 'Admin/utils/constants'
import { useState } from 'react'
import { TFontSize, TMeta } from 'types/meta'
import { saveMeta } from './actions'
import { TBoardID } from 'types/settings'

function MetaSettings({ bid, meta }: { bid: TBoardID; meta: TMeta }) {
    const [font, setFont] = useState(meta.fontSize ?? 'medium')
    return (
        <form
            action={(data: FormData) => {
                const name = data.get('name') as string
                const font = data.get('font') as TFontSize
                saveMeta(bid, {
                    ...meta,
                    title: name,
                    fontSize: font,
                    dateModified: Date.now(),
                })
            }}
            className={classes.meta}
        >
            <div className="flexRow justifyBetween alignCenter p-2">
                <div className="w-100">
                    <Heading4 className="m-0">Navn på tavlen</Heading4>
                    <TextField
                        name="name"
                        className="w-30"
                        defaultValue={meta.title ?? DEFAULT_BOARD_NAME}
                        label="Navn på tavlen"
                    />
                </div>
                <div className="flexColumn g-1">
                    <Heading4 className="m-0">Velg tekststørrelse: </Heading4>
                    <ChoiceChipGroup
                        className="flexRow"
                        name="font"
                        value={font}
                        onChange={(e) => setFont(e.target.value as TFontSize)}
                    >
                        <ChoiceChip value="small">Liten</ChoiceChip>
                        <ChoiceChip value="medium">Medium</ChoiceChip>
                        <ChoiceChip value="large">Stor</ChoiceChip>
                    </ChoiceChipGroup>
                </div>
            </div>
            <Button className="m-2" variant="secondary" type="submit">
                Lagre navn og tekststørrelse
            </Button>
        </form>
    )
}

export { MetaSettings }
