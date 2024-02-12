'use client'
import { IconButton, PrimaryButton, SecondaryButton } from '@entur/button'
import { AddIcon, BackArrowIcon, ForwardIcon } from '@entur/icons'
import { Stepper } from '@entur/menu'
import { Modal } from '@entur/modal'
import { Heading3, Heading4, Paragraph } from '@entur/typography'
import { Name } from './Name'
import { Organization } from './Organization'
import Link from 'next/link'
import { usePageParam } from 'app/(admin)/hooks/usePageParam'
import { usePathname, useRouter } from 'next/navigation'
import { useSearchParamsSetter } from 'app/(admin)/hooks/useSearchParamsSetter'
import { TileSelector } from 'app/(admin)/edit/[id]/components/TileSelector'
import { TCreateBoard } from 'Admin/types/createBoard'
import { TTile } from 'types/tile'
import { useState } from 'react'
import { StopPlaceList } from './StopPlaceList'
import { TBoard, TOrganizationID } from 'types/settings'
import { create } from './actions'
import { useFormState } from 'react-dom'
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { FirebaseError } from 'firebase/app'

function CreateBoard() {
    const pathname = usePathname()
    const router = useRouter()
    const getPathWithParams =
        useSearchParamsSetter<TCreateBoard>('create-board')
    const { open, hasPage, pageParam } = usePageParam('create-board')
    const steps = ['Navn og organisasjon', 'Legg til stopp']
    const [tiles, setTiles] = useState<TTile[]>([])

    const removeTile = (tile: TTile) => {
        setTiles(tiles.filter((t) => t.uuid !== tile.uuid))
    }

    const action = async (
        prevState: TFormFeedback | undefined,
        data: FormData,
    ) => {
        const title = data.get('name') as string

        if (!title) return getFormFeedbackForError('board/name-missing')

        const organization = data?.get('organization') as TOrganizationID

        const board = {
            tiles: tiles,
            meta: {
                title: title,
            },
        } as TBoard
        try {
            await create(board, organization)
            setTiles([])
        } catch (e) {
            if (e instanceof FirebaseError) {
                return getFormFeedbackForError(e)
            }
        }
    }
    const [state, formAction] = useFormState(action, undefined)

    return (
        <>
            <IconButton as={Link} href="?create-board" className="g-2 p-2">
                <AddIcon /> Opprett tavle
            </IconButton>
            <Modal
                open={open}
                size="medium"
                onDismiss={() => {
                    setTiles([])
                    router.push(pathname ?? '/')
                }}
                closeLabel="Avbryt opprettelse av tavle"
            >
                <Stepper
                    steps={steps}
                    activeIndex={pageParam === '' ? 0 : 1}
                    className="justifyCenter"
                />

                <form action={formAction}>
                    <div className={pageParam === '' ? '' : 'displayNone'}>
                        <Name formState={state} />
                        <Organization />
                    </div>
                    <div className={pageParam === 'stops' ? '' : 'displayNone'}>
                        <Heading3>Legg til stoppesteder i Tavla </Heading3>
                        <Paragraph>
                            Søk etter stoppesteder og bestem om tavla skal vise
                            alle retninger, eller flere enkelte retninger.
                        </Paragraph>
                        <TileSelector
                            addTile={(tile) => setTiles([...tiles, tile])}
                            flexDirection="flexColumn"
                        />
                        <Heading4>Stoppesteder lagt til i Tavla</Heading4>
                        <StopPlaceList tiles={tiles} onRemove={removeTile} />
                    </div>
                    <div className="flexRow justifyBetween">
                        {hasPage && (
                            <SecondaryButton
                                onClick={() => router.back()}
                                className="mt-2"
                            >
                                <BackArrowIcon />
                                Tilbake
                            </SecondaryButton>
                        )}
                        <PrimaryButton
                            as={Link}
                            href={getPathWithParams('stops')}
                            className="mt-2"
                        >
                            Neste
                            <ForwardIcon />
                        </PrimaryButton>
                        <PrimaryButton type="submit" className="mt-2">
                            Opprett tavle
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export { CreateBoard }
