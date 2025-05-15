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
        return [
            ...countiesList
                .filter(
                    (county) =>
                        !selectedCounties.some(
                            (selected) => selected.value === county.value,
                        ),
                )
                .sort((a, b) => a.label.localeCompare(b.label, 'nb')),
            ...selectedCounties.sort((a, b) =>
                a.label.localeCompare(b.label, 'nb'),
            ),
        ]
    }, [countiesList, selectedCounties])

    return { counties, selectedCounties, setSelectedCounties }
}

export { useCountiesSearch }
