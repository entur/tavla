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
            className="box flex flex-col justify-between"
            action={async (data: FormData) => {
                if (!oid) return
                const info = data.get('footer') as string

                await setFooter(oid, info)
                addToast('Infomelding lagret!')
            }}
        >
            <div className="flex flex-row items-center gap-2">
                <Heading3 margin="none">Infomelding</Heading3>
                <Tooltip
                    content="Skriv en kort tekst som skal vises nederst i tavlen."
                    placement="top"
                >
                    <ValidationInfoIcon />
                </Tooltip>
            </div>
            <TextField
                label="Infomelding"
                name="footer"
                defaultValue={footer ?? ''}
            />
            <div className="flex flex-row w-full mt-8 justify-end">
                <SubmitButton
                    variant="secondary"
                    aria-label="Lagre kolonner"
                    className="max-sm:w-full"
                >
                    Lagre infomelding
                </SubmitButton>
            </div>
        </form>
    )
}

export { Footer }
