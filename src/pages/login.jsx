import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import WholeScreen from "../components/wholeScreen";
import WhiteScreen from "../components/auth/whiteScreen";
import BlueBtn from "../components/auth/blueBtn";
import InputBox from "../components/auth/inputBox";
import LinkBtnSet from "../components/auth/linkBtn";
import "./login.css";
import { useNavigate } from "react-router-dom";
axios.defaults.baseURL = "http://localhost:5000";
const Login = () => {
  const [id, setID] = useState("");
  const [pw, setPW] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const onClick = () => {
    axios
      .post("/sign/login", { email: id, passwd: pw })
      .then((response) => {
        setError(false);
        console.log("response: ", response);
        const accessToken = response.data.jwtToken;
        localStorage.setItem("accessToken", accessToken);
        if (accessToken) {
          navigate("/");
        }
      })
      .catch(function (error) {
        console.log("error: ", error);
        setError(true);
      });
  };
  return (
    <section className="login">
      <WholeScreen>
        <Link to={"/"}>
          <div className="logo" />
        </Link>
        <WhiteScreen>
          <div className="authImg" />
          <div className="content">
            <h1 className="title">로그인</h1>
            <InputBox
              type={"text"}
              placeholder={"아이디 (이메일)"}
              value={id}
              setValue={setID}
            />
            <InputBox
              type={"password"}
              placeholder={"비밀번호"}
              value={pw}
              setValue={setPW}
            />
            {error ? (
              <span className="error">로그인에 실패했습니다.</span>
            ) : (
              <></>
            )}
            <BlueBtn text={"로그인"} onClick={onClick}></BlueBtn>
            <LinkBtnSet
              text1={"회원가입"}
              url1={"/signup"}
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
export default Login;
