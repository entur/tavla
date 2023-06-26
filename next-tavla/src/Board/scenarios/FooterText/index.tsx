import classes from './styles.module.css'

function FooterText({ text }: { text: string }) {
    return <div className={classes.footerText}>{text}</div>
}

export { FooterText }
