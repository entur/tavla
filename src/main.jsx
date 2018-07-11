import React from 'react'
import ReactDOM from 'react-dom'
import './main.scss'
import {
    BrowserRouter,
} from 'react-router-dom'
import { routes } from './routes'
import Footer from './components/Footer'

ReactDOM.render(
    <div>
        <BrowserRouter>
            { routes }
        </BrowserRouter>
        <Footer />
    </div>,
    document.getElementById('app')
)
