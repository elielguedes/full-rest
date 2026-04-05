import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Cnes() {
  const [nome, setNome] = useState("");
  const [cnes, setCnes] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // valida CNES
    if (!/^\d{7}$/.test(cnes)) {
      alert("CNES deve ter exatamente 7 números");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/unidade-saude/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ nome, cnes })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Erro ao cadastrar unidade");
      }

      const data = await res.json();

      alert("Unidade cadastrada com sucesso!");
      console.log("Resposta do backend:", data);

      // opcional: redireciona pro dashboard
      navigate("/dashboard");

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", paddingTop: "50px" }}>
      <h1>Cadastrar Unidade de Saúde</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome da unidade"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <input
          type="text"
          placeholder="CNES (7 dígitos)"
          value={cnes}
          onChange={(e) => setCnes(e.target.value)}
          required
          maxLength={7}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <button
          type="submit"
          style={{ width: "100%", padding: "10px", backgroundColor: "#4CAF50", color: "white" }}
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}

export default Cnes;