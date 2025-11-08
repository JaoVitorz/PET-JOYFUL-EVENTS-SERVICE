const Event = require('../models/Event');
const { validationResult } = require('express-validator');

class EventController {
  async createEvent(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          errors: errors.array() 
        });
      }

      const eventData = {
        ...req.body,
        organizer: req.user.id || req.user.userId || 'default-user'
      };

      const event = await Event.create(eventData);
      
      res.status(201).json({
        success: true,
        message: 'Evento criado com sucesso',
        data: event
      });
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao criar evento',
        error: error.message
      });
    }
  }

  async getAllEvents(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status, 
        eventType, 
        city 
      } = req.query;

      const filters = {};
      if (status) filters.status = status;
      if (eventType) filters.eventType = eventType;
      if (city) filters['location.city'] = new RegExp(city, 'i');

      const events = await Event.find(filters)
        .sort({ startDate: 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const count = await Event.countDocuments(filters);

      res.status(200).json({
        success: true,
        data: events,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar eventos',
        error: error.message
      });
    }
  }

  async getEventById(req, res) {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Evento não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: event
      });
    } catch (error) {
      console.error('Erro ao buscar evento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar evento',
        error: error.message
      });
    }
  }

  async updateEvent(req, res) {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Evento não encontrado'
        });
      }

      const userId = req.user.id || req.user.userId;
      if (event.organizer.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Sem permissão para atualizar este evento'
        });
      }

      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: 'Evento atualizado com sucesso',
        data: updatedEvent
      });
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar evento',
        error: error.message
      });
    }
  }

  async deleteEvent(req, res) {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Evento não encontrado'
        });
      }

      const userId = req.user.id || req.user.userId;
      if (event.organizer.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Sem permissão para deletar este evento'
        });
      }

      await Event.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Evento deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar evento',
        error: error.message
      });
    }
  }

  async registerForEvent(req, res) {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Evento não encontrado'
        });
      }

      const userId = req.user.id || req.user.userId;
      const alreadyRegistered = event.participants.some(
        p => p.userId === userId
      );

      if (alreadyRegistered) {
        return res.status(400).json({
          success: false,
          message: 'Você já está inscrito neste evento'
        });
      }

      if (!event.hasAvailableSlots()) {
        return res.status(400).json({
          success: false,
          message: 'Evento lotado'
        });
      }

      event.participants.push({ userId });
      event.currentParticipants += 1;
      await event.save();

      res.status(200).json({
        success: true,
        message: 'Inscrição realizada com sucesso',
        data: event
      });
    } catch (error) {
      console.error('Erro ao registrar:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao realizar inscrição',
        error: error.message
      });
    }
  }

  async unregisterFromEvent(req, res) {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Evento não encontrado'
        });
      }

      const userId = req.user.id || req.user.userId;
      const participantIndex = event.participants.findIndex(
        p => p.userId === userId
      );

      if (participantIndex === -1) {
        return res.status(400).json({
          success: false,
          message: 'Você não está inscrito neste evento'
        });
      }

      event.participants.splice(participantIndex, 1);
      event.currentParticipants -= 1;
      await event.save();

      res.status(200).json({
        success: true,
        message: 'Inscrição cancelada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao cancelar inscrição',
        error: error.message
      });
    }
  }
}

module.exports = new EventController();