const fs = require('fs');
const path = require('path');

const root = __dirname; // OmniVerse
const parent = path.resolve(root, '..'); // web_d

// Helper for moving
function move(srcRelative, destRelative) {
    const src = path.join(parent, srcRelative);
    const dest = path.join(root, destRelative);

    try {
        if (fs.existsSync(src)) {
            // Ensure dest dir exists
            const destDir = path.dirname(dest);
            if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

            // If moving to a folder that doesn't exist (renaming operation) or moving INTO a folder
            // fs.renameSync handles both but let's be robust

            // Special check: If src is a directory and we want to move content or rename?
            // Here we mostly rename folders.
            fs.renameSync(src, dest);
            console.log(`✅ Moved: ${srcRelative} -> ${destRelative}`);
        } else {
            console.log(`⚠️ Skipped (Not Found): ${srcRelative}`);
        }
    } catch (e) {
        console.error(`❌ Error Moving ${srcRelative}: ${e.message}`);
    }
}

// Helper for deleting
function remove(targetRelative) {
    const target = path.join(parent, targetRelative);
    try {
        if (fs.existsSync(target)) {
            fs.rmSync(target, { recursive: true, force: true });
            console.log(`🗑️ Deleted: ${targetRelative}`);
        } else {
            console.log(`⚠️ Skipped (Not Found): ${targetRelative}`);
        }
    } catch (e) {
        console.error(`❌ Error Deleting ${targetRelative}: ${e.message}`);
    }
}

console.log("🌪️ Starting Operation: Absolute Fusion...");

// 1. MOVES
move('Todo Harry', 'apps/todo-harry');
move('clone_ott', 'static-archive/legacy-sites/netflix-clone');
move('Todo_app', 'static-archive/learning-snippets/todo-react-legacy');
move('Reptile Interactive Cursor (2)', 'static-archive/learning-snippets/reptile-cursor');

// 2. DELETES
// remove('temp-project'); // User already deleted or moved? Check report.
remove('temp-project');
remove('OTT-main');
remove('netflix'); // The folder
remove('ToDo_list_app');
remove('vite-project');

// 3. RETRY STUCK MOVES (Discord)
console.log("🔄 Retrying Stuck Moves...");
move('DiscordBot_PhaseParamita', 'services/discord-bot');

console.log("✨ Finalization Complete.");
