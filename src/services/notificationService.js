// Serviço mínimo de notificações -- atualmente faz log. Em produção, integrar com serviço real.
const axios = require('axios');

const sendEventRegistration = async (userId, event) => {
	try {
		// Aqui podemos integrar com um serviço externo de notificações
		console.log(`📣 Notificação: usuário ${userId} inscrito no evento ${event._id}`);

		// Se houver um serviço de notificações configurado, podemos chamar via HTTP
		if (process.env.NOTIFICATION_SERVICE_URL) {
			try {
				await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/notify`, {
					userId,
					eventId: event._id,
					type: 'event_registration'
				});
			} catch (err) {
				// Loga, mas não quebra o fluxo
				console.warn('Não foi possível enviar notificação ao serviço externo:', err.message);
			}
		}

		return true;
	} catch (error) {
		console.error('Erro em notificationService.sendEventRegistration:', error.message);
		return false;
	}
};

module.exports = {
	sendEventRegistration
};
