const express = require('express');
const router = express.Router();
const pool = require('../modules/mysql');
const pool2 = require('../modules/mysql2');
const jwt = require('../modules/jwt');


/* ===== 잔여백신 페이지 입장 처리 =====
 *
 * 잔여백신 페이지 접속 시, 사용자 근처에 있는 병원을 반환합니다 (사용자(x, y) 기준 300m 이내)
 * 추가로 백신 종류 리스트를 반환합니다 (유통기한이 지난 백신은 반영되지 않음)
 *
 * === client-input ===
 * jwtToken = 사용자 정보 jwt토큰 (로그인에서 생성된 토큰)
 * ??? flist = 백신 필터링 조건 리스트 (출력하려면 true, 아니면 false) ??? -> 미정
    (list index: Pfizer-0, Morderna-1, AstraZeneca-2, Janssen-3)
 *
 * === server-return ===
 * hosList : 병원 리스트 [{Hnumber: 병원 아이디, Hname: 병원 이름, Hlocation: 병원 상세주소, x: 병원 x좌표, y: 병원 y좌표, 
    Vaccine: 보유 백신 리스트->[{Vunber: 백신아이디, Vname: 백신명, Amount: 백신 잔여량}] }]
 * pos : 사용자 위치정보 [{x: 사용자 x좌표, y: 사용자 y좌표, loc: 사용자 상세주소}]
 * 
*/
router.post('/index', async function (req, res, next) {
    const token = req.body.jwtToken;
    const flist = req.body.flist;

    const token_res = await jwt.verify(token); // 토큰 해독
    const ssn = token_res.ssn; // 예약자 ssn

    let err_code = 0;
    let err_msg = "";

    const connection = await pool2.getConnection(async conn => conn);
    try {
        /*const sql1 = "select distinct h.Hnumber, Hname " + 
            "from reservation as r, hospital as h, person as p " + 
            "where h.Hnumber=r.Hnumber and p.Ssn=r.Ssn and p.Ssn=?";// and sqrt(pow(p.x-h.x,2)+pow(p.y-h.y,2)) < 2;"*/
        const sql1 = "select distinct h.Hnumber, Hname from hospital as h where " + 
            "sqrt(pow((select x from person where Ssn=?)-h.x,2)+pow((select y from person where Ssn=?)-h.y,2)) < 50;"; // 300m 차이 -> 0.03
        const result1 = await connection.query(sql1, [ssn, ssn]);
        let packet = result1[0];

        const today = new Date();
        for(var i = 0; i < packet.length; i++) // 각 병원의 잔여백신 리스트 구하기
        {
            const sql2 = "SELECT V.Vnumber, Vname, Amount FROM hospital_vaccine natural join vaccine as V WHERE `Hnumber`=? and `Expiration` > ? order by V.Vnumber;"
            const result2 = await connection.query(sql2, [packet[i].Hnumber, today]);
            const data2 = result2[0];
            packet[i].Vaccine = data2;
        }

        const sql3 = "select x, y, Location as loc from person where Ssn=?"
        const result3 = await connection.query(sql3, [ssn]);
        const data3 = result3[0];

        // console.log(packet);

        /*const li = [0, 1, 1, 1];
        function isApple(element)  {
            if(((li[0] && element.Vnumber == 10) ||
               (li[1] && element.Vnumber == 20) ||
               (li[2] && element.Vnumber == 30) ||
               (li[3] && element.Vnumber == 40)) && element.Amount > 0)  {
                return true;
            }
        }
        for(var i = 0; i < packet.length; i++) // 화이자를 가진 병원만 출력
        {
            if(packet[i].Vaccine.some(isApple))
                console.log(packet[i]);
        }*/

        res.send({ hosList: packet, pos: data3 });
    }
    catch (err) {
        if(err_code != 2)
        {
            err_msg = "DB 오류";
            console.error("err : " + err);
            throw err;
        }
        else err_msg = err.message;
        res.status(500).send({ err : err_msg });
    }
    finally {
        connection.release();
    }
});


/* ===== 잔여백신-백신선택및예약 처리 =====
 *
 * 서버 '/register'와 동일한 동작을 수행합니다
 * 
*/
// router.post('/register', function (req, res, next) { } );

module.exports = router;
