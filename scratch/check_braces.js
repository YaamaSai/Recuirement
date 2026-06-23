const fs = require('fs');
const content = fs.readFileSync('d:/5websites/Recuiremnet/assets/css/style.css', 'utf8');

let braceCount = 0;
let lineNum = 1;
let lastOpenLine = 0;

for (let i = 0; i < content.length; i++) {
  const char = content[i];
  if (char === '\n') {
    lineNum++;
  }
  if (char === '{') {
    braceCount++;
    lastOpenLine = lineNum;
  } else if (char === '}') {
    braceCount--;
    if (braceCount < 0) {
      console.log(`Unmatched closing brace '}' at line ${lineNum}`);
      braceCount = 0;
    }
  }
}

console.log(`Final brace count: ${braceCount}`);
if (braceCount > 0) {
  console.log(`There is/are ${braceCount} unclosed opening braces '{'. Last opened around line ${lastOpenLine}`);
}
