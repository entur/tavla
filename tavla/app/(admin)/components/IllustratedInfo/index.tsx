import Image from 'next/image'
import animals from 'assets/illustrations/Animals.png'
import { Heading2, LeadParagraph } from '@entur/typography'

function IllustratedInfo({
    title,
    description,
    children,
}: {
    title: string
    description: string
    children?: React.ReactNode
}) {
    return (
        <div className="flex flex-col items-center bg-secondary rounded pb-16">
            <Image src={animals} aria-hidden="true" alt="" />
            <Heading2 className="my-4">{title}</Heading2>
            <LeadParagraph className="text-center">{description}</LeadParagraph>
            {children}
        </div>
    )
}

export { IllustratedInfo }
