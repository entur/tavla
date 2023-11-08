import { NormalizedDropdownItemType } from '@entur/dropdown'
import { getOrganizationsForUserRequest } from 'Admin/utils/fetch'
import { useCallback, useEffect, useState } from 'react'

function useOrganizations() {
    const [organizationList, setOrganizationList] = useState<
        NormalizedDropdownItemType[]
    >([])
    const [selectedOrganization, setSelectedOrganization] =
        useState<NormalizedDropdownItemType | null>(null)

    useEffect(() => {
        getOrganizationsForUserRequest().then((res) => setOrganizationList(res))
    }, [])

    const organizations = useCallback(
        () => organizationList,
        [organizationList],
    )

    return { organizations, selectedOrganization, setSelectedOrganization }
}

export { useOrganizations }
