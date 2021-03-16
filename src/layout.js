import * as fs from 'fs/promises';
import * as logger from './logger.js';
import { fileExists, find } from './functions.js';

// Will modify the text/HTML given and modify any `@meta` tags. If there are none it will just return the text.
export function writeMeta(text, meta) {
  // Make sure it matches like `@meta(test)` and `@meta(test, 'Default text, hello world!')`
  const metaRegex = /@meta\((\w+)(?:, '(.+)')?\)/gm;

  if (text.includes('@meta')) {
    let matcher;
    logger.debug(meta);
    while ((matcher = metaRegex.exec(text)) !== null) {
      logger.debug('match');
      // This is necessary to avoid infinite loops with zero-width matches
      if (matcher.index === metaRegex.lastIndex) {
          metaRegex.lastIndex++;
      }

      if (matcher.length >= 2) {
        const original = matcher[0];
        const metaTag = matcher[1];
        const defaultText = matcher.length === 3 ? matcher[2] : '';

        const result = find(meta, obj => obj.meta === metaTag);
        logger.debug('Meta tag: ' + metaTag);
        logger.debug(result);
        if (result !== null) {
          text = text.replace(original, result.value);
        } else {
          text = text.replace(original, defaultText);
        }
      }
    }
  }
  return text;
}

// TODO: Probably should turn this into a proper tokenizer
export async function writeLayout(output, content, meta) {
  const fullFile = await fs.readFile('content/_layouts/layout.html', { encoding: 'utf8' });

  const lines = fullFile.split(/\r?\n/g);

  let resultingHtml = '';
  let arr;
  for (const line of lines) {
    if (line.startsWith("#")) {
      continue;
    } else if ((arr = /^@layout\((\w+)\)$/gm.exec(line)) !== null) {
      const layout = arr[1].endsWith('.html') ? arr[1] : arr[1] + '.html';
      const layoutFile = 'content/_layouts/' + layout;
      const exists = await fileExists(layoutFile);

      if (exists) {
        const layoutHtml = await fs.readFile(layoutFile, { encoding: 'utf8' });
        resultingHtml += writeMeta(layoutHtml, meta);
      } else {
        logger.warn('  Layout: ' + layout + ' does not exist! Ignoring');
      }
    } else if (line === '@content') {
      resultingHtml += content;
    } else {
      resultingHtml += writeMeta(line, meta);
    }
  }

  await fs.writeFile(output, resultingHtml, { encoding: 'utf8' });
}