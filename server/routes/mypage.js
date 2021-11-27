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
        else
        {
            if (result.length > 0) { // 예약 정보 반환
                res.send({
                    Name: result[0].Name,
                    Ssn: result[0].Ssn,
                    Phone: result[0].Phone,
                    Email: result[0].Email,
                    Password: result[0].Password,
                    Location: result[0].Location
                });
                console.log(result);
            }
            else res.send({ err : "해당 회원정보가 존재하지 않습니다." });
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
            else
            {
                if(rows.affectedRows > 0) res.send({ ok : true});
                else res.send({ err : "회원정보가 없습니다.", ok : false});
            }
            
            connection.release();
        });
    });
});


/* ===== 예약정보 수정 미리보기 처리 =====
 *
 * 로그인 정보를 기반으로 1, 2차 예약정보 정보를 반환합니다
 *
 * === client-input ===
 * jwtToken = 사용자 정보 jwt토큰 (로그인에서 생성된 토큰)
 *
 * === server-return ===
 * rev_name = 예약자명
 * rev1_num = 1차예약 번호
 * rev1_vacid = 1차예약 백신 아이디
 * rev1_hosid = 1차예약 병원 아이디
 * rev1_vacname = 1차예약 백신 이름
 * rev1_hosname = 1차예약 병원 이름
 * rev1_date =  1차예약 날짜&시간
 * rev2_num = 2차예약 번호
 * rev2_vacid = 1차예약 백신 아이디
 * rev2_hosid = 1차예약 병원 아이디
 * rev2_vacname = 1차예약 백신 이름
 * rev2_hosname = 1차예약 병원 이름
 * rev2_date =  2차예약 날짜&시간
 *
 * ??? 예약 정보가 여러 가지인 경우도 고려하는가? (ex. 1차 예약이 2번 존재함) -> 없다고 가정 ???
 * ??? 1차만 예약되는 경우가 존재하는가? -> 없다고 가정 ???
 *
*/
router.post('/getrev', async function (req, res, next) {
    const token = req.body.jwtToken; // 토큰은 post로만 처리 가능
    const token_res = await jwt.verify(token); // 토큰 해독
    const ssn = token_res.ssn;

    let err_code = 0;
    let err_msg = "";

    const connection = await pool2.getConnection(async conn => conn);
    try {
        const result1 = await connection.query("SELECT Rnumber, Name, Vnumber, Hnumber, Rdate FROM PERSON natural join RESERVATION WHERE `Ssn`=? and `Order`=1;", [ssn]);
        const data1 = result1[0];
        const result2 = await connection.query("SELECT Rnumber, Vnumber, Hnumber, Rdate FROM PERSON natural join RESERVATION WHERE `Ssn`=? and `Order`=2;", [ssn]);
        const data2 = result2[0];

        if(data1.length == 0 || data2.length == 0)
        {
            err_code = 2;
            throw new Error("일치하는 예약정보가 없습니다.");
        }

        const result3 = await connection.query("SELECT Hname FROM hospital WHERE `Hnumber`=?;", [data1[0].Hnumber]);
        const data3 = result3[0];
        const result4 = await connection.query("SELECT Hname FROM hospital WHERE `Hnumber`=?;", [data2[0].Hnumber]);
        const data4 = result4[0];

        if(data3.length == 0 || data4.length == 0)
        {
            err_code = 2;
            throw new Error("예약병원 정보가 존재하지 않습니다.");
        }

        const result5 = await connection.query("SELECT Vname FROM vaccine WHERE `Vnumber`=?;", [data1[0].Vnumber]);
        const data5 = result5[0];
        const result6 = await connection.query("SELECT Vname FROM vaccine WHERE `Vnumber`=?;", [data2[0].Vnumber]);
        const data6 = result6[0];

        if(data5.length == 0 || data6.length == 0)
        {
            err_code = 2;
            throw new Error("예약백신 정보가 존재하지 않습니다.");
        }

        const packet = {
            rev_name: data1[0].Name,
            rev1_num: data1[0].Rnumber,
            rev1_vacid: data1[0].Vnumber,
            rev1_hosid: data1[0].Hnumber,
            rev1_vacname: data5[0].Vname,
            rev1_hosname: data3[0].Hname,
            rev1_date: data1[0].Rdate,
            rev2_num: data2[0].Rnumber,
            rev2_vacid: data2[0].Vnumber,
            rev2_hosid: data2[0].Hnumber,
            rev2_vacname: data6[0].Vname,
            rev2_hosname: data4[0].Hname,
            rev2_date: data2[0].Rdate
        }
        res.send(packet);
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
        res.status(500).send({ err : err_msg });
    }
    finally {
        connection.release();
    }
});


