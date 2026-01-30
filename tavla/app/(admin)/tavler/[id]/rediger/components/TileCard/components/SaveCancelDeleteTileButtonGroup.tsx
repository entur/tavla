import { SmallAlertBox } from '@entur/alert'
import { Button, ButtonGroup, IconButton } from '@entur/button'
import { CloseIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'
import { SubmitButton } from 'app/(admin)/components/Form/SubmitButton'
import { TileContext } from 'app/(admin)/tavler/[id]/rediger/components/TileCard/context'
import { TFormFeedback } from 'app/(admin)/utils'
import { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import Goat from 'assets/illustrations/Goat.png'
import Image from 'next/image'
import { useNonNullContext } from 'src/hooks/useNonNullContext'
import { BoardDB, BoardTileDB } from 'src/types/db-types/boards'
import { DeleteTileButton } from './DeleteTileButton'

function SaveCancelDeleteTileButtonGroup({
    confirmOpen,
    hasTileChanged,
    resetTile,
    setIsTileOpen,
    setConfirmOpen,
    deleteTile,
    validation,
    trackingLocation,
}: {
    confirmOpen: boolean
    hasTileChanged: boolean
    resetTile: () => void
    setIsTileOpen: (isOpen: boolean) => void
    setConfirmOpen: (confirmOpen: boolean) => void
    deleteTile: (
        boardId: string,
        tile: BoardTileDB,
        demoBoard?: BoardDB,
    ) => void
    validation?: TFormFeedback
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
}) {
    const tile = useNonNullContext(TileContext)
    const posthog = usePosthogTracking()

    return (
        <>
            {validation?.feedback && (
                <SmallAlertBox variant="warning" className="mt-8 w-fit">
                    {validation.feedback}
                </SmallAlertBox>
            )}
            <div className="mt-8 flex flex-col justify-start gap-4 md:flex-row">
                <SubmitButton
                    variant="primary"
                    aria-label="lagre valg"
                    onClick={() => {
                        posthog.capture('stop_place_edit_saved', {
                            location: trackingLocation,
                        })
                    }}
                >
                    Lagre valg
                </SubmitButton>
                <Button
                    variant="secondary"
                    aria-label="avbryt"
                    type="button"
                    onClick={() => {
                        posthog.capture('stop_place_edit_cancelled', {
                            location: trackingLocation,
                            unsavedChanges: hasTileChanged,
                        })

                        if (hasTileChanged) return setConfirmOpen(true)
                        return setIsTileOpen(false)
                    }}
                >
                    Avbryt
                </Button>
                <DeleteTileButton
                    isWideScreen={false}
                    deleteTile={deleteTile}
                />
            </div>

            <Modal
                size="small"
                open={confirmOpen}
                onDismiss={() => setConfirmOpen(false)}
                closeLabel="Avbryt endring"
            >
                <IconButton
                    aria-label="Lukk"
                    onClick={() => setConfirmOpen(false)}
                    className="absolute right-4 top-4"
                >
                    <CloseIcon />
                </IconButton>
                <div className="flex flex-col items-center">
                    <Image alt="" src={Goat} className="h-1/2 w-1/2" />
                    <Heading3 margin="bottom" as="h1">
                        Lagre endringer
                    </Heading3>
                    <Paragraph>Du har endringer som ikke er lagret.</Paragraph>

                    <ButtonGroup className="flex flex-row">
                        <SubmitButton
                            variant="primary"
                            width="fluid"
                            form={tile.uuid}
                            aria-label="Lagre endringer"
                            onClick={() => {
                                posthog.capture('stop_place_edit_saved', {
                                    location: trackingLocation,
                                })
                            }}
                        >
                            Lagre
                        </SubmitButton>
                        <Button
                            type="button"
                            variant="secondary"
                            aria-label="Forkast endringer"
                            onClick={() => {
                                posthog.capture('stop_place_edit_discard', {
                                    location: trackingLocation,
                                })
                                resetTile()
                            }}
                        >
                            Forkast
                        </Button>
                    </ButtonGroup>
                </div>
            </Modal>
        </>
    )
}

export { SaveCancelDeleteTileButtonGroup }
