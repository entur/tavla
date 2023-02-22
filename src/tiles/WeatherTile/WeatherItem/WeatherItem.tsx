import React from 'react'
import classes from './WeatherItem.module.scss'

interface Props {
    children: React.ReactNode
}

const WeatherItem: React.FC<Props> = ({ children }) => (
    <div className={classes.WeatherItem}>{children}</div>
)

export { WeatherItem }
