'use client'
import { IconButton } from '@entur/button'
import { AddIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { useToggle } from 'hooks/useToggle'
import { Dispatch, SetStateAction, useReducer, useState } from 'react'
import { Name } from './components/Name'
import { Stepper } from '@entur/menu'
import { TBoard } from 'types/settings'
import { TCreatePage } from 'Admin/types/createBoard'
import { createBoardReducer } from './utils/reducer'
import { SettingsDispatchContext } from './utils/context'
import { AddStops } from './components/AddStops'
import { ToastProvider } from '@entur/alert'
import { Login } from '../Login'
import dynamic from 'next/dynamic'

function CreateBoard({ loggedIn }: { loggedIn: boolean }) {
    const [pages, setPages] = useState<TCreatePage[]>([])
    const [showModal, openModal, closeModal] = useToggle()
    const [board, dispatch] = useReducer(createBoardReducer, {
        tiles: [],
        meta: {},
    } as TBoard)

    if (!loggedIn) {
        return (
            <Login
                loggedIn={loggedIn}
                title="Logg inn for å opprette en ny tavle"
            />
        )
    }

    return (
        <SettingsDispatchContext.Provider value={dispatch}>
            <IconButton onClick={openModal}>
                <AddIcon />
                Opprett tavle
            </IconButton>

            <Modal
                open={showModal}
                size="large"
                onDismiss={closeModal}
                closeLabel="Avbryt"
                className="flexColumn alignCenter textLeft"
            >
                <Stepper
                    steps={[
                        'Sett navn og organisasjon',
                        'Legg til holdeplasser',
                    ]}
                    activeIndex={pages.length}
                />
                <ToastProvider>
                    <CreatePage
                        pages={pages}
                        setPages={setPages}
                        board={board}
                    />
                </ToastProvider>
            </Modal>
        </SettingsDispatchContext.Provider>
    )
}

function CreatePage({
    pages,
    setPages,
    board,
}: {
    pages: TCreatePage[]
    setPages: Dispatch<SetStateAction<TCreatePage[]>>
    board: TBoard
}) {
    const pushPage = (page: TCreatePage) => {
        setPages([...pages, page])
    }

    const popPage = () => {
        setPages(pages.slice(0, -1))
    }

    if (!pages) return <Name board={board} pushPage={pushPage} />

    const lastPage = pages.slice(-1)[0]

    if (lastPage)
        return <AddStops popPage={popPage} board={board} oid={lastPage.oid} />

    return <Name board={board} pushPage={pushPage} />
}

const NonSSRHeader = dynamic(() => Promise.resolve(CreateBoard), { ssr: false })

export { NonSSRHeader as CreateBoard }
