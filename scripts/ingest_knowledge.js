/**
 * 🧠 OMNIVERSE INGESTION ENGINE (Phase 2)
 * ---------------------------------------
 * Scans static-archive and services to build a Knowledge Graph.
 * Output: data/knowledge-seed.json
 */

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

// --- CONFIGURATION ---
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'knowledge-seed.json');

// We scan these specific areas
const SCAN_TARGETS = [
    'static-archive/learning-snippets',
    'static-archive/assignments',
    'static-archive/legacy-sites',
    'services',
    'packages'
];

// --- THE BRAIN (Auto-Tagging Logic) ---
const TAG_MAP = {
    'auth': ['jwt', 'bcrypt', 'passport', 'login', 'signup', 'token'],
    'database': ['mongoose', 'schema', 'sql', 'query', 'join', 'mongodb', 'db.connect'],
    'api': ['express', 'router', 'get(', 'post(', 'fetch', 'axios', 'res.json'],
    'frontend': ['react', 'component', 'props', 'div', 'css', 'flex', 'grid'],
    'algo': ['for', 'while', 'map', 'reduce', 'filter', 'sort', 'search']
};

const EXTENSION_MAP = {
    '.js': 'javascript', '.jsx': 'react', '.ts': 'typescript',
    '.css': 'css', '.scss': 'scss', '.html': 'html',
    '.sql': 'sql', '.ejs': 'ejs', '.json': 'json', '.md': 'markdown'
};

// --- MAIN ENGINE ---
async function ignite() {
    console.log(`\n🚀 OMNIVERSE ENGINE STARTING...`);

    // 1. Ensure /data folder exists
    await fs.ensureDir(OUTPUT_DIR);

    let knowledgeBase = [];
    let totalFiles = 0;

    // 2. Loop through targets
    for (const target of SCAN_TARGETS) {
        const searchPath = path.join(ROOT_DIR, target);

        if (!fs.existsSync(searchPath)) {
            console.warn(`⚠️ Warning: Path not found, skipping: ${target}`);
            continue;
        }

        console.log(`📂 Scanning sector: ${target}...`);

        // Find code files (ignoring node_modules and assets)
        const files = glob.sync(`${searchPath}/**/*`, {
            nodir: true,
            ignore: ['**/node_modules/**', '**/.git/**', '**/*.{png,jpg,jpeg,mp4,lock}']
        });

        totalFiles += files.length;

        // 3. Process each file
        for (const filePath of files) {
            const ext = path.extname(filePath).toLowerCase();

            // Skip binary/unknown files
            if (!EXTENSION_MAP[ext]) continue;

            // Read content
            const content = await fs.readFile(filePath, 'utf8');

            // Skip empty or massive files
            if (content.length < 20 || content.length > 500000) continue;

            // Generate Metadata
            const relativePath = path.relative(ROOT_DIR, filePath);
            const concepts = new Set();
            const lowerContent = content.toLowerCase();

            // Auto-tagging
            Object.keys(TAG_MAP).forEach(tag => {
                if (TAG_MAP[tag].some(k => lowerContent.includes(k))) concepts.add(tag);
            });

            // Context tagging based on folder
            let confidence = 'experimental';
            let year = 2025; // Default current

            if (relativePath.includes('assignments')) {
                confidence = 'production-grade';
                concepts.add('assignment');
            } else if (relativePath.includes('learning-snippets')) {
                confidence = 'learning';
                concepts.add('snippet');
                year = 2023; // Historical assumption
            } else if (relativePath.includes('services')) {
                confidence = 'active';
                concepts.add('microservice');
            }

            // Push to Brain
            knowledgeBase.push({
                id: `node-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`,
                file: path.basename(filePath),
                path: relativePath,
                language: EXTENSION_MAP[ext],
                concepts: Array.from(concepts),
                confidence: confidence,
                stats: { lines: content.split('\n').length },
                // Store a snippet preview (first 300 chars)
                preview: content.substring(0, 300).replace(/\s+/g, ' ').trim()
            });
        }
    }

    // 4. Save to Disk
    await fs.writeJson(OUTPUT_FILE, knowledgeBase, { spaces: 2 });

    console.log(`\n✅ INGESTION COMPLETE.`);
    console.log(`🧠 Knowledge Nodes Created: ${knowledgeBase.length}`);
    console.log(`💾 Memory Saved: OmniVerse/data/knowledge-seed.json`);
}

ignite().catch(err => console.error(err));
