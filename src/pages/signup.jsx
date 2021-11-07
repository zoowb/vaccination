import WholeScreen from "../components/wholeScreen";
import WhiteScreen from "../components/auth/whiteScreen";
import BlueBtn from "../components/auth/blueBtn";
import InputBox from "../components/auth/inputBox";
import LinkBtnSet from "../components/auth/linkBtn";
import "./signup.css";
const SignUp = () => {
  return (
    <section className="signup">
      <WholeScreen>
        <WhiteScreen>
          <div className="authImg" />
          <div className="content">
            <h1 className="title">회원가입</h1>
            <InputBox type={"text"} placeholder={"이름"} page={"회원가입"} />
            <InputBox
              type={"number"}
              placeholder={"주민번호"}
              page={"회원가입"}
            />
            <InputBox type={"tel"} placeholder={"전화번호"} page={"회원가입"} />
            <InputBox type={"email"} placeholder={"이메일"} page={"회원가입"} />
            <InputBox
              type={"password"}
              placeholder={"비밀번호"}
              page={"회원가입"}
            />
            <InputBox type={"text"} placeholder={"주소"} page={"회원가입"} />
            <BlueBtn text={"회원가입"}></BlueBtn>
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
