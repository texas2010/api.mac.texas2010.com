import { FastifyPluginAsync } from 'fastify';

import { post } from './post.js';

const runShortcutsRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['shortcutName', 'shortcutInput'],
          properties: {
            shortcutName: { type: 'string' },
            shortcutInput: { anyOf: [{ type: 'string' }, { type: 'object' }] },
          },
        },
      },
    },
    post
  );
};

export default runShortcutsRoute;
