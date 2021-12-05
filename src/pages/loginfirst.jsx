import "./reservationUnable.css";
import Title from "../components/reservation/title";
import { WholeScreenWithHeader } from "../components/wholeScreen";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Navigate } from "react-router";
const Loginfirst = () => {
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
            로그인 후 예약이 가능합니다.
          </span>
        </section>

        <button type="button" className="residual" onClick={() => navigate("/login")}>
          <span className="text">로그인 하러 가기</span>
        </button>
      </section>
    </WholeScreenWithHeader>
  );
};
export default Loginfirst;
