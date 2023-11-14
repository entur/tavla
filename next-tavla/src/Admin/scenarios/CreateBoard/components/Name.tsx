import { TextField } from '@entur/form'
import { Heading3, Heading4, Paragraph } from '@entur/typography'
import { TCreatePage } from 'Admin/types/createBoard'
import { TBoard } from 'types/settings'
import { useCreateBoardDispatch } from '../utils/context'
import { selectInput } from 'Admin/utils/selectInput'
import { NextPage } from './NextPage'
import { useOrganizations } from '../hooks/useOrganizations'
import { Dropdown } from '@entur/dropdown'
function Name({
    board,
    pushPage,
}: {
    board: TBoard
    pushPage: (page: TCreatePage) => void
}) {
    const dispatch = useCreateBoardDispatch()
    const { organizations, selectedOrganization, setSelectedOrganization } =
        useOrganizations()

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
            <div className="flexRow justifyEnd w-100">
            <Heading4>Legg tavla til en organisasjon</Heading4>
            <Paragraph margin="none">
                Hvis du ikke velger en organisasjon, vil tavla bli lagret under
                din private bruker. Det er kun du som kan administrere tavla som
                opprettes.
            </Paragraph>
            <Dropdown
                className="mb-4"
                items={organizations}
                label="Dine organisasjoner"
                selectedItem={selectedOrganization}
                onChange={setSelectedOrganization}
                clearable
            />
                <NextPage nextPage="addStops" pushPage={pushPage} />
            </div>
        </div>
    )
}

export { Name }
