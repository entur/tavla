import { Contrast } from '@entur/layout'
import React, { useReducer } from 'react'
import {
    SettingsDispatchContext,
    settingsReducer,
} from 'scenarios/Admin/reducer'
import { SortableColumns } from 'scenarios/Admin/components/SortableColumns'

describe('<AddColumn />', () => {
    const TestComponent = () => {
        const [settings, dispatch] = useReducer(settingsReducer, {
            tiles: [
                {
                    columns: [
                        {
                            type: 'platform',
                        },
                        {
                            type: 'line',
                        },
                    ],
                    placeId: 'NSR:StopPlace:60066',
                    type: 'stop_place',
                    uuid: '123',
                },
            ],
        })

        return (
            <Contrast>
                <SettingsDispatchContext.Provider value={dispatch}>
                    {settings.tiles.map((tile) =>
                        tile.type === 'stop_place' ? (
                            <SortableColumns key={tile.uuid} tile={tile} />
                        ) : null,
                    )}
                </SettingsDispatchContext.Provider>
            </Contrast>
        )
    }

    it('renders', () => {
        cy.mount(<TestComponent />)
    })

    it('contains three column to begin with', () => {
        cy.mount(<TestComponent />)
        cy.findByRole('button', { name: /velg kolonner/i }).click()
        cy.get('[data-cy="column"]').should('have.length', 2)
    })

    it('can add a new column', () => {
        cy.mount(<TestComponent />)
        cy.findByRole('button', { name: /velg kolonner/i }).click()

        cy.get('[data-cy="column"]')
            .should('have.length', 2)
            .should('not.include.text', 'Destinasjon')

        cy.findByRole('button', { name: /destinasjon/i }).click()
        cy.get('[data-cy="column"]')
            .should('have.length', 3)
            .should('include.text', 'Destinasjon')
    })
})
