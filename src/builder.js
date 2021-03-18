import { mkdirIfNoExists } from './functions.js';
import { writeLayout } from './layout.js';
import * as logger from './logger.js';
import * as fs from 'fs/promises';
import * as path from 'path';

import MarkdownIt from 'markdown-it';
import Anchor from 'markdown-it-anchor';
import ToC from 'markdown-it-table-of-contents';
import Meta from './plugins/meta.js';

const md = new MarkdownIt({
  html: true
})
  .use(Anchor,
    {
      level: 2,
      permalink: true,
      permalinkSymbol: '🔗',
      permalinkBefore: true
    }
  )
  .use(ToC)
  .use(Meta)
  ;

const pages = path.resolve('content/pages');
const build = path.resolve('build');

export async function buildPage(filePath, fileName, outputDir) {
  const content = await fs.readFile(filePath, { encoding: 'utf8' });
  const fileNameNoExtension = fileName.substr(0, fileName.lastIndexOf('.'));

  await mkdirIfNoExists(outputDir);

  // Note: Render needs to be called before `.meta`
  await writeLayout(`${outputDir}/${fileNameNoExtension}.html`, md.render(content), md.meta);
}

export async function buildPages(dir) {
  const opened = await fs.opendir(dir);

  let buildDir = opened.path.replace(pages, '');
  if (buildDir.startsWith('/')) {
    buildDir = buildDir.substr(1);
  }
  buildDir = path.resolve(build, buildDir);

  for await (const file of opened) {
    if (file.isDirectory()) {
      buildPages(path.resolve(opened.path + '/' + file.name));
    } else {
      if (file.name.endsWith('.md')) {
        logger.info(`  building '${file.name}'...`);
        await buildPage(`${path.resolve(opened.path + '/' + file.name)}`, file.name, buildDir);
      } else {
        logger.warn(`  skipping file: ${file.name} - does not have '.md' extension!`);
      }
    }
  }
}