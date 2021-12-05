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
 * flist = 백신 필터링 조건 리스트 (출력하려면 true, 아니면 false)
    (ex. [0, 1, 0, 0])
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
        const sql0 = "select x, y, Location as loc from person where Ssn=?"; // x, y 좌표 구하기
        const result0 = await connection.query(sql0, [ssn]);
        const data0 = result0[0];

        const sql1 = "select distinct h.Hnumber, Hname from hospital as h where sqrt(pow(?-h.x,2)+pow(?-h.y,2)) < 0.03;"; // 300m 차이 -> 0.03
        const result1 = await connection.query(sql1, [data0[0].x, data0[0].y]); // 거리 내 있는 병원 구하기
        let data1 = result1[0];

        const today = new Date();
        for(var i = 0; i < data1.length; i++) // 각 병원의 잔여백신 리스트 구하기
        {
            const sql2 = "SELECT V.Vnumber, Vname, Amount FROM hospital_vaccine natural join vaccine as V WHERE `Hnumber`=? and `Expiration` > ? order by V.Vnumber;"
            const result2 = await connection.query(sql2, [data1[i].Hnumber, today]);
            const data2 = result2[0];
            data1[i].Vaccine = data2;
        }

        const li = flist; // 필터 리스트
        const packet = [];
        function isApple(element)  {
            if(((li[0] && element.Vnumber == 10) ||
               (li[1] && element.Vnumber == 20) ||
               (li[2] && element.Vnumber == 30) ||
               (li[3] && element.Vnumber == 40)) && element.Amount > 0)  {
                return true;
            }
        }
        for(var i = 0; i < data1.length; i++) // 병원 필터링
        {
            if(data1[i].Vaccine.some(isApple))
                packet.push(data1[i]);
        }

        res.send({ hosList: packet, pos: data0 });
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


/* ===== 잔여백신예약-예약 처리 =====
 *
 * 새로운 예약 정보를 등록합니다 (예약수정 기능 없음)
 * 예약번호(Rnumber)는 DB에서 auto increment속성을 가지므로 따로 인자를 줄 필요 없습니다 (자동으로 번호가 생성됨)
 * 백신 선택은 클라이언트에서 가능하며, 1차예약날짜는 현재 날짜입니다.
 * 백신 잔여량이 0이 되면, 해당 tuple을 삭제합니다
 * 만약 이미 등록된 예약정보가 있으면, 해당 정보를 수정합니다
 *
 * === client-input ===
 * jwtToken = 사용자 정보 jwt토큰 (로그인에서 생성된 토큰)
 * rev_hos = 예약 병원 아이디
 * rev_vacname = 백신 이름
 *
 * === server-return ===
 * rev_date1 = 1차예약 날짜&시간 (문자열, new Date(rev_date1)로 원래 시간 데이터로 변환 가능)
 * rev_date2 = 2차예약 날짜&시간
 *
*/
router.post('/register', async function (req, res, next) {
    const token = req.body.jwtToken;
    const rev_hos = req.body.rev_hos;
    const rev_vacname = req.body.rev_vacname;

    const token_res = await jwt.verify(token); // 토큰 해독
    const rev_ssn = token_res.ssn; // 예약자 ssn
    const rev_startdate = new Date();
    
    let err_code = 0;
    let err_msg = "";
    const connection = await pool2.getConnection(async conn => conn);
    try {
        await connection.beginTransaction(); // 트랜잭션 시작
        const rev_date = new Date();
        
        const sql0 = "select Vnumber from vaccine where Vname=?;";
        const result0 = await connection.query(sql0, [rev_vacname]);
        const data0 = result0[0];
        const rev_vacid = data0[0].Vnumber;

        const sql1 = "select HV.Vnumber, Amount from hospital_vaccine as HV, " + 
            "vaccine as V where HV.Vnumber=V.Vnumber and HV.Vnumber=? and " + 
            "HV.`Expiration` > ? and HV.`Amount` > 0 and V.`AgeCont` < (select age from person where Ssn=?);";
        const result1 = await connection.query(sql1, [rev_vacid, rev_date, rev_ssn]);
        const data1 = result1[0];
        const rev_vac = data1[0];

        if(data1.length == 0)
        {
            err_code = 2;
            throw new Error("해당 백신은 조건에 맞지 않아 접종하실 수 없습니다.");
        }

        // 이하 트랜잭션 과정은 reservation/register와 동일
        const rev_date2 = new Date(rev_date.getTime());
        rev_date2.setDate(rev_date2.getDate() + 28);
        const revcon = [rev_hos, rev_vacid, rev_date, rev_date2, rev_ssn];

        const sql2 = "select * from reservation where Ssn=?";
        const result2 = await connection.query(sql2, [rev_ssn]);
        const data2 = result2[0];
        if(data2.length == 0) // 새로운 예약 등록
            await connection.query("INSERT INTO RESERVATION(`Hnumber`, `Vnumber`, `Rdate1`, `Rdate2`, `Ssn`, `IsVaccine`) values(?,?,?,?,?,0);", revcon);
        else // 예약수정 불가
        {
            err_code = 2;
            throw new Error("이미 등록된 예약이 존재합니다.");
        }

        if(rev_vac.Amount > 1) // 잔여백신이 2 이상이면 1 감소시킴. 아니면 삭제
            await connection.query("update hospital_vaccine SET Amount=Amount-1 WHERE Hnumber=? and Vnumber=?", [rev_hos, rev_vacid]);
        else
            await connection.query("delete from hospital_vaccine WHERE Hnumber=? and Vnumber=?", [rev_hos, rev_vacid]);
        
        res.send({ rev_date2 : rev_date2, rev_date1 : rev_date });
        console.log({ rev_date2 : rev_date2, rev_date1 : rev_date });
        await connection.commit(); // 트랜잭션 성공
    }
    catch (err) {
        if(err_code != 2)
        {
            err_msg = "서버 오류";
            console.error("err : " + err);
            throw err;
        }
        else err_msg = err.message;
        res.status(500).send({ err : err_msg, ok : false });

        await connection.rollback() // 트랜잭션 롤백
    }
    finally {
        connection.release();
    }
});


module.exports = router;
