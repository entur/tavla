import leafs from 'assets/illustrations/leafs.svg'
import Image from 'next/image'
import { Heading4 } from '@entur/typography'

interface EmptyOverviewProps {
    text?: string
}

const EmptyOverview: React.FC<EmptyOverviewProps> = ({ text }) => {
    return (
        <div className="flex flex-col gap-4 items-center justify-center h-full">
            <Image src={leafs} alt="" className="h-1/4 w-1/4 mx-auto" />
            <Heading4 className="text-center">{text}</Heading4>
        </div>
    )
}

export default EmptyOverview
