'use server'
import { getOrganizationIfUserHasAccess } from 'app/(admin)/actions'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import admin, { firestore } from 'firebase-admin'
import { redirect } from 'next/navigation'
import { TBoard, TOrganization, TOrganizationID } from 'types/settings'
import * as Sentry from '@sentry/nextjs'

initializeAdminApp()

export async function duplicateBoard(board: TBoard, oid?: TOrganizationID) {
    const user = await getUserFromSessionCookie()
    if (!user) return getFormFeedbackForError('auth/operation-not-allowed')

    let organization: TOrganization | undefined
    if (oid) organization = await getOrganizationIfUserHasAccess(oid)

    let createdBoard = null

    try {
        createdBoard = await firestore()
            .collection('boards')
            .add({
                ...board,
                meta: {
                    ...board.meta,
                    fontSize:
                        board.meta?.fontSize ??
                        organization?.defaults?.font ??
                        'medium',
                    created: Date.now(),
                    dateModified: Date.now(),
                },
            })

        if (!createdBoard || !createdBoard.id)
            throw Error('failed to create board')

        firestore()
            .collection(oid ? 'organizations' : 'users')
            .doc(oid ? String(oid) : String(user.uid))
            .update({
                [oid ? 'boards' : 'owner']:
                    admin.firestore.FieldValue.arrayUnion(createdBoard.id),
            })
    } catch (error) {
        Sentry.captureMessage('Error while duplicating board object: ' + board)
        throw error
    }
    redirect(`/tavler/${createdBoard.id}/rediger`)
}
