const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

// Initialize SQLite database
const db = new sqlite3.Database('./applications.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Create tables if they don't exist
function initializeDatabase() {
    db.run(`CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        email TEXT NOT NULL,
        telephone TEXT NOT NULL,
        ville TEXT NOT NULL,
        motivation TEXT NOT NULL,
        apport TEXT NOT NULL,
        disponibilite TEXT NOT NULL,
        competences TEXT,
        autresDetails TEXT,
        typeAdhesion TEXT NOT NULL,
        newsletter INTEGER DEFAULT 0,
        status TEXT DEFAULT 'pending',
        timestamp TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Database table initialized');
        }
    });
}

// API Routes

// Create new application
app.post('/api/applications', (req, res) => {
    const {
        nom, email, telephone, ville, motivation, apport,
        disponibilite, competences, autresDetails, typeAdhesion, newsletter
    } = req.body;

    if (!nom || !email || !telephone || !ville || !motivation || !apport || !disponibilite || !typeAdhesion) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const timestamp = new Date().toLocaleString('fr-FR');
    const competencesStr = Array.isArray(competences) ? JSON.stringify(competences) : competences || '[]';
    const newsletterInt = newsletter ? 1 : 0;

    const query = `INSERT INTO applications 
        (nom, email, telephone, ville, motivation, apport, disponibilite, 
         competences, autresDetails, typeAdhesion, newsletter, status, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`;

    db.run(query, [
        nom, email, telephone, ville, motivation, apport, disponibilite,
        competencesStr, autresDetails, typeAdhesion, newsletterInt, timestamp
    ], function(err) {
        if (err) {
            console.error('Error inserting application:', err.message);
            return res.status(500).json({ error: 'Failed to create application' });
        }
        res.status(201).json({
            message: 'Application created successfully',
            id: this.lastID
        });
    });
});

// Get all applications
app.get('/api/applications', (req, res) => {
    const query = 'SELECT * FROM applications ORDER BY created_at DESC';
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching applications:', err.message);
            return res.status(500).json({ error: 'Failed to fetch applications' });
        }
        
        // Parse competences JSON string back to array
        const applications = rows.map(row => ({
            ...row,
            competences: JSON.parse(row.competences || '[]'),
            newsletter: Boolean(row.newsletter)
        }));
        
        res.json(applications);
    });
});

// Get single application by ID
app.get('/api/applications/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM applications WHERE id = ?';
    
    db.get(query, [id], (err, row) => {
        if (err) {
            console.error('Error fetching application:', err.message);
            return res.status(500).json({ error: 'Failed to fetch application' });
        }
        
        if (!row) {
            return res.status(404).json({ error: 'Application not found' });
        }
        
        const application = {
            ...row,
            competences: JSON.parse(row.competences || '[]'),
            newsletter: Boolean(row.newsletter)
        };
        
        res.json(application);
    });
});

// Update application status to approved
app.put('/api/applications/:id/approve', (req, res) => {
    const { id } = req.params;
    const query = 'UPDATE applications SET status = ? WHERE id = ?';
    
    db.run(query, ['approved', id], function(err) {
        if (err) {
            console.error('Error approving application:', err.message);
            return res.status(500).json({ error: 'Failed to approve application' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Application not found' });
        }
        
        res.json({ message: 'Application approved successfully' });
    });
});

// Update application status to rejected
app.put('/api/applications/:id/reject', (req, res) => {
    const { id } = req.params;
    const query = 'UPDATE applications SET status = ? WHERE id = ?';
    
    db.run(query, ['rejected', id], function(err) {
        if (err) {
            console.error('Error rejecting application:', err.message);
            return res.status(500).json({ error: 'Failed to reject application' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Application not found' });
        }
        
        res.json({ message: 'Application rejected successfully' });
    });
});

// Get statistics
app.get('/api/statistics', (req, res) => {
    const queries = {
        total: 'SELECT COUNT(*) as count FROM applications',
        pending: 'SELECT COUNT(*) as count FROM applications WHERE status = "pending"',
        approved: 'SELECT COUNT(*) as count FROM applications WHERE status = "approved"',
        rejected: 'SELECT COUNT(*) as count FROM applications WHERE status = "rejected"'
    };
    
    const stats = {};
    let completed = 0;
    const total = Object.keys(queries).length;
    
    Object.entries(queries).forEach(([key, query]) => {
        db.get(query, [], (err, row) => {
            if (!err) {
                stats[key] = row.count;
            }
            completed++;
            
            if (completed === total) {
                res.json(stats);
            }
        });
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'inscription.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        }
        console.log('\nDatabase connection closed');
        process.exit(0);
    });
});
