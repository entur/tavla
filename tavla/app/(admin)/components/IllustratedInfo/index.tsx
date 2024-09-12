import Image from 'next/image'
import animals from 'assets/illustrations/Animals.png'
import { Heading2, LeadParagraph } from '@entur/typography'
import { PrimaryButton } from '@entur/button'
import Link from 'next/link'
import { CreateBoard } from '../CreateBoard'
import { AddIcon } from '@entur/icons'

function IllustratedInfo({
    title,
    description,
    hasCreateButton = false,
}: {
    title: string
    description: string
    hasCreateButton?: boolean
}) {
    return (
        <div className="flex flex-col items-center bg-secondary rounded pb-16">
            <Image src={animals} aria-hidden="true" alt="" />
            <Heading2 className="my-4">{title}</Heading2>
            <LeadParagraph margin="bottom">{description}</LeadParagraph>
            {hasCreateButton && (
                <PrimaryButton as={Link} href="?board">
                    Opprett tavle <AddIcon /> <CreateBoard />
                </PrimaryButton>
            )}
        </div>
    )
}

export { IllustratedInfo }
