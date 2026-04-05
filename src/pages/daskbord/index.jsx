
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [usuarios, setUsuarios] = useState(0);
  const [unidades, setUnidades] = useState(0);
  const [locations, setLocations] = useState(0);
  const [gestoes, setGestoes] = useState(0);
  const [leitos, setLeitos] = useState(0);
  const [pipelineStatus, setPipelineStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');
      try {
        // Usuários
        const resUsers = await fetch('http://127.0.0.1:8000/user/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const usersData = await resUsers.json();
        setUsuarios(usersData.length);

        // Unidades de Saúde
        const resUnidades = await fetch('http://127.0.0.1:8000/unidade-saude/lista', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const unidadesData = await resUnidades.json();
        setUnidades(unidadesData.Unidades ? unidadesData.Unidades.length : 0);

        // Locations
        const resLocations = await fetch('http://127.0.0.1:8000/entidade2/listar-location', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const locationsData = await resLocations.json();
        setLocations(locationsData.locate ? locationsData.locate.length : 0);

        // Gestao
        const resGestao = await fetch('http://127.0.0.1:8000/entidade2/gestao/get', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const gestaoData = await resGestao.json();
        setGestoes(Array.isArray(gestaoData) ? gestaoData.length : 0);

        // Leitos
        const resLeitos = await fetch('http://127.0.0.1:8000/entidade2/leitos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const leitosData = await resLeitos.json();
        setLeitos(Array.isArray(leitosData) ? leitosData.length : 0);
      } catch (err) {
        alert('Erro ao buscar dados do dashboard');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function runPipeline() {
    setPipelineStatus("Executando...");
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:8000/pipeline/run', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPipelineStatus(data.mensagem || 'Executado!');
    } catch {
      setPipelineStatus("Erro ao executar pipeline");
    }
  }

  const data = {
    labels: ['Usuários', 'Unidades', 'Locations', 'Gestões', 'Leitos'],
    datasets: [
      {
        label: 'Total',
        data: [usuarios, unidades, locations, gestoes, leitos],
        backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336'],
      },
    ],
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #f5f5f5 60%, #e0e7ff 100%)',
      color: '#222',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 60,
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999
    }}>
      <h1 style={{ marginBottom: 30 }}>Dashboard</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '30px', marginBottom: '40px', flexWrap: 'wrap' }}>
            <div style={{ background: '#fff', color: '#222', borderRadius: 10, padding: 20, minWidth: 180, textAlign: 'center', boxShadow: '0 2px 8px #0001' }}>
              <h2>Usuários</h2>
              <p style={{ fontSize: '2rem' }}>{usuarios}</p>
            </div>
            <div style={{ background: '#fff', color: '#222', borderRadius: 10, padding: 20, minWidth: 180, textAlign: 'center', boxShadow: '0 2px 8px #0001' }}>
              <h2>Unidades de Saúde</h2>
              <p style={{ fontSize: '2rem' }}>{unidades}</p>
            </div>
            <div style={{ background: '#fff', color: '#222', borderRadius: 10, padding: 20, minWidth: 180, textAlign: 'center', boxShadow: '0 2px 8px #0001' }}>
              <h2>Locations</h2>
              <p style={{ fontSize: '2rem' }}>{locations}</p>
            </div>
            <div style={{ background: '#fff', color: '#222', borderRadius: 10, padding: 20, minWidth: 180, textAlign: 'center', boxShadow: '0 2px 8px #0001' }}>
              <h2>Gestões</h2>
              <p style={{ fontSize: '2rem' }}>{gestoes}</p>
            </div>
            <div style={{ background: '#fff', color: '#222', borderRadius: 10, padding: 20, minWidth: 180, textAlign: 'center', boxShadow: '0 2px 8px #0001' }}>
              <h2>Leitos</h2>
              <p style={{ fontSize: '2rem' }}>{leitos}</p>
            </div>
            <div style={{ background: '#fff', color: '#222', borderRadius: 10, padding: 20, minWidth: 180, textAlign: 'center', boxShadow: '0 2px 8px #0001' }}>
              <h2>Pipeline</h2>
              <button onClick={runPipeline}>Executar Pipeline</button>
              <p>{pipelineStatus}</p>
            </div>
          </div>
          <div style={{ width: '500px', background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px #0001' }}>
            {(usuarios === 0 && unidades === 0 && locations === 0 && gestoes === 0 && leitos === 0) ? (
              <p style={{ color: '#222', textAlign: 'center' }}>Nenhum dado cadastrado ainda.</p>
            ) : (
              <Bar data={data} />
            )}
          </div>
        </>
      )}
    </div>
  );
}


