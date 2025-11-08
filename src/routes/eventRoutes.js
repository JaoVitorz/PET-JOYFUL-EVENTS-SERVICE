const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate } = require('../middlewares/auth');
const { body } = require('express-validator');

const eventValidation = [
  body('title').notEmpty().withMessage('Título é obrigatório'),
  body('description').notEmpty().withMessage('Descrição é obrigatória'),
  body('eventType').isIn(['adoption_fair', 'vaccination_campaign', 'awareness', 'workshop', 'other']),
  body('startDate').isISO8601().withMessage('Data de início inválida'),
  body('endDate').isISO8601().withMessage('Data de término inválida'),
  body('location.address').notEmpty().withMessage('Endereço é obrigatório'),
  body('location.city').notEmpty().withMessage('Cidade é obrigatória'),
  body('location.state').notEmpty().withMessage('Estado é obrigatório'),
  body('location.zipCode').notEmpty().withMessage('CEP é obrigatório')
];

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Gerenciamento de eventos
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Lista todos os eventos
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Itens por página
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtrar por status
 *       - in: query
 *         name: eventType
 *         schema:
 *           type: string
 *         description: Filtrar por tipo
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filtrar por cidade
 *     responses:
 *       200:
 *         description: Lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 */
router.get('/', eventController.getAllEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Busca evento por ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Evento encontrado
 *       404:
 *         description: Evento não encontrado
 */
router.get('/:id', eventController.getEventById);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Cria novo evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Evento criado
 *       401:
 *         description: Não autorizado
 */
router.post('/', authenticate, eventValidation, eventController.createEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Atualiza evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Evento atualizado
 */
router.put('/:id', authenticate, eventController.updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Deleta evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento deletado
 */
router.delete('/:id', authenticate, eventController.deleteEvent);

/**
 * @swagger
 * /api/events/{id}/register:
 *   post:
 *     summary: Inscrever-se em evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inscrição realizada
 */
router.post('/:id/register', authenticate, eventController.registerForEvent);

/**
 * @swagger
 * /api/events/{id}/unregister:
 *   post:
 *     summary: Cancelar inscrição
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inscrição cancelada
 */
router.post('/:id/unregister', authenticate, eventController.unregisterFromEvent);

module.exports = router;