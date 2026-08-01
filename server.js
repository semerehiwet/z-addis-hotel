const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 1. ዳታቤዝ ማገናኘት
const db = new sqlite3.Database('./hotel.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// 2. ሠንጠረዦችን መፍጠር እና መረጃ መሙላት
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_number TEXT UNIQUE,
        room_type TEXT,
        price_per_night REAL,
        is_available BOOLEAN
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guest_name TEXT,
        phone TEXT,
        room_id INTEGER,
        check_in_date TEXT,
        check_out_date TEXT,
        total_price REAL,
        booking_date TEXT,
        FOREIGN KEY(room_id) REFERENCES rooms(id)
    )`);

    const initialRooms = [
        { num: '101', type: 'Luxury Suite', price: 2500 },
        { num: '102', type: 'Standard Room', price: 1500 },
        { num: '103', type: 'Standard Room', price: 1500 },
        { num: '104', type: 'Deluxe Room', price: 2000 },
        { num: '105', type: 'Deluxe Room', price: 2000 },
        { num: '106', type: 'Single Room', price: 1000 },
        { num: '107', type: 'Single Room', price: 1000 },
        { num: '201', type: 'Luxury Suite', price: 2600 },
        { num: '202', type: 'Standard Room', price: 1500 },
        { num: '203', type: 'Standard Room', price: 1500 },
        { num: '204', type: 'Deluxe Room', price: 2000 },
        { num: '205', type: 'Deluxe Room', price: 2000 },
        { num: '206', type: 'Luxury Suite', price: 2600 },
        { num: '207', type: 'Single Room', price: 1000 },
        { num: '208', type: 'Single Room', price: 1000 },
        { num: '301', type: 'Presidential Suite', price: 4500 },
        { num: '302', type: 'Luxury Suite', price: 2500 },
        { num: '303', type: 'Standard Room', price: 1500 },
        { num: '304', type: 'Deluxe Room', price: 2000 },
        { num: '305', type: 'Deluxe Room', price: 2000 },
        { num: '306', type: 'Standard Room', price: 1500 },
        { num: '307', type: 'Single Room', price: 1000 },
        { num: '401', type: 'Presidential Suite', price: 4500 },
        { num: '402', type: 'Luxury Suite', price: 2500 },
        { num: '403', type: 'Standard Room', price: 1500 },
        { num: '404', type: 'Deluxe Room', price: 2000 },
        { num: '405', type: 'Deluxe Room', price: 2000 },
        { num: '406', type: 'Standard Room', price: 1500 },
        { num: '407', type: 'Single Room', price: 1000 },
        { num: '501', type: 'Presidential Suite', price: 5000 },
        { num: '502', type: 'Presidential Suite', price: 5000 },
        { num: '503', type: 'Luxury Suite', price: 2800 },
        { num: '504', type: 'Deluxe Room', price: 2200 },
        { num: '505', type: 'Deluxe Room', price: 2200 },
        { num: '506', type: 'Standard Room', price: 1600 },
        { num: '507', type: 'Standard Room', price: 1600 }
    ];

    initialRooms.forEach(r => {
        db.run(`INSERT OR IGNORE INTO rooms (room_number, room_type, price_per_night, is_available) 
                VALUES (?, ?, ?, 1)`, [r.num, r.type, r.price]);
    });
});

// ==========================================
// የህዝብ (Public) መረጃዎች ኤፒአይ
// ==========================================

app.get('/api/rooms', (req, res) => {
    db.all(`SELECT * FROM rooms`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/bookings', (req, res) => {
    const { guest_name, phone, room_id, check_in_date, check_out_date, total_price } = req.body;
    const booking_date = new Date().toISOString();
    const sql = `INSERT INTO bookings (guest_name, phone, room_id, check_in_date, check_out_date, total_price, booking_date) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [guest_name, phone, room_id, check_in_date, check_out_date, total_price, booking_date], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        db.run(`UPDATE rooms SET is_available = 0 WHERE id = ?`, [room_id], (updateErr) => {
            if (updateErr) return res.status(500).json({ error: updateErr.message });
            res.json({ message: 'Room booked successfully' });
        });
    });
});

// ==========================================
// የአድሚን (Admin) ጥበቃ እና ኤፒአይ
// ==========================================

app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === 'admin123') {
        res.json({ success: true, token: 'SECURE_ADMIN_TOKEN_XYZ999' });
    } else {
        res.status(401).json({ success: false, error: 'የተሳሳተ የይለፍ ቃል!' });
    }
});

app.get('/api/admin/bookings', (req, res) => {
    const token = req.headers['authorization'];
    if (token !== 'Bearer SECURE_ADMIN_TOKEN_XYZ999') {
        return res.status(403).json({ error: 'ፈቃድ የለዎትም! (Unauthorized Access)' });
    }

    const query = 
        `SELECT bookings.id, bookings.guest_name, bookings.phone, 
               bookings.check_in_date, bookings.check_out_date, bookings.total_price, 
               rooms.room_number, rooms.room_type, rooms.id as room_id
        FROM bookings
        JOIN rooms ON bookings.room_id = rooms.id`
    ;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.delete('/api/admin/bookings/:id', (req, res) => {
    const token = req.headers['authorization'];
    if (token !== 'Bearer SECURE_ADMIN_TOKEN_XYZ999') {
        return res.status(403).json({ error: 'ፈቃድ የለዎትም! (Unauthorized Access)' });
    }

    const bookingId = req.params.id;

    db.get(`SELECT room_id FROM bookings WHERE id = ?`, [bookingId], (err, row) => {
        if (err || !row) return res.status(404).json({ error: 'Booking not found' });

        const roomId = row.room_id;

        db.run(`DELETE FROM bookings WHERE id = ?`, [bookingId], (delErr) => {
            if (delErr) return res.status(500).json({ error: delErr.message });

            db.run(`UPDATE rooms SET is_available = 1 WHERE id = ?`, [roomId], (updateErr) => {
                if (updateErr) return res.status(500).json({ error: updateErr.message });
                res.json({ message: 'Booking deleted and room is now available' });
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`ሰርቨሩ በፖርት ${PORT} ላይ ተነስቷል: http://localhost:${PORT}`);
});