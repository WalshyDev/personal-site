import * as config from './config.js';
import { Feed } from 'feed';

export function isEnabled() {
  return config?.features?.rss?.enabled;
}

export function generateRss() {
  const feed = new Feed({
    
  });
}