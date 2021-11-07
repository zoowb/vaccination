import WholeScreen from "../components/wholeScreen";
import WhiteScreen from "../components/auth/whiteScreen";
import BlueBtn from "../components/auth/blueBtn";
import InputBox from "../components/auth/inputBox";
import LinkBtnSet from "../components/auth/linkBtn";
import "./login.css";
const Login = () => {
  return (
    <section className="login">
      <WholeScreen>
        <WhiteScreen>
          <div className="authImg" />
          <div className="content">
            <h1 className="title">로그인</h1>
            <InputBox type={"text"} placeholder={"아이디 (이메일)"} />
            <InputBox type={"password"} placeholder={"비밀번호"} />
            <BlueBtn text={"로그인"}></BlueBtn>
            <LinkBtnSet
              text1={"회원가입"}
              url1={"/signUp"}
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
