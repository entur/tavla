import { BusIcon } from '@entur/icons'
import React from 'react'

import './styles.scss'

function BusTile(): JSX.Element | null {

    //Dataen under er hardkodet, her kommer det nok en Map etterhvert 

    return (
        <>
            <div style={{marginBottom:"2rem"}}>
             <text style={{fontSize:"2.5rem"}}>Neste buss</text>
            </div>
            <div className="available-vehicles-box" style={{width:"90%", display:"inline-block", height:"23%", marginBottom:"10%", padding: "1rem"}}>
                <div className="row-box">
                    <div className="red-box">
                        <BusIcon color="white" style={{height:"4rem", width:"4rem", marginLeft:"1rem"}}/>
                        <p className='lineNumber'>510</p>
                    </div>
                    <text className='stopPlace'>Bøleråsen</text>
                    <text className='time'>Nå</text>
                </div>

                <div className="row-box">
                    <div className="red-box">
                        <BusIcon color="white" style={{height:"4rem", width:"4rem", marginLeft:"1rem"}}/>
                        <p className='lineNumber'>520</p>
                    </div>
                    <text className='stopPlace'>Vinterbro</text>
                    <text className='time'>5 min</text>
                </div>

                <div className="row-box">
                    <div className="red-box">
                        <BusIcon color="white" style={{height:"4rem", width:"4rem", marginLeft:"1rem"}}/>
                        <p className='lineNumber'>523</p>
                    </div>
                    <text className='stopPlace'>Tusenfryd</text>
                    <text className='time'>13:22</text>
                </div>

            </div>
        </>
    ) 
}

interface Props {
    platform?: string
    type?: string
}


export default BusTile

