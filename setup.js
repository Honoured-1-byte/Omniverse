const fs = require('fs');
const path = require('path');

const root = __dirname; // OmniVerse
const parent = path.resolve(root, '..'); // web_d

const dirs = [
    'apps', 'apps/desktop-ui', 'apps/api-gateway',
    'packages', 'packages/auth', 'packages/database', 'packages/ui-kit',
    'static-archive', 'static-archive/legacy-sites', 'static-archive/learning-snippets', 'static-archive/assignments',
    'scripts',
    'services' // Ensure services exists
];

console.log('Creating directories...');
dirs.forEach(d => {
    try {
        const p = path.join(root, d);
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p, { recursive: true });
            console.log('Created: ' + d);
        } else {
            console.log('Exists: ' + d);
        }
    } catch (e) {
        console.error('Error creating ' + d + ': ' + e.message);
    }
});

const moves = [
    // web_d root items
    { src: path.join(parent, 'DiscordBot_PhaseParamita'), dest: path.join(root, 'services/discord-bot') },
    { src: path.join(parent, 'QuickBuy'), dest: path.join(root, 'static-archive/assignments/quick-buy') },
    { src: path.join(parent, 'Task_2_KapotaConnect'), dest: path.join(root, 'static-archive/assignments/kapota-connect') },

    // Sandbox
    { src: path.join(parent, 'Sandbox/modules/AnimeNetwork'), dest: path.join(root, 'static-archive/legacy-sites/anime-network') },
    { src: path.join(parent, 'Sandbox/modules/WebShowcase'), dest: path.join(root, 'static-archive/legacy-sites/web-showcase') },

    // Archive
    { src: path.join(parent, 'Archive/AnimeVerse'), dest: path.join(root, 'static-archive/legacy-sites/anime-verse') },
    { src: path.join(parent, 'Archive/HelloAnime'), dest: path.join(root, 'static-archive/legacy-sites/hello-anime') },
    { src: path.join(parent, 'Archive/national_daddy_portfolio'), dest: path.join(root, 'static-archive/legacy-sites/national-portfolio') },

    // Archive Learning
    { src: path.join(parent, 'Archive/ejs_learning'), dest: path.join(root, 'static-archive/learning-snippets/ejs_learning') },
    { src: path.join(parent, 'Archive/express_learning'), dest: path.join(root, 'static-archive/learning-snippets/express_learning') },
    { src: path.join(parent, 'Archive/sql_learning'), dest: path.join(root, 'static-archive/learning-snippets/sql_learning') },
    { src: path.join(parent, 'Archive/bootstrap_learning'), dest: path.join(root, 'static-archive/learning-snippets/bootstrap_learning') },
    { src: path.join(parent, 'Archive/rest_api_learning'), dest: path.join(root, 'static-archive/learning-snippets/rest_api_learning') },

    // Internal Moves (OmniVerse/services -> ...)
    { src: path.join(root, 'services/user_rest_api'), dest: path.join(root, 'apps/api-gateway') },
    // wanderlust etc are internal renames, assume run_command handled them or user did? 
    // Wait, I should include them if they failed.
    { src: path.join(root, 'services/Wander_Lust bnb'), dest: path.join(root, 'services/wanderlust') },
    { src: path.join(root, 'services/CampusMart'), dest: path.join(root, 'services/campus-mart') },
    { src: path.join(root, 'services/social_media'), dest: path.join(root, 'services/social-media') },
    { src: path.join(root, 'services/url_shortener'), dest: path.join(root, 'services/url-shortener') }
];

console.log('Moving files...');
moves.forEach(m => {
    try {
        if (fs.existsSync(m.src)) {
            // If dest exists, renameSync typically throws or overwrites depending on OS/Node version but for directories it usually fails if dest is non-empty.
            // We assume dest doesn't exist or we can overwrite?
            // Node's renameSync handles directory moves on same device.
            fs.renameSync(m.src, m.dest);
            console.log(`Moved ${path.basename(m.src)} to ${path.relative(root, m.dest)}`);
        } else {
            console.log(`Skipped (not found): ${m.src}`);
        }
    } catch (e) {
        console.error(`Error moving ${m.src}: ${e.message}`);
    }
});
