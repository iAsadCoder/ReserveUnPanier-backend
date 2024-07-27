const express = require('express');
require('dotenv').config();
//const mysql = require('mysql');
const mysql = require('mysql2');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const multer = require('multer');
const path = require('path');

const PORT = process.env.PORT || 3306;

// Middleware to parse JSON
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  server.setTimeout(120000); // 2 minutes

  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Serve user profile images

app.get('/images/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), 'uploads', filename); // Use process.cwd() for root directory

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


// Standard response format
const createResponse = (code, message, data = null) => ({
    code,
    message,
    response: {
        data,
    },
});


//This is new code


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

// Generate a new token for an admin
const generateAdminToken = (admin) => {
    return jwt.sign(
        { id: admin.id, username: admin.username, role: 'admin' },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '5h' }
    );
};

// Generate a new token for a vendor
const generateVendorToken = (vendor) => {
    return jwt.sign(
        { id: vendor.id, username: vendor.username, role: 'vendor' },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '5h' }
    );
};
// Sample route
app.get('/', (req, res) => {
    res.json(createResponse(1, 'API is working'));
});

 // Route to login and get a token
// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     console.log('Secret Key:', process.env.ACCESS_TOKEN_SECRET);
//     // Validate input
//     if (!username || !password) {
//         return res.status(400).json(createResponse(2, 'Username and password are required'));
//     }

//     const sql = 'SELECT * FROM users WHERE username = ?';

//     // Execute query
//     db.query(sql, [username], async (err, results) => {
//         if (err) {
//             return res.status(500).json(createResponse(2, err.message));
//         }

//         if (results.length === 0) {
//             return res.status(404).json(createResponse(3, 'User not found'));
//         }

//         // Verify password
//         const user = results[0];
//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             return res.status(401).json(createResponse(4, 'Invalid password'));
//         }

//         // Generate token
//         const token = generateToken({ id: user.id, username: user.username });
//         res.json(createResponse(1, 'Login successful', { token,user }));
//     });
// });

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

