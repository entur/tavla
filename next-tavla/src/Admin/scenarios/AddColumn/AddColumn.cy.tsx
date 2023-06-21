import { Contrast } from '@entur/layout'
import React, { useReducer } from 'react'
import { SortableColumns } from '../SortableColumns'
import { TSettings } from 'types/settings'
import { TStopPlaceTile } from 'types/tile'
import { SettingsDispatchContext } from 'Admin/utils/contexts'
import { settingsReducer } from '../Edit/reducer'

const stopPlaceTile: TStopPlaceTile = {
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
}

const initialSettings: TSettings = {
    tiles: [stopPlaceTile],
}

describe('<AddColumn />', () => {
    const TestComponent = () => {
        const [settings, dispatch] = useReducer(
            settingsReducer,
            initialSettings,
        )

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

    it('contains all columns from initial settings', () => {
        cy.mount(<TestComponent />)
        cy.findByRole('button', { name: /velg kolonner/i }).click()
        cy.get('[data-cy="column"]').should(
            'have.length',
            stopPlaceTile.columns?.length,
        )
    })

    it('can add a new column', () => {
        cy.mount(<TestComponent />)
        cy.findByRole('button', { name: /velg kolonner/i }).click()

        cy.get('[data-cy="column"]')
            .should('have.length', stopPlaceTile.columns?.length)
            .should('not.include.text', 'Destinasjon')

        cy.findByRole('button', { name: /destinasjon/i }).click()
        cy.get('[data-cy="column"]')
            .should('have.length', (stopPlaceTile.columns?.length ?? 0) + 1)
            .should('include.text', 'Destinasjon')
    })
})
