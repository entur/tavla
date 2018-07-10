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
        <div>
            <BrowserRouter>
                { routes }
            </BrowserRouter>
        </div>
        <Footer />
    </div>,
    document.getElementById('app')
)
