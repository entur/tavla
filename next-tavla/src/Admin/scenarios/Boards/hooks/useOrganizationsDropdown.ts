import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { TOrganization } from 'types/settings'

export function useOrganizationsDropdown(organizations: TOrganization[]) {
    const router = useRouter()
    const dropdownItems = [
        {
            label: 'Mine tavler',
            value: 'private',
        },
    ].concat(
        organizations.map((org) => {
            return {
                label: org.name + ' tavler',
                value: org.id,
            } as NormalizedDropdownItemType
        }),
    )
    const [selectedOrganization, setSelectedOrganization] =
        useState<NormalizedDropdownItemType | null>(
            router.pathname === '/boards'
                ? (dropdownItems[0] as NormalizedDropdownItemType)
                : (dropdownItems.find(
                      (org) => org.value === router.query.id,
                  ) as NormalizedDropdownItemType),
        )

    return { dropdownItems, selectedOrganization, setSelectedOrganization }
}
