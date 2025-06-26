// convert-imports.js
const fs = require('fs');
const path = require('path');

function convertImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const convertedLines = lines.map((line) => {
    // البحث عن imports التي تبدأ بـ src/
    const importMatch = line.match(/import\s+.*\s+from\s+['"]src\/(.+)['"]/);

    if (importMatch) {
      const importPath = importMatch[1];
      const currentDir = path.dirname(filePath);
      const targetPath = path.join('src', importPath);

      // حساب المسار النسبي
      const relativePath = path.relative(currentDir, targetPath);

      // التأكد من أن المسار يبدأ بـ ./ أو ../
      const normalizedPath = relativePath.startsWith('.') ? relativePath : './' + relativePath;

      // استبدال المسار
      return line.replace(
        /from\s+['"]src\/(.+)['"]/,
        `from '${normalizedPath.replace(/\\/g, '/')}'`,
      );
    }

    return line;
  });

  fs.writeFileSync(filePath, convertedLines.join('\n'));
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      console.log(`Converting: ${fullPath}`);
      convertImportsInFile(fullPath);
    }
  });
}

// تشغيل التحويل
processDirectory('./src');
console.log('تم تحويل جميع المسارات بنجاح!');
