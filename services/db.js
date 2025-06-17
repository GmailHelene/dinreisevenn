const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./reviews.db');

// Opprett tabell hvis ikke finnes
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    review TEXT,
    date TEXT
  )`);
  
  // Legg til etter reviews-tabellen:
  db.run(`CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,
    plan TEXT,
    date TEXT
  )`);
});

function addReview(review, cb) {
  db.run("INSERT INTO reviews (review, date) VALUES (?, ?)", [review, new Date().toISOString()], cb);
}

function getReviews(cb) {
  db.all("SELECT * FROM reviews ORDER BY date DESC", cb);
}

function addPlan(userId, plan, cb) {
  db.run("INSERT INTO plans (userId, plan, date) VALUES (?, ?, ?)", [userId, JSON.stringify(plan), new Date().toISOString()], cb);
}

function getPlans(cb) {
  db.all("SELECT * FROM plans ORDER BY date DESC", cb);
}

function getPlansByUser(userId, cb) {
  db.all("SELECT * FROM plans WHERE userId = ? ORDER BY date DESC", [userId], cb);
}

function deletePlan(planId, userId, cb) {
  db.run("DELETE FROM plans WHERE id = ? AND userId = ?", [planId, userId], cb);
}

module.exports = { addReview, getReviews, addPlan, getPlansByUser, deletePlan };
