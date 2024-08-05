import { TFontSize } from 'types/meta'
import { setFontSize } from './actions'
import { FontChoiceChip } from 'app/(admin)/edit/[id]/components/Settings/FontChoiceChip'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useToast } from '@entur/alert'
import { TOrganizationID } from 'types/settings'
import { Heading2, Paragraph } from '@entur/typography'

function FontSelect({
    oid,
    font,
}: {
    oid?: TOrganizationID
    font?: TFontSize
}) {
    const { addToast } = useToast()
    return (
        <div className="box flex flex-col gap-1">
            <Heading2>Tekststørrelse</Heading2>
            <Paragraph>
                Velg hvilken tekststørrelse som skal være standard når det
                opprettes en ny tavle.
            </Paragraph>
            <form
                className="flex flex-col justify-between h-full"
                action={async (data: FormData) => {
                    const font = data.get('font') as TFontSize
                    if (!oid) return
                    await setFontSize(oid, font)
                    addToast('Tekststørrelse lagret!')
                }}
            >
                <FontChoiceChip font={font ?? 'medium'} />

                <div className="flex flex-row w-full mt-8 justify-end">
                    <SubmitButton
                        variant="secondary"
                        aria-label="Lagre tekststørrelse"
                        className="max-sm:w-full"
                    >
                        Lagre tekststørrelse
                    </SubmitButton>
                </div>
            </form>
        </div>
    )
}

export { FontSelect }
