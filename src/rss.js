import { mkdirIfNoExists } from './functions.js';
import config from './config.js';

import * as fs from 'fs/promises';
import { Feed } from 'feed';

export function isEnabled() {
  return config.features?.rss?.enabled;
}

export function createFeed() {
  return new Feed({
    title: config.site?.name,
    description: config.site?.description,
    id: config.site?.url,
    link: config.site?.url,
    updated: new Date(),
    generator: config.site?.name,

    feedLinks: {
      json: `${config.site?.url}/json`,
      atom: `${config.site?.url}/atom`
    },

    author: {
      name: config.author?.name,
      email: config.author?.email,
      link: config.author?.link,
    }
  });
}

export async function generateRss(feed) {
  await mkdirIfNoExists('build/rss');

  await fs.writeFile('build/rss/feed.rss',  feed.rss2(),  { encoding: 'utf8' });
  await fs.writeFile('build/rss/feed.json', feed.json1(), { encoding: 'utf8' });
  await fs.writeFile('build/rss/feed.atom', feed.atom1(), { encoding: 'utf8' });
}
