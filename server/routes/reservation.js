const express = require('express');
const router = express.Router();
const jwt = require('../modules/jwt');
const pool = require('../modules/mysql');
const pool2 = require('../modules/mysql2');
const locationList = require('../modules/locationList');

/* ===== 사전예약-본인확인 처리 =====
 *
 * 사용자 정보(이메일, 비밀번호)를 비교하고 일치하면 사전예약을 승인합니다 (+예약요일을 검증합니다)
 * 또한 인증을 완료하면 person.IsAuth를 true로 전환합니다
 *
 * === client-input ===
 * email : 사용자 아이디 [DB person.Email]
 * passwd : 사용자 패스워드 [DB person.Password]
 *
 * === server-return ===
 * ok : 인증 성공시 true, 실패 시 false
 * err : 에러 발생시 메시지 반환
 *
 *  월 - 1, 6
 *  화 - 2, 7
 *  수 - 3, 8
 *  목 - 4, 9
 *  금 - 5, 0
 *  주말 - 모두 가능
 *  ex) 990821 -> 1(월요일 신청)
 * 
*/
router.post('/selfcheck', async function (req, res, next) {
    const email = req.body.email;
    const pass = req.body.passwd;

    let err_code = 0;
    let err_msg = "";

    const connection = await pool2.getConnection(async conn => conn);
    try {
        const result1 = await connection.query("select ssn from person where Email=? and Password=?", [email, pass]);
        const data1 = result1[0];
        
        if(data1.length == 0)
        {
            err_code = 2;
            throw new Error("일치하는 회원정보가 없습니다.");
        }

        // 요일별 통과조건 결정 //
        const icon = data1[0].ssn.charAt(5);
        const today = new Date().getDay();      // 일월화수목금토 = 0123456
        let authok = false;                     // 인증 통과 조건
        if(today >= 1 && today <= 5)            // 월-금
        {
            if(icon == String(today) || icon == String((today + 5) % 10)) authok = true;
        }
        else authok = true;                     // 주말
        
        if(!authok)
        {
            err_code = 2;
            throw new Error("사전 예약 대상자가 아닙니다. 잔여백신은 당일 예약이 가능합니다.");
        }

        await connection.query("set sql_safe_updates=0; UPDATE PERSON SET IsAuth=1 WHERE Email=? and Password=?", [email, pass]);
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


/* ===== 시도 리스트 데이터 가져오기 =====
 *
 * 모든 주소 정보를 반환합니다
 *
 * === client-input ===
 * NONE
 *
 * === server-return ===
 * sido : 시도 코드 리스트 [{Code: 시도 코드, sido: 시도명}]
 *
*/
router.get('/getSidoList', async function (req, res, next) {
    const result = await locationList.GetSido();
    if(result !== undefined) res.send({ sido : result });
    else res.status(500).send({ err : "DB 오류" });
});


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
router.post("/getSigunguList", async function (req, res, next) {
    const result = await locationList.GetSigunguBySido(req.body.sido);
    if(result !== undefined) res.send({ SiGunGu : result });
    else res.status(500).send({ err : "DB 오류" });
});


/* ===== 사전예약-예약 전체검색 처리 =====
 *
 * 시군구 코드를 통해 병원 목록을 검색합니다
 *
 * === client-input ===
 * data : 시군구 코드 [DB sigungu.code]
 *
 * === server-return ===
 * hos_info : 병원 정보 리스트 [{Hnumber: 병원 아이디, Hname: 병원 이름, Hlocation: 병원 상세주소}]
 *
*/
router.post('/search', function (req, res, next) {
    var data = req.body.data; // 시군구주소
    var data = [data];

    var sql = "SELECT Hnumber, Hname, Hlocation FROM hospital as h, sigungu as s WHERE s.Code=h.Sigungucode and s.Code=?;";

    pool.getConnection(function (err, connection) {
        connection.query(sql, data, function (err, result) {
            if (err)
            {
                res.status(500).send({ err : "DB 오류" });
                console.error("err : " + err);
            }
            else res.send({hos_info: result}); // 검색 결과 반환
            connection.release();
        });
    });
});


/* ===== 사전예약-예약 세부검색 get 처리 =====  (일부 완성 - 아직 time 정보 반환 X)
 *
 * 기관을 클릭하면 해당 기관의 세부 정보를 반환합니다
 * 추가로 시간대별 예약한 인원을 같이 반환합니다 (DB에 저장된 예약 시간은 모두 이산적이라고 가정합니다)
 *
 * === client-input ===
 * idx : 병원 아이디 [DB hospital.hnumber]
 * date : 예약 날짜 문자열 (ex. "2021-10-31")
 *
 * === server-return ===
 * hos_info : 병원 정보 [{Hnumber: 병원 이름, Hlocation: 병원 상세주소, Hname: 병원 이름, Hclass: 병원 종류, 
        Other: 기타사항, Hphone: 병원 전화번호, x: 병원 x좌표, y: 병원 y좌표, Sigungucode: 시군구 코드, Sidocode: 시도 코드 }]  // 아직 병원 time 정보는 반환하지 않습니다
 * revp_bytime : 예약인원 객체 배열 [{date: 예약 날짜, time: 예약 시간, count: 해당 시간대 예약 인원수}]
 *
*/
router.get('/search/:idx/:date', function (req, res, next) {
    var idx = req.params.idx;
    var date = req.params.date;
    var data1 = [idx];
    var data2 = [idx, date];

    pool.getConnection(function (err, connection) {
        var sql = "SELECT * FROM HOSPITAL WHERE Hnumber=?"; // 기관의 세부 정보 반환
        connection.query(sql, data1, function (err, result) {
            if (err)
            {
                res.status(500).send({ err : "DB 오류" });
                console.error("err : " + err);
                connection.release();
            }
            if(result === undefined) // 검색 결과가 없어도 오류를 반환
            {
                res.status(500).send({ err : "병원 검색 실패" });
                connection.release();
            }

            pool.getConnection(function (err, connection) {
                var sql2 = "select left(r.Rdate, 10) as date, right(r.Rdate, 8) as time, count(*) as count "; // 시간대별 예약한 인원 그룹 반환
                sql2 += "from reservation as r, hospital as h ";
                sql2 += "where r.Hnumber = h.Hnumber and r.Hnumber = ? "
                sql2 += "group by time ";
                sql2 += "having date = ?";
                connection.query(sql2, data2, function (err, resultg) {
                    if (err)
                    {
                        res.status(500).send({ err : "DB 오류" });
                        console.error("err : " + err);
                    }
                    else res.send({ hos_info : result[0], revp_bytime : resultg });
                    connection.release();
                });
            });

            connection.release();
        });
    });
});


/* ===== 사전예약-예약 처리 =====
 *
 * 새로운 예약 정보를 등록합니다
 * 예약번호(Rnumber)는 DB에서 auto increment속성을 가지므로 따로 인자를 줄 필요 없습니다 (자동으로 번호가 생성됨)
 *
 * === client-input ===
 * jwtToken = 사용자 정보 jwt토큰 (로그인에서 생성된 토큰)
 * rev_date = 예약 날짜&시간 [DB person.rday] (ex. '2021-10-30 09:30:00')
 * vac1 = 1차예약 백신 고유번호 [DB reservation.Vnumber]
 * vac1_hos = 1차예약 병원 아이디 [DB reservation.Hnumber]
 * vac1_date =  1차예약 날짜&시간 [DB reservation.Rdate]
 * vac2 = 2차예약 백신 고유번호
 * vac2_hos = 2차예약 병원 아이디
 * vac2_date =  2차예약 날짜&시간
 *
 * === server-return ===
 * ok = 예약 성공시 true, 실패시 false 반환
 *
*/
router.post('/register', async function (req, res, next) {
    const token = req.body.jwtToken;
    const rev_date = req.body.rev_date;
    const vac1 = req.body.vac1;
    const vac1_hos = req.body.vac1_hos;
    const vac1_date = req.body.vac1_date;
    const vac2 = req.body.vac2;
    const vac2_hos = req.body.vac2_hos;
    const vac2_date = req.body.vac2_date;

    const token_res = await jwt.verify(token); // 토큰 해독
    const rev_ssn = token_res.ssn; // 예약자 ssn

    let err_code = 0;
    let err_msg = "";

    const connection = await pool2.getConnection(async conn => conn);
    try {
        await connection.beginTransaction(); // 트랜잭션 시작

        const data1 = [vac1_hos, vac1, rev_ssn, vac1_date, 1]; // 1차 예약 데이터
        const data2 = [vac2_hos, vac2, rev_ssn, vac2_date, 2]; // 2차 예약 데이터
        const data3 = [rev_date, rev_ssn]; // 예약날짜 갱신

        await connection.query("INSERT INTO RESERVATION(`Hnumber`, `Vnumber`, `Ssn`, `Rdate`, `Order`, `IsVaccine`) values(?,?,?,?,1,0);", data1);
        await connection.query("INSERT INTO RESERVATION(`Hnumber`, `Vnumber`, `Ssn`, `Rdate`, `Order`, `IsVaccine`) values(?,?,?,?,2,0);", data2);
        await connection.query("UPDATE PERSON SET rday=? WHERE Ssn=?;", data3);

        res.send({ ok : true });
        await connection.commit(); // 트랜잭션 성공
    }
    catch (err) {
        if(err_code != 2)
        {
            err_msg = "서버에서 오류가 발생했습니다. 예약을 할 수 없습니다.";
            console.error("err : " + err);
            throw err;
        }
        else err_msg = err.message;
        res.status(500).send({ err : err_msg, ok : false });

        await connection.rollback() // 트랜잭션 롤백
    }
    finally {
        connection.release();
    }
});

module.exports = router;
