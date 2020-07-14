import { https } from 'firebase-functions'
import { firestore, auth, initializeApp } from 'firebase-admin'

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
