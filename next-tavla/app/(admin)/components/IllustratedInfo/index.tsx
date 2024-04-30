import Image from 'next/image'
import animals from 'assets/illustrations/Animals.png'
import { Heading2, LeadParagraph } from '@entur/typography'

function IllustratedInfo({
    title,
    description,
}: {
    title: string
    description: string
}) {
    return (
        <div className="flex flex-col items-center bg-base-secondary rounded pb-16">
            <Image src={animals} aria-hidden="true" alt="" />
            <Heading2 className="my-4">{title}</Heading2>
            <LeadParagraph margin="bottom">{description}</LeadParagraph>
        </div>
    )
}

export { IllustratedInfo }
