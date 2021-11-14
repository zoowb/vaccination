var express = require('express');
var router = express.Router();

/* ===== MySQL 연동 =====
 *
 * MySQL DB와 연결합니다
 *
*/
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'vaccine',
    multipleStatements: true
});

/* ===== 사전예약-본인확인 처리 =====
 *
 * 사용자 정보(이메일, 비밀번호)를 비교하고 일치하면 사전예약을 승인합니다
 * 또한 인증을 완료하면 PERSON.IsAuth를 true로 전환합니다
 * ??? 사전예약이 가능한 요일인지 여부 -> 자세한 조건 필요 ???
 *
*/
router.post('/selfcheck', function (req, res, next) {
    var email = req.body.email;
    var pass = req.body.passwd;
    var datas = [email, pass];

    pool.getConnection(function (err, connection) {
        var sql = "UPDATE PERSON SET IsAuth=1 WHERE Email=? and Password=?";
        connection.query(sql, datas, function (err, result) {
            if (err) console.error("err : " + err);

            if (result > 0) { // 인증 성공 (result : UPDATE 성공한 tuple 개수)
                res.send({ "msg" : "본인인증 성공"});
            }
            else { // 인증 실패
                res.send({ "msg" : "본인인증 실패" });
            }
            console.log(result);

            connection.release();
        });
    });
});

/* ===== 사전예약-예약 표시 =====
 *
 * 모든 병원 정보를 반환합니다 (시간, 잔여백신 정보 포함)
 *
*/
router.get('/select', function (req, res, next) {
    
    pool.getConnection(function (err, connection) {
        var sql = "SELECT * FROM HOSPITAL NATURAL JOIN HOSPITAL_TIME, HOSPITAL_VACCINE";
        connection.query(sql, function (err, result) {
            if (err)
            {
                res.send({ "msg" : "DB 오류"});
                console.error("err : " + err);
            }

            res.send(result); // 모든 병원 tuple을 클라이언트로 전달합니다
            connection.release();
        });
    });
});

/* ===== 사전예약-예약 처리 =====
 *
 * 새로운 예약 정보를 등록합니다
 * ??? 예약 날짜를 추가로 저장하려면 PERSON에 column을 새로 만들어야 함 (일단은 적용하지 않은 상태) ???
*/
router.post('/select', function (req, res, next) {
    var rev_user = req.body.rev_user;
    var rev_num = req.body.rev_num;
    var rev_date = req.body.rev_date; // ??? 아직 추가 안됨 ???
    var vac1 = req.body.vac1;
    var vac1_hos = req.body.vac1_hos;
    var vac1_date = req.body.vac1_date;
    var vac2 = req.body.vac2;
    var vac2_hos = req.body.vac2_hos;
    var vac2_date = req.body.vac2_date;

    var data1 = [vac1_hos, vac1, rev_user, rev_num, vac1_date, 1];
    var data2 = [vac2_hos, vac2, rev_user, rev_num, vac2_date, 2];

    pool.getConnection(function (err, connection) {
        var sql1 = "INSERT INTO RESERVATION(Hospital, Vaccine, Pssn, Rnumber, Rdate, Order) values(?,?,?,?,?,?)";
        connection.query(sql1, data1, function (err, result) {
            if (err) // 등록 오류
            {
                res.send({ "msg" : "DB INSERT 오류 1"});
                console.error("err : " + err);
            }

            pool.getConnection(function (err, connection) {
                var sql2 = "INSERT INTO RESERVATION(Hospital, Vaccine, Pssn, Rnumber, Rdate, Order) values(?,?,?,?,?,?)";
                connection.query(sql2, data2, function (err, result) {
                    if (err) // 등록 오류
                    {
                        res.send({ "msg" : "DB INSERT 오류 2"});
                        console.error("err : " + err);
                    }

                    res.send({ "msg" : "예약 성공!"});
                    connection.release();
                });
            });

            connection.release();
        });
    });
});

module.exports = router;
