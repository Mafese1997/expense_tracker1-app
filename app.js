const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');
const { body, validationResult } = require('express-validator');

dotenv.config();

const app = express();

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// Routes
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.post('/register', 
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) throw err;

            const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
            db.query(query, [username, hashedPassword], (err, result) => {
                if (err) throw err;
                res.redirect('/login');
            });
        });
    }
);

app.post('/login', 
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;
        const query = 'SELECT * FROM users WHERE username = ?';

        db.query(query, [username], (err, results) => {
            if (err) throw err;
            if (results.length === 0) {
                return res.status(400).send('User not found');
            }

            bcrypt.compare(password, results[0].password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    req.session.userId = results[0].id;
                    res.redirect('/tracker');
                } else {
                    res.status(400).send('Incorrect password');
                }
            });
        });
    }
);

app.get('/tracker', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'views', 'expense-tracker.html'));
});

app.post('/add-expense', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const { name, amount } = req.body;
    const query = 'INSERT INTO expenses (user_id, name, amount) VALUES (?, ?, ?)';

    db.query(query, [req.session.userId, name, amount], (err, result) => {
        if (err) throw err;
        res.redirect('/tracker');
    });
});

app.post('/update-expense', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const { id, name, amount } = req.body;
    const query = 'UPDATE expenses SET name = ?, amount = ? WHERE id = ? AND user_id = ?';

    db.query(query, [name, amount, id, req.session.userId], (err, result) => {
        if (err) throw err;
        res.redirect('/tracker');
    });
});

app.post('/delete-expense', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const { id } = req.body;
    const query = 'DELETE FROM expenses WHERE id = ? AND user_id = ?';

    db.query(query, [id, req.session.userId], (err, result) => {
        if (err) throw err;
        res.redirect('/tracker');
    });
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
