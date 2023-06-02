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
                        {
                            type: 'time',
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
                    <SortableColumns tile={settings.tiles[0]} />
                </SettingsDispatchContext.Provider>
            </Contrast>
        )
    }

    it('renders', () => {
        cy.mount(<TestComponent />)
    })

    it('contains three column to begin with', () => {
        cy.mount(<TestComponent />)
        cy.get('[data-cy="column"]').should('have.length', 3)
    })

    it('can add a new column', () => {
        cy.mount(<TestComponent />)
        cy.contains('label', 'Destinasjon').click()
        cy.get('button').contains('Legg til kolonne').click()
        cy.get('[data-cy="column"]').should('have.length', 4)
    })
})
