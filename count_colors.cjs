const fs = require('fs');
const file = 'src/components/pcram/PcRamAnalysis.tsx';
let content = fs.readFileSync(file, 'utf8');
const matches = content.match(/text-[a-z]+-[0-9]+/g) || [];
const counts = {};
matches.forEach(m => counts[m] = (counts[m] || 0) + 1);
console.log(counts);
