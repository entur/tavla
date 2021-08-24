import { Operator } from '@entur/sdk/lib/mobility/types'

import service from '../service'

export default async function fetchOperators(
    ids?: string[],
): Promise<Operator[]> {
    const operators: Operator[] = await service.mobility.getOperators()

    if (ids === undefined || ids.length === 0) {
        return operators
    }

    return operators.filter((op) => ids.includes(op.id))
}
