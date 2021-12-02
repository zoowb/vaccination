const express = require('express');
const router = express.Router();
const jwt = require('../modules/jwt');
const pool = require('../modules/mysql');
const pool2 = require('../modules/mysql2');
const locationList = require('../modules/locationList');

/* ===== 사전예약-본인확인 처리 =====
 *
 * 사용자 정보(이메일, 비밀번호)를 비교하고 일치하면 사전예약을 승인합니다 (+예약요일을 검증합니다)
 * 또한 인증을 완료하면 person.IsAuth를 true로 전환합니다
 *
 * === client-input ===
 * email : 사용자 아이디 [DB person.Email]
 * passwd : 사용자 패스워드 [DB person.Password]
 *
 * === server-return ===
 * ok : 인증 성공시 true, 실패 시 false
 * err : 에러 발생시 메시지 반환
 *
 *  월 - 1, 6
 *  화 - 2, 7
 *  수 - 3, 8
 *  목 - 4, 9
 *  금 - 5, 0
 *  주말 - 모두 가능
 *  ex) 990821 -> 1(월요일 신청)
 * 
*/
router.post('/selfcheck', async function (req, res, next) {
    const email = req.body.email;
    const pass = req.body.passwd;

    let err_code = 0;
    let err_msg = "";

    const connection = await pool2.getConnection(async conn => conn);
    try {
        const result1 = await connection.query("select ssn from person where Email=? and Password=?", [email, pass]);
        const data1 = result1[0];
        
        if(data1.length == 0)
        {
            err_code = 2;
            throw new Error("일치하는 회원정보가 없습니다.");
        }

        // 요일별 통과조건 결정 //
        const icon = data1[0].ssn.charAt(5);
        const today = new Date().getDay();      // 일월화수목금토 = 0123456
        let authok = false;                     // 인증 통과 조건
        if(today >= 1 && today <= 5)            // 월-금
        {
            if(icon == String(today) || icon == String((today + 5) % 10)) authok = true;
        }
        else authok = true;                     // 주말
        
        if(!authok)
        {
            err_code = 2;
            throw new Error("사전 예약 대상자가 아닙니다. 잔여백신은 당일 예약이 가능합니다.");
        }

        await connection.query("set sql_safe_updates=0; UPDATE PERSON SET IsAuth=1 WHERE Email=? and Password=?", [email, pass]);
    }
    catch (err) {
        if(err_code < 2)
        {
            err_code = 1;
            err_msg = "서버에서 오류가 발생했습니다.";
            console.error("err : " + err);
            throw err;
        }
        else err_msg = err.message;
    }
    finally {
        if(err_code == 0) res.send({ ok : true });
        else res.status(500).send({ err : err_msg, ok : false });
        connection.release();
    }
});


/* ===== 시도 리스트 데이터 가져오기 =====
 *
 * 모든 주소 정보를 반환합니다
 *
 * === client-input ===
 * NONE
 *
 * === server-return ===
 * sido : 시도 코드 리스트 [{Code: 시도 코드, sido: 시도명}]
 *
*/
router.get('/getSidoList', async function (req, res, next) {
    const result = await locationList.GetSido();
    if(result !== undefined) res.send({ sido : result });
    else res.status(500).send({ err : "DB 오류" });
});


/* ===== 시군구 리스트 데이터 가져오기 =====
 *
 * 시도에 포함되는 시군구 목록을 가져옵니다
 *
 * === client-input ===
 * sido : 시도 코드 (int)
 *
 * === server-return ===
 * SiGunGu : 시군구 코드 리스트 [{Code: 시군구 코드, SiGunGu: 시군구명}]
 *
*/
router.post("/getSigunguList", async function (req, res, next) {
    const result = await locationList.GetSigunguBySido(req.body.sido);
    if(result !== undefined) res.send({ SiGunGu : result });
    else res.status(500).send({ err : "DB 오류" });
});


