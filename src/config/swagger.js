const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pet Joyful - Events Service API',
      version: '1.0.0',
      description: 'API para gerenciamento de eventos do Pet Joyful',
      contact: {
        name: 'Pet Joyful Team',
        email: 'contato@petjoyful.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Event: {
          type: 'object',
          required: ['title', 'description', 'eventType', 'startDate', 'endDate', 'location'],
          properties: {
            title: {
              type: 'string',
              description: 'Título do evento',
              example: 'Feira de Adoção - Shopping Paulista'
            },
            description: {
              type: 'string',
              description: 'Descrição detalhada do evento',
              example: 'Grande feira com mais de 50 pets disponíveis para adoção'
            },
            eventType: {
              type: 'string',
              enum: ['adoption_fair', 'vaccination_campaign', 'awareness', 'workshop', 'other'],
              description: 'Tipo do evento',
              example: 'adoption_fair'
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora de início',
              example: '2025-12-15T10:00:00Z'
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora de término',
              example: '2025-12-15T18:00:00Z'
            },
            location: {
              type: 'object',
              properties: {
                address: { type: 'string', example: 'Av. Paulista, 1000' },
                city: { type: 'string', example: 'São Paulo' },
                state: { type: 'string', example: 'SP' },
                zipCode: { type: 'string', example: '01310-100' }
              }
            },
            maxParticipants: {
              type: 'number',
              description: 'Número máximo de participantes',
              example: 500
            },
            status: {
              type: 'string',
              enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
              example: 'upcoming'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;