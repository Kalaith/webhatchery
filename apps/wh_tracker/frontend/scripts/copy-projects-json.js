const fs = require('fs');
const path = require('path');

const source = path.resolve(__dirname, '../../../projects.json');
const dest = path.resolve(__dirname, '../public/projects.json');

fs.copyFile(source, dest, (err) => {
  if (err) {
    console.error('[copy-projects-json] Failed to copy projects.json:', err);
    process.exit(1);
  } else {
    console.log('[copy-projects-json] Copied projects.json to public directory.');
  }
});
