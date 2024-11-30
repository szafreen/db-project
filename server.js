const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL
    )`);
});

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const PORT = 3000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle form submission
app.post('/submit', (req, res) => {
    const { name, email } = req.body; // Destructure `name` and `email`
    if (!name || !email) {
        return res.status(400).send('Name and email are required.');
    }

    db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, [name, email], function (err) {
        if (err) {
            return res.status(500).send('Error saving data.');
        }
        res.send('Data saved successfully!');
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

