import Image from 'next/image'
import animals from 'assets/illustrations/Animals.png'
import { Heading2, LeadParagraph } from '@entur/typography'
import classes from './styles.module.css'

function IllustratedInfo({
    title,
    description,
}: {
    title: string
    description: string
}) {
    return (
        <div className={classes.info}>
            <Image src={animals} aria-hidden="true" alt="" />
            <Heading2 className={classes.infoHeading}>{title}</Heading2>
            <LeadParagraph className="pb-4 mt-0">{description} </LeadParagraph>
        </div>
    )
}

export { IllustratedInfo }
