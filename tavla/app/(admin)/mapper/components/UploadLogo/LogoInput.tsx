'use client'
import { Button } from '@entur/button'
import { ImageIcon, UploadIcon } from '@entur/icons'
import { Loader } from '@entur/loader'
import { Label, Paragraph } from '@entur/typography'
import { FormError } from 'app/(admin)/components/FormError'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { HiddenInput } from 'components/Form/HiddenInput'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useRouter } from 'next/navigation'
import { ChangeEventHandler, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { FolderIdDB } from 'types/db-types/folders'

function LogoInput({ folderid }: { folderid?: FolderIdDB }) {
    const [state, setFormError] = useState<TFormFeedback | undefined>()
    const [file, setFile] = useState<File | null>(null)
    const [fileName, setFileName] = useState<string>()
    const router = useRouter()

    const clearLogo = () => {
        setFile(null)
        setFileName(undefined)
        setFormError(undefined)
    }

    const submit = async (data: FormData) => {
        const response = await fetch(`/api/upload`, {
            method: 'POST',
            body: data,
        })

        if (!response.ok) {
            clearLogo()
            switch (response.status) {
                case 400:
                    return setFormError(getFormFeedbackForError('file/invalid'))
                case 403:
                    return setFormError(
                        getFormFeedbackForError('auth/operation-not-allowed'),
                    )
                case 413:
                    return setFormError(
                        getFormFeedbackForError('file/size-too-big'),
                    )
                case 429:
                    return setFormError(
                        getFormFeedbackForError('file/rate-limit'),
                    )
                case 500:
                    return setFormError(
                        getFormFeedbackForError('firebase/general'),
                    )
                default:
                    return setFormError(getFormFeedbackForError('general'))
            }
        }

        clearLogo()
        router.refresh()
    }

    const setLogo: ChangeEventHandler<HTMLInputElement> = (e) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return

        setFile(selectedFile)
        setFileName(selectedFile.name)
    }

    return (
        <form action={submit} className="relative flex flex-col">
            <HiddenInput id="folderid" value={folderid} />
            <Label
                htmlFor="logo"
                className="flex w-full flex-col items-center justify-center rounded border-2 border-dashed border-primary p-4 hover:bg-tertiary"
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
                    required
                    aria-required
                />
            </Label>

            <div className="mt-2">
                <FormError {...getFormFeedbackForField('file', state)} />
                <FormError {...getFormFeedbackForField('general', state)} />
            </div>
            {file && (
                <div className="mt-4 flex flex-row justify-between gap-4">
                    <SubmitButton
                        variant="primary"
                        aria-label="Last opp logo"
                        className="w-full justify-center"
                    >
                        Last opp logo
                    </SubmitButton>
                    <Button
                        className="w-full justify-center"
                        onClick={clearLogo}
                        aria-label="Avbryt opplastning"
                        variant="secondary"
                    >
                        Avbryt
                    </Button>
                </div>
            )}
        </form>
    )
}

function Filename({ fileName }: { fileName?: string }) {
    const { pending } = useFormStatus()
    if (pending)
        return (
            <div className="flex h-full w-full flex-col items-center">
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
            <Paragraph className="text-center text-xs/6" margin="none">
                Maksimal størrelse: 10 MB
                <br />
                Filtyper: APNG, JPEG, PNG, SVG, GIF, WEBP.
            </Paragraph>
        </div>
    )
}

export { LogoInput }
