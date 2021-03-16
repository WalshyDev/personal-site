import { checkRequiredFiles, clean, copyPublicFiles } from './functions.js';
import { buildPages } from './builder.js';
import * as logger from './logger.js';
import * as path from 'path';

const content = path.resolve('content');
const layouts = path.resolve(content + '/_layouts')
const pages   = path.resolve(content + '/pages');

async function main() {
  logger.info('Building website...');
  logger.info('');

  await checkRequiredFiles();

  logger.info('Cleaning `build` dir...');
  await clean();

  logger.info('Building pages...');
  await buildPages(pages);

  logger.info('Copying over `public`...');
  await copyPublicFiles();
}

main();