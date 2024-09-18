#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

const IGNORED_PATTERNS = [
  '\\.DS_Store',
  'Thumbs\\.db',
  '\\.git',
  '\\.env\\.example',
  '\\.env\\.local',
  '\\.eslintignore',
  '\\.eslintrc\\.cjs',
  '\\.gitignore',
  '\\.npmrc',
  '\\.prettierignore',
  '\\.prettierrc', 
  '\\.bin', 
    'node_modules',
  '\\.obsidian',
  '\\.vite-cache',
  '\\.svelte-kit',
  '\\.wrangler',
  'blocks'
];

const MAX_DEPTH = 5;

async function analyzeDirectory(dirPath, prefix = '', currentDepth = 0, rootDir, foldersOnly = false) {
  if (currentDepth >= MAX_DEPTH) return '';

  let result = '';
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  const sortedEntries = entries.sort((a, b) => {
    if (a.isDirectory() === b.isDirectory()) {
      return a.name.localeCompare(b.name);
    }
    return a.isDirectory() ? -1 : 1;
  });

  for (let i = 0; i < sortedEntries.length; i++) {
    const entry = sortedEntries[i];
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(rootDir, fullPath);
    
    if (IGNORED_PATTERNS.some(pattern => {
      const regex = new RegExp(`(^|/)${pattern}(/|$)`);
      return regex.test(entry.name) || regex.test(relativePath);
    })) continue;

    const isLast = i === sortedEntries.length - 1;
    
    if (entry.isDirectory()) {
      result += `${prefix}${isLast ? '└──' : '├──'} ${entry.name}/\n`;
      result += await analyzeDirectory(fullPath, `${prefix}${isLast ? '    ' : '│   '}`, currentDepth + 1, rootDir, foldersOnly);
    } else if (!foldersOnly) {
      result += `${prefix}${isLast ? '└──' : '├──'} ${entry.name}\n`;
    }
  }

  return result;
}

async function mapDirectory(rootDir, foldersOnly) {
  const structure = await analyzeDirectory(rootDir, '', 0, rootDir, foldersOnly);
  const outputFile = path.join(process.cwd(), foldersOnly ? 'map-folders.md' : 'map-files.md');
  await fs.writeFile(outputFile, structure, 'utf8');
  console.log(`Directory structure map has been saved to ${outputFile}`);
}

// Usage
const rootDirectory = process.argv[2] || '.';
const foldersOnly = process.argv.includes('--folders-only');

// Generate both maps
Promise.all([
  mapDirectory(rootDirectory, true),
  mapDirectory(rootDirectory, false)
]).catch(console.error);