import { InteractionType, InteractionResponseType, } from 'discord-interactions';

export async function handleInteraction(req, res) {
    try {
        const { type, data } = req.body;
        console.log('Received interaction:', req.body);

        // Handle verification requests
        if (type === InteractionType.PING) {
            return res.send({ type: InteractionResponseType.PONG });
        }

        // Handle slash command requests
        if (type === InteractionType.APPLICATION_COMMAND) {
            const { name } = data;

            switch (name) {
                case "test":
                    return res.send({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            content: 'hello world',
                        },
                    });

                default:
                    return res.status(400).send({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            content: 'Unhandled interaction type: ' + name,
                        },
                    });
            }

        }
    } catch (error) {
        console.error(error);

        return res.status(400).send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: error,
            },
        });
    }
}