import { PrimaryButton } from '@entur/button'
import { TBoard, TOrganizationID } from 'types/settings'
import { useToast } from '@entur/alert'
import { createBoardRequest } from '../utils/create'
import router from 'next/router'

function CreateBoardButton({
    board,
    oid,
}: {
    board: TBoard
    oid?: TOrganizationID
}) {
    const { addToast } = useToast()
    const handleCreateBoard = async () => {
        if (!board?.tiles?.length) {
            return addToast({
                title: 'Ingen holdeplasser er lagt til',
                content: 'Vennligst legg til en holdeplass for å fortsette',
                variant: 'info',
            })
        }
        try {
            const response = await createBoardRequest(
                board?.tiles ?? [],
                board?.meta?.title ?? '',
                oid,
            )
            await router.push(`/edit/${response.bid}`)
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
        <PrimaryButton className="w-30" onClick={handleCreateBoard}>
            Opprett tavle
        </PrimaryButton>
    )
}

export { CreateBoardButton }
