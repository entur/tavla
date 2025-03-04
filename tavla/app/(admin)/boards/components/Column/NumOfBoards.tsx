import { Column } from './Column'
import { TOrganization } from 'types/settings'

function NumOfBoards({ folder }: { folder?: TOrganization }) {
    if (!folder) return <Column column="numOfBoards">-</Column>

    return (
        <Column column="numOfBoards">
            <p className="block">{folder.boards?.length}</p>
        </Column>
    )
}

export { NumOfBoards }
