'use client'
import { TFontSize } from 'types/meta'
import { setFontSize } from './actions'
import { FontChoiceChip } from 'app/(admin)/edit/[id]/components/MetaSettings/FontChoiceChip'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useToast } from '@entur/alert'
import { Button } from '@entur/button'

function FontSelect({
    oid,
    font,
}: {
    oid?: TOrganizationID
    font?: TFontSize
}) {
    const { addToast } = useToast()
    return (
        <div className="flexColumn g-2">
            <Heading2>Tekststørrelse</Heading2>
            <form
                className="box flexColumn justifyBetween"
                action={async (data: FormData) => {
                    const font = data.get('font') as TFontSize
                    if (!oid) return
                    await setFontSize(oid, font)
                }}
            >
                <div className="flexColumn">
                    <Paragraph>
                        Velg hvilken tekststørrelse som skal være standard når
                        du oppretter en ny tavle.
                    </Paragraph>
                    <FontChoiceChip font={font ?? 'medium'} />
                </div>
                <div className="flexRow justifyEnd mt-2 mr-2 ">
                    <Button
                        variant="secondary"
                        type="submit"
                        aria-label="Lagre tekststørrelse"
                    >
                        Lagre tekststørrelse
                    </Button>
                </div>
            </form>
        </div>
    )
}

export { FontSelect }
