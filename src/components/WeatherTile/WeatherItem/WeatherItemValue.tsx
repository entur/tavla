import React from 'react'
import classes from './WeatherItemValue.module.scss'

interface Props {
    children: React.ReactNode
}

const WeatherItemValue: React.FC<Props> = ({ children }) => (
    <div className={classes.WeatherItemValue}>{children}</div>
)

export { WeatherItemValue }
