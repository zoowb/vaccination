const express = require('express');
const router = express.Router();

/* ===== MySQL 연동 =====
 *
 * MySQL DB와 연결합니다
 *
*/
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'covid19',
    multipleStatements: true
});

/* ===== 사전예약-본인확인 처리 ===== (테스트 X)
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

/* ===== 사전예약-예약 페이지 get 표시 ===== (테스트 X)
 *
 * 모든 주소 정보를 반환합니다
 *
*/
router.get('/select', function (req, res, next) {
    
    pool.getConnection(function (err, connection) {
        var sql = "SELECT Hnumber FROM HOSPITAL NATURAL JOIN HOSPITAL_TIME, HOSPITAL_VACCINE";
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

/* ===== 사전예약-예약 전체검색 처리 ===== (일부 테스트 X)
 *
 * 시군구/기관명을 통해 병원을 검색합니다
 *
*/
router.post('/search', function (req, res, next) {
    var data = req.body.data; // 시군구주소
    var data = [data];

    var sql = "SELECT Hnumber, Hname, Hlocation FROM HOSPITAL, SIGUNGU WHERE Code=Sigungucode and SiGunGu=?";

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

/* ===== 사전예약-예약 세부검색 get 처리 =====
 *
 * 기관을 클릭하면 해당 기관의 세부 정보를 반환합니다
 * 추가로 시간대별 예약한 인원을 같이 반환합니다 (DB에 저장된 예약 시간은 모두 이산적이라고 가정합니다)
 *
 * === client-input ===
 * idx : 병원 아이디. get 방식으로 전달 [DB hospital.hnumber]
 *
 * === server-return ===
 * hos_info : 병원 정보 [DB hospital, hospital_vaccine tuple]  // 아직 병원 time 정보는 반환하지 않습니다
 * revp_bytime : 예약인원 객체 배열 [date: 예약 날짜, time: 예약 시간, count: 예약 인원수]
 *
*/
router.get('/search/:idx', function (req, res, next) {
    var idx = req.params.idx;
    var data = [idx];

    pool.getConnection(function (err, connection) {
        var sql = "SELECT * FROM HOSPITAL NATURAL JOIN HOSPITAL_VACCINE WHERE Hnumber=?"; // 기관의 세부 정보 반환
        connection.query(sql, data, function (err, result) {
            if (err || result === undefined) // 검색 결과가 없어도 오류를 반환
            {
                res.send({ "msg" : "병원 검색 실패"});
                console.error("err : " + err);
            }

            pool.getConnection(function (err, connection) {
                var sql2 = "select left(r.Rdate, 10) as date, right(r.Rdate, 8) as time, count(*) as count "; // 시간대별 예약한 인원 그룹 반환
                sql2 += "from reservation as r, hospital as h ";
                sql2 += "where r.Hnumber = h.Hnumber and r.Hnumber = ? "
                sql2 += "group by time ";
                // sql2 += "having date = ?";
                connection.query(sql2, data, function (err, resultg) {
                    if (err)
                    {
                        res.send({ "msg" : "시간대 접종인원 그룹 검색 실패"});
                        console.error("err : " + err);
                    }

                    res.send({ hos_info : result[0], revp_bytime : resultg });
                    connection.release();
                });
            });

            connection.release();
        });
    });
});

/* ===== 사전예약-예약 처리 ===== (테스트 X)
 *
 * 새로운 예약 정보를 등록합니다
 *
*/
router.post('/select', function (req, res, next) {
    var rev_user = req.body.rev_user;
    var rev_num = req.body.rev_num;
    var rev_date = req.body.rev_date;
    var vac1 = req.body.vac1;
    var vac1_hos = req.body.vac1_hos;
    var vac1_date = req.body.vac1_date;
    var vac2 = req.body.vac2;
    var vac2_hos = req.body.vac2_hos;
    var vac2_date = req.body.vac2_date;

    var data1 = [vac1_hos, vac1, rev_user, rev_num, vac1_date, 1]; // 1차 예약 데이터
    var data2 = [vac2_hos, vac2, rev_user, rev_num, vac2_date, 2]; // 2차 예약 데이터
    var data3 = [rev_date, rev_user]; // 예약날짜 갱신

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

                    pool.getConnection(function (err, connection) {
                        var sql3 = "UPDATE PERSON SET rday=? WHERE Ssn=?;";
                        connection.query(sql3, data3, function (err, result) {
                        if (err) // 업데이트 오류
                        {
                            res.send({ "msg" : "DB UPDATE 오류 3"});
                            console.error("err : " + err);
                        }

                        res.send({ "msg" : "예약 성공!"});
                        connection.release();
                        });
                    });

                    connection.release();
                });
            });

            connection.release();
        });
    });
});

module.exports = router;
