import fs from 'fs/promises';
import getPort from 'get-port';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

const port = await getPort();

const config = {
  port,
  address: '0.0.0.0',
};

await fs.writeFile(`config/config.prod.json`, JSON.stringify(config, null, 2));

// Load runtime config
const configPath = resolve(__dirname, '../config/config.prod.json');

// Run Fastify using the config
execSync(`fastify start --config=${configPath} -l info dist/app.js`, {
  stdio: 'inherit',
});
