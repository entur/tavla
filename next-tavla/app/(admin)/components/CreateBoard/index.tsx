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
import { TTile } from 'types/tile'
import { useState } from 'react'
import { TBoard, TOrganizationID } from 'types/settings'
import { create } from './actions'
import { StopPlaceList } from './components/StopPlaceList'
import { Checkbox, TextField } from '@entur/form'
import { Dropdown } from '@entur/dropdown'
import { HiddenInput } from 'components/Form/HiddenInput'
import { useOrganizations } from 'app/(admin)/hooks/useOrganizations'
import { TileSelector } from '../TileSelector'
import { formDataToTile } from '../TileSelector/utils'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { FormError } from '../FormError'
import { getOrganization } from 'app/(admin)/actions'
import classes from './styles.module.css'

type TCreateBoard = 'name' | 'stops'

function CreateBoard() {
    const pathname = usePathname()
    const router = useRouter()

    const getPathWithParams = useSearchParamsSetter<TCreateBoard>('board')

    const { open, pageParam } = usePageParam('board')

    const stepTitles = ['Navn og organisasjon', 'Legg til stopp']
    const steps = ['name', 'stops']
    const stepIndex = steps.indexOf(pageParam ?? '') ?? 0

    const [board, setBoard] = useState<TBoard>()
    const [organization, setOrganization] = useState<TOrganizationID>()

    const [state, setFormError] = useState<TFormFeedback | undefined>()

    return (
        <>
            <IconButton as={Link} href="?board=name" className="g-2 p-2">
                <AddIcon /> Opprett tavle
            </IconButton>
            <Modal
                open={open}
                size="large"
                className={classes.createModal}
                onDismiss={() => {
                    setBoard(undefined)
                    setFormError(undefined)
                    router.push(pathname ?? '/')
                }}
                closeLabel="Avbryt opprettelse av tavle"
                data-theme="light"
            >
                <Stepper steps={stepTitles} activeIndex={stepIndex} />

                <div className="w-75">
                    <NameAndOrganizationSelector
                        active={pageParam === 'name'}
                        title={board?.meta?.title}
                        state={state}
                        action={async (data: FormData) => {
                            const name = data.get('name') as string
                            if (!name) {
                                return setFormError(
                                    getFormFeedbackForError(
                                        'board/name-missing',
                                    ),
                                )
                            }
                            const organization = data.get(
                                'organization',
                            ) as TOrganizationID
                            const isPrivate = data.get('check-privateBoard')
                            if (!organization && !isPrivate) {
                                return setFormError(
                                    getFormFeedbackForError(
                                        'board/organization-missing',
                                    ),
                                )
                            }
                            setBoard({
                                tiles: [],
                                ...board,
                                meta: { ...board?.meta, title: name },
                            } as TBoard)
                            setOrganization(organization)
                            setFormError(undefined)

                            router.push(getPathWithParams('stops'))
                        }}
                    />
                    <StopSelector
                        active={pageParam === 'stops'}
                        board={board}
                        setBoard={setBoard}
                        oid={organization}
                        state={state}
                        setFormError={setFormError}
                    />
                </div>
            </Modal>
        </>
    )
}

function NameAndOrganizationSelector({
    active,
    title,
    state,
    action,
}: {
    active: boolean
    title?: string
    state: TFormFeedback | undefined
    action: (data: FormData) => void
}) {
    const { organizations, selectedOrganization, setSelectedOrganization } =
        useOrganizations()

    const [isPrivate, setisPrivate] = useState<boolean>(false)

    if (!active) return null
    return (
        <form action={action}>
            <Heading4 className="mt-1">Sett navn på tavlen</Heading4>
            <Paragraph>
                Navnet på tavlen vil vises i listen over tavler. Du kan endre på
                navnet senere.
            </Paragraph>
            <TextField
                size="medium"
                label="Navn"
                id="name"
                name="name"
                defaultValue={title}
                required
                {...getFormFeedbackForField('name', state)}
            />
            <div>
                <Heading4>Legg tavlen til i en organisasjon</Heading4>
                <Paragraph className="mb-2">
                    Velger du en organisasjon vil alle i organisasjonen ha
                    tilgang til tavlen.
                </Paragraph>
                <Dropdown
                    items={organizations}
                    label="Dine organisasjoner"
                    selectedItem={selectedOrganization}
                    onChange={setSelectedOrganization}
                    clearable
                    className="mb-2"
                    {...getFormFeedbackForField('dropdown', state)}
                    aria-required="true"
                    disabled={isPrivate}
                />
                <Checkbox
                    defaultChecked={isPrivate}
                    onChange={() => setisPrivate(!isPrivate)}
                    name="check-privateBoard"
                >
                    Jeg vil ikke velge organisasjon
                </Checkbox>
                <HiddenInput
                    id="organization"
                    value={selectedOrganization?.value}
                />
                <div className="flexRow justifyEnd">
                    <PrimaryButton className="mt-2" type="submit">
                        Neste
                        <ForwardIcon />
                    </PrimaryButton>
                </div>
            </div>
        </form>
    )
}

function StopSelector({
    active,
    board,
    setBoard,
    oid,
    state,
    setFormError,
}: {
    active: boolean
    setBoard: (board: TBoard | undefined) => void
    board?: TBoard
    oid?: TOrganizationID
    state: TFormFeedback | undefined
    setFormError: (feedback: TFormFeedback | undefined) => void
}) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!active) return null

    return (
        <div>
            <Heading3>Legg til stoppesteder i Tavlen </Heading3>
            <Paragraph>
                Søk etter stoppesteder og bestem om tavla skal vise alle
                retninger, eller flere enkelte retninger.
            </Paragraph>
            <TileSelector
                action={async (data: FormData) => {
                    setFormError(undefined)
                    const organization = await getOrganization(oid)
                    const tile = formDataToTile(data, organization)
                    if (!tile.placeId) return
                    setBoard({
                        ...board,
                        tiles:
                            board && board.tiles
                                ? board?.tiles.concat(tile)
                                : [tile],
                    } as TBoard)
                }}
                direction="Column"
                oid={oid}
            />
            <Heading4>Stoppesteder lagt til i Tavlen</Heading4>
            <StopPlaceList
                tiles={board?.tiles}
                onRemove={(tile: TTile) =>
                    setBoard({
                        ...board,
                        tiles:
                            board?.tiles.filter((t) => t.uuid !== tile.uuid) ??
                            [],
                    } as TBoard)
                }
            />
            <FormError {...getFormFeedbackForField('general', state)} />
            <div className="flexRow justifyBetween">
                <SecondaryButton onClick={() => router.back()} className="mt-2">
                    <BackArrowIcon />
                    Tilbake
                </SecondaryButton>
                <PrimaryButton
                    onClick={async () => {
                        setIsSubmitting(true)
                        if (!board || !board.meta || !board.meta.title) {
                            setIsSubmitting(false)
                            router.push('?board=name')
                            return setFormError(
                                getFormFeedbackForError('board/name-missing'),
                            )
                        }
                        if (!board || board.tiles.length === 0) {
                            setIsSubmitting(false)
                            return setFormError(
                                getFormFeedbackForError('board/tiles-missing'),
                            )
                        }

                        await create(board, oid)
                        setBoard(undefined)
                    }}
                    className="mt-2"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                >
                    Opprett tavle
                </PrimaryButton>
            </div>
        </div>
    )
}

export { CreateBoard }
