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
 * jwtToken : 로그인 토큰
 * passwd : 사용자 패스워드
 *
 * === server-return ===
 * ok : 인증 성공시 true, 실패 시 false
 * err : 에러 발생시 메시지 반환
 *
*/
router.post('/check', async function (req, res, next) {
    const token = req.body.jwtToken;
    const email = req.body.email;
    const pass = req.body.passwd;

    const token_res = await jwt.verify(token); // 토큰 해독
    const ssn = token_res.ssn; // ssn

    let err_code = 0;
    let err_msg = "";

    const connection = await pool2.getConnection(async conn => conn);
    try {
        const result1 = await connection.query("SELECT * FROM PERSON WHERE Ssn=? and Password=?;", [ssn, pass]);
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
 * Sido = 시도명
 * Sigungu = 시군구명
 * err : 에러 발생시 메시지 반환
 *
*/
router.post('/getinfo', async function (req, res, next) {
    var token = req.body.jwtToken; // 토큰은 post로만 처리 가능
    var token_res = await jwt.verify(token); // 토큰 해독

    var sql = "select `Name`, `Ssn`, `Phone`, `Email`, `Password`, `Location`, D.`Sido`, G.`Sigungu` " + 
        "from person P, sigungu G, sido D WHERE P.`sigungu`=G.`Code` and P.`sido`=D.`Code` and email=?;"
    pool.query(sql, [token_res.id], function (err, result) {
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
                    Location: result[0].Location,
                    Sido: result[0].Sido,
                    Sigungu: result[0].Sigungu
                });
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
 * sido = 시도명 (코드 X) (ex. "경기")
 * sigungu = 시군구명 (코드 X) (ex. "일산서구")
 * x = 주소 x좌표
 * y = 주소 y좌표
 *
 * === server-return ===
 * ok : 성공 여부. 변경 완료 시 true
 * err : 에러 발생시 메시지 반환
 *
*/
router.post('/changeinfo', async function (req, res, next) {
    var ssn = req.body.ssn;
    var phone = req.body.tel;
    var pass = req.body.passwd;
    var location = req.body.location;
    var sido = req.body.sido;
    var sigungu = req.body.sigungu;
    var x = req.body.x;
    var y = req.body.y;

    let err_code = 0;
    let err_msg = "";
    
    const connection = await pool2.getConnection(async conn => conn);
    try {
        const sql1 = "select G.`sido`, G.`Code` from `sigungu` as G " + 
            "where G.`sido`=(select D.`Code` from `sido` as D where D.`Sido` like ?) and G.`SiGunGu` like ?;"
        const result1 = await connection.query(sql1, ['%'+sido+'%', '%'+sigungu+'%']);
        const data1 = result1[0];
        if(data1.length == 0)
        {
            err_code = 2;
            throw new Error("지역코드 로드 실패");
        }

        const dataset = [phone, pass, location, data1[0].sido, data1[0].Code, x, y, ssn];
        const result2 = await connection.query("UPDATE PERSON SET Phone=?, Password=?, Location=?, Sido=?, Sigungu=?, x=?, y=? WHERE Ssn=?;", dataset);
        const data2 = result2[0];

        if(data2.affectedRows == 0)
        {
            err_code = 2;
            throw new Error("회원정보가 존재하지 않습니다.");
        }

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


/* ===== 예약정보 수정 미리보기 처리 =====
 *
 * 로그인 정보를 기반으로 1, 2차 예약정보 정보를 반환합니다
 *
 * === client-input ===
 * jwtToken = 사용자 정보 jwt토큰 (로그인에서 생성된 토큰)
 *
 * === server-return ===
 * name = 예약자명
 * idx = 예약 번호
 * vacid = 예약 백신 아이디
 * hosid = 예약 병원 아이디
 * vacname = 예약 백신 이름
 * hosname = 예약 병원 이름
 * date1 =  1차예약 날짜&시간
 * date2 =  2차예약 날짜&시간
 * isvaccine =  실제 접종유무 (0 = 접종X, 1 = 1차접종완료, 2 = 2차접종완료)
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
        const result1 = await connection.query("select Rnumber, `Name`, Vnumber, Hnumber, Rdate1, Rdate2, IsVaccine FROM PERSON natural join RESERVATION WHERE `Ssn`=?;", [ssn]);
        const data1 = result1[0];

        if(data1.length == 0)
        {
            err_code = 2;
            throw new Error("일치하는 예약정보가 없습니다.");
        }

        const result3 = await connection.query("SELECT Hname FROM hospital WHERE `Hnumber`=?;", [data1[0].Hnumber]);
        const data3 = result3[0];

        if(data3.length == 0)
        {
            err_code = 2;
            throw new Error("예약병원 정보가 존재하지 않습니다.");
        }

        const result5 = await connection.query("SELECT Vname FROM vaccine WHERE `Vnumber`=?;", [data1[0].Vnumber]);
        const data5 = result5[0];

        if(data5.length == 0)
        {
            err_code = 2;
            throw new Error("예약백신 정보가 존재하지 않습니다.");
        }

        const packet = {
            name: data1[0].Name,
            idx: data1[0].Rnumber,
            vacid: data1[0].Vnumber,
            hosid: data1[0].Hnumber,
            vacname: data5[0].Vname,
            hosname: data3[0].Hname,
            date1: data1[0].Rdate1,
            date2: data1[0].Rdate2,
            isvaccine: data1[0].IsVaccine
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


/* ===== 예약정보 수정 처리 ===== (해당 페이지는 사용되지 않습니다 -> reservation/register와 통합됨)
 *
 * 1차, 2차 예약정보를 수정합니다
 *
 * === client-input ===
 * rev_num = 예약 번호 (int)
 * rev_date = 1차예약 날짜&시간
 * rev_vac = 예약 백신 아이디
 * rev_hos = 예약 병원 아이디
 *
 * === server-return ===
 * ok = 예약 변경 성공시 true 반환
 *
*/
/*router.post('/changerev', function (req, res, next) {
    var rev_num = req.body.rev_num;
    var rev_vac = req.body.rev_vac;
    var rev_hos = req.body.rev_hos;
    var rev_date = req.body.rev_date;

    const rev_date2 = new Date(rev_date);
    rev_date2.setDate(rev_date2.getDate() + 28);

    pool.getConnection(function (err, connection) {
        var sql = "UPDATE RESERVATION SET Hnumber=?, Vnumber=?, Rdate1=?, Rdate2=? WHERE Rnumber=?";
        connection.query(sql, [rev_hos, rev_vac, rev_date, rev_date2, rev_num], function (err, result) {
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
});*/


/* ===== 예약정보 취소 처리 =====
 *
 * 1, 2차 예약정보를 모두 삭제합니다
 * 1차, 2차 예약 날짜가 현재 날짜의 1일전이면 취소가 불가합니다
 *
 * === client-input ===
 * rev_num = 예약 번호
 *
 * === server-return ===
 * ok = 예약 변경 성공시 true 반환
 *
*/
router.post('/delrev', async function (req, res, next) {
    const rev_num = req.body.rev_num;

    let err_code = 0;
    let err_msg = "";

    const connection = await pool2.getConnection(async conn => conn);
    try {
        const result1 = await connection.query("SELECT Rdate1, Rdate2 FROM RESERVATION WHERE `Rnumber`=?;", [rev_num]);
        const data1 = result1[0];

        if(data1.length == 0)
        {
            err_code = 2;
            throw new Error("일치하는 예약정보가 없습니다.");
        }

        const rday1 = new Date(data1[0].Rdate1);
        const rday2 = new Date(data1[0].Rdate2);
        const now = new Date();
        rday1.setDate(rday1.getDate()-1);
        rday2.setDate(rday2.getDate()-1);

        if(now > rday1)
        {
            err_code = 2;
            throw new Error("1차 접종 하루 전에는 예약을 취소할 수 없습니다.");
        }
        if(now > rday2)
        {
            err_code = 2;
            throw new Error("2차 접종 하루 전에는 예약을 취소할 수 없습니다.");
        }

        await connection.query("delete from `reservation` where `Rnumber` in(?)", [rev_num]);
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
