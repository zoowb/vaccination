import React, { useEffect, useState } from "react";
import axios from "axios";
import "./easyCheck.css";
import { transDate } from "../modules/translation";
const EasyCheck = () => {
  const [rnum, setRnum] = useState('');
  const [data, setData] = useState('');

  const onChangeRnum = (e) => {
    setRnum(e.target.value);
  };

  const getRinfo = () => {
    axios
      .post("/home/quicklook", {idx: rnum})
      .then((response)=> {
        console.log(response);
        setData(response.data);
      })
      .catch((e)=>{
        console.log(e);
      });
  };

  useEffect(() => {
    if(data != '') {
      console.log("여기!!", data, rnum);
    }
  },[data, rnum]);
    return (
      <section className="easyCheck">
        {data?(
          <>
            <section className="resultbox">
              <div className="resultname">예약번호</div>
              <div className="result">{rnum}</div>
            </section>
            <section className="resultbox">
              <div className="resultname">1차 백신</div>
              {data.rev_vacname == "Morderna" ? <div className="result">모더나</div>
              : "Pfizer" ? <div className="result">화이자</div> : "AstraZeneca" ? <div className="result">아스트라제네카</div> : <div className="result">얀센</div>}
            </section>
            <section className="resultbox">
              <div className="resultname">1차 병원</div>
              <div className="result">{data.rev_hosname}</div>
            </section>
            <section className="resultbox">
              <div className="resultname">1차 접종일시</div>
              <div className="result">{transDate(data.rev_date1)}</div>
            </section>
            <section className="resultbox">
              <div className="resultname">2차 백신</div>
              {data.rev_vacname == "Morderna" ? <div className="result">모더나</div>
              : "Pfizer" ? <div className="result">화이자</div> : "AstraZeneca" ? <div className="result">아스트라제네카</div> : <div className="result">얀센</div>}
            </section>
            <section className="resultbox">
              <div className="resultname">2차 병원</div>
              <div className="result">{data.rev_hosname}</div>
            </section>
            <section className="resultbox">
              <div className="resultname">2차 접종일시</div>
              <div className="result">{transDate(data.rev_date2)}</div>
            </section>
          </>
        ):(
          <>
            <h1 className="title">
              간편 조회를 위해
              <br />
              예약번호를 입력해주세요.
            </h1>
            <input type="text" className="inputBox" placeholder={"예약번호"} onChange={onChangeRnum} value={rnum} />
            <button type="button" className="btn" onClick={()=>getRinfo()}>
              입력 완료
            </button>
          </>
        )}
      </section>
    )
};
export default EasyCheck;
