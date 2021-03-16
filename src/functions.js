import * as logger from './logger.js';
import * as fs from 'fs/promises';
import { constants } from 'fs';

export async function fileExists(file) {
  try {
    await fs.access(file, constants.R_OK);
    return true;
  } catch (e) {
    return false;
  }
}

export async function mkdirIfNoExists(dir) {
  const exists = await fileExists(dir);

  if (!exists) {
    await fs.mkdir(dir);
  }
}

export async function checkRequiredFiles() {
  const dirs = ['content/pages', 'content/_layouts'];
  const files = ['content/_layouts/layout.html'];

  for (const dir of dirs) {
    const exists = await fileExists(dir);
    if (!exists) {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  for (const file of files) {
    const exists = await fileExists(file);
    if (!exists) {
      logger.error(`Missing required file: ${file}`);
      process.exit(1);
    }
  }
}

export async function clean() {
  await fs.rmdir('build', { recursive: true });
  await fs.mkdir('build');
}

export async function copyAllFilesRecursively(dirName, outputDir) {
  const dir = await fs.opendir(dirName);
  for await (const file of dir) {
    if (file.isDirectory()) {
      const newDir = `${outputDir}/${file.name}`;

      if (fileExists(newDir)) {
        await fs.mkdir(newDir);
      }
      copyAllFilesRecursively(`${dirName}/${file.name}`, newDir);
    } else {
      logger.info(`  ${dirName}/${file.name} -> ${outputDir}/${file.name}`);
      await fs.copyFile(`${dirName}/${file.name}`, `${outputDir}/${file.name}`);
    }
  }
}

export async function copyPublicFiles() {
  await copyAllFilesRecursively('public', 'build');
}

export function find(arr, predicate) {
  for (const obj of arr) {
    if (obj !== null && predicate(obj) === true) {
      return obj;
    }
  }
  return null;
}