import { Contrast } from '@entur/layout'
import React, { useReducer } from 'react'
import {
    SettingsDispatchContext,
    settingsReducer,
} from 'scenarios/Admin/reducer'
import { SortableColumns } from './index'

describe('<SortableColumns />', () => {
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
                            size: 2,
                            type: 'destination',
                        },
                        {
                            type: 'time',
                        },
                    ],
                    placeId: 'NSR:StopPlace:60066',
                    type: 'stop_place',
                    uuid: '1683625543293',
                },
            ],
        })

        return (
            <SettingsDispatchContext.Provider value={dispatch}>
                <Contrast>
                    {settings.tiles.map((tile) =>
                        tile.type === 'stop_place' ? (
                            <SortableColumns
                                key={tile.uuid}
                                tile={tile}
                                defaultOpen={true}
                            />
                        ) : null,
                    )}
                </Contrast>
            </SettingsDispatchContext.Provider>
        )
    }

    it('renders', () => {
        cy.mount(<TestComponent />)
    })

    it('can be sorted', () => {
        cy.mount(<TestComponent />)

        cy.get('[data-cy="column"]').first().should('include.text', 'Plattform')

        cy.get('[data-cy="sortable-handle"]')
            .first()
            .focus()
            .type(' ')
            .type('{rightArrow}')
            .type(' ')

        cy.get('[data-cy="column"]')
            .first()
            .should('not.include.text', 'Plattform')
            .and('include.text', 'Linje')
    })

    it('can delete columns', () => {
        cy.mount(<TestComponent />)
        cy.get('[data-cy="column"]').should('have.length', 4)
        cy.findAllByRole('button', { name: /fjern kolonne/i })
            .first()
            .click()
        cy.get('[data-cy="column"]').should('have.length', 3)
    })
})
