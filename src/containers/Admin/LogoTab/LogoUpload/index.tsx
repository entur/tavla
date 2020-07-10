import React, { useState } from 'react'

import { FileUpload } from '@entur/fileupload'
import { FileRejection } from 'react-dropzone'
import { Label, Link } from '@entur/typography'
import { DeleteIcon } from '@entur/icons'

import { uploadLogo } from '../../../../services/firebase'
import { useSettingsContext } from '../../../../settings'

import '@entur/fileupload/dist/styles.css'

const UPLOAD_ZONE_TEXT =
    'Slipp logofilen din her eller klikk for å velge fil å laste opp'

const LogoUpload = (): JSX.Element => {
    const [{ logo }, { setLogo }] = useSettingsContext()

    const [error, setError] = useState<string>()
    const [uploadVisible, setUploadVisible] = useState(!logo)
    const [standbyText, setStandbyText] = useState(UPLOAD_ZONE_TEXT)

    const handleDrop = (acceptedFiles?: File[]): void => {
        if (acceptedFiles.length === 0) return

        setStandbyText('Logoen din lastes opp')

        setError(undefined)

        const [file] = acceptedFiles

        uploadLogo(file)
            .then((imageUrl) => {
                setLogo(imageUrl)
                setUploadVisible(false)
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

    const handleReset = (): void => {
        setUploadVisible(true)
        setStandbyText(UPLOAD_ZONE_TEXT)
    }

    const handleDelete = (): void => {
        setLogo(null)
        handleReset()
    }

    return (
        <>
            <Label>Filopplasting</Label>

            {uploadVisible ? (
                <FileUpload
                    accept="image/*"
                    files={[]}
                    errorUpload={!!error}
                    errorText={error}
                    onDrop={handleDrop}
                    onDelete={handleReset}
                    onDropRejected={handleReject}
                    multiple={false}
                    maxSize={5 * 1024 * 1024}
                    standbyText={standbyText}
                />
            ) : (
                <div className="logo-preview">
                    <img src={logo} />
                    <div className="logo-preview-toolbar">
                        <Link onClick={handleReset}>Last opp ny fil</Link>
                        <DeleteIcon onClick={handleDelete} />
                    </div>
                </div>
            )}
        </>
    )
}

export default LogoUpload
