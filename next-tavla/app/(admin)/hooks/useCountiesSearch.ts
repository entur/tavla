import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useCallback, useEffect, useState } from 'react'
import { TOrganization, TOrganizationID } from 'types/settings'
import { fetchCounties } from 'app/(admin)/utils/fetch'
import { getOrganizationIfUserHasAccess } from 'app/(admin)/actions'

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
        getOrganizationIfUserHasAccess(oid).then((o?: TOrganization) => {
            if (!o) return setSelectedCounties([])
            const defaultCounties = countiesList.filter((c) =>
                o.defaults?.counties?.includes(c.value),
            )
            setSelectedCounties(defaultCounties)
        })
    }, [countiesList, oid])

    const counties = useCallback(() => countiesList, [countiesList])

    return { counties, selectedCounties, setSelectedCounties }
}

export { useCountiesSearch }
