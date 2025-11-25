# Integração Frontend - Editar e Excluir Eventos

## Endpoints Disponíveis

### 1. Excluir Evento

```
DELETE /api/events/:id
```

**Headers necessários:**

```javascript
{
  'Authorization': 'Bearer SEU_TOKEN_AQUI',
  'Content-Type': 'application/json'
}
```

**Resposta de sucesso (200):**

```json
{
  "success": true,
  "message": "Evento deletado com sucesso"
}
```

**Possíveis erros:**

- 401: Token inválido ou ausente
- 403: Sem permissão (não é o organizador)
- 404: Evento não encontrado
- 500: Erro no servidor

---

### 2. Editar Evento

```
PUT /api/events/:id
```

**Headers necessários:**

```javascript
{
  'Authorization': 'Bearer SEU_TOKEN_AQUI',
  'Content-Type': 'application/json'
}
```

**Body da requisição:**

```json
{
  "title": "Título atualizado",
  "description": "Descrição atualizada",
  "eventType": "adoption_fair",
  "startDate": "2025-11-06T00:28:00.000Z",
  "endDate": "2025-11-13T01:29:00.000Z",
  "location": {
    "address": "DSADA",
    "city": "das, SA",
    "state": "SA",
    "zipCode": "18111352"
  },
  "maxParticipants": 100
}
```

**Resposta de sucesso (200):**

```json
{
  "success": true,
  "message": "Evento atualizado com sucesso",
  "data": {
    "_id": "...",
    "title": "Título atualizado",
    ...
  }
}
```

---

## Exemplos de Código para Frontend

### Exemplo com Fetch API (JavaScript Puro)

```javascript
// Configuração base
const API_URL = "http://localhost:3000/api/events"; // Ajuste a URL conforme necessário
const token = localStorage.getItem("token"); // ou de onde você armazena o token

// Função para EXCLUIR evento
async function excluirEvento(eventId) {
  try {
    const response = await fetch(`${API_URL}/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao excluir evento");
    }

    alert("Evento excluído com sucesso!");
    // Recarregar lista de eventos ou remover da tela
    window.location.reload(); // ou remover o elemento do DOM
  } catch (error) {
    console.error("Erro:", error);
    alert(`Erro: ${error.message}`);
  }
}

// Função para EDITAR evento
async function editarEvento(eventId, dadosAtualizados) {
  try {
    const response = await fetch(`${API_URL}/${eventId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosAtualizados),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao atualizar evento");
    }

    alert("Evento atualizado com sucesso!");
    return data.data; // Retorna os dados atualizados
  } catch (error) {
    console.error("Erro:", error);
    alert(`Erro: ${error.message}`);
  }
}

// Exemplo de uso com os botões
document.addEventListener("DOMContentLoaded", function () {
  // Botão EXCLUIR
  const btnExcluir = document.querySelector(".btn-excluir");
  if (btnExcluir) {
    btnExcluir.addEventListener("click", async function () {
      const eventId = this.dataset.eventId; // ou pegue de onde estiver o ID

      if (confirm("Tem certeza que deseja excluir este evento?")) {
        await excluirEvento(eventId);
      }
    });
  }

  // Botão EDITAR
  const btnEditar = document.querySelector(".btn-editar");
  if (btnEditar) {
    btnEditar.addEventListener("click", function () {
      const eventId = this.dataset.eventId;

      // Redirecionar para página de edição ou abrir modal
      window.location.href = `/editar-evento.html?id=${eventId}`;

      // OU abrir modal de edição
      // abrirModalEdicao(eventId);
    });
  }
});
```

### Exemplo com Axios

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Excluir evento
export const excluirEvento = async (eventId) => {
  try {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Editar evento
export const editarEvento = async (eventId, dadosAtualizados) => {
  try {
    const response = await api.put(`/events/${eventId}`, dadosAtualizados);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Uso:
// await excluirEvento('673e3d19a0a36cb404f7f929');
// await editarEvento('673e3d19a0a36cb404f7f929', { title: 'Novo título' });
```

### Exemplo React

```jsx
import React, { useState } from "react";
import axios from "axios";

function EventCard({ event, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(event);

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este evento?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/events/${event._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Evento excluído com sucesso!");
      onDelete(event._id);
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert(error.response?.data?.message || "Erro ao excluir evento");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3000/api/events/${event._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Evento atualizado com sucesso!");
      onUpdate(response.data.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert(error.response?.data?.message || "Erro ao atualizar evento");
    }
  };

  return (
    <div className="event-card">
      {!isEditing ? (
        <>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <div className="buttons">
            <button onClick={() => setIsEditing(true)}>Editar</button>
            <button onClick={handleDelete}>Excluir</button>
          </div>
        </>
      ) : (
        <form onSubmit={handleUpdate}>
          <input
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <button type="submit">Salvar</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
}
```

---

## Observações Importantes

1. **Autenticação Obrigatória**: Ambas as operações requerem que o usuário esteja autenticado (token JWT no header)

2. **Permissões**: Apenas o organizador do evento pode editá-lo ou excluí-lo. O backend verifica automaticamente se o usuário logado é o organizador.

3. **Validação de Campos**: Ao editar, todos os campos obrigatórios devem ser enviados:

   - title, description, eventType, startDate, endDate
   - location (address, city, state, zipCode)

4. **Status Codes**:

   - 200: Sucesso
   - 400: Dados inválidos
   - 401: Não autenticado
   - 403: Sem permissão
   - 404: Evento não encontrado
   - 500: Erro no servidor

5. **CORS**: Certifique-se que o backend está configurado para aceitar requisições do seu frontend.

---

## Testando os Endpoints

Você pode testar usando o Swagger (se configurado) em:

```
http://localhost:3000/api-docs
```

Ou usar ferramentas como Postman/Insomnia/Thunder Client.
