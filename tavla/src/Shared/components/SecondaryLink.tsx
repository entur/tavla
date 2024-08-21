import { ExternalIcon, LinkIcon } from '@entur/icons'
import Link from 'next/link'

function SecondaryLink({
    href,
    external = false,
    text,
}: {
    href: string
    external?: boolean
    text: string
}) {
    return (
        <Link
            className="eds-button eds-button--variant-secondary eds-button--trailing-icon"
            style={{ padding: '0.6rem 1rem' }} // Override Entur a tag styling
            href={href}
            target={external ? '_blank' : '_self'}
        >
            {text}
            {external ? <ExternalIcon /> : <LinkIcon />}
        </Link>
    )
}

export { SecondaryLink }
