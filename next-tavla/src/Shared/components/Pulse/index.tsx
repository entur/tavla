import classes from './styles.module.css'

function Pulse() {
    return (
        <div className="flexColumn alignCenter">
            <span className={classes.heartbeat} />
            <span className={classes.dot} />
        </div>
    )
}

export { Pulse }
