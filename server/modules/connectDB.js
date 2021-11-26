// === mysql 접속을 담당하는 Object ===
/*
 * === input ===
 * execute : 실행 내역
 * response : 송신자
 *
 * === return ===
 * NONE
 *
*/

/*const pool = require('../modules/mysql');

const connectDB = {
    err_code : 0,   // 에러 코드 (0 = 오류 없음, 1 = DB 오류, 2 = 사용자 지정 오류)
    err_msg : "",   // 에러 메시지 (오류 발생시 클라이언트로 보냄)
    packet : {},  // 보낼 패킷
    res : null,     // 송신자

    start : async function(response, execute){
        err_code = 0;
        err_msg = "";
        packet = {};
        res = response;
        
        const connection = await pool.getConnection(async conn => conn);
        try {
            execute();
        }
        catch (err) {
            if(err_code < 2)
            {
                err_code = 1;
                err_msg = "서버에서 오류가 발생했습니다.";
                console.error("err : " + err);
                throw err;
            }
            else err_msg = err.message;
        }
        finally {
            if(err_code == 0) res.send(packet);
            else res.status(500).send({ err : err_msg });
            connection.release();
        }
    }
}

module.exports = connectDB;*/
