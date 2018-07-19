import React from 'react'

const LandingPage = (props) => (
    <div className="laning-page-wrapper">
        <div className="title-container">
            <h1>LOGO TAVLA</h1>
            <p>Velkommen til Entur Tavla, sanntidstavla du kan tilpasse etter dine behov.</p>
        </div>
        <div className="content-container">
            <button onClick={() => props.addLocation()}>Finn min posisjon</button>
            <p>For å kunne opprette en tavle der du er, trenger vi din lokasjon</p>
        </div>
    </div>
)

export default LandingPage
