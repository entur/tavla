import { TOrganization } from 'types/settings'
import EnturLogo from 'assets/logos/Tavla-white.svg'
import Image from 'next/image'
import { Link } from '@entur/typography'
import NextLink from 'next/link'
import { Actions } from './Actions'
import { IllustratedInfo } from 'app/(admin)/components/IllustratedInfo'
import { isEmpty } from 'lodash'
import { CreateOrganization } from '../../components/CreateOrganization'

function Organizations({
    userId,
    organizations,
}: {
    userId: string
    organizations: TOrganization[]
}) {
    if (isEmpty(organizations))
        return (
            <IllustratedInfo
                title="Her var det tomt!"
                description="Du har ikke opprettet noen mapper ennå."
            >
                <CreateOrganization />
            </IllustratedInfo>
        )
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {organizations.map((organization) => (
                <div
                    className=" border rounded-md shadow-sm"
                    key={organization.id}
                >
                    <div className="flex flex-col bg-grey60">
                        <div className="h-36 flex align-center justify-center relative">
                            <Image
                                src={organization.logo ?? EnturLogo}
                                alt="Logo til mappen"
                                fill
                                objectFit="contain"
                                className="py-12 px-8"
                            />
                        </div>
                        <div className="bg-grey80 p-4 flex flex-row justify-between gap-4">
                            <Link
                                as={NextLink}
                                href={`/folders/${organization.id}`}
                                className="!text-xl !font-bold truncate"
                            >
                                {organization.name}
                            </Link>
                            <Actions
                                organization={organization}
                                userId={userId}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export { Organizations }
