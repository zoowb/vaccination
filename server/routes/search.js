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


/* ===== 병원조회 시군구검색 처리 =====
 *
 * 시군구 코드를 통해 병원을 검색합니다
 *
 * === client-input ===
 * sigungu : 시군구 코드
 *
 * === server-return ===
 * list: 병원 정보 리스트 [{Hnumber: 병원 아이디, Hname: 병원 이름, Hlocation: 병원 상세주소}]
 *
*/
router.post('/searchHosByLoc', function (req, res, next) {
    var sigungu = req.body.sigungu;
    var sql = "SELECT Hnumber, Hname, Hlocation FROM HOSPITAL WHERE `Sigungucode`=?";

    pool.getConnection(function (err, connection) {
        connection.query(sql, [sigungu], function (err, result) {
            if (err)
            {
                res.send({ err : "DB 오류"});
                console.error("err : " + err);
            }
            res.send({list: result});
            connection.release();
        });
    });
});


/* ===== 약국조회 시군구검색 처리 =====
 *
 * 시군구 코드를 통해 약국을 검색합니다
 *
 * === client-input ===
 * sigungu : 시군구 코드
 *
 * === server-return ===
 * list: 약국 정보 리스트 [{Pnumber: 약국 아이디, Pname: 약국 이름, Plocation: 약국 상세주소}]
 *
*/
router.post('/searchPhaByLoc', function (req, res, next) {
    var sigungu = req.body.sigungu;
    var sql = "SELECT Pnumber, Pname, Plocation FROM PHARMACY WHERE `Sigungucode`=?";

    pool.getConnection(function (err, connection) {
        connection.query(sql, [sigungu], function (err, result) {
            if (err)
            {
                res.send({ err : "DB 오류"});
                console.error("err : " + err);
            }
            res.send({list: result});
            connection.release();
        });
    });
});


/* ===== 병원조회 시군구&이름검색 처리 =====
 *
 * 시군구와 이름을 통해 병원을 검색합니다
 *
 * === client-input ===
 * sigungu : 시군구 코드
 * name : 병원 검색명
 *
 * === server-return ===
 * list: 병원 정보 리스트 [{Hnumber: 병원 아이디, Hname: 병원 이름, Hlocation: 병원 상세주소}]
 *
*/
router.post('/searchHosByName', function (req, res, next) {
    var sigungu = req.body.sigungu;
    var name = req.body.name;
    var sql = "SELECT Hnumber, Hname, Hlocation FROM HOSPITAL WHERE `Sigungucode`=? and Hname LIKE ?";

    pool.getConnection(function (err, connection) {
        connection.query(sql, [sigungu, '%' + name + '%'], function (err, result) {
            if (err)
            {
                res.send({ err : "DB 오류"});
                console.error("err : " + err);
            }
            res.send({list: result});
            connection.release();
        });
    });
});


/* ===== 약국조회 시군구&이름검색 처리 =====
 *
 * 시군구와 이름을 통해 약국을 검색합니다
 *
 * === client-input ===
 * sigungu : 시군구 코드
 * name : 약국 검색명
 *
 * === server-return ===
 * list: 약국 정보 리스트 [{Pnumber: 약국 아이디, Pname: 약국 이름, Plocation: 약국 상세주소}]
 *
*/
router.post('/searchPhaByName', function (req, res, next) {
    var sigungu = req.body.sigungu;
    var name = req.body.name;
    var sql = "SELECT Pnumber, Pname, Plocation FROM PHARMACY WHERE `Sigungucode`=? and Pname LIKE ?";

    pool.getConnection(function (err, connection) {
        connection.query(sql, [sigungu, '%' + name + '%'], function (err, result) {
            if (err)
            {
                res.send({ err : "DB 오류"});
                console.error("err : " + err);
            }
            res.send({list: result});
            connection.release();
        });
    });
});


/* ===== 기관조회 세부정보 처리 ===== (일부 완성 - time 정보 반환 X)
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
 *
*/
router.post('/more', function (req, res, next) {
    var idx = req.body.idx;
    var isHos = req.body.isHos; // 의원/약국 선택

    var sql;
    if(isHos) sql = "SELECT * FROM HOSPITAL WHERE Hnumber=?";
    else sql = "SELECT * FROM PHARMACY WHERE Pnumber=?";

    pool.getConnection(function (err, connection) {
        connection.query(sql, [idx], function (err, result) {
            if (err)
            {
                res.send({ err : "DB 오류"});
                console.error("err : " + err);
            }
            
            res.send({info: result[0]});
            connection.release();
        });
    });
});

module.exports = router;