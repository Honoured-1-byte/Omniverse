// services/social-engine/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to 'social.db' file in this folder
const dbPath = path.resolve(__dirname, 'social.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ SQLITE CONNECTION ERROR:', err.message);
    } else {
        console.log('✅ Connected to SQLite database (social.db)');
        // Enable Foreign Keys (Crucial for your schema)
        db.run('PRAGMA foreign_keys = ON');
    }
});

// Helper wrapper to make queries use Promises (async/await compatible)
// This mimics the 'mysql2/promise' style your app likely uses
// Support both Promise-style and callback-style usages for compatibility with mysql2-like code.
db.query = function (sql, params = [], cb) {
    // allow calling db.query(sql, cb)
    if (typeof params === 'function') {
        cb = params;
        params = [];
    }

    const isSelect = sql.trim().toLowerCase().startsWith('select');

    if (typeof cb === 'function') {
        if (isSelect) {
            db.all(sql, params, (err, rows) => cb(err, rows));
        } else {
            db.run(sql, params, function (err) {
                if (err) cb(err);
                else cb(null, { insertId: this.lastID, affectedRows: this.changes });
            });
        }
        return;
    }

    // Promise style
    return new Promise((resolve, reject) => {
        if (isSelect) {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        } else {
            db.run(sql, params, function (err) {
                if (err) reject(err);
                else resolve({ insertId: this.lastID, affectedRows: this.changes });
            });
        }
    });
};

module.exports = db;