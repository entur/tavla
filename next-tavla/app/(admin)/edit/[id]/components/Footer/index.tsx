'use client'
import { TextField } from '@entur/form'
import { ValidationInfoIcon } from '@entur/icons'
import { Heading3 } from '@entur/typography'
import { Tooltip } from 'app/(admin)/components/Tooltip'
import { SubmitButton } from 'components/Form/SubmitButton'

function Footer({
    footer,
    action,
}: {
    footer?: string
    action: (data: FormData) => void
}) {
    return (
        <form className="box flexColumn justifyBetween g-2" action={action}>
            <div className="flexRow alignCenter g-1">
                <Heading3 className="m-0">Infomelding</Heading3>
                <Tooltip
                    content="Skriv en kort tekst som skal vises nederst i tavlen."
                    placement="top"
                >
                    <ValidationInfoIcon inline />
                </Tooltip>
            </div>
            <TextField
                label="Infomelding"
                name="footer"
                defaultValue={footer ?? ''}
            />
            <div className="flexRow w-100 mt-4 mr-2 justifyEnd">
                <SubmitButton variant="secondary" aria-label="Lagre kolonner">
                    Lagre infomelding
                </SubmitButton>
            </div>
        </form>
    )
}

export { Footer }
