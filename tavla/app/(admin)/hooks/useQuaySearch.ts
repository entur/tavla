import { NormalizedDropdownItemType } from '@entur/dropdown'
import { SmallTravelTag } from 'app/(admin)/tavler/[id]/rediger/components/Settings/components/TravelTag'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { QuaysSearchQuery } from 'src/graphql/index'
import { useQuery } from 'src/hooks/useQuery'
import { isNotNullOrUndefined } from 'src/utils/typeguards'

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
                .sort((q1, q2) => {
                    if (q1.publicCode && q2.publicCode) {
                        if (q1.publicCode < q2.publicCode) return -1
                        else return 1
                    } else if (q1.publicCode) return -1
                    else if (q2.publicCode) return 1

                    const q1Value = parseInt(q1.id.split(':')[2] ?? '', 10)
                    const q2Value = parseInt(q2.id.split(':')[2] ?? '', 10)
                    if (!q1Value || !q2Value) {
                        if (q1.id < q2.id) return -1
                        else return 1
                    } else {
                        if (q1Value < q2Value) return -1
                        else return 1
                    }
                })
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
                        .map((line, index) => {
                            if (index === 4) {
                                // Create unique icons
                                const UnknownSmallTravelTag: FC = () =>
                                    SmallTravelTag({
                                        transportMode: 'unknown',
                                        publicCode: `+${quay.lines.length - index}`,
                                        icons: false,
                                    })
                                UnknownSmallTravelTag.displayName = `SmallTravelTag-unknown-${quay.id}-${index}`
                                return UnknownSmallTravelTag
                            }

                            // Create unique icons
                            const UniqueSmallTravelTag: FC = () =>
                                SmallTravelTag({
                                    transportMode: line.transportMode,
                                    publicCode: line.publicCode,
                                    icons: icons,
                                })
                            UniqueSmallTravelTag.displayName = `SmallTravelTag-${quay.id}-${line.transportMode}-${index}`
                            return UniqueSmallTravelTag
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
