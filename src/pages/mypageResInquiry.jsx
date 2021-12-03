import "./mypageResInquiry.css";
import MyPageWhole from "../components/mypage/mypageWhole";
import MyPageWhite from "../components/mypage/mypageWhite";
import MyPageCategory from "../components/mypage/mypageCategory";
import MyPageBoxSet from "../components/mypage/mypageBoxes";
import MyPageBtn from "../components/mypage/mypageBtn";
import axios from "axios";
import { useState, useEffect } from "react";
import transVaccine, { transDate } from "../components/modules/translation";
import { useNavigate } from "react-router-dom";
const MyPageResInquiry = () => {
  const [ssn, setSsn] = useState("");
  const [name, setName] = useState("");
  const [resInfo, setResInfo] = useState("");
  const [err, setErr] = useState(false);
  const [isvac, setIsvac] = useState(2);
  const [resnum, setResnum] = useState("");
  const navigate = useNavigate();
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
        setResInfo(response.data);
        setIsvac(response.data.isvaccine);
        setErr(false);
        setResnum(response.data.idx);
      })
      .catch((e) => {
        console.log(e);
        setResInfo("없음");
        setErr(true);
      });
  };

  const DeleteRes = () => {
    axios
    .post("/mypage/delrev", {rev_num: resnum})
    .then((response) => {
      navigate("/mypageResdelok");
    })
    .catch((e) => {
      navigate("/mypageResdelerr");
      console.log(e);
    });
  };

  useEffect(() => {
    getRes();
  }, []);

  useEffect(() => {
    console.log("err==", err);
  }, [err]);

  return (
    <section className="mypageResInquiry">
      <MyPageWhole>
        <MyPageCategory selected={3} />
        <MyPageWhite>
          {resInfo == "없음" ? (
            <>
              <MyPageBoxSet
                title={"예약번호"}
                value={"예약 정보 없음"}
                num={2}
              />
              <MyPageBoxSet
                title={"접종자 이름"}
                value={"예약 정보 없음"}
                num={2}
              />
              <MyPageBoxSet
                title={"1차 예약 백신"}
                value={"예약 정보 없음"}
                num={2}
              />
              <MyPageBoxSet
                title={"1차 예약 기관"}
                value={"예약 정보 없음"}
                num={2}
              />
              <MyPageBoxSet
                title={"1차 접종 일시"}
                value={"예약 정보 없음"}
                num={2}
              />
              <MyPageBoxSet
                title={"2차 예약 백신"}
                value={"예약 정보 없음"}
                num={2}
              />
              <MyPageBoxSet
                title={"2차 예약 기관"}
                value={"예약 정보 없음"}
                num={2}
              />
              <MyPageBoxSet
                title={"2차 접종 일시"}
                value={"예약 정보 없음"}
                num={2}
              />
            </>
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
              <section className={"btnSection"}>
                <MyPageBtn text={"접종 변경"} num={2} isvac={isvac} onClick={()=>{navigate("/reservationEdit")}}/>
                <MyPageBtn text={"예약취소"} num={2} isvac={isvac} onClick={DeleteRes}/>
              </section>
            </>
          )}
        </MyPageWhite>
      </MyPageWhole>
    </section>
  );
};
export default MyPageResInquiry;
