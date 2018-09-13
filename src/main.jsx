import React from 'react'
import ReactDOM from 'react-dom'
import '@entur/fonts/index.css'
import '@entur/component-library/lib/index.css'
import './main.scss'
import {
    BrowserRouter,
} from 'react-router-dom'
import { routes } from './routes'

ReactDOM.render(
    <div className="app">
        <BrowserRouter>
            { routes }
        </BrowserRouter>
    </div>,
    document.getElementById('app')
)
