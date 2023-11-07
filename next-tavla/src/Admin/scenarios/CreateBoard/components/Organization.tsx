import { Button } from '@entur/button'
import { Heading3, Paragraph } from '@entur/typography'
import { TBoard } from 'types/settings'
import { CreateBoardButton } from './CreateBoardButton'
import { Dropdown } from '@entur/dropdown'
import { useOrganizations } from '../hooks/useOrganizations'

export function Organization({
    board,
    popPage,
}: {
    board: TBoard
    popPage: () => void
}) {
    const { organizations, selectedOrganization, setSelectedOrganization } =
        useOrganizations()

    return (
        <div className="flexColumn g-2 h-100">
            <Heading3>Vil du legge tavla til en organisasjon? </Heading3>
            <Paragraph>
                Hvis du ikke velger en organisasjon, vil tavla bli lagret som
                privat.
            </Paragraph>
            <Dropdown
                items={organizations}
                label="Dine organisasjoner"
                selectedItem={selectedOrganization}
                onChange={setSelectedOrganization}
            />
            <div className="flexRow justifyBetween">
                <Button variant="secondary" onClick={popPage}>
                    Tilbake
                </Button>
                <CreateBoardButton
                    board={board}
                    oid={selectedOrganization?.value}
                />
            </div>
        </div>
    )
}
