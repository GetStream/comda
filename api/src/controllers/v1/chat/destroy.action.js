import Chat from 'models/chat';
import { AddToWebhookChatQueue } from 'workers/webhook-chat/queue';

exports.destroy = async (req, res) => {
	try {
		const data = { ...req.body, ...req.params };
		const { serialized } = req;

		if (serialized.role !== 'admin') {
			return res.status(403).json({
				status: 'Invalid permissions to view or modify this resource.',
			});
		}

		const chat = await Chat.updateOne(
			{ _id: data.chat },
			{ $set: { status: 'Archived' } }
		);

		await AddToWebhookChatQueue('removed', chat);

		res.status(200).json(chat);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};
