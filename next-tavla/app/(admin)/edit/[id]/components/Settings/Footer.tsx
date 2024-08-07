import { Switch, TextField } from '@entur/form'
import { ValidationInfoIcon } from '@entur/icons'
import { Heading4 } from '@entur/typography'
import { Tooltip } from 'app/(admin)/components/Tooltip'
import { TFooter } from 'types/settings'
import { useState } from 'react'

function Footer({
    footer,
    organizationBoard,
}: {
    footer?: TFooter
    organizationBoard: boolean
}) {
    const [override, setOverride] = useState(footer?.override ?? false)

    return (
        <div className="box flex flex-col gap-2">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center gap-2">
                    <Heading4 margin="bottom">Infomelding</Heading4>
                    <Tooltip
                        content="Skriv en kort tekst som skal vises nederst i tavlen."
                        placement="top"
                    >
                        <ValidationInfoIcon />
                    </Tooltip>
                </div>
                {organizationBoard && (
                    <div className="flex flex-row gap-2.5 items-center">
                        <p className="mt-1">Vis</p>
                        <Switch
                            checked={!override}
                            onChange={() => setOverride(!override)}
                            name="override"
                        ></Switch>
                    </div>
                )}
            </div>
            <div className="h-full">
                <TextField
                    label="Infomelding"
                    name="footer"
                    defaultValue={footer?.footer ?? ''}
                    readOnly={!override && organizationBoard}
                    className="w-full"
                />
            </div>
        </div>
    )
}

export { Footer }
