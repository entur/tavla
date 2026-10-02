import type { NormalizedDropdownItemType } from '@entur/dropdown'
import { sortCountiesAlphabetically } from 'app/_components/TileSelector/utils'
import { fetchCounties } from 'app/(innlogget)/utils/fetch'
import { useEffect, useState } from 'react'

function useCountyFilter() {
    const [counties, setCounties] = useState<NormalizedDropdownItemType[]>([])
    const [selectedCountyIds, setSelectedCountyIds] = useState<string[]>([])

    useEffect(() => {
        fetchCounties().then((res) =>
            setCounties(sortCountiesAlphabetically(res)),
        )
    }, [])

    const toggleCounty = (id: string) => {
        setSelectedCountyIds((ids) =>
            ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id],
        )
    }

    return {
        counties,
        selectedCountyIds,
        toggleCounty,
    }
}

export { useCountyFilter }
