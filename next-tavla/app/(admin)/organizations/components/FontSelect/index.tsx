'use client'
import { TFontSize } from 'types/meta'
import { setFontSize } from './actions'
import { FontChoiceChip } from 'app/(admin)/edit/[id]/components/MetaSettings/FontChoiceChip'
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
        <div className="box flexColumn g-1">
            <Heading2>Tekststørrelse</Heading2>
            <Paragraph>
                Velg hvilken tekststørrelse som skal være standard når det
                opprettes en ny tavle.
            </Paragraph>
            <form
                className="flexColumn justifyBetween h-100"
                action={async (data: FormData) => {
                    const font = data.get('font') as TFontSize
                    if (!oid) return
                    await setFontSize(oid, font)
                    addToast('Tekststørrelse lagret!')
                }}
            >
                <FontChoiceChip font={font ?? 'medium'} />

                <div className="flexRow w-100 mt-4 mr-2 justifyEnd">
                    <SubmitButton
                        variant="secondary"
                        aria-label="Lagre tekststørrelse"
                    >
                        Lagre tekststørrelse
                    </SubmitButton>
                </div>
            </form>
        </div>
    )
}

export { FontSelect }
