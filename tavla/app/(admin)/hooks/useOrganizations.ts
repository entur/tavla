import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useCallback, useEffect, useState } from 'react'
import { getOrganizationsForUser } from '../actions'
import { TOrganization } from 'types/settings'
import { organizationToDropdownItem } from '../edit/utils'

function useOrganizations(organization?: TOrganization) {
    const [organizationList, setOrganizationList] = useState<
        NormalizedDropdownItemType<TOrganization>[]
    >([])
    const [selectedOrganization, setSelectedOrganization] =
        useState<NormalizedDropdownItemType<TOrganization> | null>(
            organization ? organizationToDropdownItem(organization) : null,
        )

    const fetchOrganizations = useCallback(async () => {
        const res = await getOrganizationsForUser()
        setOrganizationList(
            res?.map((o) => ({
                value: o ?? undefined,
                label: o.name ?? '',
            })),
        )
    }, [])

    useEffect(() => {
        fetchOrganizations()
    }, [fetchOrganizations])

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
