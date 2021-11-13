import "./reservationUnable.css";
import Title from "../components/reservation/title";
import WholeScreen from "../components/wholeScreen";
import { useState } from "react";
import axios from "axios";
const ReservationUnable = () => {
  return (
    <WholeScreen>
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

        <button type="button" className="residual">
          <span className="text">잔여백신 예약하러 가기</span>
        </button>
      </section>
    </WholeScreen>
  );
};
export default ReservationUnable;
