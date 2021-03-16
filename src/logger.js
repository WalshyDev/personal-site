import chalk from 'chalk';
import * as process from 'process';

export function info(msg) {
  console.log(chalk.green(log(msg)));
}

export function debug(msg) {
  if (process.env.DEBUG === 'true') {
    console.log(chalk.grey('[DEBUG] ' + log(msg)));
  }
}

export function warn(msg) {
  console.log(chalk.yellow(log(msg)));
}

export function error(msg) {
  console.log(chalk.red(log(msg)));
}

function log(msg) {
  if (typeof(msg) === 'object') {
    return JSON.stringify(msg);
  } else {
    return msg;
  }
}