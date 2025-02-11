'use server'

import { TFormFeedback } from 'app/(admin)/utils'

export function saveForm(prevState: TFormFeedback | undefined, data: FormData) {
    console.log('Data', Array.from(data.entries()))
}
