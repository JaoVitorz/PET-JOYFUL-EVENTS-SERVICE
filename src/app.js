require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const connectDatabase = require('./config/database');
const swaggerSpec = require('./config/swagger');
const eventRoutes = require('./routes/eventRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

// Middlewares
// Backend: src/app.js
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar ao banco
connectDatabase();

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Pet Joyful Events API'
}));
// Adicione antes das rotas
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
// Rotas
app.use('/api/events', eventRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🎉 Microserviço de Eventos está funcionando!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: '🐾 Pet Joyful - Events Service',
    version: '1.0.0',
    documentation: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      health: '/health',
      events: '/api/events',
      docs: '/api-docs'
    }
  });
});

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.path
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('\n🚀 ====================================');
  console.log('🎉 SERVIDOR INICIADO COM SUCESSO!');
  console.log('====================================');
  console.log(`📍 URL Principal: http://localhost:${PORT}`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log(`📚 API Events: http://localhost:${PORT}/api/events`);
  console.log(`📖 Swagger Docs: http://localhost:${PORT}/api-docs`);
  console.log('====================================\n');
});

module.exports = app;