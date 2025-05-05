import fs from 'fs/promises';
import getPort from 'get-port';

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

const isDev = process.env.NODE_ENV === 'development';
const mode = isDev ? 'dev' : 'prod';

await fs.writeFile(
  `config/config.${mode}.json`,
  JSON.stringify(config, null, 2)
);