// Route to logout and invalidate token
app.post('/logout', (req, res) => {
    // Assuming the token is sent in the Authorization header as a Bearer token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer token" format

    if (!token) {
        return res.status(400).json(createResponse(2, 'Token is required'));
    }

   

    // Respond with success message
    res.status(200).json(createResponse(1, 'Logout successful'));
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




// Vendor side ========================================================================================================================


// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;

//     // Validate input
//     if (!username || !password) {
//         return res.status(400).json(createResponse(2, 'Username and password are required'));
//     }

//     const sql = 'SELECT * FROM users WHERE username = ?';

//     // Execute query
//     db.query(sql, [username], async (err, results) => {
//         if (err) {
//             return res.status(500).json(createResponse(2, err.message));
//         }

//         if (results.length === 0) {
//             return res.status(404).json(createResponse(3, 'User not found'));
//         }

//         // Verify password
//         const user = results[0];
//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             return res.status(401).json(createResponse(4, 'Invalid password'));
//         }

//         // Check if user is a vendor
//         const vendorSql = 'SELECT * FROM vendors WHERE user_id = ?';
//         db.query(vendorSql, [user.id], (err, vendorResults) => {
//             if (err) {
//                 return res.status(500).json(createResponse(2, err.message));
//             }

//             // Determine user type
//             const isVendor = vendorResults.length > 0;

//             // Generate token
//             const token = generateToken({ id: user.id, username: user.username });

//             // Send response
//             res.json(createResponse(1, 'Login successful', { token, user, isVendor }));
//         });
//     });
// });

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

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

        // Check if user is a vendor
        const vendorSql = 'SELECT * FROM vendors WHERE user_id = ?';
        db.query(vendorSql, [user.id], (err, vendorResults) => {
            if (err) {
                return res.status(500).json(createResponse(2, err.message));
            }

            // Determine user type
            const isVendor = vendorResults.length > 0;

            // Define token payload
            const payload = {
                id: user.id,
                username: user.username,
                role: isVendor ? 'vendor' : 'user' // Include role in the token payload
            };

            // Generate token with role information
            const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

            // Send response
            res.json(createResponse(1, 'Login successful', { token, user, isVendor }));
        });
    });
});
// Route to Register a Vendor
app.post('/register-vendor', async (req, res) => {
    const { 
        username, name, email, phone_number, password, banner_image, country_id, 
        vendor_name, address, image, vendor_type, user_id, featured 
    } = req.body;

    // Validate input
    if (!username || !name || !email || !phone_number || !password || !country_id || 
        !vendor_name || !address || !vendor_type || !user_id) {
        return res.status(400).json(createResponse(400, 'All fields are required'));
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert vendor into the database with a pending approval status
        const vendorQuery = `
            INSERT INTO vendors 
                (username, name, email, phone_number, password, banner_image, country_id, vendor_name, address, image, status, vendor_type, user_id, featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const vendorValues = [
            username, name, email, phone_number, hashedPassword, banner_image, country_id, 
            vendor_name, address, image, 0, parseInt(vendor_type), user_id, Boolean(parseInt(featured))
        ];

        db.query(vendorQuery, vendorValues, (err, result) => {
            if (err) {
                console.error('Error inserting vendor:', err);
                return res.status(500).json(createResponse(500, 'Internal server error'));
            }

            const vendorId = result.insertId;
            res.status(201).json(createResponse(201, 'Vendor registered successfully, pending approval', { vendorId }));
        });
    } catch (err) {
        console.error('Error hashing password:', err);
        res.status(500).json(createResponse(500, 'Internal server error'));
    }
});

// Route to update vendor details
app.put('/update-vendor/:id', authenticateToken, async (req, res) => {
    const vendorId = req.params.id;
    const { 
        username, name, email, phone_number, password, banner_image, country_id, 
        vendor_name, address, image, vendor_type, featured 
    } = req.body;

    // Validate input
    if (!username || !name || !email || !phone_number || !password || !country_id || 
        !vendor_name || !address || !vendor_type) {
        return res.status(400).json(createResponse(400, 'All required fields must be provided'));
    }

    try {
        // Hash the new password if provided
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Prepare SQL query to update vendor
        const updateQuery = `
            UPDATE vendors
            SET 
                username = ?, 
                name = ?, 
                email = ?, 
                phone_number = ?, 
                password = ?, 
                banner_image = ?, 
                country_id = ?, 
                vendor_name = ?, 
                address = ?, 
                image = ?, 
                vendor_type = ?, 
                featured = ?,
                updated_at = NOW()
            WHERE id = ?
        `;

        // Prepare values for the query
        const values = [
            username, 
            name, 
            email, 
            phone_number, 
            hashedPassword || null, // Only update password if it's provided
            banner_image, 
            country_id, 
            vendor_name, 
            address, 
            image, 
            vendor_type, 
            featured, 
            vendorId
        ];

        // Execute SQL query
        db.query(updateQuery, values, (err, result) => {
            if (err) {
                console.error('Error updating vendor:', err);
                return res.status(500).json(createResponse(500, 'Internal server error'));
            }

            if (result.affectedRows === 0) {
                return res.status(404).json(createResponse(404, 'Vendor not found'));
            }

            res.status(200).json(createResponse(200, 'Vendor updated successfully'));
        });
    } catch (err) {
        console.error('Error processing request:', err);
        res.status(500).json(createResponse(500, 'Internal server error'));
    }
});

// Route to check if the user is a vendor or a regular user // vendor or regular user
app.get('/check-user/:id', (req, res) => {
    const userId = req.params.id;

    // Validate input
    if (!userId) {
        return res.status(400).json(createResponse(400, 'User ID is required'));
    }

    // Query to check if user is a vendor
    const vendorQuery = 'SELECT * FROM vendors WHERE user_id = ?';

    db.query(vendorQuery, [userId], (err, vendorResults) => {
        if (err) {
            console.error('Error querying vendors:', err);
            return res.status(500).json(createResponse(500, 'Internal server error'));
        }

        // If vendor record found
        if (vendorResults.length > 0) {
            return res.status(200).json(createResponse(200, 'User is a vendor', { userType: 'vendor' }));
        }

        // If no vendor record, check if user exists in users table
        const userQuery = 'SELECT * FROM users WHERE id = ?';

        db.query(userQuery, [userId], (err, userResults) => {
            if (err) {
                console.error('Error querying users:', err);
                return res.status(500).json(createResponse(500, 'Internal server error'));
            }

            // If user record found
            if (userResults.length > 0) {
                return res.status(200).json(createResponse(200, 'User is a regular user', { userType: 'user' }));
            }

            // If no user or vendor record
            res.status(404).json(createResponse(404, 'User not found'));
        });
    });
});


// Route to check vendor and mystery box status
app.get('/vendor-status/:userId', (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).json(createResponse(400, 'User ID is required'));
    }

    // Check if vendor details are approved
    const vendorQuery = 'SELECT status FROM vendors WHERE user_id = ?';
    db.query(vendorQuery, [userId], (err, vendorResults) => {
        if (err) {
            console.error('Error querying vendor:', err);
            return res.status(500).json(createResponse(500, 'Internal server error'));
        }

        if (vendorResults.length === 0) {
            return res.status(404).json(createResponse(404, 'Vendor not found'));
        }

        const vendorStatus = vendorResults[0].status;

        // Check if mystery box details are approved
        const boxQuery = 'SELECT status FROM mystery_boxes WHERE vendor_id = (SELECT id FROM vendors WHERE user_id = ?)';
        db.query(boxQuery, [userId], (err, boxResults) => {
            if (err) {
                console.error('Error querying mystery box:', err);
                return res.status(500).json(createResponse(500, 'Internal server error'));
            }

            if (boxResults.length === 0) {
                return res.status(404).json(createResponse(404, 'Mystery box not found for this vendor'));
            }

            const boxStatus = boxResults[0].status;

            // Determine response based on statuses
            if (vendorStatus === 1 && boxStatus === 0) {
                return res.status(200).json(createResponse(200, 'Vendor approved but mystery box is pending approval', { redirectTo: '/mystery-box-approval' }));
            } else if (vendorStatus === 0) {
                return res.status(200).json(createResponse(200, 'Vendor is pending approval', { redirectTo: '/vendor-approval' }));
            } else if (vendorStatus === 1 && boxStatus === 1) {
                return res.status(200).json(createResponse(200, 'Both vendor and mystery box are approved', { redirectTo: '/approved-vendor' }));
            } else {
                return res.status(200).json(createResponse(200, 'Both vendor and mystery box are pending approval', { redirectTo: '/pending-approval' }));
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
        return res.status(400).json(createResponse(400, 'All fields are required'));
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
            return res.status(500).json(createResponse(500, 'Internal server error'));
        }

        res.status(201).json(createResponse(201, 'Mystery box registered successfully, pending approval'));
    });
})
















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






app.get('/customer-dashboard', (req, res) => {
    const { country_id, vendor_type } = req.query;

    if (!country_id) {
        return res.status(400).json({ message: 'Country ID is required' });
    }

    // Build the SQL query dynamically based on the provided parameters
    let sql = `
        SELECT 
            v.id AS vendor_id, 
            v.user_id,
            v.username, 
            v.name, 
            v.email, 
            v.phone_number, 
            v.banner_image, 
            v.country_id, 
            v.vendor_name, 
            v.address, 
            v.image AS vendor_image, 
            v.status AS vendor_status, 
            v.created_at AS vendor_created_at, 
            v.updated_at AS vendor_updated_at, 
            v.accumulated_rating, 
            v.vendor_type,
            mb.id AS mystery_box_id,
            mb.title AS mystery_box_title,
            mb.price AS mystery_box_price,
            mb.description AS mystery_box_description,
            mb.collection_time AS mystery_box_collection_time,
            mb.quantity AS mystery_box_quantity,
            mb.days_available AS mystery_box_days_available,
            mb.status AS mystery_box_status,
            mb.created_at AS mystery_box_created_at,
            mb.updated_at AS mystery_box_updated_at,
            b.image_url AS advertisement_image
        FROM vendors v
        LEFT JOIN mystery_boxes mb ON v.id = mb.vendor_id
        LEFT JOIN banners b ON b.id = 1  -- Fixed banner_id to 1
        WHERE v.country_id = ?
    `;
    const values = [country_id];

    if (vendor_type) {
        sql += ' AND v.vendor_type = ?';
        values.push(vendor_type);
    }

    // Execute the query
    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No vendors or mystery boxes found for the given country' });
        }

        // Group results by vendor and include mystery box details
        const vendors = {};
        results.forEach(row => {
            if (!vendors[row.vendor_id]) {
                vendors[row.vendor_id] = {
                    vendor_id: row.vendor_id,
                    user_id: row.user_id,
                    username: row.username,
                    name: row.name,
                    email: row.email,
                    phone_number: row.phone_number,
                    banner_image: row.banner_image,
                    country_id: row.country_id,
                    vendor_name: row.vendor_name,
                    address: row.address,
                    vendor_image: row.vendor_image,
                    vendor_status: row.vendor_status,
                    created_at: row.vendor_created_at,
                    updated_at: row.updated_at,
                    accumulated_rating: row.accumulated_rating,
                    vendor_type: row.vendor_type,
                    advertisement_image: row.advertisement_image,  // Fixed advertisement_image
                    total_stock: 0, // Initialize total stock
                    mystery_boxes: []
                };
            }
            if (row.mystery_box_id) {
                vendors[row.vendor_id].mystery_boxes.push({
                    mystery_box_id: row.mystery_box_id,
                    title: row.mystery_box_title,
                    price: row.mystery_box_price,
                    description: row.mystery_box_description,
                    collection_time: row.mystery_box_collection_time,
                    quantity: row.mystery_box_quantity,
                    days_available: row.mystery_box_days_available,
                    status: row.mystery_box_status,
                    created_at: row.mystery_box_created_at,
                    updated_at: row.mystery_box_updated_at
                });

                // Add the quantity to total stock
                vendors[row.vendor_id].total_stock += row.mystery_box_quantity;
            }
        });

        // Convert the vendors object to an array
        const vendorsArray = Object.values(vendors);

        // Send the vendor and mystery box details as a response
        res.status(200).json({
            message: 'Vendors and mystery boxes fetched successfully',
            vendors: vendorsArray
        });
    });
});




//Vendor Dashboard route

app.get('/vendor-dashboard', authenticateToken,(req, res) => {
    const { vendor_id } = req.query;

    if (!vendor_id) {
        return res.status(400).json(createResponse(400, 'Vendor ID is required'));
    }

    // Define the SQL queries to get the required information
    const vendorDetailsSql = `
        SELECT 
            v.id AS vendor_id, 
            v.username, 
            v.name, 
            v.email, 
            v.phone_number, 
            v.banner_image, 
            v.country_id, 
            v.vendor_name, 
            v.address, 
            v.image AS vendor_image, 
            v.status AS vendor_status, 
            v.created_at AS vendor_created_at, 
            v.updated_at AS vendor_updated_at, 
            v.available_balance, 
            v.total_earnings
        FROM vendors v
        WHERE v.id = ?
    `;
    
    const activeOrdersCountSql = `
        SELECT COUNT(*) AS active_orders_count
        FROM orders o
        JOIN mystery_boxes mb ON o.mystery_box_id = mb.id
        WHERE mb.vendor_id = ? AND o.status IN ('approved', 'pending')
    `;

    const completedOrdersCountSql = `
        SELECT COUNT(*) AS completed_orders_count
        FROM orders o
        JOIN mystery_boxes mb ON o.mystery_box_id = mb.id
        WHERE mb.vendor_id = ? AND o.status = 'completed'
    `;

    // Execute the SQL queries in sequence
    db.query(vendorDetailsSql, [vendor_id], (err, vendorResults) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json(createResponse(500, 'Internal server error'));
        }

        if (vendorResults.length === 0) {
            return res.status(404).json(createResponse(404, 'Vendor not found'));
        }

        const vendorDetails = vendorResults[0];

        db.query(activeOrdersCountSql, [vendor_id], (err, activeOrdersResults) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json(createResponse(500, 'Internal server error'));
            }

            const active_orders_count = activeOrdersResults[0].active_orders_count;

            db.query(completedOrdersCountSql, [vendor_id], (err, completedOrdersResults) => {
                if (err) {
                    console.error('Database error:', err.message);
                    return res.status(500).json(createResponse(500, 'Internal server error'));
                }

                const completed_orders_count = completedOrdersResults[0].completed_orders_count;

                // Send the dashboard data as a response using the createResponse function
                res.status(200).json(createResponse(200, 'Vendor dashboard data fetched successfully', {
                    vendor: vendorDetails,
                    active_orders_count,
                    completed_orders_count
                }));
            });
        });
    });
});

//Active order
app.get('/active-orders',authenticateToken, (req, res) => {
    const { vendor_id } = req.query;

    if (!vendor_id) {
        return res.status(400).json(createResponse(400, 'Vendor ID is required'));
    }

    // Define the SQL query to get active orders along with user and vendor details
    const sql = `
        SELECT 
            o.id AS order_id,
            o.customer_id,
            o.mystery_box_id,
            o.quantity,
            o.total_price,
            o.description AS order_description,
            o.status AS order_status,
            o.created_at AS order_created_at,
            o.updated_at AS order_updated_at,
            u.id AS user_id,
            u.username AS user_username,
            u.name AS user_name,
            u.email AS user_email,
            u.phone_number AS user_phone_number,
            mb.id AS mystery_box_id,
            mb.title AS mystery_box_title,
            mb.price AS mystery_box_price,
            mb.description AS mystery_box_description,
            mb.collection_time AS mystery_box_collection_time,
            mb.quantity AS mystery_box_quantity,
            mb.days_available AS mystery_box_days_available,
            mb.status AS mystery_box_status,
            mb.created_at AS mystery_box_created_at,
            mb.updated_at AS mystery_box_updated_at,
            v.id AS vendor_id,
            v.username AS vendor_username,
            v.name AS vendor_name,
            v.email AS vendor_email,
            v.phone_number AS vendor_phone_number,
            v.banner_image AS vendor_banner_image,
            v.country_id AS vendor_country_id,
            v.vendor_name AS vendor_vendor_name,
            v.address AS vendor_address,
            v.image AS vendor_image,
            v.status AS vendor_status,
            v.created_at AS vendor_created_at,
            v.updated_at AS vendor_updated_at
        FROM orders o
        JOIN users u ON o.customer_id = u.id
        JOIN mystery_boxes mb ON o.mystery_box_id = mb.id
        JOIN vendors v ON mb.vendor_id = v.id
        WHERE o.status IN ('approved', 'pending') AND v.id = ?
    `;

    // Execute the SQL query
    db.query(sql, [vendor_id], (err, results) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json(createResponse(500, 'Internal server error'));
        }

        if (results.length === 0) {
            return res.status(404).json(createResponse(404, 'No active orders found for the given vendor'));
        }

        // Send the active orders details as a response using the createResponse function
        res.status(200).json(createResponse(200, 'Active orders fetched successfully', results));
    });
});


// Route to fetch completed orders
app.get('/completed-orders',authenticateToken, (req, res) => {
    const { vendor_id } = req.query;

    if (!vendor_id) {
        return res.status(400).json(createResponse(400, 'Vendor ID is required'));
    }

    // Define the SQL query to get completed orders along with user and vendor details
    const sql = `
        SELECT 
            o.id AS order_id,
            o.customer_id,
            o.mystery_box_id,
            o.quantity,
            o.total_price,
            o.description AS order_description,
            o.status AS order_status,
            o.created_at AS order_created_at,
            o.updated_at AS order_updated_at,
            u.id AS user_id,
            u.username AS user_username,
            u.name AS user_name,
            u.email AS user_email,
            u.phone_number AS user_phone_number,
            mb.id AS mystery_box_id,
            mb.title AS mystery_box_title,
            mb.price AS mystery_box_price,
            mb.description AS mystery_box_description,
            mb.collection_time AS mystery_box_collection_time,
            mb.quantity AS mystery_box_quantity,
            mb.days_available AS mystery_box_days_available,
            mb.status AS mystery_box_status,
            mb.created_at AS mystery_box_created_at,
            mb.updated_at AS mystery_box_updated_at,
            v.id AS vendor_id,
            v.username AS vendor_username,
            v.name AS vendor_name,
            v.email AS vendor_email,
            v.phone_number AS vendor_phone_number,
            v.banner_image AS vendor_banner_image,
            v.country_id AS vendor_country_id,
            v.vendor_name AS vendor_vendor_name,
            v.address AS vendor_address,
            v.image AS vendor_image,
            v.status AS vendor_status,
            v.created_at AS vendor_created_at,
            v.updated_at AS vendor_updated_at
        FROM orders o
        JOIN users u ON o.customer_id = u.id
        JOIN mystery_boxes mb ON o.mystery_box_id = mb.id
        JOIN vendors v ON mb.vendor_id = v.id
        WHERE o.status = 'completed' AND v.id = ?
    `;

    // Execute the SQL query
    db.query(sql, [vendor_id], (err, results) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json(createResponse(500, 'Internal server error'));
        }

        if (results.length === 0) {
            return res.status(404).json(createResponse(404, 'No completed orders found for the given vendor'));
        }

        // Send the completed orders details as a response using the createResponse function
        res.status(200).json(createResponse(200, 'Completed orders fetched successfully', results));
    });
});


//ADMIN SIDE =====================================================================================================================

// Route to get admin details
app.get('/admin/:id', authenticateToken, (req, res) => {
    const adminId = req.params.id;

    const sql = 'SELECT id, username, name, email, phone_number, profile_image, created_at, updated_at FROM admins WHERE id = ?';
    db.query(sql, [adminId], (err, results) => {
        if (err) {
            return res.status(500).json(createResponse(2, 'Internal server error'));
        }

        if (results.length === 0) {
            return res.status(404).json(createResponse(3, 'Admin not found'));
        }

        res.status(200).json(createResponse(1, 'Admin found', results[0]));
    });
});

// Route to login and get a token
app.post('/admin-login', async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json(createResponse(400, 'Username and password are required'));
    }

    const sql = 'SELECT * FROM admins WHERE username = ?';

    // Execute query
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json(createResponse(500, 'Internal server error'));
        }

        if (results.length === 0) {
            return res.status(404).json(createResponse(404, 'Admin not found'));
        }

        // Verify password
        const admin = results[0];
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json(createResponse(401, 'Invalid password'));
        }

        // Generate token
       // const token = generateToken({ id: admin.id, username: admin.username }, 'admin');
        const token = generateAdminToken(admin);

        res.status(200).json(createResponse(200, 'Login successful', { token, admin }));
    });
});


// Route to register a new admin
app.post('/admin-register', async (req, res) => {
    const {
        username, name, email, phone_number, password, profile_image
    } = req.body;

    // Validate input
    if (!username || !name || !email || !phone_number || !password) {
        return res.status(400).json(createResponse(400, 'All fields are required'));
    }

    try {
        // Check if the username already exists
        const checkUserSql = 'SELECT * FROM admins WHERE username = ?';
        db.query(checkUserSql, [username], async (err, results) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json(createResponse(500, 'Internal server error'));
            }

            if (results.length > 0) {
                return res.status(409).json(createResponse(409, 'Username already exists'));
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert the new admin into the database
            const insertAdminSql = `
                INSERT INTO admins (username, name, email, phone_number, password, profile_image, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
            `;
            const adminValues = [username, name, email, phone_number, hashedPassword, profile_image];

            db.query(insertAdminSql, adminValues, (err, result) => {
                if (err) {
                    console.error('Error inserting admin:', err.message);
                    return res.status(500).json(createResponse(500, 'Internal server error'));
                }

                res.status(201).json(createResponse(201, 'Admin registered successfully'));
            });
        });
    } catch (err) {
        console.error('Error hashing password:', err.message);
        res.status(500).json(createResponse(500, 'Internal server error'));
    }
});

// Route to admin logout and invalidate token
app.post('/admin-logout', authenticateToken,(req, res) => {
    // Assuming the token is sent in the Authorization header as a Bearer token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer token" format

    if (!token) {
        return res.status(400).json(createResponse(2, 'Token is required'));
    }

    // Here you would typically invalidate the token if using server-side token management.
    // For example, you might add the token to a blacklist or database of invalidated tokens.
    
    // Respond with success message
    res.status(200).json(createResponse(1, 'Admin logout successful'));
});


// Route to edit admin details
app.put('/editAdmin/:id', upload.single('profile_image'),authenticateToken, async (req, res) => {
    console.log('Request received for admin update');
    const adminId = req.params.id;
    const { name, email, phone_number, username, password } = req.body;
    const profileImage = req.file ? req.file.filename : null; // Get the uploaded file name

    console.log('Received data:', {
        adminId,
        name,
        email,
        phone_number,
        username,
        password,
        profileImage
    });

    // Validate required fields
    if (!name || !email || !phone_number || !username || !password) {
        console.log('Validation failed');
        return res.status(400).json(createResponse(2, 'All fields except profile_image are required'));
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Construct SQL query with optional profile_image field
        let sql = 'UPDATE admins SET name = ?, email = ?, phone_number = ?, username = ?, password = ?, updated_at = NOW()';
        const values = [name, email, phone_number, username, hashedPassword];

        if (profileImage) {
            sql += ', profile_image = ?';
            values.push(profileImage);
        }

        sql += ' WHERE id = ?';
        values.push(adminId);

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json(createResponse(2, 'Internal server error'));
            }

            if (result.affectedRows === 0) {
                console.log('Admin not found');
                return res.status(404).json(createResponse(3, 'Admin not found'));
            }

            console.log('Updated admin details:', {
                id: adminId,
                username,
                name,
                email,
                phone_number,
                profile_image: profileImage
            });

            res.status(200).json(createResponse(1, 'Admin updated successfully'));
        });
    } catch (err) {
        console.error('Error hashing password:', err.message);
        return res.status(500).json(createResponse(2, 'Internal server error'));
    }
});

//Dashboard Admin 
// Route to get admin dashboard data
// app.get('/admin-dashboard', authenticateToken, async (req, res) => {
//     if (req.user.role !== 'admin') {
//         return res.status(403).json(createResponse(4, 'Forbidden'));
//     }

//     try {
//         // Fetch total registered users count
//         const [usersCountResult] = await db.query('SELECT COUNT(*) AS total_users FROM users');
        
//         // Fetch account approval request count
//         const [accountApprovalCountResult] = await db.query('SELECT COUNT(*) AS approval_requests FROM vendors WHERE status = 0');
        
//         // Fetch mystery box approval request count
//         const [mysteryBoxApprovalCountResult] = await db.query('SELECT COUNT(*) AS box_requests FROM mystery_boxes WHERE status = 0');
        
//         // Fetch list of featured restaurants
//         const [featuredRestaurantsResult] = await db.query('SELECT id, vendor_name, address FROM vendors WHERE is_featured = 1');

//         res.status(200).json(createResponse(1, 'Dashboard data retrieved successfully', {
//             total_users: usersCountResult[0].total_users,
//             approval_requests: accountApprovalCountResult[0].approval_requests,
//             box_requests: mysteryBoxApprovalCountResult[0].box_requests,
//             featured_restaurants: featuredRestaurantsResult
//         }));
//     } catch (err) {
//         console.error('Error fetching dashboard data:', err);
//         res.status(500).json(createResponse(2, 'Internal server error'));
//     }
// });


// Dashboard Admin
// Route to get admin dashboard data
app.get('/admin-dashboard', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json(createResponse(4, 'Forbidden'));
    }

    try {
        // Single query to fetch all required counts and data
        const query = `
            SELECT
                (SELECT COUNT(*) FROM users) AS total_users,
                (SELECT COUNT(*) FROM vendors WHERE status = 0) AS approval_requests,
                (SELECT COUNT(*) FROM mystery_boxes WHERE status = 0) AS box_requests,
                (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'vendor_name', vendor_name, 'address', address))
                 FROM vendors WHERE featured = 1) AS featured_restaurants
        `;

        const [results] = await db.query(query);

        const responseData = {
            total_users: results[0].total_users,
            approval_requests: results[0].approval_requests,
            box_requests: results[0].box_requests,
            featured_restaurants: results[0].featured_restaurants ? JSON.parse(results[0].featured_restaurants) : [] // Convert JSON string to object
        };

        res.status(200).json(createResponse(1, 'Dashboard data retrieved successfully', responseData));
    } catch (err) {
        console.error('Error fetching dashboard data:', {
            message: err.message,
            stack: err.stack
        });
        res.status(500).json(createResponse(2, 'Internal server error'));
    }
});



//Route for Admin to Approve/Reject Vendors
app.post('/admin/approve-vendor', (req, res) => {
    const { vendor_id, action } = req.body;

    // Validate input
    if (!vendor_id || !action || !['approve', 'reject'].includes(action)) {
        return res.status(400).json(createResponse(400, 'Invalid input'));
    }

    // Determine status based on action
    const status = action === 'approve' ? 1 : 2; // 1 for approved, 2 for rejected

    // Update vendor status
    const query = 'UPDATE vendors SET status = ? WHERE id = ?';
    db.query(query, [status, vendor_id], (err, result) => {
        if (err) {
            console.error('Error updating vendor status:', err);
            return res.status(500).json(createResponse(500, 'Internal server error'));
        }

        res.status(200).json(createResponse(200, `Vendor ${action}d successfully`));
    });
});
  


  // Route for Admin to Approve/Reject Mystery Boxes

  app.post('/admin/approve-mystery-box', (req, res) => {
    const { box_id, action } = req.body;

    // Validate input
    if (!box_id || !action || !['approve', 'reject'].includes(action)) {
        return res.status(400).json(createResponse(400, 'Invalid input'));
    }

    // Determine status based on action
    const status = action === 'approve' ? 1 : 2; // 1 for approved, 2 for rejected

    // Update mystery box status
    const query = 'UPDATE mystery_boxes SET status = ? WHERE id = ?';
    db.query(query, [status, box_id], (err, result) => {
        if (err) {
            console.error('Error updating mystery box status:', err);
            return res.status(500).json(createResponse(500, 'Internal server error'));
        }

        res.status(200).json(createResponse(200, `Mystery box ${action}d successfully`));
    });
});






//Coupons routes

// Route to create a new coupon (accessible by admins only)
app.post('/add-coupon', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json(createResponse(4, 'Forbidden'));

    const { code, discount, expiry_date, status } = req.body;

    if (!code || discount === undefined || status === undefined) {
        return res.status(400).json(createResponse(2, 'Code, discount, and status are required'));
    }

    // Set default expiry_date to 3 days from now if not provided
    const defaultExpiryDate = new Date();
    defaultExpiryDate.setDate(defaultExpiryDate.getDate() + 3);
    const expiryDateToUse = expiry_date || defaultExpiryDate.toISOString().slice(0, 19).replace('T', ' ');

    const sql = 'INSERT INTO coupons (code, discount, expiry_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())';

    db.query(sql, [code, discount, expiryDateToUse, status], (err, results) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        res.status(201).json(createResponse(1, 'Coupon created successfully', { id: results.insertId }));
    });
});

// Route to get all coupons (accessible by admins only)
app.get('/show-coupons', authenticateToken, (req, res) => {
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
// Route to update an existing coupon (accessible by admins only)
app.put('/update-coupon/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json(createResponse(4, 'Forbidden'));

    const { id } = req.params;
    const { code, discount, expiry_date, status } = req.body;

    if (!code || discount === undefined || status === undefined) {
        return res.status(400).json(createResponse(2, 'Code, discount, and status are required'));
    }

    // Set default expiry_date to 3 days from now if not provided
    const defaultExpiryDate = new Date();
    defaultExpiryDate.setDate(defaultExpiryDate.getDate() + 3);
    const expiryDateToUse = expiry_date || defaultExpiryDate.toISOString().slice(0, 19).replace('T', ' ');

    const sql = 'UPDATE coupons SET code = ?, discount = ?, expiry_date = ?, status = ?, updated_at = NOW() WHERE id = ?';

    db.query(sql, [code, discount, expiryDateToUse, status, id], (err, result) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        if (result.affectedRows === 0) {
            return res.status(404).json(createResponse(3, 'Coupon not found'));
        }

        res.status(200).json(createResponse(1, 'Coupon updated successfully'));
    });
});;



// Route to delete a coupon by ID (accessible by admins only)
app.delete('/delete-coupon/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json(createResponse(4, 'Forbidden'));

    const couponId = req.params.id;

    // SQL query to delete the coupon
    const sql = 'DELETE FROM coupons WHERE id = ?';

    db.query(sql, [couponId], (err, result) => {
        if (err) {
            console.error('Error deleting coupon:', err.message);
            return res.status(500).json(createResponse(2, 'Internal server error'));
        }

        if (result.affectedRows === 0) {
            return res.status(404).json(createResponse(3, 'Coupon not found'));
        }

        res.status(200).json(createResponse(1, 'Coupon deleted successfully'));
    });
});


// banner routes

// Route to create a new banner (accessible by admins only)
app.post('/add-banner', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json(createResponse(4, 'Forbidden'));

    const { title, image_url, status } = req.body;

    if (!title || !image_url || status === undefined) {
        return res.status(400).json(createResponse(2, 'Title, image URL, and status are required'));
    }

    const sql = 'INSERT INTO banners (title, image_url, status, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())';

    db.query(sql, [title, image_url, status], (err, results) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        res.status(201).json(createResponse(1, 'Banner created successfully', { id: results.insertId }));
    });
});

// Route to get all banners (accessible by admins only)
app.get('/show-banners', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json(createResponse(4, 'Forbidden'));

    const sql = 'SELECT * FROM banners ORDER BY id ASC';

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        if (results.length === 0) {
            return res.status(404).json(createResponse(3, 'No data found'));
        }

        res.status(200).json(createResponse(1, 'Banners retrieved successfully', results));
    });
});

// Route to update a banner by ID (accessible by admins only)
app.put('/update-banner/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json(createResponse(4, 'Forbidden'));

    const { id } = req.params;
    const { title, image_url, status } = req.body;

    if (!title || !image_url || status === undefined) {
        return res.status(400).json(createResponse(2, 'Title, image URL, and status are required'));
    }

    const sql = 'UPDATE banners SET title = ?, image_url = ?, status = ?, updated_at = NOW() WHERE id = ?';

    db.query(sql, [title, image_url, status, id], (err, result) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        if (result.affectedRows === 0) {
            return res.status(404).json(createResponse(3, 'Banner not found'));
        }

        res.status(200).json(createResponse(1, 'Banner updated successfully'));
    });
});

// Route to delete a banner by ID (accessible by admins only)
app.delete('/delete-banner/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json(createResponse(4, 'Forbidden'));

    const bannerId = req.params.id;

    const sql = 'DELETE FROM banners WHERE id = ?';

    db.query(sql, [bannerId], (err, result) => {
        if (err) {
            console.error('Error deleting banner:', err.message);
            return res.status(500).json(createResponse(2, 'Internal server error'));
        }

        if (result.affectedRows === 0) {
            return res.status(404).json(createResponse(3, 'Banner not found'));
        }

        res.status(200).json(createResponse(1, 'Banner deleted successfully'));
    });
});


// Featured Vendor 




//All featured vendors

// Route to get all featured vendors (accessible by admins only)
app.get('/show-featured-vendors', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json(createResponse(4, 'Forbidden'));

    const sql = 'SELECT * FROM vendors WHERE featured = TRUE ORDER BY id ASC';

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        if (results.length === 0) {
            return res.status(404).json(createResponse(3, 'No featured vendors found'));
        }

        res.status(200).json(createResponse(1, 'Featured vendors retrieved successfully', results));
    });
});

// Route to add a featured vendor (accessible by admins only)
app.post('/add-featured-vendor', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json(createResponse(4, 'Forbidden'));

    const { vendor_id } = req.body;

    if (!vendor_id) {
        return res.status(400).json(createResponse(2, 'Vendor ID is required'));
    }

    // Check if the vendor exists
    const sqlCheckVendor = 'SELECT * FROM vendors WHERE id = ?';

    db.query(sqlCheckVendor, [vendor_id], (err, results) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        if (results.length === 0) {
            return res.status(404).json(createResponse(3, 'Vendor not found'));
        }

        // Add or update featured status
        const sqlUpdate = 'UPDATE vendors SET featured = TRUE WHERE id = ?';

        db.query(sqlUpdate, [vendor_id], (err, result) => {
            if (err) return res.status(500).json(createResponse(2, err.message));

            res.status(200).json(createResponse(1, 'Vendor featured successfully'));
        });
    });
});

// Route to update a featured vendor by ID (accessible by admins only)
app.put('/update-featured-vendor/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json(createResponse(4, 'Forbidden'));

    const { id } = req.params;
    const { featured } = req.body;

    if (featured === undefined) {
        return res.status(400).json(createResponse(2, 'Featured status is required'));
    }

    const sql = 'UPDATE vendors SET featured = ? WHERE id = ?';

    db.query(sql, [featured, id], (err, result) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        if (result.affectedRows === 0) {
            return res.status(404).json(createResponse(3, 'Vendor not found'));
        }

        res.status(200).json(createResponse(1, 'Featured status updated successfully'));
    });
});


// Route to delete a featured vendor by ID (accessible by admins only)
app.delete('/delete-featured-vendor/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json(createResponse(4, 'Forbidden'));

    const { id } = req.params;

    const sql = 'UPDATE vendors SET featured = FALSE WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(createResponse(2, err.message));

        if (result.affectedRows === 0) {
            return res.status(404).json(createResponse(3, 'Vendor not found'));
        }

        res.status(200).json(createResponse(1, 'Vendor unfeatured successfully'));
    });
});


// order placement  ========================
// Route to Place a New Order (Customer)
app.post('/place-order', authenticateToken, async (req, res) => {
    const { customer_id, mystery_box_id, quantity, total_price, description } = req.body;

    // Validate input
    if (!customer_id || !mystery_box_id || !quantity || !total_price || !description) {
        return res.status(400).json(createResponse(2, 'All fields are required'));
    }

    // Check if there is enough stock
    const stockCheckSql = `
        SELECT restock_quantity
        FROM vendor_restocks
        WHERE mystery_box_id = ?
    `;
    db.query(stockCheckSql, [mystery_box_id], (err, results) => {
        if (err) {
            return res.status(500).json(createResponse(2, err.message));
        }

        if (results.length === 0 || results[0].restock_quantity < quantity) {
            return res.status(422).json(createResponse(2, 'Not enough stock available'));
        }

        // Insert order
        const orderSql = `
            INSERT INTO orders (customer_id, mystery_box_id, quantity, total_price, description, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;
        const orderValues = [customer_id, mystery_box_id, quantity, total_price, description, 'pending'];

        db.query(orderSql, orderValues, (err, result) => {
            if (err) {
                return res.status(500).json(createResponse(2, err.message));
            }

            if (!result.insertId) {
                return res.status(422).json(createResponse(2, 'Order could not be placed'));
            }

            // Update stock
            const updateStockSql = `
                UPDATE vendor_restocks
                SET restock_quantity = restock_quantity - ?
                WHERE mystery_box_id = ?
            `;
            db.query(updateStockSql, [quantity, mystery_box_id], (err) => {
                if (err) {
                    return res.status(500).json(createResponse(2, err.message));
                }

                // Insert transaction
                const transactionSql = `
                    INSERT INTO transactions (vendor_id, amount, transaction_type, created_at)
                    SELECT mb.vendor_id, ?, 'credit', NOW()
                    FROM mystery_boxes mb
                    WHERE mb.id = ?
                `;
                const transactionValues = [total_price, mystery_box_id];

                db.query(transactionSql, transactionValues, (err) => {
                    if (err) {
                        return res.status(500).json(createResponse(2, err.message));
                    }

                    // Insert sale
                    const saleSql = `
                        INSERT INTO sales (mystery_box_id, user_id, quantity_sold, sold_at)
                        VALUES (?, ?, ?, NOW())
                    `;
                    const saleValues = [mystery_box_id, customer_id, quantity];

                    db.query(saleSql, saleValues, (err) => {
                        if (err) {
                            return res.status(500).json(createResponse(2, err.message));
                        }

                        // Fetch the newly created order
                        const selectSql = 'SELECT * FROM orders WHERE id = ?';
                        db.query(selectSql, [result.insertId], (err, results) => {
                            if (err) {
                                return res.status(500).json(createResponse(2, err.message));
                            }

                            res.status(200).json(createResponse(1, 'Order has been placed successfully', results[0]));
                        });
                    });
                });
            });
        });
    });
});




