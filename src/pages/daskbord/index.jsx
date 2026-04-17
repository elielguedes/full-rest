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
  const [runningPipeline, setRunningPipeline] = useState(false);

  const token = localStorage.getItem('token');

  // 🔥 FETCH CORRIGIDO
  async function fetchData() {
    const headers = { Authorization: `Bearer ${token}` };

    const getSafe = async (url) => {
      try {
        const res = await fetch(url, { headers });

        if (!res.ok) {
          console.error("Erro HTTP:", url, res.status);
          return null;
        }

        return await res.json();
      } catch (err) {
        console.error("Erro FETCH:", url, err);
        return null;
      }
    };

    try {
      const [
        usersData,
        unidadesData,
        locationsData,
        gestaoData,
        leitosData
      ] = await Promise.all([
        getSafe('http://127.0.0.1:8000/user/all'),
        getSafe('http://127.0.0.1:8000/unidade-saude/lista'),
        getSafe('http://127.0.0.1:8000/entidade2/listar-location'),
        getSafe('http://127.0.0.1:8000/entidade2/gestao/get'),
        getSafe('http://127.0.0.1:8000/entidade2/leitos'),
      ]);

      // DEBUG
      console.log("LOCATIONS:", locationsData);
      console.log("LEITOS:", leitosData);

      // ✅ USERS
      setUsuarios(Array.isArray(usersData) ? usersData.length : 0);

      // ✅ UNIDADES
      setUnidades(
        Array.isArray(unidadesData?.Unidades)
          ? unidadesData.Unidades.length
          : 0
      );

      // 🔥 LOCATION (ROBUSTO)
      let totalLocations = 0;

      if (locationsData) {
        if (Array.isArray(locationsData.locate)) {
          totalLocations = locationsData.locate.length;
        } else if (Array.isArray(locationsData)) {
          totalLocations = locationsData.length;
        } else {
          console.warn("Formato inesperado LOCATION:", locationsData);
        }
      }

      setLocations(totalLocations);

      // ✅ GESTAO
      setGestoes(
        Array.isArray(gestaoData)
          ? gestaoData.length
          : 0
      );

      // 🔥 LEITOS (ROBUSTO)
      let totalLeitos = 0;

      if (leitosData) {
        if (Array.isArray(leitosData)) {
          totalLeitos = leitosData.length;
        } else if (Array.isArray(leitosData.leitos)) {
          totalLeitos = leitosData.leitos.length;
        } else {
          console.warn("Formato inesperado LEITOS:", leitosData);
        }
      }

      setLeitos(totalLeitos);

      setPipelineStatus("");

    } catch (err) {
      console.error("Erro geral:", err);
      setPipelineStatus("Erro ao carregar dados");
    }
  }

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, []);

  // 🚀 PIPELINE
  async function runPipeline() {
    setRunningPipeline(true);
    setPipelineStatus("Executando pipeline...");

    try {
      const res = await fetch('http://127.0.0.1:8000/pipeline/run', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Erro no pipeline");

      const data = await res.json();

      setPipelineStatus(data.mensagem || "Pipeline executado!");

      // 🔥 RECARREGA DADOS
      setTimeout(async () => {
        await fetchData();
        setRunningPipeline(false);
      }, 1500);

    } catch (err) {
      console.error(err);
      setPipelineStatus("Erro ao executar pipeline");
      setRunningPipeline(false);
    }
  }

  // 📊 GRÁFICO
  const chartData = {
    labels: ['Usuários', 'Unidades', 'Locations', 'Gestões', 'Leitos'],
    datasets: [
      {
        label: 'Total',
        data: [
          usuarios || 0,
          unidades || 0,
          locations || 0,
          gestoes || 0,
          leitos || 0
        ],
        borderRadius: 8,
      },
    ],
  };

  const hasData = [usuarios, unidades, locations, gestoes, leitos]
    .some(v => v > 0);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>

      {loading ? (
        <div style={styles.loading}>🔄 Carregando dados...</div>
      ) : (
        <>
          <div style={styles.cardsContainer}>
            <Card title="Usuários" value={usuarios} />
            <Card title="Unidades" value={unidades} />
            <Card title="Locations" value={locations} />
            <Card title="Gestões" value={gestoes} />
            <Card title="Leitos" value={leitos} />

            <div style={styles.card}>
              <h3>Pipeline</h3>

              <button
                style={{
                  ...styles.button,
                  opacity: runningPipeline ? 0.6 : 1
                }}
                onClick={runPipeline}
                disabled={runningPipeline}
              >
                {runningPipeline ? "Executando..." : "Executar"}
              </button>

              <p style={{ marginTop: 10 }}>{pipelineStatus}</p>
            </div>
          </div>

          <div style={styles.chartBox}>
            {!hasData ? (
              <p style={{ textAlign: 'center' }}>
                Nenhum dado ainda. Execute o pipeline 🚀
              </p>
            ) : (
              <Bar data={chartData} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

// 🔹 CARD
function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p style={styles.value}>{value}</p>
    </div>
  );
}

// 🎨 ESTILO
const styles = {
  container: {
    minHeight: '100vh',
    padding: '40px',
    background: 'linear-gradient(135deg, #eef2ff, #f8fafc)',
    fontFamily: 'Segoe UI',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
  },
  cardsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
    marginBottom: '40px',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    minWidth: '180px',
    textAlign: 'center',
    boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
  },
  value: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#4f46e5',
  },
  chartBox: {
    maxWidth: '800px',
    margin: '0 auto',
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
  },
  button: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '8px',
    background: '#4f46e5',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};