// ログイン画面
import { useState } from 'react'
import { supabase } from './lib/supabaseClient'

type LoginProps = {
    onLogin: () => void
}

function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async () => {
        setError('')
        setMessage('')

        if (email === '' || password === '') {
            setError('メールアドレスとパスワードを入力してください')
            return
        }

        if (isSignUp) {
            // 新規登録
            const { error } = await supabase.auth.signUp({
                email,
                password
            })

            if (error) {
                setError(error.message)
                return
            }
            setMessage('ユーザー登録が完了しました。メールを確認してください。')
        } else {
            // ログイン
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                setError(error.message)
                return
            }
            onLogin()
        }
    }
    return (
        <div className='login'>
            <h1>家計簿App_test</h1>

            <h2>{isSignUp ? '新規登録' : 'ログイン'}</h2>

            <input
                type='email'
                placeholder='メールアドレス'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type='passward'
                placeholder='パスワード'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleSubmit}>
                {isSignUp ? '登録' : 'ログイン'}
            </button>

            {error && <p>{error}</p>}
            {message && <p>{message}</p>}

            <button onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
                setMessage('')
            }}>
                {isSignUp ? 'ログイン' : '新規登録'}
            </button>
        </div>
    )
}

export default Login