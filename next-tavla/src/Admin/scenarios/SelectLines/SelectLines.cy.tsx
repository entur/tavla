import React, { useReducer } from 'react'
import { SelectLines } from './index'
import { SettingsDispatchContext } from 'Admin/utils/contexts'
import { settingsReducer } from '../Edit/reducer'

describe('<SelectLines />', () => {
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

        const lines = [
            {
                id: 'ATB:Line:2_25',
                publicCode: '25',
                name: 'Vikåsen- Strindheim- Singsaker',
            },
            {
                id: 'ATB:Line:2_805',
                publicCode: '805',
                name: 'Trondheim - Brekstad',
            },
            {
                id: 'ATB:Line:2_800',
                publicCode: '800',
                name: 'Trondheim - Brekstad - Kristiansund',
            },
            {
                id: 'ATB:Line:2_810',
                publicCode: '810',
                name: 'Trondheim - Vanvikan',
            },
        ]

        return (
            <SettingsDispatchContext.Provider value={dispatch}>
                {settings.tiles.map((tile) =>
                    tile.type === 'stop_place' ? (
                        <SelectLines
                            key={tile.uuid}
                            tile={tile}
                            lines={lines}
                        />
                    ) : null,
                )}
            </SettingsDispatchContext.Provider>
        )
    }

    it('renders', () => {
        cy.mount(<TestComponent />)
    })

    it('can be expanded', () => {
        cy.mount(<TestComponent />)
        cy.get('button').click()
    })

    it('can select lines', () => {
        cy.mount(<TestComponent />)
        cy.get('button').click()
        cy.contains('label', '805 Trondheim - Brekstad')
            .get('input')
            .should('not.be.checked')
        cy.contains('805 Trondheim - Brekstad').click()
        cy.contains('label', '805 Trondheim - Brekstad')
            .get('input')
            .should('be.checked')
    })
})
