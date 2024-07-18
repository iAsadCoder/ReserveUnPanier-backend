// const express = require('express');
// require('dotenv').config();
// const mysql = require('mysql');
// const axios = require('axios');
// const bcrypt = require('bcrypt');
// const app = express();
// const port = 3000;

// // Middleware to parse JSON
// app.use(express.json());

// // MySQL connection
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'Crystal'
// });

// db.connect(err => {
//     if (err) throw err;
//     console.log('MySQL Connected...');
// });

// // Sample route
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

// // Start the server
// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });

// // Route to get users
// app.get('/users', (req, res) => {
//     const sql = 'SELECT * FROM users';
//     db.query(sql, (err, results) => {
//         if (err) {
//             return res.status(500).json({ error: err.message });
//         }
//         res.json(results);
//     });
// });

// // Edit user
// app.put('/users/:id', isAdmin, async (req, res) => {
//     const userId = req.params.id;
//     const { email, password, name, mobile, country_id, username, term_condition, status } = req.body;

//     // Check for required fields
//     if (!email || !name || !mobile || !country_id || !username || typeof term_condition !== 'boolean' || !status) {
//         return res.status(400).json({ error: 'All fields are required' });
//     }

//     let sql = `
//         UPDATE users SET email = ?, name = ?, mobile = ?, country_id = ?, username = ?, term_condition = ?, status = ?, updated_at = NOW()
//     `;

//     const params = [email, name, mobile, country_id, username, term_condition, status];

//     // Only update password if provided
//     if (password) {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         sql += `, password = ?`;
//         params.push(hashedPassword);
//     }

//     sql += ` WHERE id = ?`;
//     params.push(userId);

//     db.query(sql, params, (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });

//         if (results.affectedRows === 0) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         res.status(200).json({ message: 'User updated successfully' });
//     });
// });

// app.get('/admins', (req, res) => {
//     const sql = 'SELECT * FROM admins';
//     db.query(sql, (err, results) => {
//         if (err) {
//             return res.status(500).json({ error: err.message });
//         }
//         res.json(results);
//     });
// });

// // Function to convert country code to flag emoji
// const getFlagEmoji = (code) => {
//     return String.fromCodePoint(
//         ...[...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
//     );
// };

// // Route to get all countries
// app.get('/countries', async (req, res) => {
//     try {
//         const response = await axios.get('https://restcountries.com/v3.1/all');
//         const countries = response.data.map(country => {
//             const code = country.cca2; // Country code
//             const flag = getFlagEmoji(code); // Get flag emoji

//             return {
//                 name: country.name.common,
//                 country_code: code,
//                 flag_image: country.flags.svg || country.flags.png, // Use SVG or PNG
//                 flag: flag, // Flag emoji
//                 currency: country.currencies ? Object.values(country.currencies)[0].name : 'N/A',
//                 created_at: new Date(),
//                 updated_at: new Date()
//             };
//         });
//         res.json(countries);
//     } catch (err) {
//         return res.status(500).json({ error: err.message });
//     }
// });

// // User login route
// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) {
//         return res.status(400).json({ error: 'Email and password are required' });
//     }
//     const sql = 'SELECT * FROM users WHERE email = ?';
//     db.query(sql, [email], async (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         if (results.length === 0) return res.status(404).json({ error: 'User not found' });
//         const user = results[0];
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(401).json({ error: 'Invalid password' });
//         res.json({ message: 'Login successful', user });
//     });
// });

// // Admin login route
// app.post('/admin_login', async (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) {
//         return res.status(400).json({ error: 'Email and password are required' });
//     }
//     const sql = 'SELECT * FROM admins WHERE email = ?';
//     db.query(sql, [email], async (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         if (results.length === 0) return res.status(404).json({ error: 'Admin not found' });
//         const admin = results[0];
//         const isMatch = await bcrypt.compare(password, admin.password);
//         if (!isMatch) return res.status(401).json({ error: 'Invalid password' });
//         res.json({ message: 'Login successful', admin });
//     });
// });

