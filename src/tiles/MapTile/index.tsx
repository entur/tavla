import React from 'react'
import classNames from 'classnames'
import { Map } from 'components/Map'
import classes from './MapTile.module.scss'

function MapTile({ className }: { className?: string }) {
    return (
        <div className={classNames(classes.MapTile, className)}>
            <Map />
        </div>
    )
}

export { MapTile }
