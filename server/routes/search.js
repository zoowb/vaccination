const express = require('express');
const router = express.Router();
const pool = require('../modules/mysql');
const pool2 = require('../modules/mysql2');
const locationList = require('../modules/locationList');


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


/* ===== 기관조회 검색 처리 =====
 *
 * 시군구와 이름을 통해 기관을 검색합니다
 *
 * === client-input ===
 * sigungu : 시군구 코드
 * name : 기관 검색명
 * isHos : 병원/약국 선택. true면 병원, false면 약국 검색
 *
 * === server-return ===
 * list: 병원 정보 리스트 [{Hnumber: 병원 아이디, Hname: 병원 이름, Hlocation: 병원 상세주소}]
 *
*/
router.post('/search', function (req, res, next) {
    var sigungu = req.body.sigungu;
    var name = req.body.name;
    var isHos = req.body.isHos; // 의원/약국 선택

    var sql;
    if(isHos) sql = "SELECT Hnumber, Hname, Hlocation FROM HOSPITAL WHERE `Sigungucode`=? and Hname LIKE ?;";
    else sql = "SELECT Pnumber, Pname, Plocation FROM PHARMACY WHERE `Sigungucode`=? and Pname LIKE ?;";

    pool.getConnection(function (err, connection) {
        connection.query(sql, [sigungu, '%' + name + '%'], function (err, result) {
            if (err)
            {
                res.send({ err : "DB 오류"});
                console.error("err : " + err);
            }
            else res.send({list: result});
            connection.release();
        });
    });
});


/* ===== 기관조회 세부정보 처리 =====
 *
 * 기관을 클릭하면 해당 기관의 세부 정보를 반환합니다
 *
 * === client-input ===
 * idx : 병원 아이디
 * isHos : 병원/약국 선택. true면 병원, false면 약국 검색
 *
 * === server-return ===
 * if isHos = true,
 *  info : 병원 정보 [{Hnumber: 병원 이름, Hlocation: 병원 상세주소, Hname: 병원 이름, Hclass: 병원 종류, 
        Other: 기타사항, Hphone: 병원 전화번호, x: 병원 x좌표, y: 병원 y좌표, Sigungucode: 시군구 코드, Sidocode: 시도 코드 }]  // 아직 병원 time 정보는 반환하지 않습니다
 * if isHos = false,
 *  info : 약국 정보 [{Pnumber: 약국 이름, Plocation: 약국 상세주소, Pname: 약국 이름,
        Pphone: 약국 전화번호, x: 약국 x좌표, y: 약국 y좌표, Sigungucode: 시군구 코드, Sidocode: 시도 코드 }]  // 아직 약국 time 정보는 반환하지 않습니다
 * 이하는 isHos 무관하게 반환->
 * timeinfo : 병원/약국 운영 시간 정보 [{Number: 기관 아이디, Start_Mon: 월요일 운영시작 시간, Close_Mon: 월요일 운영종료 시간,
    Start_Tue, Close_Tue, Start_Wed, Close_Wed, Start_Thu, Close_Thu, Start_Fri, Close_Fri, Start_Sat, Close_Sat, Start_Sun, Close_Sun: 화-일 운영시작/종료 시간
    IsOpenHoliday: 공휴일 운영시간 (시간타입X, 문자열), Lunch_Week: 점심시간 (시간타입X, 문자열)}]
 *
*/
router.post('/more', async function (req, res, next) {
    var idx = req.body.idx;
    var isHos = req.body.isHos; // 의원/약국 선택

    let err_code = 0;
    let err_msg = "";

    const connection = await pool2.getConnection(async conn => conn);
    try {
        var sql1;
        if(isHos) sql1 = "SELECT * FROM HOSPITAL WHERE Hnumber=?";
        else sql1 = "SELECT * FROM PHARMACY WHERE Pnumber=?";
        const result1 = await connection.query(sql1, [idx]);
        const data1 = result1[0];

        var sql2;
        if(isHos) sql2 = "select * from hospital_time where `Number`=?;";
        else sql2 = "select * from pharmacy_time WHERE Pnumber=?";
        const result2 = await connection.query(sql2, [idx]);
        const data2 = result2[0];

        res.send({ info : data1, timeinfo: data2 });
    }
    catch (err) {
        if(err_code != 2)
        {
            err_msg = "서버 오류";
            console.error("err : " + err);
            throw err;
        }
        else err_msg = err.message;
        res.status(500).send({ err : err_msg, ok : false });
    }
    finally {
        connection.release();
    }
});

module.exports = router;
