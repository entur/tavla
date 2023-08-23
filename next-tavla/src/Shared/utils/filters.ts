export function hasDuplicateInArrayByKey<Key extends string | number | symbol>(
    array: Record<Key, unknown>[],
    item: Record<Key, unknown>,
    field: Key,
    nullAllowed = false,
    undefinedAllowed = false,
) {
    const candidate = item[field]
    if (
        (!nullAllowed && candidate === null) ||
        (!undefinedAllowed && candidate === undefined)
    )
        return false

    return array.some(
        (filterItem) => filterItem[field] === candidate && filterItem !== item,
    )
}
