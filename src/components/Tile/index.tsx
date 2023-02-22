import React from 'react'
import classNames from 'classnames'
import classes from './Tile.module.scss'

function Tile({
    className,
    children,
}: {
    className?: string
    children: React.ReactNode
}) {
    return <div className={classNames(classes.Tile, className)}>{children}</div>
}

export { Tile }
