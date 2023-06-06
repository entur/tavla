import { Contrast } from '@entur/layout'
import React, { useReducer } from 'react'
import { geocoder_endpoint } from 'assets/environmentConfig'
import { SettingsDispatchContext, settingsReducer } from 'Admin/reducer'
import { TilesSettings } from '../TilesSettings'
import { AddTile } from './index'

describe('<AddTile />', () => {
    const TestComponent = () => {
        const [settings, dispatch] = useReducer(settingsReducer, {
            tiles: [],
        })

        return (
            <Contrast>
                <SettingsDispatchContext.Provider value={dispatch}>
                    <TilesSettings tiles={settings.tiles} />
                    <AddTile />
                </SettingsDispatchContext.Provider>
            </Contrast>
        )
    }
    it('renders', () => {
        cy.mount(<TestComponent />)
    })

    it('can add a stop place tile', () => {
        cy.mount(<TestComponent />)
        cy.intercept(`${geocoder_endpoint}/autocomplete?*`, {
            fixture: 'graphql/geocoder.json',
        })

        cy.findByRole('textbox').type('Jernbanetorget')
        cy.findByRole('listbox').children().first().click()
        cy.findByRole('button', { name: /legg til/i }).click()
        cy.get('[data-cy="tiles"]').children().should('have.length', 1)
    })
})
