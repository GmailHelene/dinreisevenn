const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./reviews.db');

// Opprett tabell hvis ikke finnes
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    review TEXT,
    date TEXT
  )`);
});

function addReview(review, cb) {
  db.run("INSERT INTO reviews (review, date) VALUES (?, ?)", [review, new Date().toISOString()], cb);
}

function getReviews(cb) {
  db.all("SELECT * FROM reviews ORDER BY date DESC", cb);
}

module.exports = { addReview, getReviews };