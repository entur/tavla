import classNames from 'classnames'
import classes from './styles.module.css'
import React from 'react'

function Tile({
    className,
    children,
    ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={classNames(classes.tile, className)} {...rest}>
            {children}
        </div>
    )
}

export { Tile }
