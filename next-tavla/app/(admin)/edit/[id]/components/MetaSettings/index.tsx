'use client'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <form
                action={async (data: FormData) => {
                    const name = data.get('name') as string
                    await saveTitle(bid, name)
                    addToast('Tittel lagret!')
                }}
                className="box flex flex-col justify-between"
            >
                <Heading4 className="m-0">Navn på tavlen</Heading4>
                <TextField
                    name="name"
                    className="w-full"
                    defaultValue={meta.title ?? DEFAULT_BOARD_NAME}
                    label="Navn på tavlen"
                    maxLength={30}
                />
                <div className="flex flex-row w-full mt-8 mr-8 justify-end">
                    <SubmitButton variant="secondary" className="mt-8">
                        Lagre tittel
                    </SubmitButton>
                </div>
            </form>
            <div className="box flex flex-col justify-between">
                <Heading4 className="m-0">Hvor skal tavla stå?</Heading4>
                <Address bid={bid} location={meta.location} />
            </div>
            <form
                action={async (data: FormData) => {
                    const font = data.get('font') as TFontSize
                    await saveFont(bid, font)
                    addToast('Tekststørrelse lagret!')
                }}
                className="box flex flex-col justify-between"
            >
                <Heading4 className="m-0">Velg tekststørrelse: </Heading4>
                <FontChoiceChip font={meta.fontSize ?? 'medium'} />
                <div className="flex flex-row w-full mt-8 mr-8 justify-end">
                    <SubmitButton variant="secondary">
                        Lagre tekststørrelse
                    </SubmitButton>
                </div>
            </form>
        </div>
    )
}

export { MetaSettings }
