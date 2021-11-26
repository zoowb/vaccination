const express = require('express');
const router = express.Router();
const pool = require('../modules/mysql');


/* ===== 기관조회 전체검색 처리 ===== (테스트 X)
 *
 * 시군구/기관명을 통해 기관을 검색합니다
 * ?? 대상 항목은 제외 가능? ??
 *
*/
router.post('/search', function (req, res, next) {
    var data = req.body.data; // 시군구주소/검색명
    var isHos = req.body.isHos; // 의원/약국 선택
    var isLoc = req.body.isLoc; // 검색모드 시군구/기관명 선택
    var data = [data];

    var sql;
    if(isLoc)
    {
        if(isHos) sql = "SELECT Hnumber, Hname, Hlocation FROM HOSPITAL, SIGUNGU WHERE Code=Sigungucode and SiGunGu=?";
        else sql = "SELECT Pnumber, Pname, Plocation FROM PHARMACY, SIGUNGU WHERE Code=Sigungucode and SiGunGu=?";
    }
    else
    {
        if(isHos) sql = "SELECT Hnumber, Hname, Hlocation FROM HOSPITAL WHERE Hname LIKE '%?%';";
        else sql = "SELECT Pnumber, Pname, Plocation FROM PHARMACY WHERE Pname LIKE '%?%';";
    }

    pool.getConnection(function (err, connection) {
        connection.query(sql, data, function (err, result) {
            if (err)
            {
                res.send({ "msg" : "검색 실패"});
                console.error("err : " + err);
            }

            res.send(result); // 검색 결과 반환
            connection.release();
        });
    });
});

/* ===== 기관조회 세부정보 처리 ===== (테스트 X)
 *
 * 기관을 클릭하면 해당 기관의 세부 정보를 반환합니다
 *
*/
router.post('/searchmore', function (req, res, next) {
    var num = req.body.num;
    var isHos = req.body.isHos; // 의원/약국 선택
    var data = [num];

    var sql; // natural join 사용 
    if(isHos) sql = "SELECT * FROM HOSPITAL NATURAL JOIN HOSPITAL_TIME, HOSPITAL_VACCINE WHERE Hnumber=?";
    else sql = "SELECT * FROM PHARMACY NATURAL JOIN PHARMACY_TIME WHERE Pnumber=?";

    pool.getConnection(function (err, connection) {
        connection.query(sql, data, function (err, result) {
            if (err)
            {
                res.send({ "msg" : "검색 실패"});
                console.error("err : " + err);
            }
            
            res.send(result[0]); // 검색 결과 반환
            connection.release();
        });
    });
});

module.exports = router;
