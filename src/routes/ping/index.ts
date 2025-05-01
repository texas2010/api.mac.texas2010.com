import { FastifyPluginAsync } from 'fastify';

const pingRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (requst, reply) {
    return reply.send({ ping: 'pong' });
  });
};

export default pingRoute;
