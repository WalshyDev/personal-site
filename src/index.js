import { checkRequiredFiles, clean, copyPublicFiles } from './functions.js';
import { isEnabled, createFeed, generateRss } from './rss.js';
import { buildPages } from './builder.js';
import * as logger from './logger.js';
import * as path from 'path';

const content = path.resolve('content');
const pages   = path.resolve(content + '/pages');

async function main() {
  logger.info('Building website...');
  logger.info('');

  await checkRequiredFiles();

  logger.info('Cleaning `build` dir...');
  await clean();

  let feed = undefined;
  if (isEnabled) {
    logger.info('Setting up RSS feed...');
    feed = createFeed();
  }

  logger.info('Building pages...');
  await buildPages(pages, feed);

  logger.info('Copying over `public`...');
  await copyPublicFiles();

  if (isEnabled) {
    logger.info('Building RSS feeds...');
    await generateRss(feed);
  }
}

main();