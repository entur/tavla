'use client'
import { useToast } from '@entur/alert'
import { Switch } from '@entur/form'
import { ValidationInfoFilledIcon } from '@entur/icons'
import { Heading3 } from '@entur/typography'
import { SubmitButton } from 'components/Form/SubmitButton'
import { TBoardID, TFooter } from 'types/settings'
import { setFooter as setFooterAction } from './actions'
import { useActionState, useState } from 'react'
import { Tooltip } from '@entur/tooltip'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import { getFormFeedbackForField, TFormFeedback } from 'app/(admin)/utils'
import { FormError } from 'app/(admin)/components/FormError'

function Footer({
    bid,
    footer,
    organizationBoard,
}: {
    bid: TBoardID
    footer?: TFooter
    organizationBoard: boolean
}) {
    const { addToast } = useToast()
    const [override, setOverride] = useState(footer?.override ?? false)

    const setFooter = async (
        state: TFormFeedback | undefined,
        data: FormData,
    ) => {
        const formFeedback = await setFooterAction(state, bid, data)

        if (!formFeedback) {
            addToast('Infomelding lagret!')
        }
        return formFeedback
    }

    const [footerState, setFooterFormAction] = useActionState(
        setFooter,
        undefined,
    )

    return (
        <form className="box flex flex-col" action={setFooterFormAction}>
            <div className="flex flex-row items-center gap-2">
                <Heading3 margin="bottom">Infomelding</Heading3>

                <Tooltip
                    content="Skriv en kort tekst som skal vises nederst i tavlen."
                    placement="top"
                    id="tooltip-footer"
                >
                    <ValidationInfoFilledIcon className="mb-3" size={20} />
                </Tooltip>
            </div>
            <div className="h-full">
                <ClientOnlyTextField
                    label="Infomelding"
                    name="footer"
                    defaultValue={footer?.footer ?? ''}
                    readOnly={override && organizationBoard}
                    className="w-full"
                />
                {organizationBoard && (
                    <Switch
                        checked={override}
                        onChange={() => setOverride(!override)}
                        name="override"
                    >
                        Vis infomelding fra organisasjonen.
                    </Switch>
                )}
                <div className="mt-4">
                    <FormError
                        {...getFormFeedbackForField('general', footerState)}
                    />
                </div>
            </div>
            <div className="flex flex-row mt-8 justify-end">
                <SubmitButton
                    variant="secondary"
                    aria-label="Lagre infomelding"
                    className="max-sm:w-full"
                >
                    Lagre infomelding
                </SubmitButton>
            </div>
        </form>
    )
}

export { Footer }
