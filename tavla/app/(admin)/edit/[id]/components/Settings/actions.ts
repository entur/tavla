'use server'
import {
    InputType,
    TFormFeedback,
    getFormFeedbackForError,
} from 'app/(admin)/utils'
import { userCanEditBoard } from 'app/(admin)/utils/firebase'
import { handleError } from 'app/(admin)/utils/handleError'
import { getBoard } from 'Board/scenarios/Board/firebase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TLocation } from 'types/meta'
import { setTheme } from '../ThemeSelect/actions'
import { TBoardID, TTheme } from 'types/settings'
import {
    moveBoard,
    saveFont,
    saveLocation,
    saveTitle,
} from '../MetaSettings/actions'
import { setViewType } from '../ViewType/actions'
import { setFooter } from '../Footer/actions'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

export async function userHasAccessToEdit(bid: string) {
    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')
}
export async function saveSettings(data: FormData, location?: TLocation) {
    const title = data.get('title') as string
    const bid = data.get('bid') as TBoardID
    const viewType = data.get('viewType') as string
    const theme = data.get('theme') as TTheme
    let organization = data.get('toOrg') as string | undefined
    if (organization === 'undefined') {
        organization = undefined
    }

    const personal = (data.get('personal') as string) === 'on'
    const fromOrg = data.get('fromOrg') as string
    const board = await getBoard(bid)
    const errors = {} as Record<InputType, TFormFeedback>

    try {
        const nameError = await saveTitle(bid, title)
        if (nameError) {
            errors['name'] = nameError
        }
        if (!board) {
            errors['general'] = getFormFeedbackForError('board/not-found')
        }

        const orgError = await moveBoard(bid, personal, organization, fromOrg)
        if (orgError) {
            errors['organization'] = orgError
        }

        if (Object.keys(errors).length !== 0) {
            return errors
        }

        await saveLocation(bid, location)
        await saveFont(bid, data)
        await setTheme(bid, theme)
        await setViewType(board!, viewType)
        await setFooter(bid, data)

        revalidatePath(`/edit/${bid}`)
    } catch (error) {
        if (isRedirectError(error)) {
            redirect('/')
        }

        errors['general'] = handleError(error)
        return errors
    }
}
