import { NormalizedDropdownItemType } from '@entur/dropdown'

export function removeDuplicates(data: NormalizedDropdownItemType[]) {
    const unique: NormalizedDropdownItemType[] = []
    data.forEach((item) => {
        if (!unique.some((uniqueItem) => uniqueItem.value === item.value)) {
            unique.push(item)
        }
    })
    return unique
}
