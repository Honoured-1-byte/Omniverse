const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = __dirname;
const webd = path.resolve(root, '..');

const moves = [
    {
        src: path.join(root, 'services', 'user_rest_api'),
        dest: path.join(root, 'apps', 'api-gateway'),
        isDirContent: true // Move content of src to dest, or rename src to dest?
        // logic: we want src to BECOME dest or content to move into dest.
        // specific case: api-gateway exists and is empty.
    },
    {
        src: path.join(webd, 'DiscordBot_PhaseParamita'),
        dest: path.join(root, 'services', 'discord-bot'),
        isDir: true
    }
];

moves.forEach(m => {
    try {
        if (m.isDirContent) {
            // If dest exists and is empty, we can revert it and rename src
            if (fs.existsSync(m.dest) && fs.readdirSync(m.dest).length === 0) {
                fs.rmdirSync(m.dest);
                fs.renameSync(m.src, m.dest);
                console.log(`Renamed ${m.src} -> ${m.dest}`);
            } else {
                // Move items individually
                if (!fs.existsSync(m.dest)) fs.mkdirSync(m.dest, { recursive: true });
                const items = fs.readdirSync(m.src);
                items.forEach(item => {
                    const s = path.join(m.src, item);
                    const d = path.join(m.dest, item);
                    fs.renameSync(s, d);
                });
                fs.rmdirSync(m.src);
                console.log(`Moved content of ${m.src} -> ${m.dest}`);
            }
        } else {
            fs.renameSync(m.src, m.dest);
            console.log(`Moved ${m.src} -> ${m.dest}`);
        }
    } catch (e) {
        console.error(`Error on ${m.src}: ${e.message}`);
    }
});
