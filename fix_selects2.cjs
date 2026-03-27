const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

const classNameStr = 'className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"';

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let modified = false;

  const brokenCourseRegex = /<select\s+value=\{filters\.course\}\s+onChange=\{\(e\) =>\n\s*<option value="">전체<\/option>/g;
  if (brokenCourseRegex.test(content)) {
    content = content.replace(brokenCourseRegex, `<select value={filters.course} onChange={(e) => handleFilterChange('course', e.target.value)} ${classNameStr}>\n                <option value="">전체</option>`);
    modified = true;
  }

  const brokenLevelRegex = /<select\s+value=\{filters\.level\}\s+onChange=\{\(e\) =>\n\s*<option value="">전체<\/option>/g;
  if (brokenLevelRegex.test(content)) {
    content = content.replace(brokenLevelRegex, `<select value={filters.level} onChange={(e) => handleFilterChange('level', e.target.value)} ${classNameStr}>\n                <option value="">전체</option>`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${file}`);
  }
}
