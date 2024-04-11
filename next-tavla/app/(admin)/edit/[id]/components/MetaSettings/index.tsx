'use client'
import classes from './styles.module.css'
import { TextField } from '@entur/form'
import { Heading4 } from '@entur/typography'
import { TFontSize, TMeta } from 'types/meta'
import { saveFont, saveTitle } from './actions'
import { TBoardID } from 'types/settings'
import { FontChoiceChip } from './FontChoiceChip'
import { SubmitButton } from 'components/Form/SubmitButton'
import { Address } from './Adress'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { useToast } from '@entur/alert'

function MetaSettings({ bid, meta }: { bid: TBoardID; meta: TMeta }) {
    const { addToast } = useToast()
    return (
        <div className={classes.meta}>
            <form
                action={async (data: FormData) => {
                    const name = data.get('name') as string
                    await saveTitle(bid, name)
                    addToast('Tittel lagret!')
                }}
                className="box flexColumn justifyBetween"
            >
                <Heading4 className="m-0">Navn på tavlen</Heading4>
                <TextField
                    name="name"
                    className="w-100"
                    defaultValue={meta.title ?? DEFAULT_BOARD_NAME}
                    label="Navn på tavlen"
                    maxLength={30}
                />
                <div className="flexRow w-100 mt-4 mr-2 justifyEnd">
                    <SubmitButton variant="secondary" className="mt-2">
                        Lagre tittel
                    </SubmitButton>
                </div>
            </form>
            <div className="box flexColumn justifyBetween">
                <Heading4 className="m-0">Hvor skal tavla stå?</Heading4>
                <Address bid={bid} location={meta.location} />
            </div>
            <form
                action={async (data: FormData) => {
                    const font = data.get('font') as TFontSize
                    await saveFont(bid, font)
                    addToast('Tekststørrelse lagret!')
                }}
                className="box flexColumn justifyBetween"
            >
                <Heading4 className="m-0">Velg tekststørrelse: </Heading4>
                <FontChoiceChip font={meta.fontSize ?? 'medium'} />
                <div className="flexRow w-100 mt-4 mr-2 justifyEnd">
                    <SubmitButton variant="secondary">
                        Lagre tekststørrelse
                    </SubmitButton>
                </div>
            </form>
        </div>
    )
}

export { MetaSettings }