/* ===== 사전예약-예약 전체검색 처리 =====
 *
 * 시군구 코드를 통해 예약이 가능한 병원 목록을 검색합니다
 * (조건 1: 예약날짜 기준, 유통기한이 남은 잔여백신 > 0)
 * (조건 2: 조건 1을 만족하는 백신이 접종자 신체조건을 만족함)
 *
 * === client-input ===
 * jwtToken = 사용자 정보 jwt토큰 (로그인에서 생성된 토큰)
 * data : 시군구 코드
 * rev_date : 예약 날짜 문자열 (ex. "2021-10-31")
 *
 * === server-return ===
 * hos_info : 병원 정보 리스트 [{Hnumber: 병원 아이디, Hname: 병원 이름, Hlocation: 병원 상세주소}]
 *
*/
router.post('/search', async function (req, res, next) {
    const token = req.body.jwtToken;
    const data = req.body.data; // 시군구주소
    const rev_date = req.body.rev_date;

    const token_res = await jwt.verify(token); // 토큰 해독
    const ssn = token_res.ssn; // 예약자 ssn

    var sql = "select distinct H.Hnumber, Hname, Hlocation from hospital as H, hospital_vaccine as HV, " + 
        "vaccine as V where H.Hnumber=HV.Hnumber and HV.Vnumber=V.Vnumber and H.Sigungucode=? and " + 
        "HV.`Expiration` > ? and HV.`Amount` > 0 and V.`AgeCont` < (select age from person where Ssn=?);";

    pool.getConnection(function (err, connection) {
        connection.query(sql, [data, rev_date, ssn], function (err, result) {
            if (err)
            {
                res.status(500).send({ err : "DB 오류" });
                console.error("err : " + err);
            }
            else res.send({hos_info: result}); // 검색 결과 반환
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
 * idx : 병원 아이디 [DB hospital.hnumber]
 * date : 예약 날짜 (문자열) (ex. "2021-10-31")
 *
 * === server-return ===
 * hos_info : 병원 정보 [{Hnumber: 병원 이름, Hlocation: 병원 상세주소, Hname: 병원 이름, Hclass: 병원 종류, 
        Other: 기타사항, Hphone: 병원 전화번호, x: 병원 x좌표, y: 병원 y좌표, Sigungucode: 시군구 코드, Sidocode: 시도 코드 }]
 * revp_bytime : 예약인원 객체 배열 [{time: 예약 시간 (문자열 -> new Date()로 변환 가능) count: 해당 시간대 예약 인원수}]
 * hos_timeinfo : 병원 시간 정보 [{Number: 병원 아이디, Start_Mon: 월요일 운영시작 시간, Close_Mon: 월요일 운영종료 시간,
    Start_Tue, Close_Tue, Start_Wed, Close_Wed, Start_Thu, Close_Thu, Start_Fri, Close_Fri, Start_Sat, Close_Sat, Start_Sun, Close_Sun: 화-일 운영시작/종료 시간
    IsOpenHoliday: 공휴일 운영시간 (시간타입X, 문자열), Lunch_Week: 점심시간 (시간타입X, 문자열)}]
 *
*/
router.get('/search/:idx/:date', async function (req, res, next) {
    var idx = req.params.idx;
    var date = req.params.date;

    let err_code = 0;
    let err_msg = "";

    const connection = await pool2.getConnection(async conn => conn);
    try {
        const sql1 = "SELECT * FROM HOSPITAL WHERE Hnumber=?"; // 기관의 세부 정보 반환
        const result1 = await connection.query(sql1, [idx]);
        const data1 = result1[0];

        if(data1.length == 0) // 검색 결과가 없어도 오류를 반환
        {
            res.status(500).send({ err : "병원 검색 실패" });
            connection.release();
        }

        const sql2 = "select left(rl.Rdate, 10) as date, right(rl.Rdate, 8) as time, count(*) as count " +
            "from reservation_list as rl, hospital as h " +
            "where rl.Hnumber = h.Hnumber and rl.Hnumber = ? " +
            "group by date, time " +
            "having date = ? order by date, time;";
        const result2 = await connection.query(sql2, [idx, date]);
        const data2 = result2[0];

        // const sql3 = "select * from hospital_time where `Number`=?;";
        const sql3 = "select h.Hnumber, ifnull(ht.Start_Mon, 900) as Start_Mon, ifnull(ht.Close_Mon, 1800) as Close_Mon, " + 
            "ifnull(ht.Start_Tue, 900) as Start_Tue, ifnull(ht.Close_Tue, 1800) as Close_Tue, ifnull(ht.Start_Wed, 900) as Start_Wed, " + 
            "ifnull(ht.Close_Wed, 1800) as Close_Wed, ifnull(ht.Start_Thu, 900) as Start_Thu, ifnull(ht.Close_Thu, 1800) as Close_Thu, " +
            "ifnull(ht.Start_Fri, 900) as Start_Fri, ifnull(ht.Close_Fri, 1800) as Close_Fri, ifnull(ht.Start_Sat, 900) as Start_Sat, " +
            "ifnull(ht.Close_Sat, 1300) as Close_Sat, ifnull(ht.Start_Sun, 1300) as Start_Sun, ifnull(ht.Close_Sun, 1300) as Close_Sun, " + 
            "ifnull(ht.IsOpenHoliday, '휴진') as IsOpenHoliday, " +
            "ifnull(ht.Lunch_Week, '12:00에서 13:00까지') as Lunch_Week from hospital as h left join hospital_time as ht on h.Hnumber = ht.Number"
        const result3 = await connection.query(sql3, [idx]);
        const data3 = result3[0];

        // 데이터 가공
        const date_ind = new Date(date + " 10:00");
        const date_last = new Date(date + " 17:31");
        const revp_bytime = []; // [{date: 예약 날짜, time: 예약 시간, count: 해당 시간대 예약 인원수}], 시간순으로 오름차순 정렬됨
        let ri = 0;

        class RT { 
            constructor (time, count) { 
                this.time = time;
                this.count = count;
            } 
        }
        
        do // date_ind보다 작은 예약 시간대는 패스
        {
            if(ri >= data2.length) break;

            const cur = new Date(data2[ri].date + " " + data2[ri].time);
            if(cur.getTime() < date_ind.getTime()) ri++;
            else break;
        } while(1)

        while(date_ind <= date_last)
        {
            const hours = date_ind.getHours();
            const min = date_ind.getMinutes();
            let cc = 0;

            if(ri < data2.length)
            {
                const cur = new Date(data2[ri].date + " " + data2[ri].time);
                if(hours == cur.getHours() && min == cur.getMinutes())
                {
                    cc = data2[ri].count;
                    ri++;
                }
            }
            revp_bytime.push(new RT(new Date(date_ind.getTime()).toString(), cc));
            date_ind.setMinutes(date_ind.getMinutes() + 30);
        }

        console.log({ hos_info : data1[0], revp_bytime : revp_bytime, hos_timeinfo: data3[0] });
        res.send({ hos_info : data1[0], revp_bytime : revp_bytime, hos_timeinfo: data3[0] });
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
    }
    finally {
        connection.release();
    }
});


/* ===== 사전예약-예약 처리 =====
 *
 * 새로운 예약 정보를 등록합니다 (+수정 가능)
 * 예약번호(Rnumber)는 DB에서 auto increment속성을 가지므로 따로 인자를 줄 필요 없습니다 (자동으로 번호가 생성됨)
 * 백신 선택은 조건에 맞는 것을 랜덤으로 선택하며, 동시에 백신 잔여량이 1 감소합니다.
 * (조건 1: 예약날짜 기준, 유통기한이 남은 잔여백신 > 0) // 현재 날짜가 아닌 예약날짜 기준
 * (조건 2: 조건 1을 만족하는 백신이 접종자 신체조건을 만족함)
 * 백신 잔여량이 0이 되면, 해당 tuple을 삭제합니다
 * 만약 이미 등록된 예약정보가 있으면, 해당 정보를 수정합니다
 *
 * === client-input ===
 * jwtToken = 사용자 정보 jwt토큰 (로그인에서 생성된 토큰)
 * rev_hos = 예약 병원 아이디
 * rev_date = 1차예약 날짜&시간 (문자열) (ex. '2021-12-01 15:00:00')
 *
 * === server-return ===
 * rev_vacname = 예약 백신명 (아이디 X)
 * rev_date1 = 1차예약 날짜&시간 (문자열, new Date(rev_date1)로 원래 시간 데이터로 변환 가능)
 * rev_date2 = 2차예약 날짜&시간
 *
*/
router.post('/register', async function (req, res, next) {
    const token = req.body.jwtToken;
    const rev_hos = req.body.rev_hos;
    const rev_date = req.body.rev_date;

    const token_res = await jwt.verify(token); // 토큰 해독
    const rev_ssn = token_res.ssn; // 예약자 ssn
    const rev_startdate = new Date();
    
    let err_code = 0;
    let err_msg = "";
    const connection = await pool2.getConnection(async conn => conn);
    try {
        await connection.beginTransaction(); // 트랜잭션 시작

        const sql1 = "select HV.Vnumber, Vname, Amount from hospital_vaccine as HV, " + 
            "vaccine as V where HV.Vnumber=V.Vnumber and HV.Hnumber=? and " + 
            "HV.`Expiration` > ? and HV.`Amount` > 0 and V.`AgeCont` < (select age from person where Ssn=?);";
        const result1 = await connection.query(sql1, [rev_hos, rev_date, rev_ssn]);
        const data1 = result1[0];
        const rev_vac = data1[0];

        if(data1.length == 0)
        {
            err_code = 2;
            throw new Error("조건에 맞는 잔여 백신이 없습니다.");
        }
        const rev_vacid = rev_vac.Vnumber;

        const rev_date2 = new Date(rev_date);
        rev_date2.setDate(rev_date2.getDate() + 28);
        const revcon = [rev_hos, rev_vacid, rev_date, rev_date2, rev_ssn];

        const sql2 = "select * from reservation where Ssn=?";
        const result2 = await connection.query(sql2, [rev_ssn]);
        const data2 = result1[0];
        if(data2.length == 0) // 새로운 예약 등록
            await connection.query("INSERT INTO RESERVATION(`Hnumber`, `Vnumber`, `Rdate1`, `Rdate2`, `Ssn`, `IsVaccine`) values(?,?,?,?,?,0);", revcon);
        else // 기존 예약 수정
            await connection.query("update reservation set `Hnumber`=?, `Vnumber`=?, `Rdate1`=?, `Rdate2`=?, `IsVaccine`=0; where `Ssn`=?", revcon);

        // const data3 = [rev_date, rev_ssn]; // 예약날짜 갱신
        // await connection.query("UPDATE PERSON SET Rdate=? WHERE Ssn=?;", data3);

        if(rev_vac.Amount > 1) // 잔여백신이 2 이상이면 1 감소시킴. 아니면 삭제
            await connection.query("update hospital_vaccine SET Amount=Amount-1 WHERE Hnumber=? and Vnumber=?", [rev_hos, rev_vacid]);
        else
            await connection.query("delete from hospital_vaccine WHERE Hnumber=? and Vnumber=?", [rev_hos, rev_vacid]);

        res.send({ rev_vacname : rev_vac.Vname, rev_date2 : rev_date2, rev_date1 : new Date(rev_date) });
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
