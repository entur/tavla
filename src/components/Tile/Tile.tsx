import React from 'react'
import classNames from 'classnames'
import classes from './Tile.module.scss'

interface TileProps {
    children: React.ReactNode
    className?: string
}

const Tile: React.FC<TileProps> = ({ className, children }) => (
    <div className={classNames(classes.Tile, className)} tabIndex={0}>{children}</div>
)

export { Tile }
