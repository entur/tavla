'use server'
import { TFormFeedback } from 'app/(admin)/utils'
import { revalidatePath } from 'next/cache'
import { deleteBoard, initializeAdminApp } from 'app/(admin)/utils/firebase'
import { redirect } from 'next/navigation'
import { handleError } from 'app/(admin)/utils/handleError'

initializeAdminApp()

export async function deleteBoardAction(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    try {
        const bid = data.get('bid') as string

        await deleteBoard(bid)
        revalidatePath('/')
    } catch (e) {
        return handleError(e)
    }
    redirect('/boards')
}
