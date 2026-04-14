const fs = require('fs');
const path = require('path');

const WIKI_DIR = path.join(__dirname, '..', 'wiki');
const OUTPUT_FILE = path.join(__dirname, 'wiki-data.json');

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const rawMeta = match[1];
  const body = match[2];
  const meta = {};

  let currentKey = null;
  let currentList = null;

  for (const line of rawMeta.split(/\r?\n/)) {
    const listItem = line.match(/^\s+-\s+"?(.+?)"?\s*$/);
    const kvMatch = line.match(/^(\w[\w_-]*):\s*(.*)$/);

    if (listItem && currentKey) {
      if (!currentList) currentList = [];
      currentList.push(listItem[1].replace(/^"|"$/g, ''));
    } else {
      if (currentKey && currentList) {
        meta[currentKey] = currentList;
        currentList = null;
      }
      if (kvMatch) {
        currentKey = kvMatch[1];
        const val = kvMatch[2].trim();
        if (val === '' || val === '[]') {
          meta[currentKey] = val === '[]' ? [] : undefined;
        } else {
          meta[currentKey] = val.replace(/^"|"$/g, '');
        }
      }
    }
  }
  if (currentKey && currentList) {
    meta[currentKey] = currentList;
  }

  return { meta, body };
}

function walkDir(dir, baseDir = dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // skip canvases and meta images
      if (['canvases', 'domains'].includes(entry.name)) continue;
      results.push(...walkDir(fullPath, baseDir));
    } else if (entry.name.endsWith('.md')) {
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      const content = fs.readFileSync(fullPath, 'utf-8');
      const { meta, body } = parseFrontmatter(content);
      const slug = relativePath.replace(/\.md$/, '');
      const name = entry.name.replace(/\.md$/, '');

      results.push({
        slug,
        name,
        path: relativePath,
        type: meta.type || 'unknown',
        title: meta.title || name,
        status: meta.status || 'unknown',
        tags: Array.isArray(meta.tags) ? meta.tags : [],
        related: Array.isArray(meta.related) ? meta.related : [],
        created: meta.created || '',
        updated: meta.updated || '',
        domain: meta.domain || '',
        body
      });
    }
  }
  return results;
}

const pages = walkDir(WIKI_DIR);

// Build category map
const categories = {};
for (const page of pages) {
  const dir = path.dirname(page.path);
  const cat = dir === '.' ? 'root' : dir;
  if (!categories[cat]) categories[cat] = [];
  categories[cat].push(page.slug);
}

const data = { pages, categories };
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), 'utf-8');
console.log(`Built wiki-data.json: ${pages.length} pages, ${Object.keys(categories).length} categories`);
