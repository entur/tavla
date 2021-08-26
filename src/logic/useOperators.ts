import { useEffect, useState } from 'react'
import { Operator } from '@entur/sdk/lib/mobility/types'

import service from '../service'
import { ALL_ACTIVE_OPERATOR_IDS } from '../constants'

async function fetchOperators(): Promise<Operator[]> {
    return service.mobility.getOperators()
}

export default function useOperators(): Operator[] {
    const [operators, setOperators] = useState<Operator[]>([])

    useEffect(() => {
        fetchOperators()
            .then((data) => {
                const active = Object.values(ALL_ACTIVE_OPERATOR_IDS)
                setOperators(
                    data.filter((operator) => active.includes(operator.id)),
                )
            })
            // eslint-disable-next-line no-console
            .catch((error) => console.error(error))
    }, [])

    return operators
}
