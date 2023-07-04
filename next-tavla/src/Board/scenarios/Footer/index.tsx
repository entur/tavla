import classes from './styles.module.css'

function FooterText({ text }: { text?: string }) {
    if (!text) return null
    return <div className={classes.footerText}>{text}</div>
}

export { FooterText }
