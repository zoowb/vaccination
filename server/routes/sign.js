const express = require('express');
const router = express.Router();
const jwt = require('../modules/jwt');
const pool = require('../modules/mysql');
const pool2 = require('../modules/mysql2');


/* ===== 로그인 페이지 처리 =====
 *
 * 사용자 정보(이메일, 비밀번호)를 비교합니다
 * 정보 일치시, 로그인을 승인하고 토큰을 반환합니다
 *
 * === client-input ===
 * email = 사용자 아이디
 * passwd = 사용자 비밀번호
 *
 * === server-return ===
 * ok = 회원가입 성공 여부. 성공 시 true, 실패 시 false
 * jwtToken = jwt토큰 문자열
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
            else
            {
                var check = true; // 로그인 조건 검사
                if(result.length <= 0) check = false;

                if(check) // 로그인 성공
                {
                    const jwtToken = await jwt.sign({id : result[0].Email, ssn : result[0].Ssn, name : result[0].Name}); // 토큰 생성
                    res.send({ "ok" : true, "jwtToken" : jwtToken.token });
                }
                else res.status(500).send({ "ok" : false, err : "일치하는 회원정보가 없습니다" });
            }
           
            connection.release();
        });
    });
});


/* ===== 회원가입 페이지 처리 =====
 *
 * 새로운 사용자 정보를 등록합니다. 추가로 나이를 계산합니다 (세는나이)
 * (아이디와 주민번호가 중복되면 가입 불가)
 *
 * === client-input ===
 * name = 이름
 * ssn = 주민번호
 * tel = 전화번호
 * email = 아이디
 * passwd = 비밀번호
 * location = 상세주소
 * sido = 시도명 (코드 X)
 * sigungu = 시군구명 (코드 X)
 * x = 주소 x좌표
 * y = 주소 y좌표
 *
 * === server-return ===
 * ok = 회원가입 성공 여부. 성공 시 true 반환
 *
*/
router.post('/signup', async function (req, res, next) {
    var name = req.body.name;
    var ssn = req.body.ssn;
    var phone = req.body.tel;
    var email = req.body.email;
    var pass = req.body.passwd;
    var location = req.body.location;
    var sido = req.body.sido;
    var sigungu = req.body.sigungu;
    var x = req.body.x;
    var y = req.body.y;
    
    let err_code = 0;
    let err_msg = "";

    const connection = await pool2.getConnection(async conn => conn);
    try {
        const result1 = await connection.query("select * from person where Email=?", [email]);
        const data1 = result1[0];
        if(data1.length > 0)
        {
            err_code = 2;
            throw new Error("아이디가 중복되었습니다.");
        }

        const result2 = await connection.query("select * from person where Ssn=?", [ssn]);
        const data2 = result2[0];
        if(data2.length > 0)
        {
            err_code = 2;
            throw new Error("주민번호가 중복되었습니다.");
        }

        const sql3 = "select G.`sido`, G.`Code` from `sigungu` as G " + 
            "where G.`sido`=(select D.`Code` from `sido` as D where D.`Sido` like ?) and G.`SiGunGu` like ?;"
        const result3 = await connection.query(sql3, ['%'+sido+'%', '%'+sigungu+'%']);
        const data3 = result3[0];
        if(data3.length == 0)
        {
            err_code = 2;
            throw new Error("지역코드 로드 실패");
        }

        const isAfter2000 = Number(ssn.substring(7, 8));
        const year = (new Date).getFullYear();
        const ycon = isAfter2000 <= 2 ? 1900 : 2000;
        const age = year - (Number(ssn.substring(0, 2)) + ycon) + 1;

        const dataset = [name, ssn, phone, email, pass, location, data3[0].sido, data3[0].Code, x, y, age, 0]
        await connection.query("INSERT INTO PERSON(Name, Ssn, Phone, Email, Password, Location, Sido, Sigungu, x, y, age, isAuth) values(?,?,?,?,?,?,?,?,?,?,?,?)", dataset);
        res.send({ok: true});
    }
    catch (err) {
        if(err_code != 2)
        {
            err_msg = "서버에서 오류가 발생했습니다.";
            console.error("err : " + err);
            throw err;
        }
        else err_msg = err.message;
        res.status(500).send({ err : err_msg, ok: false });
    }
    finally {
        connection.release();
    }
});


/* ===== 아이디 찾기 페이지 처리 =====
 *
 * 사용자 정보(이름, 주민번호)를 비교하고 일치하면 아이디(이메일)을 반환합니다
 * 사용자를 찾지 못하면 null을 반환합니다
 *
 * === client-input ===
 * name = 사용자 이름
 * ssn = 사용자 주민번호
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
            else
            {
                if (result.length > 0) res.send({ id : result[0].Email });
                else res.status(500).send({ err : "일치하는 회원정보가 없습니다", id : null });
            }

            connection.release();
        });
    });
});


/* ===== 비밀번호 찾기 페이지 처리 =====
 *
 * 사용자 정보(이름, 아이디)를 비교하고 일치하면 패스워드를 반환합니다
 *
 * === client-input ===
 * name = 사용자 이름
 * email = 사용자 아이디
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
            else
            {
                if (result.length > 0) res.send({ passwd : result[0].Password });
                else res.status(500).send({ err : "일치하는 회원정보가 없습니다", passwd : null });
            }
            
            connection.release();
        });
    });
});


module.exports = router;
