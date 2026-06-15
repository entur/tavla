import type { NormalizedDropdownItemType } from '@entur/dropdown'
import { locationToDropdownItem } from 'app/(innlogget)/tavler/[id]/utils'
import { fetchPoints } from 'app/(innlogget)/utils/fetch'
import { useCallback, useState } from 'react'
import type { LocationDB } from 'types/db-types/boards'

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
