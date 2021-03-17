import * as logger from '../logger.js';

export default function MetaPlugin(md) {
  // Make sure this is reset. Don't want to bring over meta from the other blogs.
  md.meta = [];
  md.block.ruler.before('code', 'meta', meta.bind(null, md), { alt: [] })
}

function get(state, line) {
  const pos = state.bMarks[line];
  const max = state.eMarks[line];
  return state.src.substr(pos, max - pos);
}

function extractData(line) {
  const regex = /(\w+): (.+)/gm;

  const matcher = regex.exec(line);

  if (matcher === null) {
    logger.warn(`Failed to read metadata! Given line: '${line}'`);
    return null;
  }

  // This is necessary to avoid infinite loops with zero-width matches
  if (matcher.index === regex.lastIndex) {
      regex.lastIndex++;
  }
  
  // Make sure the groups are there
  if (matcher.length === 3) {
    return {
      meta: matcher[1],
      value: matcher[2]
    }
  }
}

function meta(md, state, start, end, silent) {
  // Make sure we're at the start of the file
  if (start !== 0 || state.blkIndent !== 0) {
    return false;
  }

  // No idea what this line is doing but we'll leave it
  if (state.tShift[start] < 0) {
    return false;
  }

  // We make sure the first line is "----"
  if (get(state, start) !== '----') {
    return false;
  }

  const data = [];
  let line = start;
  while (line++ < end) {
    const str = get(state, line);
    // Check for meta block end
    if (str === ('----')) {
      break;
    }

    // Whatever this is again
    if (state.tShift[line] < 0) {
      break;
    }

    const lineData = extractData(str);
    if (lineData !== null) {
      data.push(lineData);
    }
  }

  if (line >= end) {
    return false
  }

  md.meta = data; 
  state.line = line + 1;
  return true;
}