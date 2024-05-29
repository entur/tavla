import { NormalizedDropdownItemType } from '@entur/dropdown'
import { getOrganizationsForUser } from 'app/(admin)/actions'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { TOrganization, TOrganizationID } from 'types/settings'
import { hasDuplicateInArrayByKey } from 'utils/filters'
import { isNotNullOrUndefined } from 'utils/typeguards'

function useOrganizationSearch(oid?: TOrganizationID) {
    const [userOrganizations, setUserOrganizations] = useState<TOrganization[]>(
        [],
    )
    const [selectedOrganization, setSelectedOrganization] =
        useState<NormalizedDropdownItemType | null>(null)

    useEffect(() => {
        const fetchOrganizations = async () => {
            const organizations = await getOrganizationsForUser()
            setUserOrganizations(
                organizations?.filter(isNotNullOrUndefined) || [],
            )
        }

        fetchOrganizations()
    }, [])

    useEffect(() => setSelectedOrganization(null), [oid])

    const organizations = useMemo(
        () =>
            userOrganizations
                .map((organization) => ({
                    value: organization.id ?? '',
                    label: organization.name ?? '',
                }))
                .map((item, index, array) => {
                    if (!hasDuplicateInArrayByKey(array, item, 'label')) {
                        return item
                    } else {
                        return {
                            ...item,
                            label: item.label,
                        }
                    }
                }),
        [userOrganizations],
    )

    const getOrganizations = useCallback(
        () => [{ value: undefined, label: 'Mine tavler' }, ...organizations],
        [organizations],
    )

    return {
        organizations: getOrganizations,
        selectedOrganization,
        setSelectedOrganization,
    }
}

export { useOrganizationSearch }
