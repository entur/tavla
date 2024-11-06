import { useToast } from '@entur/alert'
import { SearchableDropdown } from '@entur/dropdown'
import { ValidationInfoFilledIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { Heading3 } from '@entur/typography'
import { saveLocation } from 'app/(admin)/edit/[id]/components/MetaSettings/actions'
import { usePointSearch } from 'app/(admin)/hooks/usePointSearch'
import ClientOnlyComponent from 'app/components/NoSSR/ClientOnlyComponent'
import { SubmitButton } from 'components/Form/SubmitButton'

import { TLocation } from 'types/meta'
import { TBoardID } from 'types/settings'

function Address({ bid, location }: { bid: TBoardID; location?: TLocation }) {
    const { pointItems, selectedPoint, setSelectedPoint } =
        usePointSearch(location)
    const { addToast } = useToast()

    const saveLocationWithParams = saveLocation.bind(
        null,
        bid,
        selectedPoint?.value,
    )

    const handleSubmit = async () => {
        const feedback = await saveLocationWithParams()

        if (feedback === undefined) {
            addToast('Adresse oppdatert!')
        } else {
            addToast({
                content: feedback.feedback,
                variant: 'info',
            })
        }
    }

    return (
        <form action={handleSubmit} className="box flex flex-col">
            <div className="flex flex-row items-center gap-2">
                <Heading3 margin="bottom">Adresse</Heading3>
                <ClientOnlyComponent>
                    <Tooltip
                        content="Under innstillingene til hvert stoppested kan du velge om gåavstanden, fra tavlens adresse til selve stoppestedet, skal vises"
                        placement="top"
                    >
                        <ValidationInfoFilledIcon
                            className="md:mb-2 mb-3"
                            size={20}
                        />
                    </Tooltip>
                </ClientOnlyComponent>
            </div>
            <div className="h-full">
                <SearchableDropdown
                    label="Hvor befinner tavlen seg?"
                    items={pointItems}
                    selectedItem={selectedPoint}
                    onChange={setSelectedPoint}
                    debounceTimeout={150}
                    clearable
                />
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
