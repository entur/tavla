export type TLoginPage = 'email' | 'create' | 'reset'

export type TErrorType = 'email' | 'password' | 'repeat_password' | 'user'

export type TAuthError = { type: TErrorType; value: string }
