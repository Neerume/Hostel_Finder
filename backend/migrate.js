const mysql = require('mysql2/promise');
const env = require('./src/config/env');

async function migrate() {
    try {
        const pool = mysql.createPool({
            host: env.db.host,
            user: env.db.user,
            password: env.db.password,
            database: env.db.name,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log("Altering hostel_image_url to JSON...");
        try {
            await pool.query('ALTER TABLE hostels MODIFY COLUMN hostel_image_url JSON;');
        } catch (e) {
            console.log("Modify JSON skipped or failed: " + e.message);
        }

        console.log("Adding latitude column...");
        try {
            await pool.query('ALTER TABLE hostels ADD COLUMN latitude DECIMAL(10,8) NULL;');
            await pool.query('ALTER TABLE hostels ADD COLUMN longitude DECIMAL(11,8) NULL;');
        } catch (e) {
            console.log("Add lat/lng skipped or failed: " + e.message);
        }

        console.log("Database migration done.");
        process.exit(0);
    } catch (e) {
        console.error("Migration fatal error:", e);
        process.exit(1);
    }
}
migrate();