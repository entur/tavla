'use client'
import { TextField } from '@entur/form'
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
                        Skriv en kort tekst som skal vises nederst i
                        tavlevisningen.
                    </Paragraph>

                    <TextField
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
