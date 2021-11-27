// === 주소코드 리스트 데이터 반환 모듈 ===
const pool = require('../modules/mysql');
const pool2 = require('../modules/mysql2');


/* ===== 시도 리스트 데이터 가져오기 =====
 *
 * 모든 주소 정보를 반환합니다
 *
 * === input ===
 * NONE
 *
 * === output ===
 * sido : 시도 코드 리스트 [{Code: 시도 코드, sido: 시도명}] (오류시 undefined 반환)
 *
*/
async function GetSido() {
    var sido = undefined;
    const connection = await pool2.getConnection(async conn => conn);
    try {
        const result = await connection.query("SELECT * FROM SIDO");
        sido = result[0];
    }
    catch (err) {
        console.error("err : " + err);
        throw err;
    }
    finally {
        connection.release();
        return sido;
    }
}


/* ===== 시군구 리스트 데이터 가져오기 =====
 *
 * 시도에 포함되는 시군구 목록을 가져옵니다
 *
 * === client-input ===
 * sido : 시도 코드 (int)
 *
 * === server-return ===
 * SiGunGu : 시군구 코드 리스트 [{Code: 시군구 코드, SiGunGu: 시군구명}]
 *
*/
async function GetSigunguBySido(sido) {
    var sigungu = undefined;
    const connection = await pool2.getConnection(async conn => conn);
    try {
        const result = await connection.query("select `Code`, `SiGunGu` from sigungu where sido=?;", [sido]);
        sigungu = result[0];
    }
    catch (err) {
        console.error("err : " + err);
        throw err;
    }
    finally {
        connection.release();
        return sigungu;
    }
}


module.exports = {
    GetSido: GetSido,
    GetSigunguBySido: GetSigunguBySido
};
