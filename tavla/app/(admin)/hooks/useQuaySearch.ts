import { QuaysSearchQuery } from 'graphql/index'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'hooks/useQuery'
import { SmallTravelTag } from 'components/TravelTag'

function getPlatformLabel(
    index: number,
    publicCode?: string | null,
    description?: string | null,
) {
    if (!publicCode && !description) {
        return `${index + 1}`
    }
    return [publicCode, description].filter(isNotNullOrUndefined).join(' ')
}

function useQuaySearch(stopPlaceId: string, icons = true) {
    const { data } = useQuery(QuaysSearchQuery, { stopPlaceId: stopPlaceId })
    const [selectedQuay, setSelectedQuay] =
        useState<NormalizedDropdownItemType | null>(null)

    useEffect(() => setSelectedQuay(null), [stopPlaceId])

    const nonAirQuays = useMemo(
        () =>
            data?.stopPlace?.quays
                ?.filter(isNotNullOrUndefined)
                .filter((quay) =>
                    quay.lines.some((line) => line.transportMode !== 'air'),
                )
                .map((quay, index) => ({
                    value: quay.id,
                    label: getPlatformLabel(
                        index,
                        quay.publicCode,
                        quay.description,
                    ),
                    icons: quay.lines
                        ?.sort((l1, l2) => {
                            if (!l1.publicCode || !l2.publicCode) return 0
                            const l1Digits = l1.publicCode.match(/[^$,.\d]/)
                            const l2Digits = l2.publicCode.match(/[^$,.\d]/)

                            if (l1Digits && !l2Digits) return 1
                            if (!l1Digits && l2Digits) return -1
                            if (l1.publicCode < l2.publicCode) return -1
                            return 1
                        })
                        .slice(0, 5)
                        .map((line, index) => () => {
                            if (index === 4)
                                return SmallTravelTag({
                                    transportMode: 'unknown',
                                    publicCode: `+${quay.lines.length - index}`,
                                    icons: false,
                                })
                            return SmallTravelTag({
                                transportMode: line.transportMode,
                                publicCode: line.publicCode,
                                icons: icons,
                            })
                        }),
                }))
                .sort((a, b) => {
                    return a.label.localeCompare(b.label, 'no-NB', {
                        numeric: true,
                    })
                }) || [],
        [data, icons],
    )

    const airQuays = useMemo(
        () =>
            data?.stopPlace?.quays
                ?.filter(isNotNullOrUndefined)
                .filter((quay) =>
                    quay.lines.some((line) => line.transportMode === 'air'),
                )
                .map((quay) => ({
                    value: quay.id,
                    label: 'Terminal',
                    icons: [
                        () =>
                            SmallTravelTag({
                                transportMode: 'air',
                            }),
                    ],
                })) || [],
        [data],
    )

    const getQuays = useCallback(() => {
        const quays = [...nonAirQuays, ...airQuays]
        return [{ value: stopPlaceId, label: 'Vis alle' }, ...quays]
    }, [nonAirQuays, airQuays, stopPlaceId])

    return { quays: getQuays, selectedQuay, setSelectedQuay }
}

export { useQuaySearch }
