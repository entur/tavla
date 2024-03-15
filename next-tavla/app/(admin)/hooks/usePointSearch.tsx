import { NormalizedDropdownItemType } from '@entur/dropdown'
import { fetchPoints } from 'Admin/utils/fetch'
import { useCallback, useState } from 'react'
import { TLocation } from 'types/meta'
import { locationToDropdownItem } from '../edit/utils'

function usePointSearch(location?: TLocation) {
    const [selectedPoint, setSelectedPoint] =
        useState<NormalizedDropdownItemType<TLocation> | null>(
            location ? locationToDropdownItem(location) : null,
        )

    const items = useCallback(
        async (search: string) => await fetchPoints(search),
        [],
    )

    return { pointItems: items, selectedPoint, setSelectedPoint }
}

export { usePointSearch }
