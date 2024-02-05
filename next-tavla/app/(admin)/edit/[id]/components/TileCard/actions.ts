export async function deleteTile(bid: TBoardID, tile: TTile) {
    await firestore()
        .collection('boards')
        .doc(bid)
        .update({ tiles: firestore.FieldValue.arrayRemove(tile) })
    revalidatePath(`/edit/${bid}`)
}
