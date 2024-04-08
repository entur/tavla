'use client'
import { TextArea } from '@entur/form'
import { Heading2, Paragraph } from '@entur/typography'
import { SubmitButton } from 'components/Form/SubmitButton'

function Footer({
    footer,
    action,
}: {
    footer?: string
    action: (data: FormData) => void
}) {
    return (
        <div className="flexColumn g-2">
            <Heading2>Informasjonstekst</Heading2>
            <form className="box flexColumn justifyBetween" action={action}>
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
