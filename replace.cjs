const fs = require('fs');
const file = 'src/components/pcram/PcRamAnalysis.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/indigo/g, 'blue');
content = content.replace(/emerald/g, 'green');
content = content.replace(/amber/g, 'orange');
content = content.replace(/rose/g, 'red');
fs.writeFileSync(file, content);
console.log('Done');
