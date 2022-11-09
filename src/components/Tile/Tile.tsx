import React from 'react'
import classNames from 'classnames'
import css from './Tile.module.scss'

interface TileProps {
    children: React.ReactNode
    className?: string
}

const Tile: React.FC<TileProps> = ({ className, children }) => (
    <div className={classNames(css.tile, className)}>{children}</div>
)

export { Tile }
