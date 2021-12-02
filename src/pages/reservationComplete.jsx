import { WholeScreenWithHeader } from "../components/wholeScreen";
import "./reservationComplete.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import transVaccine, { transDate } from "../components/modules/translation";
const ReservationComplete = () => {
  const [response, setResponse] = useState("");
  let ssn = "";

  const getReservation = () => {
    const token = localStorage.getItem("accessToken");
    axios
      .post("/mypage/getinfo", { jwtToken: token })
      .then((response) => {
        ssn = response.data.Ssn;
      })
      .catch((e) => console.log(e));
    axios
      .post("/mypage/getrev", { jwtToken: token })
      .then((res) => {
        setResponse(res);
        console.log(res.data.date2);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getReservation();
  }, []);

  return (
    <WholeScreenWithHeader>
      <section className="reservationComplete">
        <section className="whiteSection">
          <span className="nameSection">
            <strong className="name">{response.data?.name}</strong>
            <span className="text">&nbsp;님의 예약이 완료되었습니다.</span>
          </span>
          <section className="infoSection">
            <div className="guide">
              <span className="text">예약 정보</span>
            </div>
            <table className="tableSection">
              <tbody>
                <tr>
                  <td>예약번호</td>
                  <td>{response.data?.idx}</td>
                </tr>
                <tr>
                  <td>1차 백신</td>
                  <td>{transVaccine(response.data?.vacname)}</td>
                </tr>
                <tr>
                  <td>1차 병원</td>
                  <td>{response.data?.hosname}</td>
                </tr>
                <tr>
                  <td>1차 접종 일시</td>
                  <td>{transDate(response.data?.date1)}</td>
                </tr>
                <tr>
                  <td>2차 백신</td>
                  <td>{transVaccine(response.data?.vacname)}</td>
                </tr>
                <tr>
                  <td>2차 병원</td>
                  <td>{response.data?.hosname}</td>
                </tr>
                <tr>
                  <td>2차 접종 일시</td>
                  <td>{transDate(response.data?.date2)}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </section>
        <Link to={"/"}>
          <button type="button" className="pinkBtn">
            <span className="btnText">홈 화면으로 돌아가기</span>
          </button>
        </Link>
      </section>
    </WholeScreenWithHeader>
  );
};
export default ReservationComplete;
