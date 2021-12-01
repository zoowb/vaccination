import "./reservationUnable.css";
import Title from "../components/reservation/title";
import { WholeScreenWithHeader } from "../components/wholeScreen";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Navigate } from "react-router";
const ReservationFail = () => {
  const navigate = useNavigate();
  return (
    <WholeScreenWithHeader>
      <section className="reservationUnable">
        <Title
          title={"사전 예약"}
          subtitle={"지금 코로나19 백신을 예약하세요!"}
        />
        <section className="whiteSection">
          <span className="text">예약에 실패했습니다.</span>
        </section>

        <button
          type="button"
          className="residual"
          onClick={() => navigate("/reservation")}
        >
          <span className="text">예약 화면으로 돌아가기</span>
        </button>
      </section>
    </WholeScreenWithHeader>
  );
};
export default ReservationFail;
