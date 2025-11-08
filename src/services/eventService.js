// Serviço auxiliar para lógica de eventos (métodos simples)
const Event = require('../models/Event');

const listEvents = async (filters = {}, options = {}) => {
	const { page = 1, limit = 10, sort = { startDate: 1 } } = options;
	const events = await Event.find(filters)
		.sort(sort)
		.limit(limit * 1)
		.skip((page - 1) * limit)
		.exec();
	const count = await Event.countDocuments(filters);
	return { events, count };
};

const getEventById = async (id) => {
	return Event.findById(id).populate('organizer', 'name email').populate('participants.userId', 'name email');
};

module.exports = {
	listEvents,
	getEventById
};
