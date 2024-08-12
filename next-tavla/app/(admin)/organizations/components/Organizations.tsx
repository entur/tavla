import { TOrganization } from 'types/settings'
import EnturLogoBlue from 'assets/logos/Tavla-blue.svg'
import Image from 'next/image'
import { Link, Paragraph } from '@entur/typography'
import NextLink from 'next/link'
import { Actions } from './Actions'

function Organizations({
    userId,
    organizations,
}: {
    userId: string
    organizations: TOrganization[]
}) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {organizations.map((organization) => (
                <div
                    className="w-full h-64 border rounded-md shadow-sm"
                    key={organization.id}
                >
                    <div className="h-full w-full grid grid-rows-2">
                        <div className="flex align-center justify-center">
                            <Image
                                src={organization.logo ?? EnturLogoBlue}
                                alt="Logo til organisasjonen"
                                height={64}
                                width={64}
                                className="min-w-full h-auto px-10 py-6"
                            />
                        </div>
                        <div className="bg-gray-100 p-4">
                            <div className="flex flex-row justify-between">
                                <Link
                                    as={NextLink}
                                    href={`/organizations/${organization.id}`}
                                    className="!text-xl !font-bold"
                                >
                                    {organization.name}
                                </Link>
                                <Actions
                                    organization={organization}
                                    userId={userId}
                                />
                            </div>
                            <Paragraph className="py-2 !text-xs" margin="none">
                                Rolle:{' '}
                                {organization.owners?.includes(userId)
                                    ? 'Eier'
                                    : 'Medlem'}
                            </Paragraph>
                            <Paragraph className="!text-xs" margin="none">
                                Antall tavler: {organization.boards?.length}
                            </Paragraph>
                            <Paragraph className="!text-xs" margin="none">
                                Antall medlemmer:{' '}
                                {(organization.editors?.length ?? 0) +
                                    (organization.owners?.length ?? 0)}
                            </Paragraph>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export { Organizations }
