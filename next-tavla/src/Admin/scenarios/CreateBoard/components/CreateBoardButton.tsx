import { PrimaryButton } from '@entur/button'
import { TBoard } from 'types/settings'
import { useToast } from '@entur/alert'
import { createBoardRequest } from '../utils/create'
import router from 'next/router'

function CreateBoardButton({ board }: { board: TBoard }) {
    const { addToast } = useToast()
    const handleCreateBoard = async () => {
        if (!board?.tiles?.length) {
            return addToast({
                title: 'Ingen holdeplasser er lagt til',
                content: 'Vennligst legg til holdeplasser',
                variant: 'info',
            })
        }
        try {
            const response = await createBoardRequest(
                board?.tiles ?? [],
                board?.meta?.title ?? '',
            )
            router.push(`/edit/${response.bid}`)
            router.reload()
        } catch (error) {
            addToast({
                title: 'Noe gikk galt',
                content: 'Vennligst prøv igjen',
                variant: 'info',
            })
        }
    }
    return (
        <PrimaryButton onClick={handleCreateBoard}>Opprett tavle</PrimaryButton>
    )
}

export { CreateBoardButton }
