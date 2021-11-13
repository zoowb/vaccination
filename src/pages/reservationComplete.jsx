import WholeScreen from "../components/wholeScreen";
import "./reservationComplete.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const ReservationComplete = () => {
  const [response, setResponse] = useState("");
  const getReservation = () => {
    axios.get("/reservationInfo").then((response) => {
      console.log(response);
    });
  };

  useEffect(() => {
    //    getReservation();
  }, []);

  return (
    <section className="reservationComplete">
      <WholeScreen>
        <section className="whiteSection">
          <span>
            <strong className="name">김지수</strong>
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
                  <td>0239103012</td>
                </tr>
                <tr>
                  <td>예약일시</td>
                  <td>2021-10-08</td>
                </tr>
                <tr>
                  <td>1차 백신</td>
                  <td>화이자</td>
                </tr>
                <tr>
                  <td>1차 병원</td>
                  <td>참좋은 병원</td>
                </tr>
                <tr>
                  <td>1차 접종 일시</td>
                  <td>2021-10-14, 14:00</td>
                </tr>
                <tr>
                  <td>2차 백신</td>
                  <td>화이자</td>
                </tr>
                <tr>
                  <td>2차 병원</td>
                  <td>참좋은 병원</td>
                </tr>
                <tr>
                  <td>2차 접종 일시</td>
                  <td>2021-11-11, 14:00</td>
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
      </WholeScreen>
    </section>
  );
};
export default ReservationComplete;
