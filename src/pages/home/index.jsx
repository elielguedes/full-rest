
import { Link } from 'react-router-dom'
import './style.css'

function Home(){
  return (
    <div className="container">
      <h1>Bem-vindo ao sistema</h1>
      <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '250px' }}>
        <Link to="/cnes">
          <button style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white' }}>Cadastrar Unidade de Saúde</button>
        </Link>
        <Link to="/update-cnes">
          <button style={{ width: '100%', padding: '10px', backgroundColor: '#2196F3', color: 'white' }}>Atualizar Unidade de Saúde</button>
        </Link>
      </div>
    </div>
  )
}
export default Home