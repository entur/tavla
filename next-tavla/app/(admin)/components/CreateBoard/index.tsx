'use client'
import { IconButton, PrimaryButton, SecondaryButton } from '@entur/button'
import { AddIcon, BackArrowIcon, ForwardIcon } from '@entur/icons'
import { Stepper } from '@entur/menu'
import { Modal } from '@entur/modal'
import { Heading3, Heading4, Paragraph } from '@entur/typography'
import Link from 'next/link'
import { usePageParam } from 'app/(admin)/hooks/usePageParam'
import { usePathname, useRouter } from 'next/navigation'
import { useSearchParamsSetter } from 'app/(admin)/hooks/useSearchParamsSetter'
import { TCreateBoard } from 'Admin/types/createBoard'
import { TTile } from 'types/tile'
import { useState } from 'react'
import { TBoard, TOrganizationID } from 'types/settings'
import { create } from './actions'
import { useFormState } from 'react-dom'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { FirebaseError } from 'firebase/app'
import { FormError } from '../FormError'
import { Name } from './components/Name'
import { Organization } from './components/Organization'
import { StopPlaceList } from './components/StopPlaceList'
import { TileSelector } from './components/TileSelector'

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
        _prevState: TFormFeedback | undefined,
        data: FormData,
    ) => {
        const title = data.get('name') as string

        if (!title || /^\s*$/.test(title)) {
            router.push(pathname + '?create-board')
            return getFormFeedbackForError('board/name-missing')
        }

        if (!tiles || tiles.length === 0)
            return getFormFeedbackForError('board/tiles-missing')

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
                size="large"
                className="flexColumn alignCenter"
                onDismiss={() => {
                    setTiles([])
                    router.push(pathname ?? '/')
                }}
                closeLabel="Avbryt opprettelse av tavle"
            >
                <Stepper steps={steps} activeIndex={pageParam === '' ? 0 : 1} />

                <form action={formAction} className="w-75">
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
                        <FormError
                            {...getFormFeedbackForField('general', state)}
                        />
                    </div>
                    <div className="flexRowReverse justifyBetween">
                        {pageParam !== 'stops' ? (
                            <PrimaryButton
                                as={Link}
                                href={getPathWithParams('stops')}
                                className="mt-2"
                            >
                                Neste
                                <ForwardIcon />
                            </PrimaryButton>
                        ) : (
                            <PrimaryButton type="submit" className="mt-2">
                                Opprett tavle
                            </PrimaryButton>
                        )}

                        {hasPage && (
                            <SecondaryButton
                                onClick={() => router.back()}
                                className="mt-2"
                            >
                                <BackArrowIcon />
                                Tilbake
                            </SecondaryButton>
                        )}
                    </div>
                </form>
            </Modal>
        </>
    )
}

export { CreateBoard }
