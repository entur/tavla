import { useQuery } from 'graphql/utils'
import { QuaysSearchQuery } from 'graphql/index'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { hasDuplicateInArrayByKey } from 'utils/filters'
import { TDirectionType } from 'types/graphql-schema'
import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { countBy } from 'lodash'

function getPlatformLabel(
    index: number,
    publicCode?: string | null,
    description?: string | null,
    directionTypes?: (TDirectionType | null | undefined)[] | null,
) {
    if (!publicCode && !description) {
        return `${index + 1} ${getDirection(directionTypes)}`
    }
    return [publicCode, description].filter(isNotNullOrUndefined).join(' ')
}

function getDirection(
    directionTypes?: (TDirectionType | null | undefined)[] | null,
) {
    const directionCount = countBy(directionTypes)
    const direction = Object.keys(directionCount).filter(
        (k) =>
            directionCount[k] ==
            Math.max.apply(null, Object.values(directionCount)),
    )[0]

    if (direction === 'inbound') return '- Retning sentrum'
    return ''
}

function useQuaySearch(stopPlaceId: string) {
    const { data } = useQuery(QuaysSearchQuery, { stopPlaceId })
    const [selectedQuays, setSelectedQuays] = useState<
        NormalizedDropdownItemType[] | []
    >([])

    useEffect(() => setSelectedQuays([]), [stopPlaceId])

    const quays = useMemo(
        () =>
            data?.stopPlace?.quays
                ?.filter(isNotNullOrUndefined)
                .map((quay, index) => ({
                    value: quay.id,
                    label: getPlatformLabel(
                        index,
                        quay.publicCode,
                        quay.description,
                        quay.journeyPatterns.map((jp) => jp?.directionType),
                    ),
                    transportModes: quay.stopPlace?.transportMode,
                }))
                .sort((a, b) => {
                    return a.label.localeCompare(b.label, 'no-NB', {
                        numeric: true,
                    })
                })
                .map((item, index, array) => {
                    if (!hasDuplicateInArrayByKey(array, item, 'label')) {
                        return item
                    } else {
                        return {
                            ...item,
                            label: item.label,
                        }
                    }
                }) || [],
        [data],
    )

    const getQuays = useCallback(() => quays, [quays])

    return { quays: getQuays, selectedQuays, setSelectedQuays }
}

export { useQuaySearch }
