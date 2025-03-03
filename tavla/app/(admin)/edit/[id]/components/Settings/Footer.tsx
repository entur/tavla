'use client'
import { Switch } from '@entur/form'
import { ValidationInfoFilledIcon } from '@entur/icons'
import { Heading4 } from '@entur/typography'
import { TFooter } from 'types/settings'
import { useState } from 'react'
import { Tooltip } from '@entur/tooltip'

import ClientOnlyTextField from 'app/components/NoSSR/TextField'

function Footer({
    footer,
    boardInOrganization,
}: {
    footer?: TFooter
    boardInOrganization: boolean
}) {
    const [override, setOverride] = useState(footer?.override ?? false)

    return (
        <div className="flex flex-col">
            <div className="flex  flex-col items-start sm:flex-row justify-between sm:items-center gap-2">
                <div className=" flex gap-2 items-center">
                    <Heading4 margin="bottom">Infomelding</Heading4>

                    <Tooltip
                        content="Skriv en kort tekst som skal vises nederst i tavlen."
                        placement="top"
                        id="tooltip-footer"
                    >
                        <ValidationInfoFilledIcon
                            size={20}
                            aria-labelledby="tooltip-footer"
                        />
                    </Tooltip>
                </div>

                {boardInOrganization && (
                    <Switch
                        checked={override}
                        onChange={() => setOverride(!override)}
                        name="override"
                    >
                        Vis infomelding fra mappen.
                    </Switch>
                )}
            </div>
            <ClientOnlyTextField
                label="Infomelding"
                name="footer"
                defaultValue={footer?.footer ?? ''}
                readOnly={override && boardInOrganization}
                className="w-full"
            />
        </div>
    )
}

export { Footer }
