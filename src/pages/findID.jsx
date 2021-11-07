import WholeScreen from "../components/wholeScreen";
import WhiteScreen from "../components/auth/whiteScreen";
import BlueBtn from "../components/auth/blueBtn";
import InputBox from "../components/auth/inputBox";
import LinkBtnSet from "../components/auth/linkBtn";
import "./find.css";
const FindID = () => {
  return (
    <section className="find">
      <WholeScreen>
        <WhiteScreen>
          <div className="authImg" />
          <div className="content">
            <h1 className="title">아이디 찾기</h1>
            <InputBox type={"text"} placeholder={"이름"} />
            <InputBox type={"number"} placeholder={"주민번호"} />
            <BlueBtn text={"아이디 찾기"}></BlueBtn>
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
