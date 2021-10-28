import { https, firestore as firestoreDB, region } from 'firebase-functions'
import { firestore, auth, initializeApp, storage } from 'firebase-admin'

initializeApp()

export const getImageUploadToken = https.onCall(async (data, context) => {
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

    const doc = await firestore()
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

    const uploadToken = await auth().createCustomToken(
        context.auth.uid,
        metadata,
    )

    return { uploadToken }
})

export const deleteImagefromStorage = firestoreDB
    .document('settings/{settingsID}')
    .onUpdate(async (change, context) => {
        if (change.before.data().logo && !change.after.data().logo) {
            try {
                const imageUrl: string = change.before.data().logo
                const imageIdMatch = imageUrl.match(/(?<=\%2F)(.*?)(?=\?)/)
                const path = `images/${
                    imageIdMatch ? imageIdMatch[0] : context.params.settingsID
                }`
                await storage().bucket().file(path).delete()
            } catch (error) {
                console.error(error)
                throw error
            }
        }
    })

export const scheduledDeleteOfDocumentsSetToBeDeleted = region('us-central1')
    .pubsub.schedule('every day 04:00')
    .timeZone('Europe/Oslo')
    .onRun(() => {
        try {
            const batch = firestore().batch()
            firestore()
                .collection('settings')
                .where('delete', '==', true)
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

export const getEmailsByUIDs = https.onCall(async (data, context) => {
    const ownerUIDs = data.ownersList.map((id: string) => ({ uid: id }))

    const ownerData = await auth()
        .getUsers(ownerUIDs)
        .then((getUsersResult) =>
            getUsersResult.users.map((user) => ({
                uid: user.uid,
                email: user.email,
            })),
        )
        .catch((error) => {
            throw new https.HttpsError(
                'invalid-argument',
                'Could not get requested owners of board.',
            )
        })

    if (ownerData.some((owner) => owner.uid === context.auth?.uid))
        return ownerData

    throw new https.HttpsError(
        'permission-denied',
        'You can not see owner of boards you are not a part of.',
    )
})

// export const getOwnersOfDocument = https.onCall(async (data, context) => {
//     const doc = await firestore().collection('settings').doc(data.boardID).get()
//     if (!doc.exists) {
//         throw new https.HttpsError(
//             'invalid-argument',
//             'UID must refer to an existing settings document.',
//         )
//     }
//     const docData = doc.data() ?? []
//     const ownerUIDs = docData.owners.map((id: string) => ({ uid: id }))

//     const ownerData = await auth()
//         .getUsers(ownerUIDs)
//         .then((getUsersResult) =>
//             getUsersResult.users.map((user) => ({
//                 uid: user.uid,
//                 email: user.email,
//             })),
//         )
//         .catch((error) => {
//             throw new https.HttpsError(
//                 'invalid-argument',
//                 'Could not get requested owners of board.',
//             )
//         })

//     if (ownerData.some((owner) => owner.uid === context.auth?.uid))
//         return ownerData

//     throw new https.HttpsError(
//         'permission-denied',
//         'You can not see owner of boards you are not a part of.',
//     )
// })
