'use client'
import { TextField } from '@entur/form'
import { ValidationInfoIcon } from '@entur/icons'
import { Heading3 } from '@entur/typography'
import { Tooltip } from 'app/(admin)/components/Tooltip'
import { SubmitButton } from 'components/Form/SubmitButton'
import { TOrganizationID } from 'types/settings'
import { setFooter } from './actions'
import { useToast } from '@entur/alert'

function Footer({ oid, footer }: { oid?: TOrganizationID; footer?: string }) {
    const { addToast } = useToast()
    return (
        <form
            className="box flexColumn justifyBetween g-2"
            action={async (data: FormData) => {
                if (!oid) return
                const info = data.get('footer') as string

                await setFooter(oid, info)
                addToast('Infomelding lagret!')
            }}
        >
            <div className="flexRow alignCenter g-1">
                <Heading3 margin="none">Infomelding</Heading3>
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
