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
 *
 * === server-return ===
 * hosList : 병원 리스트 [{Hnumber: 병원 아이디, Hname: 병원 이름, Hlocation: 병원 상세주소, x: 병원 x좌표, y: 병원 y좌표, 
    Vaccine: 보유 백신 리스트->[{Vunber: 백신아이디, Vname: 백신명, Amount: 백신 잔여량}] }]
 * 
 * ??? 예약기간 > 병원잔여백신 유통기한 사항도 고려하는가? (현재는 고려하지 않음) ???
 *
*/
router.post('/index', async function (req, res, next) {
    const token = req.body.jwtToken;
    const token_res = await jwt.verify(token); // 토큰 해독
    const ssn = token_res.ssn; // 예약자 ssn

    let err_code = 0;
    let err_msg = "";

    const connection = await pool2.getConnection(async conn => conn);
    try {
        const sql1 = "select distinct Hnumber, Hname " + 
            "from reservation natural join hospital as h, person as p " + 
            "where p.Ssn=? and sqrt(pow(p.x-h.x,2)+pow(p.y-h.y,2)) < 0.5;" // 300m 차이 -> 0.03
        const result1 = await connection.query(sql1, [ssn]);
        let packet = result1[0];
        const today = new Date();

        for(var i = 0; i < packet.length; i++) // 각 병원의 잔여백신 리스트 구하기
        {
            const sql2 = "SELECT V.Vnumber, Vname, Amount FROM hospital_vaccine natural join vaccine as V WHERE `Hnumber`=? and `Expiration` < ?;"
            const result2 = await connection.query(sql2, [packet[i].Hnumber, today]);
            const data2 = result2[0];
            packet[i].Vaccine = data2;
        }

        res.send({ hosList: packet });
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


/* ===== 잔여백신-백신선택및예약 처리 ===== (교차접종 판단X)
 *
 * 서버 '/register'와 동일한 동작을 수행합니다
 *
 * ??? 교차접종의 구체적인 판단 기준이 필요? ???
 * 
*/
// router.post('/register', function (req, res, next) { } );

module.exports = router;
