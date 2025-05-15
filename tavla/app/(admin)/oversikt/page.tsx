import { redirect } from 'next/navigation'
import { Search } from './components/Search'
import { BoardTable } from './components/BoardTable'
import { Metadata } from 'next'
import React from 'react'
import {
    getOrganizationsForUser,
    getPrivateBoardsForUser,
} from 'app/(admin)/actions'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { Heading1, Heading4, Label } from '@entur/typography'
import { CreateFolder } from '../components/CreateFolder'
import { CreateBoard } from '../components/CreateBoard'
import { countAllBoards } from './utils/actions'
import leafs from 'assets/illustrations/leafs.svg'
import Image from 'next/image'

initializeAdminApp()

export const metadata: Metadata = {
    title: `Mapper og tavler | Entur Tavla`,
}

async function FoldersAndBoardsPage() {
    const user = await getUserFromSessionCookie()
    if (!user) redirect('/')

    const folders = await getOrganizationsForUser()
    const privateBoards = await getPrivateBoardsForUser()
    const count = await countAllBoards(folders, privateBoards)
    const elementsListCount = privateBoards.length + folders.length

    return (
        <div className="flex flex-col gap-8 container pb-20">
            <div className="flex max-sm:flex-col flex-row justify-between">
                <Heading1>Mapper og tavler</Heading1>
                <div className="flex flex-row gap-4">
                    <CreateBoard />
                    <CreateFolder />
                </div>
            </div>

            <div className="gap-4">
                {elementsListCount === 0 ? (
                    <>
                        <Image
                            src={leafs}
                            alt=""
                            className="h-1/4 w-1/4 mx-auto"
                        />
                        <Heading4 className="text-center">
                            Oisann, her var det tomt! Start med å lage en mappe
                            eller en tavle!
                        </Heading4>
                    </>
                ) : (
                    <>
                        <Search />
                        <div className="flex flex-col mt-8">
                            <Label>Totalt antall tavler: {count}</Label>
                            <BoardTable
                                folders={folders}
                                boards={privateBoards}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default FoldersAndBoardsPage
