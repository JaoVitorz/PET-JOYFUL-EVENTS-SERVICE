# 🎉 Pet Joyful - Microserviço de Eventos

Microserviço responsável pelo gerenciamento de eventos do Pet Joyful.

## 🚀 Tecnologias

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Swagger Documentation
- Docker

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure o `.env` 
4. Execute: `npm run dev`



## 📚 Documentação

Acesse: `http://localhost:3002/api-docs`

## 🧪 Testes
```bash
npm test
```

# 1. Criar o diretório do projeto
mkdir pet-joyful-events-service
cd pet-joyful-events-service

# 2. Inicializar o projeto
npm init -y

# 3. Instalar dependências
npm install express mongoose dotenv cors jsonwebtoken express-validator swagger-ui-express swagger-autogen axios

# 4. Instalar dependências de desenvolvimento
npm install --save-dev nodemon jest supertest

# 5. Criar estrutura de pastas
mkdir -p src/{config,controllers,middleware,models,routes,services,utils} tests

# 6. Copiar os arquivos acima para as respectivas pastas

# 7. Configurar o .env

# 8. Executar em desenvolvimento
npm run dev