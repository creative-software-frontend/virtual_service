const db = require("./src/config/db");
async function checkSchema() {
    const [rows] = await db.query("SHOW COLUMNS FROM features");
    console.log(rows);
    db.end();
}
checkSchema();
