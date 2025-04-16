import { getNumberOfBoardsInFolder } from 'app/(admin)/oversikt/utils/actions'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const folderId = searchParams.get('folderId')

    const boardsInFolderCount = await getNumberOfBoardsInFolder(
        folderId ?? undefined,
    )
    return NextResponse.json({ boardsInFolderCount })
}
