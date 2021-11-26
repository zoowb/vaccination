const express = require('express');
const router = express.Router();
const jwt = require('../modules/jwt');
const pool = require('../modules/mysql');

/* ===== 간편조회 처리 ===== (테스트 X)
 *
 * 예약번호와 이름을 통해 예약 정보를 조회합니다
 *
*/
router.post('/quicklook', function (req, res, next) {
    var num = req.body.num;
    var name = req.body.name;
    var datas = [num, name];

    pool.getConnection(function (err, connection) {
        var sql = "SELECT * FROM PERSON, RESERVATION WHERE Pssn = Ssn and Pssn=? and Name=?;";
        connection.query(sql, datas, function (err, result) {
            if (err) console.error("err : " + err);

            if (result.length > 0) { // 예약 정보 반환
                res.send(result[0]);
            }
            else { 
                res.send({ "msg" : "해당 회원정보가 존재하지 않습니다" });
            }
            console.log(result);

            connection.release();
        });
    });
});

module.exports = router;
