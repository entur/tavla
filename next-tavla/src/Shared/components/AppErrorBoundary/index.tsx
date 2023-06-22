import React, { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Header } from 'components/Header'
import classes from 'styles/pages/board.module.css'

interface State {
    hasError: boolean
}

class AppErrorBoundary extends Component<{ children?: ReactNode }, State> {
    public state: State = {
        hasError: false,
    }

    public static getDerivedStateFromError(): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className={classes.root}>
                    <div className={classes.rootContainer}>
                        <Header />
                        <p className="pl-2">Feil ved visning av tavla</p>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export { AppErrorBoundary }
