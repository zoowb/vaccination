const express = require('express');
const router = express.Router();
const jwt = require('../modules/jwt');

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


/* ===== 사전예약-본인확인 처리 =====
 *
 * 사용자 정보(이메일, 비밀번호)를 비교하고 일치하면 사전예약을 승인합니다 (+예약요일을 검증합니다)
 * 또한 인증을 완료하면 person.IsAuth를 true로 전환합니다
 *
 * === client-input ===
 * email : 사용자 아이디 [DB person.Email]
 * passwd : 사용자 아이디 [DB person.Password]
 *
 * === server-return ===
 * ok : 인증 성공시 true, 실패 시 false
 *
*/
router.post('/selfcheck', function (req, res, next) {
    var email = req.body.email;
    var pass = req.body.passwd;
    var datas = [email, pass];

    pool.getConnection(function (err, connection) {
        var sql = "set sql_safe_updates=0; UPDATE PERSON SET IsAuth=1 WHERE Email=? and Password=?";
        connection.query(sql, datas, function (err, result) {
            if (err)
            {
                res.status(500).send({ err : err });
                console.error("err : " + err);
            }

            if (result > 0) res.send({ ok : true}); // 인증 성공 (result : UPDATE 성공한 tuple 개수)
            else res.send({ ok : false});

            connection.release();
        });
    });
});


/* ===== 사전예약-예약 페이지 get 표시 =====
 *
 * 모든 주소 정보를 반환합니다
 *
 * === client-input ===
 * NONE
 *
 * === server-return ===
 * sido : 시도 코드 리스트 [{Code: 시도 코드 (정수형), SiDo: 시도명}]
 * sigungu : 시군구 코드 리스트 [{Code: 시군구 코드 (정수형), SiGunGu: 시군구명}]
 *
*/
router.get('/getloclist', function (req, res, next) {
    
    pool.getConnection(function (err, connection) {
        var sql = "SELECT * FROM SIGUNGU";
        connection.query(sql, function (err, result1) {
            if (err)
            {
                res.status(500).send({ err : "DB 오류" });
                console.error("err : " + err);
            }

            pool.getConnection(function (err, connection) {
                var sql = "SELECT * FROM SIDO";
                connection.query(sql, function (err, result2) {
                    if (err)
                    {
                        res.status(500).send({ err : "DB 오류" });
                        console.error("err : " + err);
                    }

                    res.send({ sigungu : result1, sido : result2});
                    connection.release();
                });
            });

            connection.release();
        });
    });
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

            res.send({hos_info: result}); // 검색 결과 반환
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

                    res.send({ hos_info : result[0], revp_bytime : resultg });
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
    var token = req.body.jwtToken;
    var rev_date = req.body.rev_date;
    var vac1 = req.body.vac1;
    var vac1_hos = req.body.vac1_hos;
    var vac1_date = req.body.vac1_date;
    var vac2 = req.body.vac2;
    var vac2_hos = req.body.vac2_hos;
    var vac2_date = req.body.vac2_date;

    var token_res = await jwt.verify(token); // 토큰 해독
    var rev_ssn = token_res.ssn; // 예약자 ssn

    var data1 = [vac1_hos, vac1, rev_ssn, vac1_date, 1]; // 1차 예약 데이터
    var data2 = [vac2_hos, vac2, rev_ssn, vac2_date, 2]; // 2차 예약 데이터
    var data3 = [rev_date, rev_ssn]; // 예약날짜 갱신

    pool.getConnection(function (err, connection) {
        var sql1 = "INSERT INTO RESERVATION(`Hnumber`, `Vnumber`, `Ssn`, `Rdate`, `Order`, `IsVaccine`) values(?,?,?,?,1,0);";
        connection.query(sql1, data1, function (err, result) {
            if (err)
            {
                res.status(500).send({ err : "DB 오류", ok : false });
                console.error("err : " + err);
            }

            pool.getConnection(function (err, connection) {
                var sql2 = "INSERT INTO RESERVATION(`Hnumber`, `Vnumber`, `Ssn`, `Rdate`, `Order`, `IsVaccine`) values(?,?,?,?,2,0);";
                connection.query(sql2, data2, function (err, result) {
                    if (err)
                    {
                        res.status(500).send({ err : "DB 오류", ok : false });
                        console.error("err : " + err);
                    }

                    pool.getConnection(function (err, connection) {
                        var sql3 = "UPDATE PERSON SET rday=? WHERE Ssn=?;";
                        connection.query(sql3, data3, function (err, result) {
                        if (err)
                        {
                            res.status(500).send({ err : "DB 오류", ok : false });
                            console.error("err : " + err);
                        }

                        res.send({ ok : true});
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
/*router.post('/vaccine/vaclist', function (req, res, next) {
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
/*router.post('/vaccine/search', function (req, res, next) {
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
// router.post('/vaccine/register', function (req, res, next) { } );


module.exports = router;
