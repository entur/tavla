import React from 'react'

import { FileUpload } from '@entur/fileupload'
import { Heading4 } from '@entur/typography'

import { uploadLogo } from '../../../../services/firebase'
import { useSettingsContext } from '../../../../settings'

import '@entur/fileupload/dist/styles.css'

const LogoUpload = (): JSX.Element => {
    const [, { setLogo }] = useSettingsContext()

    const [files, setFiles] = React.useState([])
    const [error, setError] = React.useState(false)

    const handleDelete = (): void => {
        setFiles([])
    }

    const handleDrop = (acceptedFiles?: File[]): void => {
        if (!acceptedFiles) return

        const [file] = acceptedFiles

        uploadLogo(file)
            .then((imageUrl) => {
                setFiles(acceptedFiles)
                setLogo(imageUrl)
            })
            .catch(() => {
                setError(true)
            })
    }

    return (
        <>
            <Heading4>Filopplasting</Heading4>

            <FileUpload
                accept="image/*"
                files={files}
                errorUpload={error}
                onDrop={handleDrop}
                onDelete={handleDelete}
                multiple={false}
            />
        </>
    )
}

export default LogoUpload
