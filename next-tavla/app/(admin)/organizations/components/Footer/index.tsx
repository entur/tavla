'use client'
import { TextArea } from '@entur/form'
import { Heading2, Paragraph } from '@entur/typography'
import { SubmitButton } from 'components/Form/SubmitButton'
import { TOrganizationID } from 'types/settings'
import { setFooter } from './actions'
import { useToast } from '@entur/alert'

function Footer({ oid, footer }: { oid?: TOrganizationID; footer?: string }) {
    const { addToast } = useToast()
    return (
        <div className="flexColumn g-2">
            <Heading2>Informasjonstekst</Heading2>{' '}
            <form
                className="box flexColumn justifyBetween"
                action={async (data: FormData) => {
                    const footer = data.get('footer') as string
                    if (!oid) return
                    await setFooter(oid, footer)
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
