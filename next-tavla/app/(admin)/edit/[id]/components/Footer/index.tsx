'use client'
import { TextField } from '@entur/form'
import { Heading3, Paragraph } from '@entur/typography'
import { SubmitButton } from 'components/Form/SubmitButton'

function Footer({
    footer,
    action,
}: {
    footer?: string
    action: (data: FormData) => void
}) {
    return (
        <form className="box flexColumn justifyBetween g-1" action={action}>
            <div>
                <Heading3 className="m-0">Infomelding</Heading3>
                <Paragraph>
                    Skriv en kort tekst som skal vises nederst i tavlevisningen.
                </Paragraph>
                <div>
                    <TextField
                        label="Infomelding"
                        name="footer"
                        defaultValue={footer ?? ''}
                    />
                </div>
            </div>
            <div className="flexRow w-100 mt-4 mr-2 justifyEnd">
                <SubmitButton variant="secondary" aria-label="Lagre kolonner">
                    Lagre infomelding
                </SubmitButton>
            </div>
        </form>
    )
}

export { Footer }
