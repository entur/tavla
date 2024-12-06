'use client'
import { useToast } from '@entur/alert'
import { SearchableDropdown } from '@entur/dropdown'
import { ValidationInfoFilledIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { Heading3 } from '@entur/typography'
import { saveLocation as saveLocationAction } from 'app/(admin)/edit/[id]/components/MetaSettings/actions'
import { usePointSearch } from 'app/(admin)/hooks/usePointSearch'
import ClientOnly from 'app/components/NoSSR/ClientOnly'
import { SubmitButton } from 'components/Form/SubmitButton'

import { TLocation } from 'types/meta'
import { TBoardID } from 'types/settings'

function Address({ bid, location }: { bid: TBoardID; location?: TLocation }) {
    const { pointItems, selectedPoint, setSelectedPoint } =
        usePointSearch(location)
    const { addToast } = useToast()

    const saveLocation = async () => {
        const formFeedback = await saveLocationAction(bid, selectedPoint?.value)
        if (!formFeedback) {
            addToast('Adresse oppdatert!')
        }
    }

    return (
        <form action={saveLocation} className="box flex flex-col">
            <div className="flex flex-row items-center gap-2">
                <Heading3 margin="bottom">Adresse</Heading3>

                <Tooltip
                    content="Under innstillingene til hvert stoppested kan du velge om gåavstanden, fra tavlens adresse til selve stoppestedet, skal vises"
                    placement="top"
                    id="tooltip-address"
                >
                    <ValidationInfoFilledIcon
                        className="md:mb-2 mb-3"
                        size={20}
                    />
                </Tooltip>
            </div>
            <div className="h-full">
                <ClientOnly>
                    <SearchableDropdown
                        label="Hvor befinner tavlen seg?"
                        items={pointItems}
                        selectedItem={selectedPoint}
                        onChange={setSelectedPoint}
                        debounceTimeout={150}
                        clearable
                    />
                </ClientOnly>
            </div>
            <div className="flex flex-row mt-8 justify-end">
                <SubmitButton variant="secondary" className="max-sm:w-full">
                    Lagre adresse
                </SubmitButton>
            </div>
        </form>
    )
}

export { Address }
