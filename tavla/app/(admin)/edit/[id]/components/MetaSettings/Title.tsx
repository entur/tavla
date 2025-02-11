'use client'
import { Heading4 } from '@entur/typography'
import { TFormFeedback } from 'app/(admin)/utils'
import dynamic from 'next/dynamic'
const TextField = dynamic(
    () => import('@entur/form').then((mod) => mod.TextField),
    { ssr: false },
)
function Title({
    title,
    feedback,
}: {
    title: string
    feedback?: TFormFeedback
}) {
    return (
        <div>
            <Heading4 margin="bottom">Navn</Heading4>
            <div className="h-full">
                <TextField
                    name="name"
                    className="w-full"
                    defaultValue={title}
                    label="Navn på tavlen"
                    maxLength={50}
                    {...feedback}
                />
            </div>
        </div>
    )
}
export { Title }
