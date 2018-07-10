
import React from 'react'
import ReactDOM from 'react-dom'
import DepartureBoard from './containers/departureBoard/DepartureBoard'
import './main.scss'
import {
    BrowserRouter,
} from 'react-router-dom'
import { routes } from './routes'

ReactDOM.render(
    <BrowserRouter>
        { routes }
    </BrowserRouter>,
    document.getElementById('app')
)
