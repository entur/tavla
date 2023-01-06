import React from 'react'
import classNames from 'classnames'
import { Map } from '../Map/Map'
import classes from './MapTile.module.scss'

interface Props {
    className?: string
}

const MapTile: React.FC<Props> = ({ className }) => (
    <div className={classNames(classes.MapTile, className)}>
        <Map />
    </div>
)

export { MapTile }
