'use client'
import { useToast } from '@entur/alert'
import { Heading2, Paragraph } from '@entur/typography'
import { SubmitButton } from 'components/Form/SubmitButton'
import { TOrganizationID } from 'types/settings'
import { setFooter as setFooterAction } from './actions'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'

function Footer({ oid, footer }: { oid?: TOrganizationID; footer?: string }) {
    const { addToast } = useToast()

    const setOrgFooter = async (data: FormData) => {
        const formFeedback = await setFooterAction(oid, data)
        if (!formFeedback) {
            addToast('Infomelding lagret!')
        }
    }

    return (
        <form className="box flex flex-col gap-1 " action={setOrgFooter}>
            <Heading2>Infomelding</Heading2>
            <Paragraph>
                Skriv en kort tekst som skal vises nederst i tavlen.
            </Paragraph>

            <div className="flex flex-col justify-between h-full">
                <ClientOnlyTextField
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
