import "./reservationUnable.css";
import Title from "../components/reservation/title";
import { WholeScreenWithHeader } from "../components/wholeScreen";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Navigate } from "react-router";
const ReservationUnable = () => {
  const navigate = useNavigate();
  return (
    <WholeScreenWithHeader>
      <section className="reservationUnable">
        <Title
          title={"사전예약"}
          subtitle={"지금 코로나19 백신을 예약하세요!"}
        />
        <section className="whiteSection">
          <span className="text">
            사전 예약 대상자가 아닙니다. <br />
            잔여백신은 당일 예약이 가능합니다.
          </span>
        </section>

        <button type="button" className="residual" onClick={() => navigate("/reservationNoshow")}>
          <span className="text">잔여백신 예약하러 가기</span>
        </button>
      </section>
    </WholeScreenWithHeader>
  );
};
export default ReservationUnable;
