import "./reservationUnable.css";
import Title from "../components/reservation/title";
import { WholeScreenWithHeader } from "../components/wholeScreen";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Navigate } from "react-router";
const NoshowUnable = () => {
  const navigate = useNavigate();
  return (
    <WholeScreenWithHeader>
      <section className="reservationUnable">
        <Title
          title={"잔여백신"}
          subtitle={"예약에 실패하였습니다."}
        />
        <section className="whiteSection">
          <span className="text">
            이미 1차접종이 완료되어 <br />
            잔여백신 예약이 불가합니다.
          </span>
        </section>

        <button type="button" className="residual" onClick={() => navigate("/")}>
          <span className="text">홈화면으로 가기</span>
        </button>
      </section>
    </WholeScreenWithHeader>
  );
};
export default NoshowUnable;
