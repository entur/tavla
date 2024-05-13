'use client'
import { useToast } from '@entur/alert'
import { Switch, TextField } from '@entur/form'
import { ValidationInfoIcon } from '@entur/icons'
import { Heading3 } from '@entur/typography'
import { Tooltip } from 'app/(admin)/components/Tooltip'
import { SubmitButton } from 'components/Form/SubmitButton'
import { TBoardID, TFooter } from 'types/settings'
import { setFooter } from './actions'
import { useState } from 'react'

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
        const overrideOrg = override !== 'on'
        await setFooter(bid, {
            footer: footer,
            override: overrideOrg ?? true,
        })
        addToast('Infomelding lagret!')
    }

    return (
        <form
            className="box flex flex-col justify-between"
            action={submitOrgBoard}
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
            <div className="flex flex-row w-full mt-8 justify-end">
                <SubmitButton variant="secondary" aria-label="Lagre kolonner">
                    Lagre infomelding
                </SubmitButton>
            </div>
        </form>
    )
}

export { Footer }
