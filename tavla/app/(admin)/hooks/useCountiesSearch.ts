import { NormalizedDropdownItemType } from '@entur/dropdown'
import { fetchCounties } from 'app/(admin)/utils/fetch'
import { useCallback, useEffect, useState } from 'react'
import { sortCountiesAlphabetically } from '../components/TileSelector/utils'

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
