import { LeadParagraph } from '@entur/typography'
import classes from './styles.module.css'

function FooterText({ text }: { text?: string }) {
    if (text) {
        return <div className={classes.footerText}>{text}</div>
    }
    return <></>
}

export { FooterText }
