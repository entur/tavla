'use client'
import { BaseExpand } from '@entur/expand'
import { DownArrowIcon, UpArrowIcon } from '@entur/icons'
import { ListItem, Paragraph, UnorderedList } from '@entur/typography'
import { useState } from 'react'

function ExpandableInformation() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div>
            <button
                className={`flex w-full cursor-pointer flex-row items-center justify-between bg-blue80 px-6 py-4 ${
                    isOpen ? 'rounded-t' : 'rounded'
                }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Paragraph className="font-bold" margin="none">
                    Hva kan du gjøre med Tavla om du logger inn?
                </Paragraph>
                {isOpen ? <UpArrowIcon /> : <DownArrowIcon />}
            </button>
            <BaseExpand open={isOpen} className="rounded-b bg-blue90 px-6 py-4">
                <UnorderedList className="gap-1 space-y-3 pl-6">
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
                        mapper
                    </ListItem>
                </UnorderedList>
            </BaseExpand>
        </div>
    )
}

export { ExpandableInformation }
