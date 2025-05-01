import * as path from 'node:path';
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';
import { fileURLToPath } from 'node:url';
import fs from 'fs/promises';

import CaddyClient from './caddyClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development';
const domain = isDev ? 'api-mac.dev.texas2010.com' : 'api.mac.texas2010.com';
const mode = isDev ? 'dev' : 'prod';
const caddy = new CaddyClient();

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!

  try {
    const config = await fs.readFile(`config/config.${mode}.json`, 'utf8');
    const port = JSON.parse(config).port;

    await caddy.addRoute({
      '@id': domain,
      match: [{ host: [domain] }],
      handle: [
        {
          handler: 'reverse_proxy',
          upstreams: [
            {
              dial: isDev ? `127.0.0.1:${port}` : `0.0.0.0:${port}`,
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }

  if (isDev) {
    console.log(`Domain: https://${domain}`);
  }

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: opts,
    forceESM: true,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: opts,
    forceESM: true,
  });
};

export default app;
export { app, options };
