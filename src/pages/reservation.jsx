import "./reservation.css";
import WholeScreen from "../components/wholeScreen";
import Title from "../components/reservation/title";
import { SelectBox, DateSelectBox } from "../components/reservation/selectBox";
import axios from "axios";
import { useState } from "react";
import {
  HospitalBigBox,
  HospitalDetail,
} from "../components/reservation/hospitalBox";
const Reservation = () => {
  const [response, setResponse] = useState("");
  const [info, setInfo] = useState("");
  const [individual, setIndividual] = useState(false);
  const Search = () => {
    // const param = {};
    // axios.post("/search", { params: param }).then((response) => {
    //   console.log(response);
    //   setResponse(response);
    // });
  };

  const IndividualView = () => {
    // axios.get(`/search/${hospitalID}`).then((response) => {
    //   console.log(response);
    //   setIndividual(false);
    //   setInfo(response);
    // });
  };
  //병원 이름 클릭하면 id 넘겨줘서 hospitalDetail에서 표현하기
  return (
    <WholeScreen>
      <section className="reservation">
        <Title
          title={"사전 예약"}
          subtitle={"지금 코로나19 백신을 예약하세요!"}
        />
        <section className="whiteSection">
          <strong className="title">집 근처의 의료 기관을 조회해보세요.</strong>

          <section className="searchSection">
            <div className="location">
              <SelectBox />
              <SelectBox />
              <SelectBox />
            </div>
            <div className="others">
              <div className="date">
                <DateSelectBox />
              </div>
              <button
                type="button"
                className="searchBtn"
                onClick={() => Search()}
              >
                <span className="text">검색하기</span>
              </button>
            </div>
          </section>

          <section className="hospitalSection">
            <div className="preview">
              <HospitalBigBox
                name={"참좋은 병원"}
                address={"남양주 다산순환로 111"}
              />
              <HospitalBigBox
                name={"참좋은 병원"}
                address={"남양주 다산순환로 111"}
              />
              <HospitalBigBox
                name={"참좋은 병원"}
                address={"남양주 다산순환로 111"}
              />
              <HospitalBigBox
                name={"참좋은 병원"}
                address={"남양주 다산순환로 111"}
              />
              <HospitalBigBox
                name={"참좋은 병원"}
                address={"남양주 다산순환로 111"}
              />
              <HospitalBigBox
                name={"참좋은 병원"}
                address={"남양주 다산순환로 111"}
              />
              <HospitalBigBox
                name={"참좋은 병원"}
                address={"남양주 다산순환로 111"}
              />
              <HospitalBigBox
                name={"참좋은 병원"}
                address={"남양주 다산순환로 111"}
              />
            </div>
            <div className="detail">
              <HospitalDetail name={"참좋은 병원"} />
            </div>
          </section>
        </section>
        <button type="button" className="reservationBtn">
          <span className="btnText">예약하기</span>
        </button>
      </section>
    </WholeScreen>
  );
};
export default Reservation;
