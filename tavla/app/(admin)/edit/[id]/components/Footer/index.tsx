'use client'
import { Switch } from '@entur/form'
import { ValidationInfoFilledIcon } from '@entur/icons'
import { Heading4 } from '@entur/typography'
import { TFooter } from 'types/settings'
import { ReactNode, useState } from 'react'
import { Tooltip } from '@entur/tooltip'

import dynamic from 'next/dynamic'

const TextField = dynamic(
    () => import('@entur/form').then((mod) => mod.TextField),
    { ssr: false },
)

function Footer({
    footer,
    organizationBoard,
    error,
}: {
    footer?: TFooter
    organizationBoard: boolean
    error?: ReactNode
}) {
    const [override, setOverride] = useState(footer?.override ?? false)

    return (
        <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center gap-2">
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

                {organizationBoard && (
                    <Switch
                        checked={override}
                        onChange={() => setOverride(!override)}
                        name="override"
                    >
                        Vis infomelding fra mappen.
                    </Switch>
                )}
            </div>
            <TextField
                label="Infomelding"
                name="footer"
                defaultValue={footer?.footer ?? ''}
                readOnly={override && organizationBoard}
                className="w-full"
            />
            <div className="mt-4">{error}</div>
        </div>
    )
}

export { Footer }
