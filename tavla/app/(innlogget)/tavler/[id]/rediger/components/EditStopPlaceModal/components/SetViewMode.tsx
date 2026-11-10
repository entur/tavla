import { RadioGroup, RadioPanel } from '@entur/form'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import Fremhev from 'assets/illustrations/Fremhev-neste-avgang.svg'
import Liste from 'assets/illustrations/Liste.svg'
import type { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Image from 'next/image'
import { Heading5, SubParagraph } from 'node_modules/@entur/typography'
import type { TileViewMode } from 'src/types/db-types/boards'

const viewModes: {
    value: TileViewMode
    title: string
    description: string
    image: StaticImport
}[] = [
    {
        value: 'default',
        title: 'Liste',
        description:
            'Viser alle avganger i en liste. Egner seg for oversikt over mange avganger samtidig.',
        image: Liste,
    },
    {
        value: 'expandNextDeparture',
        title: 'Fremhev neste avgang',
        description:
            'Neste avgang fremheves øverst, med resterende avganger listet under.',
        image: Fremhev,
    },
] as const

export function SetViewMode({
    selectedViewMode,
    isCombined,
    trackingLocation,
    handleViewModeChange,
    onFieldChanged,
}: {
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    handleViewModeChange: (field: TileViewMode) => void
    selectedViewMode: TileViewMode
    isCombined: boolean
    onFieldChanged: (field: string) => void
}) {
    const { capture } = usePosthogTracking()

    const handleChange = (mode: (typeof viewModes)[number]['value']) => {
        capture('stop_place_edit_interaction', {
            location: trackingLocation,
            field: 'view_mode',
            action: 'changed',
            column_value: 'none',
        })
        handleViewModeChange(mode)
        onFieldChanged('view_mode')
    }

    return (
        <div className="flex flex-col gap-4">
            <Heading5 as="h2">Hvordan vil du vise avgangene? </Heading5>
            {isCombined && (
                <SubParagraph className="text-error">
                    Du har samlet stoppestedene i én liste og har derfor ikke
                    mulighet til å velge visningsmodus.
                </SubParagraph>
            )}
            {!isCombined && (
                <RadioGroup
                    value={selectedViewMode}
                    onChange={(e) =>
                        handleChange(e.target.value as TileViewMode)
                    }
                    name={'viewMode'}
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {viewModes.map((mode) => (
                            <RadioPanel
                                key={mode.value}
                                value={mode.value}
                                className="w-full"
                                title={mode.title}
                            >
                                <div className="flex items-start justify-between gap-4 mt-4">
                                    <SubParagraph>
                                        {mode.description}
                                    </SubParagraph>
                                    <Image
                                        src={mode.image}
                                        alt={mode.title}
                                        className="h-20 w-auto"
                                    />
                                </div>
                            </RadioPanel>
                        ))}
                    </div>
                </RadioGroup>
            )}
        </div>
    )
}
