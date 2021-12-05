import "./reservationCheck.css";
import Title from "../components/reservation/title";
import { WholeScreenWithHeader } from "../components/wholeScreen";
import InputBox from "../components/auth/inputBox";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const ReservationCheck = () => {
  const [pw, setPW] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");
  const onClick = () => {
    axios
      .post("/reservation/selfcheck", { jwtToken: token, passwd: pw })
      .then((response) => {
        if (response.data.ok) {
          console.log(response.data.ok);
          navigate("/reservation");
        }
      })
      .catch((e) => {
        console.log(e);
        if (e.response.data.err == "일치하는 회원정보가 없습니다.") {
          setErr("비밀번호가 일치하지 않습니다.");
        } else {
          navigate("/reservationUnable");
        }
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
            비밀번호를 다시 한 번 입력해주세요.
          </p>
          <div className="inputBox">
            <InputBox
              type="password"
              placeholder={"비밀번호"}
              value={pw}
              setValue={setPW}
            />
          </div>
          <h1 className="err">{err}</h1>
          <button type="button" onClick={onClick} className="btn">
            <span className="text">입력 완료</span>
          </button>
        </section>
      </section>
    </WholeScreenWithHeader>
  );
};
export default ReservationCheck;
