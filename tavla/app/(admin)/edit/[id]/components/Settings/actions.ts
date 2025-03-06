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
import { TBoard, TBoardID, TTheme } from 'types/settings'
import {
    moveBoard,
    saveFont,
    saveLocation,
    saveTitle,
} from '../MetaSettings/actions'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { isOnlyWhiteSpace } from 'app/(admin)/edit/utils'
import { firestore } from 'firebase-admin'
import * as Sentry from '@sentry/nextjs'
export async function userHasAccessToEdit(bid: string) {
    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')
}
export async function saveSettings(data: FormData) {
    const title = data.get('title') as string
    const bid = data.get('bid') as TBoardID
    const viewType = data.get('viewType') as string
    const theme = data.get('theme') as TTheme
    let organization = data.get('toOrg') as string | undefined
    if (organization === 'undefined') {
        organization = undefined
    }
    let location: TLocation | undefined | string = data.get(
        'newLocation',
    ) as string

    if (location) {
        location = JSON.parse(location) as TLocation
    } else {
        location = undefined
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
export async function setFooter(bid: TBoardID, data: FormData) {
    const access = userCanEditBoard(bid)
    if (!access) return redirect('/')

    const message = data.get('footer') as string
    const shouldOverrideOrgFooter = (data.get('override') as string) === 'on'

    let newFooter = {}

    const validFooter =
        message && !isOnlyWhiteSpace(message) && message.trim() !== ''

    if (validFooter) {
        newFooter = { footer: message, override: shouldOverrideOrgFooter }
    } else if (shouldOverrideOrgFooter) {
        newFooter = { override: shouldOverrideOrgFooter }
    } else {
        newFooter = firestore.FieldValue.delete()
    }
    try {
        await firestore().collection('boards').doc(bid).update({
            footer: newFooter,
            'meta.dateModified': Date.now(),
        })
        revalidatePath(`edit/${bid}`)
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while setting footer of board',
                boardID: bid,
            },
        })
        return handleError(error)
    }
}
export async function setTheme(bid: TBoardID, theme?: TTheme) {
    userHasAccessToEdit(bid)

    try {
        await firestore()
            .collection('boards')
            .doc(bid)
            .update({
                theme: theme ?? 'dark',
                'meta.dateModified': Date.now(),
            })

        revalidatePath(`/edit/${bid}`)
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while updating theme of board',
                boardID: bid,
                newTheme: theme,
            },
        })
        return handleError(error)
    }
}
export async function setViewType(board: TBoard, viewType: string) {
    const access = await userCanEditBoard(board.id)
    if (!access) return redirect('/')

    const shouldDeleteCombinedTiles = viewType === 'separate'

    try {
        await firestore()
            .collection('boards')
            .doc(board.id ?? '')
            .update({
                combinedTiles: shouldDeleteCombinedTiles
                    ? firestore.FieldValue.delete()
                    : [{ ids: board.tiles.map((tile) => tile.uuid) }],
                'meta.dateModified': Date.now(),
            })

        revalidatePath(`/edit/${board.id}`)
    } catch (e) {
        handleError(e)
    }
}
