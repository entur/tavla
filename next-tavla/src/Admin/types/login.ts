export type TLoginPage = 'start' | 'email' | 'create'

export type TErrorType = 'email' | 'password' | 'repeat_password' | 'user'

export type TAuthError = { type: TErrorType; value: string }
