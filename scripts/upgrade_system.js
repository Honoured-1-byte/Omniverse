const fs = require('fs-extra');
const path = require('path');

const root = path.resolve(__dirname, '..'); // OmniVerse root

async function upgrade() {
    console.log("🚀 Starting System Upgrade (Phase 3)...");

    // Helper
    const move = (srcRel, destRel) => {
        const src = path.join(root, srcRel);
        const dest = path.join(root, destRel);
        try {
            if (fs.existsSync(src)) {
                fs.ensureDirSync(path.dirname(dest));
                fs.moveSync(src, dest, { overwrite: true });
                console.log(`✅ Moved: ${srcRel} -> ${destRel}`);
            } else {
                console.log(`⚠️ Skipped (Source Not Found): ${srcRel}`);
            }
        } catch (e) {
            console.error(`❌ Error moving ${srcRel}: ${e.message}`);
        }
    };

    // 1. Promote Apps
    move('static-archive/legacy-sites/web-showcase/spotify', 'apps/music-player');
    move('static-archive/legacy-sites/web-showcase/simon', 'apps/games/simon');

    // 2. Promote Services
    move('static-archive/assignments/quick-buy', 'services/shop-core');
    move('static-archive/assignments/kapota-connect', 'services/social-graph');
    move('static-archive/legacy-sites/anime-network', 'services/anime-hub');

    // Rename/Fix Services
    move('services/DiscordBot_PhaseParamita', 'services/discord-bot');

    // Clean dead services
    fs.removeSync(path.join(root, 'services/campus-mart'));
    fs.removeSync(path.join(root, 'services/social-media'));
    console.log("🗑️ Cleaned dead service shells.");

    // 3. Create Reference Library
    const refLib = path.join(root, 'packages/reference-library');
    fs.ensureDirSync(refLib);

    const snippetsDir = path.join(root, 'static-archive/learning-snippets');
    if (fs.existsSync(snippetsDir)) {
        const items = fs.readdirSync(snippetsDir);
        for (const item of items) {
            move(`static-archive/learning-snippets/${item}`, `packages/reference-library/${item}`);
        }
        // Remove empty learning-snippets if empty
        if (fs.readdirSync(snippetsDir).length === 0) {
            fs.removeSync(snippetsDir);
        }
    }

    // 4. Reptile Integration
    const reptileSrc = path.join(root, 'packages/reference-library/reptile-cursor/Reptile Interactive Cursor/script.js');
    // Note: It might be under 'reptile-cursor' directly depending on move, but looking at previous list_dir, it was nested.
    // If we just moved learning-snippets/* to reference-library/*, then:
    // packages/reference-library/reptile-cursor/Reptile Interactive Cursor/script.js

    const uiPublic = path.join(root, 'apps/desktop-ui/public');
    fs.ensureDirSync(uiPublic);

    if (fs.existsSync(reptileSrc)) {
        fs.copySync(reptileSrc, path.join(uiPublic, 'reptile.js'));
        console.log("🦎 Reptile script injected to UI public folder.");
    } else {
        // Try searching deeper if nested
        const glob = require('glob');
        const found = glob.sync(`${root}/packages/reference-library/**/script.js`);
        if (found.length > 0) {
            // Heuristic: check if it's the reptile one
            const potential = found.find(f => f.includes('Reptile'));
            if (potential) {
                fs.copySync(potential, path.join(uiPublic, 'reptile.js'));
                console.log("🦎 Reptile script found and injected.");
            }
        }
    }

    console.log("✨ Upgrade Complete.");
}

upgrade();
