'use client'
import { useToast } from '@entur/alert'
import { Switch, TextField } from '@entur/form'
import { ValidationInfoIcon } from '@entur/icons'
import { Heading3 } from '@entur/typography'
import { Tooltip } from 'app/(admin)/components/Tooltip'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useState } from 'react'
import { TBoardID, TFooter } from 'types/settings'
import { saveFooter, setOrganizationBoardFooter } from './actions'

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
    const [override, setOverride] = useState(footer?.override ?? true)
    const submitOrgBoard = async (data: FormData) => {
        const footer = data.get('footer') as string
        const override = data.get('override') as string
        const overrideOrg = override === 'on'
        await setOrganizationBoardFooter(bid, {
            footer: footer,
            override: overrideOrg,
        })
        addToast('Infomelding lagret!')
    }

    const submitBoard = async (data: FormData) => {
        const footer = data.get('footer') as string
        await saveFooter(bid, footer)
        addToast('Infomelding lagret!')
    }

    if (organizationBoard) {
        return (
            <form
                className="box flexColumn justifyBetween g-2"
                action={submitOrgBoard}
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
                    defaultValue={footer?.footer ?? ''}
                    readOnly={override}
                />
                <Switch
                    checked={override}
                    name="override"
                    onChange={() => setOverride(!override)}
                >
                    Vis infomelding fra organisasjonen.
                </Switch>
                <div className="flexRow w-100 mt-4 mr-2 justifyEnd">
                    <SubmitButton
                        variant="secondary"
                        aria-label="Lagre kolonner"
                    >
                        Lagre infomelding
                    </SubmitButton>
                </div>
            </form>
        )
    }

    return (
        <form
            className="box flexColumn justifyBetween g-2"
            action={submitBoard}
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
                defaultValue={footer?.footer ?? ''}
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
