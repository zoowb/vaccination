import "./reservationCheck.css";
import Title from "../components/reservation/title";
import { WholeScreenWithHeader } from "../components/wholeScreen";
import InputBox from "../components/auth/inputBox";
import { useState } from "react";
import axios from "axios";
const ReservationCheck = () => {
  const [id, setID] = useState("");
  const [pw, setPW] = useState("");
  const onClick = () => {
    axios.post("/sign/check", { id: id, pw: pw }).then((response) => {
      console.log(response);
    });
  };
  return (
    <WholeScreenWithHeader>
      <section className="reservationContent">
        <Title
          title={"사전예약"}
          subtitle={"지금 코로나19 백신을 예약하세요!"}
        />
        <section className="whiteSection">
          <p className="content">
            본인 확인을 위해,
            <br />
            아이디와 비밀번호를 다시 한 번 입력해주세요.
          </p>
          <div className="inputBox">
            <InputBox
              type="text"
              placeholder={"아이디(이메일)"}
              value={id}
              setValue={setID}
            />
            <InputBox
              type="password"
              placeholder={"비밀번호"}
              value={pw}
              setValue={setPW}
            />
          </div>
          <button type="button" onClick={onClick} className="btn">
            <span className="text">입력 완료</span>
          </button>
        </section>
      </section>
    </WholeScreenWithHeader>
  );
};
export default ReservationCheck;
