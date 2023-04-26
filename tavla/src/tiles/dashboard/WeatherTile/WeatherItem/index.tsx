import React from 'react'
import classes from './WeatherItem.module.scss'

function WeatherItem({ children }: { children: React.ReactNode }) {
    return <div className={classes.WeatherItem}>{children}</div>
}

export { WeatherItem }
