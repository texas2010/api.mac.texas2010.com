import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async (request, reply) => {
    const addressInfo = fastify.server.address();
    if (!addressInfo || typeof addressInfo === 'string') {
      return reply.send({ hello: 'world', port: null });
    }
    const port = addressInfo.port;
    return reply.send({ hello: 'world', port });
  });
};

export default root;
