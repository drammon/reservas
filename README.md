# 🍽️ Sistema de Reservas para Restaurantes

Sistema web para gerenciamento de **clientes**, **mesas** e **reservas** de um restaurante, com controle de status, cancelamento lógico de reservas e regras de integridade para exclusão de dados.

---

## 📌 Funcionalidades

### 👤 Clientes
- Cadastrar cliente
- Listar clientes
- Excluir cliente  
  🔒 **Regra:** um cliente só pode ser excluído se **não possuir reservas ativas** (reservas canceladas não bloqueiam a exclusão)

### 🪑 Mesas
- Cadastrar mesa (número, capacidade, status)
- Listar mesas
- Excluir mesa  
  🔒 **Regra:** uma mesa só pode ser excluída se **não possuir reservas ativas**

### 📅 Reservas
- Criar reserva vinculando cliente e mesa
- Listar reservas
- Cancelar reserva (cancelamento lógico)
- Exibição de status da reserva (`ATIVA`, `CANCELADA`)

---

## 🧠 Regras de Negócio Implementadas

- ❌ **Reservas não são deletadas fisicamente**
  - Ao cancelar, o status muda para `CANCELADA`
- ✅ Clientes e mesas **podem ser excluídos** se:
  - Todas as suas reservas estiverem com status `CANCELADA`
- 🔗 Integridade garantida via:
  - Regras no backend
  - Chaves estrangeiras no banco de dados

---

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js
- Express
- MySQL
- mysql2
- Arquitetura MVC
- REST API

### Frontend
- Next.js (App Router)
- React
- Tailwind CSS
- Axios
- react-hot-toast

---

## 🗄️ Estrutura do Banco de Dados (Resumo)

### customers
| Campo | Tipo |
|------|------|
| id | int |
| name | varchar |
| phone | varchar |

### tables
| Campo | Tipo |
|------|------|
| id | int |
| number | int |
| capacity | int |
| status | varchar |

### reservations
| Campo | Tipo |
|------|------|
| id | int |
| customer_id | int |
| table_id | int |
| reservation_datetime | datetime |
| status | varchar |

---

## ▶️ Como Executar o Projeto

### 1 - Clonar o repositório
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
```
### 2 - Configurando o database
```mysql
mysql -u root -p (efetue login)
SOURCE C:/Users/alunos/Documents/reservas/backend/database/restaurante_db.sql
```
### 2 - Backend
```bash
cd backend
npm install
npm run dev
```

Configure o arquivo `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=senha
DB_NAME=restaurante_db
```

### 3 - Frontend
```bash
cd frontend
npm install
npm run dev
```

Acesse:
```
http://localhost:3000
```

---

## 📂 Estrutura de Pastas (Simplificada)

```
backend/
 ├─ controllers/
 ├─ routes/
 ├─ services/
 ├─ database/
 └─ server.js

frontend/
 ├─ app/
 │   ├─ customers/
 │   ├─ tables/
 │   └─ reservations/
 ├─ services/
 └─ styles/
```


## 👨‍💻 Autor

**Dayvid Ramon**  
Projeto desenvolvido para fins acadêmicos e prática de desenvolvimento Full Stack.
