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
import { TextField } from '@entur/form'
import { Dropdown } from '@entur/dropdown'
import { HiddenInput } from 'components/Form/HiddenInput'
import { useOrganizations } from 'app/(admin)/hooks/useOrganizations'
import { TileSelector } from '../TileSelector'
import { formDataToTile } from '../TileSelector/utils'

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

    return (
        <>
            <IconButton as={Link} href="?board=name" className="g-2 p-2">
                <AddIcon /> Opprett tavle
            </IconButton>
            <Modal
                open={open}
                size="large"
                className="flexColumn alignCenter"
                onDismiss={() => {
                    setBoard(undefined)
                    router.push(pathname ?? '/')
                }}
                closeLabel="Avbryt opprettelse av tavle"
            >
                <Stepper steps={stepTitles} activeIndex={stepIndex} />

                <div className="w-75">
                    <NameAndOrganizationSelector
                        active={pageParam === 'name'}
                        title={board?.meta.title}
                        action={async (data: FormData) => {
                            const name = data.get('name') as string
                            const organization = data.get(
                                'organization',
                            ) as TOrganizationID

                            setBoard({
                                tiles: [],
                                ...board,
                                meta: { ...board?.meta, title: name },
                            } as TBoard)
                            setOrganization(organization)

                            router.push(getPathWithParams('stops'))
                        }}
                    />
                    <StopSelector
                        active={pageParam === 'stops'}
                        board={board}
                        setBoard={setBoard}
                        organization={organization}
                    />
                </div>
            </Modal>
        </>
    )
}

function NameAndOrganizationSelector({
    active,
    title,
    action,
}: {
    active: boolean
    title?: string
    action: (data: FormData) => void
}) {
    const { organizations, selectedOrganization, setSelectedOrganization } =
        useOrganizations()

    if (!active) return null
    return (
        <form action={action}>
            <Heading4 className="mt-1">Sett navn på tavla</Heading4>
            <Paragraph>
                Navnet på tavla vil vises i listen over tavler. Du kan endre på
                navnet senere.
            </Paragraph>
            <TextField
                size="medium"
                label="Navn"
                id="name"
                name="name"
                defaultValue={title}
                required
            />
            <div className="">
                <Heading4>Legg tavla til en organisasjon</Heading4>
                <Paragraph>
                    Hvis du ikke velger en organisasjon, vil tavla bli lagret
                    under din private bruker. Det er kun du som kan administrere
                    tavla som opprettes.
                </Paragraph>
                <Dropdown
                    items={organizations}
                    label="Dine organisasjoner"
                    selectedItem={selectedOrganization}
                    onChange={setSelectedOrganization}
                    clearable
                />
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
    organization,
}: {
    active: boolean
    setBoard: (board: TBoard) => void
    board?: TBoard
    organization?: TOrganizationID
}) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!active) return null

    return (
        <div>
            <Heading3>Legg til stoppesteder i Tavla </Heading3>
            <Paragraph>
                Søk etter stoppesteder og bestem om tavla skal vise alle
                retninger, eller flere enkelte retninger.
            </Paragraph>
            <TileSelector
                action={async (data: FormData) => {
                    const tile = formDataToTile(data)
                    setBoard({
                        ...board,
                        tiles:
                            board && board.tiles
                                ? board?.tiles.concat(tile)
                                : [tile],
                    } as TBoard)
                }}
                direction="Column"
            />
            <Heading4>Stoppesteder lagt til i Tavla</Heading4>
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
            <div className="flexRow justifyBetween">
                <SecondaryButton onClick={() => router.back()} className="mt-2">
                    <BackArrowIcon />
                    Tilbake
                </SecondaryButton>
                <PrimaryButton
                    onClick={() => {
                        setIsSubmitting(true)
                        if (!board) return
                        create(board, organization)
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
