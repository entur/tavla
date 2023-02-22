import React from 'react'
import classes from './WeatherItemValue.module.scss'

function WeatherItemValue({ children }: { children: React.ReactNode }) {
    return <div className={classes.WeatherItemValue}>{children}</div>
}

export { WeatherItemValue }
