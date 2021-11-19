var express = require("express");
var router = express.Router();

/* ===== MySQL 연동 =====
 *
 * MySQL DB와 연결합니다
 *
 */
var mysql = require("mysql");
var pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  password: "*",
  database: "covid19",
  multipleStatements: true,
});

/* ===== 로그인 페이지 처리 =====
 *
 * 사용자 정보(이메일, 비밀번호)를 비교하고 일치하면 로그인을 승인합니다
 *
 */
router.post("/login", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );

  var email = req.body.email;
  var pass = req.body.passwd;
  var datas = [email, pass];

  pool.getConnection(function (err, connection) {
    var sql = "SELECT * FROM PERSON WHERE Email=? and Password=?;";
    connection.query(sql, datas, function (err, result) {
      if (err) console.error("err : " + err);

      if (result.length > 0) {
        // 로그인 성공
        res.send({ msg: "로그인 성공! " + result[0].Name + "님, 환영합니다!" });
      } else {
        // 로그인 실패
        res.send({ msg: "아이디 또는 비밀번호가 잘못되었습니다" });
      }
      console.log(result);

      connection.release();
    });
  });
});

/* ===== 회원가입 페이지 처리 =====
 *
 * 새로운 사용자 정보를 등록합니다
 *
 */
router.post("/signup", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  res.header("Access-Control-Allow-Credentials", true);
  var name = req.body.name;
  var ssn = req.body.ssn;
  var phone = req.body.tel;
  var email = req.body.email;
  var pass = req.body.passwd;
  var location = req.body.location;
  var datas = [name, ssn, phone, email, pass, location];

  pool.getConnection(function (err, connection) {
    var sql =
      "INSERT INTO PERSON(Name, Ssn, Phone, Email, Password, Location) values(?,?,?,?,?,?)";
    connection.query(sql, datas, function (err, rows) {
      if (err) {
        // 회원가입 오류
        res.send({
          msg: "회원정보를 등록할 수 없습니다. 이미 등록된 아이디가 있는지 확인하세요!",
        });
        console.error("err : " + err);
      }

      res.send({ msg: "회원가입 성공!" });
      connection.release();
    });
  });
});

/* ===== 아이디 찾기 페이지 처리 =====
 *
 * 사용자 정보(이름, 주민번호)를 비교하고 일치하면 아이디(이메일)을 반환합니다
 *
 */
router.post("/findID", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  var name = req.body.name;
  var ssn = req.body.ssn;
  var datas = [name, ssn];

  pool.getConnection(function (err, connection) {
    var sql = "SELECT * FROM PERSON WHERE Name=? and Ssn=?;";
    connection.query(sql, datas, function (err, result) {
      if (err) console.error("err : " + err);

      if (result.length > 0) {
        // 아이디 찾기 성공
        res.send({
          msg: result[0].Name + "님의 아이디는 " + result[0].Email + "입니다.",
        });
      } else {
        // 아이디 찾기 실패
        res.send({ msg: "일치하는 회원정보가 없습니다!" });
      }
      console.log(result);

      connection.release();
    });
  });
});

/* ===== 비밀번호 찾기 페이지 처리 =====
 *
 * 사용자 정보(이름, 아이디)를 비교하고 일치하면 패스워드를 반환합니다
 *
 */
router.post("/findPW", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  var name = req.body.name;
  var email = req.body.email;
  var datas = [name, email];

  pool.getConnection(function (err, connection) {
    var sql = "SELECT * FROM PERSON WHERE Name=? and Email=?;";
    connection.query(sql, datas, function (err, result) {
      if (err) console.error("err : " + err);

      if (result.length > 0) {
        // 비밀번호 찾기 성공
        res.send({
          msg:
            result[0].Name +
            "님의 패스워드는 " +
            result[0].Password +
            "입니다.",
        });
      } else {
        // 비밀번호 찾기 실패
        res.send({ msg: "일치하는 회원정보가 없습니다!" });
      }
      console.log(result);

      connection.release();
    });
  });
});

module.exports = router;
