const express = require('express');
require('dotenv').config();
const mysql = require('mysql');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const multer = require('multer');
const path = require('path');


// Middleware to parse JSON
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: '2Good2Waste'
});

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads')); // Ensure 'uploads' directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const fs = require('fs');


// Serve user profile images
app.get('/images/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', filename); // Adjust the path if needed

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            return res.status(404).json({ code: 3, message: 'Image not found' });
        }

        res.sendFile(filePath);
    });
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

// Route to check if user is still logged in by token check
app.get('/checkLogin', authenticateToken, (req, res) => {
    const userId = req.user.id;

    const sql = 'SELECT id, username, name, email, phone_number, profile_image, country_id, created_at, updated_at FROM users WHERE id = ?';

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ code: 2, message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ code: 3, message: 'User not found' });
        }

        res.status(200).json({ code: 1, message: 'User is logged in', user: results[0] });
    });
});

// Route to get user by ID
app.get('/getUserById/:id', (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        return res.status(400).json({ code: 2, message: 'User ID is required' });
    }

    const sql = 'SELECT id, username, name, email, phone_number, profile_image, country_id, created_at, updated_at FROM users WHERE id = ?';

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ code: 2, message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ code: 3, message: 'User not found' });
        }

        res.status(200).json({ code: 1, message: 'User found', user: results[0] });
    });
});

// User registration route
// app.post('/register', async (req, res) => {
//     const { username, name, email, phone_number, password, country_id } = req.body;

//     if (!username || !name || !email || !phone_number || !password || !country_id) {
//         return res.status(400).json({ code: 2, message: 'All fields are required' });
//         console.log($(username), $(name), $(email), $(phone_number), $(password), $(country_id) );
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const sql = 'INSERT INTO users (username, name, email, phone_number, password, country_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())';

//     db.query(sql, [username, name, email, phone_number, hashedPassword, country_id], (err, result) => {
//         if (err) {
//             console.error('Database error:', err.message);
//             return res.status(500).json({ code: 2, message: 'Internal server error' });
//         }

//         res.status(201).json({ code: 1, message: 'User registered successfully' });
//     });
// });

// User registration route with image upload
// app.post('/register', upload.single('profile_image'), async (req, res) => {
//     const { username, name, email, phone_number, password, country_id } = req.body;
//     const profileImage = req.file ? req.file.filename : null; // Get the uploaded file name

//     if (!username || !name || !email || !phone_number || !password || !country_id) {
//         return res.status(400).json({ code: 2, message: 'All fields are required' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const sql = 'INSERT INTO users (username, name, email, phone_number, password, country_id, profile_image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())';

//     db.query(sql, [username, name, email, phone_number, hashedPassword, country_id, profileImage], (err, result) => {
//         if (err) {
//             console.error('Database error:', err.message);
//             return res.status(500).json({ code: 2, message: 'Internal server error' });
//         }

//         res.status(201).json({ code: 1, message: 'User registered successfully' });
//     });
// });

// User registration route with image upload
app.post('/register', upload.single('profile_image'), async (req, res) => {
    const { username, name, email, phone_number, password, country_id } = req.body;
    const profileImage = req.file ? req.file.filename : null; // Get the uploaded file name

    if (!username || !name || !email || !phone_number || !password || !country_id) {
        return res.status(400).json({ code: 2, message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = 'INSERT INTO users (username, name, email, phone_number, password, country_id, profile_image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())';

        db.query(sql, [username, name, email, phone_number, hashedPassword, country_id, profileImage], (err, result) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ code: 2, message: 'Internal server error' });
            }

            res.status(201).json({ code: 1, message: 'User registered successfully' });
        });
    } catch (err) {
        console.error('Error hashing password:', err.message);
        return res.status(500).json({ code: 2, message: 'Internal server error' });
    }
});

