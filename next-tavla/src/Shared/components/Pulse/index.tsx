import classes from './styles.module.css'

function Pulse() {
    return (
        <div className={classes.pulse}>
            <div className={classes.heartbeat} />
            <div className={classes.dot} />
        </div>
    )
}

export { Pulse }
