'use client'
import { Button } from '@entur/button'
import { ImageIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Paragraph } from '@entur/typography'
import Image from 'next/image'
import { useState } from 'react'
import { FolderDB } from 'src/types/db-types/folders'
import { DeleteLogo } from './DeleteLogo'
import { LogoInput } from './LogoInput'

function UploadLogo({ folder }: { folder: FolderDB }) {
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
                    <div className="relative mb-4 flex h-40 items-center justify-center rounded border-2 border-tertiary bg-black">
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
                    <DeleteLogo folderid={folder.id} logo={folder.logo} />
                )}
                {!folder.logo && <LogoInput folderid={folder.id} />}
            </Modal>
        </>
    )
}

export { UploadLogo }
