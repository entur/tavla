import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { TOrganization } from 'types/settings'

function hash(seq: string) {
    const first = seq.charCodeAt(0)
    const last = seq.charCodeAt(seq.length - 1)
    const coefficient = first << last
    return seq
        .split('')
        .reduce((acc, curr) => acc + curr.charCodeAt(0) * coefficient, 0)
}

export function colorsFromHash(
    name: string,
    saturation?: number,
    lightness?: number,
) {
    return `hsl(${hash(name) % 360}, ${saturation ?? 80}%, ${lightness ?? 40}%)`
}

export function sortArrayByOverlap<T>(toBeSorted: T[], overlapArray: T[]): T[] {
    const overlapSet = new Set(overlapArray)

    return toBeSorted.sort((a, b) => {
        const aInOverlap = overlapSet.has(a)
        const bInOverlap = overlapSet.has(b)

        if (aInOverlap && !bInOverlap) {
            return -1
        } else if (!aInOverlap && bInOverlap) {
            return 1
        }
        return 0
    })
}

export function useDropdownItems(organizations: TOrganization[]) {
    const router = useRouter()
    const dropdownItems = [
        {
            label: 'Mine tavler',
            value: 'private',
        },
    ].concat(
        organizations.map((org) => {
            return {
                label: org.name + ' sine tavler',
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