// // Merchant login route
// app.post('/merchant_login', async (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) {
//         return res.status(400).json({ error: 'Email and password are required' });
//     }
//     const sql = 'SELECT * FROM merchants WHERE email = ?';
//     db.query(sql, [email], async (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         if (results.length === 0) return res.status(404).json({ error: 'Merchant not found' });
//         const merchant = results[0];
//         const isMatch = await bcrypt.compare(password, merchant.password);
//         if (!isMatch) return res.status(401).json({ error: 'Invalid password' });
//         res.json({ message: 'Login successful', merchant });
//     });
// });

// // User registration route
// app.post('/register', async (req, res) => {
//     const {
//         email,
//         password,
//         name,
//         mobile,
//         country_id,
//         username,
//         term_condition,
//         status,
//         remember_token // Optional
//     } = req.body;

//     // Check for required fields
//     if (!email || !password || !name || !mobile || !country_id || !username || typeof term_condition !== 'boolean' || !status) {
//         return res.status(400).json({ error: 'All fields are required' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const sql = `
//         INSERT INTO users (email, password, name, mobile, country_id, username, term_condition, status, remember_token, created_at, updated_at)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
//     `;

//     db.query(sql, [email, hashedPassword, name, mobile, country_id, username, term_condition, status, remember_token || null], (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });

//         // Response includes the generated user ID
//         const userId = results.insertId; // This is the auto-generated ID
//         res.status(201).json({ message: 'User created successfully', userId });
//     });
// });

// // Middleware to check if the user is an admin
// function isAdmin(req, res, next) {
//     console.log('req.user:', req.user); // Add this line for debugging

//     if (req.user && req.user.role) {
//         if (req.user.role === 'admin') {
//             next();
//         } else {
//             res.status(403).send('Forbidden');
//         }
//     } else {
//         res.status(400).send('Bad Request: Role not found');
//     }
// }

// // get all users
// app.get('/users', isAdmin, (req, res) => {
//     const sql = 'SELECT id, name, username, mobile, email, country_id, email_verified_at, term_condition, status, remember_token, created_at, updated_at FROM users ORDER BY id ASC';

//     db.query(sql, (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });

//         res.status(200).json(results);
//     });
// });

// // Admin delete user
// app.delete('/users/:id', isAdmin, (req, res) => {
//     const userId = req.params.id;

//     const sql = 'DELETE FROM users WHERE id = ?';

//     db.query(sql, [userId], (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });

//         if (results.affectedRows === 0) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         res.status(200).json({ message: 'User deleted successfully' });
//     });
// });

// // get all mystery box details
// app.get('/mystery_boxes', isAdmin, (req, res) => {
//     const sql = `
//         SELECT id, title_box, price, basket_price, box_description, time_collection, box_quantity, time_options, vendor_id, merchant_id, country_id, status, created_at, updated_at
//         FROM mystery_boxes
//     `;

//     db.query(sql, (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });

//         res.status(200).json(results);
//     });
// });

// // get all vendors details
// app.get('/vendors', isAdmin, (req, res) => {
//     const sql = `
//         SELECT id, vendor_name, mobile, email, street, city, postal_code, country_id, merchant_id, vendor_type, ownership, logo, status, created_at, updated_at
//         FROM vendors
//     `;

//     db.query(sql, (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });

//         res.status(200).json(results);
//     });
// });

// // Route to get all featured banners
// app.get('/featured_banners', (req, res) => {
//     const sql = 'SELECT id, title, text, image FROM featured_banner';

//     db.query(sql, (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });

//         res.status(200).json(results);
//     });
// });

// // Route to get all coupons (accessible by all users)
// app.get('/coupons', (req, res) => {
//     const sql = 'SELECT * FROM coupons';

//     db.query(sql, (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });

//         res.status(200).json(results);
//     });
// });

// // Route to create a new coupon (accessible by admins only)
// app.post('/coupons', isAdmin, (req, res) => {
//     const { code, discount_percentage, expiry_date } = req.body;

//     // Validate input
//     if (!code || !discount_percentage || !expiry_date) {
//         return res.status(400).json({ error: 'All fields are required' });
//     }

//     const sql = 'INSERT INTO coupons (code, discount_percentage, expiry_date) VALUES (?, ?, ?)';
//     db.query(sql, [code, discount_percentage, expiry_date], (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });

//         res.status(201).json({ message: 'Coupon created successfully', couponId: results.insertId });
//     });
// });

