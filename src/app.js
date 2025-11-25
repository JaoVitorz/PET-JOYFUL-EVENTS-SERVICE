require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const connectDatabase = require("./config/database");
const swaggerSpec = require("./config/swagger");
const eventRoutes = require("./routes/eventRoutes");

const app = express();
const PORT = process.env.PORT || 3002;

// Configuração CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://pet-joyful-projeto-integrador-next-js-ay4p-csdp9roes.vercel.app",
  "https://pet-joyful-projeto-integrador-next-js-ay4p-kzbr9m9bu.vercel.app",
  /https:\/\/.*\.vercel\.app$/, // Permite qualquer domínio Vercel do projeto
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir requisições sem origin (como mobile apps ou curl)
      if (!origin) return callback(null, true);

      // Verificar se a origin está na lista de permitidas
      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed instanceof RegExp) {
          return allowed.test(origin);
        }
        return allowed === origin;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`CORS bloqueado para origin: ${origin}`);
        callback(null, true); // Mudar para false em produção se quiser restringir
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length", "X-Request-Id"],
    maxAge: 86400, // 24 horas
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar ao banco
connectDatabase();

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Pet Joyful Events API",
  })
);
// Rotas
app.use("/api/events", eventRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🎉 Microserviço de Eventos está funcionando!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Rota raiz
app.get("/", (req, res) => {
  res.json({
    message: "🐾 Pet Joyful - Events Service",
    version: "1.0.0",
    documentation: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      health: "/health",
      events: "/api/events",
      docs: "/api-docs",
    },
  });
});

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Rota não encontrada",
    path: req.path,
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error("Erro:", err);
  res.status(500).json({
    success: false,
    message: "Erro interno do servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log("\n🚀 ====================================");
  console.log("🎉 SERVIDOR INICIADO COM SUCESSO!");
  console.log("====================================");
  console.log(`📍 URL Principal: http://localhost:${PORT}`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log(`📚 API Events: http://localhost:${PORT}/api/events`);
  console.log(`📖 Swagger Docs: http://localhost:${PORT}/api-docs`);
  console.log("====================================\n");
});

module.exports = app;