// User edit route with image upload
app.put('/editUser/:id', upload.single('profile_image'), async (req, res) => {
    console.log('Request received for user update');
    const userId = req.params.id;
    const { name, email, phone_number, country_id, username, password } = req.body;
    const profileImage = req.file ? req.file.filename : null; // Get the uploaded file name

    console.log('Received data:', {
        userId,
        name,
        email,
        phone_number,
        country_id,
        username,
        password,
        profileImage
    });

    // Validate required fields
    if (!name || !email || !phone_number || !country_id || !username || !password) {
        console.log('Validation failed');
        return res.status(400).json({ code: 2, message: 'All fields except profile_image are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Construct SQL query with optional profile_image field
        let sql = 'UPDATE users SET name = ?, email = ?, phone_number = ?, country_id = ?, username = ?, password = ?, updated_at = NOW()';
        const values = [name, email, phone_number, country_id, username, hashedPassword];

        if (profileImage) {
            sql += ', profile_image = ?';
            values.push(profileImage);
        }

        sql += ' WHERE id = ?';
        values.push(userId);

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ code: 2, message: 'Internal server error' });
            }

            if (result.affectedRows === 0) {
                console.log('User not found');
                return res.status(404).json({ code: 3, message: 'User not found' });
            }

            console.log('Updated user details:', {
                id: userId,
                username,
                name,
                email,
                phone_number,
                profile_image: profileImage,
                country_id
            });

            res.status(200).json({ code: 1, message: 'User updated successfully' });
        });
    } catch (err) {
        console.error('Error hashing password:', err.message);
        return res.status(500).json({ code: 2, message: 'Internal server error' });
    }
});
// User edit route with image upload
// app.put('/editUser/:id', upload.single('profile_image'), async (req, res) => {
//     const userId = req.params.id;
//     const { name, email, phone_number, country_id, username, password } = req.body;
//     const profileImage = req.file ? req.file.filename : null; // Get the uploaded file name

//     // Validate required fields
//     if (!name || !email || !phone_number || !country_id || !username || !password) {
//         return res.status(400).json({ code: 2, message: 'All fields except profile_image are required' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const sql = 'UPDATE users SET name = ?, email = ?, phone_number = ?, profile_image = ?, country_id = ?, username = ?, password = ?, updated_at = NOW() WHERE id = ?';

//     db.query(sql, [name, email, phone_number, profileImage, country_id, username, hashedPassword, userId], (err, result) => {
//         if (err) {
//             console.error('Database error:', err.message);
//             return res.status(500).json({ code: 2, message: 'Internal server error' });
//         }

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ code: 3, message: 'User not found' });
//         }

//         console.log('Updated user details:', {
//             id: userId,
//             username,
//             name,
//             email,
//             phone_number,
//             profile_image: profileImage,
//             country_id
//         });

//         res.status(200).json({ code: 1, message: 'User updated successfully' });
//     });
// });

// Route to get user by ID
app.get('/getUserById/:id', (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        return res.status(400).json({ code: 2, message: 'User ID is required' });
    }

    const sql = 'SELECT id, username, name, email, phone_number, profile_image, country_id, created_at, updated_at FROM users WHERE id = ?';

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ code: 2, message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ code: 3, message: 'User not found' });
        }

        // If profile_image is available, construct the full URL
        if (results[0].profile_image) {
            results[0].profile_image = `${req.protocol}://${req.get('host')}/uploads/${results[0].profile_image}`;
        }

        res.status(200).json({ code: 1, message: 'User found', user: results[0] });
    });
});

//USERS COMPLETE
//Countries 

// Route to get all countries data
app.get('/countries', async (req, res) => {
    try {
        const sql = `
            SELECT 
                id, 
                country_name, 
                updated_at, 
                country_code, 
                flag_image, 
                emoji, 
                currency, 
                currency_code, 
                status, 
                created_at 
            FROM countries`;

        db.query(sql, (err, results) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ code: 2, message: 'Internal server error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ code: 3, message: 'No countries found' });
            }

            const countries = results.map(country => {
                const flag = getFlagEmoji(country.country_code);
                return {
                    id: country.id,
                    country_name: country.country_name,
                    country_code: country.country_code,
                    flag_image: country.flag_image,
                    flag: flag,
                    emoji: country.emoji,
                    currency: country.currency,
                    currency_code: country.currency_code,
                    status: country.status,
                    created_at: country.created_at,
                    updated_at: country.updated_at
                };
            });

            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.status(200).json({ code: 1, message: 'Countries found', countries: countries });
        });
    } catch (err) {
        return res.status(500).json({ code: 2, message: 'Internal server error' });
    }
});

