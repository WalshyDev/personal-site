import config from './config.js';
import { Feed } from 'feed';

export function isEnabled() {
  return config.features?.rss?.enabled;
}

export function generateRss() {
  const feed = new Feed({
    title: config.site?.name,
    description: config.site?.description,
    id: config.site?.url,
    link: config.site?.url,
    updated: new Date(),
    generator: config.site?.name
  });

  
}