import { NormalizedDropdownItemType } from '@entur/dropdown'
import { TLocation } from 'types/meta'

export function locationToDropdownItem(
    location: TLocation,
): NormalizedDropdownItemType<TLocation> {
    return {
        label: location.name ?? '',
        value: location,
    }
}
