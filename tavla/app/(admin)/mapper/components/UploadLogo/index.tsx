'use client'
import Image from 'next/image'
import { TOrganization } from 'types/settings'
import { LogoInput } from './LogoInput'
import { Paragraph } from '@entur/typography'
import { DeleteLogo } from './DeleteLogo'
import { Modal } from '@entur/modal'
import { useState } from 'react'
import { Button } from '@entur/button'
import { ImageIcon } from '@entur/icons'

function UploadLogo({ folder }: { folder: TOrganization }) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <Button variant="secondary" onClick={() => setIsOpen(true)}>
                Last opp logo <ImageIcon />
            </Button>
            <Modal
                open={isOpen}
                onDismiss={() => setIsOpen(false)}
                title="Last opp logo"
                size="medium"
            >
                <Paragraph>
                    Velg hvilken logo som skal vises på alle tavlene i mappen.
                </Paragraph>
                {folder.logo && (
                    <div className="relative flex items-center justify-center h-40 bg-black border-2 rounded border-tertiary mb-4">
                        <Image
                            src={folder.logo}
                            alt="Mappelogo"
                            objectFit="contain"
                            fill
                            className="p-8"
                        />
                    </div>
                )}
                {folder.logo && (
                    <DeleteLogo oid={folder.id} logo={folder.logo} />
                )}
                {!folder.logo && <LogoInput oid={folder.id} />}
            </Modal>
        </>
    )
}

export { UploadLogo }
