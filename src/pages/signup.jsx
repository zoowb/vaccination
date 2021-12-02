import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import WholeScreen from "../components/wholeScreen";
import WhiteScreen from "../components/auth/whiteScreen";
import BlueBtn from "../components/auth/blueBtn";
import InputBox from "../components/auth/inputBox";
import LinkBtnSet from "../components/auth/linkBtn";
import {
  telValidator,
  ssnValidator,
  emailValidator,
  pwValidator,
} from "../components/modules/validation";
import "./signup.css";
import DaumPost from "../components/modules/addr";
import GeoCoder from "../components/modules/geocoder";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [ssn, setSSN] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPW] = useState("");
  const [addr, setAddr] = useState("");
  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");
  const [error, setError] = useState(false);
  const [errorContent, setErrorContent] = useState("");
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const onClick = () => {
    axios
      .post("/sign/signup", {
        name: name,
        ssn: ssn,
        tel: tel,
        email: email,
        passwd: pw,
        location: addr,
        sido: sido,
        sigungu: sigungu,
        x: x,
        y: y,
      })
      .then((response) => {
        navigate("/signUpComplete", { state: { name: name } });
      })
      .catch(function (error) {
        setError(true);
        setErrorContent(error.response.data.err);
      });
  };

  useEffect(() => {
    console.log(error);
    if (
      name == "" ||
      ssn == "" ||
      tel == "" ||
      email == "" ||
      pw == "" ||
      addr == ""
    ) {
      setError(true);
      setErrorContent("빈칸을 모두 채워주세요.");
    } else if (!ssnValidator(ssn)) {
      setError(true);
      setErrorContent("주민번호를 올바르게 입력해주세요.");
    } else if (!telValidator(tel)) {
      setError(true);
      setErrorContent("전화번호를 올바르게 입력해주세요.");
    } else if (!emailValidator(email)) {
      setError(true);
      setErrorContent("이메일 형식을 확인해주세요.");
    } else if (!pwValidator(pw)) {
      setError(true);
      setErrorContent(
        "비밀번호는 문자와 숫자를 모두 포함해\n 6~10자로 입력해주세요."
      );
    } else {
      setError(false);
    }
  }, [tel, ssn, email, pw, name, addr]);

  useEffect(() => {
    if (addr != "") {
      onChangeOpenPost();
      GeoCoder(addr, setX, setY);
    }
  }, [addr]);

  const onChangeOpenPost = () => {
    setOpen(!open);
  };

  return (
    <section className="signup">
      {open ? (
        <section
          className="background"
          id="addrBack"
          onClick={onChangeOpenPost}
        >
          <div className="postDiv">
            <DaumPost
              setAddr={setAddr}
              setSido={setSido}
              setSigungu={setSigungu}
            />
          </div>
        </section>
      ) : (
        <></>
      )}
      <WholeScreen>
        <Link to={"/"}>
          <div className="logo" />
        </Link>{" "}
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
              placeholder={"주민번호 (000000-0000000)"}
              page={"회원가입"}
              value={ssn}
              setValue={setSSN}
            />
            <InputBox
              type={"tel"}
              placeholder={"전화번호 (010-0000-0000)"}
              page={"회원가입"}
              value={tel}
              setValue={setTel}
            />
            <InputBox
              type={"email"}
              placeholder={"이메일 (example@email.com)"}
              page={"회원가입"}
              value={email}
              setValue={setEmail}
            />
            <InputBox
              type={"password"}
              placeholder={"비밀번호 (6~10자, 문자+숫자)"}
              page={"회원가입"}
              value={pw}
              setValue={setPW}
            />
            <button className="addr" onClick={onChangeOpenPost}>
              {addr ? (
                addr
              ) : (
                <span className="addr-placeholder">
                  주소를 입력하려면 클릭하세요
                </span>
              )}
            </button>
            {error ? <span className="error">{errorContent}</span> : <></>}
            <BlueBtn text={"회원가입"} onClick={onClick} disable={error} />
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
