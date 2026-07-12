const db = require('./src/config/db');
async function check() {
    const [tables] = await db.query('SHOW TABLES');
    console.log('ALL TABLES:');
    tables.forEach(t => console.log(' -', Object.values(t)[0]));

    const [userIdCol] = await db.query(
        "SELECT COLUMN_NAME, COLUMN_TYPE FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='users' AND COLUMN_NAME='id'"
    );
    console.log('\nusers.id type:', userIdCol[0] ? userIdCol[0].COLUMN_TYPE : 'NOT FOUND');
    process.exit(0);
}
check().catch(e => { console.error(e.message); process.exit(1); });
