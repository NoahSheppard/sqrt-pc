const fs = require('fs');

const csv = fs.readFileSync('BOM.csv', 'utf8');
const readme = fs.readFileSync('README.md', 'utf8');

// Parse CSV into rows, handling quoted fields
const rows = csv.trim().split('\n').map(row =>
  row.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
);

const [header, ...body] = rows;

// Build the markdown table
const separator = header.map(() => '---');
const toRow = cols => '| ' + cols.join(' | ') + ' |';

const table = [
  toRow(header),
  toRow(separator),
  ...body.map(toRow)
].join('\n');

// Splice it into the README between the markers
const updated = readme.replace(
  /<!-- BOM_START -->[\s\S]*?<!-- BOM_END -->/,
  `<!-- BOM_START -->\n${table}\n<!-- BOM_END -->`
);

fs.writeFileSync('README.md', updated);
console.log('README.md updated.');