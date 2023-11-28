import classes from './styles.module.css'
function OrganizationFooter({ description }: { description: string }) {
    return (
        <footer className={classes.footer}>
            <p>{description}</p>
        </footer>
    )
}

export { OrganizationFooter }
