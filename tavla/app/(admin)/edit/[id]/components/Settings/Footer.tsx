'use client'
import { ValidationInfoFilledIcon } from '@entur/icons'
import { Heading4 } from '@entur/typography'
import { TFooter } from 'types/settings'
import { Tooltip } from '@entur/tooltip'

import ClientOnlyTextField from 'app/components/NoSSR/TextField'

function Footer({ footer }: { footer?: TFooter }) {
    return (
        <div className="flex flex-col">
            <div className="flex flex-col items-start sm:flex-row justify-between sm:items-center gap-2">
                <div className="flex flex-row gap-2 items-center">
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
            </div>
            <ClientOnlyTextField
                label="Infomelding"
                name="footer"
                defaultValue={footer?.footer ?? ''}
                className="w-full"
            />
        </div>
    )
}

export { Footer }
