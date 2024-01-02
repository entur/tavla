'use client'
import { ChangeEventHandler, useRef, useState } from 'react'
import classes from './styles.module.css'
import { ImageIcon, UploadIcon } from '@entur/icons'
import { FormError } from 'app/(admin)/components/FormError'
import { TFormFeedback, getFormFeedbackForField } from 'app/(admin)/utils'

function LogoInput({ state }: { state: TFormFeedback | undefined }) {
    const [file, setFile] = useState('')
    const [fileName, setFileName] = useState<string>()
    const input = useRef(null)

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
        <div className="positionRelative">
            <label htmlFor="logo" className={classes.upload}>
                <Filename fileName={fileName} />
                <input
                    ref={input}
                    tabIndex={1}
                    className={classes.fileInput}
                    type="file"
                    name="logo"
                    accept="image/*"
                    id="logo"
                    onChange={setLogo}
                    onDragOver={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                    value={file}
                    required
                />
            </label>
            <div className="mt-2">
                <FormError {...getFormFeedbackForField('file', state)} />
            </div>
            {file && (
                <div className="flexRow justifyBetween g-2 mt-2">
                    <button
                        className="secondaryButton w-100 justifyCenter"
                        onClick={clearLogo}
                    >
                        Avbryt
                    </button>
                    <button
                        type="submit"
                        onSubmit={clearLogo}
                        className="secondaryButton w-100 justifyCenter"
                    >
                        Last opp logo
                    </button>
                </div>
            )}
        </div>
    )
}

function Filename({ fileName }: { fileName?: string }) {
    if (fileName)
        return (
            <div className="flexRow alignCenter g-2">
                <ImageIcon size={24} />
                {fileName}
            </div>
        )

    return (
        <div className="flexColumn g-2">
            <div className="flexRow alignCenter g-2">
                <UploadIcon size={24} />
                Klikk eller slipp et bilde her for å laste opp en logo
            </div>
            <div className={classes.fileSize}>Maksimal størrelse 10 MB</div>
        </div>
    )
}

export { LogoInput }
