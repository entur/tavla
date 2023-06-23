import { ExternalIcon } from '@entur/icons'
import Link from 'next/link'
import classes from './styles.module.css'

function StyledLink(props: { documentId: string; text: string }) {
    return (
        <Link
            className={classes.styledLink}
            href={'/' + props.documentId}
            target="_blank"
        >
            {props.text}
            <ExternalIcon className={classes.tabIcon} />
        </Link>
    )
}

export { StyledLink }
