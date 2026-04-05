import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UpdateCnes() {
  const [cnes, setCnes] = useState("");
  const [nome, setNome] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[0-9]{7}$/.test(cnes)) {
      alert("CNES deve ter exatamente 7 dígitos");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/unidade-saude/update/${cnes}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ nome })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Erro ao atualizar unidade");
      }
      alert("Unidade atualizada com sucesso!");
      navigate("/cnes");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", paddingTop: "50px" }}>
      <h1>Atualizar Unidade de Saúde</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="CNES (7 dígitos)"
          value={cnes}
          onChange={(e) => setCnes(e.target.value)}
          required
          maxLength={7}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="text"
          placeholder="Novo nome da unidade"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <button
          type="submit"
          style={{ width: "100%", padding: "10px", backgroundColor: "#2196F3", color: "white" }}
        >
          Atualizar
        </button>
      </form>
    </div>
  );
}

export default UpdateCnes;
