import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import WholeScreen from "../components/wholeScreen";
import WhiteScreen from "../components/auth/whiteScreen";
import BlueBtn from "../components/auth/blueBtn";
import InputBox from "../components/auth/inputBox";
import LinkBtnSet from "../components/auth/linkBtn";
import "./signup.css";
const SignUp = () => {
  const [name, setName] = useState("");
  const [ssn, setSSN] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPW] = useState("");
  // const [confirm, setConfirm] = useState(""); //비밀번호 확인 논의 필요
  const [addr, setAddr] = useState("");
  const [error, setError] = useState(false);
  const [errorContent, setErrorContent] = useState("");
  const onClick = () => {
    axios
      .post("/sign/signup", {
        name: name,
        ssn: ssn,
        tel: tel,
        email: email,
        passwd: pw,
        location: addr,
      })
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        // setError(true);
        // setErrorContent(error);
        console.log(error);
      });
  };

  return (
    <section className="signup">
      <WholeScreen>
        <Link to={"/"}>
          <div className="logo" />
        </Link>
        <WhiteScreen>
          <div className="authImg" />
          <div className="content">
            <h1 className="title">회원가입</h1>
            <InputBox
              type={"text"}
              placeholder={"이름"}
              page={"회원가입"}
              value={name}
              setValue={setName}
            />
            <InputBox
              type={"text"}
              placeholder={"주민번호"}
              page={"회원가입"}
              value={ssn}
              setValue={setSSN}
            />
            <InputBox
              type={"tel"}
              placeholder={"전화번호"}
              page={"회원가입"}
              value={tel}
              setValue={setTel}
            />
            <InputBox
              type={"email"}
              placeholder={"이메일"}
              page={"회원가입"}
              value={email}
              setValue={setEmail}
            />
            <InputBox
              type={"password"}
              placeholder={"비밀번호"}
              page={"회원가입"}
              value={pw}
              setValue={setPW}
            />
            <InputBox
              type={"text"}
              placeholder={"주소"}
              page={"회원가입"}
              value={addr}
              setValue={setAddr}
            />
            {error ? <span className="error">{errorContent}</span> : <></>}
            <BlueBtn text={"회원가입"} onClick={onClick}></BlueBtn>
            <LinkBtnSet
              text1={"로그인"}
              url1={"/login"}
              text2={"아이디 찾기"}
              url2={"/findID"}
              text3={"비밀번호 찾기"}
              url3={"/findPW"}
            />
          </div>
        </WhiteScreen>
      </WholeScreen>
    </section>
  );
};
export default SignUp;
