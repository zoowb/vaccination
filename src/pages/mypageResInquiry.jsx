import "./mypageResInquiry.css";
import MyPageWhole from "../components/mypage/mypageWhole";
import MyPageWhite from "../components/mypage/mypageWhite";
import MyPageCategory from "../components/mypage/mypageCategory";
import MyPageBoxSet from "../components/mypage/mypageBoxes";
import MyPageBtn from "../components/mypage/mypageBtn";
import axios from "axios";
import { useState, useEffect } from "react";
import transVaccine from "../components/modules/translation";
const MyPageResInquiry = () => {
  const [ssn, setSsn] = useState("");
  const [name, setName] = useState("");
  const [resInfo, setResInfo] = useState("");
  const [err, setErr] = useState(false);
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
        setErr(false);
      })
      .catch((e) => {
        console.log(e);
        setErr(true);
      });
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
          {err == true ? (
            <h1 className="noRes">예약된 정보가 없습니다.</h1>
          ) : (
            <>
              <MyPageBoxSet title={"예약번호"} value={resInfo.idx} num={2} />
              <MyPageBoxSet title={"접종자 이름"} value={name} num={2} />
              <MyPageBoxSet
                title={"1차 예약 백신"}
                value={transVaccine(resInfo.vacname)}
                num={2}
              />
              <MyPageBoxSet
                title={"1차 예약 기관"}
                value={resInfo.hosname}
                num={2}
              />
              <MyPageBoxSet
                title={"1차 접종 일시"}
                value={transDate(resInfo.date1)}
                num={2}
              />
              <MyPageBoxSet
                title={"2차 예약 백신"}
                value={transVaccine(resInfo.vacname)}
                num={2}
              />
              <MyPageBoxSet
                title={"2차 예약 기관"}
                value={resInfo.hosname}
                num={2}
              />
              <MyPageBoxSet
                title={"2차 접종 일시"}
                value={transDate(resInfo.date2)}
                num={2}
              />
              <section className="btnSection">
                <MyPageBtn text={"1차 접종 변경"} num={2} />
                <MyPageBtn text={"2차 접종 변경"} num={2} />
                <MyPageBtn text={"예약취소"} num={2} />
              </section>
            </>
          )}
        </MyPageWhite>
      </MyPageWhole>
    </section>
  );
};
export default MyPageResInquiry;
