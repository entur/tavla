import { Paragraph } from '@entur/typography'
import classNames from 'classnames'
import { HTMLProps } from 'react'

type TChecked = 'indeterminate' | 'inherently-enabled' | boolean

function Checkbox({
    className,
    disabled,
    checked,
    children,
    ...rest
}: { checked: TChecked } & Omit<HTMLProps<HTMLInputElement>, 'checked'>) {
    return (
        <label
            className={classNames('eds-checkbox__container', className, {
                'eds-checkbox--disabled': disabled,
            })}
        >
            <input
                type="checkbox"
                checked={checked !== false}
                disabled={disabled}
                {...rest}
            />
            <span
                className={classNames('eds-checkbox__icon', {
                    'eds-checkbox__icon--disabled': disabled,
                })}
            >
                <CheckboxIcon checked={checked} />
            </span>
            {children && (
                <Paragraph
                    className="eds-checkbox__label"
                    margin="none"
                    as="span"
                >
                    {children}
                </Paragraph>
            )}
        </label>
    )
}

function CheckboxIcon({ checked }: { checked: TChecked }) {
    return (
        <svg
            className="eds-checkbox-icon"
            width="11px"
            height="9px"
            viewBox="6 11 37 33"
            aria-hidden={true}
            style={{
                backgroundColor:
                    checked === 'inherently-enabled'
                        ? 'var(--primary-background-color)'
                        : undefined,
            }}
        >
            {checked === 'indeterminate' ? (
                <rect x="10" y="25" width="28" height="5" fill="white" />
            ) : (
                <path
                    d="M14.1 27.2l7.1 7.2 14.6-14.8"
                    fill="none"
                    style={{
                        stroke:
                            checked === 'inherently-enabled'
                                ? 'var(--border-color)'
                                : undefined,
                    }}
                />
            )}
        </svg>
    )
}

export { Checkbox }
