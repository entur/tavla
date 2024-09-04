'use client'
import { BaseExpand } from '@entur/expand'
import { DownArrowIcon, UpArrowIcon } from '@entur/icons'
import { Heading5, ListItem, Paragraph, UnorderedList } from '@entur/typography'
import { useState } from 'react'

function ExpandableInformation() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div>
            <div className="flex flex-row">
                <div
                    className={`flex justify-between items-center px-6  py-4 bg-blue80 w-full ${
                        isOpen ? 'rounded-t' : 'rounded'
                    }`}
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ cursor: 'pointer' }}
                >
                    <Paragraph className="font-bold" margin="none">
                        Hva du kan gjøre med Tavla om du logger inn
                    </Paragraph>
                    {isOpen ? <UpArrowIcon /> : <DownArrowIcon />}
                </div>
            </div>
            <BaseExpand open={isOpen}>
                <div className="bg-blue90 px-6  py-4 rounded-b">
                    <UnorderedList className="space-y-3 flex flex-col gap-1 pl-6">
                        <ListItem>Endre tekststørrelse</ListItem>
                        <ListItem>
                            Legge til en info-melding nederst i tavlen
                        </ListItem>
                        <ListItem>
                            Endre fargetema (lys eller mørk modus)
                        </ListItem>
                        <ListItem>
                            Legge inn adressen som tavlen står på og vise
                            gåavstand fra tavlen til stoppested(ene)
                        </ListItem>
                        <ListItem>
                            Opprette så mange tavler du vil og samle disse i
                            ulike organisasjoner (mapper)
                        </ListItem>
                        <ListItem>
                            Gi andre tilgang til å administrere tavlen
                        </ListItem>
                    </UnorderedList>
                </div>
            </BaseExpand>
        </div>
    )
}

export { ExpandableInformation }
