const fs = require('fs');

function replacePadding(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/px-4 py-3/g, 'px-2 py-1.5');
  content = content.replace(/px-4 py-2/g, 'px-2 py-1.5');
  fs.writeFileSync(filePath, content);
}

replacePadding('src/components/pscore/PScoreAnalysis.tsx');
replacePadding('src/components/dashboard/NationalCampusRanking.tsx');
console.log('Done');
