import { Button } from '@entur/button'
import { Heading3, Paragraph } from '@entur/typography'
import { TBoard } from 'types/settings'
import { CreateBoardButton } from './CreateBoardButton'
import { Dropdown } from '@entur/dropdown'
import { useOrganizations } from '../hooks/useOrganizations'

export function AddToOrganization({
    board,
    popPage,
}: {
    board: TBoard
    popPage: () => void
}) {
    const { organizations, selectedOrganization, setSelectedOrganization } =
        useOrganizations()

    return (
        <div className="flexColumn w-50">
            <Heading3>Vil du legge tavla til i en organisasjon? </Heading3>
            <Paragraph>
                Hvis du ikke velger en organisasjon, vil tavla bli lagret under
                din private bruker. Det er kun du som kan administrere tavla som
                opprettes.
            </Paragraph>
            <Dropdown
                items={organizations}
                label="Dine organisasjoner"
                selectedItem={selectedOrganization}
                onChange={setSelectedOrganization}
                clearable
            />
            <div className="flexRow justifyBetween mt-2">
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
