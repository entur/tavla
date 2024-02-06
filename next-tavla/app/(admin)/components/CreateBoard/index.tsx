'use client'
import { ToastProvider } from '@entur/alert'
import { IconButton, PrimaryButton, SecondaryButton } from '@entur/button'
import { AddIcon, BackArrowIcon, ForwardIcon } from '@entur/icons'
import { Stepper } from '@entur/menu'
import { Modal } from '@entur/modal'
import { useFormState } from 'react-dom'
import { createBoard } from './actions'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { FormError } from '../FormError'
import { Heading3, Paragraph } from '@entur/typography'
import { Name } from './Name'
import { Organization } from './Organization'
import Link from 'next/link'
import { usePageParam } from 'app/(admin)/hooks/usePageParam'
import { usePathname, useRouter } from 'next/navigation'
import { useSearchParamsSetter } from 'app/(admin)/hooks/useSearchParamsSetter'

function CreateBoard() {
    const [state, formAction] = useFormState(createBoard, undefined)
    const pathname = usePathname()
    const router = useRouter()
    const getPathWithParams = useSearchParamsSetter('create-board')
    const { open, hasPage, pageParam } = usePageParam('create-board')

    return (
        <ToastProvider>
            <IconButton as={Link} href="?create-board" className="g-2 p-2">
                <AddIcon /> Opprett tavle
            </IconButton>
            <Modal
                open={open}
                size="medium"
                onDismiss={() => router.push(pathname ?? '/')}
                closeLabel="Avbryt opprettelse av tavle"
            >
                <Stepper
                    steps={['Navn og organisasjon', 'Stoppesteder']}
                    activeIndex={0}
                    className="justifyCenter"
                />

                <form action={formAction}>
                    <div className={pageParam === '' ? '' : 'displayNone'}>
                        <Name />
                        <FormError
                            {...getFormFeedbackForField('general', state)}
                        />
                        <Organization />
                    </div>
                    <div className={pageParam === 'stops' ? '' : 'displayNone'}>
                        <Heading3>Legg til stoppesteder i Tavla </Heading3>
                        <Paragraph>
                            Søk etter stoppesteder og bestem om tavla skal vise
                            alle retninger, eller flere enkelte retninger.
                        </Paragraph>
                    </div>
                    <div className="flexRow justifyBetween">
                        {hasPage && (
                            <SecondaryButton
                                onClick={() => router.back()}
                                className="mt-2"
                            >
                                <BackArrowIcon />
                                Tilbake
                            </SecondaryButton>
                        )}
                        <PrimaryButton
                            as={Link}
                            href={getPathWithParams('start')}
                            className="mt-2"
                        >
                            Neste
                            <ForwardIcon />
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </ToastProvider>
    )
}

export { CreateBoard }
