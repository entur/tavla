import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useCallback, useState } from 'react'
import { TLocation } from 'types/meta'
import { locationToDropdownItem } from '../edit/utils'
import { fetchPoints } from '../utils/fetch'

function usePointSearch(location?: TLocation) {
    const [selectedPoint, setSelectedPoint] =
        useState<NormalizedDropdownItemType<TLocation | unknown> | null>(
            location ? locationToDropdownItem(location) : null,
        )

    const items = useCallback(
        async (search: string) => await fetchPoints(search),
        [],
    )

    return { pointItems: items, selectedPoint, setSelectedPoint }
}

export { usePointSearch }
