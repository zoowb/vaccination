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
const FindPW = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [errorContent, setErrorContent] = useState("");
  const navigate = useNavigate();

  const onClick = () => {
    axios
      .post("/sign/findPW", { name: name, email: email })
      .then((response) => {
        //비밀번호 페이지로 이동
        navigate("/findPWResult", { state: { pw: response.data.passwd } });
        console.log(response);
      })
      .catch(function (error) {
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
            <h1 className="title">비밀번호 찾기</h1>
            <InputBox
              type={"text"}
              placeholder={"이름"}
              value={name}
              setValue={setName}
            />
            <InputBox
              type={"email"}
              placeholder={"아이디(이메일)"}
              value={email}
              setValue={setEmail}
            />
            {error ? <span className="error">{errorContent}</span> : <></>}
            <BlueBtn text={"비밀번호 찾기"} onClick={onClick}></BlueBtn>
            <LinkBtnSet
              text1={"로그인"}
              url1={"/login"}
              text2={"회원가입"}
              url2={"/signup"}
              text3={"아이디 찾기"}
              url3={"/findID"}
            />
          </div>
        </WhiteScreen>
      </WholeScreen>
    </section>
  );
};
export default FindPW;
