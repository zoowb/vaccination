const express = require('express');
const router = express.Router();
const jwt = require('../modules/jwt');
const pool = require('../modules/mysql');
const pool2 = require('../modules/mysql2');


/* ===== 홈페이지 데이터 처리 =====
 *
 * 홈페이지의 시각 데이터에 필요한 데이터를 반환합니다
 *
 * === client-input ===
 * NONE
 *
 * === server-return ===
 * person_all: 전체 인원수 (가입자 명수) {count: 인원수}
 * person_vac1: 1차 접종자 명수 {count: 인원수}
 * person_vac2: 2차 접종자 명수 {count: 인원수}
 * byMonth_vac1: 월별 1차 누적 접종자 [{year: 연도, month: 월, count: 인원수}]
 * byMonth_vac2: 월별 2차 누적 접종자 [{year: 연도, month: 월, count: 인원수}]
 * byWeek_vac1: 주별 1차 누적 접종자 [{start: 주 시작일, end: 주 끝일, count: 인원수}] // 주 시작 = 월요일
 * byWeek_vac2: 주별 2차 누적 접종자 [{start: 주 시작일, end: 주 끝일, count: 인원수}]
 * byDay_vac1: 일별 1차 누적 접종자 [{year: 연도, month: 월, day: 일, count: 인원수}]
 * byDay_vac2: 일별 2차 누적 접종자 [{year: 연도, month: 월, day: 일, count: 인원수}]
 * byLoc_vac1: 지역별 1차 접종자 [{sido_code: 시도코드, sido_name: 시도명, count: 인원수}] // 분류기준 = 시도코드
 * byLoc_vac2: 지역별 2차 접종자 [{sido_code: 시도코드, sido_name: 시도명, count: 인원수}]
 * byAge_vac1: 연령별 1차 접종자 [{ages: 연령대, count: 인원수}]
 * byAge_vac2: 연령별 2차 접종자 [{ages: 연령대, count: 인원수}]
 *
*/
router.post('/index', async function (req, res, next) {
    let err_code = 0;
    let err_msg = "";

    const connection = await pool2.getConnection(async conn => conn);
    try {
        const result1 = await connection.query("select count(Ssn) as `count` from person;");
        const person_all = result1[0];
        const result2 = await connection.query("select count(Ssn) as `count` from person natural join reservation where IsVaccine=1;");
        const person_vac1 = result2[0];
        const result3 = await connection.query("select count(Ssn) as `count` from person natural join reservation where IsVaccine=2;");
        const person_vac2 = result3[0];

        const sqlmonth1 = "select YEAR(Rdate1) as `year`, Month(Rdate1) as `month`, count(Ssn) as `count` " + 
            "from person natural join reservation where IsVaccine=? group by `year`, `month` order by `year`, `month`;"
        const sqlmonth2 = "select YEAR(Rdate2) as `year`, Month(Rdate2) as `month`, count(Ssn) as `count` " + 
            "from person natural join reservation where IsVaccine=? group by `year`, `month` order by `year`, `month`;"
        const result4 = await connection.query(sqlmonth1, [1]);
        const byMonth_vac1 = result4[0];
        const result5 = await connection.query(sqlmonth2, [2]);
        const byMonth_vac2 = result5[0];

        const sqlweek1 = "select DATE_FORMAT(DATE_SUB(`Rdate1`, INTERVAL (DAYOFWEEK(`Rdate1`)-2) DAY), '%Y/%m/%d') as `start`, " + 
            "DATE_FORMAT(DATE_SUB(`Rdate1`, INTERVAL (DAYOFWEEK(`Rdate1`)-8) DAY), '%Y/%m/%d') as `end`, count(Ssn) as count " + 
            "from person natural join reservation where IsVaccine=? group by `start` order by `start`;"
        const sqlweek2 = "select DATE_FORMAT(DATE_SUB(`Rdate2`, INTERVAL (DAYOFWEEK(`Rdate2`)-2) DAY), '%Y/%m/%d') as `start`, " + 
            "DATE_FORMAT(DATE_SUB(`Rdate2`, INTERVAL (DAYOFWEEK(`Rdate2`)-8) DAY), '%Y/%m/%d') as `end`, count(Ssn) as count " + 
            "from person natural join reservation where IsVaccine=? group by `start` order by `start`;"
        const result6 = await connection.query(sqlweek1, [1]);
        const byWeek_vac1 = result6[0];
        const result7 = await connection.query(sqlweek2, [2]);
        const byWeek_vac2 = result7[0];

        const sqlday1 = "select YEAR(Rdate1) as `year`, Month(Rdate1) as `month`, Day(Rdate1) as `day`, count(Ssn) as `count` " + 
            "from person natural join reservation where IsVaccine=? group by `year`, `month`, `day` order by `year`, `month`, `day`;"
        const sqlday2 = "select YEAR(Rdate2) as `year`, Month(Rdate2) as `month`, Day(Rdate2) as `day`, count(Ssn) as `count` " + 
            "from person natural join reservation where IsVaccine=? group by `year`, `month`, `day` order by `year`, `month`, `day`;"
        const result8 = await connection.query(sqlday1, [1]);
        const byDay_vac1 = result8[0];
        const result9 = await connection.query(sqlday2, [2]);
        const byDay_vac2 = result9[0];

        const sqlLoc = "select `Code` as `sido_code`, S.`Sido` as `sido_name`, count(P.`Ssn`) as `count` from person as P, reservation as R, sido as S " + 
            "where P.`Ssn`=R.`Ssn` and P.`Sido`=S.`Code` and `IsVaccine`=? group by `Code` order by `Code`;"
        const result10 = await connection.query(sqlLoc, [1]);
        const byLoc_vac1 = result10[0];
        const result11 = await connection.query(sqlLoc, [2]);
        const byLoc_vac2 = result11[0];

        const sqlAge = "select floor(Age / 10)*10 as `ages`, count(Ssn) as `count` from person natural join reservation " + 
            "where IsVaccine=? group by `ages` order by `ages`;"
        const result12 = await connection.query(sqlAge, [1]);
        const byAge_vac1 = result12[0];
        const result13 = await connection.query(sqlAge, [2]);
        const byAge_vac2 = result13[0];

        const packet = {
            person_all: person_all,
            person_vac1: person_vac1,
            person_vac2: person_vac2,
            byMonth_vac1: byMonth_vac1,
            byMonth_vac2: byMonth_vac2,
            byWeek_vac1: byWeek_vac1,
            byWeek_vac2: byWeek_vac2,
            byDay_vac1: byDay_vac1,
            byDay_vac2: byDay_vac2,
            byLoc_vac1: byLoc_vac1,
            byLoc_vac2: byLoc_vac2,
            byAge_vac1: byAge_vac1,
            byAge_vac2: byAge_vac2
        }
        res.send(packet);
    }
    catch (err) {
        if(err_code != 2)
        {
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


/* ===== 간편조회 처리 =====
 *
 * 예약번호로 예약 정보를 검색합니다
 *
 * === client-input ===
 * idx : 예약 번호 (정수형)
 *
 * === server-return ===
 * rev_name = 예약자명
 * rev_vacname = 예약 백신 이름
 * rev_hosname = 예약 병원 이름
 * rev_date1 = 예약 날짜&시간
 * rev_date2 = 예약 날짜&시간
 *
*/
router.post('/quicklook', async function (req, res, next) {
    var idx = req.body.idx;

    let err_code = 0;
    let err_msg = "";

    const connection = await pool2.getConnection(async conn => conn);
    try {
        const result1 = await connection.query("SELECT Rnumber, Name, Vnumber, Hnumber, Rdate1, Rdate2 FROM PERSON natural join RESERVATION WHERE `Rnumber`=?;", [idx]);
        const data1 = result1[0];

        if(data1.length == 0)
        {
            err_code = 2;
            throw new Error("일치하는 예약정보가 없습니다.");
        }

        const result2 = await connection.query("SELECT Hname FROM hospital WHERE `Hnumber`=?;", [data1[0].Hnumber]);
        const data2 = result2[0];

        if(data2.length == 0)
        {
            err_code = 2;
            throw new Error("예약병원 정보가 존재하지 않습니다.");
        }

        const result3 = await connection.query("SELECT Vname FROM vaccine WHERE `Vnumber`=?;", [data1[0].Vnumber]);
        const data3 = result3[0];

        if(data3.length == 0)
        {
            err_code = 2;
            throw new Error("예약백신 정보가 존재하지 않습니다.");
        }

        const packet = {
            rev_name: data1[0].Name,
            rev_vacname: data3[0].Vname,
            rev_hosname: data2[0].Hname,
            rev_date1: data1[0].Rdate1,
            rev_date2: data1[0].Rdate2
        }
        res.send(packet);
    }
    catch (err) {
        if(err_code != 2)
        {
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

module.exports = router;
