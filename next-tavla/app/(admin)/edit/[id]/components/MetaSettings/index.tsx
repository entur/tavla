'use client'
import classes from './styles.module.css'
import { Button } from '@entur/button'
import { TextField } from '@entur/form'
import { Heading4 } from '@entur/typography'
import { DEFAULT_BOARD_NAME } from 'Admin/utils/constants'
import { TMeta } from 'types/meta'
import { saveFont, saveTitle } from './actions'
import { TBoardID } from 'types/settings'
import { FontChoiceChip } from './FontChoiceChip'
import { Adress } from './Adress'
import { HiddenInput } from 'components/Form/HiddenInput'

function MetaSettings({ bid, meta }: { bid: TBoardID; meta: TMeta }) {
    return (
        <div className={classes.meta}>
            <form action={saveTitle} className="box">
                <Heading4 className="m-0">Navn på tavlen</Heading4>
                <TextField
                    name="name"
                    className="w-100"
                    defaultValue={meta.title ?? DEFAULT_BOARD_NAME}
                    label="Navn på tavlen"
                />
                <Button variant="secondary" type="submit" className="mt-2">
                    Lagre tittel
                </Button>
                <HiddenInput id="bid" value={bid} />
            </form>
            <div className="box">
                <Heading4 className="m-0">Hvor skal tavla stå?</Heading4>
                <Adress bid={bid} location={meta.location} />
            </div>
            <form action={saveFont} className="box">
                <Heading4 className="m-0">Velg tekststørrelse: </Heading4>
                <FontChoiceChip font={meta.fontSize ?? 'medium'} />
                <Button variant="secondary" type="submit" className="mt-2">
                    Lagre tekststørrelse
                </Button>
                <HiddenInput id="bid" value={bid} />
            </form>
        </div>
    )
}

export { MetaSettings }
