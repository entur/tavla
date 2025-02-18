'use server'
import { isEmptyOrSpaces, isOnlyWhiteSpace } from 'app/(admin)/edit/utils'
import {
    InputType,
    TFormFeedback,
    getFormFeedbackForError,
} from 'app/(admin)/utils'
import { userCanEditBoard } from 'app/(admin)/utils/firebase'
import { handleError } from 'app/(admin)/utils/handleError'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { getBoard } from 'Board/scenarios/Board/firebase'
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TLocation } from 'types/meta'
import * as Sentry from '@sentry/nextjs'
export async function saveForm(data: FormData, location?: TLocation) {
    const user = await getUserFromSessionCookie()
    const bid = data.get('bid') as string
    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')
    const name = data.get('name') as string

    const viewType = data.get('viewType') as string
    const theme = data.get('theme') as string
    const font = data.get('font') as string
    const organizationString = data.get('organization') as string

    const organization =
        organizationString === 'undefined' ? undefined : organizationString
    const personal = data.get('personal') as string
    const fromOrg = data.get('fromOrg') as string
    const board = await getBoard(bid)
    const message = data.get('footer') as string
    const shouldOverrideOrgFooter = (data.get('override') as string) === 'on'
    let newFooter = {}

    const errors = {} as Record<InputType, TFormFeedback>

    if (isEmptyOrSpaces(name)) {
        errors['name'] = getFormFeedbackForError('board/tiles-name-missing')
    }

    if (!personal && !organization) {
        errors['organization'] = getFormFeedbackForError(
            'create/organization-missing',
        )
    }
    if (Object.keys(errors).length !== 0) {
        return errors
    }

    const validFooter =
        message && !isOnlyWhiteSpace(message) && message.trim() !== ''

    if (validFooter) {
        newFooter = { footer: message, override: shouldOverrideOrgFooter }
    } else if (shouldOverrideOrgFooter) {
        newFooter = { override: shouldOverrideOrgFooter }
    } else {
        newFooter = firestore.FieldValue.delete()
    }
    const shouldDeleteCombinedTiles = viewType === 'separate'
    try {
        await firestore()
            .collection('boards')
            .doc(bid)
            .update({
                combinedTiles: shouldDeleteCombinedTiles
                    ? firestore.FieldValue.delete()
                    : [{ ids: board?.tiles.map((tile) => tile.uuid) }],
                footer: newFooter,
                theme: theme ?? 'dark',
                'meta.title': name.substring(0, 50),
                'meta.fontSize': font,
                'meta.location': location ?? firestore.FieldValue.delete(),
                'meta.dateModified': Date.now(),
            })

        await firestore()
            .collection(fromOrg ? 'organizations' : 'users')
            .doc((fromOrg || user?.uid) ?? '')
            .update({
                [fromOrg ? 'boards' : 'owner']:
                    firestore.FieldValue.arrayRemove(bid),
            })

        await firestore()
            .collection(personal || !organization ? 'users' : 'organizations')
            .doc((personal || !organization ? user?.uid : organization) ?? '')
            .update({
                [personal || !organization ? 'owner' : 'boards']:
                    firestore.FieldValue.arrayUnion(bid),
            })

        revalidatePath(`/edit/${bid}`)
        return
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while moving board to new organization',
                boardID: bid,
                org: organization,
            },
        })
        errors['general'] = handleError(error)
        return errors
    }
}
