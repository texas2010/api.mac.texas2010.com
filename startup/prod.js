import fs from 'fs/promises';
import getPort from 'get-port';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function directoryExists(path) {
  try {
    const stat = await fs.stat(path);
    return stat.isDirectory();
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false; // Directory does not exist
    }
    throw err; // Some other error
  }
}

if (!(await directoryExists('config'))) {
  await fs.mkdir('config');
  console.log('Directory created');
} else {
  console.log('It exists');
}

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
