const fs = require('fs');
const lines = fs.readFileSync('assets/css/responsive.css', 'utf-8').split('\n');

const tableBlock = lines.slice(573, 675).join('\n');
const hasBlock = lines.slice(835, 850).join('\n');

const newCss = lines.slice();

// Remove from bottom first to avoid index shifting
newCss.splice(835, 15);
newCss.splice(573, 102);

// Find the closing brace for 1199px. It's originally at line 441, but let's just search for it.
// We know it's right before '/* Mobile Devices */'
let targetIndex = newCss.findIndex(l => l.includes('/* Mobile Devices */'));
if (targetIndex !== -1) {
  // targetIndex is the comment. The line before is '}'. Insert right before '}'
  newCss.splice(targetIndex - 1, 0, '\n' + tableBlock + '\n' + hasBlock + '\n');
  fs.writeFileSync('assets/css/responsive.css', newCss.join('\n'));
  console.log('Success!');
} else {
  console.log('Could not find target index');
}
