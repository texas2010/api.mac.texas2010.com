import { FastifyPluginAsync } from 'fastify';

const shortcutsRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    return 'shortcuts';
  });
};

export default shortcutsRoute;
