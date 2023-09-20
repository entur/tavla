import { Heading1 } from '@entur/typography'
import classes from './styles.module.css'
import { BoardList } from '../BoardList'
import { TBoard } from 'types/settings'
import dynamic from 'next/dynamic'
import { CreateBoard } from '../CreateBoard'
import { useReducer } from 'react'
import { settingsReducer } from './utils/reducer'
import { SettingsContext, SettingsDispatchContext } from './utils/context'
import { Search } from './components/Search'

function Boards({ boards }: { boards: TBoard[] }) {
    const [settings, dispatch] = useReducer(settingsReducer, {
        boards: boards,
        search: '',
    })
    return (
        <SettingsContext.Provider value={settings}>
            <SettingsDispatchContext.Provider value={dispatch}>
                <div className={classes.adminWrapper}>
                    <div className={classes.header}>
                        <Heading1>Mine Tavler</Heading1>
                        <CreateBoard />
                    </div>
                    <Search />
                    <BoardList boards={boards} />
                </div>
            </SettingsDispatchContext.Provider>
        </SettingsContext.Provider>
    )
}

const NonSSRAdmin = dynamic(() => Promise.resolve(Boards), { ssr: false })

export { NonSSRAdmin as Boards }