/* ===== 예약정보 수정 처리 =====
 *
 * 1차, 2차 예약정보를 수정합니다. (예약 번호만으로도 예약 차수를 식별할 수 있습니다)
 *
 * === client-input ===
 * rev_num = 예약 번호 (int)
 * rev_date = 예약 날짜
 * rev_vac = 예약 백신 아이디
 * rev_hos = 예약 병원 아이디
 *
 * === server-return ===
 * ok = 예약 변경 성공시 true 반환
 *
 * ??? 구체적인 접종방법? -> 예약을 수정하려면 클라에서 백신, 병원 아이디를 보내주어야 함.. ??? 
 *
*/
router.post('/changerev', function (req, res, next) {
    var rev_num = req.body.rev_num;
    var rev_vac = req.body.rev_vac;
    var rev_hos = req.body.rev_hos;
    var rev_date = req.body.rev_date;

    pool.getConnection(function (err, connection) {
        var sql = "UPDATE RESERVATION SET Hnumber=?, Vnumber=?, Rdate=? WHERE Rnumber=?";
        connection.query(sql, [rev_hos, rev_vac, rev_date, rev_num], function (err, result) {
            if (err) // 등록 오류
            {
                res.send({ err : "DB 오류"});
                console.error("err : " + err);
            }
            else
            {
                if(result.affectedRows > 0) res.send({ ok : true });
                else res.send({ err : "등록된 정보가 없습니다.", ok : false});
            }
            connection.release();
        });
    });
});


/* ===== 예약정보 취소 처리 =====
 *
 * 1, 2차 예약정보를 모두 삭제합니다
 * 1차 and 2차 예약 날짜가 현재 날짜의 1일전이면 모두 취소가 불가합니다
 *
 * === client-input ===
 * rev1_num = 1차 예약 번호
 * rev2_num = 2차 예약 번호
 *
 * === server-return ===
 * ok = 예약 변경 성공시 true 반환
 *
*/
router.post('/delrev', async function (req, res, next) {
    const rev1_num = req.body.rev1_num;
    const rev2_num = req.body.rev2_num;

    let err_code = 0;
    let err_msg = "";

    const connection = await pool2.getConnection(async conn => conn);
    try {
        const result1 = await connection.query("SELECT Rdate FROM RESERVATION WHERE `Rnumber`=?;", [rev1_num]);
        const data1 = result1[0];
        const result2 = await connection.query("SELECT Rdate FROM RESERVATION WHERE `Rnumber`=?;", [rev2_num]);
        const data2 = result2[0];

        if(data1.length == 0 || data2.length == 0)
        {
            err_code = 2;
            throw new Error("일치하는 예약정보가 없습니다.");
        }

        const rday1 = new Date(data1[0].Rdate);
        const rday2 = new Date(data2[0].Rdate);
        let now = new Date();
        now.setDate(now.getDate()-1);

        if(rday1 >= now)
        {
            err_code = 2;
            throw new Error("1차 접종 하루 전에는 예약을 취소할 수 없습니다.");
        }
        if(rday2 >= now)
        {
            err_code = 2;
            throw new Error("2차 접종 하루 전에는 예약을 취소할 수 없습니다.");
        }

        await connection.query("delete from `reservation` where `Rnumber` in(?,?)", [rev1_num, rev2_num]);
        res.send({ok: true});
    }
    catch (err) {
        if(err_code != 2)
        {
            err_msg = "서버에서 오류가 발생했습니다.";
            console.error("err : " + err);
            throw err;
        }
        else err_msg = err.message;
        res.status(500).send({ err : err_msg, ok: false });
    }
    finally {
        connection.release();
    }
});


module.exports = router;
