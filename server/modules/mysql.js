// === mysql 오브젝트 ===

/* ===== MySQL 연동 =====
 *
 * MySQL DB와 연결합니다
 *
*/
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'covid19',
    multipleStatements: true
});

module.exports = pool;
