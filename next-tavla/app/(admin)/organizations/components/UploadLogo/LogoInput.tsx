'use client'
import { ChangeEventHandler, useState } from 'react'
import { ImageIcon, UploadIcon } from '@entur/icons'
import { FormError } from 'app/(admin)/components/FormError'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { Label, Paragraph } from '@entur/typography'
import { Button } from '@entur/button'
import { useFormState, useFormStatus } from 'react-dom'
import { upload } from './actions'
import { HiddenInput } from 'components/Form/HiddenInput'
import { TOrganizationID } from 'types/settings'
import { SubmitButton } from 'components/Form/SubmitButton'
import { Loader } from '@entur/loader'

function LogoInput({ oid }: { oid?: TOrganizationID }) {
    const [state, action] = useFormState(upload, undefined)
    const [file, setFile] = useState('')
    const [fileName, setFileName] = useState<string>()

    const clearLogo = () => {
        setFile('')
        setFileName(undefined)
    }

    const setLogo: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target) return
        setFile(e.target.value)
        setFileName(e.target?.files?.item(0)?.name ?? 'Logo uten navn')
    }

    return (
        <form
            action={action}
            onSubmit={clearLogo}
            className="flex flex-col relative"
        >
            <HiddenInput id="oid" value={oid} />
            <Label
                htmlFor="logo"
                className="flex flex-col border-2 rounded-[0.5em] border-dashed border-[var(--primary-button-color)] w-full items-center justify-center p-2 hover:bg-[var(--tertiary-background-color)] p-4"
            >
                <Filename fileName={fileName} />
                <input
                    className="absolute h-full w-full text-transparent hover:cursor-pointer"
                    type="file"
                    name="logo"
                    accept="image/apng,image/jpeg,image/png,image/svg+xml,image/svg,image/webp"
                    id="logo"
                    aria-labelledby="logo"
                    onChange={setLogo}
                    onDragOver={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                    value={file}
                    required
                    aria-required
                />
            </Label>
            <div>
                <FormError {...getFormFeedbackForField('file', state)} />
                <FormError {...getFormFeedbackForField('general', state)} />
            </div>
            {file && (
                <div className="flex flex-row justify-between gap-4 mt-4">
                    <Button
                        className="w-full justify-center "
                        onClick={clearLogo}
                        aria-label="Avbryt opplastning"
                        variant="secondary"
                    >
                        Avbryt
                    </Button>
                    <SubmitButton
                        variant="primary"
                        aria-label="Last opp logo"
                        className="w-full justify-center "
                    >
                        Last opp logo
                    </SubmitButton>
                </div>
            )}
        </form>
    )
}

function Filename({ fileName }: { fileName?: string }) {
    const { pending } = useFormStatus()
    if (pending)
        return (
            <div className="flex flex-col w-full h-full items-center">
                <Paragraph>Laster opp logo..</Paragraph>
                <Loader className="w-full" />
            </div>
        )
    if (fileName)
        return (
            <div className="flex flex-row items-center gap-4">
                <ImageIcon size={24} />
                {fileName}
            </div>
        )

    return (
        <div className="flex flex-col py-4 font-medium">
            <div className="flex flex-row gap-4">
                <UploadIcon size={24} alt="" />
                <Paragraph margin="none">
                    Dra bilde eller klikk for å laste opp logo
                </Paragraph>
            </div>
            <Paragraph className="text-center text-[0.8em]" margin="none">
                Maksimal størrelse: 10 MB
                <br />
                Filtyper: APNG, JPEG, PNG, SVG, GIF, WEBP.
            </Paragraph>
        </div>
    )
}

export { LogoInput }
