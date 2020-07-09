import React, { useState } from 'react'

import { FileUpload } from '@entur/fileupload'
import { FileRejection } from 'react-dropzone'
import { Label } from '@entur/typography'

import { uploadLogo } from '../../../../services/firebase'
import { useSettingsContext } from '../../../../settings'

import '@entur/fileupload/dist/styles.css'

const LogoUpload = (): JSX.Element => {
    const [, { setLogo }] = useSettingsContext()

    const [files, setFiles] = React.useState([])
    const [error, setError] = React.useState<string>()
    const [standbyText, setStandbyText] = useState(
        'Slipp logofilen din her eller klikk for å velge fil å laste opp',
    )

    const handleDelete = (): void => {
        setFiles([])
    }

    const handleDrop = (acceptedFiles?: File[]): void => {
        if (acceptedFiles.length === 0) return

        setStandbyText('Logoen din lastes opp')

        setError(undefined)

        const [file] = acceptedFiles

        uploadLogo(file)
            .then((imageUrl) => {
                setFiles(acceptedFiles)
                setLogo(imageUrl)
            })
            .catch(() => {
                setError('Filopplastingen var ikke vellykket')
            })
    }

    const handleReject = (rejections: FileRejection[]): void => {
        const { code, message } = rejections[0].errors[0]

        if (code === 'file-too-large') {
            setError('Filen kan ikke overskride 5MB')
        } else {
            setError(message)
        }
    }

    return (
        <>
            <Label>Filopplasting</Label>

            <FileUpload
                accept="image/*"
                files={files}
                errorUpload={!!error}
                errorText={error}
                onDrop={handleDrop}
                onDelete={handleDelete}
                onDropRejected={handleReject}
                multiple={false}
                maxSize={5 * 1024 * 1024}
                standbyText={standbyText}
            />
        </>
    )
}

export default LogoUpload