// Route to Approve an Order (Vendor)
// Route to Approve an Order (Vendor)
app.post('/order-approval/:order_id',authenticateToken, (req, res) => {
    const { order_id } = req.params;

    // Fetch the order
    const selectSql = 'SELECT * FROM orders WHERE id = ?';
    db.query(selectSql, [order_id], (err, results) => {
        if (err) {
            return res.status(500).json(createResponse(2, err.message));
        }

        if (results.length === 0 || results[0].status !== 'pending') {
            return res.status(422).json(createResponse(2, 'No record found or order cannot be approved'));
        }

        // Update the order status to 'approved'
        const updateSql = 'UPDATE orders SET status = ? WHERE id = ?';
        db.query(updateSql, ['approved', order_id], (err, result) => {
            if (err) {
                return res.status(500).json(createResponse(2, err.message));
            }

            if (result.affectedRows === 0) {
                return res.status(422).json(createResponse(2, 'Order could not be approved'));
            }

            // Fetch the updated order
            db.query(selectSql, [order_id], (err, updatedResults) => {
                if (err) {
                    return res.status(500).json(createResponse(2, err.message));
                }

                res.status(200).json(createResponse(1, 'Order has been approved', updatedResults[0]));
            });
        });
    });
});



// Route to Complete an Order (Vendor)
// Route to Complete an Order (Vendor)
app.post('/order-completed/:order_id', authenticateToken, (req, res) => {
    const { order_id } = req.params;

    // Fetch the order
    const selectSql = 'SELECT * FROM orders WHERE id = ?';
    db.query(selectSql, [order_id], (err, results) => {
        if (err) {
            return res.status(500).json(createResponse(2, err.message));
        }

        if (results.length === 0 || results[0].status !== 'approved') {
            return res.status(422).json(createResponse(2, 'No record found or order cannot be completed'));
        }

        // Update the order status to 'completed'
        const updateSql = 'UPDATE orders SET status = ? WHERE id = ?';
        db.query(updateSql, ['completed', order_id], (err, result) => {
            if (err) {
                return res.status(500).json(createResponse(2, err.message));
            }

            if (result.affectedRows === 0) {
                return res.status(422).json(createResponse(2, 'Order could not be completed'));
            }

            // Fetch the updated order
            db.query(selectSql, [order_id], (err, updatedResults) => {
                if (err) {
                    return res.status(500).json(createResponse(2, err.message));
                }

                // Optionally, update transaction details
                // Example: If completed status implies a payment or other action
                const transactionUpdateSql = `
                    UPDATE transactions
                    SET amount = ?
                    WHERE vendor_id = (SELECT mb.vendor_id FROM mystery_boxes mb JOIN orders o ON mb.id = o.mystery_box_id WHERE o.id = ?)
                `;
                const transactionUpdateValues = [results[0].total_price, order_id];

                db.query(transactionUpdateSql, transactionUpdateValues, (err) => {
                    if (err) {
                        return res.status(500).json(createResponse(2, err.message));
                    }

                    res.status(200).json(createResponse(1, 'Order has been completed', updatedResults[0]));
                });
            });
        });
    });
});

