import React from 'react'

import Content from './Content'
import Footer from './Footer'
import Header from './Header'

import './styles.scss'

const JCDecaux = (): JSX.Element | null => (
    <div className="wrapper">
        <Header />
        <Content />
        <Footer />
    </div>
)

export default JCDecaux
