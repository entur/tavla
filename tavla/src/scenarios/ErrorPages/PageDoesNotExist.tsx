import React, { useCallback } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import duerLight from 'assets/images/duer@2x.png'
import { Navbar } from 'scenarios/Navbar'
import { ErrorWrapper } from 'scenarios/ErrorPages/components/ErrorWrapper'

function PageDoesNotExist() {
    const navigate = useNavigate()
    const callback = useCallback(
        (event: React.SyntheticEvent<HTMLButtonElement>): void => {
            event.preventDefault()
            navigate(`/`)
        },
        [navigate],
    )
    return (
        <>
            <Helmet>
                <title>Siden finnes ikke - Tavla - Entur</title>
            </Helmet>
            <Navbar />
            <div>
                <ErrorWrapper
                    title="Her var det tomt!"
                    message="Det finnes ingen tavle på denne url-en. Du kan lage en avgangstavle ved å trykke på knappen nedenfor."
                    image={duerLight}
                    callbackMessage="Gå tilbake"
                    callback={callback}
                />
            </div>
        </>
    )
}

export { PageDoesNotExist }
