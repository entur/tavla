import type { NormalizedDropdownItemType } from '@entur/dropdown'
import { sortCountiesAlphabetically } from 'app/_components/table_editor/TileSelector/utils'
import { fetchCounties } from 'app/(innlogget)/utils/fetch'
import { useCallback, useEffect, useState } from 'react'

function useCountiesSearch() {
    const [countiesList, setCountiesList] = useState<
        NormalizedDropdownItemType[]
    >([])
    const [selectedCounties, setSelectedCounties] = useState<
        NormalizedDropdownItemType[]
    >([])

    useEffect(() => {
        fetchCounties().then((res) =>
            setCountiesList(sortCountiesAlphabetically(res)),
        )
    }, [])

    const counties = useCallback(() => countiesList, [countiesList])

    return { counties, selectedCounties, setSelectedCounties }
}

export { useCountiesSearch }
