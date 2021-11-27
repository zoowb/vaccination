const express = require('express');
const router = express.Router();
const jwt = require('../modules/jwt');
const pool = require('../modules/mysql');
const pool2 = require('../modules/mysql2');


/* ===== 마이페이지 입장 처리 =====
 *
 * 아이디와 패스워드를 확인합니다 (로그인과 동일)
 *
 * === client-input ===
 * email : 사용자 아이디 [DB person.Email]
 * passwd : 사용자 패스워드 [DB person.Password]
 *
 * === server-return ===
 * ok : 인증 성공시 true, 실패 시 false
 * err : 에러 발생시 메시지 반환
 *
*/
router.post('/check', async function (req, res, next) {
    const email = req.body.email;
    const pass = req.body.passwd;

    let err_code = 0;
    let err_msg = "";

    const connection = await pool2.getConnection(async conn => conn);
    try {
        const result1 = await connection.query("SELECT * FROM PERSON WHERE Email=? and Password=?;", [email, pass]);
        const data1 = result1[0];
        
        if(data1.length == 0)
        {
            err_code = 2;
            throw new Error("일치하는 회원정보가 없습니다.");
        }
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
        if(err_code == 0) res.send({ ok : true });
        else res.status(500).send({ err : err_msg, ok : false });
        connection.release();
    }
});


/* ===== 회원정보 수정 미리보기 처리 =====
 *
 * 로그인 정보를 기반으로 사용자 정보를 반환합니다
 *
 * === client-input ===
 * jwtToken = 사용자 정보 jwt토큰 (로그인에서 생성된 토큰)
 *
 * === server-return ===
 * Name : 이름
 * Ssn : 주민번호
 * Phone : 전화번호
 * Email : 아이디
 * Password : 비밀번호
 * Location : 주소
 * err : 에러 발생시 메시지 반환
 *
*/
router.post('/getinfo', async function (req, res, next) {
    var token = req.body.jwtToken; // 토큰은 post로만 처리 가능
    var token_res = await jwt.verify(token); // 토큰 해독

    pool.query("SELECT Name, Ssn, Phone, Email, Password, Location FROM PERSON WHERE Email=?;", [token_res.id], function (err, result) {
        if (err)
        {
            res.send({ err : "DB 오류" });
            console.error("err : " + err);
        }

        if (result.length > 0) { // 예약 정보 반환
            res.send(result[0]);
            console.log(result);
        }
        else { 
            res.send({ err : "해당 회원정보가 존재하지 않습니다." });
        }
    });
});


/* ===== 회원정보 수정 완료 처리 =====
 *
 * 회원정보를 수정합니다 (이름, 아이디, 주민번호는 변경 불가)
 *
 * === client-input ===
 * ssn : 주민번호
 * tel : 전화번호
 * passwd : 비밀번호
 * location : 주소
 *
 * === server-return ===
 * ok : 성공 여부. 변경 완료 시 true
 * err : 에러 발생시 메시지 반환
 *
*/
router.post('/changeinfo', function (req, res, next) {
    var ssn = req.body.ssn;
    var phone = req.body.tel;
    var pass = req.body.passwd;
    var location = req.body.location;

    pool.getConnection(function (err, connection) {
        var sql = "UPDATE PERSON SET Phone=?, Password=?, Location=? WHERE Ssn=?;";
        connection.query(sql, [phone, pass, location, ssn], function (err, rows) {
            if (err) // 회원가입 오류
            {
                res.send({ err : "DB 오류", ok : false});
                console.error("err : " + err);
            }

            if(rows.affectedRows > 0) res.send({ ok : true});
            else res.send({ err : "회원정보가 없습니다.", ok : false});
            
            connection.release();
        });
    });
});


/* ===== 예약정보 수정 미리보기 처리 ===== (테스트 X)
 *
 * 로그인 정보를 기반으로 1, 2차 예약정보 정보를 반환합니다
 *
 * === client-input ===
 * jwtToken = 사용자 정보 jwt토큰 (로그인에서 생성된 토큰)
 *
 * === server-return ===
 * rev_num = 예약 번호
 * rev_name = 예약자명
 * vac1 = 1차예약 백신 고유번호
 * vac1_hos = 1차예약 병원 아이디
 * vac1_date =  1차예약 날짜&시간
 * vac2 = 2차예약 백신 고유번호
 * vac2_hos = 2차예약 병원 아이디
 * vac2_date =  2차예약 날짜&시간
 *
 * ??? 예약 정보가 여러 가지인 경우도 고려하는가? (ex. 1차 예약이 2번 존재함) -> 일단 없다고 가정 ???
 *
*/
router.post('/getrev', function (req, res, next) {
    var token = req.body.jwtToken; // 토큰은 post로만 처리 가능
    var token_res = await jwt.verify(token); // 토큰 해독

    pool.getConnection(function (err, connection) {
        var sql = "SELECT Rnumber, Name FROM PERSON natural join RESERVATION WHERE `Ssn`=? and `Order`=1;";
        connection.query(sql, [token_res.ssn], function (err, result) {
            if (err) console.error("err : " + err);

            if (result.length > 0) { // 예약 정보 반환
                res.send(result);
            }
            else { 
                res.send({ "msg" : "예약정보가 존재하지 않습니다" });
            }
            console.log(result);

            connection.release();
        });
    });
});


/* ===== 1차 예약정보 수정 post 처리 ===== (테스트 X)
 *
 * 1차 예약정보를 수정합니다
 *
*/
router.post('/changerev1post', function (req, res, next) {
    var rev_num = req.body.rev_num;
    var vac1 = req.body.vac1;
    var vac1_hos = req.body.vac1_hos;
    var vac1_date = req.body.vac1_date;

    var data1 = [vac1_hos, vac1, vac1_date, rev_num];

    pool.getConnection(function (err, connection) {
        var sql1 = "UPDATE RESERVATION SET Hospital=?, Vaccine=?, Rdate=? WHERE Order=1 and Rnumber=?";
        connection.query(sql1, data1, function (err, result) {
            if (err) // 등록 오류
            {
                res.send({ "msg" : "DB UPDATE 오류 1"});
                console.error("err : " + err);
            }

            res.send({ "msg" : "예약 변경 완료!"});
            connection.release();
        });
    });
});


/* ===== 2차 예약정보 수정 post 처리 ===== (테스트 X)
 *
 * 2차 예약정보를 수정합니다
 *
*/
router.post('/changerev2post', function (req, res, next) {
    var rev_num = req.body.rev_num;
    var vac2 = req.body.vac2;
    var vac2_hos = req.body.vac2_hos;
    var vac2_date = req.body.vac2_date;

    var data2 = [vac2_hos, vac2, vac2_date, rev_num];

    pool.getConnection(function (err, connection) {
        var sql2 = "UPDATE RESERVATION SET Hospital=?, Vaccine=?, Rdate=? WHERE Order=2 and Rnumber=?";
        connection.query(sql2, data2, function (err, result) {
            if (err) // 등록 오류
            {
                res.send({ "msg" : "DB UPDATE 오류 2"});
                console.error("err : " + err);
            }

            res.send({ "msg" : "예약 변경 완료!"});
            connection.release();
        });
    });
});


/* ===== 예약정보 취소 처리 ===== (테스트 X)
 *
 * 1, 2차 예약정보를 모두 삭제합니다
 *
*/


module.exports = router;
