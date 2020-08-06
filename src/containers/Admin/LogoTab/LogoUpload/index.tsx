import React, { useState } from 'react'

import { FileUpload } from '@entur/fileupload'
import { FileRejection } from 'react-dropzone'
import { Label, Link } from '@entur/typography'
import { DeleteIcon } from '@entur/icons'
import { Loader } from '@entur/loader'

import { uploadLogo } from '../../../../services/firebase'
import { useSettingsContext } from '../../../../settings'

import '../styles.scss'

const UPLOAD_ZONE_TEXT =
    'Slipp logofilen din her eller klikk for å velge fil å laste opp'

const LogoUpload = (): JSX.Element => {
    const [settings, { setLogo }] = useSettingsContext()

    const logo = settings?.logo

    const [error, setError] = useState<string>()
    const [uploadVisible, setUploadVisible] = useState(!logo)
    const [standbyText, setStandbyText] = useState(UPLOAD_ZONE_TEXT)
    const [progress, setProgress] = useState<number>()

    const handleDrop = (acceptedFiles?: File[]): void => {
        if (!acceptedFiles?.length) return

        setStandbyText('Logoen din lastes opp')
        setError(undefined)
        setProgress(0)

        const [file] = acceptedFiles

        const handleFinished = (imageUrl: string): void => {
            setLogo(imageUrl)
            setUploadVisible(false)
            setProgress(undefined)
        }

        const handleError = (): void => {
            setError('Filopplastingen var ikke vellykket')
            setProgress(undefined)
        }

        uploadLogo(file, setProgress, handleFinished, handleError)
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
            <Label className="label">Filopplasting</Label>

            {uploadVisible ? (
                <>
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

                    {progress !== undefined && <Loader progress={progress} />}
                </>
            ) : (
                <div className="logo-preview">
                    <img src={logo} />
                    <div className="logo-preview-toolbar">
                        <Link onClick={handleReset}>Last opp ny logo</Link>
                        <Link onClick={handleDelete}>
                            <DeleteIcon onClick={handleDelete} /> Slett logo
                        </Link>
                    </div>
                </div>
            )}
        </>
    )
}

export default LogoUpload
