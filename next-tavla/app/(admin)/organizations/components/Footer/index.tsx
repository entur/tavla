'use client'
import { useToast } from '@entur/alert'
import { TextField } from '@entur/form'
import { Heading2, Paragraph } from '@entur/typography'
import { SubmitButton } from 'components/Form/SubmitButton'
import { TOrganizationID } from 'types/settings'
import { setFooter } from './actions'

function Footer({ oid, footer }: { oid?: TOrganizationID; footer?: string }) {
    const { addToast } = useToast()
    return (
        <form
            className="box flex flex-col gap-1 "
            action={async (data: FormData) => {
                if (!oid) return
                const info = data.get('footer') as string

                await setFooter(oid, info)
                addToast('Infomelding lagret!')
            }}
        >
            <Heading2>Infomelding</Heading2>
            <Paragraph>
                Skriv en kort tekst som skal vises nederst i tavlen.
            </Paragraph>

            <div className="flex flex-col justify-between h-full">
                <TextField
                    label="Infomelding"
                    name="footer"
                    defaultValue={footer ?? ''}
                />
                <div className="flex flex-row w-full mt-8 justify-end">
                    <SubmitButton
                        variant="secondary"
                        aria-label="Lagre kolonner"
                    >
                        Lagre infomelding
                    </SubmitButton>
                </div>
            </div>
        </form>
    )
}

export { Footer }
