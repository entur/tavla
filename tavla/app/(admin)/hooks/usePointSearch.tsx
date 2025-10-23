import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useCallback, useState } from 'react'
import { LocationDB } from 'types/db-types/boards'
import { locationToDropdownItem } from '../tavler/[id]/utils'
import { fetchPoints } from '../utils/fetch'

function usePointSearch(location?: LocationDB) {
    const [selectedPoint, setSelectedPoint] =
        useState<NormalizedDropdownItemType<LocationDB> | null>(
            location ? locationToDropdownItem(location) : null,
        )

    const items = useCallback(
        async (search: string) => await fetchPoints(search),
        [],
    )

    return { pointItems: items, selectedPoint, setSelectedPoint }
}

export { usePointSearch }
