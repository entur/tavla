import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { Column } from './Column'
import { TBoard } from 'types/settings'
import Link from 'next/link'

function Name({ board }: { board: TBoard }) {
    return (
        <Column column="name">
            <Link
                href={`/edit/${board.id}`}
                className="hidden sm:block hover:underline"
            >
                {board.meta.title ?? DEFAULT_BOARD_NAME}
            </Link>
            <p className="block sm:hidden">
                {board.meta.title ?? DEFAULT_BOARD_NAME}
            </p>
        </Column>
    )
}

export { Name }
