import { useToast } from '@entur/alert'
import { SearchableDropdown } from '@entur/dropdown'
import { ValidationInfoIcon } from '@entur/icons'
import { Heading3 } from '@entur/typography'
import { Tooltip } from 'app/(admin)/components/Tooltip'
import { saveLocation } from 'app/(admin)/edit/[id]/components/MetaSettings/actions'
import { usePointSearch } from 'app/(admin)/hooks/usePointSearch'
import { SubmitButton } from 'components/Form/SubmitButton'
import { FormEvent } from 'react'
import { TLocation } from 'types/meta'
import { TBoardID } from 'types/settings'

function Address({ bid, location }: { bid: TBoardID; location?: TLocation }) {
    const { pointItems, selectedPoint, setSelectedPoint } =
        usePointSearch(location)
    const { addToast } = useToast()

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            await saveLocation(bid, selectedPoint?.value)
            addToast('Adresse oppdatert!')
        } catch (error) {
            addToast({
                content: 'Noe gikk galt under lagring av adresse.',
                variant: 'info',
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="box flex flex-col">
            <div className="flex flex-row items-center gap-2">
                <Heading3 margin="bottom">Adresse</Heading3>
                <Tooltip
                    content="Under innstillingene til hvert stoppested kan du velge om gåavstanden, fra tavlens adresse til selve stoppestedet, skal vises"
                    placement="top"
                >
                    <ValidationInfoIcon className="md:mb-2 mb-3" size={20} />
                </Tooltip>
            </div>
            <div className="h-full">
                <SearchableDropdown
                    label="Hvor befinner tavlen seg?"
                    items={pointItems}
                    selectedItem={selectedPoint}
                    onChange={setSelectedPoint}
                    debounceTimeout={1000}
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
