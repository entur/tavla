'use client'
import { useToast } from '@entur/alert'
import { SearchableDropdown } from '@entur/dropdown'
import { Heading3, SubParagraph } from '@entur/typography'
import { FormError } from 'app/(admin)/components/FormError'
import { saveLocation as saveLocationAction } from 'app/(admin)/edit/[id]/components/MetaSettings/actions'
import { usePointSearch } from 'app/(admin)/hooks/usePointSearch'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useActionState } from 'react'

import { TLocation } from 'types/meta'
import { TBoardID } from 'types/settings'

function WalkingDistance({
    bid,
    location,
}: {
    bid: TBoardID
    location?: TLocation
}) {
    const { pointItems, selectedPoint, setSelectedPoint } =
        usePointSearch(location)
    const { addToast } = useToast()

    const saveLocation = async () => {
        const formFeedback = await saveLocationAction(bid, selectedPoint?.value)
        if (!formFeedback) {
            addToast('Adresse oppdatert!')
        }
        return formFeedback
    }

    const [locationState, saveLocationFormAction] = useActionState(
        saveLocation,
        undefined,
    )

    return (
        <form action={saveLocationFormAction} className="box flex flex-col">
            <Heading3 margin="bottom">Gåavstand</Heading3>
            <SubParagraph className="mb-2">
                Vis gåavstand fra tavlens adresse til hvert stoppested.
            </SubParagraph>

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
            <div className="mt-4">
                <FormError
                    {...getFormFeedbackForField('general', locationState)}
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

export { WalkingDistance }
