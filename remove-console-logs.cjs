const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

function removeConsoleLogs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalLines = content.split('\n').length;
  
  // Remove console statements (handles multi-line)
  const lines = content.split('\n');
  const newLines = [];
  let inConsole = false;
  let bracketCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if line starts console statement
    if (/^\s*console\.(log|info|warn|error|debug)\(/.test(line)) {
      inConsole = true;
      bracketCount = 0;
    }
    
    if (inConsole) {
      // Count brackets
      for (const char of line) {
        if (char === '(') bracketCount++;
        if (char === ')') bracketCount--;
      }
      
      // Check if console statement ends
      if (bracketCount === 0 && /\);?\s*$/.test(line)) {
        inConsole = false;
        continue; // Skip this line
      }
      continue; // Skip lines inside console statement
    }
    
    newLines.push(line);
  }
  
  const newContent = newLines.join('\n');
  const newLineCount = newLines.length;
  
  if (originalLines !== newLineCount) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    return originalLines - newLineCount;
  }
  
  return 0;
}

// Main execution
const srcPath = path.join(__dirname, 'src');
const files = getAllFiles(srcPath);

let totalCleaned = 0;
let totalLinesRemoved = 0;

files.forEach((file) => {
  const removed = removeConsoleLogs(file);
  if (removed > 0) {
    console.log(`✅ Cleaned: ${path.basename(file)} (removed ${removed} lines)`);
    totalCleaned++;
    totalLinesRemoved += removed;
  }
});

console.log(`\n🎉 Total files cleaned: ${totalCleaned}`);
console.log(`📉 Total lines removed: ${totalLinesRemoved}`);
console.log(`✨ All console statements removed!`);
