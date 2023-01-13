import React, { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ErrorCode } from 'react-dropzone'
import type { FileRejection } from 'react-dropzone'
import { FileUpload } from '@entur/fileupload'
import { Label, Link } from '@entur/typography'
import { DeleteIcon } from '@entur/icons'
import { Loader } from '@entur/loader'
import { uploadLogo } from '../../../../settings/firebase'
import { useSettings } from '../../../../settings/SettingsProvider'
import classes from './LogoUpload.module.scss'

const UPLOAD_ZONE_TEXT =
    'Slipp logofilen din her eller klikk for å velge fil å laste opp'

const LogoUpload = (): JSX.Element => {
    const [settings, setSettings] = useSettings()
    const [error, setError] = useState<string>()
    const [uploadVisible, setUploadVisible] = useState(!settings.logo)
    const [standbyText, setStandbyText] = useState(UPLOAD_ZONE_TEXT)
    const [progress, setProgress] = useState<number>()
    const { documentId } = useParams<{ documentId: string }>()

    const handleDrop = useCallback(
        (acceptedFiles?: File[]): void => {
            if (!acceptedFiles?.length) return

            const [file] = acceptedFiles
            if (!file) return

            setStandbyText('Logoen din lastes opp')
            setError(undefined)
            setProgress(0)

            const handleFinished = (imageUrl: string): void => {
                setSettings({ logo: imageUrl })
                setUploadVisible(false)
                setProgress(undefined)
            }

            const handleError = (): void => {
                setError('Filopplastingen var ikke vellykket')
                setProgress(undefined)
            }

            uploadLogo(
                file,
                setProgress,
                handleFinished,
                handleError,
                documentId,
            ).finally()
        },
        [documentId, setSettings],
    )

    const handleReject = useCallback((rejections: FileRejection[]): void => {
        const { code, message } = rejections[0]?.errors[0] || {}

        if (code === ErrorCode.FileTooLarge) {
            setError('Filen kan ikke overskride 5MB')
        } else {
            setError(message)
        }
    }, [])

    const handleReset = useCallback((): void => {
        setUploadVisible(true)
        setStandbyText(UPLOAD_ZONE_TEXT)
    }, [])

    const handleDelete = useCallback((): void => {
        setSettings({ logo: '' })
        handleReset()
    }, [handleReset, setSettings])

    return (
        <div className={classes.LogoUpload}>
            <Label className={classes.Label}>Filopplasting</Label>

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

                    {progress !== undefined && (
                        <Loader
                            className={classes.Loader}
                            progress={progress}
                        />
                    )}
                </>
            ) : (
                <div>
                    <img
                        className={classes.LogoPreviewImage}
                        src={settings.logo}
                    />
                    <div className={classes.LogoPreviewToolbar}>
                        <Link
                            className={classes.ToolbarLink}
                            onClick={handleReset}
                        >
                            Last opp ny logo
                        </Link>
                        <Link
                            className={classes.ToolbarLink}
                            onClick={handleDelete}
                        >
                            <DeleteIcon /> Slett logo
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export { LogoUpload }
