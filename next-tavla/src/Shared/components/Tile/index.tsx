import classNames from 'classnames'
import classes from './styles.module.css'
import React from 'react'

function Tile({
    className,
    children,
    ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
    const cn = classNames(classes.tile, className)
    return (
        <div className={cn} {...rest}>
            {children}
        </div>
    )
}

export { Tile }
