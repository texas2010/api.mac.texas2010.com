import fs from 'fs/promises';
import getPort from 'get-port';

const port = await getPort();

const config = {
  port,
  address: '0.0.0.0',
};

const isDev = process.env.NODE_ENV === 'development';
const mode = isDev ? 'dev' : 'prod';

await fs.writeFile(
  `config/config.${mode}.json`,
  JSON.stringify(config, null, 2)
);
