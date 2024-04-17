'use client'
import { Button } from '@entur/button'
import { Checkbox } from '@entur/form'
import { Modal } from '@entur/modal'
import {
    Heading2,
    Label,
    LeadParagraph,
    ListItem,
    UnorderedList,
} from '@entur/typography'
import { ChangeEvent, useEffect, useState } from 'react'
import portrait_traveller from 'public/illustrations/portrait_traveller.svg'
import Image from 'next/image'
import { ExpandablePanel } from '@entur/expand'

const KEY = 'welcome_shown'

function Welcome() {
    const [isOpen, setIsOpen] = useState(false)

    const close = () => setIsOpen(false)

    const welcomeChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.checked) window.localStorage.setItem(KEY, 'true')
        else window.localStorage.removeItem(KEY)
    }

    useEffect(() => {
        if (window.innerWidth < 1000) return
        const welcomeShown = window.localStorage.getItem(KEY)
        if (!welcomeShown) setIsOpen(true)
    }, [])

    return (
        <Modal
            open={isOpen}
            onDismiss={close}
            size="large"
            closeLabel="Lukk dialog med informasjon om ny versjon av Tavla"
        >
            <div className="flex flex-col items-center">
                <div className="flex flex-row items-center justify-between gap-4 mb-8 ">
                    <div className="flex flex-col items-center justify-center ">
                        <Image src={portrait_traveller} alt="" />
                    </div>
                    <div className="flex flex-col">
                        <Heading2 as="h1">
                            Velkommen til ny versjon av Tavla!
                        </Heading2>
                        <LeadParagraph>
                            Tavla gjør det enkelt å opprette, dele og samarbeide
                            om avgangstavler for stoppesteder over hele Norge.
                            Opprett en bruker for å få tilgang til Tavla.
                        </LeadParagraph>
                        <div className="flex flex-col gap-1">
                            <ExpandablePanel title="Brukte du den gamle versjonen av Tavla?">
                                <UnorderedList className="flex flex-col gap-1">
                                    <ListItem>
                                        Nå må du lage en ny bruker.
                                    </ListItem>
                                    <ListItem>
                                        Alle tavlene dine må opprettes på nytt.
                                    </ListItem>
                                </UnorderedList>
                            </ExpandablePanel>

                            <ExpandablePanel title="Hva er nytt i denne versjonen?">
                                <UnorderedList className="flex flex-col gap-1">
                                    <ListItem>
                                        Oversikten over dine tavler er forbedret
                                        med søk og filter, slik at du enklere
                                        finner frem.
                                    </ListItem>
                                    <ListItem>
                                        Økt støtte for flere typer enheter – For
                                        eksempel eldre nettlesere, smart-TVer og
                                        lignende.
                                    </ListItem>
                                    <ListItem>
                                        Det er enklere å administere og
                                        samarbeide om flere tavler. Foreløpig
                                        har vi valgt å kalle dette
                                        “organisasjoner”. Her kan du sette
                                        standardinnstillinger for tavlene dine –
                                        for eksempel logo, tekststørrelse og
                                        hvilken info som skal vises. Det er også
                                        mulig å invitere andre til å samarbeide
                                        om organisasjonen.
                                    </ListItem>
                                </UnorderedList>
                            </ExpandablePanel>
                            <div className="flex flex-row items-center mt-8">
                                <Checkbox
                                    id="welcome"
                                    onChange={welcomeChange}
                                />
                                <Label htmlFor="welcome">
                                    Ikke vis denne informasjonen igjen
                                </Label>
                            </div>
                            <div>
                                <Button variant="primary" onClick={close}>
                                    Utforsk nye Tavla
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export { Welcome }
