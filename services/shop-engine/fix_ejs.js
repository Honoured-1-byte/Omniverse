const fs = require('fs');
const path = require('path');
const glob = require('glob');

const viewsDir = path.join(__dirname, 'views');

function fixIncludes(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/<%-\s*include\s+([^\s()]+)\s*%>/g, "<%- include('$1') %>");

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Fixed: ${filePath}`);
    }
}

function traverseDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else {
            if (fullPath.endsWith('.ejs')) {
                fixIncludes(fullPath);
            }
        }
    });
}

traverseDir(viewsDir);
console.log("Done fixing EJS includes.");
