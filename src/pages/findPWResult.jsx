import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import WholeScreen from "../components/wholeScreen";
import WhiteScreen from "../components/auth/whiteScreen";
import { useLocation } from "react-router-dom";
import "./findResult.css";
const FindPWResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <section className="findResult">
      <WholeScreen>
        <Link to={"/"}>
          <div className="logo" />
        </Link>
        <WhiteScreen>
          <div className="authImg" />
          <div className="content">
            <h1 className="title">비밀번호 찾기</h1>
            <h1 className="resultText">
              회원님의 비밀번호는 <br />
              <strong className="result">{location.state.pw}</strong>입니다.
            </h1>
            <div className="btnSet">
              <button
                type="button"
                className={"blueBtn"}
                onClick={() => navigate("/login")}
              >
                <span className="text">로그인</span>
              </button>
              <button
                type="button"
                className={"blueBtn"}
                onClick={() => navigate("/")}
              >
                <span className="text">메인화면으로</span>
              </button>
            </div>
          </div>
        </WhiteScreen>
      </WholeScreen>
    </section>
  );
};
export default FindPWResult;
