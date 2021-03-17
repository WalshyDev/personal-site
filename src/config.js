import * as fs from 'fs';
import { fileExists } from './functions.js';

const config = fileExists('config.json') ? JSON.parse(fs.readFileSync('config.json', 'utf8')) : null;
export default config;