// Function to convert country code to flag emoji
const getFlagEmoji = (code) => {
    return String.fromCodePoint(
        ...[...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
    );
};


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

// Vendor side
// Route to Register a Vendor
app.post('/register-vendor', async (req, res) => {
    const { 
        username, name, email, phone_number, password, banner_image, country_id, 
        vendor_name, address, image, vendor_type, user_id 
    } = req.body;

    // Validate input
    if (!username || !name || !email || !phone_number || !password || !country_id || 
        !vendor_name || !address || !vendor_type || !user_id) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert vendor into the database with a pending approval status
        const vendorQuery = `
            INSERT INTO vendors 
                (username, name, email, phone_number, password, banner_image, country_id, vendor_name, address, image, status, vendor_type, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const vendorValues = [username, name, email, phone_number, hashedPassword, banner_image, country_id, vendor_name, address, image, 0, vendor_type, user_id];

        db.query(vendorQuery, vendorValues, (err, result) => {
            if (err) {
                console.error('Error inserting vendor:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            const vendorId = result.insertId;
            res.status(201).json({ message: 'Vendor registered successfully, pending approval', vendorId });
        });
    } catch (err) {
        console.error('Error hashing password:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to check vendor and mystery box status
app.get('/vendor-status/:userId', (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if vendor details are approved
    const vendorQuery = 'SELECT status FROM vendors WHERE user_id = ?';
    db.query(vendorQuery, [userId], (err, vendorResults) => {
        if (err) {
            console.error('Error querying vendor:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (vendorResults.length === 0) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        const vendorStatus = vendorResults[0].status;

        // Check if mystery box details are approved
        const boxQuery = 'SELECT status FROM mystery_boxes WHERE vendor_id = (SELECT id FROM vendors WHERE user_id = ?)';
        db.query(boxQuery, [userId], (err, boxResults) => {
            if (err) {
                console.error('Error querying mystery box:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (boxResults.length === 0) {
                return res.status(404).json({ message: 'Mystery box not found for this vendor' });
            }

            const boxStatus = boxResults[0].status;

            // Determine response based on statuses
            if (vendorStatus === 1 && boxStatus === 0) {
                return res.status(200).json({ 
                    message: 'Vendor approved but mystery box is pending approval', 
                    redirectTo: '/mystery-box-approval'
                });
            } else if (vendorStatus === 0) {
                return res.status(200).json({ 
                    message: 'Vendor is pending approval', 
                    redirectTo: '/vendor-approval'
                });
            } else if (vendorStatus === 1 && boxStatus === 1) {
                return res.status(200).json({ 
                    message: 'Both vendor and mystery box are approved', 
                    redirectTo: '/approved-vendor'
                });
            } else {
                return res.status(200).json({ 
                    message: 'Both vendor and mystery box are pending approval',
                    redirectTo: '/pending-approval'
                });
            }
        });
    });
});


//Route to Register a Mystery Box
  app.post('/register-mystery-box', (req, res) => {
    const { 
      vendor_id, box_name, box_description, box_price, box_image 
    } = req.body;
  
    // Validate input
    if (!vendor_id || !box_name || !box_description || !box_price || !box_image) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    // Insert the mystery box into the database with a pending approval status
    const boxQuery = `
      INSERT INTO mystery_boxes 
        (vendor_id, box_name, description, price, image, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const boxValues = [vendor_id, box_name, box_description, box_price, box_image, 0]; // 0 indicates pending approval
  
    db.query(boxQuery, boxValues, (err, result) => {
      if (err) {
        console.error('Error inserting mystery box:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      res.status(201).json({ message: 'Mystery box registered successfully, pending approval' });
    });
  });



// Admin Side 

//Route for Admin to Approve/Reject Vendors
app.post('/admin/approve-vendor', (req, res) => {
    const { vendor_id, action } = req.body;
  
    // Validate input
    if (!vendor_id || !action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid input' });
    }
  
    // Determine status based on action
    const status = action === 'approve' ? 1 : 2; // 1 for approved, 2 for rejected
  
    // Update vendor status
    const query = 'UPDATE vendors SET status = ? WHERE id = ?';
    db.query(query, [status, vendor_id], (err, result) => {
      if (err) {
        console.error('Error updating vendor status:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.status(200).json({ message: `Vendor ${action}d successfully` });
    });
  });
  


  // Route for Admin to Approve/Reject Mystery Boxes

  app.post('/admin/approve-mystery-box', (req, res) => {
    const { box_id, action } = req.body;
  
    // Validate input
    if (!box_id || !action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid input' });
    }
  
    // Determine status based on action
    const status = action === 'approve' ? 1 : 2; // 1 for approved, 2 for rejected
  
    // Update mystery box status
    const query = 'UPDATE mystery_boxes SET status = ? WHERE id = ?';
    db.query(query, [status, box_id], (err, result) => {
      if (err) {
        console.error('Error updating mystery box status:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.status(200).json({ message: `Mystery box ${action}d successfully` });
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








