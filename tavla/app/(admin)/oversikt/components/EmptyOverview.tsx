import leafs from 'assets/illustrations/leafs.svg'
import Image from 'next/image'
import { Heading4 } from '@entur/typography'

interface EmptyOverviewProps {
    text?: string
}

const EmptyOverview: React.FC<EmptyOverviewProps> = ({ text }) => {
    return (
        <div className="mb-20 flex h-full flex-col items-center justify-center">
            <Image src={leafs} alt="" className="mx-auto h-1/4 w-1/4" />
            <Heading4 className="text-center">{text}</Heading4>
        </div>
    )
}

export default EmptyOverview
