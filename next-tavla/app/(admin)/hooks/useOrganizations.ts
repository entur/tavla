import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useCallback, useEffect, useState } from 'react'
import { getOrganizationsForUser } from '../actions'

function useOrganizations() {
    const [organizationList, setOrganizationList] = useState<
        NormalizedDropdownItemType<string>[]
    >([])
    const [selectedOrganization, setSelectedOrganization] =
        useState<NormalizedDropdownItemType | null>(null)

    useEffect(() => {
        fetchOrganizations()
    }, [])

    function fetchOrganizations() {
        getOrganizationsForUser().then((res) => {
            setOrganizationList(
                res?.map((o) => ({ value: o.id ?? '', label: o.name ?? '' })),
            )
        })
    }
    const organizations = useCallback(
        () => organizationList,
        [organizationList],
    )

    return {
        organizations,
        selectedOrganization,
        setSelectedOrganization,
        fetchOrganizations,
    }
}

export { useOrganizations }
