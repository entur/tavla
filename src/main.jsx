import React from 'react'
import ReactDOM from 'react-dom'
import './main.scss'
import {
    BrowserRouter,
} from 'react-router-dom'
import { routes } from './routes'
import Footer from './components/Footer'
import Header from './components/header/Header'

ReactDOM.render(
    <div className="app">
        <Header />
        <BrowserRouter>
            { routes }
        </BrowserRouter>
        <Footer />
    </div>,
    document.getElementById('app')
)
