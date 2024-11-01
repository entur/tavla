'use client'
import { useToast } from '@entur/alert'
import { Switch } from '@entur/form'
import { ValidationInfoIcon } from '@entur/icons'
import { Heading3 } from '@entur/typography'
import { SubmitButton } from 'components/Form/SubmitButton'
import { TBoardID, TFooter } from 'types/settings'
import { setFooter } from './actions'
import { useState } from 'react'
import { Tooltip } from '@entur/tooltip'
import ClientOnlyComponent from 'app/components/NoSSR/ClientOnlyComponent'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'

function Footer({
    bid,
    footer,
    organizationBoard,
}: {
    bid: TBoardID
    footer?: TFooter
    organizationBoard: boolean
}) {
    const { addToast } = useToast()
    const [override, setOverride] = useState(footer?.override ?? false)

    const submitOrgBoard = async (data: FormData) => {
        const footer = data.get('footer') as string
        const override = data.get('override') as string
        const overrideOrg = override === 'on'

        await setFooter(bid, {
            footer: footer,
            override: overrideOrg,
        })

        addToast('Infomelding lagret!')
    }

    return (
        <form className="box flex flex-col" action={submitOrgBoard}>
            <div className="flex flex-row items-center gap-2">
                <Heading3 margin="bottom">Infomelding</Heading3>
                <ClientOnlyComponent>
                    <Tooltip
                        content="Skriv en kort tekst som skal vises nederst i tavlen."
                        placement="top"
                    >
                        <ValidationInfoIcon className="mb-3" size={20} />
                    </Tooltip>
                </ClientOnlyComponent>
            </div>
            <div className="h-full">
                <ClientOnlyTextField
                    label="Infomelding"
                    name="footer"
                    defaultValue={footer?.footer ?? ''}
                    readOnly={override && organizationBoard}
                    className="w-full"
                />
                {organizationBoard && (
                    <Switch
                        checked={override}
                        onChange={() => setOverride(!override)}
                        name="override"
                    >
                        Vis infomelding fra organisasjonen.
                    </Switch>
                )}
            </div>
            <div className="flex flex-row mt-8 justify-end">
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
