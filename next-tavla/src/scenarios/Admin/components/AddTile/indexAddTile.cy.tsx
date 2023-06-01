import { Contrast } from '@entur/layout'
import React, { useReducer } from 'react'
import {
    SettingsDispatchContext,
    settingsReducer,
} from 'scenarios/Admin/reducer'
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
        // see: https://on.cypress.io/mounting-react
        cy.mount(<TestComponent />)
    })

    it('can add a stop place tile', () => {
        cy.mount(<TestComponent />)
        cy.get('input').type('Jernbanetorget')
        cy.get('ul > li').click()
        cy.contains('Legg til').click()

        cy.get('[data-cy="tiles"]').children().should('have.length', 1)
    })
})
