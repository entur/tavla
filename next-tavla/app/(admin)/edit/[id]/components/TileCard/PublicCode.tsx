import classes from './styles.module.css'

function PublicCode({ publicCode }: { publicCode: string | null }) {
    return <div className={classes.publicCode}>{publicCode}</div>
}

export { PublicCode }
