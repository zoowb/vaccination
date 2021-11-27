const express = require('express');
const router = express.Router();
const pool = require('../modules/mysql');

/* ===== 잔여백신-예약 백신테이블 처리 =====
 *
 * 잔여백신 페이지 접속 시, 백신 종류 리스트를 반환합니다
 *
 * === client-input ===
 * NONE
 *
 * === server-return ===
 * vac_list : 백신 종류 리스트 [DB vaccine tuple]
 * 
*/
/*router.post('/vaclist', function (req, res, next) {
    var sql = "SELECT * FROM vaccine;";
    var data = [];
    pool.getConnection(function (err, connection) {
        connection.query(sql, data, function (err, result) {
            if (err)
            {
                res.status(500).send({ err : err });
                console.error("err : " + err);
            }

            res.send({vac_list: result}); // 검색 결과 반환
            connection.release();
        });
    });
});*/


/* ===== 잔여백신-예약 전체검색 처리 ===== (결정사항 X)
 *
 * 시군구 코드를 통해 근처 병원 목록을 검색합니다
 *
 * === client-input ===
 * loc : 시군구 코드
 *
 * === server-return ===
 * hos_info : 병원 정보 리스트 [Hnumber: 병원 아이디, Hname: 병원 이름, Vaccine: DB hospital_vaccine tuple]
 * 
*/
/*router.post('/search', function (req, res, next) {
    var loc = req.body.data; // 시군구주소
    var datas = [loc];

    var sql = "SELECT Hnumber, Hname FROM hospital as h, sigungu as s WHERE s.Code=h.Sigungucode and s.Code=?;";
    pool.getConnection(function (err, connection) {
        connection.query(sql, datas, function (err, result) {
            if (err)
            {
                res.status(500).send({ err : err });
                console.error("err : " + err);
            }

            var packet = result;
            for(var i = 0; i < packet.length; i++)
            {
                pool.getConnection(function (err, connection) {
                    var sql2 = "SELECT Amount, Vnumber FROM hospital as h NATURAL JOIN hospital_vaccine WHERE h.Hnumber=?";
                    var datas2 = [packet[0].Hnumber];
                    connection.query(sql2, datas2, function (err, result2) {
                        if (err)
                        {
                            packet[0].Vaccine = undefined;
                            console.error("err : " + err);
                        }
                        else packet[0].Vaccine = result2; // add object property dynamically
                        console.log(packet[0].Vaccine);

                        connection.release();
                    });
                });
            }
            // 미완성 (비동기 문제)
            res.send(packet); // 검색 결과 반환
            connection.release();
        });
    });
});*/


/* ===== 잔여백신-백신선택및예약 처리 ===== (교차접종 판단X)
 *
 * 서버 '/register'와 동일한 동작을 수행합니다
 *
 * ??? 교차접종의 구체적인 판단 기준이 필요? ???
 * 
*/
// router.post('/register', function (req, res, next) { } );

module.exports = router;
