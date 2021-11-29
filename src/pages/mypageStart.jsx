import "./mypageStart.css";
import MyPageWhole from "../components/mypage/mypageWhole";
import MyPageWhite from "../components/mypage/mypageWhite";
import MyPageCategory from "../components/mypage/mypageCategory";
import MyPageBtn from "../components/mypage/mypageBtn";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const MyPageStart = () => {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [errContent, setErrContent] = useState("");
  const navigate = useNavigate();
  const checkMine = () => {
    axios
      .post("/mypage/check", { passwd: pw })
      .then((response) => {
        setErr(false);
        navigate("/mypageInfoEdit");
      })
      .catch((e) => {
        setErr(true);
        setErrContent(e.response.data.err);
      });
  };

  return (
    <>
      <MyPageWhole>
        <MyPageCategory hide={1} />
        <MyPageWhite>
          <h1 className="mypageStartText">
            본인 확인을 위해,
            <br />
            비밀번호를 입력해주세요.
          </h1>
          <div className="inputs">
            <input
              type="password"
              className="mypageInputBorder"
              placeholder="비밀번호"
              onChange={(e) => setPw(e.target.value)}
            />
          </div>
          {err ? <span className="error">{errContent}</span> : <></>}
          <MyPageBtn text={"입력 완료"} num={1} onClick={checkMine} />
        </MyPageWhite>
      </MyPageWhole>
    </>
  );
};
export default MyPageStart;
