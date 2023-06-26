import { ExternalIcon } from '@entur/icons'
import Link from 'next/link'
import classes from './styles.module.css'

function StyledLink({ linkUrl, text }: { linkUrl: string; text: string }) {
    return (
        <Link className={classes.styledLink} href={linkUrl} target="_blank">
            {text}
            <ExternalIcon className={classes.tabIcon} />
        </Link>
    )
}

export { StyledLink }
