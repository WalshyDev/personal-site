import config from './config.js';
import * as fs from 'fs/promises';
import * as logger from './logger.js';
import { fileExists, find, getObjectString } from './functions.js';

// TODO: Redo this class... it's a mess. Tokenize and just make this better

// Will modify the text/HTML given and modify any `@meta` tags. If there are none it will just return the text.
export function writeMeta(text, meta) {
  // Make sure it matches like `@meta(test)` and `@meta(test, 'Default text, hello world!')`
  const metaRegex = /@meta\((\w+)(?:, (?:'(.+)'|@.+))?\)/gm;

  if (text.includes('@meta')) {
    let matcher;
    while ((matcher = metaRegex.exec(text)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (matcher.index === metaRegex.lastIndex) {
          metaRegex.lastIndex++;
      }

      if (matcher.length >= 2) {
        const original = matcher[0];
        const metaTag = matcher[1];

        let defaultText = matcher.length === 3 && matcher[2] !== undefined ? matcher[2] : '';
        if (defaultText.includes('@')) {
          defaultText = modifyTags(defaultText, meta);
        }

        const result = find(meta, obj => obj.meta === metaTag);
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

export function writeConfig(text) {
  // Make sure it matches like `@config(site.name)`
  const configRegex = /@config\(([\w.]+)\)/gm;

  if (text.includes('@config')) {
    let matcher;
    while ((matcher = configRegex.exec(text)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (matcher.index === configRegex.lastIndex) {
          configRegex.lastIndex++;
      }

      if (matcher.length >= 2) {
        const original = matcher[0];
        const path = matcher[1];

        const result = getObjectString(config, path);
        if (result !== null) {
          logger.debug(`Replaced ${original} with ${result}`);
          text = text.replace(original, result);
        } else {
          logger.warn(`  Unable to find config path ${path}`);
        }
      }
    }
  }
  return text;
}

export function modifyTags(text, meta) {
  text = writeConfig(text);
  text = writeMeta(text, meta);

  return text;
}

export async function writeLayout(output, content, meta) {
  const fullFile = await fs.readFile('content/_layouts/layout.html', { encoding: 'utf8' });

  const lines = fullFile.split(/\r?\n/g);

  let resultingHtml = '';
  let arr;
  for (const line of lines) {
    if (line.startsWith("#")) {
      continue;
    } else if (line === '@content') {
      resultingHtml += content;
    } else if ((arr = /^@layout\((\w+)\)$/gm.exec(line)) !== null) {
      const layout = arr[1].endsWith('.html') ? arr[1] : arr[1] + '.html';
      const layoutFile = 'content/_layouts/' + layout;
      const exists = await fileExists(layoutFile);

      if (exists) {
        const layoutHtml = await fs.readFile(layoutFile, { encoding: 'utf8' });
        resultingHtml += modifyTags(layoutHtml, meta);
      } else {
        logger.warn('  Layout: ' + layout + ' does not exist! Ignoring');
      }
    } else {
      resultingHtml += modifyTags(line, meta);
    }
  }

  await fs.writeFile(output, resultingHtml, { encoding: 'utf8' });
}