app.get('/orders',authenticateToken,(req, res) => {
    const sql = 'SELECT * FROM orders';

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json(createResponse(2, err.message));
        }

        res.status(200).json(createResponse(1, 'Orders fetched successfully', { orders: results }));
    });
});

// Route to Restock Inventory (Vendor)
app.post('/restock-inventory', authenticateToken, async (req, res) => {
    const { vendor_id, mystery_box_id, restock_quantity } = req.body;

    // Validate input
    if (!vendor_id || !mystery_box_id || !restock_quantity) {
        return res.status(400).json(createResponse(2, 'All fields are required'));
    }

    // Update or Insert restock quantity
    const checkStockSql = `
        SELECT restock_quantity
        FROM vendor_restocks
        WHERE vendor_id = ? AND mystery_box_id = ?
    `;
    db.query(checkStockSql, [vendor_id, mystery_box_id], (err, results) => {
        if (err) {
            return res.status(500).json(createResponse(2, err.message));
        }

        if (results.length > 0) {
            // Update existing stock
            const updateStockSql = `
                UPDATE vendor_restocks
                SET restock_quantity = restock_quantity + ?
                WHERE vendor_id = ? AND mystery_box_id = ?
            `;
            db.query(updateStockSql, [restock_quantity, vendor_id, mystery_box_id], (err) => {
                if (err) {
                    return res.status(500).json(createResponse(2, err.message));
                }

                res.status(200).json(createResponse(1, 'Inventory has been restocked successfully'));
            });
        } else {
            // Insert new stock entry
            const insertStockSql = `
                INSERT INTO vendor_restocks (vendor_id, mystery_box_id, restock_quantity)
                VALUES (?, ?, ?)
            `;
            db.query(insertStockSql, [vendor_id, mystery_box_id, restock_quantity], (err) => {
                if (err) {
                    return res.status(500).json(createResponse(2, err.message));
                }

                res.status(200).json(createResponse(1, 'Inventory has been restocked successfully'));
            });
        }
    });
});

// Define a route for the welcome message
app.get('/', (req, res) => {
    res.send('Welcome to my Heroku app!');
  });