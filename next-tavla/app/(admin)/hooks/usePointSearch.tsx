import { NormalizedDropdownItemType } from '@entur/dropdown'
import { fetchPoint } from 'Admin/utils/fetch'
import { useCallback, useState } from 'react'
import { TLocation } from 'types/meta'

function usePointSearch() {
    const [selectedPoint, setSelectedPoint] =
        useState<NormalizedDropdownItemType<TLocation> | null>(null)

    const items = useCallback(
        async (search: string) => await fetchPoint(search),
        [],
    )

    return { pointItems: items, selectedPoint, setSelectedPoint }
}

export { usePointSearch }
