import { TBoard } from 'types/settings'
import { useReducer } from 'react'
import classes from './styles.module.css'
import dynamic from 'next/dynamic'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { useAutoSaveSettings } from './hooks/useAutoSaveSettings'
import { CopyIcon, SaveIcon } from '@entur/icons'
import { SecondaryLink } from 'components/SecondaryLink'
import { useToast } from '@entur/alert'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { boardReducer } from './utils/reducer'
import { SettingsDispatchContext } from './utils/contexts'
import { BoardTitle } from './components/BoardTitle'
import { AddTile } from './components/AddTile'
import { TilesOverview } from './components/TilesOverview'

function Edit({
    initialBoard,
    documentId,
}: {
    initialBoard: TBoard
    documentId: string
    user: DecodedIdToken | null
}) {
    const [board, dispatch] = useReducer(boardReducer, initialBoard)
    const { addToast } = useToast()

    const linkUrl = window.location.host + '/' + documentId

    const saveSettings = useAutoSaveSettings(board)

    return (
        <SettingsDispatchContext.Provider value={dispatch}>
            <div className={classes.settings}>
                <div className="flexBetween">
                    <BoardTitle title={board.meta?.title} />
                    <div className="flexGap">
                        <SecondaryButton
                            onClick={() => {
                                navigator.clipboard.writeText(linkUrl)
                                addToast('Lenke til Tavla kopiert')
                            }}
                        >
                            Kopier lenke til Tavla
                            <CopyIcon />
                        </SecondaryButton>
                        <SecondaryLink
                            external
                            href={'/' + documentId}
                            text="Se Tavla"
                        />
                        <PrimaryButton onClick={saveSettings}>
                            Lagre tavla
                            <SaveIcon />
                        </PrimaryButton>
                    </div>
                </div>
                <AddTile />
                <TilesOverview tiles={board.tiles} />
            </div>
        </SettingsDispatchContext.Provider>
    )
}

// No SSR for Admin to fix hydration issues
// caused by incompatible libraries (dnd-kit, @entur/dropdown)
// https://github.com/clauderic/dnd-kit/issues/801
const NonSSRAdmin = dynamic(() => Promise.resolve(Edit), { ssr: false })

export { NonSSRAdmin as Edit }
