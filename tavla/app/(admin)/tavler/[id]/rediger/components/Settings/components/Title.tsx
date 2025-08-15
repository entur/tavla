'use client'
import { Heading4 } from '@entur/typography'
import { TFormFeedback } from 'app/(admin)/utils'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
function Title({
    title,
    feedback,
    onBlur,
}: {
    title: string
    feedback?: TFormFeedback
    onBlur: () => void
}) {
    return (
        <div>
            <Heading4 margin="bottom">Navn</Heading4>
            <ClientOnlyTextField
                name="title"
                className="w-full"
                defaultValue={title}
                label="Navn på tavlen"
                maxLength={50}
                onBlur={onBlur}
                {...feedback}
            />
        </div>
    )
}
export { Title }
