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


/* ===== 마이페이지 입장 처리 ===== (테스트 X)
 *
 * 로그인과 동일한 동작을 수행합니다
 *
*/
router.post('/mypagecheck', function (req, res, next) {
    var email = req.body.email;
    var pass = req.body.passwd;
    var datas = [email, pass];

    pool.getConnection(function (err, connection) {
        var sql = "SELECT * FROM PERSON WHERE Email=? and Password=?;";
        connection.query(sql, datas, function (err, result) {
            if (err) console.error("err : " + err);

            if (result.length > 0) { // 인증 성공
                res.send({ "access" : true});
            }
            else { // 인증 실패
                res.send({ "access" : false});
            }
            console.log(result);

            connection.release();
        });
    });
});


/* ===== 마이페이지 처리 ===== (테스트 X)
 *
 * 클라이언트 로그인 정보를 기준으로 예약정보를 반환합니다
 *
*/
router.get('/mypage', function (req, res, next) {
    var id = req.body.id; // 로그인 정보 1 (이메일)
    var name = req.body.name; // 로그인 정보 2
    var datas = [num, name];

    pool.getConnection(function (err, connection) {
        var sql = "SELECT * FROM PERSON, RESERVATION WHERE Pssn = Ssn and Email=? and Name=?;";
        connection.query(sql, datas, function (err, result) {
            if (err) console.error("err : " + err);

            if (result.length > 0) { // 예약 정보 반환
                res.send(result);
            }
            else { 
                res.send({ "msg" : "해당 회원정보가 존재하지 않습니다" });
            }
            console.log(result);

            connection.release();
        });
    });
});

/* ===== 회원정보 수정 get 처리 ===== (테스트 X)
 *
 * 로그인 정보를 기반으로 사용자 정보를 반환합니다
 *
*/
router.get('/changeinfoget', function (req, res, next) {
    var id = req.body.id; // 로그인 정보 1 (이메일)
    var name = req.body.name; // 로그인 정보 2
    var datas = [id, name];

    pool.getConnection(function (err, connection) {
        var sql = "SELECT * FROM PERSON WHERE Email=? and Name=?;";
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


/* ===== 회원정보 수정 post 처리 ===== (테스트 X)
 *
 * 회원정보를 수정합니다
 * ?? 이메일을 아이디로 사용하는데 이메일을 수정할 수 있다?
 * -> 아이디를 주민번호로 사용하거나 이메일을 수정불가로 처리해야 함 ??
 * ?? 알람기능을 데이터로 사용하려면 DB에 추가로 저장해야 함 ??
 *
*/
router.post('/changeinfopost', function (req, res, next) {
    var ssn = req.body.ssn;
    var phone = req.body.tel;
    var email = req.body.email;
    var pass = req.body.passwd;
    var location = req.body.location;
    var datas = [phone, email, pass, location, ssn];

    pool.getConnection(function (err, connection) {
        var sql = "UPDATE PERSON SET Phone=?, Email=?, Password=?, Location=? WHERE Ssn=?;";
        connection.query(sql, datas, function (err, rows) {
            if (err) // 회원가입 오류
            {
                res.send({ "msg" : "변경 실패!"});
                console.error("err : " + err);
            }

            res.send({ "msg" : "변경 성공!"});
            connection.release();
        });
    });
});


/* ===== 예약정보 수정 get 처리 ===== (테스트 X)
 *
 * 로그인 정보를 기반으로 1, 2차 예약정보 정보를 반환합니다
 *
*/
router.get('/changerevget', function (req, res, next) {
    var id = req.body.id; // 로그인 정보 1 (이메일)
    var name = req.body.name; // 로그인 정보 2
    var datas = [id, name];

    pool.getConnection(function (err, connection) {
        var sql = "SELECT * FROM PERSON, RESERVATION WHERE Pssn = Ssn and Email=? and Name=?;";
        connection.query(sql, datas, function (err, result) {
            if (err) console.error("err : " + err);

            if (result.length > 0) { // 예약 정보 반환
                res.send(result);
            }
            else { 
                res.send({ "msg" : "예약정보가 존재하지 않습니다" });
            }
            console.log(result);

            connection.release();
        });
    });
});


/* ===== 1차 예약정보 수정 post 처리 ===== (테스트 X)
 *
 * 1차 예약정보를 수정합니다
 *
*/
router.post('/changerev1post', function (req, res, next) {
    var rev_num = req.body.rev_num;
    var vac1 = req.body.vac1;
    var vac1_hos = req.body.vac1_hos;
    var vac1_date = req.body.vac1_date;

    var data1 = [vac1_hos, vac1, vac1_date, rev_num];

    pool.getConnection(function (err, connection) {
        var sql1 = "UPDATE RESERVATION SET Hospital=?, Vaccine=?, Rdate=? WHERE Order=1 and Rnumber=?";
        connection.query(sql1, data1, function (err, result) {
            if (err) // 등록 오류
            {
                res.send({ "msg" : "DB UPDATE 오류 1"});
                console.error("err : " + err);
            }

            res.send({ "msg" : "예약 변경 완료!"});
            connection.release();
        });
    });
});

/* ===== 2차 예약정보 수정 post 처리 ===== (테스트 X)
 *
 * 2차 예약정보를 수정합니다
 *
*/
router.post('/changerev2post', function (req, res, next) {
    var rev_num = req.body.rev_num;
    var vac2 = req.body.vac2;
    var vac2_hos = req.body.vac2_hos;
    var vac2_date = req.body.vac2_date;

    var data2 = [vac2_hos, vac2, vac2_date, rev_num];

    pool.getConnection(function (err, connection) {
        var sql2 = "UPDATE RESERVATION SET Hospital=?, Vaccine=?, Rdate=? WHERE Order=2 and Rnumber=?";
        connection.query(sql2, data2, function (err, result) {
            if (err) // 등록 오류
            {
                res.send({ "msg" : "DB UPDATE 오류 2"});
                console.error("err : " + err);
            }

            res.send({ "msg" : "예약 변경 완료!"});
            connection.release();
        });
    });
});


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
