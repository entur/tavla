import { https, region } from 'firebase-functions'
import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

/* eslint-disable no-console */

initializeApp()

export const getImageUploadToken = region('europe-west3').https.onCall(
    async (data, context) => {
        if (!context.auth) {
            throw new https.HttpsError(
                'failed-precondition',
                'The function must be called while authenticated.',
            )
        }

        if (typeof data.imageUid !== 'string') {
            throw new https.HttpsError(
                'invalid-argument',
                'Image UID must be a string.',
            )
        }

        const doc = await getFirestore()
            .collection('settings')
            .doc(data.imageUid)
            .get()

        if (!doc.exists) {
            throw new https.HttpsError(
                'invalid-argument',
                'Image UID must refer to an existing settings document.',
            )
        }

        const documentData = doc.data()

        if (
            !documentData ||
            (documentData.owners.length > 0 &&
                !documentData.owners.includes(context.auth.uid))
        ) {
            throw new https.HttpsError(
                'permission-denied',
                'Account running function must have access to settings document.',
            )
        }

        const metadata = {
            uploadUid: doc.exists && data.imageUid,
        }

        const uploadToken = await getAuth().createCustomToken(
            context.auth.uid,
            metadata,
        )

        return { uploadToken }
    },
)

export const deleteImagefromStorage = region('europe-west3')
    .firestore.document('settings/{settingsID}')
    .onUpdate(async (change, context) => {
        if (change.before.data().logo && !change.after.data().logo) {
            try {
                const imageUrl: string = change.before.data().logo
                const imageIdMatch = imageUrl.match(/(?<=%2F)(.*?)(?=\?)/)
                const path = `images/${
                    imageIdMatch ? imageIdMatch[0] : context.params.settingsID
                }`
                await getStorage().bucket().file(path).delete()
            } catch (error) {
                console.error(error)
                throw error
            }
        }
    })

export const scheduledDeleteOfDocumentsSetToBeDeleted = region('europe-west3')
    .pubsub.schedule('every day 04:00')
    .timeZone('Europe/Oslo')
    .onRun(() => {
        try {
            const batch = getFirestore().batch()
            getFirestore()
                .collection('settings')
                .where('isScheduledForDelete', '==', true)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        batch.delete(doc.ref)
                    })
                    console.log(
                        querySnapshot.size +
                            ' documents set to be batch deleted.',
                    )
                    return batch.commit()
                })
                .then(() => console.log('Successfull delete of batch.'))
        } catch (error) {
            console.error(error)
        }
        return null
    })

export const getOwnersDataByBoardIdAsOwner = region(
    'europe-west3',
).https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new https.HttpsError(
            'failed-precondition',
            'The function must be called while authenticated.',
        )
    }

    const boardRef = getFirestore().collection('settings').doc(data.boardId)
    const boardSnapshot = await boardRef.get()
    if (!boardSnapshot.exists) {
        throw new https.HttpsError(
            'invalid-argument',
            'Requested board was not found.',
        )
    }
    const boardOwners = boardSnapshot.data()?.owners
    if (!boardOwners.includes(context.auth?.uid)) {
        throw new https.HttpsError(
            'permission-denied',
            'You need to be an owner of this board to get data about other owners.',
        )
    }

    const boardOwnersMapped = boardOwners.map((id: string) => ({ uid: id }))

    try {
        const usersResult = await getAuth().getUsers(boardOwnersMapped)
        const ownersData = usersResult.users.map((user) => ({
            uid: user.uid,
            email: user.email,
        }))
        return ownersData
    } catch {
        throw new https.HttpsError(
            'invalid-argument',
            'Could not get requested data about owners.',
        )
    }
})

export const addInvitedUserToBoardOwners = region('europe-west3').https.onCall(
    async (data, context) => {
        if (!context.auth) {
            throw new https.HttpsError(
                'failed-precondition',
                'The function must be called while authenticated.',
            )
        }

        const boardRef = getFirestore().collection('settings').doc(data.boardId)
        const boardSnapshot = await boardRef.get()
        if (!boardSnapshot.exists) {
            throw new https.HttpsError(
                'invalid-argument',
                'Requested board was not found.',
            )
        }
        const boardOwners = boardSnapshot.data()?.owners

        try {
            const inviteForUserIfInvited = await getFirestore()
                .collection('settings')
                .doc(data.boardId)
                .collection('invites')
                .where('receiver', '==', context.auth.token.email)
                .limit(1)
                .get()

            if (!inviteForUserIfInvited.docs.length) {
                throw new https.HttpsError(
                    'permission-denied',
                    'Requested user does not have an invite for this board',
                )
            }
        } catch {
            throw new https.HttpsError(
                'permission-denied',
                'Requested user does not have an invite for this board',
            )
        }

        if (!boardOwners.includes(context.auth.uid)) {
            const ownersUpdated: string[] = [...boardOwners, context.auth.uid]
            boardRef.update({
                owners: ownersUpdated,
            })
        }
    },
)