// // Route to update a coupon (accessible by admins only)
// app.put('/coupons/:id', isAdmin, (req, res) => {
//     const couponId = req.params.id;
//     const { code, discount_percentage, expiry_date } = req.body;

//     // Validate input
//     if (!code || !discount_percentage || !expiry_date) {
//         return res.status(400).json({ error: 'All fields are required' });
//     }

//     const sql = 'UPDATE coupons SET code = ?, discount_percentage = ?, expiry_date = ? WHERE id = ?';
//     db.query(sql, [code, discount_percentage, expiry_date, couponId], (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });

//         if (results.affectedRows === 0) {
//             return res.status(404).json({ error: 'Coupon not found' });
//         }

//         res.status(200).json({ message: 'Coupon updated successfully' });
//     });
// });

// // Route to delete a coupon (accessible by admins only)
// app.delete('/coupons/:id', isAdmin, (req, res) => {
//     const couponId = req.params.id;

//     const sql = 'DELETE FROM coupons WHERE id = ?';
//     db.query(sql, [couponId], (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });

//         if (results.affectedRows === 0) {
//             return res.status(404).json({ error: 'Coupon not found' });
//         }

//         res.status(200).json({ message: 'Coupon deleted successfully' });
//     });
// });

// module.exports = app;

const express = require('express');
require('dotenv').config();
const mysql = require('mysql');
const axios = require('axios');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Crystal'
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

// Sample route
app.get('/', (req, res) => {
    res.json(createResponse(1, 'API is working'));
});

// Route to get users
app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json(createResponse(2, err.message));
        }
        if (results.length === 0) {
            return res.status(404).json(createResponse(3, 'No data found'));
        }
        res.json(createResponse(1, 'Users retrieved successfully', results));
    });
});

// Function to convert country code to flag emoji
const getFlagEmoji = (code) => {
    return String.fromCodePoint(
        ...[...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
    );
};

// Route to get all countries
app.get('/countries', async (req, res) => {
    try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countries = response.data.map(country => {
            const code = country.cca2;
            const flag = getFlagEmoji(code);

            return {
                name: country.name.common,
                country_code: code,
                flag_image: country.flags.svg || country.flags.png,
                flag: flag,
                currency: country.currencies ? Object.values(country.currencies)[0].name : 'N/A',
                created_at: new Date(),
                updated_at: new Date(),
            };
        });
        res.json(createResponse(1, 'Countries retrieved successfully', countries));
    } catch (err) {
        return res.status(500).json(createResponse(2, err.message));
    }
});

// User login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json(createResponse(2, 'Email and password are required'));
    }
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json(createResponse(2, err.message));
        if (results.length === 0) return res.status(404).json(createResponse(3, 'User not found'));
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json(createResponse(4, 'Invalid password'));
        res.json(createResponse(1, 'Login successful', { user }));
    });
});

// Admin login route
app.post('/admin_login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json(createResponse(2, 'Email and password are required'));
    }
    const sql = 'SELECT * FROM admins WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json(createResponse(2, err.message));
        if (results.length === 0) return res.status(404).json(createResponse(3, 'Admin not found'));
        const admin = results[0];
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json(createResponse(4, 'Invalid password'));
        res.json(createResponse(1, 'Login successful', { admin }));
    });
});

// User registration route
app.post('/register', async (req, res) => {
    const {
        email,
        password,
        name,
        mobile,
        country_id,
        username,
        term_condition,
        status,
        remember_token // Optional
    } = req.body;

    if (!email || !password || !name || !mobile || !country_id || !username || typeof term_condition !== 'boolean' || !status) {
        return res.status(400).json(createResponse(2, 'All fields are required'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
        INSERT INTO users (email, password, name, mobile, country_id, username, term_condition, status, remember_token, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    db.query(sql, [email, hashedPassword, name, mobile, country_id, username, term_condition, status, remember_token || null], (err, results) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        const userId = results.insertId;
        res.status(201).json(createResponse(1, 'User created successfully', { userId }));
    });
});

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
    console.log('req.user:', req.user); // Debugging

    if (req.user && req.user.role) {
        if (req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json(createResponse(4, 'Forbidden'));
        }
    } else {
        res.status(400).json(createResponse(2, 'Bad Request: Role not found'));
    }
}

// Get all users
app.get('/users', isAdmin, (req, res) => {
    const sql = 'SELECT id, name, username, mobile, email, country_id, email_verified_at, term_condition, status, remember_token, created_at, updated_at FROM users ORDER BY id ASC';

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        if (results.length === 0) {
            return res.status(404).json(createResponse(3, 'No data found'));
        }

        res.status(200).json(createResponse(1, 'Users retrieved successfully', results));
    });
});

