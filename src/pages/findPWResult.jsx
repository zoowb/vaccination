import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import WholeScreen from "../components/wholeScreen";
import WhiteScreen from "../components/auth/whiteScreen";
import BlueBtn from "../components/auth/blueBtn";
import { useLocation } from "react-router-dom";
import "./find.css";
const FindPWResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <section className="find">
      <WholeScreen>
        <Link to={"/"}>
          <div className="logo" />
        </Link>
        <WhiteScreen>
          <div className="content">
            <h1 className="title">비밀번호 찾기</h1>
            <h1>회원님의 비밀번호는 {location.state.pw}입니다.</h1>

            <BlueBtn text={"로그인"} onClick={() => navigate("/login")} />
            <BlueBtn text={"메인 화면으로"} onClick={() => navigate("/")} />
          </div>
        </WhiteScreen>
      </WholeScreen>
    </section>
  );
};
export default FindPWResult;
