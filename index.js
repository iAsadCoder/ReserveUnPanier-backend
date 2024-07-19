const express = require('express');
require('dotenv').config();
const mysql = require('mysql');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: '2Good2Waste'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// Standard response format
const createResponse = (code, message, data = null) => ({
    code,
    message,
    response: {
        data,
    },
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.status(401).json(createResponse(4, 'No token provided'));

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json(createResponse(5, 'Invalid token'));
        req.user = user;
        next();
    });
};

// Generate a new token for a user
const generateToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5h' });
};

// Sample route
app.get('/', (req, res) => {
    res.json(createResponse(1, 'API is working'));
});

// Route to login and get a token
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Secret Key:', process.env.ACCESS_TOKEN_SECRET);
    // Validate input
    if (!username || !password) {
        return res.status(400).json(createResponse(2, 'Username and password are required'));
    }

    const sql = 'SELECT * FROM users WHERE username = ?';

    // Execute query
    db.query(sql, [username], async (err, results) => {
        if (err) {
            return res.status(500).json(createResponse(2, err.message));
        }

        if (results.length === 0) {
            return res.status(404).json(createResponse(3, 'User not found'));
        }

        // Verify password
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json(createResponse(4, 'Invalid password'));
        }

        // Generate token
        const token = generateToken({ id: user.id, username: user.username });
        res.json(createResponse(1, 'Login successful', { token,user }));
    });
});

// User registration route
app.post('/register', async (req, res) => {
    const { username, name, email, phone_number, password, country_id } = req.body;

    if (!username || !name || !email || !phone_number || !password || !country_id) {
        return res.status(400).json({ code: 2, message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users (username, name, email, phone_number, password, country_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())';

    db.query(sql, [username, name, email, phone_number, hashedPassword, country_id], (err, result) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ code: 2, message: 'Internal server error' });
        }

        res.status(201).json({ code: 1, message: 'User registered successfully' });
    });
});

// Route to create a new coupon (accessible by admins only)
app.post('/coupons', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json(createResponse(4, 'Forbidden'));

    const { code, discount_percentage, expiry_date, status } = req.body;

    if (!code || discount_percentage === undefined || !expiry_date || status === undefined) {
        return res.status(400).json(createResponse(2, 'All fields are required'));
    }

    const sql = 'INSERT INTO coupons (code, discount_percentage, expiry_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())';

    db.query(sql, [code, discount_percentage, expiry_date, status], (err, results) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        res.status(201).json(createResponse(1, 'Coupon created successfully', { id: results.insertId }));
    });
});

// Route to get all coupons (accessible by admins only)
app.get('/coupons', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json(createResponse(4, 'Forbidden'));

    const sql = 'SELECT * FROM coupons ORDER BY id ASC';

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        if (results.length === 0) {
            return res.status(404).json(createResponse(3, 'No data found'));
        }

        res.status(200).json(createResponse(1, 'Coupons retrieved successfully', results));
    });
});

// Route to update a coupon by ID (accessible by admins only)
app.put('/coupons/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json(createResponse(4, 'Forbidden'));

    const couponId = req.params.id;
    const { code, discount_percentage, expiry_date, status } = req.body;

    const sql = 'UPDATE coupons SET code = ?, discount_percentage = ?, expiry_date = ?, status = ?, updated_at = NOW() WHERE id = ?';

    db.query(sql, [code, discount_percentage, expiry_date, status, couponId], (err, result) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        if (result.affectedRows === 0) {
            return res.status(404).json(createResponse(3, 'Coupon not found'));
        }

        res.status(200).json(createResponse(1, 'Coupon updated successfully', { id: couponId, code, discount_percentage, expiry_date, status }));
    });
});

// Route to delete a coupon by ID (accessible by admins only)
app.delete('/coupons/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json(createResponse(4, 'Forbidden'));

    const couponId = req.params.id;

    const sql = 'DELETE FROM coupons WHERE id = ?';

    db.query(sql, [couponId], (err, result) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        if (result.affectedRows === 0) {
            return res.status(404).json(createResponse(3, 'Coupon not found'));
        }

        res.status(200).json(createResponse(1, 'Coupon deleted successfully'));
    });
});

// Route to get mystery box details by ID
app.get('/mystery_boxes/:id', authenticateToken, (req, res) => {
    const boxId = req.params.id;

    const sql = `
        SELECT id, title, restaurant_id, description, price, type, quantity, status, created_at, updated_at
        FROM mystery_boxes WHERE id = ?
    `;

    db.query(sql, [boxId], (err, results) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        if (results.length === 0) {
            return res.status(404).json(createResponse(3, 'Mystery box not found'));
        }

        res.status(200).json(createResponse(1, 'Mystery box retrieved successfully', results[0]));
    });
});

// Route to create a new mystery box
app.post('/mystery_boxes', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json(createResponse(4, 'Forbidden'));

    const { title, restaurant_id, description, price, type, quantity, status } = req.body;

    if (!title || !restaurant_id || !description || price === undefined || !type || quantity === undefined || status === undefined) {
        return res.status(400).json(createResponse(2, 'All fields are required'));
    }

    const sql = `
        INSERT INTO mystery_boxes (title, restaurant_id, description, price, type, quantity, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    db.query(sql, [title, restaurant_id, description, price, type, quantity, status], (err, results) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        res.status(201).json(createResponse(1, 'Mystery box created successfully', { id: results.insertId }));
    });
});

// Route to update a mystery box by ID
app.put('/mystery_boxes/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json(createResponse(4, 'Forbidden'));

    const boxId = req.params.id;
    const { title, restaurant_id, description, price, type, quantity, status } = req.body;

    const sql = `
        UPDATE mystery_boxes
        SET title = ?, restaurant_id = ?, description = ?, price = ?, type = ?, quantity = ?, status = ?, updated_at = NOW()
        WHERE id = ?
    `;

    db.query(sql, [title, restaurant_id, description, price, type, quantity, status, boxId], (err, result) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        if (result.affectedRows === 0) {
            return res.status(404).json(createResponse(3, 'Mystery box not found'));
        }

        res.status(200).json(createResponse(1, 'Mystery box updated successfully', { id: boxId, title, restaurant_id, description, price, type, quantity, status }));
    });
});

// Route to delete a mystery box by ID
app.delete('/mystery_boxes/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json(createResponse(4, 'Forbidden'));

    const boxId = req.params.id;

    const sql = 'DELETE FROM mystery_boxes WHERE id = ?';

    db.query(sql, [boxId], (err, result) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        if (result.affectedRows === 0) {
            return res.status(404).json(createResponse(3, 'Mystery box not found'));
        }

        res.status(200).json(createResponse(1, 'Mystery box deleted successfully'));
    });
});








