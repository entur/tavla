import React from 'react'

import { FileUpload } from '@entur/fileupload'

import { uploadLogo } from '../../../../services/firebase'

import '@entur/fileupload/dist/styles.css'

const LogoUpload = ({ onChange }: Props): JSX.Element => {
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
                onChange(imageUrl)
            })
            .catch(() => {
                setError(true)
            })
    }

    return (
        <FileUpload
            accept="image/*"
            files={files}
            errorUpload={error}
            onDrop={handleDrop}
            onDelete={handleDelete}
            multiple={false}
        />
    )
}

interface Props {
    onChange: (url: string) => void
}

export default LogoUpload
