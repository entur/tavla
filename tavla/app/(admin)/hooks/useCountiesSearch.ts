import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useCallback, useEffect, useState } from 'react'
import { fetchCounties } from 'app/(admin)/utils/fetch'

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
        return uniqueCounties.sort((a, b) =>
            a.label.localeCompare(b.label, 'nb'),
        )
    }, [countiesList, selectedCounties])

    return { counties, selectedCounties, setSelectedCounties }
}

export { useCountiesSearch }
