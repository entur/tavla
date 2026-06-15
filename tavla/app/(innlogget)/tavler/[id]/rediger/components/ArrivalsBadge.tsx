'use client'
import { StatusBadge } from '@entur/layout'
import { arrivalsBadge } from 'utils/tailwindColors'

export function ArrivalsBadge() {
    return (
        <StatusBadge
            variant="neutral"
            style={{
                backgroundColor: arrivalsBadge.fill,
                color: arrivalsBadge.text,
            }}
        >
            Ankomsttavle
        </StatusBadge>
    )
}
