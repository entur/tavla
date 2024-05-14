'use client'
import { TextField } from '@entur/form'
import { Heading3 } from '@entur/typography'
import { TFontSize, TMeta } from 'types/meta'
import { saveFont, saveTitle } from './actions'
import { TBoardID } from 'types/settings'
import { FontChoiceChip } from './FontChoiceChip'
import { SubmitButton } from 'components/Form/SubmitButton'
import { Address } from './Adress'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { useToast } from '@entur/alert'
import { isEmptyOrSpaces } from 'app/(admin)/edit/utils'

function MetaSettings({ bid, meta }: { bid: TBoardID; meta: TMeta }) {
    const { addToast } = useToast()
    return (
        <>
            <form
                action={async (data: FormData) => {
                    const name = data.get('name') as string
                    if (isEmptyOrSpaces(name))
                        return addToast({
                            content:
                                'Navnet kan ikke være tomt eller bare mellomrom!',
                            variant: 'info',
                        })
                    await saveTitle(bid, name)
                    addToast('Tittel lagret!')
                }}
                className="box flex flex-col justify-between"
            >
                <Heading3 margin="bottom">Navn</Heading3>
                <TextField
                    name="name"
                    className="w-full"
                    defaultValue={meta.title ?? DEFAULT_BOARD_NAME}
                    label="Navn på tavlen"
                    maxLength={30}
                />
                <div className="flex flex-row w-full justify-end mt-8">
                    <SubmitButton variant="secondary">
                        Lagre tittel
                    </SubmitButton>
                </div>
            </form>
            <Address bid={bid} location={meta.location} />
            <form
                action={async (data: FormData) => {
                    const font = data.get('font') as TFontSize
                    await saveFont(bid, font)
                    addToast('Tekststørrelse lagret!')
                }}
                className="box flex flex-col justify-between"
            >
                <Heading3 margin="bottom">Tekststørrelse: </Heading3>
                <FontChoiceChip font={meta.fontSize ?? 'medium'} />
                <div className="flex flex-row w-full mt-12 justify-end">
                    <SubmitButton variant="secondary">
                        Lagre tekststørrelse
                    </SubmitButton>
                </div>
            </form>
        </>
    )
}

export { MetaSettings }
