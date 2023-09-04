import { Contrast } from '@entur/layout'
import React, { useReducer } from 'react'
import { TilesOverview } from '../TilesOverview'
import { AddTile } from './index'
import { SettingsDispatchContext } from 'Admin/utils/contexts'
import { settingsReducer } from '../Edit/reducer'
import { ToastProvider } from '@entur/alert'
import { GEOCODER_ENDPOINT } from 'assets/env'

describe('<AddTile />', () => {
    const TestComponent = () => {
        const [settings, dispatch] = useReducer(settingsReducer, {
            tiles: [],
        })

        const mockUser = {
            aud: 'test',
            auth_time: 1234,
            exp: 1234,
            firebase: {
                identities: {},
                sign_in_provider: 'password',
            },
            iat: 1630841265,
            iss: 'test',
            sub: 'test-unique-id',
            uid: 'test-unique-id',
        }

        return (
            <Contrast>
                <ToastProvider>
                    <SettingsDispatchContext.Provider value={dispatch}>
                        <AddTile />
                        <TilesOverview tiles={settings.tiles} user={mockUser} />
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
