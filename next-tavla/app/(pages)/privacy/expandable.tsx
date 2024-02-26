'use client'
import { ExpandablePanel } from '@entur/expand'
import { Heading3 } from '@entur/typography'

function Expandable() {
    return (
        <div className="flexColumn justifyCenter alignCenter p-2">
            <ExpandablePanel title="Informasjonskapsler">
                <Heading3>Nødvendige cookies</Heading3>
                <ul>
                    <li>Leveradør: Auth0</li>
                    <li>Formål: Nødvendig for å kunne logge inn</li>
                </ul>
            </ExpandablePanel>
            <ExpandablePanel title="Analyseverktøy">
                <Heading3>Nødvendige cookies</Heading3>
                <ul>
                    <li>Leveradør: Auth0</li>
                    <li>Formål: Nødvendig for å kunne logge inn</li>
                </ul>
            </ExpandablePanel>
        </div>
    )
}

export { Expandable }
