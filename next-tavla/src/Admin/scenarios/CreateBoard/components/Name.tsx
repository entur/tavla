import { PrimaryButton } from '@entur/button'
import { TextField } from '@entur/form'
import { Heading3, Paragraph } from '@entur/typography'
import { TCreatePage } from 'Admin/types/createBoard'
import { SyntheticEvent, useCallback } from 'react'
import { TBoard } from 'types/settings'
import { useCreateBoardDispatch } from '../utils/context'
import { useToast } from '@entur/alert'
function Name({
    board,
    pushPage,
}: {
    board: TBoard
    pushPage: (page: TCreatePage) => void
}) {
    const { addToast } = useToast()
    const dispatch = useCreateBoardDispatch()
    const autoSelect = useCallback((ref: HTMLInputElement) => {
        ref?.select()
    }, [])

    const handleSetName = (event: SyntheticEvent) => {
        event.preventDefault()

        const data = event.currentTarget as unknown as {
            name: HTMLInputElement
        }
        const name = data.name.value

        if (!name) {
            return addToast({
                title: 'Ingen navn er satt',
                content: 'Vennligst sett et navn på tavla',
                variant: 'info',
            })
        }

        dispatch({
            type: 'setTitle',
            title: name,
        })
        pushPage('addStops')
    }

    return (
        <div className="flexColumn g-2 h-100">
            <Heading3>Hva skal tavla hete?</Heading3>
            <Paragraph>
                Gi tavla et navn slik at det blir enklere å finne den igjen
                senere.
            </Paragraph>
            <form onSubmit={handleSetName} className="flexColumn g-2">
                <TextField
                    name="name"
                    label="Navn på tavla"
                    placeholder="Navn på tavla"
                    value={board?.meta?.title}
                    aria-label="Sett navn på tavla"
                    ref={autoSelect}
                />
                <PrimaryButton type="submit">Neste</PrimaryButton>
            </form>
        </div>
    )
}

export { Name }
