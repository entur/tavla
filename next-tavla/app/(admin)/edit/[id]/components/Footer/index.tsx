'use client'
import { useToast } from '@entur/alert'
import { TextArea } from '@entur/form'
import { Heading2, Paragraph } from '@entur/typography'
import { SubmitButton } from 'components/Form/SubmitButton'
import { TBoardID } from 'types/settings'
import { saveFooter } from './actions'

function Footer({ bid, footer }: { bid: TBoardID; footer?: string }) {
    const { addToast } = useToast()
    return (
        <div className="flexColumn g-2">
            <Heading2>Informasjonstekst</Heading2>
            <form
                className="box flexColumn justifyBetween"
                action={async (data: FormData) => {
                    const info = data.get('footer') as string
                    await saveFooter(bid, info)
                    addToast('Footer lagret!')
                }}
            >
                <div>
                    <Paragraph>
                        Velg hvilke kolonner som skal være standard når du
                        oppretter en ny tavle.
                    </Paragraph>

                    <TextArea
                        label="Footer"
                        name="footer"
                        defaultValue={footer ?? ''}
                    />
                </div>
                <div className="flexRow w-100 mt-4 mr-2 justifyEnd">
                    <SubmitButton
                        variant="secondary"
                        aria-label="Lagre kolonner"
                    >
                        Lagre
                    </SubmitButton>
                </div>
            </form>
        </div>
    )
}

export { Footer }
