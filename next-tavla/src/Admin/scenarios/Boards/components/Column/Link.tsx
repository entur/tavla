import { useLink } from '../../hooks/useLink'

function Link({ bid }: { bid?: string }) {
    const link = useLink(bid)

    return <div>{link}</div>
}
export { Link }
