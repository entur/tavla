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
    console.log('org', organization)
    console.log('selected', selectedOrganization)

    useEffect(() => {
        getOrganizationsForUser().then((res) => {
            setOrganizationList(
                res?.map((o) => ({
                    value: o ?? undefined,
                    label: o.name ?? '',
                })),
            )
        })
    }, [])

    const organizations = useCallback(
        () => organizationList,
        [organizationList],
    )

    return { organizations, selectedOrganization, setSelectedOrganization }
}

export { useOrganizations }
