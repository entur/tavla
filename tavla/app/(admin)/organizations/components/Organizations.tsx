import { TOrganization } from 'types/settings'
import EnturLogoBlue from 'assets/logos/Tavla-blue.svg'
import Image from 'next/image'
import { Link } from '@entur/typography'
import NextLink from 'next/link'
import { Actions } from './Actions'
import { IllustratedInfo } from 'app/(admin)/components/IllustratedInfo'
import { isEmpty } from 'lodash'

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
                title="Her var det tomt"
                description="Du er ikke en del av noen organisasjoner ennå"
            />
        )
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {organizations.map((organization) => (
                <div
                    className=" border rounded-md shadow-sm"
                    key={organization.id}
                >
                    <div className="flex flex-col">
                        <div className="h-36 flex align-center justify-center relative">
                            <Image
                                src={organization.logo ?? EnturLogoBlue}
                                alt="Logo til organisasjonen"
                                fill
                                objectFit="contain"
                                className="py-12 px-8"
                            />
                        </div>
                        <div className="bg-gray-100 p-4 flex flex-row justify-between gap-4">
                            <Link
                                as={NextLink}
                                href={`/organizations/${organization.id}`}
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
