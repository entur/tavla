import { SmallAlertBox } from '@entur/alert'
import { Button, ButtonGroup, IconButton } from '@entur/button'
import { CloseIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'
import Goat from 'assets/illustrations/Goat.png'
import { TileContext } from 'Board/scenarios/Table/contexts'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useNonNullContext } from 'hooks/useNonNullContext'
import Image from 'next/image'
import { TBoard } from 'types/settings'
import { TTile } from 'types/tile'
import { DeleteTileButton } from './DeleteTileButton'

function SaveCancelDeleteTileButtonGroup({
    confirmOpen,
    hasTileChanged,
    resetTile,
    setIsTileOpen,
    setConfirmOpen,
    deleteTile,
    showValidationError = false,
}: {
    confirmOpen: boolean
    hasTileChanged: boolean
    resetTile: () => void
    setIsTileOpen: (isOpen: boolean) => void
    setConfirmOpen: (confirmOpen: boolean) => void
    deleteTile: (boardId: string, tile: TTile, demoBoard?: TBoard) => void
    showValidationError?: boolean
}) {
    const tile = useNonNullContext(TileContext)
    return (
        <>
            <div className="mt-8 flex flex-col justify-start gap-4 md:flex-row">
                <SubmitButton variant="primary" aria-label="lagre valg">
                    Lagre valg
                </SubmitButton>
                <Button
                    variant="secondary"
                    aria-label="avbryt"
                    type="button"
                    onClick={() => {
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
                {showValidationError && (
                    <SmallAlertBox variant="warning">
                        Du må velge en eller flere linjer for å lagre
                    </SmallAlertBox>
                )}
            </div>

            <Modal
                size="small"
                open={confirmOpen}
                onDismiss={resetTile}
                closeLabel="Avbryt endring"
            >
                <IconButton
                    aria-label="Lukk"
                    onClick={resetTile}
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
                        >
                            Lagre
                        </SubmitButton>
                        <Button
                            type="button"
                            variant="secondary"
                            aria-label="Avbryt sletting"
                            onClick={resetTile}
                        >
                            Avbryt
                        </Button>
                    </ButtonGroup>
                </div>
            </Modal>
        </>
    )
}

export { SaveCancelDeleteTileButtonGroup }
