'use client'
import { useLink } from '../../../../../src/Shared/hooks/useLink'
import { Column } from './Column'

function Link({ bid }: { bid?: string }) {
    const link = useLink(bid)
    if (!link) return <div />

    return <Column column="url">{link}</Column>
}
export { Link }
