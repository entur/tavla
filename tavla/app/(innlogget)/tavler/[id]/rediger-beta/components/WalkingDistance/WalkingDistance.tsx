'use client'
import { SearchableDropdown } from '@entur/dropdown'
import { Paragraph } from '@entur/typography'
import { HiddenInput } from 'app/_components/Form/HiddenInput'
import ClientOnly from 'app/_components/NoSSR/ClientOnly'
import { usePointSearch } from 'app/_hooks/usePointSearch'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useActionState, useEffect, useRef } from 'react'
import type { LocationDB } from 'src/types/db-types/boards'
import { type FormState, saveWalkingDistance } from './action'

export function WalkingDistanceForm({
    bid,
    location,
}: {
    bid: string
    location?: LocationDB
}) {
    const { capture } = usePosthogTracking()
    const formRef = useRef<HTMLFormElement>(null)
    const isFirstRender = useRef(true)

    const { pointItems, selectedPoint, setSelectedPoint } =
        usePointSearch(location)

    async function handleSave(_prevState: FormState, formData: FormData) {
        const result = await saveWalkingDistance(bid, _prevState, formData)

        if (result?.status === 'success') {
            capture('board_settings_changed', {
                setting: 'board_location',
                value: 'changed',
            })
        }

        return result
    }

    const [state, formAction] = useActionState(handleSave, null)

    const error = state?.status === 'error' ? state.message : undefined

    // biome-ignore lint/correctness/useExhaustiveDependencies: selectedPoint triggers the submit intentionally
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        formRef.current?.requestSubmit()
    }, [selectedPoint])

    return (
        <form action={formAction} ref={formRef} className="flex flex-col">
            <Paragraph variant="small" className="mb-2 text-lg">
                Gangavstand
            </Paragraph>
            <Paragraph variant="small" className="mb-2 text-[#626493]">
                Skriv inn hvor tavlen står for å vise avstand til stoppestedet.
            </Paragraph>
            <ClientOnly>
                <SearchableDropdown
                    label="Hvor befinner tavlen seg?"
                    items={pointItems}
                    selectedItem={selectedPoint}
                    onChange={setSelectedPoint}
                    debounceTimeout={150}
                    clearable
                    variant={error ? 'negative' : undefined}
                    feedback={error}
                />
            </ClientOnly>
            <HiddenInput
                id="newLocation"
                value={
                    selectedPoint?.value
                        ? JSON.stringify(selectedPoint.value)
                        : ''
                }
            />
        </form>
    )
}
