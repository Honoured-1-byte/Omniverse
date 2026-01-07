/**
 * 👁️ OMNI CLI
 * -----------
 * The interface to your Second Brain.
 * Usage: 
 * node scripts/omni.js stats
 * node scripts/omni.js search "auth"
 * node scripts/omni.js tags
 */

const fs = require('fs');
const path = require('path');

// LOAD THE BRAIN
const DB_PATH = path.join(__dirname, '../data/knowledge-seed.json');

if (!fs.existsSync(DB_PATH)) {
    console.error("❌ Error: Brain not found. Run 'node scripts/ingest_knowledge.js' first.");
    process.exit(1);
}

const brain = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const args = process.argv.slice(2);
const command = args[0];
const query = args[1];

// --- UTILS ---
const pad = (str, len) => (str + ' '.repeat(len)).slice(0, len);

// --- COMMANDS ---

function showStats() {
    console.log(`\n🧠 OMNIVERSE BRAIN STATS`);
    console.log(`=======================`);
    console.log(`Total Nodes:  ${brain.length}`);

    // Count by Language
    const langs = {};
    brain.forEach(n => langs[n.language] = (langs[n.language] || 0) + 1);

    console.log(`\nLanguages:`);
    Object.keys(langs)
        .sort((a, b) => langs[b] - langs[a])
        .forEach(l => console.log(`  ${pad(l || 'misc', 12)} : ${langs[l]}`));

    // Count by Confidence
    const conf = {};
    brain.forEach(n => conf[n.confidence] = (conf[n.confidence] || 0) + 1);
    console.log(`\nStatus:`);
    Object.keys(conf).forEach(c => console.log(`  ${pad(c, 12)} : ${conf[c]}`));
}

function search(term) {
    if (!term) return console.log("❌ Usage: node omni.js search \"term\"");

    term = term.toLowerCase();
    console.log(`\n🔍 Searching for: "${term}"...\n`);

    const results = brain.filter(node => {
        const inConcepts = node.concepts.some(c => c.includes(term));
        const inFile = node.file.toLowerCase().includes(term);
        // Fix: Ingestion script used 'path' not 'source.path' for the relative path
        const inPath = (node.path || node.source?.path || "").toLowerCase().includes(term);
        return inConcepts || inFile || inPath;
    });

    if (results.length === 0) return console.log("No matches found.");

    results.forEach(r => {
        const icon = r.confidence === 'active' ? '🚀' : r.confidence === 'learning' ? '📚' : '🏛️';
        console.log(`${icon} [${r.language}] ${r.file}`);
        // Fix: Display the path correctly based on ingestion schema
        console.log(`   Path: ${r.path || r.source?.path}`);
        console.log(`   Tags: ${r.concepts.join(', ')}`);
        console.log(`   ID:   ${r.id}`);
        console.log('---');
    });

    console.log(`\nFound ${results.length} matches.`);
}

function showTags() {
    const tags = new Set();
    brain.forEach(n => n.concepts.forEach(c => tags.add(c)));
    console.log(`\n🏷️  KNOWN CONCEPTS`);
    console.log(Array.from(tags).sort().join(', '));
}

// --- ROUTER ---
switch (command) {
    case 'stats': showStats(); break;
    case 'search': search(query); break;
    case 'tags': showTags(); break;
    default:
        console.log("👁️  OMNI CLI HELP");
        console.log("  node scripts/omni.js stats        -> Show brain health");
        console.log("  node scripts/omni.js tags         -> List all concepts");
        console.log("  node scripts/omni.js search <txt> -> Find code");
}
