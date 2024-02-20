import { NormalizedDropdownItemType } from '@entur/dropdown'
import { fetchCounties } from 'Admin/utils/fetch'
import { useCallback, useEffect, useState } from 'react'
import { TCountyID, TOrganizationID } from 'types/settings'
import { getCountiesForOrganization } from './actions'

function useCountiesSearch(oid?: TOrganizationID) {
    const [countiesList, setCountiesList] = useState<
        NormalizedDropdownItemType[]
    >([])
    const [selectedCounties, setSelectedCounties] = useState<
        NormalizedDropdownItemType[]
    >([])

    useEffect(() => {
        fetchCounties().then((res) => setCountiesList(res))
    }, [])

    useEffect(() => {
        getCountiesForOrganization(oid).then((counties?: TCountyID[]) => {
            const defaultCounties = countiesList.filter((c) =>
                counties?.includes(c.value),
            )

            setSelectedCounties(defaultCounties)
        })
    }, [countiesList, oid])

    const counties = useCallback(() => countiesList, [countiesList])

    console.log(selectedCounties)
    return { counties, selectedCounties, setSelectedCounties }
}

export { useCountiesSearch }
