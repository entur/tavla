import { PrimaryButton } from '@entur/button'
import { AddIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { useToggle } from 'hooks/useToggle'
import { useReducer, useState } from 'react'
import { Name } from './components/Name'
import { Stepper } from '@entur/menu'
import { useRouter } from 'next/router'
import { TBoard } from 'types/settings'
import { TCreatePage } from 'Admin/types/createBoard'
import { createBoardReducer } from './utils/reducer'
import { SettingsDispatchContext } from './utils/context'
import { AddStops } from './components/AddStops'
import { ToastProvider } from '@entur/alert'

function CreateBoard({ loggedIn }: { loggedIn: boolean }) {
    const [pages, setPages] = useState<TCreatePage[]>([])
    const [showModal, openModal, closeModal] = useToggle()
    const router = useRouter()
    const [board, dispatch] = useReducer(createBoardReducer, {
        tiles: [],
    } as TBoard)
    const pushPage = (page: TCreatePage) => {
        setPages([...pages, page])
    }

    const popPage = () => {
        setPages(pages.slice(0, -1))
    }

    const handleOpenModal = () => {
        if (loggedIn) {
            openModal()
        } else {
            router.push('/#login')
        }
    }

    const handleCloseModal = () => {
        closeModal()
        setPages([])
    }

    return (
        <SettingsDispatchContext.Provider value={dispatch}>
            <PrimaryButton onClick={handleOpenModal}>
                <AddIcon />
                {loggedIn
                    ? 'Opprett ny tavle'
                    : 'Logg inn for å opprette en ny tavle'}
            </PrimaryButton>
            <Modal
                open={showModal}
                size="extraLarge"
                onDismiss={handleCloseModal}
                closeLabel="Avbryt"
                className="flexColumn alignCenter textLeft"
            >
                <Stepper
                    steps={['Navn', 'Legg til holdeplasser']}
                    activeIndex={pages.length}
                />
                <ToastProvider>
                    <CreatePage
                        pages={pages}
                        pushPage={pushPage}
                        popPage={popPage}
                        board={board}
                    />
                </ToastProvider>
            </Modal>
        </SettingsDispatchContext.Provider>
    )
}

function CreatePage({
    pages,
    pushPage,
    popPage,
    board,
}: {
    pages: TCreatePage[]
    pushPage: (page: TCreatePage) => void
    popPage: () => void
    board: TBoard
}) {
    if (!pages) return <Name board={board} pushPage={pushPage} />

    const lastPage = pages.slice(-1)[0]

    switch (lastPage) {
        case 'addStops':
            return <AddStops popPage={popPage} board={board} />
        default:
            return <Name board={board} pushPage={pushPage} />
    }
}

export { CreateBoard }
