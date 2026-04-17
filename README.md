# 🌐 Frontend - Sistema de Gestão de Saúde

Interface web desenvolvida em **React.js** para gerenciamento de usuários, unidades de saúde (CNES) e visualização de dados em dashboard.

---

## 🚀 Tecnologias utilizadas

- React.js
- Axios
- React Router DOM
- CSS

---

## 📦 Funcionalidades

### 👤 Cadastro de Usuário
- Criar novos usuários
- Validação de campos
- Integração com API (FastAPI)

### 🔄 Atualização de CNES
- Atualizar dados de unidades de saúde
- Busca por CNES
- Edição de informações

### 📊 Dashboard
- Visualização de dados de saúde
- Indicadores e estatísticas
- Dados de leitos, unidades, etc.

---

## 🖥️ Estrutura do Projeto
```
src/
│
├── components/ # Componentes reutilizáveis
├── pages/
│ ├── Register/ # Cadastro de usuário
│ ├── Login/ # Login (se tiver)
│ ├── Dashboard/ # Painel principal
│ ├── CNES/ # Atualização de unidades
│
├── services/ # Comunicação com API (Axios)
├── routes/ # Rotas da aplicação
├── App.js
└── main.js
```

---

## 🔌 Integração com API

A aplicação consome uma API desenvolvida em **FastAPI**.

Exemplo:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000"
});
```
## instalar dependencias 
npm install
npm run dev
