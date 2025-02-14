'use server'

import { isOnlyWhiteSpace } from 'app/(admin)/edit/utils'
import { TFormFeedback } from 'app/(admin)/utils'
import {
    initializeAdminApp,
    userCanEditBoard,
} from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { getBoard } from 'Board/scenarios/Board/firebase'
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TLocation } from 'types/meta'

initializeAdminApp()
export async function saveForm(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const user = await getUserFromSessionCookie()
    const bid = data.get('bid') as string
    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')
    const name = data.get('name') as string

    const viewType = data.get('viewType') as string
    const theme = data.get('theme') as string
    const font = data.get('font') as string
    const organization = data.get('organization') as string
    const location = JSON.parse(data.get('location') as string) as TLocation
    const personal = data.get('personal') as string
    const fromOrg = data.get('fromOrg') as string
    const board = await getBoard(bid)
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
    const shouldDeleteCombinedTiles = viewType === 'separate'
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
}
