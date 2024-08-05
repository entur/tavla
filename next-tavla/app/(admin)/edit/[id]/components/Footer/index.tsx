import { Switch, TextField } from '@entur/form'
import { ValidationInfoIcon } from '@entur/icons'
import { Heading3 } from '@entur/typography'
import { Tooltip } from 'app/(admin)/components/Tooltip'
import { TBoardID, TFooter } from 'types/settings'
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
    const [override, setOverride] = useState(footer?.override ?? false)

    return (
        <div className="box flex flex-col">
            <div className="flex flex-row items-center gap-2">
                <Heading3 margin="bottom">Infomelding</Heading3>
                <Tooltip
                    content="Skriv en kort tekst som skal vises nederst i tavlen."
                    placement="top"
                >
                    <ValidationInfoIcon className="mb-2" />
                </Tooltip>
            </div>
            <div className="h-full">
                <TextField
                    label="Infomelding"
                    name="footer"
                    defaultValue={footer?.footer ?? ''}
                    readOnly={!override && organizationBoard}
                    className="w-full"
                />
                {organizationBoard && (
                    <Switch
                        checked={!override}
                        onChange={() => setOverride(!override)}
                        name="override"
                    >
                        Vis infomelding fra organisasjonen.
                    </Switch>
                )}
            </div>
        </div>
    )
}

export { Footer }
