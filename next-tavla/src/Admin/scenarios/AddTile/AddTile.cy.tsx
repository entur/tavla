import { Contrast } from '@entur/layout'
import React, { useReducer } from 'react'
import { TilesOverview } from '../TilesOverview'
import { AddTile } from './index'
import { ToastProvider } from '@entur/alert'
import { GEOCODER_ENDPOINT } from 'assets/env'
import { boardReducer } from '../Edit/utils/reducer'
import { SettingsDispatchContext } from '../Edit/utils/contexts'

describe('<AddTile />', () => {
    const TestComponent = () => {
        const [settings, dispatch] = useReducer(boardReducer, {
            tiles: [],
        })

        return (
            <Contrast>
                <ToastProvider>
                    <SettingsDispatchContext.Provider value={dispatch}>
                        <AddTile />
                        <TilesOverview tiles={settings.tiles} />
                    </SettingsDispatchContext.Provider>
                </ToastProvider>
            </Contrast>
        )
    }
    it('renders', () => {
        cy.mount(<TestComponent />)
    })

    it('can add a stop place tile', () => {
        cy.mount(<TestComponent />)
        cy.intercept(`${GEOCODER_ENDPOINT}/autocomplete?*`, {
            fixture: 'graphql/geocoder.json',
        })

        cy.findByRole('combobox').type('Jernbanetorget')
        cy.wait(1500) // Waiting for debounce when searching
        cy.findByRole('listbox').children().first().click()
        cy.findByRole('button', { name: /legg til/i }).click()
        cy.get('[data-cy="tiles"]')
            .children()
            .should('contain.text', 'Jernbanetorget')
    })
})
