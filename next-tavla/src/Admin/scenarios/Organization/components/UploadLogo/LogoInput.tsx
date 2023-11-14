'use client'
import { ChangeEventHandler, useRef, useState } from 'react'
import classes from './styles.module.css'
import { ImageIcon, UploadIcon } from '@entur/icons'

function LogoInput() {
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
        <div>
            <label htmlFor="logo" className={classes.upload}>
                <Filename fileName={fileName} />
            </label>
            <input
                ref={input}
                type="file"
                name="logo"
                accept="image/*"
                id="logo"
                style={{ display: 'none' }}
                onChange={setLogo}
                value={file}
                required
            />
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
        <div className="flexRow alignCenter g-2">
            <UploadIcon size={24} />
            Klikk her for å laste opp en logo
        </div>
    )
}

export { LogoInput }
