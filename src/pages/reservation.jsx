import "./reservation.css";
import Title from "../components/reservation/title";
import { DateSelectBox } from "../components/reservation/selectBox";
import { useState, useEffect } from "react";
import {
  HospitalBigBox,
  HospitalDetail,
} from "../components/reservation/hospitalBox";
import { WholeScreenWithHeader } from "../components/wholeScreen";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ReservationSelect,
  pickTime,
} from "../components/reservation/reservationSelect";
import { Search, DetailSearch } from "../components/reservation/search";

const Reservation = () => {
  const [selectedTime, setSelectedTime] = useState("없음");
  const [sido, setSido] = useState([]);
  const [sidoPick, setSidoPick] = useState("110000");
  const [sigungu, setSigungu] = useState([]);
  const [sigunguPick, setSigunguPick] = useState("110001");
  const [resultList, setResultList] = useState([]);
  const [medicalInfo, setMedicalInfo] = useState("");
  const [medicalPick, setMedicalPick] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [cnt, setCnt] = useState(0);
  const [disable, setDisable] = useState(true);

  const [search, setSearch] = useState(true);

  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const MakeReservation = () => {
    axios
      .post("/reservation/register", {
        jwtToken: token,
        rev_hos: medicalPick,
        rev_date: `${startDate.toISOString().substr(0, 10)} ${selectedTime}:00`,
      })
      .then((response) => {
        navigate("/reservationComplete");
        console.log("시간: ", new Date(response.data.rev_date2));
      })
      .catch((e) => {
        console.log(e);
        navigate("/");
      });
  };

  useEffect(() => {
    if (medicalPick != "") {
      DetailSearch(medicalPick, startDate, setMedicalInfo);
    }
  }, [medicalPick]);

  return (
    <WholeScreenWithHeader>
      <section className="reservation">
        <Title
          title={"사전 예약"}
          subtitle={"지금 코로나19 백신을 예약하세요!"}
        />
        <section className="whiteSection">
          <strong className="title">집 근처의 의료 기관을 조회해보세요.</strong>
          <section className="searchSection">
            <ReservationSelect
              sido={sido}
              sidoPick={sidoPick}
              sigungu={sigungu}
              setSido={setSido}
              setSidoPick={setSidoPick}
              setSigungu={setSigungu}
              setSigunguPick={setSigunguPick}
            />
            <div className="others">
              <div className="date">
                <DateSelectBox
                  startDate={startDate}
                  setStartDate={setStartDate}
                />
              </div>
              <button
                type="button"
                className="searchBtn"
                onClick={() => {
                  if (search == true) {
                    Search(
                      setCnt,
                      sigunguPick,
                      startDate,
                      setResultList,
                      setMedicalPick,
                      setSelectedTime
                    );
                  } else {
                    window.location.reload();
                  }
                  setSearch(!search);
                }}
              >
                <span className="text">
                  {search == true ? "검색하기" : "초기화"}
                </span>
              </button>
            </div>
          </section>
          <section className="hospitalSection">
            <div className="preview">
              {resultList ? (
                resultList.map((data, i) => {
                  return (
                    <HospitalBigBox
                      name={data.Hname}
                      address={data.Hlocation}
                      code={data.Hnumber}
                      setMedicalPick={setMedicalPick}
                      setCnt={setCnt}
                      cnt={cnt}
                      key={i}
                    />
                  );
                })
              ) : (
                <></>
              )}
            </div>
            {medicalPick != "" ? (
              <div className="detail">
                <HospitalDetail
                  medicalInfo={medicalInfo}
                  pickTime={() => pickTime(setSelectedTime)}
                  selectedTime={selectedTime}
                  cnt={cnt}
                />
              </div>
            ) : (
              ""
            )}
          </section>
        </section>
        <button
          type="button"
          className={
            selectedTime == "없음" ? "reservationBtnDisable" : "reservationBtn"
          }
          onClick={() => MakeReservation()}
          disabled={selectedTime == "없음" ? disable : ""}
        >
          <span className="btnText">예약하기</span>
        </button>
      </section>
    </WholeScreenWithHeader>
  );
};
export default Reservation;
