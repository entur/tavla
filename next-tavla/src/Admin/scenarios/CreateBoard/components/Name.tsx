import { PrimaryButton } from '@entur/button'
import { TextField } from '@entur/form'
import { Heading3, Paragraph } from '@entur/typography'
import { TCreatePage } from 'Admin/types/createBoard'
import { TBoard } from 'types/settings'
import { useCreateBoardDispatch } from '../utils/context'
import { selectInput } from 'Admin/utils/selectInput'
function Name({
    board,
    pushPage,
}: {
    board: TBoard
    pushPage: (page: TCreatePage) => void
}) {
    const dispatch = useCreateBoardDispatch()

    return (
        <div className="flexColumn g-2 h-100">
            <Heading3>Hva skal tavla hete?</Heading3>
            <Paragraph>
                Gi tavla et navn slik at det blir enklere å finne den igjen
                senere.
            </Paragraph>

            <TextField
                name="name"
                label="Navn på tavla"
                placeholder="Navn på tavla"
                value={board?.meta?.title ?? ''}
                aria-label="Sett navn på tavla"
                ref={selectInput}
                onChange={(e) => {
                    dispatch({ type: 'setTitle', title: e.target.value })
                }}
            />
            <PrimaryButton
                onClick={() => {
                    pushPage('addStops')
                }}
            >
                Neste
            </PrimaryButton>
        </div>
    )
}

export { Name }
