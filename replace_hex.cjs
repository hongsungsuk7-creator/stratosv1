const fs = require('fs');
const file = 'src/components/pcram/PcRamAnalysis.tsx';
let content = fs.readFileSync(file, 'utf8');

// emerald-500 to green-500
content = content.replace(/#10b981/g, '#22c55e');
// amber-500 to orange-500
content = content.replace(/#f59e0b/g, '#f97316');
// rose-500 to red-500
content = content.replace(/#f43f5e/g, '#ef4444');

fs.writeFileSync(file, content);
console.log('Done');
