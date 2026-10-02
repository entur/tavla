import type { NormalizedDropdownItemType } from '@entur/dropdown'
import { sortCountiesAlphabetically } from 'app/_components/TileSelector/utils'
import { fetchCounties } from 'app/(innlogget)/utils/fetch'
import { useCallback, useEffect, useState } from 'react'

function useCountyFilter() {
    const [counties, setCounties] = useState<NormalizedDropdownItemType[]>([])
    const [selectedCountyId, setSelectedCountyId] = useState<string | null>(
        null,
    )

    useEffect(() => {
        fetchCounties().then((res) =>
            setCounties(sortCountiesAlphabetically(res)),
        )
    }, [])

    const selectCounty = useCallback(
        (id: string) => setSelectedCountyId(id),
        [],
    )

    const clearSelection = useCallback(() => setSelectedCountyId(null), [])

    return {
        counties,
        selectedCountyId,
        selectCounty,
        clearSelection,
    }
}

export { useCountyFilter }
