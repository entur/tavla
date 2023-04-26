import React from 'react'
import classes from './PulsatingDot.module.scss'

function PulsatingDot() {
    return (
        <div className={classes.PulsatingDot}>
            <div className={classes.OuterCircle}></div>
            <div className={classes.InnerCircle}></div>
        </div>
    )
}

export { PulsatingDot }
