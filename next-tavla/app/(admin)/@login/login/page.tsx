import Link from 'next/link'

function Login() {
    return (
        <>
            <Link href="/login">Logg inn</Link>

            <div
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgb(100,100,100,0.3)',
                    zIndex: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        width: 500,
                        height: 500,
                        backgroundColor: 'white',
                    }}
                ></div>
            </div>
        </>
    )
}

export default Login
