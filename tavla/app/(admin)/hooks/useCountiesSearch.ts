import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useCallback, useEffect, useState } from 'react'
import { fetchCounties } from 'app/(admin)/utils/fetch'
import { sortCountiesAlphabetically } from '../components/TileSelector/utils'

function useCountiesSearch() {
    const [countiesList, setCountiesList] = useState<
        NormalizedDropdownItemType[]
    >([])
    const [selectedCounties, setSelectedCounties] = useState<
        NormalizedDropdownItemType[]
    >([])

    useEffect(() => {
        fetchCounties().then((res) => setCountiesList(res))
    }, [])

    const counties = useCallback(() => {
        const uniqueCounties = [
            ...countiesList,
            ...selectedCounties.filter(
                (selected) =>
                    !countiesList.some(
                        (county) => county.value === selected.value,
                    ),
            ),
        ]
        return sortCountiesAlphabetically(uniqueCounties)
    }, [countiesList, selectedCounties])

    return { counties, selectedCounties, setSelectedCounties }
}

export { useCountiesSearch }
