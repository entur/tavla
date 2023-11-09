'use client'

import { useState } from 'react'
import classes from './styles.module.css'
import { UploadIcon } from '@entur/icons'

function UploadElement() {
    const [file, setFile] = useState()
    return (
        <div>
            <label htmlFor="logo" className={classes.upload}>
                <div className="flexColumn alignCenter g-2">
                    {file ? (
                        <div>{file}</div>
                    ) : (
                        <>
                            <UploadIcon size={32} />
                            Klikk her for å laste opp en logo
                        </>
                    )}
                </div>
            </label>
            <input
                type="file"
                name="logo"
                accept="image/*"
                required
                id="logo"
                style={{ display: 'none' }}
                onChange={(e) => setFile(e.target.files[0]?.name)}
            />
        </div>
    )
}

export { UploadElement }
