import "./mypageResInquiry.css";
import MyPageWhole from "../components/mypage/mypageWhole";
import MyPageWhite from "../components/mypage/mypageWhite";
import MyPageCategory from "../components/mypage/mypageCategory";
import MyPageBoxSet from "../components/mypage/mypageBoxes";
import MyPageBtn from "../components/mypage/mypageBtn";
import axios from "axios";
import { useState, useEffect } from "react";
const MyPageResInquiry = () => {
  const [ssn, setSsn] = useState("");
  const [name, setName] = useState("");
  const [resInfo, setResInfo] = useState("");
  const getRes = () => {
    const token = localStorage.getItem("accessToken");
    axios
      .post("/mypage/getinfo", { jwtToken: token })
      .then((response) => {
        setSsn(response.data.Ssn);
        setName(response.data.Name);
      })
      .catch((e) => console.log(e));
    axios
      .post("/mypage/getrev", { jwtToken: token, ssn: ssn })
      .then((response) => {
        console.log(response.data);
        setResInfo(response.data);
      })
      .catch((e) => console.log(e));
  };

  const transVaccine = (name) => {
    if (name == "Pfizer") return "화이자";
    else if (name == "Morderna") return "모더나";
    else if (name == "AstraZeneca") return "아스트라제네카";
    else if (name == "Janssen") return "얀센";
  };

  const transDate = (date) => {
    return `${date?.substr(0, 10)} / ${date?.substr(11, 5)}`;
  };

  useEffect(() => {
    getRes();
  }, []);

  return (
    <section className="mypageResInquiry">
      <MyPageWhole>
        <MyPageCategory selected={3} />
        <MyPageWhite>
          <MyPageBoxSet title={"예약번호"} value={"039202"} num={2} />
          <MyPageBoxSet title={"접종자 이름"} value={name} num={2} />
          <MyPageBoxSet
            title={"1차 예약 백신"}
            value={transVaccine(resInfo.rev1_vacname)}
            num={2}
          />
          <MyPageBoxSet
            title={"1차 예약 기관"}
            value={resInfo.rev1_hosname}
            num={2}
          />
          <MyPageBoxSet
            title={"1차 접종 일시"}
            value={transDate(resInfo.rev1_date)}
            num={2}
          />
          <MyPageBoxSet
            title={"2차 예약 백신"}
            value={transVaccine(resInfo.rev2_vacname)}
            num={2}
          />
          <MyPageBoxSet
            title={"2차 예약 기관"}
            value={resInfo.rev2_hosname}
            num={2}
          />
          <MyPageBoxSet
            title={"2차 접종 일시"}
            value={transDate(resInfo.rev2_date)}
            num={2}
          />

          <section className="btnSection">
            <MyPageBtn text={"1차 접종 변경"} num={2} />
            <MyPageBtn text={"2차 접종 변경"} num={2} />
            <MyPageBtn text={"예약취소"} num={2} />
          </section>
        </MyPageWhite>
      </MyPageWhole>
    </section>
  );
};
export default MyPageResInquiry;
