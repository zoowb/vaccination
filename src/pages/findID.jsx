import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import WholeScreen from "../components/wholeScreen";
import WhiteScreen from "../components/auth/whiteScreen";
import BlueBtn from "../components/auth/blueBtn";
import InputBox from "../components/auth/inputBox";
import LinkBtnSet from "../components/auth/linkBtn";
import { useNavigate } from "react-router-dom";
import "./find.css";
const FindID = () => {
  const [name, setName] = useState("");
  const [ssn, setSsn] = useState("");
  const [error, setError] = useState(false);
  const [errorContent, setErrorContent] = useState("");
  const navigate = useNavigate();

  const onClick = () => {
    axios
      .post("/sign/findID", { name: name, ssn: ssn })
      .then((response) => {
        navigate("/findIDResult", { state: { id: response.data.id } });
      })
      .catch((error) => {
        setError(true);
        setErrorContent(error.response.data.err);
        console.log(error);
      });
  };

  return (
    <section className="find">
      <WholeScreen>
        <Link to={"/"}>
          <div className="logo" />
        </Link>
        <WhiteScreen>
          <div className="authImg" />
          <div className="content">
            <h1 className="title">아이디 찾기</h1>
            <InputBox
              type={"text"}
              placeholder={"이름"}
              value={name}
              setValue={setName}
            />
            <InputBox
              type={"text"}
              placeholder={"주민번호"}
              value={ssn}
              setValue={setSsn}
            />
            {error ? <span className="error">{errorContent}</span> : <></>}
            <BlueBtn text={"아이디 찾기"} onClick={onClick}></BlueBtn>
            <LinkBtnSet
              text1={"로그인"}
              url1={"/login"}
              text2={"회원가입"}
              url2={"/signup"}
              text3={"비밀번호 찾기"}
              url3={"/findPW"}
            />
          </div>
        </WhiteScreen>
      </WholeScreen>
    </section>
  );
};
export default FindID;
