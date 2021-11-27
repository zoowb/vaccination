const express = require('express');
const router = express.Router();
const jwt = require('../modules/jwt');
const pool = require('../modules/mysql');

/* ===== 로그인 페이지 처리 =====
 *
 * 사용자 정보(이메일, 비밀번호)를 비교합니다
 * 정보 일치시, 로그인을 승인하고 토큰을 반환합니다
 *
 * === client-input ===
 * email = 사용자 아이디 [DB person.email]
 * passwd = 사용자 비밀번호 [DB person.password]
 *
 * === server-return ===
 * ok = 회원가입 성공 여부. 성공 시 true, 실패 시 false
 * jwtToken = jwt토큰 문자열 (로그인 실패시 토큰이 생성되지 않습니다. null을 전송합니다)
 *
*/
router.post('/login', function (req, res, next) {
    var email = req.body.email;
    var pass = req.body.passwd;
    var datas = [email, pass];
    
    pool.getConnection(function (err, connection) {
        var sql = "SELECT * FROM PERSON WHERE Email=? and Password=?;";
        connection.query(sql, datas, async function (err, result) {
            if (err)
            {
                res.status(500).send({ err : "DB 오류" });
                console.error("err : " + err);
            }

            var check = true; // 로그인 조건 검사
            if(result.length <= 0) check = false;

            if(check) // 로그인 성공
            {
                const jwtToken = await jwt.sign({id : result[0].Email, ssn : result[0].Ssn, name : result[0].Name}); // 토큰 생성
                res.send({ "ok" : true, "jwtToken" : jwtToken.token });
            }
            else res.send({ "ok" : false, "jwtToken" : null, err : "일치하는 회원정보가 없습니다" });

            connection.release();
        });
    });
});


/* ===== 회원가입 페이지 처리 =====
 *
 * 새로운 사용자 정보를 등록합니다 (+아이디, 주민번호 중복 검사)
 *
 * === client-input ===
 * name = 사용자 이름 [DB person.name]
 * ssn = 사용자 주민번호 [DB person.ssn]
 * tel = 사용자 전화번호 [DB person.phone]
 * email = 사용자 아이디 [DB person.email]
 * passwd = 사용자 비밀번호 [DB person.password]
 * location = 사용자 거주지 주소 [DB person.location]
 *
 * === server-return ===
 * ok = 회원가입 성공 여부. 성공 시 true 반환
 *
*/
router.post('/signup', function (req, res, next) {
    var name = req.body.name;
    var ssn = req.body.ssn;
    var phone = req.body.tel;
    var email = req.body.email;
    var pass = req.body.passwd;
    var location = req.body.location;
    var datas = [name, ssn, phone, email, pass, location];

    var erridd = 0;
    var errssnd = 0;
    
    pool.getConnection(function (err, connection) {
        var sql = "select * from person where Email=?";
        connection.query(sql, [email], function (err, rows) {
            if (err)
            {
                res.status(500).send({ err : "DB 오류", ok : false });
                console.error("err : " + err);
            }
            if(rows.length > 0) erridd = 1;

            pool.getConnection(function (err, connection) {
                var sql = "select * from person where Ssn=?";
                connection.query(sql, [ssn], function (err, rows) {
                    if (err)
                    {
                        res.status(500).send({ err : "DB 오류", ok : false });
                        console.error("err : " + err);
                    }
                    if(rows.length > 0) errssnd = 1;

                    if(erridd == 1) res.status(500).send({ err : "아이디가 중복되었습니다", ok : false });
                    else if(errssnd == 1) res.status(500).send({ err : "주민번호 중복되었습니다", ok : false });
                    else
                    {
                        pool.getConnection(function (err, connection) {
                            var sql = "INSERT INTO PERSON(Name, Ssn, Phone, Email, Password, Location) values(?,?,?,?,?,?)";
                            connection.query(sql, datas, function (err, rows) {
                                if (err)
                                {
                                    res.status(500).send({ err : "DB 오류", ok : false });
                                    console.error("err : " + err);
                                }
                                else res.send({ ok : true });
                                connection.release();
                            });
                        });
                    }

                    connection.release();
                });
            });

            connection.release();
        });
    });
});


/* ===== 아이디 찾기 페이지 처리 =====
 *
 * 사용자 정보(이름, 주민번호)를 비교하고 일치하면 아이디(이메일)을 반환합니다
 * 사용자를 찾지 못하면 null을 반환합니다
 *
 * === client-input ===
 * name = 사용자 이름 [DB person.name]
 * ssn = 사용자 주민번호 [DB person.ssn]
 *
 * === server-return ===
 * id = 사용자 아이디(이메일). 검색 실패시 null 반환
 *
*/
router.post('/findID', function (req, res, next) {
    var name = req.body.name;
    var ssn = req.body.ssn;
    var datas = [name, ssn];

    pool.getConnection(function (err, connection) {
        var sql = "SELECT * FROM PERSON WHERE Name=? and Ssn=?;";
        connection.query(sql, datas, function (err, result) {
            if (err)
            {
                res.status(500).send({ err : "DB 오류" });
                console.error("err : " + err);
            }

            if (result.length > 0) res.send({ id : result[0].Email });
            else res.send({ err : "일치하는 회원정보가 없습니다", id : null });

            connection.release();
        });
    });
});


/* ===== 비밀번호 찾기 페이지 처리 =====
 *
 * 사용자 정보(이름, 아이디)를 비교하고 일치하면 패스워드를 반환합니다
 *
 * === client-input ===
 * name = 사용자 이름 [DB person.name]
 * email = 사용자 아이디 [DB person.email]
 *
 * === server-return ===
 * passwd = 사용자 비밀번호. 검색 실패시 null 반환
 * 
*/
router.post('/findPW', function (req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var datas = [name, email];

    pool.getConnection(function (err, connection) {
        var sql = "SELECT * FROM PERSON WHERE Name=? and Email=?;";
        connection.query(sql, datas, function (err, result) {
            if (err)
            {
                res.status(500).send({ err : "DB 오류" });
                console.error("err : " + err);
            }

            if (result.length > 0) res.send({ passwd : result[0].Password });
            else res.send({ err : "일치하는 회원정보가 없습니다", passwd : null });

            connection.release();
        });
    });
});


module.exports = router;
