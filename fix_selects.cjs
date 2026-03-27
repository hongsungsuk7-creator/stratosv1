const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

/* 실제 스타일은 src/constants/uiClasses.ts 의 UI_FILTER_CONTROL_CLASS 와 동일해야 함 */
const classNameExpr = 'className={UI_FILTER_CONTROL_CLASS}';

const fixes = [
  {
    regex: /<select value=\{filters\.course\} onChange=\{\(e\) =>\n\s*<option value="">전체<\/option>/g,
    replacement: `<select value={filters.course} onChange={(e) => handleFilterChange('course', e.target.value)} ${classNameExpr}>\n                <option value="">전체</option>`,
  },
  {
    regex: /<select value=\{filters\.level\} onChange=\{\(e\) =>\n\s*<option value="">전체<\/option>/g,
    replacement: `<select value={filters.level} onChange={(e) => handleFilterChange('level', e.target.value)} ${classNameExpr}>\n                <option value="">전체</option>`,
  },
];

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const { regex, replacement } of fixes) {
    const next = content.replace(regex, replacement);
    if (next !== content) {
      content = next;
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${file}`);
  }
}
