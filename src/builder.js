import { mkdirIfNoExists } from './functions.js';
import { writeLayout } from './layout.js';
import * as logger from './logger.js';
import config from './config.js';

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

export async function buildPage(filePath, fileName, outputDir, feed) {
  const content = await fs.readFile(filePath, { encoding: 'utf8' });
  const fileNameNoExtension = fileName.substr(0, fileName.lastIndexOf('.'));

  await mkdirIfNoExists(outputDir);

  // Make sure meta is reset before every render.
  if (md.meta.length > 0 || Object.keys(md.meta).length > 0) {
    md.meta = {};
  }

  // Note: Render needs to be called before `.meta`
  const htmlContent = md.render(content);
  await writeLayout(`${outputDir}/${fileNameNoExtension}.html`, htmlContent, md.meta);

  // TODO: move this into rss file
  if (feed) {
    const meta = md.meta;
    const path = outputDir.replace(build, '');
    const link = config.site?.url ? `${config.site.url}${path}/${fileNameNoExtension}` : undefined;

    const title = meta.title ?? config.site?.name;
    const description = meta.description ?? config.site?.description;

    const stats = await fs.stat(filePath);
    const modified = new Date(stats.mtime);

    feed.addItem({
      title: title,
      id: fileName,
      link: link,
      description: description,
      content: htmlContent,
      date: modified,
    })
  }
}

export async function buildPages(dir, feed) {
  const opened = await fs.opendir(dir);

  let local = opened.path.replace(pages, '');
  if (local.startsWith('/')) {
    local = local.substr(1);
  }
  const buildDir = path.resolve(build, local);

  // We want to build all the files in a directory before going into any of the dirs.
  let dirs = [];
  for await (const file of opened) {
    if (file.isDirectory()) {
      dirs.push(file);
    } else {
      if (file.name.endsWith('.md')) {
        logger.info(`  building '${local + '/' + file.name}'...`);
        await buildPage(`${path.resolve(opened.path + '/' + file.name)}`, file.name, buildDir, feed);
      } else {
        logger.warn(`  skipping file: ${file.name} - does not have '.md' extension!`);
      }
    }
  }

  for await (const dirFile of dirs) {
    await buildPages(path.resolve(opened.path + '/' + dirFile.name), feed);
  }
}