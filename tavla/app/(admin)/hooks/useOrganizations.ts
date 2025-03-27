import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useCallback, useEffect, useState } from 'react'
import { getOrganizationsForUser } from '../actions'
import { TOrganization } from 'types/settings'
import { organizationToDropdownItem } from '../edit/utils'
import { FolderIcon } from '@entur/icons'

const NO_FOLDER = {
    value: {},
    label: 'Ingen mappe',
}

function useOrganizations(organization?: TOrganization) {
    const [organizationList, setOrganizationList] = useState<
        NormalizedDropdownItemType<TOrganization>[]
    >([])

    const [selectedOrganization, setSelectedOrganization] =
        useState<NormalizedDropdownItemType<TOrganization> | null>(
            organization ? organizationToDropdownItem(organization) : NO_FOLDER,
        )

    useEffect(() => {
        getOrganizationsForUser().then((res) => {
            const organizations = res?.map((o) => ({
                value: o ?? undefined,
                label: o.name ?? '',
                icons: [FolderIcon],
            }))
            setOrganizationList([...organizations, NO_FOLDER])
        })
    }, [])

    const organizations = useCallback(
        () => organizationList,
        [organizationList],
    )

    return { organizations, selectedOrganization, setSelectedOrganization }
}

export { useOrganizations }
