import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useCallback, useEffect, useState } from 'react'
import { TDefaults, TOrganizationID } from 'types/settings'
import { getDefaultsForOrganization } from './actions'
import { fetchCounties } from 'app/(admin)/utils/fetch'

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
        getDefaultsForOrganization(oid).then((defaults?: TDefaults) => {
            const defaultCounties = countiesList.filter((c) =>
                defaults?.counties?.includes(c.value),
            )

            setSelectedCounties(defaultCounties)
        })
    }, [countiesList, oid])

    const counties = useCallback(() => countiesList, [countiesList])

    return { counties, selectedCounties, setSelectedCounties }
}

export { useCountiesSearch }
