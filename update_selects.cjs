const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let modified = false;

  // Check if the file has course/level selects
  if (content.includes('filters.course') && content.includes('filters.level')) {
    // Add import if not exists
    if (!content.includes('COURSE_LEVEL_MAP')) {
      // Find the last import
      const importRegex = /import.*?;?\n/g;
      let lastMatch;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        lastMatch = match;
      }
      
      if (lastMatch) {
        const insertPos = lastMatch.index + lastMatch[0].length;
        content = content.slice(0, insertPos) + "import { COURSES, COURSE_LEVEL_MAP } from '../constants';\n" + content.slice(insertPos);
      } else {
        content = "import { COURSES, COURSE_LEVEL_MAP } from '../constants';\n" + content;
      }
      modified = true;
    }

    // Replace Course options
    const courseSelectRegex = /(<select[^>]*value=\{filters\.course\}[^>]*>)([\s\S]*?)(<\/select>)/;
    if (courseSelectRegex.test(content)) {
      content = content.replace(courseSelectRegex, (match, p1, p2, p3) => {
        return `${p1}
                <option value="">전체</option>
                {COURSES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              ${p3}`;
      });
      modified = true;
    }

    // Replace Level options
    const levelSelectRegex = /(<select[^>]*value=\{filters\.level\}[^>]*>)([\s\S]*?)(<\/select>)/;
    if (levelSelectRegex.test(content)) {
      content = content.replace(levelSelectRegex, (match, p1, p2, p3) => {
        return `${p1}
                <option value="">전체</option>
                {filters.course && COURSE_LEVEL_MAP[filters.course] ? (
                  COURSE_LEVEL_MAP[filters.course].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))
                ) : (
                  <option value="" disabled>과정을 먼저 선택하세요</option>
                )}
              ${p3}`;
      });
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
