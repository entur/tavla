'use server'

import { TFormFeedback } from 'app/(admin)/utils'

export async function saveForm(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    return prevState ? null : data
}
