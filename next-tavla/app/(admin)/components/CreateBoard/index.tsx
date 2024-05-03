'use client'
import {
    Button,
    IconButton,
    PrimaryButton,
    SecondaryButton,
} from '@entur/button'
import { Dropdown } from '@entur/dropdown'
import { Checkbox, TextField } from '@entur/form'
import { AddIcon, BackArrowIcon, ForwardIcon } from '@entur/icons'
import { Stepper } from '@entur/menu'
import { Modal } from '@entur/modal'
import { Heading3, Heading4, Label, Paragraph } from '@entur/typography'
import { useOrganizations } from 'app/(admin)/hooks/useOrganizations'
import { usePageParam } from 'app/(admin)/hooks/usePageParam'
import { useSearchParamsSetter } from 'app/(admin)/hooks/useSearchParamsSetter'
import { saveOrganization } from 'app/(admin)/organizations/components/CreateOrganization/actions'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { HiddenInput } from 'components/Form/HiddenInput'
import { SubmitButton } from 'components/Form/SubmitButton'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { TBoard, TOrganizationID } from 'types/settings'
import { TTile } from 'types/tile'
import { FormError } from '../FormError'
import { getOrganizationIfUserHasAccess } from 'app/(admin)/actions'
import { TileSelector } from '../TileSelector'
import { formDataToTile } from '../TileSelector/utils'
import { create } from './actions'
import { StopPlaceList } from './components/StopPlaceList'
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
            <IconButton as={Link} href="?board=name" className="gap-4 p-4">
                <AddIcon /> Opprett tavle
            </IconButton>
            <Modal
                open={open}
                size="large"
                className="flex flex-col items-center"
                onDismiss={() => {
                    setBoard(undefined)
                    setFormError(undefined)
                    router.push(pathname ?? '/')
                }}
                closeLabel="Avbryt opprettelse av tavle"
                data-theme="light"
            >
                <Stepper steps={stepTitles} activeIndex={stepIndex} />

                <div className="w-3/4">
                    <NameAndOrganizationSelector
                        active={pageParam === 'name'}
                        title={board?.meta?.title}
                        state={state}
                        setFormError={setFormError}
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
                            const personal = data.get('personal')
                            if (!organization && !personal) {
                                return setFormError(
                                    getFormFeedbackForError(
                                        'create/organization-missing',
                                    ),
                                )
                            }
                            setBoard({
                                tiles: [],
                                ...board,
                                meta: {
                                    ...board?.meta,
                                    title: name.substring(0, 30),
                                },
                            } as TBoard)
                            setOrganization(personal ? undefined : organization)
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
    setFormError,
    action,
}: {
    active: boolean
    title?: string
    state: TFormFeedback | undefined
    setFormError: (error: TFormFeedback | undefined) => void
    action: (data: FormData) => void
}) {
    const {
        organizations,
        selectedOrganization,
        setSelectedOrganization,
        fetchOrganizations,
    } = useOrganizations()
    const [personal, setPersonal] = useState<boolean>(false)
    const [newOrg, setNewOrg] = useState<boolean>(false)
    const orgName = useRef<HTMLInputElement>(null)

    if (!active) return null
    return (
        <form action={action}>
            <Heading3>Velg navn og organisasjon for tavlen</Heading3>
            <Paragraph>
                Gi tavlen et navn og legg den til i en organisasjon. Velger du
                en organisasjon vil alle i organisasjonen ha tilgang til tavlen.
            </Paragraph>
            <Label className="text-left">Gi tavlen et navn</Label>
            <TextField
                size="medium"
                label="Navn"
                id="name"
                name="name"
                maxLength={30}
                defaultValue={title}
                required
                {...getFormFeedbackForField('name', state)}
                className="mb-4"
            />
            <Heading4>Legg til i en organisasjon</Heading4>
            {!newOrg && (
                <>
                    <Label>Velg organisasjon</Label>
                    <Dropdown
                        items={organizations}
                        label="Organisasjon*"
                        selectedItem={selectedOrganization}
                        onChange={setSelectedOrganization}
                        clearable
                        className="mb-4"
                        aria-required="true"
                        disabled={personal}
                        {...getFormFeedbackForField('organization', state)}
                    />
                    {!selectedOrganization && (
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                            <IconButton
                                onClick={() => setNewOrg(true)}
                                className="justify-start gap-4 sm:gap-2"
                            >
                                <AddIcon /> Opprett ny organisasjon
                            </IconButton>
                            <Checkbox
                                checked={personal}
                                onChange={() => setPersonal(!personal)}
                                name="personal"
                            >
                                Jeg vil ikke velge organisasjon
                            </Checkbox>
                        </div>
                    )}
                </>
            )}
            <div>
                {newOrg && (
                    <div
                        className="w-full"
                        aria-live="polite"
                        aria-relevant="all"
                    >
                        <Label className="font-medium">
                            Opprett ny organisasjonen
                        </Label>
                        <TextField
                            size="medium"
                            label="Organisasjonsnavn"
                            required
                            aria-required
                            ref={orgName}
                            className="mb-4"
                            {...getFormFeedbackForField('organization', state)}
                        />
                        <FormError
                            {...getFormFeedbackForField('general', state)}
                        />
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                            <Button
                                variant="secondary"
                                onClick={() => setNewOrg(false)}
                            >
                                Avbryt
                            </Button>
                            <SubmitButton
                                variant="secondary"
                                aria-label="Opprett organisasjon"
                                onClick={async (event: React.MouseEvent) => {
                                    event.preventDefault()
                                    if (
                                        !orgName.current?.value ||
                                        /^\s*$/.test(orgName.current.value)
                                    ) {
                                        return setFormError(
                                            getFormFeedbackForError(
                                                'create/organization-missing',
                                            ),
                                        )
                                    }

                                    const duplicate = organizations().some(
                                        (organization) =>
                                            organization.label ===
                                            orgName.current?.value,
                                    )

                                    if (duplicate) {
                                        return setFormError(
                                            getFormFeedbackForError(
                                                'organization/name-exists',
                                            ),
                                        )
                                    }

                                    const oid = await saveOrganization(
                                        orgName.current.value,
                                    )
                                    fetchOrganizations()
                                    setSelectedOrganization({
                                        label: orgName.current.value,
                                        value: oid.toString(),
                                    })
                                    setNewOrg(false)
                                    setFormError(undefined)
                                }}
                            >
                                Opprett
                            </SubmitButton>
                        </div>
                    </div>
                )}
            </div>
            <HiddenInput
                id="organization"
                value={selectedOrganization?.value}
            />
            <div className="flex flex-row justify-end mt-8 ">
                <PrimaryButton>
                    Neste
                    <ForwardIcon />
                </PrimaryButton>
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
            <Heading3>Legg til stoppesteder i tavlen</Heading3>
            <Paragraph>
                Søk etter stoppesteder og bestem om tavla skal vise alle
                retninger, eller flere enkelte retninger.
            </Paragraph>
            <TileSelector
                action={async (data: FormData) => {
                    setFormError(undefined)
                    const organization = await getOrganizationIfUserHasAccess(
                        oid,
                    )
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
                oid={oid}
                showLabel
            />
            <Heading4 className="mt-6">Stoppesteder lagt til i tavlen</Heading4>
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
            <div className="flex flex-row justify-between pt-4">
                <SecondaryButton onClick={() => router.back()}>
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
