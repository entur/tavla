'use client'
import { Modal } from '@entur/modal'
import { useState } from 'react'
import { TFormFeedback } from 'app/(admin)/utils'
import { useSearchParamsModal } from 'app/(admin)/hooks/useSearchParamsModal'
import { NameAndOrganizationSelector } from './NameAndOrganizationSelector'

function CreateBoard() {
    const [open, close] = useSearchParamsModal('board')

    const [formState, setFormError] = useState<TFormFeedback | undefined>()

    return (
        <>
            <Modal
                open={open}
                size="medium"
                onDismiss={() => {
                    setFormError(undefined)
                    close()
                }}
                closeLabel="Avbryt opprettelse av tavle"
            >
                <NameAndOrganizationSelector
                    formState={formState}
                    setFormError={setFormError}
                />
            </Modal>
        </>
    )
}

export { CreateBoard }
