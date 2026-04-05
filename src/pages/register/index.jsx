import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [perfil, setPerfil] = useState(true) // default true
    const navigate = useNavigate()

    async function handleRegister(e){
        e.preventDefault()

        const response = await fetch('http://127.0.0.1:8000/auth/create_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                senha,
                perfil // envia booleano correto
            })
        })

        if(response.ok){
            alert('Usuário cadastrado com sucesso!')
            navigate('/') // volta para login
        } else {
            const errData = await response.json()
            alert('Erro ao cadastrar usuário: ' + (errData.detail || 'Desconhecido'))
        }
    }

    return (
        <div className="container">
            <form onSubmit={handleRegister}>
                <h1>Cadastro de Usuário</h1>

                <input 
                    placeholder="Nome"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
                <input 
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input 
                    placeholder="Senha"
                    type="password"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    required
                />

                <label>
                    Perfil:
                    <select value={perfil} onChange={e => setPerfil(e.target.value === 'true')}>
                        <option value="true">Administrador</option>
                        <option value="false">Usuário</option>
                    </select>
                </label>

                <button type="submit">Cadastrar</button>
            </form>

            <p>
                Já tem conta? <Link to="/">Voltar para Login</Link>
            </p>
        </div>
    )
}

export default Register