// Admin delete user
app.delete('/users/:id', isAdmin, (req, res) => {
    const userId = req.params.id;

    const sql = 'DELETE FROM users WHERE id = ?';

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        if (results.affectedRows === 0) {
            return res.status(404).json(createResponse(3, 'User not found'));
        }

        res.status(200).json(createResponse(1, 'User deleted successfully'));
    });
});

// Edit user
app.put('/users/:id', isAdmin, async (req, res) => {
    const userId = req.params.id;
    const { email, password, name, mobile, country_id, username, term_condition, status } = req.body;

    if (!email || !name || !mobile || !country_id || !username || typeof term_condition !== 'boolean' || !status) {
        return res.status(400).json(createResponse(2, 'All fields are required'));
    }

    let sql = `
        UPDATE users SET email = ?, name = ?, mobile = ?, country_id = ?, username = ?, term_condition = ?, status = ?, updated_at = NOW()
    `;

    const params = [email, name, mobile, country_id, username, term_condition, status];

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        sql += `, password = ?`;
        params.push(hashedPassword);
    }

    sql += ` WHERE id = ?`;
    params.push(userId);

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        if (results.affectedRows === 0) {
            return res.status(404).json(createResponse(3, 'User not found'));
        }

        res.status(200).json(createResponse(1, 'User updated successfully'));
    });
});

// Get all mystery box details
app.get('/mystery_boxes', isAdmin, (req, res) => {
    const sql = `
        SELECT id, title, restaurant_id, description, price, type, quantity, status, created_at, updated_at
        FROM mystery_boxes ORDER BY id ASC
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        if (results.length === 0) {
            return res.status(404).json(createResponse(3, 'No data found'));
        }

        res.status(200).json(createResponse(1, 'Mystery boxes retrieved successfully', results));
    });
});

// Route to create a new coupon (accessible by admins only)
app.post('/coupons', isAdmin, (req, res) => {
    const { code, discount_percentage, expiry_date } = req.body;

    // Validate input
    if (!code || !discount_percentage || !expiry_date) {
        return res.status(400).json(createResponse(2, 'All fields are required'));
    }

    const sql = 'INSERT INTO coupons (code, discount_percentage, expiry_date) VALUES (?, ?, ?)';
    db.query(sql, [code, discount_percentage, expiry_date], (err, results) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        res.status(201).json(createResponse(1, 'Coupon created successfully', { couponId: results.insertId }));
    });
});

// Route to update a coupon (accessible by admins only)
app.put('/coupons/:id', isAdmin, (req, res) => {
    const couponId = req.params.id;
    const { code, discount_percentage, expiry_date } = req.body;

    // Validate input
    if (!code || !discount_percentage || !expiry_date) {
        return res.status(400).json(createResponse(2, 'All fields are required'));
    }

    const sql = 'UPDATE coupons SET code = ?, discount_percentage = ?, expiry_date = ? WHERE id = ?';
    db.query(sql, [code, discount_percentage, expiry_date, couponId], (err, results) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        if (results.affectedRows === 0) {
            return res.status(404).json(createResponse(3, 'Coupon not found'));
        }

        res.status(200).json(createResponse(1, 'Coupon updated successfully'));
    });
});

// Route to delete a coupon (accessible by admins only)
app.delete('/coupons/:id', isAdmin, (req, res) => {
    const couponId = req.params.id;

    const sql = 'DELETE FROM coupons WHERE id = ?';
    db.query(sql, [couponId], (err, results) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        if (results.affectedRows === 0) {
            return res.status(404).json(createResponse(3, 'Coupon not found'));
        }

        res.status(200).json(createResponse(1, 'Coupon deleted successfully'));
    });
});

module.exports = app;









