'use client'
import { BaseExpand } from '@entur/expand'
import { DownArrowIcon, UpArrowIcon } from '@entur/icons'
import { ListItem, Paragraph, UnorderedList } from '@entur/typography'
import { useState } from 'react'

function ExpandableInformation() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div>
            <div
                className={`flex flex-row justify-between items-center px-6  py-4 bg-blue80 w-full cursor-pointer ${
                    isOpen ? 'rounded-t' : 'rounded'
                }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Paragraph className="font-bold" margin="none">
                    Hva kan du gjøre med Tavla om du logger inn?
                </Paragraph>
                {isOpen ? <UpArrowIcon /> : <DownArrowIcon />}
            </div>
            <BaseExpand
                open={isOpen}
                className="bg-blue90 px-6  py-4 rounded-b"
            >
                <UnorderedList className="space-y-3 gap-1 pl-6">
                    <ListItem>
                        Vise stoppestedene hver for seg eller samlet i én liste
                    </ListItem>
                    <ListItem>
                        Vise gangavstand fra tavlen til stoppested(ene)
                    </ListItem>
                    <ListItem>
                        Legge til en infomelding nederst i tavlen
                    </ListItem>
                    <ListItem>Endre fargetema (lys eller mørk modus)</ListItem>
                    <ListItem>Endre tekststørrelse</ListItem>
                    <ListItem>
                        Gi andre tilgang til å administrere tavlen
                    </ListItem>
                    <ListItem>
                        Opprette så mange tavler du vil og samle disse i ulike
                        organisasjoner (mapper)
                    </ListItem>
                </UnorderedList>
            </BaseExpand>
        </div>
    )
}

export { ExpandableInformation }
