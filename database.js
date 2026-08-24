# Database Setup

```javascript
const Database = require("better-sqlite3");

const db = new Database("ado-women.db");

db.pragma("journal_mode = WAL");

db.exec(`
    CREATE TABLE IF NOT EXISTS women (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        bank TEXT NOT NULL,
        account TEXT NOT NULL,
        ward TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS excos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ward TEXT NOT NULL,
        position TEXT NOT NULL,
        name TEXT DEFAULT '',
        UNIQUE(ward, position)
    );
`);

const wards = [
    "ADO 'A' AJILOSUN",
    "ADO 'B' INISA",
    "ADO 'C' IDOLOFIN",
    "ADO 'D' IJIGBO",
    "ADO 'E' IJOKA / OREREOWU",
    "ADO 'F' OKEYINMI",
    "ADO 'G' OKE ILA",
    "ADO 'H' EREGURU",
    "ADO 'I' DALLIMORE",
    "ADO 'J' OKESA",
    "ADO 'K' IRONA",
    "ADO 'L' IGBEHIN",
    "ADO 'M' FARM SETTLEMENT"
];

const positions = [
    "Ward Coordinator",
    "Deputy Ward Coordinator",
    "Secretary",
    "Mobilization Officer",
    "Women Empowerment Officer",
    "Media/Publicity Officer",
    "Welfare Officer",
    "Polling Unit Officer"
];

const insertExco = db.prepare(`
    INSERT OR IGNORE INTO excos
    (ward, position, name)
    VALUES (?, ?, '')
`);

for (const ward of wards) {
    for (const position of positions) {
        insertExco.run(ward, position);
    }
}

module.exports = {
    db,
    wards,
    positions
};
```
