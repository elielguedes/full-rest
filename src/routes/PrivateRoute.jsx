import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')

  if (!token || token === 'undefined') {
    // Redireciona para login se não existir token válido
    return <Navigate to="/" replace />
  }

  return children
}