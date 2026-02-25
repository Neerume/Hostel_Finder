const mysql = require('mysql2/promise');
const env = require('./src/config/env');

async function fixImageColumn() {
    const pool = await mysql.createPool({
        host: env.db.host,
        user: env.db.user,
        password: env.db.password,
        database: env.db.name,
    });

    // Check current column type
    const [cols] = await pool.query(
        "SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'hostels' AND COLUMN_NAME = 'hostel_image_url'",
        [env.db.name]
    );
    console.log('Current hostel_image_url type:', cols[0]?.COLUMN_TYPE || 'not found');

    if (cols[0]?.COLUMN_TYPE?.toLowerCase() === 'json') {
        console.log('Column is already JSON type. Nothing to do.');
        process.exit(0);
    }

    // Null out any non-JSON values so the ALTER succeeds
    console.log('Clearing old non-JSON image values...');
    const [upd] = await pool.query(
        "UPDATE hostels SET hostel_image_url = NULL WHERE hostel_image_url IS NOT NULL AND hostel_image_url NOT REGEXP '^\\\\[';"
    );
    console.log('Rows cleared:', upd.affectedRows);

    // Alter column to JSON
    console.log('Altering column to JSON...');
    await pool.query('ALTER TABLE hostels MODIFY COLUMN hostel_image_url JSON;');
    console.log('Success! hostel_image_url is now JSON type.');

    process.exit(0);
}

fixImageColumn().catch(e => {
    console.error('Migration error:', e.message);
    process.exit(1);
});
