import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const navigate = useNavigate()

  async function handleLoguin(e) {
    e.preventDefault()

    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', senha)

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/loguin-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      })

      if (!response.ok) {
        alert('Usuário ou senha inválidos')
        return
      }

      const data = await response.json()
      if (data.access_token) {
        localStorage.setItem('token', data.access_token)
        navigate('/home') // <<< vai pra home
      } else {
        alert('Erro ao fazer login')
      }
    } catch (err) {
      console.error(err)
      alert('Erro de conexão com o servidor')
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleLoguin}>
        <h1>Login</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>
      </form>

      <p>
        Não tem conta? <Link to="/register">Cadastre-se</Link>
      </p>
    </div>
  )
}

export default Login